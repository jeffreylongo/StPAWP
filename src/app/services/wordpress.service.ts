import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WordPressPost, WordPressPage, WordPressCategory, WordPressMedia, WordPressQueryParams } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class WordPressService {
  private readonly baseUrl = 'https://stpetelodge139.org/wp-json/wp/v2';

  constructor(private http: HttpClient) {}

  // Posts methods
  getPosts(params?: { per_page?: number; page?: number; categories?: string; search?: string }): Observable<WordPressPost[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.categories) httpParams = httpParams.set('categories', params.categories);
      if (params.search) httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<WordPressPost[]>(`${this.baseUrl}/posts`, { params: httpParams });
  }

  getPostBySlug(slug: string): Observable<WordPressPost | null> {
    const params = new HttpParams().set('slug', slug);
    
    return this.http.get<WordPressPost[]>(`${this.baseUrl}/posts`, { params }).pipe(
      map(posts => posts.length > 0 ? posts[0] : null)
    );
  }

  getPostById(id: number): Observable<WordPressPost> {
    return this.http.get<WordPressPost>(`${this.baseUrl}/posts/${id}`);
  }

  // Pages methods
  getPages(params?: { per_page?: number; page?: number; parent?: number }): Observable<WordPressPage[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.parent) httpParams = httpParams.set('parent', params.parent.toString());
    }

    return this.http.get<WordPressPage[]>(`${this.baseUrl}/pages`, { params: httpParams });
  }

  getPageBySlug(slug: string): Observable<WordPressPage | null> {
    const params = new HttpParams().set('slug', slug);
    
    return this.http.get<WordPressPage[]>(`${this.baseUrl}/pages`, { params }).pipe(
      map(pages => pages.length > 0 ? pages[0] : null)
    );
  }

  getPageById(id: number): Observable<WordPressPage> {
    return this.http.get<WordPressPage>(`${this.baseUrl}/pages/${id}`);
  }

  // Categories methods
  getCategories(params?: { per_page?: number; page?: number }): Observable<WordPressCategory[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
    }

    return this.http.get<WordPressCategory[]>(`${this.baseUrl}/categories`, { params: httpParams });
  }

  getCategoryById(id: number): Observable<WordPressCategory> {
    return this.http.get<WordPressCategory>(`${this.baseUrl}/categories/${id}`);
  }

  // Media methods
  getMediaById(id: number): Observable<WordPressMedia> {
    return this.http.get<WordPressMedia>(`${this.baseUrl}/media/${id}`);
  }

  getMedia(params?: { per_page?: number; page?: number }): Observable<WordPressMedia[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
    }

    return this.http.get<WordPressMedia[]>(`${this.baseUrl}/media`, { params: httpParams });
  }

  // Custom endpoints for announcements (assuming custom post type)
  getAnnouncements(params?: { per_page?: number; page?: number }): Observable<WordPressPost[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
    }

    // This assumes you have a custom post type called 'announcements'
    // Adjust the endpoint based on your WordPress setup
    return this.http.get<WordPressPost[]>(`${this.baseUrl}/announcements`, { params: httpParams })
      .pipe(
        // Fallback to regular posts with announcement category if custom post type doesn't exist
        map(announcements => announcements)
      );
  }

  getAnnouncementBySlug(slug: string): Observable<WordPressPost | null> {
    const params = new HttpParams().set('slug', slug);
    
    return this.http.get<WordPressPost[]>(`${this.baseUrl}/announcements`, { params }).pipe(
      map(announcements => announcements.length > 0 ? announcements[0] : null)
    );
  }

  // Search functionality
  search(query: string, params?: { per_page?: number; page?: number; type?: string }): Observable<any[]> {
    let httpParams = new HttpParams().set('search', query);
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.type) httpParams = httpParams.set('type', params.type);
    }

    const endpoint = params?.type ? `${this.baseUrl}/${params.type}` : `${this.baseUrl}/posts`;
    return this.http.get<any[]>(endpoint, { params: httpParams });
  }

  // Menu items (if using REST API Menus plugin)
  getMenuItems(menuSlug: string): Observable<any[]> {
    // This requires the "WP REST API Menus" plugin to be installed
    return this.http.get<any[]>(`${this.baseUrl}/menus/v1/menus/${menuSlug}`);
  }

  // Contact form submission (requires Contact Form 7 REST API plugin)
  submitContactForm(formId: number, formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/contact-form-7/v1/contact-forms/${formId}/feedback`, formData);
  }

  // Trestle Board Newsletter methods
  getTrestleBoardPosts(params?: { per_page?: number }): Observable<WordPressPost[]> {
    let httpParams = new HttpParams();
    
    if (params?.per_page) {
      httpParams = httpParams.set('per_page', params.per_page.toString());
    } else {
      httpParams = httpParams.set('per_page', '50'); // Get more posts to filter by month
    }
    
    // Fetch posts tagged with 'trestle-board' or from 'Trestle Board' category
    // Secretary will need to add posts with category "Trestle Board"
    httpParams = httpParams.set('orderby', 'date');
    httpParams = httpParams.set('order', 'desc');
    
    return this.http.get<WordPressPost[]>(`${this.baseUrl}/posts`, { params: httpParams });
  }

  // Get all posts from current month
  getCurrentMonthTrestleBoards(): Observable<WordPressPost[]> {
    const params = new HttpParams()
      .set('per_page', '50')
      .set('orderby', 'date')
      .set('order', 'desc');
    
    return this.http.get<WordPressPost[]>(`${this.baseUrl}/posts`, { params }).pipe(
      map(posts => {
        // Filter posts to only include those from current month/year
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return posts.filter(post => {
          const postDate = new Date(post.date);
          return postDate.getMonth() === currentMonth && 
                 postDate.getFullYear() === currentYear;
        });
      })
    );
  }
}