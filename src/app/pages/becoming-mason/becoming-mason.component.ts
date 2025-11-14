import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MasonicQuoteComponent } from '../../shared/components/masonic-quote/masonic-quote.component';

@Component({
  selector: 'app-becoming-mason',
  standalone: true,
  imports: [CommonModule, RouterModule, MasonicQuoteComponent],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Become a Mason</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Become a Mason</h1>
        <p class="text-primary-gold-light text-xl mt-4">Begin Your Journey in Freemasonry</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction Section -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="text-center mb-12">
          <i class="fas fa-compass text-6xl text-primary-gold mb-6"></i>
          <h2 class="font-cinzel text-3xl font-bold text-primary-blue mb-6">Ready to Begin Your Masonic Journey?</h2>
          <div class="w-24 h-1 bg-primary-gold mx-auto mb-8"></div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg shadow-md p-8 mb-12">
          <p class="text-lg text-gray-700 mb-6 leading-relaxed">
            Are you interested in learning more about Freemasonry and/or joining the fraternity? If so, stop by and join us for dinner any third Tuesday. We'd love to meet you and tell you about the work we do. Freemasonry is a journey, and takes hard work and commitment.
          </p>
          
          <p class="text-lg text-gray-700 leading-relaxed">
            Masons are men of good character who strive to improve themselves and make the world a better place. The Masonic experience encourages members to become better men, better husbands, better fathers, and better citizens. Masons represent virtually every occupation and profession, yet within the Fraternity, all meet as equals.
          </p>
        </div>
      </div>

      <!-- Qualifications Section -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white rounded-lg p-8 mb-8">
          <h3 class="font-cinzel text-2xl font-bold mb-6 text-center">
            <i class="fas fa-check-circle text-primary-gold mr-3"></i>
            Qualifications to Join
          </h3>
          <p class="text-center text-primary-gold-light mb-8">
            To join St. Petersburg Lodge 139 and begin your journey in Freemasonry you must have the following qualifications:
          </p>
          
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="bg-primary-gold text-primary-blue-darker w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-user text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-gold mb-2">Age & Physical</h4>
              <p class="text-primary-gold-light text-sm">
                Be an able-bodied man at least 18 years old
              </p>
            </div>
            
            <div class="text-center">
              <div class="bg-primary-gold text-primary-blue-darker w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-praying-hands text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-gold mb-2">Faith</h4>
              <p class="text-primary-gold-light text-sm">
                Possess a belief in a supreme being, in whatever form or name
              </p>
            </div>
            
            <div class="text-center">
              <div class="bg-primary-gold text-primary-blue-darker w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-heart text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-gold mb-2">Character</h4>
              <p class="text-primary-gold-light text-sm">
                Be of good moral character
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Meeting Information Section -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="bg-neutral-light rounded-lg p-8 shadow-md">
          <div class="text-center mb-8">
            <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-4">
              <i class="fas fa-calendar-alt text-primary-gold mr-3"></i>
              Join Us for Dinner & Fellowship
            </h3>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-4">When We Meet</h4>
              <div class="space-y-3">
                <div class="flex items-center">
                  <i class="fas fa-clock text-primary-gold mr-3"></i>
                  <span class="font-semibold">Third Tuesday of every month</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-utensils text-primary-gold mr-3"></i>
                  <span>Dinner and fellowship at 6:30 PM</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-gavel text-primary-gold mr-3"></i>
                  <span>Meeting to follow</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-4">Where We Meet</h4>
              <div class="space-y-3">
                <div class="flex items-start">
                  <i class="fas fa-map-marker-alt text-primary-gold mr-3 mt-1"></i>
                  <div>
                    <p class="font-semibold">Temporarily Located at:</p>
                    <p>3325 1st St NE</p>
                    <p>St. Petersburg, FL 33704</p>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <a href="https://maps.google.com/?q=3325+1st+St+NE,+St.+Petersburg,+FL+33704"
                   target="_blank"
                   class="text-primary-blue hover:text-primary-gold font-medium inline-flex items-center transition-colors">
                  <i class="fas fa-external-link-alt mr-2"></i>View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action Section -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <div class="text-center mb-8">
            <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-4">Take the Next Step</h3>
            <div class="w-16 h-1 bg-primary-gold mx-auto mb-6"></div>
            <p class="text-gray-600 text-lg">
              Ready to begin your Masonic journey? Here's how to get started:
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="text-center">
              <div class="bg-primary-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-file-download text-2xl"></i>
              </div>
              <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-3">Download a Petition</h4>
              <p class="text-gray-600 mb-4">
                Complete and submit your petition for membership to begin the process.
              </p>
              <a href="http://stpetelodge139.org/wp-content/uploads/2023/11/On-Line-Petition-For-Membership.pdf" 
                 target="_blank"
                 rel="noopener noreferrer"
                 class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-6 py-3 rounded-lg transition inline-flex items-center">
                <i class="fas fa-download mr-2"></i>
                Download Petition PDF
              </a>
            </div>
            
            <div class="text-center">
              <div class="bg-primary-gold text-primary-blue-darker w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-envelope text-2xl"></i>
              </div>
              <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-3">Contact Our Secretary</h4>
              <p class="text-gray-600 mb-4">
                Have questions? Our Secretary is here to help guide you through the process.
              </p>
              <a href="mailto:secretary&#64;stpete139.org" 
                 class="bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold px-6 py-3 rounded-lg transition inline-flex items-center">
                <i class="fas fa-envelope mr-2"></i>
                Send Email
              </a>
            </div>
          </div>
          
          <div class="text-center">
            <p class="text-gray-600 mb-4">
              Or visit us on any third Tuesday for dinner and to learn more about our lodge.
            </p>
            <a routerLink="/contact" 
               class="border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white px-8 py-3 rounded-lg transition inline-flex items-center">
              <i class="fas fa-info-circle mr-2"></i>
              More Contact Information
            </a>
          </div>
        </div>
      </div>

      <!-- What to Expect Section -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="bg-gradient-to-r from-neutral-light to-white rounded-lg p-8 shadow-md">
          <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-6 text-center">
            <i class="fas fa-lightbulb text-primary-gold mr-3"></i>
            What to Expect
          </h3>
          
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="bg-primary-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="font-bold">1</span>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Visit & Learn</h4>
              <p class="text-gray-600 text-sm">
                Join us for dinner and learn about our lodge, our values, and what Freemasonry means to us.
              </p>
            </div>
            
            <div class="text-center">
              <div class="bg-primary-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="font-bold">2</span>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Submit Petition</h4>
              <p class="text-gray-600 text-sm">
                Complete your petition with the support of two lodge members who will serve as your sponsors.
              </p>
            </div>
            
            <div class="text-center">
              <div class="bg-primary-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="font-bold">3</span>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Begin Journey</h4>
              <p class="text-gray-600 text-sm">
                Once accepted, begin your Masonic education and journey through the three degrees of Freemasonry.
              </p>
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <p class="text-primary-blue font-semibold text-lg">
              "Freemasonry takes good men and makes them better."
            </p>
          </div>
        </div>
      </div>

      <!-- Masonic Quote Section -->
      <div class="max-w-4xl mx-auto">
        <app-masonic-quote variant="section" [autoRotate]="true" [rotateInterval]="30000"></app-masonic-quote>
      </div>
    </div>
  `
})
export class BecomingMasonComponent {}