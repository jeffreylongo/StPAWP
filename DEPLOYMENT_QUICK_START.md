# 🚀 Quick Start: Deploy to GoDaddy STAGING

## TL;DR - Safe Staging Deployment First!

### 🎯 Deployment Strategy:
```
STEP 1: Deploy to STAGING (this guide)
s9d.607.myftpupload.com → Angular App + WordPress
           ↓
        Test & Verify
           ↓
STEP 2: Deploy to PRODUCTION (after testing)
stpetelodge139.org → Angular App + WordPress
```

### Server Information:
- **STAGING (Deploy Here First):** `s9d.607.myftpupload.com`
- **PRODUCTION (Future):** `stpetelodge139.org` (SSH: `y91.b3b.myftpupload.com`)

---

## ⚡ 5-Minute Overview

### Current Situation:
- ✅ Production WordPress at `stpetelodge139.org`
- ✅ Staging environment at `s9d.607.myftpupload.com`
- ✅ WooCommerce store for merchandise
- ✅ Secretary updates content regularly
- 🎯 Want: Modern Angular frontend + keep WordPress features

### Solution:
**Test on STAGING first, then go live!**
- Deploy Angular + WordPress hybrid to staging
- Test thoroughly with no risk to live site
- Move to production when ready

**Benefits:**
- 🚀 Fast, modern Angular UI
- 📝 Secretary still uses familiar WordPress editor
- 🛍️ WooCommerce store keeps working
- 🔄 No retraining needed
- 📱 Better mobile experience

---

## 🎯 Three Deployment Options

### Option 1: Full Hybrid (RECOMMENDED)
**What:** Angular frontend + WordPress backend in `/wp` subdirectory

**Best For:** You want the modern site NOW

**Pros:** 
- Best performance
- Modern design
- Keep all WordPress features
- Secretary can still edit content

**Cons:**
- Requires moving WordPress files
- 2-3 hours setup time
- Need to test thoroughly

**Guide:** See `GODADDY_DEPLOYMENT_GUIDE.md`

---

### Option 2: Subdomain Testing (SAFEST)
**What:** Test Angular on `new.stpetelodge139.org` before going live

**Best For:** You want to test first, swap later

**Pros:**
- Zero risk to current site
- Test thoroughly
- Easy rollback
- No downtime

**Cons:**
- Temporary second URL
- Need to set up twice

**Quick Steps:**
1. Create subdomain in GoDaddy cPanel
2. Deploy Angular to subdomain
3. Test for 1-2 weeks
4. When ready, follow Option 1 to go live

---

### Option 3: Keep Both Separate (SIMPLEST)
**What:** WordPress stays at main URL, Angular on subdomain permanently

**Best For:** Want to keep it simple

**Pros:**
- Easiest setup
- Current site untouched
- Can link between them

**Cons:**
- Two separate sites to maintain
- Not as seamless for users

---

## 📋 Option 1: Step-by-Step Checklist

### Phase 1: Prepare (30 minutes)
- [ ] **BACKUP EVERYTHING**
  - [ ] Download all WordPress files via FTP
  - [ ] Export database from phpMyAdmin
  - [ ] Save backups somewhere safe!

- [ ] **Get WordPress API Keys**
  - [ ] Log into WordPress Admin
  - [ ] WooCommerce → Settings → Advanced → REST API
  - [ ] Add Key, set to "Read", save Consumer Key & Secret

- [ ] **Update Angular Configuration**
  ```bash
  # Edit: src/environments/environment.prod.ts
  # Add your WooCommerce keys
  ```

### Phase 2: Build Angular (15 minutes)
```bash
# In project directory:
cd /Users/jefflongo/Projects/StPeteLodge139AngularHeadV1

# Use correct Node version
nvm use 18.20.2

# Run build script
./build-for-godaddy.sh

# Output: dist/stpete-lodge139-angular-head-v1/browser/
```

### Phase 3: Move WordPress (30 minutes)
- [ ] **Via GoDaddy cPanel File Manager:**
  1. Log into cPanel
  2. File Manager → public_html/
  3. Create new folder: `wp`
  4. Select ALL WordPress files
  5. Move to `wp/` folder
  6. Verify: No files left in public_html/ except wp/

