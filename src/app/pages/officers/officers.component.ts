import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-officers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Officers</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Lodge Officers</h1>
        <p class="text-primary-gold-light text-xl mt-4">2025 Masonic Year</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction -->
      <div class="text-center mb-16">
        <h2 class="font-cinzel text-3xl font-bold text-primary-blue mb-6">Our Leadership</h2>
        <div class="w-24 h-1 bg-primary-gold mx-auto mb-8"></div>
        <p class="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
          The officers of St. Petersburg Lodge No. 139 are elected and appointed annually to serve the lodge and its members. 
          Each officer has specific duties and responsibilities that contribute to the smooth operation and rich traditions of our lodge.
        </p>
      </div>

      <!-- Principal Officers -->
      <div class="mb-16">
        <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-8 text-center">Principal Officers</h3>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Worshipful Master -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <img src="assets/officers/Val WM 4.jpg" 
                   alt="Worshipful Master Valentino Pine" 
                   class="w-full h-80 object-cover object-top">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-blue-dark via-transparent to-transparent opacity-70"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <div class="bg-primary-gold text-primary-blue-darker px-4 py-2 rounded-full font-bold mb-3">
                  <i class="fas fa-gavel mr-2"></i>Worshipful Master
                </div>
              </div>
            </div>
            <div class="p-6">
              <h4 class="font-cinzel text-2xl font-bold text-primary-blue mb-2">Worshipful Brother Valentino Pine</h4>
              <div class="flex items-center text-primary-gold mb-4">
                <i class="fas fa-phone mr-2"></i>
                <span class="text-sm">(727) 637-3106</span>
              </div>
              <p class="text-gray-600 mb-4 leading-relaxed">
                Leading our lodge with wisdom and dedication to Masonic principles and traditions.
              </p>
            </div>
          </div>

          <!-- Senior Warden -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <img src="assets/officers/Ricardo Senior Warden.jpg" 
                   alt="Senior Warden Ricardo Colon-Marquez" 
                   class="w-full h-80 object-cover object-top">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-blue-dark via-transparent to-transparent opacity-70"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <div class="bg-primary-gold text-primary-blue-darker px-4 py-2 rounded-full font-bold mb-3">
                  <i class="fas fa-sun mr-2"></i>Senior Warden
                </div>
              </div>
            </div>
            <div class="p-6">
              <h4 class="font-cinzel text-2xl font-bold text-primary-blue mb-2">Brother Ricardo Colon-Marquez</h4>
              <div class="flex items-center text-primary-gold mb-4">
                <i class="fas fa-phone mr-2"></i>
                <span class="text-sm">(315) 412-1672</span>
              </div>
              <p class="text-gray-600 mb-4 leading-relaxed">
                Supporting the Worshipful Master and assisting with lodge operations and activities.
              </p>
            </div>
          </div>

          <!-- Junior Warden -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <img src="assets/officers/Alan Rosenthal Junior Warden 1.jpg" 
                   alt="Junior Warden Alan Rosenthal" 
                   class="w-full h-80 object-cover object-top">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-blue-dark via-transparent to-transparent opacity-70"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <div class="bg-primary-gold text-primary-blue-darker px-4 py-2 rounded-full font-bold mb-3">
                  <i class="fas fa-moon mr-2"></i>Junior Warden
                </div>
              </div>
            </div>
            <div class="p-6">
              <h4 class="font-cinzel text-2xl font-bold text-primary-blue mb-2">Brother Alan Rosenthal</h4>
              <div class="flex items-center text-primary-gold mb-4">
                <i class="fas fa-phone mr-2"></i>
                <span class="text-sm">(727) 504-7310</span>
              </div>
              <p class="text-gray-600 mb-4 leading-relaxed">
                Supporting the brethren and assisting with lodge harmony and fellowship activities.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lodge Officers -->
      <div class="mb-16">
        <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-8 text-center">Lodge Officers</h3>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Secretary -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <div class="w-full h-64 bg-gradient-to-br from-primary-blue to-primary-blue-dark flex items-center justify-center">
                <div class="text-center text-white">
                  <i class="fas fa-pen-fancy text-6xl mb-4 opacity-70"></i>
                  <p class="text-sm opacity-80">Photo Coming Soon</p>
                </div>
              </div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Secretary
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother John Livingston</h4>
              <div class="flex items-center text-primary-gold mb-3 text-xs">
                <i class="fas fa-phone mr-2"></i>
                <span>(727) 418-3356</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">
                Supporting lodge administration and record keeping.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-file-alt mr-2"></i>
                <span>Records & Administration</span>
              </div>
            </div>
          </div>

          <!-- Treasurer -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <div class="w-full h-64 bg-gradient-to-br from-primary-blue to-primary-blue-dark flex items-center justify-center">
                <div class="text-center text-white">
                  <i class="fas fa-coins text-6xl mb-4 opacity-70"></i>
                  <p class="text-sm opacity-80">Photo Coming Soon</p>
                </div>
              </div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Treasurer
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother Michael Mignon</h4>
              <p class="text-gray-600 text-sm mb-3">
                Assisting with lodge financial matters and transactions.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-calculator mr-2"></i>
                <span>Financial Management</span>
              </div>
            </div>
          </div>

          <!-- Chaplain -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <div class="w-full h-64 bg-gradient-to-br from-primary-blue to-primary-blue-dark flex items-center justify-center">
                <div class="text-center text-white">
                  <i class="fas fa-pray text-6xl mb-4 opacity-70"></i>
                  <p class="text-sm opacity-80">Photo Coming Soon</p>
                </div>
              </div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Chaplain
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother Leo Laskin</h4>
              <p class="text-gray-600 text-sm mb-3">
                Supporting lodge spiritual activities and ceremonies.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-hands-praying mr-2"></i>
                <span>Spiritual Guidance</span>
              </div>
            </div>
          </div>

          <!-- Marshall -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <div class="w-full h-64 bg-gradient-to-br from-primary-blue to-primary-blue-dark flex items-center justify-center">
                <div class="text-center text-white">
                  <i class="fas fa-flag text-6xl mb-4 opacity-70"></i>
                  <p class="text-sm opacity-80">Photo Coming Soon</p>
                </div>
              </div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Marshall
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother Chris Webb</h4>
              <p class="text-gray-600 text-sm mb-3">
                Assisting with lodge order and ceremonial activities.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-users-cog mr-2"></i>
                <span>Order & Ceremony</span>
              </div>
            </div>
          </div>

          <!-- Senior Deacon -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <div class="w-full h-64 bg-gradient-to-br from-primary-blue to-primary-blue-dark flex items-center justify-center">
                <div class="text-center text-white">
                  <i class="fas fa-handshake text-6xl mb-4 opacity-70"></i>
                  <p class="text-sm opacity-80">Photo Coming Soon</p>
                </div>
              </div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Senior Deacon
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother Craig Hull</h4>
              <p class="text-gray-600 text-sm mb-3">
                Supporting the Worshipful Master and lodge activities.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-route mr-2"></i>
                <span>Guidance & Assistance</span>
              </div>
            </div>
          </div>

          <!-- Junior Deacon -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <img src="assets/officers/Steven Stamberger Junior Deacon 1.jpg" 
                   alt="Junior Deacon Steve Stamberger" 
                   class="w-full h-64 object-cover object-top">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-blue-dark via-transparent to-transparent opacity-60"></div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Junior Deacon
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother Steve Stamberger</h4>
              <p class="text-gray-600 text-sm mb-3">
                Assisting with lodge ceremonies and activities.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-walking mr-2"></i>
                <span>Messenger & Guide</span>
              </div>
            </div>
          </div>

          <!-- Senior Steward -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <img src="assets/officers/Jeff Senior Steward.jpg" 
                   alt="Senior Steward Jeffrey Longo" 
                   class="w-full h-64 object-cover object-top">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-blue-dark via-transparent to-transparent opacity-60"></div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Senior Steward
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother Jeffrey Longo</h4>
              <p class="text-gray-600 text-sm mb-3">
                Supporting lodge functions and fellowship.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-utensils mr-2"></i>
                <span>Hospitality & Service</span>
              </div>
            </div>
          </div>

          <!-- Junior Steward -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <img src="assets/officers/Henry Junior Steward.jpg" 
                   alt="Junior Steward Henry Swett" 
                   class="w-full h-64 object-cover object-top">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-blue-dark via-transparent to-transparent opacity-60"></div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Junior Steward
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother Henry Swett</h4>
              <p class="text-gray-600 text-sm mb-3">
                Assisting with lodge activities and brotherhood.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-hands-helping mr-2"></i>
                <span>Fellowship & Support</span>
              </div>
            </div>
          </div>

          <!-- Tyler -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <div class="w-full h-64 bg-gradient-to-br from-primary-blue to-primary-blue-dark flex items-center justify-center">
                <div class="text-center text-white">
                  <i class="fas fa-shield-alt text-6xl mb-4 opacity-70"></i>
                  <p class="text-sm opacity-80">Photo Coming Soon</p>
                </div>
              </div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Tyler
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother Justin King</h4>
              <p class="text-gray-600 text-sm mb-3">
                Supporting lodge security and activities.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-door-closed mr-2"></i>
                <span>Security & Guard</span>
              </div>
            </div>
          </div>

          <!-- Degree Master -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <img src="assets/officers/John Gunter Degree Master.jpg" 
                   alt="Degree Master John Gunter" 
                   class="w-full h-64 object-cover object-top">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-blue-dark via-transparent to-transparent opacity-60"></div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  Degree Master
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother John Gunter</h4>
              <p class="text-gray-600 text-sm mb-3">
                Supporting Masonic education and development.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-graduation-cap mr-2"></i>
                <span>Ritual & Education</span>
              </div>
            </div>
          </div>

          <!-- Petitions Committee Chairman -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <div class="w-full h-64 bg-gradient-to-br from-primary-gold to-primary-gold-light flex items-center justify-center">
                <div class="text-center text-primary-blue-darker">
                  <i class="fas fa-clipboard-list text-6xl mb-4 opacity-70"></i>
                  <p class="text-sm opacity-80">Photo Coming Soon</p>
                </div>
              </div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-gold text-primary-blue-darker px-3 py-1 rounded text-sm font-bold">
                  Petitions Chairman
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">Brother Chris Webb</h4>
              <div class="flex items-center text-primary-gold mb-3 text-xs">
                <i class="fas fa-phone mr-2"></i>
                <span>(727) 393-6007</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">
                Assisting with membership applications and new candidate processes.
              </p>
              <div class="flex items-center text-primary-gold text-sm">
                <i class="fas fa-user-plus mr-2"></i>
                <span>Membership & Applications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="text-center mt-16">
        <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-6">Questions About Our Lodge?</h3>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
          Our officers are always available to answer questions about Freemasonry, lodge activities, or membership opportunities.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/contact" 
             class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center justify-center">
            <i class="fas fa-envelope mr-2"></i>
            Contact Our Lodge
          </a>
          <a routerLink="/becoming-mason" 
             class="border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center justify-center">
            <i class="fas fa-handshake mr-2"></i>
            Learn About Membership
          </a>
        </div>
      </div>
    </div>
  `
})
export class OfficersComponent {}