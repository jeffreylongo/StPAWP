import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  // Mock data for newsletters - replace with actual data from WordPress/CMS
  newsletters = [
    {
      id: 1,
      month: 'November',
      year: 2025,
      title: 'November 2025 Trestle Board',
      description: 'Monthly updates, upcoming events, and important lodge announcements.',
      pdfUrl: '/assets/newsletters/november-2025.pdf',
      publishDate: new Date(2025, 10, 1)
    },
    {
      id: 2,
      month: 'October',
      year: 2025,
      title: 'October 2025 Trestle Board',
      description: 'Monthly updates, upcoming events, and important lodge announcements.',
      pdfUrl: '/assets/newsletters/october-2025.pdf',
      publishDate: new Date(2025, 9, 1)
    },
    {
      id: 3,
      month: 'September',
      year: 2025,
      title: 'September 2025 Trestle Board',
      description: 'Monthly updates, upcoming events, and important lodge announcements.',
      pdfUrl: '/assets/newsletters/september-2025.pdf',
      publishDate: new Date(2025, 8, 1)
    }
  ];

  ngOnInit(): void {
    // Future: Load newsletters from WordPress API or service
  }

  downloadNewsletter(newsletter: any): void {
    // Open PDF in new tab
    window.open(newsletter.pdfUrl, '_blank');
  }
}

