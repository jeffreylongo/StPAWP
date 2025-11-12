# 🔧 Trestle Board WordPress Integration - Technical Documentation

## Overview
The Trestle Board page now dynamically pulls content from WordPress posts via the WordPress REST API. Secretary can update content by simply creating/editing WordPress posts - no coding required.

---

## What Was Implemented

### 1. WordPress Service Updates
**File:** `src/app/services/wordpress.service.ts`

Added two new methods:
- `getTrestleBoardPosts()` - Fetches multiple posts (for archive)
- `getCurrentTrestleBoard()` - Fetches the most recent post (for featured section)

```typescript
getTrestleBoardPosts(params?: { per_page?: number }): Observable<WordPressPost[]>
getCurrentTrestleBoard(): Observable<WordPressPost | null>
```

### 2. Trestle Board Component Updates
**File:** `src/app/pages/trestle-board/trestle-board.component.ts`

**New Properties:**
- `currentNewsletter: WordPressPost | null` - Stores the latest post
- `newsletters: WordPressPost[]` - Stores archived posts
- `loading: boolean` - Loading state
- `error: string | null` - Error handling

**New Methods:**
- `loadTrestleBoardContent()` - Fetches data from WordPress
- `getPostExcerpt()` - Extracts plain text from HTML
- `getPostMonth()` - Formats post date to month name
- `getPostYear()` - Extracts year from post date
- `downloadNewsletter()` - Opens WordPress post in new tab

### 3. Template Updates
**File:** `src/app/pages/trestle-board/trestle-board.component.html`

**Added States:**
- Loading spinner while fetching data
- Error message with retry button
- Content display when WordPress posts exist
- "Coming Soon" fallback when no posts exist
- Archive section with dynamic WordPress posts

**Features:**
- Displays full WordPress post content using `[innerHTML]`
- Shows post title, date, and formatted content
- Archive cards with excerpt and "Read More" button
- Responsive grid layout for archive

---

## How It Works

### Data Flow:
```
WordPress Post (Secretary creates)
          ↓
WordPress REST API
          ↓
WordPressService (Angular)
          ↓
TrestleBoardComponent
          ↓
HTML Template (User sees)
```

### When Page Loads:
1. Component calls `loadTrestleBoardContent()`
2. Two API calls are made:
   - `getCurrentTrestleBoard()` - Gets latest post for featured section
   - `getTrestleBoardPosts({ per_page: 10 })` - Gets 10 most recent posts for archive
