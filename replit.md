# RatFit Gym Management System

## Overview

RatFit is a full-stack gym management application that enables users to sign up, check into gyms, track workout streaks, and make bookings. The system provides both user-facing functionality and gym owner analytics through a comprehensive dashboard. Built as a modern web application with React frontend and Express backend, it uses PostgreSQL for data persistence and includes QR code functionality for seamless gym check-ins.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling and development server
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design system
- **Styling**: Tailwind CSS with CSS variables for theming, Google Fonts integration (Roboto, DM Sans, Fira Code, Geist Mono)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules
- **Database Layer**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **API Design**: RESTful endpoints with JSON request/response format

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless platform
- **ORM**: Drizzle ORM with schema-first approach and Zod integration for validation
- **Migrations**: Drizzle Kit for database schema migrations
- **Schema Design**: Four main entities - users, gyms, bookings, and checkins with UUID primary keys
- **Development Storage**: In-memory storage implementation for local development and testing

### Authentication and Authorization
- **Session-based Authentication**: Server-side sessions stored in PostgreSQL
- **User Management**: Username-based authentication with streak tracking
- **Client-side State**: localStorage for current user persistence
- **No JWT Implementation**: Uses traditional session cookies for stateful authentication

### External Dependencies
- **Database**: Neon PostgreSQL serverless database
- **QR Code Generation**: qrcode library for generating gym check-in QR codes
- **Charts and Analytics**: Recharts for data visualization in gym dashboard
- **Date Handling**: date-fns for date manipulation and formatting
- **Build Tools**: Vite with React plugin, esbuild for production builds
- **Development Tools**: Replit-specific plugins for error overlay and development banner

### Key Design Patterns
- **Monorepo Structure**: Client, server, and shared code in single repository
- **Shared Schema**: Common TypeScript types and Zod schemas used across frontend and backend
- **Storage Abstraction**: Interface-based storage layer allowing multiple implementations
- **Type Safety**: End-to-end TypeScript with strict configuration
- **Component-driven UI**: Modular React components with consistent props interface
- **Server-side Rendering Ready**: Vite configuration supports SSR capabilities