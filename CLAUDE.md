# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jovie is a Next.js application that integrates with multiple services for authentication, data storage, and music functionality. The project is currently in early development with minimal code structure.

## Technology Stack

- **Frontend**: Next.js (React framework)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Music Integration**: Spotify OAuth
- **Deployment**: Intended for Vercel (based on .gitignore)

## Environment Configuration

The project uses environment variables stored in `.env.local` for:

- App URL configuration (jov.ie)
- Supabase database connection and API keys
- Clerk authentication keys
- Spotify OAuth credentials
- Placeholder variables for analytics and billing (Segment, Stripe, RevenueCat)

## Development Setup

This project appears to be a new Next.js application. Standard Next.js development commands would be:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

Note: No package.json exists yet, so these commands are not currently available.

## Architecture Notes

Based on the environment configuration, the application is designed to:

- Use Supabase for database operations and backend services
- Handle user authentication through Clerk
- Integrate with Spotify's API for music-related features
- Support future analytics and billing integrations

The `.env.local` file contains live credentials and should be referenced for actual service endpoints and keys during development.
