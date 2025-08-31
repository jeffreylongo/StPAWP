import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Tab {
  key: string;
  label: string;
}

interface CoreValue {
  title: string;
  description: string;
}

interface QuickLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Page Header -->
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">About Our Lodge</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">About Our Lodge</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Main Content Area -->
        <div class="w-full lg:w-2/3">
          <!-- Tab Navigation -->
          <div class="flex flex-wrap mb-8 border-b overflow-x-auto">
            <button *ngFor="let tab of tabs" 
                    (click)="setActiveTab(tab.key)"
                    [class]="'py-3 px-5 font-medium whitespace-nowrap transition-colors ' + (activeTab === tab.key ? 'text-primary-blue border-b-2 border-primary-gold' : 'text-gray-500 hover:text-primary-blue')">
              {{ tab.label }}
            </button>
          </div>
          
          <!-- Tab Content -->
          <div class="prose prose-lg max-w-none">
            <ng-container [ngSwitch]="activeTab">
              <!-- Overview Tab -->
              <div *ngSwitchCase="'overview'" class="fade-in">
                <p class="lead text-xl mb-6">St. Petersburg Lodge No. 139 has been a cornerstone of Freemasonry in the Tampa Bay area since 1894, bringing together men of good character in pursuit of moral and intellectual development.</p>
                
                <div class="space-y-6">
                  <p>Our lodge was chartered on February 15, 1894, making it one of the oldest continuously operating Masonic lodges in Pinellas County. For over 129 years, we have maintained the ancient traditions and principles of Freemasonry while adapting to serve our modern community.</p>
                  
                  <p>We meet regularly on the third Tuesday of each month, with dinner served at 6:30 PM and our formal meeting beginning at 7:30 PM. Our lodge building, located at 3325 1st Street NE, serves not only as our meeting place but as a community center where we host educational programs, charitable events, and fellowship activities.</p>
                  
                  <p>As Free and Accepted Masons, we are committed to the principles of Brotherly Love, Relief, and Truth. These foundational values guide our work in the community and our relationships with one another. We welcome men of all backgrounds who seek to improve themselves and contribute positively to society.</p>
                  
                  <h3 class="font-cinzel text-2xl text-primary-blue font-bold mt-8 mb-4">Our Lodge Today</h3>
                  <p>Today, St. Petersburg Lodge No. 139 continues to thrive with an active membership dedicated to personal growth, community service, and the preservation of Masonic traditions. We regularly participate in community charitable activities, support local schools and youth programs, and maintain strong relationships with other Masonic organizations throughout Florida.</p>
                </div>
              </div>
              
              <!-- Mission & Values Tab -->
              <div *ngSwitchCase="'mission'" class="fade-in">
                <p class="lead text-xl mb-6">Our mission is to make good men better through the timeless principles of Freemasonry, fostering personal growth, community service, and brotherhood.</p>
                
                <h3 class="font-cinzel text-2xl text-primary-blue font-bold mb-6">Our Core Values</h3>
                
                <!-- Values Grid -->
                <div class="my-8 grid md:grid-cols-2 gap-6">
                  <div *ngFor="let value of coreValues" class="bg-neutral-light p-6 rounded-lg shadow-md">
                    <h4 class="font-cinzel text-xl text-primary-blue font-bold mb-3">{{ value.title }}</h4>
                    <p>{{ value.description }}</p>
                  </div>
                </div>
                
                <div class="space-y-6 mt-8">
                  <h3 class="font-cinzel text-2xl text-primary-blue font-bold">Our Commitment</h3>
                  <p>We are committed to maintaining the highest standards of moral and ethical behavior, both within our lodge and in our daily lives. Our members are encouraged to be active contributors to their communities, exemplifying the values we hold dear.</p>
                  
                  <p>Through our charitable work, educational programs, and fellowship activities, we strive to make a positive impact on the St. Petersburg community and beyond. We believe that by improving ourselves, we can better serve others and contribute to the betterment of society as a whole.</p>
                </div>
              </div>
              
              <!-- Meetings Tab -->
              <div *ngSwitchCase="'meetings'" class="fade-in">
                <p class="lead text-xl mb-6">Our regular communications provide opportunities for business, education, and fellowship among the brethren.</p>
                
                <!-- Meeting Info Card -->
                <div class="my-8 bg-neutral-light p-6 rounded-lg shadow-md">
                  <h3 class="font-cinzel text-xl text-primary-blue font-bold mb-4">Regular Communications</h3>
                  <div class="flex items-start mb-4">
                    <i class="fas fa-clock text-primary-gold mt-1 mr-3"></i>
                    <div>
                      <p class="font-medium">3rd Tuesday of each month</p>
                      <p>Dinner at 6:30 PM | Meeting at 7:30 PM</p>
                    </div>
                  </div>
                  <p>All Master Masons in good standing are welcome to attend our stated communications. Dinner is served before each meeting, providing an excellent opportunity for fellowship and discussion.</p>
                </div>
                
                <div class="space-y-6">
                  <h3 class="font-cinzel text-2xl text-primary-blue font-bold">What to Expect</h3>
                  <p>Our meetings follow traditional Masonic protocol and include reports from officers, committee updates, discussion of lodge business, and often educational presentations on Masonic history, symbolism, or philosophy.</p>
                  
                  <p>Visitors from other lodges are always welcome, and we encourage our members to visit other lodges to strengthen the bonds of brotherhood and learn from different perspectives and traditions.</p>
                  
                  <div class="bg-blue-50 border-l-4 border-primary-blue p-4 mt-6">
                    <p class="text-sm"><strong>Note for Visitors:</strong> Please bring proper identification and proof of Masonic membership. We recommend contacting our Secretary in advance to ensure we can properly welcome you.</p>
                  </div>
                </div>
              </div>
            </ng-container>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="w-full lg:w-1/3">
          <!-- Lodge Information -->
          <div class="bg-neutral-light p-6 rounded-lg shadow-md mb-8">
            <h3 class="font-cinzel text-xl text-primary-blue font-bold mb-4">Lodge Information</h3>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <i class="fas fa-map-marker-alt text-primary-gold mt-1 mr-3"></i>
                <div>
                  <p class="font-medium">Lodge Location</p>
                  <p>3325 1st St NE</p>
                  <p>St. Petersburg, FL 33704</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <i class="fas fa-phone text-primary-gold mt-1 mr-3"></i>
                <div>
                  <p class="font-medium">Phone</p>
                  <p>(727) 321-1739</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <i class="fas fa-envelope text-primary-gold mt-1 mr-3"></i>
                <div>
                  <p class="font-medium">Email</p>
                  <p>secretary&#64;stpetelodge139.org</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <i class="fas fa-calendar text-primary-gold mt-1 mr-3"></i>
                <div>
                  <p class="font-medium">Founded</p>
                  <p>February 15, 1894</p>
                </div>
              </div>
            </div>
            
            <div class="mt-6">
              <a href="https://maps.google.com/?q=3325+1st+St+NE,+St.+Petersburg,+FL+33704" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="inline-flex items-center text-primary-blue hover:text-primary-gold font-semibold transition-colors">
                <span>View on Google Maps</span>
                <i class="fas fa-external-link-alt ml-2"></i>
              </a>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-md">
            <h3 class="font-cinzel text-xl text-primary-blue font-bold p-6 border-b">Quick Links</h3>
            <div class="divide-y">
              <a *ngFor="let link of quickLinks" 
                 [routerLink]="link.path" 
                 class="block p-4 hover:bg-neutral-light transition-colors">
                <div class="flex items-center justify-between">
                  <span>{{ link.label }}</span>
                  <i class="fas fa-chevron-right text-primary-gold"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .prose p {
      margin-bottom: 1.25rem;
    }
    
    .prose .lead {
      font-size: 1.25rem;
      font-weight: 400;
      margin-bottom: 1.5rem;
      color: var(--text-muted);
    }
  `]
})
export class AboutComponent implements OnInit {
  activeTab = 'overview';
  
  tabs: Tab[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'mission', label: 'Mission & Values' },
    { key: 'meetings', label: 'Meetings' }
  ];

  coreValues: CoreValue[] = [
    {
      title: 'Brotherly Love',
      description: 'We practice tolerance and respect for the opinions of others and behave with kindness and understanding to our fellow creatures.'
    },
    {
      title: 'Relief',
      description: 'We extend charity and compassion to those in need, supporting our community through various charitable endeavors and mutual aid.'
    },
    {
      title: 'Truth',
      description: 'We strive for honesty in our dealings with others and seek knowledge and understanding through education and self-improvement.'
    },
    {
      title: 'Integrity',
      description: 'We maintain the highest standards of moral and ethical behavior in all aspects of our lives, both within and outside the lodge.'
    },
    {
      title: 'Fellowship',
      description: 'We foster lasting friendships and bonds of brotherhood that transcend social, economic, and cultural differences.'
    },
    {
      title: 'Service',
      description: 'We are committed to serving our community and contributing to the betterment of society through our actions and example.'
    }
  ];

  quickLinks: QuickLink[] = [
    { label: 'Our History', path: '/history' },
    { label: 'Current Officers', path: '/officers' },
    { label: 'Past Masters', path: '/past-masters' },
    { label: 'Become a Mason', path: '/becoming-mason' },
    { label: 'Meeting Calendar', path: '/calendar' },
    { label: 'Contact Us', path: '/contact' }
  ];

  ngOnInit() {}

  setActiveTab(tabKey: string) {
    this.activeTab = tabKey;
  }
}