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

  constructor(private wordpressService: WordPressService) {}

  ngOnInit(): void {
    this.loadTrestleBoardContent();
  }

  loadTrestleBoardContent(): void {
    this.loading = true;
    this.error = null;

    // Load all posts from current month
    this.wordpressService.getCurrentMonthTrestleBoards().subscribe({
      next: (posts) => {
        this.currentMonthNewsletters = posts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading current month Trestle Boards:', err);
        this.error = 'Unable to load newsletter content. Please try again later.';
        this.loading = false;
      }
    });

    // Load all posts for archive (will filter out current month posts in the archive section)
    this.wordpressService.getTrestleBoardPosts({ per_page: 50 }).subscribe({
      next: (posts) => {
        // Filter out posts from current month - only show older posts in archive
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        this.archivedNewsletters = posts.filter(post => {
          const postDate = new Date(post.date);
          return !(postDate.getMonth() === currentMonth && 
                   postDate.getFullYear() === currentYear);
        }).slice(0, 12); // Show up to 12 archived posts
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

