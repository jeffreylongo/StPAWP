# St. Petersburg Lodge No. 139 F&AM - Angular Application

A modern, responsive web application for St. Petersburg Lodge No. 139 Free & Accepted Masons, built with Angular 17 and featuring real-time ICS calendar syncing.

## 🏛️ About St. Petersburg Lodge No. 139

Founded in 1894, St. Petersburg Lodge No. 139 F&AM is a historic Masonic lodge serving the St. Petersburg, Florida community. This application serves as the digital presence for the lodge, providing information about meetings, events, history, and Masonic education.

## ✨ Features

### 🗓️ Advanced Calendar System
- **Real-time ICS Syncing**: Automatically syncs with multiple calendar sources
- **St. Petersburg Lodge Calendar**: Official lodge events and meetings
- **Suncoast Masters & Wardens**: Regional Masonic events
- **Interactive Calendar View**: Monthly calendar with event details
- **Upcoming Events**: Dashboard showing next 10 upcoming events
- **Event Categorization**: Meeting, Degree, Dinner, Education, and Other events

### 🎨 Modern Design
- **Lodge Coat of Arms**: Official lodge emblem prominently displayed
- **Masonic Color Scheme**: Traditional blue and gold styling
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Professional Typography**: Cinzel and Cormorant Garamond fonts

### 📱 Core Pages
- **Home**: Hero section with announcements and upcoming events
- **About**: Lodge history and information
- **Calendar**: Full calendar view with event management
- **Officers**: Current lodge leadership
- **Past Masters**: Historical lodge leadership
- **Shop**: WooCommerce integration for lodge merchandise
- **Contact**: Lodge contact information and location
- **Forms**: Masonic forms and documents

### 🔧 Technical Features
- **Angular 17**: Latest Angular framework with standalone components
- **TypeScript**: Fully typed for better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **WordPress Integration**: REST API for content management
- **WooCommerce Support**: E-commerce functionality
- **FontAwesome Icons**: Professional iconography
- **Lazy Loading**: Optimized performance with route-based code splitting

## 🚀 Getting Started

### Prerequisites
- Node.js 18.13+ (recommended: 18.20.2)
- npm 10+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stpete-lodge139-angular.git
   cd stpete-lodge139-angular
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run linting

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── footer/         # Site footer
│   │   ├── lodge-emblem/   # Lodge coat of arms component
│   │   └── navbar/         # Site navigation
│   ├── interfaces/         # TypeScript interfaces
│   │   ├── api.interface.ts
│   │   ├── event.interface.ts
│   │   ├── wordpress.interface.ts
│   │   └── index.ts
│   ├── pages/              # Route components
│   │   ├── about/
│   │   ├── calendar/       # Advanced calendar system
│   │   ├── home/
│   │   ├── shop/
│   │   └── ...
│   ├── services/           # Angular services
│   │   ├── calendar.service.ts    # ICS calendar integration
│   │   ├── wordpress.service.ts   # WordPress API
│   │   └── woocommerce.service.ts # E-commerce API
│   └── environments/       # Environment configurations
├── assets/                 # Static assets
│   └── coa.png            # Lodge coat of arms
└── styles.scss            # Global styles
```

## 🗓️ Calendar Integration

The application features a sophisticated calendar system that supports multiple ICS sources:

### Calendar Sources
1. **St. Petersburg Lodge No. 139**
   - Official lodge meetings and events
   - Degree ceremonies
   - Fellowship dinners
   - Educational programs

2. **Suncoast Masters & Wardens Association**
   - Regional Masonic events
   - Inter-lodge activities
   - Educational seminars

### Calendar Features
- **Real-time Sync**: Manual sync button for fresh data
- **Event Filtering**: Filter by calendar source
- **Event Types**: Categorized events (Meeting, Degree, Dinner, Education, Other)
- **Responsive Views**: Desktop calendar grid and mobile-optimized list
- **Event Details**: Click events for detailed information

## 🎨 Design System

### Colors
- **Primary Blue**: `#1a4b8f` (Lodge blue)
- **Primary Gold**: `#c6a84a` (Masonic gold)
- **Neutral Light**: `#f5f5f5` (Background)

### Typography
- **Headers**: Cinzel (Masonic elegance)
- **Body**: Cormorant Garamond (Readability)
- **UI Elements**: Open Sans (Modern clarity)

### Components
- **Lodge Emblem**: Configurable coat of arms component
- **Navigation**: Responsive navbar with mobile menu
- **Cards**: Consistent card design for content
- **Buttons**: Primary and secondary button styles

## 🔧 Configuration

### Environment Variables
Configure API endpoints in `src/environments/`:

```typescript
export const environment = {
  production: false,
  wordpress: {
    apiUrl: 'https://your-wordpress-site.com/wp-json/wp/v2',
    username: 'your-username',
    password: 'your-app-password'
  },
  woocommerce: {
    apiUrl: 'https://your-wordpress-site.com/wp-json/wc/v3',
    consumerKey: 'your-consumer-key',
    consumerSecret: 'your-consumer-secret'
  }
};
```

### Calendar Sources
Update calendar URLs in `src/app/services/calendar.service.ts`:

```typescript
private calendarSources: CalendarSource[] = [
  {
    id: 1,
    name: 'St. Petersburg Lodge #139',
    url: 'https://calendar.google.com/calendar/ical/youremail/public/basic.ics',
    isActive: true
  }
];
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### GitHub Pages
The application is configured for GitHub Pages deployment with static calendar pre-fetching.

### Server Requirements
- Node.js hosting (for ICS calendar syncing)
- Static hosting (GitHub Pages, Netlify, Vercel)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏛️ Masonic Information

### Meeting Schedule
- **Stated Communication**: Third Tuesday of each month at 7:30 PM
- **Fellowship Dinner**: 6:30 PM before each meeting
- **Location**: 3325 1st St NE, St. Petersburg, FL 33704

### Contact Information
- **Secretary**: secretary@stpetelodge139.org
- **Website**: https://stpetelodge139.org
- **Phone**: (727) 555-0139

## 🙏 Acknowledgments

- St. Petersburg Lodge No. 139 F&AM
- Suncoast Masters & Wardens Association
- Grand Lodge of Florida F&AM
- Angular Team
- Tailwind CSS Team

---

**Built with ❤️ for the Masonic Community**

*"Making Good Men Better Since 1894"*
