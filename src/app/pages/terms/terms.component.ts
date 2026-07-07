import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Terms of Service</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Terms of Service</h1>
      </div>
    </section>

    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto bg-neutral-light border border-gray-200 rounded-lg p-8 shadow-sm space-y-4">
          <p class="text-gray-800 leading-relaxed text-base md:text-lg">
            By using this website, you agree to use it for lawful purposes and in a way that
            does not infringe the rights of, restrict, or inhibit anyone else from using the site.
          </p>
          <p class="text-gray-800 leading-relaxed text-base md:text-lg">
            Content is provided for general informational purposes. For official lodge business,
            meeting details, or membership inquiries, please contact St. Petersburg Lodge No. 139 directly.
          </p>
        </div>
      </div>
    </section>
  `
})
export class TermsComponent {}
