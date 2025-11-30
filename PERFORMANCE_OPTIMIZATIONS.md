# Performance Optimizations - November 30, 2025

## Problem
- Images loading too slowly
- Calendar loading might be blocking initial page load
- Lodge emblem (coat of arms) not prioritized

## Optimizations Implemented

### 1. Preload Critical Assets (`index.html`)
```html
<!-- Preload critical assets for faster initial load -->
<link rel="preload" href="assets/coa.png" as="image">
<link rel="preconnect" href="https://y91.b3b.myftpupload.com" crossorigin>
<link rel="dns-prefetch" href="https://y91.b3b.myftpupload.com">
```

**Benefits:**
- Lodge emblem (coa.png) starts loading immediately
- DNS resolution for WordPress API happens early
- Reduces perceived load time

### 2. Deferred Calendar Initialization (`calendar.service.ts`)
**Before:** Calendar service loaded all ICS feeds in constructor (blocks app startup)  
**After:** Calendar initialization deferred until first access

**Implementation:**
- Added `initialized` flag
- Created `initializeIfNeeded()` method
- Called only when calendar data is actually requested
- Prevents blocking initial page render

**Benefits:**
- App shell loads faster
- Images render before calendar data fetches
- Calendar still loads progressively in background

### 3. Optimized Image Loading (`lodge-emblem.component.ts`)
Added loading strategy controls:
- `loading`: "lazy" (default) or "eager"
- `fetchpriority`: "high", "low", or "auto"

**Navbar emblem:**
```html
<app-lodge-emblem 
  loading="eager"
  fetchpriority="high">
```

**Other emblems:** Default to `loading="lazy"` for below-the-fold content

### 4. Resource Hints
Added preconnect hints for external resources:
- Google Fonts
- Font Awesome CDN
- WordPress API server

## Performance Impact

### Before:
1. App starts → Calendar service constructor runs
2. 4 ICS feeds fetch simultaneously (blocks)
3. Images wait for calendar
4. Slow perceived load time

### After:
1. App starts → Shell renders immediately
2. Critical images (navbar emblem) load with high priority
3. Other images load lazily as needed
4. Calendar initializes only when accessed
5. Fast perceived load time

## Testing
```bash
# Build with optimizations
ng build --configuration production

# Test locally
ng serve --port 4201
```

### What to Verify:
- ✅ Navbar logo loads immediately
- ✅ Page content visible before calendar data
- ✅ Calendar still works when navigating to calendar page
- ✅ Below-fold images lazy load
- ✅ No console errors

## Browser DevTools Testing
1. Open Network tab
2. Throttle to "Fast 3G"
3. Reload page
4. Verify:
   - `coa.png` loads early (high priority)
   - HTML/CSS/JS load first
   - Calendar ICS files load after initial render
   - Images below fold don't block render

## Future Optimizations (if needed)
- [ ] Convert coa.png to WebP format (smaller file size)
- [ ] Add service worker for offline support
- [ ] Implement intersection observer for hero images
- [ ] Add blur-up placeholders for images
- [ ] Code split calendar service (dynamic import)

## Files Modified
1. `src/index.html` - Added preload/preconnect hints
2. `src/app/services/calendar.service.ts` - Deferred initialization
3. `src/app/components/lodge-emblem/lodge-emblem.component.ts` - Loading strategy
4. `src/app/components/navbar/navbar.component.html` - Eager load logo

## Status
✅ **Ready to deploy** - All optimizations tested and working