3. Data is processed and displayed
4. Archive skips the first post (since it's already featured)

---

## WordPress Setup Requirements

### What Secretary Needs to Do:
1. **Log into WordPress:** `https://stpetelodge139.org/wp/wp-admin`
2. **Create Posts:** Navigate to Posts → Add New
3. **Write Content:** Use the WordPress editor (like Microsoft Word)
4. **Publish:** Click the "Publish" button

### Optional Enhancements (For You):

#### Option A: Create a Custom Category
1. In WordPress: Posts → Categories
2. Create category: "Trestle Board"
3. Update Angular service to filter by category:
```typescript
httpParams = httpParams.set('categories', 'CATEGORY_ID_HERE');
```

#### Option B: Use Custom Post Type
1. Install plugin: "Custom Post Type UI"
2. Create custom post type: "newsletters"
3. Update service endpoints from `/posts` to `/newsletters`

#### Option C: Use Tags
1. Secretary tags posts with "trestle-board"
2. Update service to filter by tag:
```typescript
httpParams = httpParams.set('tags', 'TAG_ID_HERE');
```

**Current Setup:** Uses all posts (simplest for secretary)

---

## API Endpoints Used

### Get Latest Post
```
GET https://stpetelodge139.org/wp-json/wp/v2/posts?per_page=1&orderby=date&order=desc
```

### Get Archive Posts
```
GET https://stpetelodge139.org/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc
```

### Response Format (WordPress Post Object)
```json
{
  "id": 123,
  "date": "2025-11-01T00:00:00",
  "title": {
    "rendered": "November 2025 Trestle Board"
  },
  "content": {
    "rendered": "<p>Full HTML content here...</p>"
  },
  "excerpt": {
    "rendered": "<p>Excerpt text...</p>"
  },
  "link": "https://stpetelodge139.org/wp/november-2025-trestle-board"
}
```

---

## Configuration Files

### Environment Configuration
**File:** `src/environments/environment.ts`
```typescript
wordpress: {
  baseUrl: 'https://stpetelodge139.org',
  apiUrl: 'https://stpetelodge139.org/wp-json/wp/v2'
}
```

### Production Environment
**File:** `src/environments/environment.prod.ts`
Same configuration (already set up)

---

## CORS Setup (Already Configured)

The WordPress REST API requires CORS headers. This should already be set up via:
- CORS plugin in WordPress
- `.htaccess` configuration

**If you encounter CORS issues:**
1. Verify CORS plugin is active in WordPress
2. Check `.htaccess` in WordPress root includes:
```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
```

---

## Testing

### Test the Implementation:

1. **Test with No Posts:**
   - Visit Trestle Board page
   - Should show "Coming Soon" button
   - Archive should show "No archived newsletters available"

2. **Create First Post in WordPress:**
   - Log into WordPress
   - Create a post titled "November 2025 Trestle Board"
   - Add some test content
   - Publish
   - Refresh Trestle Board page
   - Should show the content in featured section

3. **Create Second Post:**
   - Create another post with different date
   - Publish
   - Refresh Trestle Board page
   - Newest post shows in featured section
   - Previous post shows in archive

4. **Test Archive:**
   - Create 3-4 more posts
   - Archive should show cards in grid layout
   - Click "Read More" should open WordPress post

---

## Customization Options

### Change Number of Archive Posts:
**File:** `trestle-board.component.ts` (line 53)
```typescript
this.wordpressService.getTrestleBoardPosts({ per_page: 20 }) // Change from 10 to 20
```

### Filter by Category:
**File:** `wordpress.service.ts` (in `getTrestleBoardPosts` method)
```typescript
httpParams = httpParams.set('categories', '5'); // Replace 5 with your category ID
```

### Change Button Text:
**File:** `trestle-board.component.html`
```html
<!-- Line 57: Change "View Full Post" to whatever you want -->
<button>View Full Post</button>
```

### Style the Content:
**File:** `trestle-board.component.css`
```css
/* Add custom styles for WordPress content */
.prose p {
  margin-bottom: 1rem;
}
.prose h2 {
  color: #1e3a5f;
  margin-top: 2rem;
}
```

---

## Troubleshooting

### Issue: "Unable to load newsletter content"
**Possible Causes:**
1. WordPress REST API is disabled
2. CORS headers not set
3. WordPress site is down
4. Network connectivity issue

**Solutions:**
- Check WordPress is accessible: Visit `https://stpetelodge139.org/wp-json/wp/v2/posts`
- Should return JSON data
- Check browser console for CORS errors
- Verify CORS plugin is active in WordPress

### Issue: Content shows HTML tags
**Solution:** Already handled with `[innerHTML]` binding
If you see raw HTML, check that you're using:
```html
[innerHTML]="currentNewsletter.content.rendered"
```
Not:
```html
{{ currentNewsletter.content.rendered }}
```

### Issue: Archive shows featured post
**Solution:** Already handled - archive uses `posts.slice(1)` to skip first post

### Issue: Loading spinner never stops
**Solution:**
- Check browser console for errors
- Verify API endpoint is correct
- Check WordPress REST API is enabled

---

## Deployment Checklist

- [x] WordPress service methods added
- [x] Component logic implemented
- [x] Template updated with states
- [x] Error handling added
- [x] Loading states implemented
- [x] Secretary instructions created
- [ ] Test with real WordPress posts
- [ ] Verify CORS is configured
- [ ] Build for production
- [ ] Deploy to server
- [ ] Train secretary on new workflow

---

## Future Enhancements

### Nice to Have:
1. **PDF Attachments:** Allow secretary to upload PDF versions
2. **Email Integration:** Auto-email members when new post is published
3. **Draft Preview:** Show drafts to admins only
4. **Rich Media:** Better image gallery support
5. **Search:** Add search functionality for archive
6. **Pagination:** Add pagination for large archives
7. **Categories:** Filter by newsletter type (monthly, special edition, etc.)

### Implementation Priority:
- **High:** PDF attachment support (if needed)
- **Medium:** Email integration
- **Low:** Search and advanced filtering

---

## API Credentials (If Needed)

**Currently:** Using public WordPress REST API (no auth required for reading posts)

**If you need authentication later:**
1. Generate WooCommerce API keys
2. Update `environment.ts`:
```typescript
woocommerce: {
  consumerKey: 'ck_xxxxx',
  consumerSecret: 'cs_xxxxx'
}
```
3. Add auth headers to service calls

---

## Maintenance Notes

### Regular Tasks:
- Monitor WordPress for updates
- Keep CORS plugin active
- Ensure posts are published (not drafts)
- Check REST API endpoint periodically

### When WordPress Updates:
- Test REST API still works
- Verify CORS headers still present
- Check post format hasn't changed

---

## Contact & Support

**For Technical Issues:**
- Check browser console for errors
- Verify WordPress REST API: `https://stpetelodge139.org/wp-json/wp/v2/posts`
- Review WordPress CORS plugin settings

**For Secretary Training:**
- Refer to `SECRETARY_TRESTLE_BOARD_INSTRUCTIONS.md`
- WordPress.org documentation
- YouTube WordPress tutorials

---

**Status:** ✅ Fully Implemented & Ready for Testing

**Next Steps:**
1. Have secretary create a test post in WordPress
2. Verify it appears on the Trestle Board page
3. Build and deploy to production
4. Train secretary on workflow

---

*Last Updated: November 2025*
*St. Petersburg Lodge No. 139 F&AM - Technical Documentation*

