import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Officer {
  role: string;
  name: string;
  imageUrl: string;
  description: string;
  icon: string;
  tag?: string;
  phone?: string;
  imagePosition?: string;
  photoPending?: boolean;
}

interface CommitteeMember {
  name: string;
  role: string;
}

interface Committee {
  name: string;
  members: CommitteeMember[];
}

@Component({
  selector: 'app-officers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Officers</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Lodge Officers</h1>
        <p class="text-primary-gold-light text-xl mt-4">2025 Masonic Year</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction -->
      <div class="text-center mb-16">
        <h2 class="font-cinzel text-3xl font-bold text-primary-blue mb-6">Our Leadership</h2>
        <div class="w-24 h-1 bg-primary-gold mx-auto mb-8"></div>
        <p class="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
          The officers of St. Petersburg Lodge No. 139 are elected and appointed annually to serve the lodge and its members. 
          Each officer has specific duties and responsibilities that contribute to the smooth operation and rich traditions of our lodge.
        </p>
      </div>

      <!-- Principal Officers -->
      <div class="mb-16">
        <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-8 text-center">Principal Officers</h3>
        <div class="grid md:grid-cols-3 gap-8">
          <div *ngFor="let officer of principalOfficers" class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <img [src]="officer.imageUrl"
                   [alt]="officer.role + ' ' + officer.name"
                   class="w-full h-80 object-cover"
                   [style.object-position]="officer.imagePosition || 'center 22%'">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-blue-dark via-transparent to-transparent opacity-70"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <div class="bg-primary-gold text-primary-blue-darker px-4 py-2 rounded-full font-bold mb-2">
                  <i [class]="officer.icon + ' mr-2'"></i>{{ officer.role }}
                </div>
                <div *ngIf="officer.tag" class="bg-primary-blue text-white px-4 py-2 rounded-full font-bold">
                  {{ officer.tag }}
                </div>
              </div>
            </div>
            <div class="p-6">
              <h4 class="font-cinzel text-2xl font-bold text-primary-blue mb-2">{{ officer.name }}</h4>
              <div *ngIf="officer.phone" class="flex items-center text-primary-gold mb-4">
                <i class="fas fa-phone mr-2"></i>
                <span class="text-sm">{{ officer.phone }}</span>
              </div>
              <p class="text-gray-600 mb-4 leading-relaxed">{{ officer.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lodge Officers -->
      <div class="mb-16">
        <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-8 text-center">Lodge Officers</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let officer of lodgeOfficers" class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative">
              <img [src]="officer.imageUrl"
                   [alt]="officer.role + ' ' + officer.name"
                   class="w-full h-64 object-cover"
                   [style.object-position]="officer.imagePosition || 'center 22%'">
              <div class="absolute inset-0 bg-gradient-to-t from-primary-blue-dark via-transparent to-transparent opacity-60"></div>
              <div class="absolute bottom-3 left-3 text-white">
                <div class="bg-primary-blue text-white px-3 py-1 rounded text-sm font-bold">
                  {{ officer.role }}
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-cinzel text-lg font-bold text-primary-blue mb-2">{{ officer.name }}</h4>
              <div *ngIf="officer.phone" class="flex items-center text-primary-gold mb-3 text-xs">
                <i class="fas fa-phone mr-2"></i>
                <span>{{ officer.phone }}</span>
              </div>
              <p class="text-gray-600 text-sm mb-3">{{ officer.description }}</p>
              <div class="flex items-center text-primary-gold text-sm mb-3">
                <i [class]="officer.icon + ' mr-2'"></i>
                <span>{{ officer.tag }}</span>
              </div>
              <div *ngIf="officer.photoPending" class="text-xs text-red-600 font-semibold">
                Photo pending update
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lodge Committees -->
      <div class="mb-16">
        <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-8 text-center">Lodge Committees</h3>
        <div class="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div *ngFor="let committee of committees" class="bg-white rounded-lg shadow-md p-5">
            <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-4 text-center">{{ committee.name }}</h4>
            <div class="space-y-3 text-center">
              <div *ngFor="let member of committee.members" class="flex items-center justify-center gap-3">
                <img [src]="getCommitteePhoto(member.name)"
                     [alt]="member.name"
                     class="w-10 h-10 rounded-full object-cover border border-gray-200"
                     [style.object-position]="'center 22%'">
                <div class="text-sm">
                  <p class="font-semibold text-gray-800 leading-tight">{{ member.name }}</p>
                  <p class="text-primary-blue">{{ member.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="text-center mt-16">
        <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-6">Questions About Our Lodge?</h3>
        <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
          Our officers are always available to answer questions about Freemasonry, lodge activities, or membership opportunities.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/contact" 
             class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center justify-center">
            <i class="fas fa-envelope mr-2"></i>
            Contact Our Lodge
          </a>
          <a routerLink="/becoming-mason" 
             class="border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center justify-center">
            <i class="fas fa-handshake mr-2"></i>
            Learn About Membership
          </a>
        </div>
      </div>
    </div>
  `
})
export class OfficersComponent {
  principalOfficers: Officer[] = [
    {
      role: 'Worshipful Master',
      name: 'Worshipful Valentino Francis Michael Pine, P∴M∴',
      imageUrl: 'assets/officers/Val WM 4.jpg',
      description: 'Leading our lodge with wisdom and dedication to Masonic principles and traditions.',
      icon: 'fas fa-gavel',
      tag: 'President and Executive Officer',
      phone: '(727) 637-3106',
      imagePosition: 'center 12%'
    },
    {
      role: 'Senior Warden',
      name: 'Right Worshipful Alan Rosenthal, P∴M∴, P∴D∴D∴G∴M∴',
      imageUrl: 'assets/officers/Alan Rosenthal Junior Warden 1.jpg',
      description: 'Supporting the Worshipful Master and assisting with lodge operations and activities.',
      icon: 'fas fa-sun',
      phone: '(727) 504-7310',
      imagePosition: 'center 16%'
    },
    {
      role: 'Junior Warden',
      name: 'Brother Craig Hull',
      imageUrl: 'assets/officers/Craig Hull Sr Deacon 1.jpg',
      description: 'Supporting the brethren and assisting with lodge harmony and fellowship activities.',
      icon: 'fas fa-moon',
      imagePosition: 'center 14%'
    }
  ];

  lodgeOfficers: Officer[] = [
    {
      role: 'Secretary',
      name: 'Worshipful John Livingston, P∴M∴',
      imageUrl: 'assets/officers/John Livingston Secretary.jpg',
      description: 'Supporting lodge administration and record keeping.',
      icon: 'fas fa-file-alt',
      tag: 'Records and Administration',
      phone: '(727) 418-3356',
      imagePosition: 'center 18%'
    },
    {
      role: 'Treasurer',
      name: 'Worshipful Michael Mignone, P∴M∴',
      imageUrl: 'assets/officers/Michael Mignone Treasurer.jpg',
      description: 'Assisting with lodge financial matters and transactions.',
      icon: 'fas fa-calculator',
      tag: 'Financial Management',
      imagePosition: 'center 18%'
    },
    {
      role: 'Chaplain',
      name: 'Worshipful John Gunter, P∴M∴',
      imageUrl: 'assets/officers/John Gunter Degree Master.jpg',
      description: 'Supporting lodge spiritual activities and ceremonies.',
      icon: 'fas fa-hands-praying',
      tag: 'Spiritual Guidance',
      imagePosition: 'center 16%'
    },
    {
      role: 'Marshall',
      name: 'Worshipful Chris Webb, P∴M∴',
      imageUrl: 'assets/officers/Chriss Webb Marshal 1.jpg',
      description: 'Assisting with lodge order, ceremonial activities, and membership applications.',
      icon: 'fas fa-users-cog',
      tag: 'Order, Ceremony and Membership',
      phone: '(727) 393-6007',
      imagePosition: 'center 20%'
    },
    {
      role: 'Senior Deacon',
      name: 'Brother Jeff Longo',
      imageUrl: 'assets/officers/Jeff Senior Steward.jpg',
      description: 'Supporting the Worshipful Master and lodge activities.',
      icon: 'fas fa-route',
      tag: 'Guidance and Assistance',
      imagePosition: 'center 20%'
    },
    {
      role: 'Junior Deacon',
      name: 'Brother Henry Swett',
      imageUrl: 'assets/officers/Henry Junior Steward.jpg',
      description: 'Assisting with lodge ceremonies and activities.',
      icon: 'fas fa-walking',
      tag: 'Messenger and Guide',
      imagePosition: 'center 20%'
    },
    {
      role: 'Senior Steward',
      name: 'Brother Malek Chevalier',
      imageUrl: 'assets/officers/Malek Chevalier Sr Steward.jpg',
      description: 'Assisting with lodge hospitality and refreshments.',
      icon: 'fas fa-utensils',
      tag: 'Hospitality and Service',
      photoPending: true
    },
    {
      role: 'Junior Steward',
      name: 'Brother Raymond Wilson',
      imageUrl: 'assets/officers/placeholder.svg',
      description: 'Assisting with lodge hospitality and refreshments.',
      icon: 'fas fa-utensils',
      tag: 'Hospitality and Service',
      photoPending: true
    },
    {
      role: 'Tyler',
      name: 'Worshipful Ricardo Colon-Marquez, P∴M∴',
      imageUrl: 'assets/officers/Ricardo Senior Warden.jpg',
      description: 'Guarding the lodge and ensuring its security.',
      icon: 'fas fa-door-closed',
      tag: 'Security and Guard',
      imagePosition: 'center 20%'
    }
  ];

  committees: Committee[] = [
    {
      name: 'Masonic Education Committee',
      members: [
        { name: 'Brother Steven Stamberger', role: 'Chairman' },
        { name: 'Brother Craig Hull', role: 'Vice-Chairman' },
        { name: 'Brother Malek Chevalier', role: 'Member' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Worshipful John Livingston', role: 'Secretary' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    },
    {
      name: 'Technology Committee',
      members: [
        { name: 'Brother Jeff Longo', role: 'Chairman' },
        { name: 'Worshipful Leo Laskin', role: 'Vice-Chairman' },
        { name: 'Brother Malek Chevalier', role: 'Member' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Worshipful John Livingston', role: 'Secretary' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    },
    {
      name: 'Finance & Investments Committee',
      members: [
        { name: 'Right Worshipful Alan Rosenthal', role: 'Chairman' },
        { name: 'Worshipful Ricardo Colon-Marquez', role: 'Vice-Chairman' },
        { name: 'Brother Henry Swett', role: 'Member' },
        { name: 'Brother Jeff Longo', role: 'Member' },
        { name: 'Brother Craig Hull', role: 'Member' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Worshipful John Livingston', role: 'Secretary' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    },
    {
      name: 'Vigilance Committee',
      members: [
        { name: 'Brother Craig Hull', role: 'Chairman' },
        { name: 'Right Worshipful Alan Rosenthal', role: 'Vice-Chairman' },
        { name: 'Brother Jeff Longo', role: 'Member' },
        { name: 'Brother Steven Stamberger', role: 'Member' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Worshipful John Livingston', role: 'Secretary' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    },
    {
      name: 'Board of Relief Committee',
      members: [
        { name: 'Worshipful John Livingston', role: 'Chairman - Secretary' },
        { name: 'Right Worshipful Alan Rosenthal', role: 'Member' },
        { name: 'Worshipful Leo Laskin', role: 'Member' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    },
    {
      name: 'Charity Committee',
      members: [
        { name: 'Worshipful Michael Mignone', role: 'Chairman' },
        { name: 'Right Worshipful Alan Rosenthal', role: 'Member' },
        { name: 'Brother Russell Wurr', role: 'Member' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Worshipful John Livingston', role: 'Secretary' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    },
    {
      name: 'Lodge Property Committee',
      members: [
        { name: 'John Livingston', role: 'Chairman - Secretary' },
        { name: 'Right Worshipful Alan Rosenthal', role: 'Member' },
        { name: 'Worshipful Leo Laskin', role: 'Member' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    },
    {
      name: 'Building & Construction Sub-Committee',
      members: [
        { name: 'Right Worshipful Alan Rosenthal', role: 'Chairman' },
        { name: 'Worshipful Leo Laskin', role: 'Member' },
        { name: 'Brother Craig Hull', role: 'Member' },
        { name: 'Brother Henry Swett', role: 'Member' },
        { name: 'Brother Jeff Longo', role: 'Member' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Worshipful John Livingston', role: 'Secretary' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    },
    {
      name: 'Petitions Committee',
      members: [
        { name: 'Worshipful Christopher Webb', role: 'Chairman' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Worshipful John Livingston', role: 'Secretary' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    },
    {
      name: 'Investigations Committee',
      members: [
        { name: 'Brother Douglas Raymond Michell', role: 'Chairman' },
        { name: 'Worshipful John Gunter', role: 'Member' },
        { name: 'Brother Raymond Wilson', role: 'Member' },
        { name: 'Right Worshipful Alan Rosenthal', role: 'Member' },
        { name: 'Worshipful John Livingston', role: 'Secretary' },
        { name: 'Worshipful Valentino Pine', role: 'Worshipful Master' }
      ]
    }
  ];

  private committeePhotoMap: Record<string, string> = {
    'alan rosenthal': 'assets/committees/committee-alan-rosenthal.jpg',
    'craig hull': 'assets/committees/committee-craig-hull.jpg',
    'henry swett': 'assets/committees/committee-henry-swett.jpg',
    'jeff longo': 'assets/committees/committee-jeff-longo.jpg',
    'john gunter': 'assets/committees/committee-john-gunter.jpg',
    'john livingston': 'assets/committees/committee-john-livingston.jpg',
    'leo laskin': 'assets/committees/committee-leo-laskin.jpg',
    'michael mignone': 'assets/committees/committee-michael-mignone.jpg',
    'ricardo colon marquez': 'assets/committees/committee-ricardo-colon-marquez.jpg',
    'christopher webb': 'assets/committees/committee-christopher-webb.jpg'
  };

  getCommitteePhoto(name: string): string {
    const normalizedName = this.normalizeName(name);
    return this.committeePhotoMap[normalizedName] || 'assets/officers/placeholder.svg';
  }

  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/right worshipful|worshipful|brother/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}