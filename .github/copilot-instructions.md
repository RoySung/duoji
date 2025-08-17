# Duoji Project AI Assistant Instructions

## 🏗️ Architecture Overview

This is a **多記帳 (DuoJi)** expense tracking app built as an Nx monorepo with Next.js frontend and NestJS backend. The project follows clean architecture principles with a strong emphasis on TypeScript type safety and mock-first development.

### Project Structure

```
apps/
├── web/           # Next.js frontend (Pages Router)
├── backend/       # NestJS API server
├── web-e2e/       # Playwright E2E tests
└── backend-e2e/   # Backend API tests
```

## 🔧 Development Workflow

### Essential Commands

- `pnpm dev` - Start both frontend and backend in parallel
- `pnpm dev:web` / `pnpm dev:backend` - Start individual apps
- `npx nx graph` - Visualize project dependencies
- `npx nx show project web` - Show available targets for a project

### Build System (Nx)

- All builds use Nx with SWC compilation for speed
- Use `nx run-many --target=build --parallel` for multi-project operations
- Individual project commands: `npx nx <target> <project>`

## 📁 Frontend Architecture Patterns

### Entity-First Design

Entities are defined with Zod schemas in `src/entities/`:

```typescript
// Example: transaction.ts
export const ExpenseSchema = z.object({
  amount: z.number().positive(),
  accountBookId: z.string().nullable(),
  // ... full validation schema
})
export type Expense = z.infer<typeof ExpenseSchema>
```

### Repository Pattern

Repositories are defined as interfaces in entities, implemented in `src/repositories/`:

```typescript
export interface AccountBookRepo {
  create(accountBook: AccountBook): Promise<AccountBook>
  findById(id: string): Promise<AccountBook | null>
  // ... standard CRUD operations
}
```

### Mock-First Development

- All mock data lives in `src/mocks/` with centralized exports from `index.ts`
- Import mocks: `import { userList, categoryList } from '@/mocks'`
- Mock files are documented in Chinese (see `mocks/README.md`)

### Component Structure

- **Layout components**: `src/components/layout/` (navbar, layout)
- **Feature components**: `src/components/FeatureName/` (e.g., TransactionModal/)
- **UI primitives**: `src/components/ui/` (button, TagInput)

### UI Framework: HeroUI

- Primary UI library is HeroUI, not shadcn/ui
- Import pattern: `import { Modal, Button, Tabs } from '@heroui/react'`
- Tailwind config includes HeroUI theme: `./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}`

### Page Layout System

Uses Next.js layout pattern with `getLayout` function:

```typescript
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}
// Default layout wraps all pages in Layout component
```

## 🎯 Key Development Practices

### Type Safety

- Heavy use of Zod for runtime validation and type inference
- Recursive schema definitions for nested data (see CategorySchema)
- All entities have corresponding TypeScript types inferred from Zod schemas

### File Organization

- Absolute imports using `@/` prefix (mapped to `src/`)
- Feature-based folder structure for components
- Centralized exports from component folders using `index.ts`

### Internationalization

- Comments and documentation mix Chinese and English
- Mock data and some user-facing content in Traditional Chinese

## ⚠️ Current Implementation Status

### Frontend (Phase 1)

- ✅ Basic project structure with Next.js and HeroUI
- ✅ Entity definitions with Zod schemas
- ✅ Mock data setup
- 🚧 Repository implementations (mostly TODOs)
- 🚧 Transaction modal UI components

### Backend

- ✅ Basic NestJS setup
- 🚧 Minimal controller/service implementation

### Known Patterns to Follow

- Use `PascalCase` for component folder names (e.g., `TransactionModal/`)
- Repository interfaces are defined in entity files, not separate files
- Mock data should be comprehensive for development
- All new entities should use Zod schema + TypeScript type inference pattern

## 🔍 When Working on This Project

1. **Adding new entities**: Define Zod schema first, then TypeScript type, then repository interface
2. **UI components**: Use HeroUI components, follow existing folder structure
3. **Data handling**: Create comprehensive mocks before implementing real data layer
4. **Testing**: E2E tests with Playwright, unit tests with Jest
5. **Styling**: Tailwind CSS with HeroUI theme extensions
