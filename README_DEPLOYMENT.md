# 📚 Deployment Documentation Overview

## Quick Navigation

This project includes comprehensive deployment documentation for deploying your Angular + WordPress hybrid site.

---

## 📄 Documentation Files

### 🎯 Start Here: STAGING_DEPLOYMENT.md
**For:** Quick staging deployment (recommended first step)
- Server info and credentials
- Quick build commands
- Step-by-step staging deployment
- Testing checklist

**Use when:** You want to deploy to staging (`s9d.607.myftpupload.com`) first

---

### 📖 GODADDY_DEPLOYMENT_GUIDE.md
**For:** Complete deployment documentation
- Detailed architecture explanation
- Full step-by-step instructions
- WordPress configuration
- Security setup
- Troubleshooting guide

**Use when:** You need detailed explanations or encounter issues

---

### ⚡ DEPLOYMENT_QUICK_START.md
**For:** Fast overview and decision-making
- Deployment strategy comparison
- Quick checklists
- Common issues and fixes
- Emergency rollback procedures

**Use when:** You need a quick reference or overview

---

## 🚀 Quick Start Path

### For First-Time Deployment:

1. **Read:** `STAGING_DEPLOYMENT.md` (5 minutes)
2. **Configure:** Update `src/environments/environment.staging.ts`
3. **Build:** Run `./build-for-godaddy.sh`
4. **Deploy:** Upload to staging server
5. **Test:** Verify everything works on staging
6. **Production:** When ready, use production environment

---

## 🏗️ Server Information

### Staging (Deploy Here First!)
- **Host:** `s9d.607.myftpupload.com`
- **Environment File:** `environment.staging.ts`
- **Build Command:** `npm run build:staging`
- **Purpose:** Safe testing before going live

### Production (Future)
- **Domain:** `stpetelodge139.org`
- **SSH:** `y91.b3b.myftpupload.com`
- **Environment File:** `environment.prod.ts`
- **Build Command:** `npm run build:prod`
- **Deploy:** Only after staging is tested and approved

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `src/environments/environment.ts` | Local development (default) |
| `src/environments/environment.staging.ts` | **Staging deployment** |
| `src/environments/environment.prod.ts` | Production deployment (future) |
| `.htaccess.example` | Server routing configuration |
| `wordpress-cors-plugin.php` | WordPress API access plugin |
| `build-for-godaddy.sh` | Automated staging build script |

---

## 📋 Essential Build Commands

```bash
# Staging deployment (recommended first!)
npm run build:staging

# Production deployment (after staging testing)
npm run build:prod

# Development (local testing)
npm start

# Automated staging build with instructions
./build-for-godaddy.sh
```

---

## ✅ Deployment Checklist

### Before You Start:
- [ ] Read `STAGING_DEPLOYMENT.md`
- [ ] Have staging FTP/SSH credentials
- [ ] Node.js 18+ installed (`nvm use 18.20.2`)
- [ ] Project dependencies installed (`npm install`)

### Configuration:
- [ ] Updated `environment.staging.ts` with staging URLs
- [ ] WordPress admin access to staging
- [ ] WooCommerce API keys from staging WordPress

### Build & Deploy:
- [ ] Run `./build-for-godaddy.sh` successfully
- [ ] Upload files to staging server
- [ ] Configure WordPress on staging
- [ ] Install CORS plugin
- [ ] Upload `.htaccess`

### Testing:
- [ ] Staging site loads
- [ ] All pages work
- [ ] WordPress admin accessible
- [ ] Shop displays products
- [ ] Secretary Office shows content
- [ ] No console errors

### Ready for Production:
- [ ] All staging tests pass
- [ ] Team approval received
- [ ] Update `environment.prod.ts`
- [ ] Build for production
- [ ] Schedule deployment window

---

## 🎯 Deployment Strategy

### Recommended Path:

```
┌─────────────────────────────────────────────┐
│  1. Local Development                       │
│     npm start (localhost:4200)              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  2. Deploy to STAGING                       │
│     s9d.607.myftpupload.com                 │
│     npm run build:staging                   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  3. Test on Staging                         │
│     Verify all features work                │
│     Get team/secretary approval             │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  4. Deploy to PRODUCTION                    │
│     stpetelodge139.org                      │
│     npm run build:prod                      │
└─────────────────────────────────────────────┘
```

---

## 🆘 Need Help?

### Quick Issues:
- **Can't build?** Check Node version: `node -v` (need 18+)
- **Can't connect to server?** Verify SSH/FTP credentials
- **CORS errors?** Check `wordpress-cors-plugin.php` is uploaded
- **404 errors?** Verify `.htaccess` configuration

