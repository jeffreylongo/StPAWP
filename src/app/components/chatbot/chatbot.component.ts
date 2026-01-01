import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  HostListener,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatbotService } from '../../services/chatbot.service';
import { ChatMessage } from './chatbot.rules';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('inputField') private inputField!: ElementRef;
  @ViewChild('chatWindow') private chatWindow!: ElementRef;

  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;
  private viewportResizeHandler: (() => void) | null = null;

  messages: ChatMessage[] = [];
  isOpen = false;
  userInput = '';

  constructor(
    private chatbotService: ChatbotService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.chatbotService.messages
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages) => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
      });

    this.chatbotService.isOpen
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOpen) => {
        this.isOpen = isOpen;
        if (isOpen) {
          setTimeout(() => this.focusInput(), 100);
          this.setupViewportHandler();
        } else {
          this.removeViewportHandler();
        }
      });
  }

  /**
   * Sets up the visualViewport resize handler to adjust chat height
   * when the mobile keyboard appears/disappears.
   * This is the most reliable cross-browser solution for mobile keyboards.
   */
  private setupViewportHandler(): void {
    if (typeof window !== 'undefined' && window.visualViewport) {
      this.viewportResizeHandler = () => this.adjustForKeyboard();
      window.visualViewport.addEventListener('resize', this.viewportResizeHandler);
      window.visualViewport.addEventListener('scroll', this.viewportResizeHandler);
      // Initial adjustment
      this.adjustForKeyboard();
    }
  }

  private removeViewportHandler(): void {
    if (typeof window !== 'undefined' && window.visualViewport && this.viewportResizeHandler) {
      window.visualViewport.removeEventListener('resize', this.viewportResizeHandler);
      window.visualViewport.removeEventListener('scroll', this.viewportResizeHandler);
      this.viewportResizeHandler = null;
    }
  }

  private adjustForKeyboard(): void {
    if (!this.chatWindow?.nativeElement || !window.visualViewport) return;

    const viewport = window.visualViewport;
    const chatEl = this.chatWindow.nativeElement as HTMLElement;

    // Only apply on mobile (width <= 480px)
    if (window.innerWidth > 480) return;

    // Calculate the visible height accounting for keyboard
    const visibleHeight = viewport.height;
    const offsetTop = viewport.offsetTop;

    // Set the chat window height to match the visible viewport
    // Subtract the top offset (115px for navbar)
    const navbarHeight = 115;
    const newHeight = visibleHeight - navbarHeight + offsetTop;

    this.renderer.setStyle(chatEl, 'height', `${Math.max(newHeight, 200)}px`);

    // Scroll to keep input visible
    setTimeout(() => this.scrollToBottom(), 50);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.removeViewportHandler();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Close chat on Escape key
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.closeChat();
    }
  }

  toggleChat(): void {
    this.chatbotService.toggleChat();
  }

  closeChat(): void {
    this.chatbotService.closeChat();
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    this.chatbotService.sendUserMessage(this.userInput);
    this.userInput = '';
    this.focusInput();
  }

  formatMessage(text: string): string {
    // Convert markdown-style formatting to HTML
    let formatted = text
      // Bold: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic: *text* or _text_
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n/g, '<br>')
      // Bullet points
      .replace(/^• /gm, '<li>')
      .replace(/<li>(.*?)(?=<br>|$)/g, '<li>$1</li>');

    // Wrap consecutive list items in ul
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(
        /(<li>.*?<\/li>(<br>)?)+/g,
        '<ul>$&</ul>'
      );
      formatted = formatted.replace(/<br><\/ul>/g, '</ul>');
      formatted = formatted.replace(/<ul><br>/g, '<ul>');
    }

    return formatted;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  private focusInput(): void {
    if (this.inputField) {
      this.inputField.nativeElement.focus();
    }
  }
}
