# WordPress API Configuration Fix

## Date: November 30, 2025

## Problem
Trestle Board and other WordPress content was returning 404 errors both locally and in production.

## Root Cause
1. The domain `stpetelodge139.org` now points to the Angular app (Netlify), not WordPress
2. WordPress is hosted separately at `y91.b3b.myftpupload.com` 
3. The environment files were pointing to the wrong URLs
4. WordPress is at the **root** level, NOT in a `/wp/` subdirectory

## Solution
Updated all environment files to use the correct WordPress server URL:

### Correct WordPress URL
```
https://y91.b3b.myftpupload.com/wp-json/wp/v2
```

**Note:** No `/wp/` subdirectory - WordPress is at the root

### Files Updated

1. **`src/environments/environment.ts`** (Development)
   - Was: `https://stpetelodge139.org/wp/wp-json/wp/v2`
   - Now: `https://y91.b3b.myftpupload.com/wp-json/wp/v2`

2. **`src/environments/environment.prod.ts`** (Production)
   - Was: `https://stpetelodge139.org/wp/wp-json/wp/v2`
   - Now: `https://y91.b3b.myftpupload.com/wp-json/wp/v2`

3. **`src/environments/environment.staging.ts`** (Staging)
   - Was: `http://s9d.607.myftpupload.com/wp/wp-json/wp/v2`
   - Now: `https://y91.b3b.myftpupload.com/wp-json/wp/v2`

4. **`src/app/services/wordpress.service.ts`**
   - Fixed to use `environment.wordpress.apiUrl` instead of hardcoded URL
   - Now respects environment configuration

## Verification

### Test Command
```bash
curl -I "https://y91.b3b.myftpupload.com/wp-json/wp/v2/posts?per_page=5"
```

### Expected Result
```
HTTP/2 200
content-type: application/json; charset=UTF-8
x-wp-total: 3
x-wp-totalpages: 1
```

✅ **Working!** Returns 200 with 3 WordPress posts

## Current Setup

### Architecture
```
┌─────────────────────────────────┐
│  stpetelodge139.org (Netlify)   │
│  Angular App (Frontend)         │
└─────────────────────────────────┘
          │
          │ API Calls
          ↓
┌─────────────────────────────────┐
│  y91.b3b.myftpupload.com        │
│  WordPress (Backend/CMS)        │
│  API: /wp-json/wp/v2            │
└─────────────────────────────────┘
```

### Benefits of This Setup
- ✅ Angular app on fast Netlify CDN
- ✅ WordPress on GoDaddy (familiar hosting)
- ✅ Clean separation of frontend/backend
- ✅ No CORS issues (handled by WordPress)
- ✅ Secretary can still edit WordPress content

## WordPress Admin Access
- **URL:** `https://y91.b3b.myftpupload.com/wp-admin`
- Secretary can log in and manage content as usual

## Next Steps (Future)
If you want to use a cleaner URL for WordPress:
1. Set up a subdomain like `wp.stpetelodge139.org` or `cms.stpetelodge139.org`
2. Point it to `y91.b3b.myftpupload.com`
3. Update environment files to use the subdomain
4. Benefit: Cleaner URLs, easier to remember

## Testing Checklist
- [x] Local dev server works (`ng serve`)
- [x] Production build succeeds
- [x] WordPress API accessible
- [x] Returns actual WordPress posts
- [x] All environments configured correctly

## Status
✅ **READY TO DEPLOY**

WordPress integration is now properly configured and working on:
- Local development
- Staging build
- Production build

