import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MasonicQuoteComponent } from '../../shared/components/masonic-quote/masonic-quote.component';
import { TextAlertBannerComponent } from '../../shared/components/text-alert-banner/text-alert-banner.component';

@Component({
  selector: 'app-becoming-mason',
  standalone: true,
  imports: [CommonModule, RouterModule, MasonicQuoteComponent, TextAlertBannerComponent],
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

    <app-text-alert-banner variant="section"></app-text-alert-banner>
    
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

      <!-- Petitions Section -->
      <div class="max-w-5xl mx-auto mb-16">
        <div class="text-center mb-10">
          <h3 class="font-cinzel text-3xl font-bold text-primary-blue mb-4">Petitions</h3>
          <div class="w-24 h-1 bg-primary-gold mx-auto mb-6"></div>
          <p class="text-gray-600 text-lg max-w-3xl mx-auto">
            New members should complete both forms below. Affiliation, dual, plural, and reinstatement petitions are available on our Forms &amp; Petitions page.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white border-2 border-primary-gold rounded-lg shadow-md overflow-hidden">
            <div class="bg-primary-blue text-white p-5">
              <p class="text-primary-gold text-xs font-bold uppercase tracking-wider mb-1">GL-601</p>
              <h4 class="font-cinzel text-xl font-bold">Petition for the Degrees of Freemasonry</h4>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-6">
                The official Grand Lodge petition to begin the process of joining St. Petersburg Lodge No. 139. Complete this form with two lodge members as sponsors.
              </p>
              <a href="assets/petitions/GL-601-PETITION-FOR-THE-DEGREES-OF-FREEMASONRY-1.pdf"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-6 py-3 rounded-lg transition inline-flex items-center">
                <i class="fas fa-download mr-2"></i>
                Download GL-601
              </a>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <div class="bg-primary-blue-dark text-white p-5">
              <p class="text-primary-gold text-xs font-bold uppercase tracking-wider mb-1">GL-602</p>
              <h4 class="font-cinzel text-xl font-bold">Supplementary Information</h4>
            </div>
            <div class="p-6">
              <p class="text-gray-600 mb-6">
                Submit this companion questionnaire with your GL-601 petition. It provides additional information for the Petitions Committee.
              </p>
              <a href="assets/petitions/GL-602-SUPPLEMENTARY-INFORMATION.pdf"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-6 py-3 rounded-lg transition inline-flex items-center">
                <i class="fas fa-download mr-2"></i>
                Download GL-602
              </a>
            </div>
          </div>
        </div>

        <div class="bg-neutral-light rounded-lg p-8">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-3">Already a Mason?</h4>
              <p class="text-gray-600 mb-4">
                Transfer, dual membership, plural membership, and reinstatement petitions are available for download.
              </p>
              <a routerLink="/forms"
                 class="bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold px-6 py-3 rounded-lg transition inline-flex items-center">
                <i class="fas fa-file-alt mr-2"></i>
                All Petitions &amp; Forms
              </a>
            </div>
            <div>
              <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-3">Questions?</h4>
              <p class="text-gray-600 mb-4">
                Our Secretary can help you choose the correct petition and walk you through the process.
              </p>
              <a href="mailto:secretary&#64;stpete139.org"
                 class="border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white px-6 py-3 rounded-lg transition inline-flex items-center">
                <i class="fas fa-envelope mr-2"></i>
                Email the Secretary
              </a>
            </div>
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
          
          <!--
          <div class="mt-8 text-center">
            <p class="text-primary-blue font-semibold text-lg">
              "Freemasonry takes good men and makes them better."
            </p>
          </div>
          -->
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