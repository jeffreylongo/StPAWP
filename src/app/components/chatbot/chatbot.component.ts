import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  HostListener,
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

  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;

  messages: ChatMessage[] = [];
  isOpen = false;
  userInput = '';

  constructor(private chatbotService: ChatbotService) {}

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
        }
      });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
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
