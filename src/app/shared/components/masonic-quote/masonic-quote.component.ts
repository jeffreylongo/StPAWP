import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

interface MasonicQuote {
  id: number;
  quote: string;
  person: string;
  yearsServed: string;
  masonicTitles: string[];
  source: string;
}

@Component({
  selector: 'app-masonic-quote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masonic-quote.component.html',
  styleUrls: ['./masonic-quote.component.css']
})
export class MasonicQuoteComponent implements OnInit, OnDestroy {
  @Input() variant: 'hero' | 'section' | 'compact' = 'hero';
  @Input() autoRotate: boolean = false;
  @Input() rotateInterval: number = 15000; // 15 seconds default
  @Input() showSource: boolean = true;
  @Input() customClasses: string = '';
  
  currentQuote?: MasonicQuote;
  quotes: MasonicQuote[] = [];
  isLoading: boolean = true;
  private rotationSubscription?: Subscription;
  private fadeClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  ngOnDestroy(): void {
    if (this.rotationSubscription) {
      this.rotationSubscription.unsubscribe();
    }
  }

  loadQuotes(): void {
    this.http.get<MasonicQuote[]>('assets/enums/quotes.json').subscribe({
      next: (quotes) => {
        this.quotes = quotes;
        this.selectRandomQuote();
        this.isLoading = false;
        
        if (this.autoRotate) {
          this.startAutoRotation();
        }
      },
      error: (error) => {
        console.error('Error loading quotes:', error);
        this.isLoading = false;
      }
    });
  }

  selectRandomQuote(): void {
    if (this.quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.quotes.length);
      this.currentQuote = this.quotes[randomIndex];
    }
  }

  nextQuote(): void {
    // Add fade out effect
    this.fadeClass = 'fade-out';
    
    setTimeout(() => {
      this.selectRandomQuote();
      this.fadeClass = 'fade-in';
      
      setTimeout(() => {
        this.fadeClass = '';
      }, 500);
    }, 300);
  }

  startAutoRotation(): void {
    this.rotationSubscription = interval(this.rotateInterval).subscribe(() => {
      this.nextQuote();
    });
  }

  getAuthorDisplay(): string {
    if (!this.currentQuote) return '';
    
    const topTitle = this.currentQuote.masonicTitles.length > 0 
      ? this.currentQuote.masonicTitles[0] 
      : '';
    
    return topTitle ? `${this.currentQuote.person}, ${topTitle}` : this.currentQuote.person;
  }

  getContainerClasses(): string {
    const baseClasses = 'masonic-quote-container';
    const variantClass = `variant-${this.variant}`;
    return `${baseClasses} ${variantClass} ${this.customClasses} ${this.fadeClass}`;
  }
}

