import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FormDocument {
  title: string;
  description: string;
  downloadUrl: string;
  category: 'membership' | 'lodge' | 'financial' | 'other';
  icon: string;
  fileType: string;
}

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Forms & Petitions</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Forms & Petitions</h1>
        <p class="text-primary-gold-light text-xl mt-4">Download Important Lodge Documents</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction -->
      <div class="text-center mb-16">
        <div class="max-w-4xl mx-auto">
          <i class="fas fa-file-alt text-6xl text-primary-gold mb-6"></i>
          <h2 class="font-cinzel text-3xl font-bold text-primary-blue mb-6">Lodge Forms & Documents</h2>
          <div class="w-24 h-1 bg-primary-gold mx-auto mb-8"></div>
          <p class="text-gray-600 text-lg leading-relaxed">
            Access important lodge forms, petitions, and documents. All forms are available for download in PDF format. 
            If you need assistance completing any forms, please contact our Secretary or visit us during our regular meetings.
          </p>
        </div>
      </div>

      <!-- Membership Forms Section -->
      <div class="mb-16">
        <div class="text-center mb-8">
          <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-4">
            <i class="fas fa-user-plus text-primary-gold mr-3"></i>
            Membership Forms
          </h3>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Forms related to joining our lodge and membership processes.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Petition for Membership -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
              <div class="flex items-center">
                <div class="bg-primary-gold text-primary-blue-darker w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-scroll text-lg"></i>
                </div>
                <div>
                  <h4 class="font-cinzel text-lg font-bold">Petition for Membership</h4>
                  <p class="text-primary-gold-light text-sm">PDF Form</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-6 text-sm leading-relaxed">
                Official petition form for men interested in joining St. Petersburg Lodge No. 139. 
                Complete this form to begin your Masonic journey with us.
              </p>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">Required for membership</span>
                <a href="http://stpetelodge139.org/wp-content/uploads/2023/11/On-Line-Petition-For-Membership.pdf" 
                   target="_blank"
                   rel="noopener noreferrer"
                   class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-4 py-2 rounded-lg transition inline-flex items-center text-sm">
                  <i class="fas fa-download mr-2"></i>
                  Download PDF
                </a>
              </div>
            </div>
          </div>

          <!-- Placeholder for other membership forms -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="bg-gradient-to-r from-primary-gold to-primary-gold-light text-primary-blue-darker p-6">
              <div class="flex items-center">
                <div class="bg-white text-primary-gold w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-address-card text-lg"></i>
                </div>
                <div>
                  <h4 class="font-cinzel text-lg font-bold">Membership Information</h4>
                  <p class="text-primary-blue text-sm">Information Sheet</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-6 text-sm leading-relaxed">
                Comprehensive information about membership requirements, benefits, and the process of joining our lodge.
              </p>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">Coming soon</span>
                <button disabled 
                        class="bg-gray-300 text-gray-500 font-semibold px-4 py-2 rounded-lg cursor-not-allowed text-sm">
                  <i class="fas fa-clock mr-2"></i>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          <!-- Demit/Transfer Form -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="bg-gradient-to-r from-neutral-dark to-gray-600 text-white p-6">
              <div class="flex items-center">
                <div class="bg-primary-gold text-primary-blue-darker w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-exchange-alt text-lg"></i>
                </div>
                <div>
                  <h4 class="font-cinzel text-lg font-bold">Transfer/Demit Forms</h4>
                  <p class="text-primary-gold-light text-sm">Member Services</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-6 text-sm leading-relaxed">
                Forms for members transferring to or from other lodges, or requesting demits.
              </p>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">Contact Secretary</span>
                <a routerLink="/contact" 
                   class="bg-neutral-dark hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition inline-flex items-center text-sm">
                  <i class="fas fa-envelope mr-2"></i>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lodge Business Forms -->
      <div class="mb-16">
        <div class="text-center mb-8">
          <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-4">
            <i class="fas fa-building text-primary-gold mr-3"></i>
            Lodge Business Forms
          </h3>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Forms for lodge operations, events, and administrative purposes.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <div class="flex items-center mb-4">
              <div class="bg-primary-blue text-white w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <i class="fas fa-calendar-check text-lg"></i>
              </div>
              <div>
                <h4 class="font-cinzel text-lg font-bold text-primary-blue">Event Registration</h4>
                <p class="text-gray-600 text-sm">Lodge events and activities</p>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-4">
              Registration forms for special lodge events, dinners, and activities.
            </p>
            <button disabled 
                    class="bg-gray-300 text-gray-500 font-semibold px-4 py-2 rounded-lg cursor-not-allowed text-sm">
              <i class="fas fa-clock mr-2"></i>
              Coming Soon
            </button>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <div class="flex items-center mb-4">
              <div class="bg-primary-gold text-primary-blue-darker w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <i class="fas fa-hand-holding-heart text-lg"></i>
              </div>
              <div>
                <h4 class="font-cinzel text-lg font-bold text-primary-blue">Charitable Requests</h4>
                <p class="text-gray-600 text-sm">Relief and assistance</p>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-4">
              Forms for requesting charitable assistance or submitting charitable project proposals.
            </p>
            <a routerLink="/contact" 
               class="bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold px-4 py-2 rounded-lg transition inline-flex items-center text-sm">
              <i class="fas fa-envelope mr-2"></i>
              Contact Secretary
            </a>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-gradient-to-r from-neutral-light to-white rounded-lg p-8 shadow-md">
        <div class="text-center">
          <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-6">
            <i class="fas fa-question-circle text-primary-gold mr-3"></i>
            Need Help with Forms?
          </h3>
          <p class="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
            If you need assistance completing any forms or have questions about the membership process, 
            our Secretary and officers are here to help. Contact us or visit during our regular meetings.
          </p>
          
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="bg-primary-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-envelope text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Email Us</h4>
              <p class="text-gray-600 text-sm mb-3">Get help via email</p>
              <a href="mailto:secretary&#64;stpete139.org" 
                 class="text-primary-blue hover:text-primary-gold font-medium text-sm">
                secretary&#64;stpete139.org
              </a>
            </div>
            
            <div class="text-center">
              <div class="bg-primary-gold text-primary-blue-darker w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-phone text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Call Us</h4>
              <p class="text-gray-600 text-sm mb-3">Speak with our Secretary</p>
              <a href="tel:+17274183356" 
                 class="text-primary-blue hover:text-primary-gold font-medium text-sm">
                (727) 418-3356
              </a>
            </div>
            
            <div class="text-center">
              <div class="bg-primary-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-calendar text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Visit Us</h4>
              <p class="text-gray-600 text-sm mb-3">3rd Tuesday each month</p>
              <p class="text-primary-blue font-medium text-sm">
                Dinner 6:30 PM | Meeting 7:30 PM
              </p>
            </div>
          </div>
          
          <div class="text-center">
            <a routerLink="/contact" 
               class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center">
              <i class="fas fa-info-circle mr-2"></i>
              More Contact Information
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FormsComponent {
  // Future: Add forms data array when more forms become available
}