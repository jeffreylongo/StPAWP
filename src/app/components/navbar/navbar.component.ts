import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
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
  
  @ViewChild('aboutDropdownButton', { static: false }) aboutDropdownButton?: ElementRef;

  // Navigation menu items based on stpetelodge139.org structure
  aboutMenuItems: NavigationItem[] = [
    { label: 'About 139', route: '/about-139' },
    { label: 'Lodge 139 History', route: '/history' },
    { label: 'Lodge 139 Past Masters', route: '/past-masters' },
    { label: 'Lodge Officers', route: '/officers' },
    { label: 'How To Become A Mason', route: '/becoming-mason' },
    { label: 'Forms & Petitions', route: '/forms' },
    { label: 'Dues & Donations', route: '/dues-donations' }
  ];

  mainMenuItems: NavigationItem[] = [
    { label: 'THE SECRETARY\'S OFFICE', route: '/secretary-office' },
    { label: 'EVENTS', route: '/calendar' },
    { label: 'CONTACT US', route: '/contact' }
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
    
    // Position the fixed dropdown menu
    if (this.isAboutDropdownOpen && this.aboutDropdownButton) {
      setTimeout(() => {
        const button = this.aboutDropdownButton!.nativeElement;
        const dropdown = document.querySelector('.dropdown-menu.show') as HTMLElement;
        
        if (dropdown) {
          const buttonRect = button.getBoundingClientRect();
          dropdown.style.top = `${buttonRect.bottom}px`;
          dropdown.style.left = `${buttonRect.left}px`;
        }
      }, 0);
    }
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