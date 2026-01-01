# 🧪 STAGING Deployment - Quick Reference

## Server Information

### STAGING (Deploy Here First!)
- **SSH/FTP:** `s9d.607.myftpupload.com`
- **Purpose:** Safe testing environment
- **URL after deployment:** `http://s9d.607.myftpupload.com`

### PRODUCTION (Do NOT Touch Yet!)
- **Domain:** `stpetelodge139.org`
- **SSH:** `y91.b3b.myftpupload.com`
- **Deploy here:** Only after staging is fully tested and approved

---

## ⚡ Quick Build & Deploy

### 1. Update Configuration (One Time Setup)

Edit `src/environments/environment.staging.ts`:
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
    consumerKey: 'YOUR_STAGING_KEY',      // Get from staging WordPress
    consumerSecret: 'YOUR_STAGING_SECRET'  // Get from staging WordPress
  }
};
```

### 2. Build for Staging

```bash
# Navigate to project
cd /Users/jefflongo/Projects/StPeteLodge139AngularHeadV1

# Switch to Node 18
nvm use 18.20.2

# Run the staging build script
./build-for-godaddy.sh

# OR manually:
npm run build:staging
```

### 3. Upload to Staging

**Files to upload:** `dist/stpete-lodge139-angular-head-v1/browser/*`

**Upload to:** `s9d.607.myftpupload.com` public_html/ folder

**Methods:**
- FTP (FileZilla): Connect to `s9d.607.myftpupload.com`
- cPanel File Manager
- SSH/SFTP

### 4. Configure WordPress on Staging

**Move WordPress to /wp subdirectory:**
```bash
# In staging public_html/
mkdir wp
mv [all-wordpress-files] wp/
```

**Update WordPress URLs in database:**
```sql
UPDATE wp_options 
SET option_value = 'http://s9d.607.myftpupload.com/wp' 
WHERE option_name IN ('siteurl', 'home');
```

**Upload CORS plugin:**
- File: `wordpress-cors-plugin.php`
- Location: `wp/wp-content/mu-plugins/`
- Create `mu-plugins` folder if it doesn't exist

### 5. Test Everything

Visit: `http://s9d.607.myftpupload.com`

**Test Checklist:**
- [ ] Homepage loads with Angular
- [ ] All navigation works
- [ ] WordPress admin accessible: `/wp/wp-admin`
- [ ] Secretary Office page shows content
- [ ] Shop displays products
- [ ] Calendar loads events
- [ ] Mobile responsive
- [ ] No console errors

---

## 🔄 Update Workflow

After initial deployment, to update the staging site:

```bash
# 1. Make code changes

# 2. Build for staging
npm run build:staging

# 3. Upload only changed files to staging
# Upload: dist/stpete-lodge139-angular-head-v1/browser/*
# To: s9d.607.myftpupload.com/public_html/

# 4. Test changes
# Visit: http://s9d.607.myftpupload.com
```

---

## 📝 Environment Files Summary

| File | Purpose | When to Use |
|------|---------|-------------|
| `environment.ts` | Local development | `npm start` |
| `environment.staging.ts` | Staging deployment | `npm run build:staging` |
| `environment.prod.ts` | Production (future) | `npm run build:prod` |

---

## 🎯 Moving from Staging to Production

**Only after staging is fully tested:**

1. **Update Production Environment:**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  wordpress: {
    baseUrl: 'https://stpetelodge139.org',
    apiUrl: 'https://stpetelodge139.org/wp/wp-json/wp/v2',
    woocommerceUrl: 'https://stpetelodge139.org/wp/wp-json/wc/v3'
  },
  woocommerce: {
    consumerKey: 'PROD_KEY',
    consumerSecret: 'PROD_SECRET'
  }
};
```

2. **Build for Production:**
```bash
npm run build:prod
```

3. **Deploy to Production:**
- SSH: `y91.b3b.myftpupload.com`
- Follow same steps as staging
- Use HTTPS URLs for production

---

## 🔧 Common Staging Commands

```bash
# Build for staging
npm run build:staging

# Build for production (future)
npm run build:prod

# Run locally with development env
npm start

# Test build locally
npx http-server dist/stpete-lodge139-angular-head-v1/browser
```

---

## 📊 File Locations Reference

### On Your Computer:
```
StPeteLodge139AngularHeadV1/
├── src/environments/
│   ├── environment.ts (development)
│   ├── environment.staging.ts (STAGING)
│   └── environment.prod.ts (production)
├── dist/stpete-lodge139-angular-head-v1/browser/ (build output)
├── build-for-godaddy.sh (build script)
├── wordpress-cors-plugin.php (WP plugin)
└── .htaccess.example (server config)
```

### On Staging Server (s9d.607.myftpupload.com):
```
public_html/
├── index.html (Angular entry)
├── *.js (Angular app files)
├── *.css (Angular styles)
├── assets/ (images, etc.)
├── .htaccess (routing config)
└── wp/ (WordPress subdirectory)
    ├── wp-admin/
    ├── wp-content/
    │   └── mu-plugins/
    │       └── wordpress-cors-plugin.php
    └── wp-config.php
```

---

## 🆘 Quick Troubleshooting

### "Can't connect to staging site"
- Check FTP credentials
- Verify server is `s9d.607.myftpupload.com`
- Try cPanel File Manager instead

### "WordPress shows 404"
- Check database URLs: `SELECT * FROM wp_options WHERE option_name IN ('siteurl', 'home');`
- Should be: `http://s9d.607.myftpupload.com/wp`

### "CORS error in console"
- Verify `wordpress-cors-plugin.php` is uploaded
- Location: `wp/wp-content/mu-plugins/`
- Check plugin has correct staging URL

### "Products don't load"
- Update WooCommerce API keys in `environment.staging.ts`
- Get keys from staging WordPress (not production!)
- Rebuild: `npm run build:staging`

---

## ✅ Pre-Deployment Checklist

Before deploying to staging:

- [ ] Node 18+ installed and active (`nvm use 18.20.2`)
- [ ] Updated `environment.staging.ts` with staging URLs
- [ ] WooCommerce API keys from staging WordPress
- [ ] Built successfully (`npm run build:staging`)
- [ ] No build errors
- [ ] `.htaccess.example` ready to rename
- [ ] `wordpress-cors-plugin.php` ready to upload
- [ ] Staging FTP/SSH credentials available
- [ ] Backup of staging WordPress (just in case)

---

## 📞 Quick Reference

**Build Commands:**
```bash
npm run build:staging    # For staging deployment
npm run build:prod       # For production (future)
./build-for-godaddy.sh   # Automated staging build
```

**Staging URLs:**
- Angular App: `http://s9d.607.myftpupload.com`
- WordPress Admin: `http://s9d.607.myftpupload.com/wp/wp-admin`
- REST API: `http://s9d.607.myftpupload.com/wp/wp-json/wp/v2`

**Production URLs (Future):**
- Angular App: `https://stpetelodge139.org`
- WordPress Admin: `https://stpetelodge139.org/wp/wp-admin`
- REST API: `https://stpetelodge139.org/wp/wp-json/wp/v2`

---

## 🎉 Success Criteria

Staging deployment is successful when:

✅ Can visit `http://s9d.607.myftpupload.com` and see Angular homepage  
✅ All navigation menu items work  
✅ Can access WordPress admin at `/wp/wp-admin`  
✅ Secretary Office page displays WordPress content  
✅ Shop shows WooCommerce products  
✅ Calendar displays events  
✅ No console errors in browser dev tools  
✅ Works on mobile devices  
✅ Secretary can log in and update content  

**When all checks pass → Ready to plan production deployment!**

---

**Need Help?** See `GODADDY_DEPLOYMENT_GUIDE.md` for detailed instructions.

**Ready for Production?** Contact team to schedule production deployment.

---

*St. Petersburg Lodge No. 139 F&AM - Making Good Men Better Since 1894*




