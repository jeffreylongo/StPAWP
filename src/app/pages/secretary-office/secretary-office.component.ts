import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-secretary-office',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">The Secretary's Office</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">The Secretary's Office</h1>
        <p class="text-lg mt-4 text-primary-gold-light">Communications and Updates from the Lodge Secretary</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <div class="flex items-center mb-6">
            <i class="fas fa-user-tie text-primary-gold text-3xl mr-4"></i>
            <div>
              <h2 class="font-cinzel text-2xl text-primary-blue font-bold">From the Secretary's Desk</h2>
              <p class="text-gray-600">Stay informed with the latest lodge communications</p>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed">
            Welcome to the Secretary's Office. Here you'll find important updates about our lodge activities, 
            meeting summaries, upcoming events, and special announcements. We encourage all members to stay 
            connected with lodge activities and participate in our fraternal fellowship.
          </p>
        </div>
      </div>

      <!-- Secretary's Updates Sections -->
      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <!-- What You Missed -->
        <div class="bg-neutral-light border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-blue text-white p-6">
            <div class="flex items-center">
              <i class="fas fa-history text-primary-gold text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">What You Missed at the Last Meeting</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="border-l-4 border-primary-gold pl-4">
                <h4 class="font-semibold text-primary-blue mb-2">December Stated Communication</h4>
                <p class="text-gray-700 text-sm mb-2">December 17, 2024</p>
                <ul class="text-gray-600 space-y-1 text-sm">
                  <li>• Approved minutes from November meeting</li>
                  <li>• Discussed upcoming charity drive</li>
                  <li>• Planned January officer installation</li>
                  <li>• Welcomed visiting brethren from Lodge 25</li>
                </ul>
              </div>
              <div class="border-l-4 border-primary-blue pl-4">
                <h4 class="font-semibold text-primary-blue mb-2">Fellowship Dinner</h4>
                <p class="text-gray-700 text-sm mb-2">December 17, 2024</p>
                <p class="text-gray-600 text-sm">
                  Excellent turnout with 45 members and guests enjoying a traditional holiday meal 
                  prepared by our kitchen committee.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- What You Will Miss -->
        <div class="bg-neutral-light border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-gold text-primary-blue-darker p-6">
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-primary-blue-darker text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">What You Will Miss if You Don't Attend the Next Meeting</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="border-l-4 border-primary-blue pl-4">
                <h4 class="font-semibold text-primary-blue mb-2">January Stated Communication</h4>
                <p class="text-gray-700 text-sm mb-2">January 21, 2025 - 7:30 PM</p>
                <ul class="text-gray-600 space-y-1 text-sm">
                  <li>• Installation of 2025 Officers</li>
                  <li>• Presentation of annual awards</li>
                  <li>• Discussion of lodge improvement projects</li>
                  <li>• Special guest speaker on Masonic history</li>
                </ul>
              </div>
              <div class="bg-primary-gold-light p-3 rounded">
                <p class="text-primary-blue-darker text-sm font-medium">
                  <i class="fas fa-star mr-2"></i>
                  Don't miss the installation ceremony - a cornerstone event of our Masonic year!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coming Months -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-md mb-12">
        <div class="bg-primary-blue-dark text-white p-6">
          <div class="flex items-center">
            <i class="fas fa-calendar-alt text-primary-gold text-2xl mr-3"></i>
            <h3 class="font-cinzel text-xl font-bold">What You Can Look Forward to in the Coming Months</h3>
          </div>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="bg-primary-gold text-primary-blue-darker rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <i class="fas fa-gavel text-xl"></i>
              </div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-2">February</h4>
              <p class="text-gray-600 text-sm">
                Degree work and candidate advancement ceremonies
              </p>
            </div>
            <div class="text-center">
              <div class="bg-primary-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <i class="fas fa-heart text-xl"></i>
              </div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-2">March</h4>
              <p class="text-gray-600 text-sm">
                Annual charity fundraiser and community outreach events
              </p>
            </div>
            <div class="text-center">
              <div class="bg-primary-gold text-primary-blue-darker rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <i class="fas fa-graduation-cap text-xl"></i>
              </div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-2">April</h4>
              <p class="text-gray-600 text-sm">
                Masonic education series and guest lectures
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Birthdays and Anniversaries -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-md">
        <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
          <div class="flex items-center">
            <i class="fas fa-birthday-cake text-primary-gold text-2xl mr-3"></i>
            <h3 class="font-cinzel text-xl font-bold">Birthdays and Masonic Anniversaries</h3>
          </div>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- January Birthdays -->
            <div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-4 flex items-center">
                <i class="fas fa-gift text-primary-gold mr-2"></i>
                January Birthdays
              </h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-neutral-light rounded">
                  <span class="font-medium">Brother John Smith</span>
                  <span class="text-sm text-gray-600">January 5th</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-neutral-light rounded">
                  <span class="font-medium">Brother Michael Johnson</span>
                  <span class="text-sm text-gray-600">January 12th</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-neutral-light rounded">
                  <span class="font-medium">Brother David Wilson</span>
                  <span class="text-sm text-gray-600">January 28th</span>
                </div>
              </div>
            </div>

            <!-- Masonic Anniversaries -->
            <div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-4 flex items-center">
                <i class="fas fa-medal text-primary-gold mr-2"></i>
                Masonic Anniversaries
              </h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-primary-gold-light rounded">
                  <div>
                    <span class="font-medium block">Brother Robert Davis</span>
                    <span class="text-xs text-gray-600">25 Years - Silver Anniversary</span>
                  </div>
                  <span class="text-sm text-primary-blue font-bold">Jan 15</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-primary-gold-light rounded">
                  <div>
                    <span class="font-medium block">Brother James Miller</span>
                    <span class="text-xs text-gray-600">10 Years</span>
                  </div>
                  <span class="text-sm text-primary-blue font-bold">Jan 22</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Secretary -->
      <div class="mt-12 text-center">
        <div class="bg-primary-blue text-white p-8 rounded-lg">
          <h3 class="font-cinzel text-2xl font-bold mb-4">Questions or Concerns?</h3>
          <p class="mb-6 text-primary-gold-light">
            The Secretary's Office is here to help. Don't hesitate to reach out with any questions about lodge activities or membership.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:secretary@stpetelodge139.org" 
               class="bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold px-6 py-3 rounded transition inline-flex items-center">
              <i class="fas fa-envelope mr-2"></i>
              Email the Secretary
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
export class SecretaryOfficeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
