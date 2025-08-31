import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PastMaster {
  name: string;
  years: string[];
  period: string;
  biography: string;
  specialNotes?: string;
  burialLocation?: string;
  deathDate?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-past-masters',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Past Masters</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Past Masters</h1>
        <p class="text-primary-gold-light text-xl mt-4">Honoring Our Lodge's Distinguished Leadership Since 1894</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction -->
      <div class="text-center mb-16">
        <div class="max-w-4xl mx-auto">
          <i class="fas fa-crown text-6xl text-primary-gold mb-6"></i>
          <h2 class="font-cinzel text-3xl font-bold text-primary-blue mb-6">Our Distinguished Past Masters</h2>
          <div class="w-24 h-1 bg-primary-gold mx-auto mb-8"></div>
          <p class="text-gray-600 text-lg leading-relaxed mb-8">
            Since our charter in 1894, St. Petersburg Lodge No. 139 has been guided by exceptional men who served as Worshipful Master. 
            These leaders not only guided our lodge but were instrumental in building the city of St. Petersburg itself. 
            Many were pioneers, business leaders, and civic servants who helped establish the foundations of our community.
          </p>
          <p class="text-primary-blue font-semibold">
            "The measure of a lodge is found in the character of its leaders and the legacy they leave behind."
          </p>
        </div>
      </div>

      <!-- Early Masters Section -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-4">The Founding Era (1894-1920)</h3>
          <p class="text-gray-600 max-w-3xl mx-auto">
            Our earliest Worshipful Masters were true pioneers who not only established our lodge but helped build St. Petersburg from a small settlement into a thriving city.
          </p>
        </div>

        <div class="space-y-12">
          <div *ngFor="let master of earlyMasters" class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-cinzel text-2xl font-bold">Worshipful {{ master.name }}</h4>
                  <p class="text-primary-gold-light text-lg">{{ master.period }}</p>
                </div>
                <div class="text-right">
                  <div class="bg-primary-gold text-primary-blue-darker px-4 py-2 rounded-full font-bold">
                    <i class="fas fa-gavel mr-2"></i>
                    <span *ngFor="let year of master.years; let last = last">
                      {{ year }}<span *ngIf="!last">, </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="p-8">
              <div class="grid md:grid-cols-3 gap-8">
                <!-- Portrait Image -->
                <div *ngIf="master.imageUrl" class="md:col-span-1">
                  <div class="bg-neutral-light rounded-lg p-4 text-center">
                    <img [src]="master.imageUrl" 
                         [alt]="'Portrait of Worshipful ' + master.name"
                         class="w-full h-80 object-cover object-top rounded-lg shadow-md mb-4">
                    <p class="text-sm text-gray-600 italic">Portrait of Worshipful {{ master.name }}</p>
                  </div>
                </div>
                
                <!-- Biography Content -->
                <div [class]="master.imageUrl ? 'md:col-span-2' : 'md:col-span-3'">
                  <div class="prose prose-lg max-w-none">
                    <p class="text-gray-700 leading-relaxed mb-6" [innerHTML]="master.biography"></p>
                    
                    <div *ngIf="master.specialNotes" class="bg-primary-gold-light p-4 rounded-lg mb-6">
                      <h5 class="font-semibold text-primary-blue mb-2">
                        <i class="fas fa-star text-primary-gold mr-2"></i>Notable Achievements
                      </h5>
                      <p class="text-gray-700 text-sm" [innerHTML]="master.specialNotes"></p>
                    </div>
                    
                    <div *ngIf="master.deathDate || master.burialLocation" class="flex flex-wrap gap-6 text-sm text-gray-600">
                      <div *ngIf="master.deathDate" class="flex items-center">
                        <i class="fas fa-calendar text-primary-gold mr-2"></i>
                        <span>Passed: {{ master.deathDate }}</span>
                      </div>
                      <div *ngIf="master.burialLocation" class="flex items-center">
                        <i class="fas fa-map-marker-alt text-primary-gold mr-2"></i>
                        <span>Interred: {{ master.burialLocation }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Memorial Section -->
      <div class="bg-gradient-to-r from-neutral-light to-white rounded-lg p-8 shadow-md">
        <div class="text-center">
          <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-6">
            <i class="fas fa-heart text-primary-gold mr-3"></i>
            In Memoriam
          </h3>
          <p class="text-gray-600 text-lg mb-6">
            We honor the memory of all our Past Masters who have answered the final summons and passed to the Celestial Lodge Above. 
            Their dedication, leadership, and service to our lodge and community will never be forgotten.
          </p>
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="bg-primary-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-handshake text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Brotherhood</h4>
              <p class="text-gray-600 text-sm">
                They fostered lasting bonds among the brethren and welcomed new members with open arms.
              </p>
            </div>
            <div class="text-center">
              <div class="bg-primary-gold text-primary-blue-darker w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-building text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Community Building</h4>
              <p class="text-gray-600 text-sm">
                They were instrumental in establishing St. Petersburg as a thriving city and community.
              </p>
            </div>
            <div class="text-center">
              <div class="bg-primary-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-scroll text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Masonic Tradition</h4>
              <p class="text-gray-600 text-sm">
                They preserved and passed down the ancient traditions and teachings of Freemasonry.
              </p>
            </div>
          </div>
          <p class="text-primary-blue font-semibold text-lg italic">
            "So mote it be, that their memory shall endure and their example inspire future generations."
          </p>
        </div>
      </div>

      <!-- Research Note -->
      <div class="mt-12 text-center">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
          <h4 class="font-cinzel text-xl font-bold text-primary-blue mb-4">
            <i class="fas fa-search text-primary-gold mr-2"></i>
            Help Us Complete Our History
          </h4>
          <p class="text-gray-700 mb-4">
            We are continually working to research and document the complete history of all our Past Masters. 
            If you have information, photographs, or stories about any of our Past Masters, we would be grateful to hear from you.
          </p>
          <a routerLink="/contact" 
             class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-6 py-3 rounded-lg transition inline-flex items-center">
            <i class="fas fa-envelope mr-2"></i>
            Share Your Knowledge
          </a>
        </div>
      </div>
    </div>
  `
})
export class PastMastersComponent {
  earlyMasters: PastMaster[] = [
    {
      name: 'W. W. Coleman',
      years: ['1894', '1895', '1897', '1903', '1905'],
      period: 'First Worshipful Master & Multiple Terms',
      biography: `Worshipful Coleman was a Hydraulic Engineer by trade and was actually responsible for installing St. Petersburg's first water system that supplied fresh water to this pioneer town on the edge of Tampa Bay. Worshipful Coleman and his Wife Mary Ellen also built, owned, and ran the Paxton House Hotel which at the time was one of the largest hotels in the area boasting 32 rooms for guests and stayed open year round. The Paxton House Hotel was a block away from the Detroit Hotel on Central Ave and 1st Street.`,
      specialNotes: 'Through Worshipful Coleman\'s guidance Lodge 139 was able to forge through the early years and last the test of time. Not only served as our first Worshipful Master, but returned to serve four additional terms, demonstrating his continued dedication to the lodge.',
      deathDate: '1909',
      burialLocation: 'Greenwood Cemetery (9th Street & 11th Ave S)',
      imageUrl: 'assets/past-masters/walter-w-coleman.jpg'
    },
    {
      name: 'G. L. King',
      years: ['1896'],
      period: 'Second Worshipful Master',
      biography: `Worshipful King was our second Worshipful Master. He was one of the first lumber mill owners in lower Pinellas Point/Maximo Point area. He is credited with spearheading population growth in the 1890s in Lower Pinellas Point/St. Pete Village.`,
      deathDate: 'February 1904 (after long battle with cancer)',
      burialLocation: 'Greenwood Cemetery',
      imageUrl: 'assets/past-masters/henry-w-hibbs.png'
    },
    {
      name: 'Robert Johnson',
      years: ['1898'],
      period: 'Charter Member & District Deputy',
      biography: `Worshipful Johnson was our Worshipful Master in 1898. He was a Charter Member of St. Petersburg Lodge No. 139 and also served as District Deputy Grand Master in 1901, when we were located in District 16.`,
      specialNotes: 'Unfortunately, we do not have a photograph of him, nor do we know very much about his life and death. If you have any knowledge of Worshipful Johnson, please share it with us.'
    },
    {
      name: 'H. W. Hibbs',
      years: ['1899'],
      period: 'Mayor & Business Leader',
      biography: `Worshipful Hibbs was the Worshipful Master of our Lodge in 1899. In his personal life, he established one of St. Petersburg's most important industries - the shipping of fresh fish to northern markets. Worshipful Hibbs was the president of the Hibbs Fish Company, president of the Citizens Ice & Cold Storage Company and a director of the First National Bank.`,
      specialNotes: 'He was elected mayor of St. Petersburg in 1894 and again in 1895, making him one of the city\'s earliest civic leaders.',
      deathDate: '1942',
      burialLocation: 'Royal Palm South Cemetery',
      imageUrl: 'assets/past-masters/william-a-sloan.jpg'
    },
    {
      name: 'W. A. Sloan',
      years: ['1900'],
      period: 'First Town Marshal',
      biography: `Worshipful Sloan led our Lodge into the 20th Century. He was among the Worshipful Masters who were instrumental in the founding of St. Petersburg. Worshipful Sloan was the first Town Marshal, serving as one of the city's earliest law enforcement officers.`,
      deathDate: 'June 25, 1906',
      burialLocation: 'Greenwood Cemetery',
      imageUrl: 'assets/past-masters/david-murray.jpg'
    },
    {
      name: 'David Murray',
      years: ['1902'],
      period: 'Mayor & Ice Company Pioneer',
      biography: `Worshipful Murray came to St. Petersburg in 1890 to put in the plant for the Crystal Ice Company, the first ice company in St. Petersburg. In April of 1893, he was elected Mayor of St. Petersburg to fill out the term of Mayor Judge Wm. H. Benton, who died suddenly while on his way to Tampa. While Mayor, he laid the cornerstone of the first public school building in St. Petersburg.`,
      specialNotes: 'After serving as Worshipful Master, he moved to California.',
      imageUrl: 'assets/past-masters/henry-miner.jpg'
    },
    {
      name: 'Henry Miner',
      years: ['1904'],
      period: 'Sea Captain & War Hero',
      biography: `Worshipful Miner was Worshipful Master in 1904. As a young lad, 16 years old, he went to sea doing the work of an Able Seaman, sailing in all of the seven seas. In 1888, then a Sea Captain, Worshipful Miner sailed from Pensacola to the snapper banks. After a couple of days fishing they were hit by one of the worst hurricanes ever seen on the Gulf. More than 200 ships were sunk, including Captain Miner's. He and his crew of 19 men spent the next 18 days in open boats before they were rescued.`,
      specialNotes: 'After recuperating, he became Master on one of the Plant system boats and became a blockade runner to Cuba during the Spanish-American war. He contracted yellow fever while in Cuba and would have died if not for Theodore Roosevelt and other officers, all fellow Masons, pulling him through on a diet of brandy and morphine. His health no longer good enough to continue as a sea Captain, he acquired a pilot\'s license and engaged in pilot service on Tampa bay for the next 20 years.',
      deathDate: 'December 20, 1923',
      burialLocation: 'Royal Palm South Cemetery',
      imageUrl: 'assets/past-masters/william-b-pope.png'
    },
    {
      name: 'William B. Pope',
      years: ['1906', '1907', '1908', '1909'],
      period: 'Four Consecutive Years & District Deputy',
      biography: `Worshipful Pope served our Lodge as Worshipful Master four years in a row. His dedication to the lodge was exceptional, providing stable leadership during a critical period in our lodge's early development.`,
      specialNotes: 'He later served another four years as District Deputy Grand Master of District 27 from 1912 through 1915, demonstrating his continued commitment to Masonry beyond our lodge.',
      deathDate: 'December 13, 1930 (age 72)',
      burialLocation: 'Royal Palm South Cemetery',
      imageUrl: 'assets/past-masters/elmer-c-howard.png'
    },
    {
      name: 'Elmer C. Howard',
      years: ['1910', '1911'],
      period: 'Two Consecutive Years',
      biography: `Worshipful Howard served two years in a row, 1910 & 1911, helping to guide the lodge through the second decade of its existence.`,
      deathDate: '1931',
      burialLocation: 'Oaklawn Cemetery in Winter Haven, Florida',
      imageUrl: 'assets/past-masters/willison-h-english.png'
    },
    {
      name: 'Willison H. English',
      years: ['1912'],
      period: 'Business Leader & Knight Templar',
      biography: `Worshipful English was Worshipful Master in 1912. He was a partner in the firm of Dent & English and was known as one of the best known business men in the city. He was also a fellow Knight Templar, demonstrating his commitment to multiple Masonic bodies.`,
      specialNotes: 'According to the Tampa Tribune report of his passing: "William (sic) H. English, one of the best known business men in this city, dropped dead at 3:45 O\'clock this afternoon while attending the funeral of J. R. Craven, a friend and fellow Knight Templar..." Heart failure was the cause of his demise.',
      deathDate: 'January 3, 1918',
      imageUrl: 'assets/past-masters/willison-h-english.png'
    }
  ];
}