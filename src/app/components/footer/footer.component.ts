import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LodgeEmblemComponent } from '../lodge-emblem/lodge-emblem.component';
import { NavigationItem } from '../../interfaces';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LodgeEmblemComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  contactForm: FormGroup;
  currentYear = new Date().getFullYear();
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  // Navigation links
  quickLinks: NavigationItem[] = [
    { label: 'Home', route: '/' },
    { label: 'About Our Lodge', route: '/about-139' },
    { label: 'Calendar', route: '/calendar' },
    { label: 'Officers', route: '/officers' },
    { label: 'Contact Us', route: '/contact' }
  ];

  masonicLinks: NavigationItem[] = [
    { label: 'Grand Lodge of Florida', url: 'https://grandlodgefl.com' },
    { label: 'Scottish Rite', url: 'https://scottishrite.org' },
    { label: 'York Rite', url: 'https://yorkrite.org' },
    { label: 'Shrine', url: 'https://shrinersinternational.org' },
    { label: 'Grottoes International', url: 'https://scgrotto.org' }
  ];

  legalLinks: NavigationItem[] = [
    { label: 'Privacy Policy', route: '/privacy' },
    { label: 'Terms of Service', route: '/terms' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitMessage = '';

      const formValue = this.contactForm.value;
      
      // Build mailto link with form data
      const recipient = 'secretary@stpete139.org';
      const subject = encodeURIComponent('Contact Form Submission from Footer');
      
      // Build email body with all form information
      let body = `Name: ${formValue.name}\n`;
      body += `Email: ${formValue.email}\n`;
      body += `\nMessage:\n${formValue.message}`;
      
      const encodedBody = encodeURIComponent(body);
      const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${encodedBody}`;
      
      // Open mailto link
      window.location.href = mailtoLink;
      
      // Reset form and show success message
      setTimeout(() => {
        this.submitMessage = 'Opening your email client...';
        this.submitSuccess = true;
        this.contactForm.reset();
        this.isSubmitting = false;
        
        // Clear message after 5 seconds
        setTimeout(() => {
          this.submitMessage = '';
        }, 5000);
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }
}