# Relogate Website

Relocation assistance platform helping users find their ideal destination country through personalized assessments and AI-generated reports.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| React | 19.2.1 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Fonts | Noto Sans Hebrew, Satoshi |

## Quick Start

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

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Homepage with mobile/desktop detection
│   ├── layout.tsx              # Root layout with fonts
│   ├── globals.css             # Design tokens & global styles
│   ├── providers.tsx           # React context providers
│   ├── questionnaire/          # Questionnaire flow (v1 & v2)
│   ├── personal-area/          # User dashboard & reports
│   ├── admin/                  # Admin interface
│   ├── login/                  # Authentication
│   ├── register/               # User registration
│   └── api/                    # API routes
├── components/
│   ├── desktop/                # Desktop-specific components
│   ├── mobile/                 # Mobile-specific components
│   ├── shared/                 # Reusable UI components
│   └── questionnaire/          # V2 questionnaire components
├── contexts/                   # React context providers
├── hooks/                      # Custom React hooks
├── services/                   # API integration & business logic
├── types/                      # TypeScript type definitions
├── utils/                      # Utility functions
├── lib/                        # Shared libraries
└── content/
    └── he.ts                   # Hebrew content (all user-facing text)

docs/
├── ARCHITECTURE.md             # Codebase architecture
├── DEVELOPER_GUIDE.md          # Developer setup guide
└── design/
    ├── figma_urls.md           # Figma design links
    └── figma_cache/            # Cached design screenshots

.claude/                        # Claude Code agent configuration
├── CLAUDE.md                   # Main agent context
└── rules/                      # Domain-specific rules
```

## Key Features

### Marketing Site
- **RTL Support**: Hebrew language with full RTL layout
- **Responsive Design**: Separate mobile and desktop experiences
- **Splash Screen**: Animated intro for first-time visitors
- **Scroll Animations**: Framer Motion-powered interactions

### Questionnaire System
- **V1 Questionnaire**: Original multi-step flow
- **V2 Questionnaire**: Enhanced workflow with improved UX
- **Progress Tracking**: Visual step indicators
- **Data Persistence**: Session-based state management

### User Features
- **Authentication**: Login/registration with session management
- **Personal Area**: User dashboard with report access
- **Report Viewer**: AI-generated country recommendations

### Payments
- **Stripe Integration**: Secure payment processing
- **Checkout Flow**: Seamless payment experience
- **Payment History**: Track payment status and history

### Admin Interface
- **Report Management**: Create, edit, preview reports
- **Response Editor**: Manage AI-generated responses
- **User Management**: Admin-only access control
- **Payment Oversight**: Monitor all platform payments
- **Blog Management**: Create and manage blog content

### Notifications
- **Real-time Updates**: Notify users of report status
- **Email Integration**: Email notifications for key events

## Documentation

### Getting Started
- [Architecture Overview](docs/ARCHITECTURE.md) - Codebase structure, components, data flow
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Setup, workflows, Claude Code usage
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment procedures

### User Documentation
- [User Guide](docs/USER_GUIDE.md) - User workflows and features
- [Admin Guide](docs/ADMIN_GUIDE.md) - Admin interface and management

### Reference
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions
- [Response Import Guide](docs/response-import-guide.md) - Importing report content

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Design Resources

Figma designs are tracked in `docs/design/figma_urls.md`. To populate the design cache:

```bash
# Set your Figma token
export FIGMA_TOKEN="your-token"

# Cache all designs
npm run figma:cache -- --all
```

See [Developer Guide](docs/DEVELOPER_GUIDE.md) for detailed Figma workflow.

## Contributing

1. Create a feature branch from `dev` (`feature/description` or `fix/description`)
2. Make changes following existing patterns
3. Ensure `npm run build` and `npm run lint` pass
4. Submit a pull request to `dev`

## License

Proprietary - All rights reserved.
