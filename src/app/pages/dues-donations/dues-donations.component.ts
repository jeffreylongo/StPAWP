import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dues-donations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Dues & Donations</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Dues & Donations</h1>
        <p class="text-lg mt-4 text-primary-gold-light">Supporting Our Lodge and Community</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <div class="flex items-center mb-6">
            <i class="fas fa-hand-holding-heart text-primary-gold text-3xl mr-4"></i>
            <div>
              <h2 class="font-cinzel text-2xl text-primary-blue font-bold">Financial Support</h2>
              <p class="text-gray-600">Maintaining our lodge and supporting our community</p>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed mb-6">
            Hello Brothers, welcome to our online store where you can pay online for Dues, Meals, and other contributions. 
            Your financial support helps maintain our historic lodge building, supports our charitable activities, 
            and ensures we can continue our Masonic work in the community.
          </p>
          <!-- TEMPORARILY COMMENTED OUT
          <div class="text-center">
            <a href="https://stpetelodge139.org/cart/" 
               target="_blank"
               class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center text-lg">
              <i class="fas fa-shopping-cart mr-3"></i>
              Go To Cart
            </a>
          </div>
          -->
        </div>
      </div>

      <!-- PayPal Donation Button -->
      <div class="max-w-2xl mx-auto mb-12">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md p-8 text-center">
          <h3 class="font-cinzel text-2xl text-primary-blue font-bold mb-6">Quick Donation</h3>
          <p class="text-gray-600 mb-6">Make a direct donation to support our lodge and charitable activities</p>
          
          <form action="https://www.paypal.com/ncp/payment/M5KLQ9WPJHPRE" method="post" target="_blank" 
                class="inline-grid justify-items-center align-content-start gap-4">
            <input type="submit" value="DONATE" 
                   class="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg transition-colors cursor-pointer text-lg min-w-[11.625rem]">
            <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="Accepted payment methods" class="mx-auto" />
            <section class="text-xs text-gray-500">
              Powered by <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" 
                              alt="PayPal" class="h-3.5 inline align-middle ml-1" />
            </section>
          </form>
        </div>
      </div>

      <!-- WooCommerce Products Grid -->
      <!-- TEMPORARILY COMMENTED OUT
      <div class="mb-12">
        <h2 class="font-cinzel text-3xl text-primary-blue font-bold text-center mb-8">Available Products</h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <-- 2025 Dues with Contribution --
          <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative">
              <img src="https://stpetelodge139.org/wp-content/uploads/2025/04/2025-Dues-300x300.png" 
                   alt="2025 Dues with Contribution" 
                   class="w-full h-48 object-cover">
              <div class="absolute top-2 right-2">
                <span class="bg-primary-gold text-primary-blue-darker px-2 py-1 rounded-full text-xs font-bold">
                  Featured
                </span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-cinzel text-lg text-primary-blue font-bold mb-2">2025 Dues with Contribution</h3>
              <div class="text-2xl font-bold text-primary-gold mb-3">$202.30</div>
              <p class="text-gray-600 text-sm mb-4">
                Pay your 2025 Dues...This selection includes the voluntary "Let your pennies make good sense" 
                contribution to the Masonic Home.
              </p>
              <a href="https://stpetelodge139.org/product/2025-dues-let-your-pennies-make-good-sense/" 
                 target="_blank"
                 class="block w-full bg-primary-blue hover:bg-primary-blue-dark text-white text-center py-2 rounded transition">
                View Details
              </a>
            </div>
          </div>

          <-- 2025 Dues Only --
          <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative">
              <img src="https://stpetelodge139.org/wp-content/uploads/2025/04/2025-Dues-1-300x300.png" 
                   alt="2025 Dues Only" 
                   class="w-full h-48 object-cover">
            </div>
            <div class="p-4">
              <h3 class="font-cinzel text-lg text-primary-blue font-bold mb-2">2025 Dues Only</h3>
              <div class="text-2xl font-bold text-primary-gold mb-3">$195.00</div>
              <p class="text-gray-600 text-sm mb-4">
                Pay your 2025 Dues...This selection does NOT include the voluntary "Let your pennies make good sense" 
                contribution to the Masonic Home.
              </p>
              <a href="https://stpetelodge139.org/product/2025-dues-only-no-contribution/" 
                 target="_blank"
                 class="block w-full bg-primary-blue hover:bg-primary-blue-dark text-white text-center py-2 rounded transition">
                View Details
              </a>
            </div>
          </div>

          <-- Voluntary Contribution --
          <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative">
              <img src="https://stpetelodge139.org/wp-content/uploads/2025/04/Pennies-300x300.png" 
                   alt="Voluntary Contribution" 
                   class="w-full h-48 object-cover">
            </div>
            <div class="p-4">
              <h3 class="font-cinzel text-lg text-primary-blue font-bold mb-2">Voluntary Contribution</h3>
              <div class="text-2xl font-bold text-primary-gold mb-3">$7.30</div>
              <p class="text-gray-600 text-sm mb-4">
                Voluntary "Let your pennies make good sense" contribution to the Masonic Home.
              </p>
              <a href="https://stpetelodge139.org/product/let-your-pennies-make-good-sense-voluntary-contribution/" 
                 target="_blank"
                 class="block w-full bg-primary-blue hover:bg-primary-blue-dark text-white text-center py-2 rounded transition">
                View Details
              </a>
            </div>
          </div>

          <-- Prepay Meal Plan --
          <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative">
              <img src="https://stpetelodge139.org/wp-content/uploads/2025/04/meals-300x300.png" 
                   alt="Prepay Meal Plan" 
                   class="w-full h-48 object-cover">
              <div class="absolute top-2 right-2">
                <span class="bg-primary-gold text-primary-blue-darker px-2 py-1 rounded-full text-xs font-bold">
                  Popular
                </span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-cinzel text-lg text-primary-blue font-bold mb-2">Prepay Meal Plan</h3>
              <div class="text-2xl font-bold text-primary-gold mb-3">$120.00</div>
              <p class="text-gray-600 text-sm mb-4">
                No cash? No problem. Prepay your meals for the full year. Includes ALL dinners. 
                (Stated, Called, Degrees, etc)
              </p>
              <a href="https://stpetelodge139.org/product/prepay-meal-plan/" 
                 target="_blank"
                 class="block w-full bg-primary-blue hover:bg-primary-blue-dark text-white text-center py-2 rounded transition">
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>
      -->

      <!-- Additional Information -->
      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <!-- Payment Methods -->
        <div class="bg-neutral-light border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-gold text-primary-blue-darker p-6">
            <div class="flex items-center">
              <i class="fas fa-credit-card text-primary-blue-darker text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">Payment Methods</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="p-4 bg-white rounded border">
                <div class="flex items-center mb-2">
                  <i class="fas fa-shopping-cart text-primary-blue mr-2"></i>
                  <h4 class="font-semibold text-primary-blue">Online Store</h4>
                </div>
                <p class="text-sm text-gray-600">
                  Use our WooCommerce store for secure online payments with credit cards
                </p>
              </div>
              
              <div class="p-4 bg-white rounded border">
                <div class="flex items-center mb-2">
                  <i class="fab fa-paypal text-primary-blue mr-2"></i>
                  <h4 class="font-semibold text-primary-blue">PayPal</h4>
                </div>
                <p class="text-sm text-gray-600">
                  Quick donations and payments through PayPal's secure platform
                </p>
              </div>
              
              <div class="p-4 bg-white rounded border">
                <div class="flex items-center mb-2">
                  <i class="fas fa-money-check text-primary-blue mr-2"></i>
                  <h4 class="font-semibold text-primary-blue">Check or Money Order</h4>
                </div>
                <p class="text-sm text-gray-600 mb-2">
                  Make payable to: <strong>St. Petersburg Lodge No. 139 F&AM</strong>
                </p>
                <p class="text-sm text-gray-600">
                  Mail to: 3325 1st St NE, St. Petersburg, FL 33704
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- About "Let Your Pennies Make Good Sense" -->
        <div class="bg-neutral-light border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-blue text-white p-6">
            <div class="flex items-center">
              <i class="fas fa-coins text-primary-gold text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">Let Your Pennies Make Good Sense</h3>
            </div>
          </div>
          <div class="p-6">
            <p class="text-gray-700 mb-4">
              This voluntary contribution program supports the Masonic Home & Hospital in St. Petersburg, 
              providing care and support for our Masonic family members in need.
            </p>
            <a href="https://www.grandlodgefl.com/glf-initiatives/lypmgc-for-the-home-2/" 
               target="_blank"
               class="text-primary-blue hover:text-primary-gold font-medium inline-flex items-center">
              <i class="fas fa-external-link-alt mr-2"></i>
              Learn More About This Initiative
            </a>
          </div>
        </div>
      </div>

      <!-- Financial Assistance -->
      <div class="bg-primary-gold-light border border-primary-gold rounded-lg p-8 mb-12">
        <div class="flex items-start">
          <i class="fas fa-info-circle text-primary-blue text-2xl mr-4 mt-1"></i>
          <div>
            <h3 class="font-cinzel text-xl text-primary-blue font-bold mb-3">Financial Assistance Available</h3>
            <p class="text-primary-blue-darker mb-4">
              We understand that financial circumstances can vary. If you're experiencing difficulty paying dues, 
              please reach out to the Secretary or Worshipful Master confidentially. Our lodge has provisions 
              to assist members in good standing who may need temporary financial support.
            </p>
            <p class="text-primary-blue-darker text-sm">
              <strong>Remember:</strong> No worthy Mason should be prevented from participating in lodge activities due to financial hardship.
            </p>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="text-center">
        <div class="bg-primary-blue text-white p-8 rounded-lg">
          <h3 class="font-cinzel text-2xl font-bold mb-4">Questions About Dues or Donations?</h3>
          <p class="mb-6 text-primary-gold-light">
            Contact our Secretary for assistance with payments, questions about dues, or information about donation opportunities.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:secretary@stpete139.org" 
               class="bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold px-6 py-3 rounded transition inline-flex items-center">
              <i class="fas fa-envelope mr-2"></i>
              Email Secretary
            </a>
            <a href="tel:+17274183356" 
               class="border-2 border-white hover:border-primary-gold text-white hover:text-primary-gold px-6 py-3 rounded transition inline-flex items-center">
              <i class="fas fa-phone mr-2"></i>
              (727) 418-3356
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DuesDonationsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