### Detailed Help:
1. Check `STAGING_DEPLOYMENT.md` troubleshooting section
2. Review `GODADDY_DEPLOYMENT_GUIDE.md` for detailed steps
3. Check browser console for specific errors
4. Verify WordPress REST API: `[your-url]/wp/wp-json/wp/v2`

---

## 📦 What Gets Deployed

### Angular Files (to public_html/):
- `index.html` - Main entry point
- `*.js` - Compiled JavaScript
- `*.css` - Compiled styles
- `assets/` - Images, fonts, etc.
- `.htaccess` - Server routing rules

### WordPress (to public_html/wp/):
- All existing WordPress files
- `wp-content/mu-plugins/wordpress-cors-plugin.php` (new)
- Updated `wp-config.php` (URLs changed)

---

## 🔐 Security Notes

### For Staging:
- Uses HTTP (fine for testing)
- WooCommerce API keys should be staging-specific
- Don't use production credentials

### For Production:
- Must use HTTPS (SSL certificate)
- Separate WooCommerce API keys
- Strong WordPress passwords
- Keep WordPress and plugins updated

---

## 📱 Environment Variables Quick Reference

### Staging (`environment.staging.ts`):
```typescript
baseUrl: 'http://s9d.607.myftpupload.com'
apiUrl: 'http://s9d.607.myftpupload.com/wp/wp-json/wp/v2'
```

### Production (`environment.prod.ts`):
```typescript
baseUrl: 'https://stpetelodge139.org'
apiUrl: 'https://stpetelodge139.org/wp/wp-json/wp/v2'
```

---

## 🎓 For Your Secretary

After deployment, show your secretary:

1. **WordPress Login:**
   - Staging: `http://s9d.607.myftpupload.com/wp/wp-admin`
   - Production: `https://stpetelodge139.org/wp/wp-admin`

2. **Everything else works the same!**
   - Update posts and pages as usual
   - Manage products in WooCommerce
   - Changes appear on main site automatically

3. **No coding knowledge needed**
   - Just use WordPress as normal
   - Angular frontend fetches content automatically

---

## 📊 Success Metrics

### Staging is successful when:
✅ Site loads at staging URL  
✅ All navigation works  
✅ WordPress admin accessible  
✅ Content displays correctly  
✅ Shop shows products  
✅ Mobile responsive  
✅ No console errors  
✅ Secretary can update content  

### Ready for production when:
✅ All staging tests pass  
✅ Team has reviewed and approved  
✅ Secretary has tested content updates  
✅ Performance is acceptable  
✅ All features work as expected  

---

## 🚦 Current Status

- [x] Angular application built
- [x] WordPress integration configured
- [x] Staging environment files created
- [x] Build scripts ready
- [x] Documentation complete
- [ ] **Next:** Deploy to staging
- [ ] Test on staging
- [ ] Deploy to production

---

## 📞 Support Resources

### Documentation:
- `STAGING_DEPLOYMENT.md` - Staging deployment
- `GODADDY_DEPLOYMENT_GUIDE.md` - Complete guide
- `DEPLOYMENT_QUICK_START.md` - Quick reference
- `README.md` - Project overview
- `MIGRATION_COMPLETE.md` - Migration details

### External Resources:
- Angular Docs: https://angular.io
- WordPress REST API: https://developer.wordpress.org/rest-api
- WooCommerce API: https://woocommerce.github.io/woocommerce-rest-api-docs

---

## 🎯 Next Steps

1. **Immediate:**
   - [ ] Review `STAGING_DEPLOYMENT.md`
   - [ ] Update `environment.staging.ts` with your API keys
   - [ ] Run `./build-for-godaddy.sh`

2. **This Week:**
   - [ ] Deploy to staging
   - [ ] Test thoroughly
   - [ ] Show secretary how to update content

3. **After Staging Success:**
   - [ ] Get team approval
   - [ ] Plan production deployment
   - [ ] Update production environment
   - [ ] Deploy to live site

---

## 💡 Pro Tips

1. **Always test on staging first** - No exceptions!
2. **Backup before deploying** - WordPress files and database
3. **Use version control** - Commit before major changes
4. **Document custom changes** - For future reference
5. **Keep WordPress updated** - Security is important
6. **Monitor after deployment** - Check for errors first few days

---

## 🎉 You're Ready!

You have everything you need to deploy:
- ✅ Staging environment configured
- ✅ Build scripts ready
- ✅ Comprehensive documentation
- ✅ Testing checklists
- ✅ Troubleshooting guides

**Start with `STAGING_DEPLOYMENT.md` and follow the steps!**

---

*St. Petersburg Lodge No. 139 F&AM - Making Good Men Better Since 1894*

**Questions?** Review the deployment guides or reach out for support.



