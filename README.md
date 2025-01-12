# Avalon Real Estate Website

Modern real estate website for Авалон Недвижими Имоти, built with React, Node.js, and TypeScript.

## Project Structure

```
avalon-real-estate/
├── apps/
│   ├── web/           # React frontend application
│   └── api/           # Node.js/Express backend
├── packages/
│   ├── ui/            # Shared UI components
│   ├── config/        # Shared configurations
│   └── types/         # Shared TypeScript types
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8.14.1 or higher)

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start development servers:
   ```bash
   pnpm dev
   ```

   This will start both the frontend and backend development servers:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Tech Stack

- **Frontend:**
  - React + TypeScript
  - Tailwind CSS
  - React Router
  - TanStack Query (React Query)
  - Zod for runtime type validation

- **Backend:**
  - Node.js + TypeScript
  - Express
  - Prisma (Type-safe ORM)
  - SQLite/MongoDB
  - JWT Authentication

## Features

- Responsive design with light/dark mode
- Property search and filtering
- Admin panel for property management
- Contact form with reCAPTCHA
- Google Analytics integration
- Interactive map integration

## Development

- All code is written in TypeScript
- ESLint for code linting
- Prettier for code formatting
- Turborepo for monorepo management
- pnpm for fast, disk-space efficient package management

## License

Private - All rights reserved 
