# CLAUDE.md - PlayWLLM Admin UI Guidelines

## Build/Run Commands
- `npm run dev` - Start Vite dev server with host exposed
- `npm run build` - TypeScript build and bundle for production
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally
- `npm run prod` - Build and preview production build with host exposed

## Code Style Guidelines
### Structure
- Functional React components with TypeScript (.tsx)
- Route-based file organization in `src/pages`
- Reusable components in `src/components`
- Context providers in `src/context`
- Custom hooks in `src/hooks`
- Utility functions in `src/utils`

### Formatting & Types
- ES Module imports (import/export)
- Organize imports: React/libraries first, followed by local imports
- Strict TypeScript with explicit interfaces for props
- Camelcase for variables/functions, PascalCase for components
- No unused variables or parameters (enabled in tsconfig)

### UI Framework
- Material UI v6 components with emotion styling
- Theme customization in `src/theme`
- Functional patterns with hooks
- Context API for global state management

### Error Handling
- Axios for API requests with central configuration
- React Router for navigation and protected routes