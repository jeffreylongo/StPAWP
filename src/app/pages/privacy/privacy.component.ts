import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Privacy Policy</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Privacy Policy</h1>
      </div>
    </section>

    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-neutral-light border border-gray-200 rounded-lg p-8 shadow-sm">
          <p class="text-gray-800 leading-relaxed text-base md:text-lg">
            No mobile information will be shared with third parties/affiliates for
            marketing/promotional purposes. All the above categories exclude text messaging
            originator opt-in data and consent; this information will not be shared with any
            third parties.
          </p>
        </div>
      </div>
    </section>
  `
})
export class PrivacyComponent {}
