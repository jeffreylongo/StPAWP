import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TextAlertBannerComponent } from '../../shared/components/text-alert-banner/text-alert-banner.component';

interface PetitionDocument {
  code: string;
  title: string;
  description: string;
  file: string;
  icon: string;
  audience: string;
}

interface PetitionGroup {
  id: string;
  heading: string;
  summary: string;
  icon: string;
  petitions: PetitionDocument[];
}

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, RouterModule, TextAlertBannerComponent],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Forms & Petitions</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Forms & Petitions</h1>
        <p class="text-primary-gold-light text-xl mt-4">Grand Lodge of Florida membership petitions and certificates</p>
      </div>
    </div>

    <app-text-alert-banner variant="section"></app-text-alert-banner>

    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <div class="max-w-4xl mx-auto">
          <i class="fas fa-scroll text-6xl text-primary-gold mb-6"></i>
          <h2 class="font-cinzel text-3xl font-bold text-primary-blue mb-6">Lodge Petitions</h2>
          <div class="w-24 h-1 bg-primary-gold mx-auto mb-8"></div>
          <p class="text-gray-600 text-lg leading-relaxed">
            Download the current Grand Lodge of Florida petition and certificate forms used by St. Petersburg Lodge No. 139.
            If you need help choosing or completing a form, contact the Secretary or visit us on the third Tuesday of each month.
          </p>
        </div>
      </div>

      <div class="mb-16" *ngFor="let group of petitionGroups">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 pb-4 border-b-2 border-primary-gold">
          <div>
            <h3 class="font-cinzel text-2xl md:text-3xl font-bold text-primary-blue mb-2">
              <i class="{{ group.icon }} text-primary-gold mr-3"></i>
              {{ group.heading }}
            </h3>
            <p class="text-gray-600 max-w-3xl">{{ group.summary }}</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <article
            *ngFor="let petition of group.petitions"
            class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
            <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
              <div class="flex items-start">
                <div class="bg-primary-gold text-primary-blue-darker w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <i class="fas {{ petition.icon }} text-lg"></i>
                </div>
                <div>
                  <p class="text-primary-gold text-xs font-bold uppercase tracking-wider mb-1">{{ petition.code }}</p>
                  <h4 class="font-cinzel text-lg font-bold leading-snug">{{ petition.title }}</h4>
                </div>
              </div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <p class="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">{{ petition.description }}</p>
              <div class="flex flex-wrap justify-between items-center gap-3">
                <span class="text-xs text-gray-500">{{ petition.audience }}</span>
                <a [href]="petition.file"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-4 py-2 rounded-lg transition inline-flex items-center text-sm">
                  <i class="fas fa-download mr-2"></i>
                  Download PDF
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="bg-gradient-to-r from-neutral-light to-white rounded-lg p-8 shadow-md">
        <div class="text-center">
          <h3 class="font-cinzel text-2xl font-bold text-primary-blue mb-6">
            <i class="fas fa-question-circle text-primary-gold mr-3"></i>
            Need Help with Forms?
          </h3>
          <p class="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
            If you need assistance completing any forms or have questions about the membership process,
            our Secretary and officers are here to help. Contact us or visit during our regular meetings.
          </p>

          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="bg-primary-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-envelope text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Email Us</h4>
              <p class="text-gray-600 text-sm mb-3">Get help via email</p>
              <a href="mailto:secretary&#64;stpete139.org"
                 class="text-primary-blue hover:text-primary-gold font-medium text-sm">
                secretary&#64;stpete139.org
              </a>
            </div>

            <div class="text-center">
              <div class="bg-primary-gold text-primary-blue-darker w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-phone text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Call Us</h4>
              <p class="text-gray-600 text-sm mb-3">Speak with our Secretary</p>
              <a href="tel:+17274183356"
                 class="text-primary-blue hover:text-primary-gold font-medium text-sm">
                (727) 418-3356
              </a>
            </div>

            <div class="text-center">
              <div class="bg-primary-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-calendar text-2xl"></i>
              </div>
              <h4 class="font-semibold text-primary-blue mb-2">Visit Us</h4>
              <p class="text-gray-600 text-sm mb-3">3rd Tuesday each month</p>
              <p class="text-primary-blue font-medium text-sm">
                Dinner 6:30 PM | Meeting 7:30 PM
              </p>
            </div>
          </div>

          <div class="text-center">
            <a routerLink="/contact"
               class="bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold px-8 py-3 rounded-lg transition inline-flex items-center">
              <i class="fas fa-info-circle mr-2"></i>
              More Contact Information
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FormsComponent {
  readonly petitionGroups: PetitionGroup[] = [
    {
      id: 'joining',
      heading: 'Joining the Lodge',
      summary: 'For men petitioning St. Petersburg Lodge No. 139 for the degrees of Freemasonry.',
      icon: 'fas fa-user-plus',
      petitions: [
        {
          code: 'GL-601',
          title: 'Petition for the Degrees of Freemasonry',
          description: 'Official Grand Lodge petition for men seeking initiation, passing, and raising at St. Petersburg Lodge No. 139. Complete this form with two lodge members as sponsors.',
          file: 'assets/petitions/GL-601-PETITION-FOR-THE-DEGREES-OF-FREEMASONRY-1.pdf',
          icon: 'fa-scroll',
          audience: 'New petitioners'
        },
        {
          code: 'GL-602',
          title: 'Supplementary Information',
          description: 'Companion questionnaire to GL-601. Provides additional background for the Petitions Committee and should be submitted with the petition for the degrees.',
          file: 'assets/petitions/GL-602-SUPPLEMENTARY-INFORMATION.pdf',
          icon: 'fa-clipboard-list',
          audience: 'Submit with GL-601'
        }
      ]
    },
    {
      id: 'affiliation',
      heading: 'Affiliation & Transfer',
      summary: 'For Master Masons transferring membership to St. Petersburg Lodge No. 139, or requesting a transfer certificate of good standing.',
      icon: 'fas fa-exchange-alt',
      petitions: [
        {
          code: 'GL-603',
          title: 'Petition for Affiliation by Transfer of Membership',
          description: 'Used by a Master Mason in good standing who wishes to transfer his membership to St. Petersburg Lodge No. 139.',
          file: 'assets/petitions/GL-603-PETITION-FOR-AFFILIATION-BY-TRANSFER-OF-MEMBERSHIP-GL-603.pdf',
          icon: 'fa-right-left',
          audience: 'Transferring members'
        },
        {
          code: 'GL-604',
          title: 'Transfer Certificate of Good Standing',
          description: 'Certificate of good standing used in connection with a transfer of membership between lodges.',
          file: 'assets/petitions/GL-604-updated-July-2025.pdf',
          icon: 'fa-stamp',
          audience: 'Transfer documentation'
        }
      ]
    },
    {
      id: 'dual-plural',
      heading: 'Dual & Plural Membership',
      summary: 'For members remaining in their home lodge while also joining St. Petersburg Lodge No. 139, or adding plural membership.',
      icon: 'fas fa-users',
      petitions: [
        {
          code: 'GL-608',
          title: 'Petition for Dual Membership',
          description: 'Petition for dual membership in St. Petersburg Lodge No. 139 while remaining a member of another lodge.',
          file: 'assets/petitions/GL-608-PETITION-FOR-DUAL-MEMBERSHIP-Gl-608.pdf',
          icon: 'fa-user-friends',
          audience: 'Dual membership'
        },
        {
          code: 'GL-604c',
          title: 'Certificate of Good Standing — Dual Membership',
          description: 'Petition for a certificate of good standing in support of dual membership.',
          file: 'assets/petitions/GL-604c-updated-Oct-13-1.pdf',
                  icon: 'fa-certificate',
          audience: 'Submit with GL-608'
        },
        {
          code: 'GL-615',
          title: 'Petition for Plural Membership',
          description: 'Petition for plural membership when a brother already belongs to more than one lodge and seeks membership here.',
          file: 'assets/petitions/GL-615-PluralMembership.pdf',
          icon: 'fa-layer-group',
          audience: 'Plural membership'
        },
        {
          code: 'GL-604c',
          title: 'Certificate of Good Standing — Plural Membership',
          description: 'Certificate of good standing used in support of a petition for plural membership.',
          file: 'assets/petitions/GL-604c-updated-Oct-13-1-PLURAL.pdf',
                  icon: 'fa-certificate',
          audience: 'Submit with GL-615'
        }
      ]
    },
    {
      id: 'reinstatement',
      heading: 'Reinstatement',
      summary: 'For former members seeking to restore membership in the Lodge.',
      icon: 'fas fa-redo',
      petitions: [
        {
          code: 'GL-605',
          title: 'Petition for Reinstatement',
          description: 'Official petition for a former member seeking reinstatement to membership in St. Petersburg Lodge No. 139.',
          file: 'assets/petitions/GL-605-Petition-For-Reinstatement-updated-June-2026.pdf',
          icon: 'fa-rotate-left',
          audience: 'Former members'
        }
      ]
    }
  ];
}
