import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent } from '../../interfaces';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-secretary-office',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">The Secretary's Office</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">The Secretary's Office</h1>
        <p class="text-lg mt-4 text-primary-gold-light">Communications and Updates from the Lodge Secretary</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <div class="flex items-center mb-6">
            <i class="fas fa-user-tie text-primary-gold text-3xl mr-4"></i>
            <div>
              <h2 class="font-cinzel text-2xl text-primary-blue font-bold">From the Secretary's Desk</h2>
              <p class="text-gray-600">Stay informed with the latest lodge communications</p>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed">
            Welcome to the Secretary's Office. Here you'll find important updates about our lodge activities, 
            meeting summaries, upcoming events, and special announcements. We encourage all members to stay 
            connected with lodge activities and participate in our fraternal fellowship.
          </p>
        </div>
      </div>

      <!-- Secretary's Updates Sections -->
      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <!-- What You Missed -->
        <div class="bg-neutral-light border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-blue text-white p-6">
            <div class="flex items-center">
              <i class="fas fa-history text-primary-gold text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">What You Missed at the Last Meeting</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="bg-primary-gold-light p-4 rounded-lg mb-4">
                <p class="text-primary-blue font-semibold text-center italic">
                  <i class="fas fa-utensils mr-2"></i>
                  It really goes without saying... If you miss a meeting, you miss a Fantastic Meal!!
                </p>
              </div>
              
              <div class="border-l-4 border-primary-gold pl-4">
                <h4 class="font-semibold text-primary-blue mb-2">May Stated Communication</h4>
                <p class="text-gray-700 text-sm mb-2">May 20, 2025</p>
                <div class="text-gray-600 space-y-2 text-sm">
                  <p>We had a very interesting Stated Communication. After opening in the Master Mason Degree, the Worshipful Master dropped down to the Entered Apprentice Degree to permit any Mason the ability to partake of the discussion concerning Masonic Landmarks.</p>
                  <p>Brother Malek Chevalier, one of our EAs, attended and later stated that he learned quite a lot and was looking forward to the next time he could attend such a presentation.</p>
                </div>
              </div>
              
              <div class="border-l-4 border-primary-blue pl-4">
                <h4 class="font-semibold text-primary-blue mb-2">Special Presentations & Awards</h4>
                <ul class="text-gray-600 space-y-1 text-sm">
                  <li>• Right Worshipful Oran Ellis gave a very moving presentation on the Volume of Sacred Law Landmark</li>
                  <li>• Approved By-law change to Section 1.01 correcting the Lodge address</li>
                  <li>• Brother Jeff Longo received a certificate from Grand Lodge honoring his completion of the MM1 course</li>
                  <li>• 40 Year Longevity Award presented to Worshipful John Gunter</li>
                  <li>• 55 Year Longevity Award presented to Worshipful John Gicking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- What You Will Miss -->
        <div class="bg-neutral-light border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-gold text-primary-blue-darker p-6">
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-primary-blue-darker text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">What You Will Miss if You Don't Attend the Next Meeting</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="border-l-4 border-primary-blue pl-4">
                <h4 class="font-semibold text-primary-blue mb-2">June Stated Communication</h4>
                <p class="text-gray-700 text-sm mb-2">Tuesday, June 17th - 7:30 PM</p>
                <div class="text-gray-600 space-y-2 text-sm">
                  <p>Among other business, we will be receiving the Entered Apprentice Catechism Proficiency from:</p>
                  <ul class="ml-4 space-y-1">
                    <li>• Brother Raymond Wilson</li>
                    <li>• Brother Malek Chevalier</li>
                </ul>
                </div>
              </div>
              <div class="bg-primary-gold-light p-3 rounded">
                <p class="text-primary-blue-darker text-sm font-medium">
                  <i class="fas fa-graduation-cap mr-2"></i>
                  Witness these Brothers advance in their Masonic journey!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Birthdays and Anniversaries -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-md mb-12">
        <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
          <div class="flex items-center">
            <i class="fas fa-birthday-cake text-primary-gold text-2xl mr-3"></i>
            <h3 class="font-cinzel text-xl font-bold">Birthdays and Masonic Anniversaries</h3>
          </div>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- June Birthdays -->
            <div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-4 flex items-center">
                <i class="fas fa-gift text-primary-gold mr-2"></i>
                June Birthdays
              </h4>
              <div class="max-h-80 overflow-y-auto space-y-2">
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Worshipful George Rovert Gaston, Jr</span>
                  <span class="text-gray-600">3rd</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Raymond Walter Lampe</span>
                  <span class="text-gray-600">5th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Patrick Royal Green</span>
                  <span class="text-gray-600">6th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Michael Reed Hutchins</span>
                  <span class="text-gray-600">6th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Charles Flow Lambeth</span>
                  <span class="text-gray-600">7th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Robert Theodore Eubank</span>
                  <span class="text-gray-600">8th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Worshipful David Michael Rosenthal</span>
                  <span class="text-gray-600">10th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Gregory Jack Jarrell</span>
                  <span class="text-gray-600">13th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Worshipful Chave Stevens Aspinall</span>
                  <span class="text-gray-600">16th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Edmund Eugene Olson</span>
                  <span class="text-gray-600">17th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother John Warren Edds</span>
                  <span class="text-gray-600">17th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Worshipful William Grant Smith</span>
                  <span class="text-gray-600">20th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Robert George Faustino</span>
                  <span class="text-gray-600">21st</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Richard Lee Hoskins</span>
                  <span class="text-gray-600">22nd</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother James William Lich</span>
                  <span class="text-gray-600">22nd</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Kenneth J Zeiler</span>
                  <span class="text-gray-600">23rd</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Stephen Conrad Rannells</span>
                  <span class="text-gray-600">24th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Charles Traubert</span>
                  <span class="text-gray-600">25th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Ervin Lee Watkins</span>
                  <span class="text-gray-600">26th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Richard Patrick Gallagher</span>
                  <span class="text-gray-600">26th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Brother Justin Stuart King</span>
                  <span class="text-gray-600">27th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-neutral-light rounded text-sm">
                  <span class="font-medium">Worshipful Piero Magliulo</span>
                  <span class="text-gray-600">30th</span>
                </div>
              </div>
              
              <!-- Birthday Statistics -->
              <div class="mt-4 p-4 bg-primary-gold-light rounded-lg">
                <h5 class="font-semibold text-primary-blue mb-2">Of our 22 Brothers with June Birthdays:</h5>
                <div class="text-sm text-gray-700 space-y-1">
                  <div>• Four were born in the 1930's</div>
                  <div>• Eight were born in the 1940's</div>
                  <div>• Two were born in the 1950's</div>
                  <div>• Six were born in the 1960's</div>
                  <div>• One was born in the 1970's</div>
                  <div>• One was born in the 1980's</div>
                </div>
                <p class="text-primary-blue font-semibold mt-3 text-center">
                  <i class="fas fa-birthday-cake mr-2"></i>
                  We wish each and every Brother a Very Happy Birthday!!
                </p>
              </div>
            </div>

            <!-- June Masonic Anniversaries -->
            <div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-4 flex items-center">
                <i class="fas fa-medal text-primary-gold mr-2"></i>
                June Masonic Anniversaries
              </h4>
              <div class="max-h-80 overflow-y-auto space-y-2">
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Michael Reed Hutchins</span>
                  <span class="text-primary-blue font-bold">7th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Randy Lee Evans</span>
                  <span class="text-primary-blue font-bold">7th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Russell Richard Wurr</span>
                  <span class="text-primary-blue font-bold">7th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother George Thomas Pierson</span>
                  <span class="text-primary-blue font-bold">9th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Christopher Aaron Peak</span>
                  <span class="text-primary-blue font-bold">9th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Christopher Douglas Breton</span>
                  <span class="text-primary-blue font-bold">9th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Robert Melvin Berry</span>
                  <span class="text-primary-blue font-bold">11th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother David Harry Gross</span>
                  <span class="text-primary-blue font-bold">21st</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Worshipful Nicholas Lawrence Mamalis</span>
                  <span class="text-primary-blue font-bold">22nd</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Kenneth J Zeiler</span>
                  <span class="text-primary-blue font-bold">23rd</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother James Ross Trubry</span>
                  <span class="text-primary-blue font-bold">24th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Worshipful John B Livingston</span>
                  <span class="text-primary-blue font-bold">25th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Robert Neil Talley</span>
                  <span class="text-primary-blue font-bold">25th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother William John Jacobs</span>
                  <span class="text-primary-blue font-bold">25th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother John Allen Cotton</span>
                  <span class="text-primary-blue font-bold">27th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Aaron David Higgs</span>
                  <span class="text-primary-blue font-bold">27th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Larry D Ferrell</span>
                  <span class="text-primary-blue font-bold">28th</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-primary-gold-light rounded text-sm">
                  <span class="font-medium">Brother Wyatt Keith Wright</span>
                  <span class="text-primary-blue font-bold">30th</span>
                </div>
              </div>
              
              <!-- Anniversary Statistics -->
              <div class="mt-4 p-4 bg-primary-blue-light rounded-lg">
                <h5 class="font-semibold text-primary-blue mb-2">Of the 18 Brothers Raised in June:</h5>
                <div class="text-sm text-gray-700 space-y-1">
                  <div>• One was Raised in the 1950's</div>
                  <div>• One was Raised in the 1960's</div>
                  <div>• Three were Raised in the 1970's</div>
                  <div>• Two were Raised in the 1980's</div>
                  <div>• None were Raised in the 1990's</div>
                  <div>• Three were Raised in the 2000's</div>
                  <div>• Seven were Raised in the 2010's</div>
                  <div>• One was Raised in the 2020's</div>
                </div>
                <p class="text-sm text-gray-600 mt-3 italic">
                  Of the seven Raised in the 2010's, two were Raised on the same day in 2015 and three were Raised on the same day in 2016.
                </p>
                <p class="text-primary-blue font-semibold mt-3 text-center">
                  Brothers, whether you were Raised 67 years ago or 9 years ago, your Lodge congratulates you and thanks you for your continuous support!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coming Months -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-md mb-12">
        <div class="bg-primary-blue-dark text-white p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-calendar-alt text-primary-gold text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">What You Can Look Forward to in the Coming Months</h3>
            </div>
            <div *ngIf="isLoadingEvents" class="flex items-center text-primary-gold">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              <span class="text-sm">Loading events...</span>
            </div>
          </div>
        </div>
        <div class="p-6">
          <!-- Loading State -->
          <div *ngIf="isLoadingEvents" class="grid md:grid-cols-3 gap-6">
            <div *ngFor="let item of [1,2,3]" class="animate-pulse">
              <div class="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-3"></div>
              <div class="bg-gray-200 h-6 w-20 mx-auto mb-2 rounded"></div>
              <div class="bg-gray-200 h-4 w-full mb-1 rounded"></div>
              <div class="bg-gray-200 h-4 w-3/4 mx-auto rounded"></div>
            </div>
          </div>

          <!-- Real Events Display -->
          <div *ngIf="!isLoadingEvents && upcomingEvents.length > 0">
            <!-- Month Preview Cards -->
            <div class="grid md:grid-cols-3 gap-6 mb-8">
              <div *ngFor="let monthData of getNext3MonthsPreview(); let i = index" class="text-center">
                <div [ngClass]="{
                  'bg-primary-gold text-primary-blue-darker': i === 0,
                  'bg-primary-blue text-white': i === 1,
                  'bg-primary-gold-light text-primary-blue': i === 2
                }" class="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <i [class]="'text-xl ' + getIconClassForMonth(monthData)"></i>
                </div>
                <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-2">{{ monthData.month }}</h4>
                <p class="text-gray-600 text-sm">
                  {{ monthData.events.length }} scheduled event{{ monthData.events.length !== 1 ? 's' : '' }}
                </p>
                <div class="mt-2 text-xs text-gray-500">
                  <div *ngFor="let event of monthData.events.slice(0, 2)" class="truncate">
                    {{ event.title }}
                  </div>
                  <div *ngIf="monthData.events.length > 2" class="text-primary-blue font-medium">
                    +{{ monthData.events.length - 2 }} more
                  </div>
                </div>
              </div>
            </div>

            <!-- Lodge Highlights -->
            <div class="border-t pt-6 mb-6">
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-4 flex items-center">
                <i class="fas fa-star mr-2 text-primary-gold"></i>
                What to Look Forward To
              </h4>
              <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-primary-gold-light p-4 rounded-lg">
                  <h5 class="font-semibold text-primary-blue mb-2">
                    <i class="fas fa-newspaper mr-2"></i>The Return of the Trestle Board
                  </h5>
                  <p class="text-sm text-gray-700">Stay informed with our restored lodge newsletter</p>
                </div>
                <div class="bg-primary-blue-light p-4 rounded-lg">
                  <h5 class="font-semibold text-primary-blue mb-2">
                    <i class="fas fa-building mr-2"></i>New Building Updates
                  </h5>
                  <p class="text-sm text-gray-700">Progress reports on our lodge improvements</p>
                </div>
                <div class="bg-neutral-light p-4 rounded-lg">
                  <h5 class="font-semibold text-primary-blue mb-2">
                    <i class="fas fa-book mr-2"></i>Virtual Masonic Library
                  </h5>
                  <p class="text-sm text-gray-700">Access countless Masonic books and papers</p>
                </div>
                <div class="bg-primary-gold-light p-4 rounded-lg">
                  <h5 class="font-semibold text-primary-blue mb-2">
                    <i class="fas fa-users mr-2"></i>New Teams & Training
                  </h5>
                  <p class="text-sm text-gray-700">Join our Funeral Team, become a Mentor or Catechism coach</p>
                </div>
              </div>
            </div>

            <!-- Detailed Events List -->
            <div class="border-t pt-6">
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-4 flex items-center">
                <i class="fas fa-list mr-2 text-primary-gold"></i>
                Upcoming Lodge Events
              </h4>
              <div class="space-y-3">
                <div *ngFor="let event of upcomingEvents.slice(0, 8); trackBy: trackByEventId" 
                     class="flex items-start gap-4 p-4 bg-neutral-light rounded-lg hover:shadow-md transition-shadow">
                  <div class="bg-primary-blue text-white rounded-lg min-w-16 h-16 flex flex-col items-center justify-center flex-shrink-0">
                    <span class="text-lg font-bold">{{ event.date | date:'d' }}</span>
                    <span class="text-xs uppercase">{{ event.date | date:'MMM' }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="font-semibold text-primary-blue mb-1">{{ event.title }}</h5>
                    <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      <span class="flex items-center">
                        <i class="fas fa-clock mr-1 text-primary-gold"></i>
                        {{ event.startTime }} - {{ event.endTime }}
                      </span>
                      <span class="flex items-center" *ngIf="event.location">
                        <i class="fas fa-map-marker-alt mr-1 text-primary-gold"></i>
                        {{ event.location }}
                      </span>
                </div>
                    <p *ngIf="event.description" class="text-sm text-gray-700 line-clamp-2">
                      {{ event.description }}
                    </p>
                    <span class="inline-block mt-2 px-2 py-1 text-xs rounded-full" 
                          [class]="getEventTypeClass(event.type)">
                      {{ event.type | titlecase }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="text-center mt-6" *ngIf="upcomingEvents.length > 8">
                <a routerLink="/calendar" 
                   class="inline-flex items-center bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-3 rounded-md transition-colors">
                  <i class="fas fa-calendar mr-2"></i>
                  View Full Calendar ({{ upcomingEvents.length }} total events)
                </a>
              </div>
            </div>
          </div>

          <!-- No Events State -->
          <div *ngIf="!isLoadingEvents && upcomingEvents.length === 0" class="text-center py-12">
            <i class="fas fa-calendar text-gray-300 text-5xl mb-4"></i>
            <p class="text-gray-500 text-lg mb-2">No upcoming events scheduled</p>
            <p class="text-gray-400 text-sm">Check back soon or contact the Secretary for more information</p>
          </div>
        </div>
      </div>

      <!-- Contact Secretary -->
      <div class="mt-12 text-center">
        <div class="bg-primary-blue text-white p-8 rounded-lg">
          <h3 class="font-cinzel text-2xl font-bold mb-4">Questions or Concerns?</h3>
          <p class="mb-6 text-primary-gold-light">
            The Secretary's Office is here to help. Don't hesitate to reach out with any questions about lodge activities or membership.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:secretary@stpetelodge139.org" 
               class="bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold px-6 py-3 rounded transition inline-flex items-center">
              <i class="fas fa-envelope mr-2"></i>
              Email the Secretary
            </a>
            <a href="tel:+17274183356" 
               class="border-2 border-white hover:border-primary-gold text-white hover:text-primary-gold px-6 py-3 rounded transition inline-flex items-center">
              <i class="fas fa-phone mr-2"></i>
              (727) 418-3356
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class SecretaryOfficeComponent implements OnInit {
  upcomingEvents: CalendarEvent[] = [];
  isLoadingEvents = true;

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents(): void {
    this.isLoadingEvents = true;

    // Load events from St. Pete Lodge calendar (calendarId = 1) for the next 6 months
    this.calendarService.getNext6MonthsEvents()
      .pipe(
        map(events => events
          .filter(event => event.calendarId === 1) // Only St. Pete Lodge events
          .slice(0, 12) // Limit to next 12 events for secretary office display
        ),
        catchError(error => {
          console.error('Error loading calendar events for Secretary Office:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (events) => {
          this.upcomingEvents = events;
          this.isLoadingEvents = false;
          console.log(`📋 Secretary Office loaded ${events.length} upcoming Lodge events`);
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.upcomingEvents = [];
          this.isLoadingEvents = false;
        }
      });
  }

  // Group events by month for display
  getEventsByMonth(): { [key: string]: CalendarEvent[] } {
    const eventsByMonth: { [key: string]: CalendarEvent[] } = {};
    
    this.upcomingEvents.forEach(event => {
      const monthKey = event.date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!eventsByMonth[monthKey]) {
        eventsByMonth[monthKey] = [];
      }
      eventsByMonth[monthKey].push(event);
    });
    
    return eventsByMonth;
  }

  // Get the next 3 months with events for the preview cards
  getNext3MonthsPreview(): { month: string; events: CalendarEvent[] }[] {
    const eventsByMonth = this.getEventsByMonth();
    const months = Object.keys(eventsByMonth).slice(0, 3);
    
    return months.map(month => ({
      month,
      events: eventsByMonth[month]
    }));
  }

  trackByEventId(index: number, event: CalendarEvent): number {
    return event.id;
  }

  // Helper methods for template
  getIconClassForMonth(monthData: { month: string; events: CalendarEvent[] }): string {
    if (monthData.events.some(e => e.type === 'meeting')) return 'fas fa-gavel';
    if (monthData.events.some(e => e.type === 'degree')) return 'fas fa-graduation-cap';
    if (monthData.events.some(e => e.type === 'dinner')) return 'fas fa-utensils';
    if (monthData.events.some(e => e.type === 'education')) return 'fas fa-book';
    return 'fas fa-calendar';
  }

  getEventTypeClass(eventType: string): string {
    const typeClasses: { [key: string]: string } = {
      'meeting': 'bg-blue-100 text-blue-800',
      'degree': 'bg-purple-100 text-purple-800',
      'dinner': 'bg-green-100 text-green-800',
      'education': 'bg-yellow-100 text-yellow-800'
    };
    return typeClasses[eventType] || 'bg-gray-100 text-gray-800';
  }

}
