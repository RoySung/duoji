# Duoji

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern full-stack application built with Next.js frontend and NestJS backend, managed in an [Nx workspace](https://nx.dev) monorepo.

## Project Structure

This project is organized as a monorepo with the following structure:

- **`apps/web`** - Next.js frontend application with TailwindCSS and HeroUI components
- **`apps/backend`** - NestJS backend API server
- **`apps/web-e2e`** - End-to-end tests for the frontend using Playwright
- **`apps/backend-e2e`** - End-to-end tests for the backend API

## Setup Project

### Prerequisites

- Node.js (version 18.16.9 or later, as specified in `.nvmrc`)
- pnpm (this project uses pnpm as the package manager)

### Installation

1. **Install pnpm** (if not already installed):
   ```sh
   npm install -g pnpm
   ```

2. **Clone the repository and install dependencies**:
   ```sh
   git clone <repository-url>
   cd duoji
   pnpm install
   ```

## How to Develop

### Development Commands

#### Start Both Applications
To run both frontend and backend in development mode simultaneously:
```sh
pnpm dev
```

#### Frontend Development (Next.js)
```sh
# Start the web application
pnpm dev:web
# or
npx nx dev web

# Build the web application
pnpm build:web
# or
npx nx build web

# Run web tests
pnpm test:web
# or
npx nx test web
```

#### Backend Development (NestJS)
```sh
# Start the backend server
pnpm dev:backend
# or
npx nx dev backend

# Build the backend application
pnpm build:backend
# or
npx nx build backend

# Run backend tests
pnpm test:backend
# or
npx nx test backend
```

#### All Projects
```sh
# Build all applications
pnpm build
# or
npx nx run-many --target=build --parallel

# Test all applications
pnpm test
# or
npx nx run-many --target=test --parallel
```

#### E2E Testing
```sh
# Run frontend e2e tests
npx nx e2e web-e2e

# Run backend e2e tests
npx nx e2e backend-e2e
```

### Viewing Available Commands

To see all available targets for a specific project:
```sh
npx nx show project web
npx nx show project backend
```

To explore the project graph visually:
```sh
npx nx graph
```

## Technology Stack

### Frontend (`apps/web`)
- **Next.js 15** - React framework for production
- **React 19** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **HeroUI** - Modern React UI components
- **TypeScript** - Type-safe JavaScript

### Backend (`apps/backend`)
- **NestJS 10** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Express** - Web application framework

### Development Tools
- **Nx Workspace** - Monorepo management and build system
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing

## Adding New Projects

You can extend this workspace by adding new applications or libraries using Nx generators:

### Generate a New Next.js Application
```sh
npx nx g @nx/next:app my-new-app
```

### Generate a New NestJS Application
```sh
npx nx g @nx/nest:app my-api
```

### Generate a New React Library
```sh
npx nx g @nx/react:lib shared-components
```

### Generate a New TypeScript Library
```sh
npx nx g @nx/js:lib shared-utils
```

To see all available generators:
```sh
npx nx list
npx nx list @nx/next
npx nx list @nx/nest
```

## Development Tools

### Nx Console
Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### CI/CD Setup
This project is configured for continuous integration. You can set up your CI pipeline using the Nx Cloud integration:

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/aJmyjD1pdQ)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Additional Resources

### Learn More About This Project
- [Next.js Documentation](https://nextjs.org/docs) - Frontend framework
- [NestJS Documentation](https://docs.nestjs.com/) - Backend framework
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - CSS framework
- [HeroUI Documentation](https://heroui.com/) - UI component library

### Learn More About Nx
- [Learn more about this workspace setup](https://nx.dev/nx-api/next?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Browse the plugin registry](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Join the Nx Community
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
