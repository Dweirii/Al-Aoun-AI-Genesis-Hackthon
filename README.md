# Al-Aoun

A modern customer support platform with AI-powered voice and chat capabilities. Built as a monorepo with multiple apps and shared packages for managing customer conversations, integrations, and voice interactions.

## Architecture Overview

This project is a Turborepo monorepo consisting of:

### Applications

- **web** - Main dashboard application for managing conversations, integrations, and settings
- **widget** - Embeddable customer support widget
- **embed** - Standalone embed script for third-party integration

### Packages

- **backend** - Convex serverless backend with database, authentication, and business logic
- **ui** - Shared React component library
- **math** - Shared utility functions
- **eslint-config** - Shared ESLint configuration
- **typescript-config** - Shared TypeScript configuration

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (serverless)
- **Authentication**: Clerk
- **Voice Integration**: VAPI
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **Build System**: Turborepo
- **Package Manager**: pnpm

## Prerequisites

- Node.js 20 or higher
- pnpm 10.4.1 or higher

## Installation

Install dependencies across all workspaces:

```bash
pnpm install
```

## Environment Variables

### Web Application

Create `apps/web/.env.local`:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Optional: Sentry (Error Tracking)
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

### Widget Application

Create `apps/widget/.env.local`:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

### Backend (Convex)

Configure environment variables in the Convex Dashboard or create `.env.local` in `packages/backend`:

```bash
# Clerk
CLERK_JWT_ISSUER_DOMAIN=your_clerk_jwt_issuer_domain
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# AWS Secrets Manager (for VAPI integration storage)
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

## Development

Run all applications in development mode:

```bash
pnpm dev
```

This will start:
- Web app on `http://localhost:3000`
- Widget app on `http://localhost:3001`
- Embed app on `http://localhost:3002`
- Convex backend in development mode

### Running Individual Apps

```bash
# Web dashboard
cd apps/web
pnpm dev

# Widget
cd apps/widget
pnpm dev

# Embed
cd apps/embed
pnpm dev

# Backend
cd packages/backend
pnpm dev
```

## Building for Production

Build all applications:

```bash
pnpm build
```

Build individual applications:

```bash
# Web
cd apps/web
pnpm build

# Widget
cd apps/widget
pnpm build

# Embed
cd apps/embed
pnpm build
```

## Project Structure

```
al-aoun/
├── apps/
│   ├── web/           # Main dashboard application
│   ├── widget/        # Embeddable widget
│   └── embed/         # Embed script
├── packages/
│   ├── backend/       # Convex backend
│   ├── ui/           # Shared component library
│   ├── math/         # Shared utilities
│   ├── eslint-config/
│   └── typescript-config/
└── turbo.json        # Turborepo configuration
```

## Authentication Setup

This project uses Clerk for authentication with organization support.

1. Create a Clerk application at https://clerk.com
2. Enable organizations in your Clerk dashboard
3. Create a JWT template named "convex" in Clerk dashboard
4. Copy the JWT Issuer Domain to `CLERK_JWT_ISSUER_DOMAIN`
5. Set up webhook endpoint: `https://your-convex-site.convex.site/clerk-webhook`
6. Subscribe to `subscription.updated` events

## VAPI Integration

VAPI keys are stored in AWS Secrets Manager for security. To set up:

1. Configure AWS Secrets Manager access with proper credentials
2. Connect VAPI through the dashboard integrations page
3. API keys are encrypted and stored per organization

## Database Schema

The backend uses Convex with the following main tables:

- `conversations` - Customer support conversations
- `messages` - Individual messages in conversations
- `contactSessions` - Customer contact sessions
- `files` - File uploads and storage
- `organizations` - Organization data
- `subscriptions` - Billing subscriptions
- `plugins` - Third-party integrations
- `widgetSettings` - Widget customization settings

## Billing

The platform supports subscription management through Clerk's subscription system. Organizations can upgrade from free (1 member) to pro (5 members) plans.

## Scripts

```bash
# Development
pnpm dev

# Build all apps
pnpm build

# Lint all packages
pnpm lint

# Format code
pnpm format

# Type checking
pnpm typecheck
```

## Deployment

### Web and Widget Apps

Deploy to Vercel or any Next.js compatible hosting:

1. Connect your repository
2. Set environment variables
3. Deploy

### Convex Backend

```bash
cd packages/backend
npx convex deploy
```

### Embed Script

Build and host the embed script:

```bash
cd apps/embed
pnpm build
```

Deploy the `dist/widget.iife.js` to your CDN.

## Features

- Real-time chat conversations
- Voice call integration via VAPI
- File upload and management
- Multi-organization support
- Role-based access control
- Customizable widget appearance
- Webhook integration
- Billing and subscription management
- AI-powered conversation handling

## Security

- API keys stored in AWS Secrets Manager
- JWT-based authentication via Clerk
- Organization-level data isolation
- Webhook signature verification
- Environment-based configuration

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Submit a pull request

## Support

For issues and questions, please open an issue in the repository.

## License

Private - All rights reserved

