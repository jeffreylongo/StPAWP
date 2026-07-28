import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface OfficeService {
  title: string;
  description: string;
  icon: string;
}

interface ResourceLink {
  title: string;
  description: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-secretary-office',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './secretary-office.component.html',
  styleUrls: ['./secretary-office.component.css'],
})
export class SecretaryOfficeComponent {
  readonly secretary = {
    name: 'Worshipful John Livingston, P∴M∴',
    role: 'Lodge Secretary',
    phone: '(727) 418-3356',
    phoneHref: 'tel:7274183356',
    email: 'secretary@stpete139.org',
    emailHref: 'mailto:secretary@stpete139.org',
  };

  readonly officeServices: OfficeService[] = [
    {
      title: 'Membership Records',
      description: 'Petitions, demits, affiliations, dual membership, and standing with the Lodge and Grand Lodge.',
      icon: 'fas fa-address-book',
    },
    {
      title: 'Dues & Correspondence',
      description: 'Annual dues questions, receipts, official Lodge correspondence, and notices to the Craft.',
      icon: 'fas fa-file-invoice-dollar',
    },
    {
      title: 'Certificates & Longevity',
      description: 'Raising certificates, proficiency records, and assistance with longevity awards and pins.',
      icon: 'fas fa-certificate',
    },
    {
      title: 'Forms & Petitions',
      description: 'Guidance on Lodge petitions, by-laws, and other documents members need to complete.',
      icon: 'fas fa-file-signature',
    },
    {
      title: 'Visitor & Guest Letters',
      description: 'Letters of good standing and coordination for visiting Brethren and courtesy work.',
      icon: 'fas fa-envelope-open-text',
    },
    {
      title: 'Funeral & Memorial Support',
      description: 'Coordination with families and the Lodge for Masonic funeral or memorial arrangements.',
      icon: 'fas fa-dove',
    },
  ];

  readonly resourceLinks: ResourceLink[] = [
    {
      title: 'The Trestle Board',
      description: 'Officer messages, meeting synopses, milestones, and education updates',
      route: '/trestle-board',
      icon: 'fas fa-newspaper',
    },
    {
      title: 'Events Calendar',
      description: 'Degrees, practices, dinners, and fellowship dates',
      route: '/calendar',
      icon: 'fas fa-calendar-alt',
    },
    {
      title: 'Forms & Petitions',
      description: 'Downloadable Lodge forms and membership documents',
      route: '/forms',
      icon: 'fas fa-file-alt',
    },
    {
      title: 'Dues & Donations',
      description: 'How to pay dues and support Lodge charities',
      route: '/dues-donations',
      icon: 'fas fa-hand-holding-heart',
    },
    {
      title: 'Lodge Officers',
      description: 'Current officer directory and contacts',
      route: '/officers',
      icon: 'fas fa-users',
    },
    {
      title: 'Contact the Lodge',
      description: 'General inquiries and visitor information',
      route: '/contact',
      icon: 'fas fa-comments',
    },
  ];

  readonly meetingBasics = [
    { label: 'Stated Communication', value: 'Third Tuesday of each month' },
    { label: 'Dinner', value: '6:30 PM' },
    { label: 'Meeting', value: '7:30 PM' },
    { label: 'Temporary Location', value: '3325 1st St. NE, St. Petersburg, FL 33704' },
  ];
}
