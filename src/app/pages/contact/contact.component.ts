import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Contact</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Contact Us</h1>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <p class="text-center text-lg mb-8">Get in touch with St. Petersburg Lodge No. 139</p>
    </div>
  `
})
export class ContactComponent {}