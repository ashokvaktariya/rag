# Frontend - Canopy Company Consultant Matching System

## 🎨 Frontend Architecture

Modern React/Next.js application with Tailwind CSS for the consultant matching system interface.

## 📁 Project Structure

```
frontend/canopy-nexus-ui/
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── admin/                  # Admin-specific components
│   │   │   ├── AdminHeader.tsx     # Admin header
│   │   │   ├── AdminSidebar.tsx    # Admin navigation
│   │   │   └── DocumentUpload.tsx  # Document upload
│   │   ├── chat/                   # Chat interface components
│   │   │   ├── ChatComposer.tsx    # Message composer
│   │   │   ├── ChatHeader.tsx      # Chat header
│   │   │   ├── ChatMessages.tsx    # Message display
│   │   │   ├── ChatSidebar.tsx     # Chat sidebar
│   │   │   └── ConsultantCard.tsx  # Consultant display
│   │   ├── settings/               # Settings components
│   │   │   ├── HistoryTab.tsx      # Chat history
│   │   │   ├── ModelsTab.tsx       # Model settings
│   │   │   ├── ProfileTab.tsx     # User profile
│   │   │   ├── PromptsTab.tsx      # Prompt management
│   │   │   └── UsersTab.tsx        # User management
│   │   └── ui/                     # Base UI components
│   │       ├── button.tsx          # Button component
│   │       ├── input.tsx           # Input component
│   │       ├── card.tsx            # Card component
│   │       └── ...                 # 40+ UI components
│   ├── pages/                      # Application pages
│   │   ├── admin/                  # Admin pages
│   │   │   ├── Dashboard.tsx       # Admin dashboard
│   │   │   ├── Users.tsx           # User management
│   │   │   ├── Documents.tsx       # Document management
│   │   │   ├── Collections.tsx     # Collection management
│   │   │   ├── Models.tsx          # Model configuration
│   │   │   ├── Prompts.tsx         # Prompt management
│   │   │   ├── History.tsx         # System history
│   │   │   ├── Settings.tsx        # System settings
│   │   │   ├── Roles.tsx           # Role management
│   │   │   └── Layout.tsx          # Admin layout
│   │   ├── chat/                   # Chat pages
│   │   │   ├── Layout.tsx          # Chat layout
│   │   │   ├── Login.tsx           # Chat login
│   │   │   ├── Profile.tsx         # User profile
│   │   │   ├── Session.tsx         # Chat session
│   │   │   └── Settings.tsx        # Chat settings
│   │   ├── Index.tsx               # Home page
│   │   └── NotFound.tsx            # 404 page
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-mobile.tsx          # Mobile detection
│   │   ├── use-toast.ts            # Toast notifications
│   │   └── use-user-role.ts        # User role management
│   ├── lib/                        # Utility libraries
│   │   ├── chat-stream.ts          # Chat streaming
│   │   ├── conversation-store.ts   # Conversation state
│   │   ├── mock-data.ts            # Mock data
│   │   └── utils.ts                # Utility functions
│   ├── integrations/               # External integrations
│   │   └── supabase/               # Supabase integration
│   │       ├── client.ts           # Supabase client
│   │       └── types.ts            # TypeScript types
│   ├── assets/                     # Static assets
│   │   ├── canopy-logo-black.png   # Black logo
│   │   ├── canopy-logo-blue.png    # Blue logo
│   │   └── canopy-logo-white.png   # White logo
│   ├── App.tsx                     # Main App component
│   ├── App.css                     # App styles
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles
├── supabase/                       # Supabase configuration
│   ├── config.toml                 # Supabase config
│   ├── functions/                  # Edge functions
│   │   ├── canopy-chat/            # Chat function
│   │   └── seed-users/             # User seeding
│   └── migrations/                 # Database migrations
├── public/                         # Public assets
│   ├── favicon.ico                 # Site favicon
│   ├── placeholder.svg             # Placeholder image
│   └── robots.txt                  # SEO robots
├── package.json                    # Dependencies
├── package-lock.json               # Lock file
├── bun.lockb                       # Bun lock file
├── tailwind.config.ts              # Tailwind configuration
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript config
└── README.md                       # Project documentation
```

## 🚀 Features

