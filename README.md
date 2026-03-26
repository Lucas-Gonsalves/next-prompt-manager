# Prompt Manager

Prompt Manager is a full-stack Next.js application for storing, searching, creating, updating, and deleting reusable prompts. It uses Prisma with PostgreSQL for persistence and follows a layered structure that separates domain, application, infrastructure, and UI concerns.

## Features

- Create and edit prompts with a simple form-based interface
- Search prompts from the sidebar
- Delete existing prompts
- Copy prompt content quickly from the editor
- Persist data in PostgreSQL through Prisma
- Run unit, component, integration, and end-to-end tests

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma 7
- PostgreSQL
- Tailwind CSS 4
- React Hook Form + Zod
- Jest + Testing Library
- Playwright

## Project Structure

```text
src/
  app/           Next.js routes and server actions
  components/    UI and feature components
  core/          Domain entities, DTOs, and use cases
  infra/         Repository implementations
  lib/           Shared utilities and Prisma client
  tests/         Unit and component tests
prisma/          Schema, migrations, and seed script
e2e/             End-to-end tests
```

## Requirements

- Node.js 20 or newer
- pnpm
- Docker and Docker Compose

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This starts a local PostgreSQL instance with the credentials defined in `docker-compose.yml`:

- Host: `localhost`
- Port: `5432`
- Database: `rocketseat_prompt_manager`
- User: `postgres`
- Password: `password`

### 3. Create the environment file

Create a `.env` file in the project root with:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/rocketseat_prompt_manager?schema=public"
```

### 4. Run database migrations

```bash
pnpm db:migrate
```

### 5. Seed sample data (optional)

```bash
pnpm db:seed
```

The seed script clears existing prompts and inserts generated sample records.

### 6. Start the development server

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
pnpm dev            # Start the development server
pnpm build          # Create the production build
pnpm start          # Start the production server
pnpm lint           # Run ESLint
pnpm format         # Format files with Prettier
pnpm typecheck      # Run TypeScript checks
pnpm db:generate    # Generate the Prisma client
pnpm db:migrate     # Run Prisma migrations
pnpm db:seed        # Seed the database
pnpm db:studio      # Open Prisma Studio
pnpm test           # Run Jest tests
pnpm test:watch     # Run Jest in watch mode
pnpm test:coverage  # Generate coverage report
pnpm test:e2e       # Run Playwright tests
pnpm test:e2e:ui    # Run Playwright in UI mode
```

## Testing

The project includes:

- Jest + Testing Library for unit and component tests
- Playwright for end-to-end coverage

To run everything relevant during development:

```bash
pnpm test
pnpm test:e2e
```

End-to-end tests attempt to seed the database automatically when `DATABASE_URL` is available. You can also control the amount of seed data with:

```env
E2E_SEED_COUNT=20
```

## Application Flow

- `/` shows the selected prompt area and the searchable sidebar
- `/new` opens the prompt creation form
- `/[id]` loads an existing prompt for editing

Prompt mutations are handled through Next.js server actions, while persistence is delegated to a Prisma-based repository.

## Notes

- Prompt titles must be unique
- The database seed removes existing prompts before inserting new ones
- The current UI text is still in Portuguese, even though this README is now in English