- [ ] **Update WordPress Database:**
  1. cPanel → phpMyAdmin
  2. Select your database
  3. Click "SQL" tab
  4. Run this query:
  ```sql
  UPDATE wp_options 
  SET option_value = 'https://stpetelodge139.org/wp' 
  WHERE option_name IN ('siteurl', 'home');
  ```

- [ ] **Test WordPress Access:**
  - Visit: `https://stpetelodge139.org/wp/wp-admin`
  - Should load normally

### Phase 4: Upload Angular (30 minutes)
- [ ] **Via FTP (FileZilla recommended):**
  1. Connect to: `ftp.stpetelodge139.org`
  2. Navigate to: `/public_html/`
  3. Upload ALL files from: `dist/stpete-lodge139-angular-head-v1/browser/`
  4. Upload to: `public_html/` (root, NOT in wp folder!)

- [ ] **Upload Configuration:**
  1. Rename `.htaccess.example` to `.htaccess`
  2. Upload to `public_html/.htaccess`

- [ ] **Install WordPress CORS Plugin:**
  1. Create folder: `wp/wp-content/mu-plugins/`
  2. Upload: `wordpress-cors-plugin.php` to that folder

### Phase 5: Test Everything (30 minutes)
- [ ] Visit `https://stpetelodge139.org`
  - Should show Angular homepage
- [ ] Click each menu item
  - About, Calendar, Officers, etc.
- [ ] Test Secretary Office page
  - Should load WordPress content
- [ ] Test Shop
  - Should show products
- [ ] WordPress Admin
  - `https://stpetelodge139.org/wp/wp-admin`
  - Should work normally

### Phase 6: Train Secretary (15 minutes)
Show secretary how to:
- [ ] Log into WordPress (same as before, just add `/wp`)
- [ ] Update Secretary Office content
- [ ] Add/edit shop products
- [ ] Everything else works the same!

---

## 🆘 Common Issues & Fixes

### Issue: "stpetelodge139.org shows old WordPress site"
**Fix:** Files uploaded to wrong location. Should be in `public_html/`, not `public_html/wp/`

### Issue: "Can't access WordPress admin"
**Fix:** 
1. Check database URLs with this query:
```sql
SELECT * FROM wp_options WHERE option_name IN ('siteurl', 'home');
```
2. Should both be: `https://stpetelodge139.org/wp`

### Issue: "Secretary Office page is blank"
**Fix:** 
1. Check CORS plugin installed in: `wp/wp-content/mu-plugins/`
2. Test API: Visit `https://stpetelodge139.org/wp/wp-json/wp/v2/posts`
3. Should show JSON, not error

### Issue: "Shop products don't show"
**Fix:** 
1. Verify WooCommerce API keys in `environment.prod.ts`
2. Test: `https://stpetelodge139.org/wp/wp-json/wc/v3/products`
3. Check keys are for correct user with permissions

### Issue: "Angular routes show 404"
**Fix:** 
1. Check `.htaccess` exists in `public_html/`
2. Verify RewriteEngine is enabled
3. Check .htaccess rules (see `.htaccess.example`)

---

## 📞 Emergency Rollback

If something breaks:

### Quick Rollback:
1. **Delete Angular files** from `public_html/`
   - Keep the `wp/` folder!
2. **Move WordPress back:**
   - Move everything from `wp/` to `public_html/`
3. **Update database:**
```sql
UPDATE wp_options 
SET option_value = 'https://stpetelodge139.org' 
WHERE option_name IN ('siteurl', 'home');
```
4. Site restored!

---

## 💡 Pro Tips

### For Secretary:
- WordPress login is now: `stpetelodge139.org/wp/wp-admin` (just add `/wp`)
- Everything else works exactly the same
- Content updates appear on Angular site automatically

### For You:
- Keep WordPress updated (security!)
- Monitor site performance with Google PageSpeed
- Consider Cloudflare (free CDN) for even faster loading

