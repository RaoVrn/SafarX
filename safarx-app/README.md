# SafarX - Premium Travel Memory App

Map your journey. Preserve your memories.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Maps**: Google Maps API (@react-google-maps/api)
- **Icons**: Lucide React
- **Backend Services**: Firebase
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   ├── places/           # Place/memory related components
│   ├── map/              # Map related components
│   └── shared/           # Shared/reusable components
├── lib/                  # Utilities and configurations
├── hooks/                # Custom React hooks
├── store/                # State management (Zustand stores)
├── types/                # TypeScript type definitions
└── constants/            # App constants and configuration
```

## 🎨 Design System

- **Color Scheme**: Dark theme with black background
- **Typography**: System font stack with antialiased rendering
- **Interactions**: Hover effects, smooth transitions
- **Responsive**: Mobile-first responsive design
- **Components**: Clean, minimal, premium UI components

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌟 Key Features

- **Interactive Maps**: Visualize travel memories on beautiful maps
- **Memory Collection**: Capture and organize travel experiences
- **Journey Planning**: Create and share travel stories
- **Responsive Design**: Works seamlessly on all devices
- **Dark Theme**: Premium dark UI design
- **TypeScript**: Fully typed for better development experience

## 📱 Pages Structure

- **Landing Page** (`/`): Hero section with app introduction
- **Dashboard** (`/dashboard`): User's travel overview
- **Memories** (`/memories`): View and manage travel memories
- **Journeys** (`/journeys`): Create and view travel journeys
- **Profile** (`/profile`): User profile and settings

## 🔗 External Dependencies

- **@react-google-maps/api**: Google Maps integration
- **firebase**: Backend services
- **framer-motion**: Smooth animations
- **lucide-react**: Beautiful icons
- **zustand**: Lightweight state management

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables for Firebase and Google Maps
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

---

Built with ❤️ for travel enthusiasts

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
