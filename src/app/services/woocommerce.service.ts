import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WooCommerceProduct, WooCommerceCategory } from '../interfaces';

export interface WooCommerceConfig {
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  variation_id?: number;
  variation?: { [key: string]: any };
}

export interface CartResponse {
  items: CartItem[];
  totals: {
    subtotal: string;
    total: string;
    tax: string;
    shipping: string;
  };
  item_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class WooCommerceService {
  private readonly baseUrl = 'https://stpetelodge139.org/wp-json/wc/v3';
  private readonly consumerKey = 'ck_'; // You'll need to add your actual consumer key
  private readonly consumerSecret = 'cs_'; // You'll need to add your actual consumer secret

  // Fallback products if WooCommerce is unavailable
  private fallbackProducts: WooCommerceProduct[] = [
    {
      id: 1,
      name: '2025 Dues with Contribution',
      slug: '2025-dues-let-your-pennies-make-good-sense',
      short_description: 'Pay your 2025 Dues...This selection includes the voluntary "Let your pennies make good sense" contribution to the Masonic Home.',
      price: '202.30',
      regular_price: '202.30',
      sale_price: '202.30',
      on_sale: false,
      purchasable: true,
      images: [{
        id: 1,
        src: 'https://stpetelodge139.org/wp-content/uploads/2025/04/2025-Dues-300x300.png',
        name: '2025 Dues with Contribution',
        alt: '2025 Dues with Contribution'
      }],
      categories: [{
        id: 1,
        name: 'Dues',
        slug: 'dues'
      }],
      stock_status: 'instock'
    },
    {
      id: 2,
      name: '2025 Dues Only - No Contribution',
      slug: '2025-dues-only-no-contribution',
      short_description: 'Pay your 2025 Dues only. This selection does not include the voluntary contribution to the Masonic Home.',
      price: '195.00',
      regular_price: '195.00',
      sale_price: '195.00',
      on_sale: false,
      purchasable: true,
      images: [{
        id: 2,
        src: 'https://stpetelodge139.org/wp-content/uploads/2025/04/2025-Dues-300x300.png',
        name: '2025 Dues Only',
        alt: '2025 Dues Only'
      }],
      categories: [{
        id: 1,
        name: 'Dues',
        slug: 'dues'
      }],
      stock_status: 'instock'
    },
    {
      id: 3,
      name: 'Let your pennies make good sense Voluntary Contribution',
      slug: 'let-your-pennies-make-good-sense-voluntary-contribution',
      short_description: 'Voluntary contribution to the Masonic Home. This can be added to your dues payment.',
      price: '7.30',
      regular_price: '7.30',
      sale_price: '7.30',
      on_sale: false,
      purchasable: true,
      images: [{
        id: 3,
        src: 'https://stpetelodge139.org/wp-content/uploads/2025/04/2025-Dues-300x300.png',
        name: 'Voluntary Contribution',
        alt: 'Voluntary Contribution'
      }],
      categories: [{
        id: 2,
        name: 'Contributions',
        slug: 'contributions'
      }],
      stock_status: 'instock'
    },
    {
      id: 4,
      name: 'Prepay Meal Plan',
      slug: 'prepay-meal-plan',
      short_description: 'Prepay for your meal plan. This helps with planning and reduces costs.',
      price: '120.00',
      regular_price: '120.00',
      sale_price: '120.00',
      on_sale: false,
      purchasable: true,
      images: [{
        id: 4,
        src: 'https://stpetelodge139.org/wp-content/uploads/2025/04/2025-Dues-300x300.png',
        name: 'Prepay Meal Plan',
        alt: 'Prepay Meal Plan'
      }],
      categories: [{
        id: 3,
        name: 'Meals',
        slug: 'meals'
      }],
      stock_status: 'instock'
    }
  ];

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(params?: { 
    per_page?: number; 
    page?: number; 
    category?: string; 
    search?: string;
    featured?: boolean;
  }): Observable<WooCommerceProduct[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.featured) httpParams = httpParams.set('featured', params.featured.toString());
    }

    // Add authentication
    httpParams = httpParams.set('consumer_key', this.consumerKey);
    httpParams = httpParams.set('consumer_secret', this.consumerSecret);

    return this.http.get<WooCommerceProduct[]>(`${this.baseUrl}/products`, { params: httpParams }).pipe(
      catchError(() => {
        // Fallback to static products if WooCommerce is unavailable
        return of(this.fallbackProducts);
      })
    );
  }

  // Get product by ID
  getProduct(id: number): Observable<WooCommerceProduct> {
    const params = new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret);

    return this.http.get<WooCommerceProduct>(`${this.baseUrl}/products/${id}`, { params }).pipe(
      catchError(() => {
        // Fallback to static product
        const product = this.fallbackProducts.find(p => p.id === id);
        if (product) {
          return of(product);
        }
        throw new Error('Product not found');
      })
    );
  }

  // Get product by slug
  getProductBySlug(slug: string): Observable<WooCommerceProduct | null> {
    const params = new HttpParams()
      .set('slug', slug)
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret);

    return this.http.get<WooCommerceProduct[]>(`${this.baseUrl}/products`, { params }).pipe(
      map(products => products.length > 0 ? products[0] : null),
      catchError(() => {
        // Fallback to static product
        const product = this.fallbackProducts.find(p => p.slug === slug);
        return of(product || null);
      })
    );
  }

  // Get categories
  getCategories(params?: { per_page?: number; page?: number }): Observable<WooCommerceCategory[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
    }

    // Add authentication
    httpParams = httpParams.set('consumer_key', this.consumerKey);
    httpParams = httpParams.set('consumer_secret', this.consumerSecret);

    return this.http.get<WooCommerceCategory[]>(`${this.baseUrl}/products/categories`, { params: httpParams }).pipe(
      catchError(() => {
        // Fallback categories
        return of([
          { id: 1, name: 'Dues', slug: 'dues', description: 'Annual lodge dues', count: 2 },
          { id: 2, name: 'Contributions', slug: 'contributions', description: 'Voluntary contributions', count: 1 },
          { id: 3, name: 'Meals', slug: 'meals', description: 'Meal plans and dining', count: 1 }
        ]);
      })
    );
  }

  // Add to cart (redirects to WooCommerce cart)
  addToCart(productId: number, quantity: number = 1): void {
    const cartUrl = `https://stpetelodge139.org/cart/?add-to-cart=${productId}&quantity=${quantity}`;
    window.open(cartUrl, '_blank');
  }

  // Get cart contents (if you want to display cart on your site)
  getCart(): Observable<CartResponse> {
    // This would require additional WooCommerce REST API endpoints or custom implementation
    // For now, redirect to WooCommerce cart
    return of({
      items: [],
      totals: { subtotal: '0.00', total: '0.00', tax: '0.00', shipping: '0.00' },
      item_count: 0
    });
  }

  // Checkout (redirects to WooCommerce checkout)
  goToCheckout(): void {
    window.open('https://stpetelodge139.org/checkout/', '_blank');
  }

  // Get featured products
  getFeaturedProducts(): Observable<WooCommerceProduct[]> {
    return this.getProducts({ featured: true, per_page: 4 });
  }

  // Search products
  searchProducts(query: string): Observable<WooCommerceProduct[]> {
    return this.getProducts({ search: query, per_page: 10 });
  }

  // Get products by category
  getProductsByCategory(categorySlug: string): Observable<WooCommerceProduct[]> {
    return this.getProducts({ category: categorySlug, per_page: 20 });
  }
}