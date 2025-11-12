# GoDaddy STAGING Deployment Guide
## St. Petersburg Lodge No. 139 - Hybrid Angular + WordPress Setup

This guide will help you deploy your Angular application to **GoDaddy STAGING** environment for testing before going live on the production site.

## 🎯 Staging vs Production

**STAGING SITE (Testing):**
- SSH: `s9d.607.myftpupload.com`
- Purpose: Test Angular + WordPress integration safely
- Safe to experiment, no impact on live site

**PRODUCTION SITE (Live - DO NOT USE YET):**
- Domain: `stpetelodge139.org`
- SSH: `y91.b3b.myftpupload.com`
- Deploy here ONLY after staging is tested and approved

**This guide focuses on STAGING deployment first!**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│     stpetelodge139.org (Main Site)      │
│         Angular Application              │
│  (Fast, Modern UI - Built with Angular) │
└─────────────────────────────────────────┘
                    ↓
        ┌───────────┴──────────┐
        │                      │
┌───────▼────────┐    ┌────────▼────────┐
│   WordPress    │    │  WooCommerce    │
│  (REST API)    │    │    (Store)      │
│ Content Backend│    │  Full Shopping  │
└────────────────┘    └─────────────────┘
```

**URL Structure (STAGING):**
- `http://s9d.607.myftpupload.com` → Angular App (Homepage, About, Calendar, etc.)
- `http://s9d.607.myftpupload.com/wp-admin` → WordPress Admin (Content Management)
- `http://s9d.607.myftpupload.com/shop` → Option A: Angular Shop OR Option B: WordPress WooCommerce

**URL Structure (PRODUCTION - Future):**
- `https://stpetelodge139.org` → Angular App (after staging testing)
- `https://stpetelodge139.org/wp-admin` → WordPress Admin
- `https://stpetelodge139.org/shop` → Shop integration

---

## 🎯 Two Deployment Strategies

### **Strategy 1: Angular Primary + WordPress as Backend (RECOMMENDED)**
- Angular handles all front-end pages
- WordPress runs in `/wp` subdirectory
- Secretary Office pulls content via WordPress REST API
- Shop can be Angular (light) or iframe to WooCommerce (full features)

### **Strategy 2: WordPress Primary with Angular Sections**
- Keep WordPress as main site
- Replace homepage with Angular
- Use Angular for specific pages
- Less ideal but easier initial transition

**We'll focus on Strategy 1 (Recommended)**

---

## 📝 Prerequisites

Before starting, ensure you have:

1. ✅ **GoDaddy Staging Access**:
   - SSH: `s9d.607.myftpupload.com`
   - cPanel access
   - FTP/SFTP credentials
   - MySQL database access

2. ✅ **Production Site Info** (for future reference):
   - Domain: `stpetelodge139.org`
   - SSH: `y91.b3b.myftpupload.com`
   - Keep this untouched until staging is approved!

3. ✅ **WordPress Site**:
   - Current WordPress site accessible
   - Admin credentials
   - WooCommerce store setup
   - Database backup (CRITICAL - backup first!)

4. ✅ **Local Development**:
   - This Angular project built and tested
   - Node.js 18+ installed locally

---

## 🚀 Step-by-Step Deployment

### Phase 1: Prepare WordPress for Headless Mode

#### 1.1 Backup Your WordPress Site
```bash
# From cPanel or via FTP, download:
# - All WordPress files
# - Database export (phpMyAdmin)
```

#### 1.2 Move WordPress to Subdirectory

**Option A: Via cPanel File Manager**
1. Log into GoDaddy cPanel
2. Go to File Manager
3. Navigate to `public_html`
4. Create new folder: `wp`
5. Move ALL WordPress files into `wp/` folder
6. **IMPORTANT**: Update WordPress URLs (next step)

**Option B: Via SSH** (if available)
```bash
cd ~/public_html
mkdir wp
mv * wp/  # Move all files to wp folder
# Note: Hidden files (.htaccess) need special handling
```

#### 1.3 Update WordPress Site URLs (STAGING)
1. Access your staging database via phpMyAdmin
2. Run this SQL query for STAGING:

```sql
UPDATE wp_options 
SET option_value = 'http://s9d.607.myftpupload.com/wp' 
WHERE option_name IN ('siteurl', 'home');
```

