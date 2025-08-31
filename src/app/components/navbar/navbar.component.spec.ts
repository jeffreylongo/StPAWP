import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavbarComponent } from './navbar.component';
import { LodgeEmblemComponent } from '../lodge-emblem/lodge-emblem.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule, LodgeEmblemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render lodge name', () => {
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('St. Petersburg');
  });

  it('should render lodge number', () => {
    expect(compiled.querySelector('p')?.textContent?.trim()).toBe('Lodge No. 139 F&AM');
  });

  it('should toggle mobile menu', () => {
    const menuButton = compiled.querySelector('[aria-label="Toggle navigation menu"]') as HTMLButtonElement;
    
    expect(component.isMenuOpen).toBe(false);
    
    menuButton.click();
    fixture.detectChanges();
    
    expect(component.isMenuOpen).toBe(true);
  });

  it('should toggle about dropdown', () => {
    expect(component.isAboutDropdownOpen).toBe(false);
    
    component.toggleAboutDropdown();
    
    expect(component.isAboutDropdownOpen).toBe(true);
  });

  it('should close menu on window resize', () => {
    component.isMenuOpen = true;
    
    const resizeEvent = new Event('resize');
    Object.defineProperty(resizeEvent, 'target', {
      value: { innerWidth: 800 },
      enumerable: true
    });
    
    component.onResize(resizeEvent);
    
    expect(component.isMenuOpen).toBe(false);
  });

  it('should close dropdowns on document click outside', () => {
    component.isAboutDropdownOpen = true;
    
    const clickEvent = new Event('click');
    Object.defineProperty(clickEvent, 'target', {
      value: document.body,
      enumerable: true
    });
    
    component.onDocumentClick(clickEvent);
    
    expect(component.isAboutDropdownOpen).toBe(false);
  });

  it('should render all main menu items', () => {
    const menuItems = compiled.querySelectorAll('nav ul li a');
    const expectedItems = ['CALENDAR', 'MEMBERS', 'SHOP', 'CONTACT'];
    
    expectedItems.forEach((item, index) => {
      // Skip the about dropdown (first item)
      expect(menuItems[index + 1]?.textContent?.trim()).toBe(item);
    });
  });

  it('should have proper accessibility attributes', () => {
    const menuButton = compiled.querySelector('[aria-label="Toggle navigation menu"]');
    const aboutButton = compiled.querySelector('[aria-expanded]');
    
    expect(menuButton).toBeTruthy();
    expect(aboutButton).toBeTruthy();
    expect(aboutButton?.getAttribute('aria-expanded')).toBe('false');
  });
});
