import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WordPressService } from '../../services/wordpress.service';
import { WordPressPost } from '../../interfaces';

@Component({
  selector: 'app-trestle-board',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trestle-board.component.html',
  styleUrls: ['./trestle-board.component.css']
})
export class TrestleBoardComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  currentMonth: string = new Date().toLocaleDateString('en-US', { month: 'long' });
  
  currentMonthNewsletters: WordPressPost[] = [];
  archivedNewsletters: WordPressPost[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedNewsletter: WordPressPost | null = null;

  constructor(private wordpressService: WordPressService) {}

  ngOnInit(): void {
    this.loadTrestleBoardContent();
  }

  loadTrestleBoardContent(): void {
    this.loading = true;
    this.error = null;

    // Load the most recent posts - first one is featured, rest go to archive
    this.wordpressService.getTrestleBoardPosts({ per_page: 20 }).subscribe({
      next: (posts) => {
        if (posts.length > 0) {
          // Most recent post goes to featured section
          this.currentMonthNewsletters = [posts[0]];
          // Rest go to archive
          this.archivedNewsletters = posts.slice(1, 13); // Up to 12 archived posts
        } else {
          this.currentMonthNewsletters = [];
          this.archivedNewsletters = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading Trestle Boards:', err);
        this.error = 'Unable to load newsletter content. Please try again later.';
        this.loading = false;
      }
    });
  }

  getPostExcerpt(post: WordPressPost): string {
    // Extract plain text from HTML excerpt
    const div = document.createElement('div');
    div.innerHTML = post.excerpt?.rendered || '';
    return div.textContent || div.innerText || 'Newsletter content available.';
  }

  getPostMonth(post: WordPressPost): string {
    const postDate = new Date(post.date);
    return postDate.toLocaleDateString('en-US', { month: 'long' });
  }

  getPostYear(post: WordPressPost): number {
    const postDate = new Date(post.date);
    return postDate.getFullYear();
  }

  downloadNewsletter(post: WordPressPost, event?: Event): void {
    console.log('downloadNewsletter called for:', post.title.rendered);
    console.log('Post link:', post.link);
    console.log('Post slug:', post.slug);
    
    // Prevent any default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Show the newsletter content inline by setting it as selected
    this.selectedNewsletter = post;
    
    console.log('Selected newsletter set:', this.selectedNewsletter?.title.rendered);
    
    // Scroll to the top of the page to show the selected newsletter
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  closeNewsletter(): void {
    this.selectedNewsletter = null;
  }
}

