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
  
  currentNewsletter: WordPressPost | null = null;
  newsletters: WordPressPost[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private wordpressService: WordPressService) {}

  ngOnInit(): void {
    this.loadTrestleBoardContent();
  }

  loadTrestleBoardContent(): void {
    this.loading = true;
    this.error = null;

    // Load current/latest newsletter
    this.wordpressService.getCurrentTrestleBoard().subscribe({
      next: (post) => {
        if (post) {
          this.currentNewsletter = post;
          // Update current month/year from the latest post date
          const postDate = new Date(post.date);
          this.currentMonth = postDate.toLocaleDateString('en-US', { month: 'long' });
          this.currentYear = postDate.getFullYear();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading current Trestle Board:', err);
        this.error = 'Unable to load newsletter content. Please try again later.';
        this.loading = false;
      }
    });

    // Load archive of previous newsletters
    this.wordpressService.getTrestleBoardPosts({ per_page: 10 }).subscribe({
      next: (posts) => {
        // Skip the first post (current newsletter) and show the rest as archives
        this.newsletters = posts.slice(1);
      },
      error: (err) => {
        console.error('Error loading Trestle Board archive:', err);
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

  downloadNewsletter(post: WordPressPost): void {
    // Open the WordPress post in a new tab
    window.open(post.link, '_blank');
  }
}

