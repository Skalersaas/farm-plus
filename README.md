# Farm+ - Sustainable Agriculture Investment Platform

Farm+ is a modern web application for managing farms, fields, plants, and watering schedules. Built with React, TypeScript, and a beautiful glassmorphism design.

## Features

### Landing Page
- Hero section with animated scroll indicator
- Products showcase (Plants, Fields, Watering investments)
- FAQ section with accordion
- Contact form
- Authentication modals (Login/Sign Up)

### Admin Panel (`/admin`)
- **Dashboard** - Overview with stats, quick actions, activity feed, watering widget
- **Fields Management** - Create, view, edit, and delete fields with zones
- **Plants Management** - Track plants, watering schedules, health status
- **Calendar** - Visual calendar with watering schedules and tasks
- **Notes Journal** - Record observations, issues, and activities
- **Reports** - Charts and statistics (plants by field, watering status, health)
- **Settings** - Profile, farm, notifications, and display settings

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Framer Motion** - Animations
- **Recharts** - Charts and graphs
- **date-fns** - Date utilities
- **Lucide React** - Icons
- **CSS Modules** - Component-scoped styling

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd farm-plus

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── admin/           # Admin panel components
│   │   ├── layout/      # AdminLayout, Sidebar, TopBar
│   │   ├── dashboard/   # Dashboard, StatsCard, widgets
│   │   ├── fields/      # FieldsList, FieldDetail
│   │   ├── plants/      # PlantsList, PlantDetail
│   │   ├── calendar/    # Calendar view
│   │   ├── notes/       # NotesJournal
│   │   ├── reports/     # ReportsPage with charts
│   │   └── settings/    # SettingsPage
│   ├── auth/            # AuthModal, LoginForm, SignUpForm
│   ├── layout/          # Header, ScrollIndicator
│   ├── sections/        # Landing page sections
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # Data services and seed data
├── stores/              # Zustand stores
├── styles/              # Global styles and CSS variables
└── types/               # TypeScript interfaces
```

## Design System

### Colors
- **Primary**: Brown (#8B5A2B) - Agricultural theme
- **Secondary**: Green (#2D5A27) - Sustainability theme
- **Text**: White (#FFFFFF)

### Effects
- Glassmorphism with backdrop blur
- Smooth animations with Framer Motion
- Responsive design for all screen sizes

## Data Persistence

All data is stored in localStorage using Zustand's persist middleware:
- `farm-plus-fields` - Fields and zones
- `farm-plus-plants` - Plants and watering logs
- `farm-plus-ui` - Tasks, notes, activity log, settings

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

MIT
