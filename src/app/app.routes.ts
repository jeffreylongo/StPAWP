import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'secretary-office',
    loadComponent: () => import('./pages/secretary-office/secretary-office.component').then(m => m.SecretaryOfficeComponent)
  },
  {
    path: 'about-139',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent)
  },
  {
    path: 'officers',
    loadComponent: () => import('./pages/officers/officers.component').then(m => m.OfficersComponent)
  },
  {
    path: 'past-masters',
    loadComponent: () => import('./pages/past-masters/past-masters.component').then(m => m.PastMastersComponent)
  },
  {
    path: 'becoming-mason',
    loadComponent: () => import('./pages/becoming-mason/becoming-mason.component').then(m => m.BecomingMasonComponent)
  },
  {
    path: 'forms',
    loadComponent: () => import('./pages/forms/forms.component').then(m => m.FormsComponent)
  },
  {
    path: 'dues-donations',
    loadComponent: () => import('./pages/dues-donations/dues-donations.component').then(m => m.DuesDonationsComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar.component').then(m => m.CalendarComponent)
  },
  {
    path: 'members',
    loadComponent: () => import('./pages/members/members.component').then(m => m.MembersComponent)
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'announcements/:slug',
    loadComponent: () => import('./pages/announcement-detail/announcement-detail.component').then(m => m.AnnouncementDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];