3. Update `wp/wp-config.php` to include:
```php
define('WP_SITEURL', 'http://s9d.607.myftpupload.com/wp');
define('WP_HOME', 'http://s9d.607.myftpupload.com/wp');
```

4. Test access: Visit `http://s9d.607.myftpupload.com/wp/wp-admin`

**Note:** Using HTTP (not HTTPS) for staging is fine. Production will use HTTPS.

#### 1.4 Enable WordPress REST API

Install and configure CORS headers in WordPress:

**Create/Edit** `wp/wp-content/mu-plugins/cors-headers.php`:
```php
<?php
/**
 * Plugin Name: CORS Headers for Angular
 * Description: Enable CORS for Angular frontend
 */

add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        // STAGING: Allow from staging domain
        header('Access-Control-Allow-Origin: http://s9d.607.myftpupload.com');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        return $value;
    });
}, 15);
```

#### 1.5 Create WordPress Application Password

For secure API access:
1. Log into WordPress Admin: `http://s9d.607.myftpupload.com/wp/wp-admin` (STAGING)
2. Go to Users → Your Profile
3. Scroll to "Application Passwords"
4. Name: "Angular Frontend - Staging"
5. Click "Add New Application Password"
6. **SAVE THIS PASSWORD** - you'll need it for Angular configuration

---

### Phase 2: Configure Angular Application

#### 2.1 Update Environment Configuration (STAGING)

Edit `src/environments/environment.staging.ts` (already created):

```typescript
export const environment = {
  production: false,
  staging: true,
  wordpress: {
    baseUrl: 'http://s9d.607.myftpupload.com',
    apiUrl: 'http://s9d.607.myftpupload.com/wp/wp-json/wp/v2',
    woocommerceUrl: 'http://s9d.607.myftpupload.com/wp/wp-json/wc/v3'
  },
  woocommerce: {
    consumerKey: 'ck_your_key_from_staging_wordpress',
    consumerSecret: 'cs_your_secret_from_staging_wordpress'
  }
};
```

**Important:** Use staging WordPress to generate API keys!

#### 2.2 Get WooCommerce API Keys

1. WordPress Admin → WooCommerce → Settings → Advanced → REST API
2. Click "Add Key"
3. Description: "Angular Frontend"
4. User: Select admin user
5. Permissions: Read
6. Generate API Key
7. **SAVE** Consumer Key and Consumer Secret

#### 2.3 Build Angular for Staging

```bash
# Navigate to project directory
cd /Users/jefflongo/Projects/StPeteLodge139AngularHeadV1

# Ensure you're using Node 18+
nvm use 18.20.2

# Build for STAGING (uses environment.staging.ts)
ng build --configuration=staging

# OR build for production (for future use)
# npm run build

# Output will be in: dist/stpete-lodge139-angular-head-v1/browser/
```

**Note:** We'll add the staging configuration to angular.json next.

---

### Phase 3: Upload Angular to GoDaddy

#### 3.1 Prepare Files for Upload

After building, you'll have files in `dist/stpete-lodge139-angular-head-v1/browser/`

#### 3.2 Upload via FTP (Easiest Method)

1. **Get FTP Credentials** from GoDaddy cPanel
2. **Use FTP Client** (FileZilla recommended):
   - Host: ftp.stpetelodge139.org
   - Username: Your GoDaddy FTP username
   - Password: Your FTP password
   - Port: 21

3. **Upload Files**:
   - Connect to FTP
   - Navigate to `public_html/`
   - Upload ALL files from `dist/stpete-lodge139-angular-head-v1/browser/` to `public_html/`
   - **DO NOT DELETE** the `wp/` folder!

#### 3.3 Upload via cPanel File Manager (Alternative)

1. Open cPanel → File Manager
2. Navigate to `public_html/`
3. Upload ZIP of build files
4. Extract in place
5. Move extracted files to root if needed

---

### Phase 4: Configure Server (Critical!)

#### 4.1 Create .htaccess for Angular Routing

Angular uses client-side routing. Create `.htaccess` in `public_html/`:

