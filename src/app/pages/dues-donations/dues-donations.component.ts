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
          <p class="text-gray-700 leading-relaxed">
            Your financial support through dues and donations helps maintain our historic lodge building, 
            supports our charitable activities, and ensures we can continue our Masonic work in the community. 
            We appreciate your commitment to our fraternal organization.
          </p>
        </div>
      </div>

      <!-- Dues Information -->
      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <div class="bg-neutral-light border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-blue text-white p-6">
            <div class="flex items-center">
              <i class="fas fa-calendar-check text-primary-gold text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">Annual Dues</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-white rounded border">
                <div>
                  <h4 class="font-semibold text-primary-blue">Regular Member Dues</h4>
                  <p class="text-sm text-gray-600">Annual membership dues</p>
                </div>
                <span class="text-2xl font-bold text-primary-gold">$120</span>
              </div>
              
              <div class="flex justify-between items-center p-4 bg-white rounded border">
                <div>
                  <h4 class="font-semibold text-primary-blue">Senior Member Dues</h4>
                  <p class="text-sm text-gray-600">Members 65+ years old</p>
                </div>
                <span class="text-2xl font-bold text-primary-gold">$60</span>
              </div>
              
              <div class="bg-primary-gold-light p-4 rounded">
                <h4 class="font-semibold text-primary-blue-darker mb-2">Due Dates</h4>
                <ul class="text-sm text-primary-blue-darker space-y-1">
                  <li>• Annual dues are due January 1st</li>
                  <li>• Grace period extends through March 31st</li>
                  <li>• Late fees may apply after April 1st</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

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
              
              <div class="p-4 bg-white rounded border">
                <div class="flex items-center mb-2">
                  <i class="fas fa-hand-holding-usd text-primary-blue mr-2"></i>
                  <h4 class="font-semibold text-primary-blue">Cash Payment</h4>
                </div>
                <p class="text-sm text-gray-600">
                  Bring cash payment to any stated communication or contact the Secretary
                </p>
              </div>
              
              <div class="p-4 bg-white rounded border">
                <div class="flex items-center mb-2">
                  <i class="fas fa-globe text-primary-blue mr-2"></i>
                  <h4 class="font-semibold text-primary-blue">Online Payment</h4>
                </div>
                <p class="text-sm text-gray-600 mb-2">
                  Contact the Secretary for online payment options
                </p>
                <a href="mailto:secretary&#64;stpetelodge139.org" 
                   class="text-primary-blue hover:text-primary-gold text-sm font-medium">
                  secretary&#64;stpetelodge139.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Donations Section -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-md mb-12">
        <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
          <div class="flex items-center">
            <i class="fas fa-donate text-primary-gold text-2xl mr-3"></i>
            <h3 class="font-cinzel text-xl font-bold">Charitable Donations</h3>
          </div>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center p-6 bg-neutral-light rounded-lg">
              <div class="bg-primary-gold text-primary-blue-darker rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-home text-xl"></i>
              </div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-2">Lodge Building Fund</h4>
              <p class="text-gray-600 text-sm mb-4">
                Help maintain and improve our historic lodge building for future generations
              </p>
              <button class="bg-primary-blue hover:bg-primary-blue-dark text-white px-4 py-2 rounded text-sm transition">
                Contribute
              </button>
            </div>
            
            <div class="text-center p-6 bg-neutral-light rounded-lg">
              <div class="bg-primary-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-graduation-cap text-xl"></i>
              </div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-2">Scholarship Fund</h4>
              <p class="text-gray-600 text-sm mb-4">
                Support local students with educational scholarships and opportunities
              </p>
              <button class="bg-primary-blue hover:bg-primary-blue-dark text-white px-4 py-2 rounded text-sm transition">
                Contribute
              </button>
            </div>
            
            <div class="text-center p-6 bg-neutral-light rounded-lg">
              <div class="bg-primary-gold text-primary-blue-darker rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-hands-helping text-xl"></i>
              </div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-2">Charity Fund</h4>
              <p class="text-gray-600 text-sm mb-4">
                Support our community outreach and charitable activities throughout the year
              </p>
              <button class="bg-primary-blue hover:bg-primary-blue-dark text-white px-4 py-2 rounded text-sm transition">
                Contribute
              </button>
            </div>
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
            <a href="mailto:secretary@stpetelodge139.org" 
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
