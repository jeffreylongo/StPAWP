import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { WordPressService } from '../../services/wordpress.service';
import { WordPressPost } from '../../interfaces';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockWordPressService: jasmine.SpyObj<WordPressService>;
  let compiled: HTMLElement;

  const mockPosts: WordPressPost[] = [
    {
      id: 1,
      date: '2024-01-01T00:00:00',
      date_gmt: '2024-01-01T00:00:00',
      guid: { rendered: 'http://test.com/1' },
      modified: '2024-01-01T00:00:00',
      modified_gmt: '2024-01-01T00:00:00',
      slug: 'test-announcement',
      status: 'publish',
      type: 'post',
      link: 'http://test.com/test-announcement',
      title: { rendered: 'Test Announcement' },
      content: { rendered: '<p>Test content</p>', protected: false },
      excerpt: { rendered: '<p>Test excerpt</p>', protected: false },
      author: 1,
      featured_media: 0,
      comment_status: 'open',
      ping_status: 'open',
      sticky: false,
      template: '',
      format: 'standard',
      meta: {},
      categories: [1],
      tags: []
    }
  ];

  beforeEach(async () => {
    const wordpressServiceSpy = jasmine.createSpyObj('WordPressService', ['getPosts']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: WordPressService, useValue: wordpressServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    mockWordPressService = TestBed.inject(WordPressService) as jasmine.SpyObj<WordPressService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero section', () => {
    fixture.detectChanges();
    
    const heroTitle = compiled.querySelector('.hero-title');
    expect(heroTitle?.textContent?.trim()).toContain('Freemasonry in St. Petersburg Since 1894');
  });

  it('should render CTA buttons', () => {
    fixture.detectChanges();
    
    const ctaButtons = compiled.querySelectorAll('.btn-primary, .btn-secondary');
    expect(ctaButtons.length).toBe(2);
    
    const primaryBtn = compiled.querySelector('.btn-primary');
    expect(primaryBtn?.textContent?.trim()).toContain('Learn About Freemasonry');
    
    const secondaryBtn = compiled.querySelector('.btn-secondary');
    expect(secondaryBtn?.textContent?.trim()).toContain('Calendar of Events');
  });

  // Note: Announcements functionality was removed from home component
  // The following tests are skipped as the properties no longer exist

  it('should generate mock events', () => {
    component.loadEvents();
    
    setTimeout(() => {
      expect(component.upcomingEvents.length).toBeGreaterThan(0);
      expect(component.isLoadingEvents).toBe(false);
    }, 1600);
  });

  // Note: trackByAnnouncementId was removed with announcements functionality

  it('should track events by id', () => {
    const event = { 
      id: 1, 
      title: 'Test', 
      date: new Date(), 
      startTime: '7:00 PM', 
      endTime: '9:00 PM', 
      location: 'Lodge',
      type: 'meeting' as const,
      description: ''
    };
    const result = component.trackByEventId(0, event);
    expect(result).toBe(event.id);
  });

  // Note: getExcerpt was removed - excerpt comes from WordPress API

  it('should render info cards', () => {
    fixture.detectChanges();
    
    const infoCards = compiled.querySelectorAll('.info-card');
    expect(infoCards.length).toBe(3);
    
    const titles = Array.from(compiled.querySelectorAll('.info-title')).map(el => el.textContent?.trim());
    expect(titles).toContain('Regular Meetings');
    expect(titles).toContain('Our Lodge');
    expect(titles).toContain('Contact Us');
  });

  it('should show sync button and handle click', () => {
    fixture.detectChanges();
    
    const syncButton = compiled.querySelector('.sync-button') as HTMLButtonElement;
    expect(syncButton).toBeTruthy();
    
    spyOn(component, 'loadEvents');
    syncButton.click();
    
    expect(component.loadEvents).toHaveBeenCalled();
  });

  it('should disable sync button while loading', () => {
    component.isLoadingEvents = true;
    fixture.detectChanges();
    
    const syncButton = compiled.querySelector('.sync-button') as HTMLButtonElement;
    expect(syncButton.disabled).toBe(true);
  });
});
