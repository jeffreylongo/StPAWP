import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { WooCommerceProduct, WooCommerceCategory, WooCommerceOrder, CartItem } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class WooCommerceService {
  private readonly baseUrl = 'https://stpetelodge139.org/wp-json/wc/v3';
  private readonly consumerKey = 'your_consumer_key'; // These should be in environment variables
  private readonly consumerSecret = 'your_consumer_secret';

  // Cart management
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem('woo-cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  private getHeaders(): HttpHeaders {
    const auth = btoa(`${this.consumerKey}:${this.consumerSecret}`);
    return new HttpHeaders({
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    });
  }

  private getAuthParams(): HttpParams {
    return new HttpParams()
      .set('consumer_key', this.consumerKey)
      .set('consumer_secret', this.consumerSecret);
  }

  // Products
  getProducts(params?: { 
    per_page?: number; 
    page?: number; 
    category?: string; 
    search?: string;
    featured?: boolean;
    on_sale?: boolean;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Observable<WooCommerceProduct[]> {
    let httpParams = this.getAuthParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.featured !== undefined) httpParams = httpParams.set('featured', params.featured.toString());
      if (params.on_sale !== undefined) httpParams = httpParams.set('on_sale', params.on_sale.toString());
      if (params.orderby) httpParams = httpParams.set('orderby', params.orderby);
      if (params.order) httpParams = httpParams.set('order', params.order);
    }

    return this.http.get<WooCommerceProduct[]>(`${this.baseUrl}/products`, { params: httpParams });
  }

  getProduct(id: number): Observable<WooCommerceProduct> {
    const params = this.getAuthParams();
    return this.http.get<WooCommerceProduct>(`${this.baseUrl}/products/${id}`, { params });
  }

  getProductBySlug(slug: string): Observable<WooCommerceProduct[]> {
    const params = this.getAuthParams().set('slug', slug);
    return this.http.get<WooCommerceProduct[]>(`${this.baseUrl}/products`, { params });
  }

  // Product Categories
  getProductCategories(params?: { per_page?: number; page?: number; parent?: number }): Observable<WooCommerceCategory[]> {
    let httpParams = this.getAuthParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.parent !== undefined) httpParams = httpParams.set('parent', params.parent.toString());
    }

    return this.http.get<WooCommerceCategory[]>(`${this.baseUrl}/products/categories`, { params: httpParams });
  }

  getProductCategory(id: number): Observable<WooCommerceCategory> {
    const params = this.getAuthParams();
    return this.http.get<WooCommerceCategory>(`${this.baseUrl}/products/categories/${id}`, { params });
  }

  // Cart Management
  addToCart(item: CartItem): void {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(cartItem => cartItem.product_id === item.product_id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      item.total = item.price * item.quantity;
      currentCart.push(item);
    }

    this.updateCart(currentCart);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartItems.value.filter(item => item.product_id !== productId);
    this.updateCart(currentCart);
  }

  updateCartItemQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartItems.value.map(item => {
      if (item.product_id === productId) {
        item.quantity = quantity;
        item.total = item.price * quantity;
      }
      return item;
    });
    this.updateCart(currentCart);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.total, 0);
  }

  getCartItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  private updateCart(cart: CartItem[]): void {
    this.cartItems.next(cart);
    localStorage.setItem('woo-cart', JSON.stringify(cart));
  }

  // Orders
  createOrder(orderData: {
    payment_method: string;
    payment_method_title: string;
    set_paid: boolean;
    billing: any;
    shipping: any;
    line_items: Array<{
      product_id: number;
      quantity: number;
    }>;
    shipping_lines?: any[];
  }): Observable<WooCommerceOrder> {
    const headers = this.getHeaders();
    return this.http.post<WooCommerceOrder>(`${this.baseUrl}/orders`, orderData, { headers });
  }

  getOrders(params?: { 
    customer?: number; 
    per_page?: number; 
    page?: number;
    status?: string;
  }): Observable<WooCommerceOrder[]> {
    let httpParams = this.getAuthParams();
    
    if (params) {
      if (params.customer) httpParams = httpParams.set('customer', params.customer.toString());
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.status) httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<WooCommerceOrder[]>(`${this.baseUrl}/orders`, { params: httpParams });
  }

  getOrder(id: number): Observable<WooCommerceOrder> {
    const params = this.getAuthParams();
    return this.http.get<WooCommerceOrder>(`${this.baseUrl}/orders/${id}`, { params });
  }

  // Customer methods (requires authentication)
  getCustomers(params?: { per_page?: number; page?: number; search?: string }): Observable<any[]> {
    let httpParams = this.getAuthParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<any[]>(`${this.baseUrl}/customers`, { params: httpParams });
  }

  // Payment methods
  getPaymentGateways(): Observable<any[]> {
    const params = this.getAuthParams();
    return this.http.get<any[]>(`${this.baseUrl}/payment_gateways`, { params });
  }

  // Shipping methods
  getShippingZones(): Observable<any[]> {
    const params = this.getAuthParams();
    return this.http.get<any[]>(`${this.baseUrl}/shipping/zones`, { params });
  }

  // Coupons
  getCoupons(params?: { per_page?: number; page?: number; code?: string }): Observable<any[]> {
    let httpParams = this.getAuthParams();
    
    if (params) {
      if (params.per_page) httpParams = httpParams.set('per_page', params.per_page.toString());
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.code) httpParams = httpParams.set('code', params.code);
    }

    return this.http.get<any[]>(`${this.baseUrl}/coupons`, { params: httpParams });
  }
}