### 🎯 Core Features
- **Modern UI**: Built with React 18 and TypeScript
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Real-time Chat**: Live consultant matching interface
- **Admin Dashboard**: Complete system management
- **User Management**: Role-based access control
- **Document Management**: File upload and processing
- **Settings Panel**: Comprehensive configuration

### 🎨 UI Components
- **40+ Reusable Components**: Button, Input, Card, Dialog, etc.
- **Consistent Design System**: Tailwind CSS with custom theme
- **Accessibility**: WCAG compliant components
- **Dark/Light Mode**: Theme switching support
- **Mobile Responsive**: Optimized for all screen sizes

### 🔧 Technical Features
- **TypeScript**: Full type safety
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **State Management**: React hooks and context
- **API Integration**: RESTful API communication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Install Dependencies
```bash
cd frontend/canopy-nexus-ui
npm install
```

### 2. Environment Setup
```bash
# Create .env.local file
cp .env.example .env.local

# Edit with your configuration
# - Backend API URL
# - Supabase credentials (if using)
```

### 3. Start Development Server
```bash
npm run dev
# Access: http://localhost:5173
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend API
VITE_API_URL=http://localhost:8000

# Supabase (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Tailwind Configuration
The project uses Tailwind CSS with custom configuration:
- Custom color palette
- Extended spacing scale
- Custom component classes
- Responsive breakpoints

## 📱 Pages Overview

### 🏠 Home Page (`Index.tsx`)
- Landing page with system overview
- Quick access to main features
- User authentication

### 💬 Chat Interface (`pages/chat/`)
- **Session.tsx**: Main chat interface
- **Layout.tsx**: Chat layout with sidebar
- **Profile.tsx**: User profile management
- **Settings.tsx**: Chat preferences

### 👨‍💼 Admin Dashboard (`pages/admin/`)
- **Dashboard.tsx**: System overview and metrics
- **Users.tsx**: User management and roles
- **Documents.tsx**: Document upload and management
- **Collections.tsx**: Data collection management
- **Models.tsx**: AI model configuration
- **Prompts.tsx**: Prompt template management
- **History.tsx**: System activity logs
- **Settings.tsx**: System configuration

## 🎨 Component Library

### Base Components (`components/ui/`)
- **Button**: Various button styles and sizes
- **Input**: Form input components
- **Card**: Content containers
- **Dialog**: Modal dialogs
- **Table**: Data tables
- **Form**: Form components
- **Navigation**: Menu and navigation
- **Layout**: Page layouts

### Feature Components
- **Chat Components**: Real-time chat interface
- **Admin Components**: Administrative tools
- **Settings Components**: Configuration panels

## 🔄 State Management

### React Hooks
- **useState**: Local component state
- **useEffect**: Side effects and lifecycle
- **useContext**: Global state sharing
- **Custom Hooks**: Reusable logic

### State Structure
```typescript
// User state
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Chat state
interface ChatState {
  messages: Message[];
  isTyping: boolean;
  currentSession: string;
}

// App state
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}
```

## 🔌 API Integration

### Backend Communication
```typescript
// API client
const apiClient = {
  // Consultant matching
  matchConsultants: (jobDescription: string) => 
    fetch('/api/match', { method: 'POST', body: JSON.stringify({ jobDescription }) }),
  
  // User management
  getUsers: () => fetch('/api/users'),
  
  // Document upload
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch('/api/upload', { method: 'POST', body: formData });
  }
};
```

## 🧪 Testing

### Test Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

### Test Structure
- **Unit Tests**: Component testing
- **Integration Tests**: API integration
- **E2E Tests**: Full user workflows

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
# Hot reload development server
```

### Production Build
```bash
npm run build
# Optimized production build
```

### Deployment Options
- **Static Hosting**: Vercel, Netlify
- **Docker**: Containerized deployment
- **CDN**: Global content delivery

## 🛠️ Development

### Code Style
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

## 📚 Dependencies

### Core Dependencies
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling

### UI Libraries
- **Radix UI**: Accessible components
- **Lucide React**: Icons
- **React Router**: Routing

### Development Tools
- **ESLint**: Linting
- **Prettier**: Formatting
- **TypeScript**: Type checking
