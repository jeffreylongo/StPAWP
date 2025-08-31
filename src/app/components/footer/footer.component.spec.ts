import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { FooterComponent } from './footer.component';
import { LodgeEmblemComponent } from '../lodge-emblem/lodge-emblem.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, ReactiveFormsModule, RouterTestingModule, LodgeEmblemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render lodge information', () => {
    const lodgeName = compiled.querySelector('.lodge-name');
    expect(lodgeName?.textContent?.trim()).toBe('St. Petersburg Lodge No. 139');
    
    const lodgeSubtitle = compiled.querySelector('.lodge-subtitle');
    expect(lodgeSubtitle?.textContent?.trim()).toBe('Free & Accepted Masons');
    
    const address = compiled.querySelector('.lodge-address');
    expect(address?.textContent).toContain('3325 1st St NE');
    expect(address?.textContent).toContain('St. Petersburg, FL 33704');
  });

  it('should render social media links', () => {
    const socialLinks = compiled.querySelectorAll('.social-link');
    expect(socialLinks.length).toBe(3);
    
    const facebookLink = Array.from(socialLinks).find(link => 
      link.getAttribute('aria-label') === 'Facebook'
    );
    expect(facebookLink).toBeTruthy();
  });

  it('should render quick links', () => {
    const quickLinksSection = compiled.querySelector('.footer-section');
    expect(quickLinksSection?.querySelector('.footer-title')?.textContent?.trim()).toBe('Quick Links');
    
    const quickLinks = compiled.querySelectorAll('.footer-link');
    expect(quickLinks.length).toBeGreaterThan(0);
  });

  it('should initialize contact form with validators', () => {
    expect(component.contactForm).toBeTruthy();
    expect(component.contactForm.get('name')?.hasError('required')).toBe(true);
    expect(component.contactForm.get('email')?.hasError('required')).toBe(true);
    expect(component.contactForm.get('message')?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should show validation errors for invalid fields', () => {
    const nameInput = compiled.querySelector('input[formControlName="name"]') as HTMLInputElement;
    const emailInput = compiled.querySelector('input[formControlName="email"]') as HTMLInputElement;
    
    // Trigger validation by marking fields as touched
    component.contactForm.get('name')?.markAsTouched();
    component.contactForm.get('email')?.markAsTouched();
    
    fixture.detectChanges();
    
    expect(component.isFieldInvalid('name')).toBe(true);
    expect(component.isFieldInvalid('email')).toBe(true);
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = compiled.querySelector('.submit-button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable submit button when form is valid', () => {
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    });
    
    fixture.detectChanges();
    
    const submitButton = compiled.querySelector('.submit-button') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  it('should handle form submission', () => {
    spyOn(component, 'onSubmit');
    
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message'
    });
    
    const form = compiled.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should show current year in copyright', () => {
    const currentYear = new Date().getFullYear();
    const copyright = compiled.querySelector('.copyright');
    
    expect(copyright?.textContent).toContain(currentYear.toString());
  });

  it('should render legal links', () => {
    const legalLinks = compiled.querySelectorAll('.legal-link');
    expect(legalLinks.length).toBeGreaterThan(0);
  });

  it('should show loading state during submission', () => {
    component.isSubmitting = true;
    fixture.detectChanges();
    
    const submitButton = compiled.querySelector('.submit-button');
    expect(submitButton?.textContent?.trim()).toBe('Sending...');
    
    const spinner = compiled.querySelector('.fa-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show success message after successful submission', () => {
    component.submitMessage = 'Message sent successfully!';
    component.submitSuccess = true;
    fixture.detectChanges();
    
    const message = compiled.querySelector('.submit-message');
    expect(message?.textContent?.trim()).toBe('Message sent successfully!');
    expect(message?.classList).toContain('success');
  });

  it('should show error message after failed submission', () => {
    component.submitMessage = 'Failed to send message. Please try again.';
    component.submitSuccess = false;
    fixture.detectChanges();
    
    const message = compiled.querySelector('.submit-message');
    expect(message?.textContent?.trim()).toBe('Failed to send message. Please try again.');
    expect(message?.classList).toContain('error');
  });

  it('should have proper accessibility attributes', () => {
    const socialLinks = compiled.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      expect(link.getAttribute('aria-label')).toBeTruthy();
    });
    
    const inputs = compiled.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      expect(input.getAttribute('placeholder')).toBeTruthy();
    });
  });
});
