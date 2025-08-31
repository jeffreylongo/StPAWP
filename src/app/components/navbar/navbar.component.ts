import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LodgeEmblemComponent } from '../lodge-emblem/lodge-emblem.component';
import { NavigationItem } from '../../interfaces';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LodgeEmblemComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isAboutDropdownOpen = false;

  // Navigation menu items
  aboutMenuItems: NavigationItem[] = [
    { label: 'About Our Lodge', route: '/about-139' },
    { label: 'Our History', route: '/history' },
    { label: 'Officers', route: '/officers' },
    { label: 'Past Masters', route: '/past-masters' },
    { label: 'Become a Mason', route: '/becoming-mason' },
    { label: 'Forms & Petitions', route: '/forms' }
  ];

  mainMenuItems: NavigationItem[] = [
    { label: 'CALENDAR', route: '/calendar' },
    { label: 'MEMBERS', route: '/members' },
    { label: 'SHOP', route: '/shop' },
    { label: 'CONTACT', route: '/contact' }
  ];

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.closeDropdowns();
    }
  }

  toggleAboutDropdown(): void {
    this.isAboutDropdownOpen = !this.isAboutDropdownOpen;
  }

  closeDropdowns(): void {
    this.isAboutDropdownOpen = false;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.closeDropdowns();
  }

  getMenuClasses(): string {
    const baseClasses = 'flex-col md:flex-row md:items-center gap-1 md:gap-2 text-sm font-medium w-full md:w-auto bg-primary-blue md:bg-transparent mt-2 md:mt-0 rounded overflow-hidden menu-transition';
    return `${baseClasses} ${this.isMenuOpen ? 'flex' : 'hidden md:flex'}`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const navbar = target.closest('app-navbar');
    
    if (!navbar) {
      this.closeDropdowns();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const target = event.target as Window;
    if (target.innerWidth >= 768) {
      this.isMenuOpen = false;
    }
  }
}