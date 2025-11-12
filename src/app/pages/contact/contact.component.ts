import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };
  
  isSubmitting = false;
  
  onSubmit(): void {
    if (this.isSubmitting) return;
    
    // Build mailto link with form data
    const recipient = 'secretary@stpete139.org';
    const subject = encodeURIComponent(this.formData.subject || 'Contact Form Submission');
    
    // Build email body with all form information
    let body = `Name: ${this.formData.name}\n`;
    body += `Email: ${this.formData.email}\n`;
    if (this.formData.phone) {
      body += `Phone: ${this.formData.phone}\n`;
    }
    body += `\nMessage:\n${this.formData.message}`;
    
    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${encodedBody}`;
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Reset form after a brief delay
    setTimeout(() => {
      this.formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };
    }, 500);
  }
}
