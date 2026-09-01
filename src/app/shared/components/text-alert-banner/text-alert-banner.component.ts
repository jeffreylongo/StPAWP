import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-alert-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="wrapperClass">
      <a [href]="smsHref" class="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span class="inline-flex items-center">
          <i class="fas fa-mobile-alt" [ngClass]="iconClass"></i>
          <span *ngIf="variant !== 'compact'" class="font-cinzel font-bold mr-2">Text Alerts</span>
        </span>
        <span>
          TEXT — <strong class="tracking-wide">stpete139</strong> — to
          <strong class="whitespace-nowrap">727-634-7127</strong>
          to be added to our text alerts
        </span>
      </a>
    </div>
  `
})
export class TextAlertBannerComponent {
  @Input() variant: 'compact' | 'section' | 'card' = 'section';

  readonly smsHref = 'sms:+17276347127?body=stpete139';

  get wrapperClass(): string {
    switch (this.variant) {
      case 'compact':
        return 'bg-primary-blue text-white text-center py-1.5 px-3 text-xs sm:text-sm font-semibold hover:bg-primary-blue-dark transition-colors';
      case 'card':
        return 'bg-primary-blue text-white rounded-lg p-5 text-center text-sm sm:text-base font-semibold shadow-md hover:bg-primary-blue-dark transition-colors';
      default:
        return 'bg-primary-blue text-white text-center py-3 px-4 text-sm sm:text-base font-semibold hover:bg-primary-blue-dark transition-colors';
    }
  }

  get iconClass(): string {
    return this.variant === 'compact' ? 'mr-2 text-primary-gold' : 'mr-2 text-primary-gold text-lg';
  }
}