```apache
# Angular Routing Configuration
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Don't rewrite WordPress admin or API
  RewriteRule ^wp/ - [L]
  RewriteRule ^wp-admin/ - [L]
  RewriteRule ^wp-json/ - [L]
  RewriteRule ^wp-includes/ - [L]
  RewriteRule ^wp-content/ - [L]
  
  # Don't rewrite files or directories that exist
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Rewrite everything else to Angular index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

#### 4.2 Verify WordPress .htaccess

Ensure `wp/.htaccess` has WordPress rules:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /wp/
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /wp/index.php [L]
</IfModule>
# END WordPress
```

---

### Phase 5: Handle WooCommerce Shop

You have **three options** for the shop:

#### **Option A: Use Angular Shop Component (Light Integration)**
- Your Angular app displays products via WooCommerce API
- Checkout redirects to WordPress WooCommerce cart
- Best for: Simple product display

**Implementation:**
1. Angular Shop component (already built) displays products
2. "View Cart" button goes to: `https://stpetelodge139.org/wp/cart`
3. Checkout happens on WordPress

**Update shop component:**
```typescript
// In shop.component.ts
viewCart() {
  window.location.href = 'https://stpetelodge139.org/wp/cart';
}
```

#### **Option B: Iframe WordPress Shop (Full Features)**
- Embed WordPress shop page in Angular
- Maintains all WooCommerce functionality
- Best for: Complex store with reviews, wishlists, etc.

**Implementation:**
```typescript
// shop.component.ts
template: `
  <iframe 
    src="https://stpetelodge139.org/wp/shop"
    style="width: 100%; min-height: 800px; border: none;"
    (load)="onIframeLoad()">
  </iframe>
`
```

#### **Option C: Direct Link to WordPress Shop (Easiest)**
- Shop menu item links directly to WordPress
- User leaves Angular temporarily for shopping
- Best for: Quickest implementation

**Implementation:**
Update navigation:
```html
<!-- In navbar component -->
<a href="https://stpetelodge139.org/wp/shop" target="_blank">
  Shop
</a>
```

**Recommendation**: Start with **Option A**, transition to **Option B** if needed.

---

### Phase 6: Secretary Office Content

Your secretary office page already uses WordPress REST API! Just ensure:

#### 6.1 WordPress Content Structure

Create/maintain these pages/posts in WordPress:
- Category: "Secretary Updates"
- Pages with IDs for last meeting, next meeting
- Custom fields for birthdays, anniversaries

#### 6.2 Verify API Access

Test these URLs after deployment:
```
https://stpetelodge139.org/wp/wp-json/wp/v2/posts
https://stpetelodge139.org/wp/wp-json/wp/v2/pages
```

Should return JSON data.

---

### Phase 7: Testing & Verification

#### 7.1 Test Checklist

- [ ] Homepage loads at `stpetelodge139.org`
- [ ] All Angular routes work (About, Calendar, Officers, etc.)
- [ ] WordPress admin accessible at `stpetelodge139.org/wp/wp-admin`
- [ ] Secretary Office displays WordPress content
- [ ] Shop displays products
- [ ] Calendar events load
- [ ] SSL certificate active (https)
- [ ] Mobile responsive
- [ ] No console errors

#### 7.2 Common Issues & Fixes

**Issue**: Angular routes show 404
**Fix**: Check `.htaccess` rewrite rules

**Issue**: CORS errors accessing WordPress
**Fix**: Verify CORS plugin installed and configured

**Issue**: Shop products don't load
**Fix**: Check WooCommerce API keys in environment.prod.ts

**Issue**: WordPress redirects to old URL
**Fix**: Update database URLs and wp-config.php

---

## 🔄 Content Update Workflow

After deployment, your secretary can update content easily:

### For Secretary Office Updates:
1. Log into WordPress: `stpetelodge139.org/wp/wp-admin`
2. Posts → Add New
3. Write meeting notes
4. Publish
5. Angular site automatically fetches new content!

### For Shop Products:
1. WordPress Admin → Products
2. Add/edit products as normal
3. Angular shop displays changes immediately

### For Calendar Events:
1. Update Google Calendar (ICS source)
2. Events sync to Angular automatically

---

## 🎨 Alternative: Subdomain Strategy

If the above seems complex, consider:

**Structure:**
- `https://stpetelodge139.org` → Keep current WordPress
- `https://new.stpetelodge139.org` → New Angular site
- Test thoroughly, then swap when ready

