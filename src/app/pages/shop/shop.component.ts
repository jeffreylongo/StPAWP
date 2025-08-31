import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WooCommerceService } from '../../services/woocommerce.service';
import { WooCommerceProduct, WooCommerceCategory, CartItem } from '../../interfaces';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Page Header -->
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Shop</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Lodge Shop</h1>
        <p class="mt-4 text-lg">Official merchandise and Masonic items</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <div class="w-full lg:w-1/4">
          <!-- Cart Summary -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
            <h3 class="font-cinzel text-lg font-bold text-primary-blue mb-4">Shopping Cart</h3>
            <div class="flex justify-between items-center mb-2">
              <span>Items:</span>
              <span class="font-semibold">{{ cartItemCount }}</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span>Total:</span>
              <span class="font-bold text-primary-blue">\${{ cartTotal.toFixed(2) }}</span>
            </div>
            <button 
              class="w-full bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold py-2 px-4 rounded transition-colors"
              [disabled]="cartItemCount === 0"
              (click)="viewCart()">
              View Cart
            </button>
          </div>

          <!-- Categories Filter -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-md mb-6">
            <h3 class="font-cinzel text-lg font-bold text-primary-blue p-4 border-b">Categories</h3>
            <div class="p-4">
              <button 
                (click)="selectCategory(null)"
                [class]="'block w-full text-left py-2 px-3 rounded transition-colors ' + (selectedCategory === null ? 'bg-primary-blue text-white' : 'hover:bg-gray-100')">
                All Products
              </button>
              <button 
                *ngFor="let category of categories"
                (click)="selectCategory(category.id)"
                [class]="'block w-full text-left py-2 px-3 rounded transition-colors ' + (selectedCategory === category.id ? 'bg-primary-blue text-white' : 'hover:bg-gray-100')">
                {{ category.name }}
              </button>
            </div>
          </div>

          <!-- Price Filter -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 class="font-cinzel text-lg font-bold text-primary-blue p-4 border-b">Price Range</h3>
            <div class="p-4 space-y-2">
              <button 
                (click)="selectPriceRange(null)"
                [class]="'block w-full text-left py-2 px-3 rounded transition-colors ' + (selectedPriceRange === null ? 'bg-primary-blue text-white' : 'hover:bg-gray-100')">
                All Prices
              </button>
              <button 
                (click)="selectPriceRange('0-25')"
                [class]="'block w-full text-left py-2 px-3 rounded transition-colors ' + (selectedPriceRange === '0-25' ? 'bg-primary-blue text-white' : 'hover:bg-gray-100')">
                Under \$25
              </button>
              <button 
                (click)="selectPriceRange('25-50')"
                [class]="'block w-full text-left py-2 px-3 rounded transition-colors ' + (selectedPriceRange === '25-50' ? 'bg-primary-blue text-white' : 'hover:bg-gray-100')">
                \$25 - \$50
              </button>
              <button 
                (click)="selectPriceRange('50-100')"
                [class]="'block w-full text-left py-2 px-3 rounded transition-colors ' + (selectedPriceRange === '50-100' ? 'bg-primary-blue text-white' : 'hover:bg-gray-100')">
                \$50 - \$100
              </button>
              <button 
                (click)="selectPriceRange('100+')"
                [class]="'block w-full text-left py-2 px-3 rounded transition-colors ' + (selectedPriceRange === '100+' ? 'bg-primary-blue text-white' : 'hover:bg-gray-100')">
                Over \$100
              </button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="w-full lg:w-3/4">
          <!-- Search and Sort -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div class="flex-1 max-w-md mb-4 md:mb-0">
              <input 
                type="text" 
                placeholder="Search products..." 
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent">
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600">Sort by:</span>
              <select 
                [(ngModel)]="sortBy"
                (ngModelChange)="onSortChange()"
                class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-blue focus:border-transparent">
                <option value="date">Newest</option>
                <option value="title">Name</option>
                <option value="price">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let item of [1,2,3,4,5,6]" class="animate-pulse">
              <div class="bg-gray-200 h-64 mb-4 rounded"></div>
              <div class="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
              <div class="bg-gray-200 h-4 w-1/2 rounded"></div>
            </div>
          </div>

          <!-- Products Grid -->
          <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let product of filteredProducts" class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden event-card">
              <!-- Product Image -->
              <div class="aspect-square bg-gray-100 relative">
                <img 
                  *ngIf="product.images && product.images.length > 0; else noImage"
                  [src]="product.images[0].src" 
                  [alt]="product.images[0].alt || product.name"
                  class="w-full h-full object-cover">
                <ng-template #noImage>
                  <div class="w-full h-full flex items-center justify-center text-gray-400">
                    <i class="fas fa-image text-4xl"></i>
                  </div>
                </ng-template>
                
                <!-- Sale Badge -->
                <span *ngIf="product.on_sale" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                  SALE
                </span>
              </div>

              <!-- Product Info -->
              <div class="p-4">
                <h3 class="font-semibold text-lg mb-2 line-clamp-2">{{ product.name }}</h3>
                <div class="text-gray-600 text-sm mb-3 line-clamp-3" [innerHTML]="product.short_description"></div>
                
                <!-- Price -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <span *ngIf="product.on_sale" class="text-gray-400 line-through text-sm">\${{ product.regular_price }}</span>
                    <span class="text-primary-blue font-bold text-lg">\${{ product.price }}</span>
                  </div>
                  <div class="text-xs text-gray-500" *ngIf="product.stock_status === 'instock'">
                    In Stock
                  </div>
                  <div class="text-xs text-red-500" *ngIf="product.stock_status !== 'instock'">
                    Out of Stock
                  </div>
                </div>

                <!-- Add to Cart Button -->
                <button 
                  (click)="addToCart(product)"
                  [disabled]="product.stock_status !== 'instock'"
                  class="w-full bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold py-2 px-4 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                  <span *ngIf="product.stock_status === 'instock'">Add to Cart</span>
                  <span *ngIf="product.stock_status !== 'instock'">Out of Stock</span>
                </button>
              </div>
            </div>
          </div>

          <!-- No Products -->
          <div *ngIf="!isLoading && filteredProducts.length === 0" class="text-center py-12">
            <i class="fas fa-shopping-bag text-gray-300 text-5xl mb-4"></i>
            <p class="text-gray-500 text-lg">No products found.</p>
            <p class="text-gray-400">Try adjusting your search or filters.</p>
          </div>

          <!-- Pagination -->
          <div *ngIf="totalPages > 1" class="flex justify-center mt-8">
            <nav class="flex space-x-2">
              <button 
                *ngFor="let page of getPageNumbers()" 
                (click)="loadPage(page)"
                [class]="'px-3 py-2 rounded transition-colors ' + (page === currentPage ? 'bg-primary-blue text-white' : 'bg-white border border-gray-300 hover:bg-gray-50')">
                {{ page }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ShopComponent implements OnInit {
  products: WooCommerceProduct[] = [];
  filteredProducts: WooCommerceProduct[] = [];
  categories: WooCommerceCategory[] = [];
  
  isLoading = true;
  searchQuery = '';
  sortBy = 'date';
  selectedCategory: number | null = null;
  selectedPriceRange: string | null = null;
  
  currentPage = 1;
  totalPages = 1;
  
  cartItemCount = 0;
  cartTotal = 0;

  constructor(private wooService: WooCommerceService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.updateCartInfo();
  }

  loadProducts(page = 1) {
    this.isLoading = true;
    
    // Generate mock products for demonstration
    setTimeout(() => {
      this.products = this.generateMockProducts();
      this.applyFilters();
      this.isLoading = false;
    }, 1000);
  }

  loadCategories() {
    // Generate mock categories
    this.categories = [
      { id: 1, name: 'Apparel', slug: 'apparel', parent: 0, description: '', display: 'default', image: null, menu_order: 0, count: 5 },
      { id: 2, name: 'Accessories', slug: 'accessories', parent: 0, description: '', display: 'default', image: null, menu_order: 0, count: 8 },
      { id: 3, name: 'Books', slug: 'books', parent: 0, description: '', display: 'default', image: null, menu_order: 0, count: 3 },
      { id: 4, name: 'Jewelry', slug: 'jewelry', parent: 0, description: '', display: 'default', image: null, menu_order: 0, count: 6 }
    ];
  }

  private generateMockProducts(): WooCommerceProduct[] {
    const mockProducts = [
      {
        id: 1,
        name: 'Lodge #139 Polo Shirt',
        slug: 'lodge-139-polo-shirt',
        price: '35.00',
        regular_price: '35.00',
        sale_price: '',
        on_sale: false,
        short_description: 'High-quality embroidered polo shirt with lodge emblem',
        stock_status: 'instock',
        images: [{ id: 1, src: 'https://via.placeholder.com/400x400?text=Polo+Shirt', alt: 'Lodge Polo Shirt', name: '', date_created: '', date_created_gmt: '', date_modified: '', date_modified_gmt: '' }],
        categories: [{ id: 1, name: 'Apparel', slug: 'apparel' }]
      },
      {
        id: 2,
        name: 'Masonic Square and Compass Ring',
        slug: 'masonic-ring',
        price: '89.99',
        regular_price: '99.99',
        sale_price: '89.99',
        on_sale: true,
        short_description: 'Sterling silver ring with traditional Masonic symbols',
        stock_status: 'instock',
        images: [{ id: 2, src: 'https://via.placeholder.com/400x400?text=Masonic+Ring', alt: 'Masonic Ring', name: '', date_created: '', date_created_gmt: '', date_modified: '', date_modified_gmt: '' }],
        categories: [{ id: 4, name: 'Jewelry', slug: 'jewelry' }]
      },
      {
        id: 3,
        name: 'Lodge History Book',
        slug: 'lodge-history-book',
        price: '25.00',
        regular_price: '25.00',
        sale_price: '',
        on_sale: false,
        short_description: 'Complete history of St. Petersburg Lodge No. 139',
        stock_status: 'instock',
        images: [{ id: 3, src: 'https://via.placeholder.com/400x400?text=History+Book', alt: 'Lodge History Book', name: '', date_created: '', date_created_gmt: '', date_modified: '', date_modified_gmt: '' }],
        categories: [{ id: 3, name: 'Books', slug: 'books' }]
      },
      {
        id: 4,
        name: 'Masonic Apron',
        slug: 'masonic-apron',
        price: '125.00',
        regular_price: '125.00',
        sale_price: '',
        on_sale: false,
        short_description: 'Traditional white lambskin apron with lodge emblems',
        stock_status: 'instock',
        images: [{ id: 4, src: 'https://via.placeholder.com/400x400?text=Masonic+Apron', alt: 'Masonic Apron', name: '', date_created: '', date_created_gmt: '', date_modified: '', date_modified_gmt: '' }],
        categories: [{ id: 2, name: 'Accessories', slug: 'accessories' }]
      },
      {
        id: 5,
        name: 'Lodge Coffee Mug',
        slug: 'lodge-coffee-mug',
        price: '15.00',
        regular_price: '15.00',
        sale_price: '',
        on_sale: false,
        short_description: 'Ceramic mug with lodge logo and founding date',
        stock_status: 'instock',
        images: [{ id: 5, src: 'https://via.placeholder.com/400x400?text=Coffee+Mug', alt: 'Lodge Coffee Mug', name: '', date_created: '', date_created_gmt: '', date_modified: '', date_modified_gmt: '' }],
        categories: [{ id: 2, name: 'Accessories', slug: 'accessories' }]
      }
    ] as WooCommerceProduct[];

    return mockProducts;
  }

  selectCategory(categoryId: number | null) {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  selectPriceRange(range: string | null) {
    this.selectedPriceRange = range;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => 
        product.categories.some(cat => cat.id === this.selectedCategory)
      );
    }

    // Price range filter
    if (this.selectedPriceRange) {
      const [min, max] = this.selectedPriceRange.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return max ? price >= min && price <= max : price >= min;
      });
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.short_description.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'title':
          return a.name.localeCompare(b.name);
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price);
        default:
          return b.id - a.id; // Newest first
      }
    });

    this.filteredProducts = filtered;
  }

  addToCart(product: WooCommerceProduct) {
    const cartItem: CartItem = {
      product_id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image: product.images[0]?.src,
      total: parseFloat(product.price)
    };

    this.wooService.addToCart(cartItem);
    this.updateCartInfo();
  }

  updateCartInfo() {
    this.wooService.cart$.subscribe(cartItems => {
      this.cartItemCount = this.wooService.getCartItemCount();
      this.cartTotal = this.wooService.getCartTotal();
    });
  }

  viewCart() {
    // Navigate to cart page or open cart modal
    console.log('View cart clicked');
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.loadProducts(page);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}