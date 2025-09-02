# 🚀 FileSure Frontend

Frontend application built with Next.js 14 and TypeScript, following a modular pattern architecture.

## �� Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Technology Stack](#technology-stack)
- [Development Guidelines](#development-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reading Materials](#reading-materials)

## Prerequisites

- Node.js (v18.0.0 or newer)
- npm (comes with Node.js)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Project Architecture

```
📦 FILESURE-FRONTEND
├── public/               # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (root)/      # Root layout group
│   │   │   ├── (auth)/  # Authentication module
│   │   │   │   ├── _components/  # Auth-specific components
│   │   │   │   ├── _config/      # Auth configuration
│   │   │   │   ├── _services/    # Auth services
│   │   │   │   ├── _utils/       # Auth utilities
│   │   │   │   └── auth/         # Auth pages
│   │   │   ├── (dashboard)/      # Dashboard module
│   │   │   │   ├── _components/  # Dashboard components
│   │   │   │   ├── _store/       # Dashboard state management
│   │   │   │   └── dashboard/    # Dashboard pages
│   │   └── layout.tsx
│   ├── components/      # Shared components
│   │   ├── ui/         # UI components (shadcn)
│   │   └── shared/     # Shared components across modules
│   ├── constants/      # Application constants
│   ├── hooks/          # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── services/      # API services
│   ├── store/         # Global state management
│   └── types/         # TypeScript definitions
└── config files (.env, tsconfig.json, etc.)
```

### Modular Pattern Structure

Each module (e.g., auth, dashboard) follows a consistent structure:

- `_components/`: Module-specific components
- `_config/`: Module configuration
- `_services/`: Module-specific API services
- `_store/`: Module state management
- `_utils/`: Module utilities
- `_types/`: Module type definitions

## Technology Stack

### Core

- ⚡ Next.js 14 (App Router)
- 🔷 TypeScript
- 🎨 Tailwind CSS

### Authentication

- 🔐 SuperTokens

### UI Components

- 🎯 Shadcn UI
- 🎬 Framer Motion

### State & Data Management

- 📊 Zustand
- 🔄 React Query (TanStack Query)

### Form Handling

- 📝 React Hook Form
- ✅ Zod Validation

## Development Guidelines

### Module Structure

When creating a new module:

1. Create a new directory under `src/app/(root)`
2. Follow the established modular pattern
3. Keep module-specific code within its directory
4. Use shared components from `src/components` when possible

### Naming Conventions

- Components: PascalCase (`AuthButton.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_CASE (`AUTH_ROUTES.ts`)
- Types/Interfaces: PascalCase with I prefix for interfaces (`IUserData`)

### Commit Message Format

| Type          | Description                        |
| ------------- | ---------------------------------- |
| `build`       | Build system or dependency changes |
| `chore`       | Maintenance tasks                  |
| `ci`          | CI configuration changes           |
| `docs`        | Documentation updates              |
| `feat`        | New features                       |
| `fix`         | Bug fixes                          |
| `perf`        | Performance improvements           |
| `refactor`    | Code restructuring                 |
| `style`       | Code style changes                 |
| `test`        | Test-related changes               |
| `translation` | Localization updates               |
| `security`    | Security-related changes           |

## Pull Request Guidelines

### PR Title Format

```
[Type] Brief description
Example: [Feature] Implement JWT authentication
```

### PR Description Template

#### 1️⃣ Summary

- Problem statement
- Solution overview

#### 2️⃣ Changes

- List of implemented changes
- Technical details

#### 3️⃣ Visual Evidence

- Screenshots
- GIFs
- Videos (if applicable)

#### 4️⃣ Testing Steps

1. Environment setup
2. Test scenarios
3. Expected results

# 📋 Pull Request Checklist

## 1. Code Quality

- [ ] Removed unused code, comments, and console logs.
- [ ] Followed consistent code formatting and naming conventions.
- [ ] Code is clean, readable, and organized properly.

## 2. Functionality & Impact

- [ ] Changes are limited to the intended feature/component.
- [ ] No impact or side effects on other features/components.
- [ ] If new packages were installed or existing ones upgraded, verified full app stability.

## 3. Frontend (UI/UX)

- [ ] Verified responsiveness across mobile, tablet, and desktop.
- [ ] Checked paddings, margins, gaps, font sizes, image scaling, and component alignments.
- [ ] No visual or functional issues on major browsers (Chrome, Safari, Firefox).
- [ ] Accessibility basics handled (e.g., alt text, labels, button recognitions).

## 4. Performance

- [ ] Optimized components for performance and avoided unnecessary re-renders.
- [ ] No large assets or uncompressed images added.
- [ ] No console errors or warnings during runtime.

## 5. Testing

- [ ] Manually tested all affected flows.
- [ ] Added/updated unit tests or integration tests if required.

## 6. Git & PR Best Practices

- [ ] Pulled latest code and resolved any merge conflicts.
- [ ] Commit history is clean with meaningful commit messages.
- [ ] PR title and description are clear and complete.
- [ ] Attached screenshots/videos for UI changes (if applicable).
- [ ] Linked Jira ticket or task ID (if applicable).

---

# 📄 Description

**What does this PR do?**

> [Briefly describe the changes and why they were needed]

---

# 🖼️ Screenshots (if applicable)

> [Insert before/after screenshots or GIFs]

---

# 🔗 Related Links

> [e.g., Jira ticket, design link, related PRs, etc.]

---

# 🚨 Additional Notes for Reviewers

> [Any special instructions for testing, deployment notes, or things reviewers should know]

## Reading Materials

### Official Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)

### Recommended Articles

- [Understanding Next.js App Router](https://nextjs.org/docs/app)
- [React Server Components](https://nextjs.org/docs/getting-started/react-essentials#server-components)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Shadcn UI Components Guide](https://jidefr.medium.com/shadcn-ui-add-components-and-resources-0846b0f57596)
- [Become expert in React Query](https://tigerabrodi.blog/become-expert-in-react-query)

### Performance & Security

- [Web Vitals](https://web.dev/vitals/)
- [Next.js Security Best Practices](https://medium.com/@farihatulmaria/security-considerations-when-building-a-next-js-application-and-mitigating-common-security-risks-c9d551fcacdb)
- [React Query Data Management](https://tanstack.com/query/latest/docs/react/overview)

### Design Patterns

- [React Patterns](https://reactpatterns.com/)
- [TypeScript Design Patterns](https://refactoring.guru/design-patterns/typescript)
# course-mate-frontend