**Advantages:**
- Zero downtime
- Safe testing
- Easy rollback
- Gradual migration

**Implementation:**
1. Create subdomain in GoDaddy cPanel
2. Deploy Angular to subdomain
3. Test extensively
4. When ready, swap DNS or redirect

---

## 📱 Mobile & Performance

Your Angular app includes:
- ✅ Responsive Tailwind CSS
- ✅ Lazy loading routes
- ✅ Optimized images
- ✅ PWA ready (can add service worker)

### Enable PWA (Optional):
```bash
ng add @angular/pwa
npm run build
```

---

## 🔐 Security Considerations

1. **WordPress Security**:
   - Keep WordPress updated
   - Use strong passwords
   - Install Wordfence or similar
   - Disable file editing in wp-config.php:
     ```php
     define('DISALLOW_FILE_EDIT', true);
     ```

2. **API Security**:
   - Use Application Passwords (not main password)
   - Restrict WooCommerce API to Read-only
   - Enable SSL (HTTPS) everywhere

3. **Environment Variables**:
   - Never commit API keys to Git
   - Use environment.prod.ts for production
   - Consider using GoDaddy environment variables

---

## 📞 Support & Next Steps

### GoDaddy Support:
- **Hosting Support**: 1-480-505-8877
- **Help**: support.godaddy.com
- **SSH Access**: May need to request

### Development Questions:
- Check MIGRATION_COMPLETE.md
- Review README.md
- Angular Docs: angular.io

---

## 🎯 Quick Start Commands

```bash
# 1. Update Node version
nvm use 18.20.2

# 2. Install dependencies
npm install

# 3. Update production environment
# Edit: src/environments/environment.prod.ts

# 4. Build for production
npm run build

# 5. Upload dist/stpete-lodge139-angular-head-v1/browser/* to GoDaddy
# Use FTP or cPanel File Manager

# 6. Create .htaccess (see Phase 4.1)

# 7. Test site!
```

---

## ✅ Deployment Checklist

### Pre-Deployment:
- [ ] Backup WordPress (files + database)
- [ ] Test Angular locally: `npm start`
- [ ] Update environment.prod.ts with real URLs
- [ ] Build production: `npm run build`
- [ ] Test build locally: `npx http-server dist/stpete-lodge139-angular-head-v1/browser`

### During Deployment:
- [ ] Move WordPress to `/wp` subdirectory
- [ ] Update WordPress URLs in database
- [ ] Enable WordPress REST API CORS
- [ ] Upload Angular build to `public_html/`
- [ ] Create proper `.htaccess`
- [ ] Test all routes

### Post-Deployment:
- [ ] Verify homepage loads
- [ ] Check all menu items work
- [ ] Test WordPress admin access
- [ ] Verify secretary office content loads
- [ ] Test shop/products display
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Monitor console for errors

---

## 🆘 Emergency Rollback

If something goes wrong:

1. **Via cPanel**:
   - Delete Angular files from `public_html/`
   - Move WordPress files from `wp/` back to `public_html/`
   - Restore database from backup

2. **Quick Fix**:
   - Rename `wp/` to something else
   - Upload WordPress backup to `public_html/`
   - Restore database

---

## 📊 Performance Optimization

After deployment:

1. **Enable Caching**:
   - GoDaddy cPanel → Managed WordPress (if available)
   - Install W3 Total Cache for WordPress

2. **CDN** (Optional):
   - Cloudflare (free tier)
   - Improves global load times

3. **Image Optimization**:
   - WordPress: Install Smush plugin
   - Angular: Already optimized in build

---

## 🎓 Training Your Secretary

The secretary can update content without touching code:

**Secretary Office Content**:
1. Go to WordPress admin
2. Edit the "Last Meeting" or "Next Meeting" post
3. Save changes
4. Angular automatically shows updates

**Shop Products**:
1. WordPress → Products
2. Add/Edit as normal
3. Changes reflect immediately

**No code knowledge needed!**

---

## 📧 Contact

For questions about this deployment:
- Check Angular docs: angular.io
- Check WordPress REST API: developer.wordpress.org/rest-api
- GoDaddy support for hosting questions

---

**Good luck with your deployment! 🚀**

*St. Petersburg Lodge No. 139 F&AM - Making Good Men Better Since 1894*

