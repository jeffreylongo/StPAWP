import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SiteLink {
  title: string;
  description: string;
  route?: string;
  url?: string;
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

  readonly secretarySite = {
    label: '139sec.org',
    url: 'https://139sec.org',
  };

  readonly siteLinks: SiteLink[] = [
    {
      title: 'The Trestle Board',
      description: 'Officer messages for the current edition',
      route: '/trestle-board',
      icon: 'fas fa-newspaper',
    },
    {
      title: 'Masonic Education',
      description: 'Degree booklets, etiquette, and essays',
      route: '/masonic-education',
      icon: 'fas fa-graduation-cap',
    },
    {
      title: 'Forms & Petitions',
      description: 'Membership petitions and Grand Lodge forms',
      route: '/forms',
      icon: 'fas fa-file-alt',
    },
    {
      title: 'Dues & Donations',
      description: 'Pay dues and support Lodge charities',
      route: '/dues-donations',
      icon: 'fas fa-hand-holding-heart',
    },
  ];
}
