import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Header Section -->
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Contact</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p class="text-xl mt-4 text-primary-gold">Get in touch with St. Petersburg Lodge No. 139</p>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid lg:grid-cols-2 gap-12">
        
        <!-- Contact Form -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="font-cinzel text-2xl font-bold text-primary-blue mb-6">
            <i class="fas fa-envelope mr-3"></i>Send Us a Message
          </h2>
          <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.name"
                  name="name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
                  placeholder="Your full name">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  [(ngModel)]="formData.email"
                  name="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
                  placeholder="your.email@example.com">
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input 
                  type="tel" 
                  [(ngModel)]="formData.phone"
                  name="phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
                  placeholder="(727) 123-4567">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select 
                  [(ngModel)]="formData.subject"
                  name="subject"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors">
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="membership">Membership Information</option>
                  <option value="meeting">Meeting Information</option>
                  <option value="dues">Dues & Donations</option>
                  <option value="events">Events & Activities</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea 
                [(ngModel)]="formData.message"
                name="message"
                required
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
                placeholder="Please share your message or inquiry..."></textarea>
            </div>
            
            <button 
              type="submit"
              [disabled]="!contactForm.form.valid || isSubmitting"
              class="w-full bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-paper-plane mr-2"></i>
              <span *ngIf="!isSubmitting">Send Message</span>
              <span *ngIf="isSubmitting">Sending...</span>
            </button>
          </form>
        </div>
        
        <!-- Contact Information -->
        <div class="space-y-8">
          
          <!-- Lodge Information -->
          <div class="bg-neutral-light rounded-lg p-6">
            <h2 class="font-cinzel text-2xl font-bold text-primary-blue mb-6">
              <i class="fas fa-building mr-3"></i>Lodge Information
            </h2>
            
            <!-- Address -->
            <div class="mb-6">
              <h3 class="font-semibold text-lg text-gray-800 mb-2">
                <i class="fas fa-map-marker-alt text-primary-gold mr-2"></i>Lodge Location
              </h3>
              <p class="text-gray-600 leading-relaxed">
                <strong>Temporarily Located at:</strong><br>
                3325 1st St. NE<br>
                St. Petersburg, FL 33704
              </p>
              <a href="https://maps.google.com/?q=3325+1st+St+NE,+St.+Petersburg,+FL+33704" 
                 target="_blank"
                 class="text-primary-blue hover:text-primary-gold text-sm font-medium inline-flex items-center mt-2 transition-colors">
                <i class="fas fa-external-link-alt mr-1"></i>View on Google Maps
              </a>
            </div>
            
            <!-- Phone -->
            <div class="mb-6">
              <h3 class="font-semibold text-lg text-gray-800 mb-2">
                <i class="fas fa-phone text-primary-gold mr-2"></i>Phone
              </h3>
              <a href="tel:+17274183356" 
                 class="text-gray-600 hover:text-primary-blue text-lg transition-colors">
                (727) 418-3356
              </a>
            </div>
            
            <!-- Email -->
            <div>
              <h3 class="font-semibold text-lg text-gray-800 mb-2">
                <i class="fas fa-envelope text-primary-gold mr-2"></i>Email
              </h3>
              <a href="mailto:secretary&#64;stpete139.org" 
                 class="text-gray-600 hover:text-primary-blue transition-colors">
                secretary&#64;stpete139.org
              </a>
            </div>
          </div>
          
          <!-- Meeting Times -->
          <div class="bg-primary-blue text-white rounded-lg p-6">
            <h2 class="font-cinzel text-2xl font-bold mb-6">
              <i class="fas fa-calendar-alt mr-3"></i>Meeting Schedule
            </h2>
            
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="bg-primary-gold text-primary-blue rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-handshake text-lg"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-lg mb-1">Stated Communication</h3>
                  <p class="text-primary-gold font-medium">Third Tuesday of Each Month</p>
                  <p class="text-sm opacity-90">Dinner at 6:30 PM | Meeting at 7:30 PM</p>
                </div>
              </div>
              
              <div class="bg-primary-blue-dark rounded p-4 mt-4">
                <p class="text-sm text-center">
                  <i class="fas fa-info-circle mr-2"></i>
                  All Master Masons in good standing are welcome to attend our meetings.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Secretary Information -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="font-cinzel text-2xl font-bold text-primary-blue mb-6">
              <i class="fas fa-user-tie mr-3"></i>Lodge Secretary
            </h2>
            
            <div class="space-y-4">
              <div>
                <h3 class="font-semibold text-lg text-gray-800 mb-2">Office Hours</h3>
                <p class="text-gray-600">
                  Available by appointment<br>
                  Please call or email to schedule
                </p>
              </div>
              
              <div>
                <h3 class="font-semibold text-lg text-gray-800 mb-2">Correspondence</h3>
                <p class="text-gray-600 text-sm leading-relaxed">
                  For membership inquiries, dues payments, or general lodge business, 
                  please contact the Secretary's office using the information above.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div class="bg-gradient-to-br from-primary-gold to-primary-gold-light text-primary-blue rounded-lg p-6">
            <h2 class="font-cinzel text-2xl font-bold mb-6">
              <i class="fas fa-link mr-3"></i>Quick Links
            </h2>
            
            <div class="grid grid-cols-2 gap-4">
              <a routerLink="/dues-donations" 
                 class="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded text-center transition-all hover:transform hover:-translate-y-1 shadow-md">
                <i class="fas fa-credit-card text-xl mb-2 block"></i>
                <span class="text-sm font-medium">Pay Dues</span>
              </a>
              
              <a routerLink="/calendar" 
                 class="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded text-center transition-all hover:transform hover:-translate-y-1 shadow-md">
                <i class="fas fa-calendar text-xl mb-2 block"></i>
                <span class="text-sm font-medium">Calendar</span>
              </a>
              
              <a routerLink="/becoming-mason" 
                 class="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded text-center transition-all hover:transform hover:-translate-y-1 shadow-md">
                <i class="fas fa-question-circle text-xl mb-2 block"></i>
                <span class="text-sm font-medium">Join Us</span>
              </a>
              
              <a routerLink="/forms" 
                 class="bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded text-center transition-all hover:transform hover:-translate-y-1 shadow-md">
                <i class="fas fa-file-alt text-xl mb-2 block"></i>
                <span class="text-sm font-medium">Forms</span>
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-card {
      transition: transform 0.2s ease;
    }
    
    .contact-card:hover {
      transform: translateY(-2px);
    }
    
    input:focus, textarea:focus, select:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .quick-link {
      transition: all 0.2s ease;
    }
    
    .quick-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class ContactComponent {
  formData: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };
  
  isSubmitting = false;
  
  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', this.formData);
      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      this.formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };
      
      this.isSubmitting = false;
    }, 1000);
  }
}