# Canopy Assistant - Chat & Admin UI Prototype

A modern, full-featured prototype for an AI-powered chat assistant with RAG capabilities and comprehensive admin portal.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 🎨 Design System

### Brand Colors
- **Canopy Teal** `#113b52` - Primary brand color
- **Canopy Carbon** `#2b2529` - Text and headings
- **Canopy Leather** `#cd8130` - Accent and CTAs
- **Canopy Tan** `#e9d9d0` - Subtle backgrounds

### Typography
- **Font Family**: Inter (with system fallbacks)
- **Headings**: Semibold, Canopy Carbon
- **Body**: Regular, 16px

### Components
- **Rounded corners**: 1rem (rounded-2xl)
- **Shadows**: Subtle with soft edges
- **Cards**: White background with border and shadow

## 📱 Applications

### Chat Assistant (`/chat`)

A conversational AI interface with:
- **Login**: `/chat/login` - Simple email-based mock login
- **Chat**: `/chat` - Main conversation interface with:
  - Left sidebar with session history, search, and navigation
  - Center conversation view with message bubbles and citations
  - Right context panel showing active collections and model settings
  - Sticky composer with RAG toggle and file attachment UI
- **Settings**: `/chat/settings` - User preferences and data controls

#### Key Features
- Session management with pins and unread indicators
- Citation chips linking to source documents
- RAG system toggle
- Suggested prompts
- Code block rendering
- Keyboard shortcuts (Cmd+K, Cmd+Enter, Esc)

### Admin Portal (`/admin`)

Comprehensive management interface with:

#### Dashboard (`/admin/dashboard`)
- RAG hit rate, latency, token spend, and active user metrics
- Weekly activity charts (queries and hit rate trends)
- Top queries list

#### User Management (`/admin/users`)
- User listing with roles, status, and last active
- Role-based badges (ADMIN, BDM, PRACTICE_LEAD, CONSULTANT)
- Invite functionality

#### Roles & Permissions (`/admin/roles`)
- Permission matrix table
- Granular access control by role

#### Documents (`/admin/documents`)
- Document listing with status indicators (ready, processing, failed)
- Upload interface
- Collection assignments
- File metadata

#### Collections (`/admin/collections`)
- Card-based collection view
- Document counts and descriptions
- Create new collections

#### Prompts (`/admin/prompts`)
- System prompt management
- Version history
- Set default prompt
- Live editor with diff viewer

#### Models (`/admin/models`)
- AI model configuration
- Provider and model selection
- Parameter tuning (temperature, top-P, max tokens)
- Set default model

#### History (`/admin/history`)
- Chat log search and filtering
- User, query, collection, and timestamp info
- Token usage tracking

#### Settings (`/admin/settings`)
- Brand color preview
- Feature flags
- System information
- Environment badges

## 🔧 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Date Utilities**: date-fns

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── chat/            # Chat-specific components
│   │   ├── ChatSidebar.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatMessages.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ChatComposer.tsx
│   │   └── ChatContext.tsx
│   └── admin/           # Admin-specific components
│       ├── AdminSidebar.tsx
│       └── AdminHeader.tsx
├── pages/
│   ├── chat/            # Chat routes
│   │   ├── Login.tsx
│   │   ├── Layout.tsx
│   │   ├── Session.tsx
│   │   └── Settings.tsx
│   ├── admin/           # Admin routes
│   │   ├── Login.tsx
│   │   ├── Layout.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Roles.tsx
│   │   ├── Documents.tsx
│   │   ├── Collections.tsx
│   │   ├── Prompts.tsx
│   │   ├── Models.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── Index.tsx        # Landing page
│   └── NotFound.tsx     # 404 page
├── lib/
│   ├── mock-data.ts     # Seeded mock data
│   └── utils.ts         # Utility functions
├── App.tsx              # Main app with routing
├── index.css            # Global styles & design tokens
└── main.tsx             # App entry point
```

## 🎯 Mock Data

All pages are populated with realistic mock data:
- **Chat sessions**: 5 example conversations with metadata
- **Messages**: Multi-turn conversations with citations
- **Users**: 5 users across different roles
- **Documents**: 4 documents in various states
- **Collections**: 4 themed collections
- **Prompts**: 2 system prompts with versioning
- **Models**: 3 AI models with configurations
- **Analytics**: 7-day trend data and metrics

## 🎨 Customization

### Design Tokens
All colors are defined as HSL values in `src/index.css`:
```css
:root {
  --canopy-teal: 199 65% 20%;
  --canopy-carbon: 330 9% 16%;
  --canopy-leather: 28 61% 49%;
  --canopy-tan: 28 41% 88%;
}
```

### Dark Mode
Dark mode tokens are automatically derived and can be toggled (UI currently shows toggle in chat settings).

## 🔐 Authentication

Currently uses mock authentication:
- Any email works for login
- No password required
- Auto-redirects to main interface

## 📝 Notes

This is a **UI prototype** with:
- ✅ Fully functional navigation and routing
- ✅ Responsive layouts for mobile and desktop
- ✅ Complete component library
- ✅ Mock data for all features
- ❌ No real backend integration
- ❌ No actual AI/RAG functionality
- ❌ No file upload processing
- ❌ No persistent state

## 🚧 Next Steps for Production

To make this production-ready:
1. **Backend Integration**: Connect to real Supabase/backend
2. **Authentication**: Implement real auth (JWT, OAuth)
3. **AI Integration**: Connect to OpenAI/Anthropic APIs
4. **RAG Pipeline**: Implement vector database and retrieval
5. **File Processing**: Add document parsing and chunking
6. **State Management**: Add Zustand or Redux for complex state
7. **Testing**: Add unit and integration tests
8. **Analytics**: Integrate real analytics tracking
9. **Error Handling**: Add comprehensive error boundaries
10. **Performance**: Add caching, lazy loading, and optimization

## 📚 Resources

- [Shadcn UI Docs](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Recharts](https://recharts.org/)

---

**Built with ❤️ using Lovable**