### For Shop:
Three options for handling store:
1. **Angular Shop** (current) - Shows products, redirects to WP for checkout
2. **Full WordPress Shop** - Link directly to WP shop
3. **Iframe Shop** - Embed WP shop in Angular

Start with #1, change later if needed.

---

## 📊 What Stays the Same vs. Changes

### ✅ Stays the Same:
- WordPress admin access (just add `/wp`)
- WooCommerce store functionality
- Secretary updates content same way
- Product management unchanged
- All plugins work normally
- Database stays the same

### 🆕 Changes:
- Main site URL shows Angular (faster, prettier!)
- WordPress runs from `/wp` subdirectory
- Secretary Office pulls from WordPress API
- Modern, responsive design
- Better mobile experience

---

## 🎓 Training Materials

### For Secretary - Quick Guide:

**Updating Secretary Office Content:**
1. Go to: `stpetelodge139.org/wp/wp-admin`
2. Posts → Find "Last Meeting" or "Next Meeting"
3. Edit the content (same as always!)
4. Click Update
5. Changes appear on main site within seconds! ✨

**Managing Shop:**
1. Same WordPress admin
2. Products → Add/Edit
3. Works exactly like before
4. Changes show on main site automatically

**No coding knowledge needed!**

---

## 📚 Additional Resources

- **Full Guide:** `GODADDY_DEPLOYMENT_GUIDE.md` (detailed, 200+ lines)
- **Build Script:** `./build-for-godaddy.sh` (automated building)
- **Example Config:** `.htaccess.example` (server configuration)
- **CORS Plugin:** `wordpress-cors-plugin.php` (API access)

---

## 🎯 Decision Helper

**Choose Option 1 (Full Hybrid) if:**
- ✅ You're comfortable with technical setup
- ✅ You want best performance
- ✅ You can test thoroughly before going live
- ✅ You have 2-3 hours for setup

**Choose Option 2 (Subdomain First) if:**
- ✅ You want to test thoroughly first
- ✅ You prefer zero-risk approach
- ✅ You can wait 1-2 weeks before going live
- ✅ You want to show others before switching

**Choose Option 3 (Keep Separate) if:**
- ✅ You want simplest setup
- ✅ You're okay with two separate sites
- ✅ You want to minimize changes
- ✅ You need WordPress to stay untouched

**Need help deciding?** Start with Option 2 (Subdomain Testing) - safest path!

---

## ✅ Final Checklist Before Going Live

- [ ] Tested on desktop browser
- [ ] Tested on mobile phone
- [ ] Tested on tablet
- [ ] All links work
- [ ] WordPress admin accessible
- [ ] Secretary can update content
- [ ] Shop shows products
- [ ] Calendar loads events
- [ ] No console errors
- [ ] SSL certificate working (https)
- [ ] Contacted 2-3 lodge members to test
- [ ] Created backup of everything
- [ ] Documented any custom changes

---

## 🎉 You're Ready!

**Estimated Total Time:**
- Option 1 (Full): 2-3 hours
- Option 2 (Subdomain): 1 hour setup + testing time
- Option 3 (Separate): 1 hour

**Difficulty:**
- Option 1: Intermediate
- Option 2: Beginner-Intermediate
- Option 3: Beginner

**Need Help?**
- Check `GODADDY_DEPLOYMENT_GUIDE.md` for detailed steps
- GoDaddy Support: 1-480-505-8877
- Test everything on subdomain first if unsure!

---

**Good luck, Brother! 🏛️**

*St. Petersburg Lodge No. 139 F&AM - Making Good Men Better Since 1894*

---

## 🔑 Quick Command Reference

```bash
# Build for production
./build-for-godaddy.sh

# Or manually:
nvm use 18.20.2
npm install
npm run build

# Output location:
dist/stpete-lodge139-angular-head-v1/browser/

# Upload everything in browser/ folder to GoDaddy public_html/
```

---

**Remember: BACKUP FIRST, TEST THOROUGHLY, DEPLOY CONFIDENTLY!** 🚀

