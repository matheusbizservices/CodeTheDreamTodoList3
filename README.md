# Todo List App

A full-stack todo list application built with React and React Router as part of the
Code the Dream React course. Users log in with an email and password, then create,
edit, complete, sort, search, and filter their own tasks.

## Live Demo

[Live demo on Vercel](https://your-app-name.vercel.app) <!-- update after deploying -->

## Features

- Email/password login with session based authentication
- Add, complete, and edit todos with optimistic UI updates
- Sort todos by creation date or title, ascending or descending
- Debounced search/filter by todo title
- Filter todos by status (all / active / completed) via the URL, so filters
  survive a refresh and can be shared as a link
- Protected routes (`/todos`, `/profile`) that redirect to login and return
  the user to where they were headed after they sign in
- Profile page showing account info and todo completion stats
- Input sanitization with DOMPurify and client-side validation with
  max-length limits on all text inputs
- Responsive, accessible styling with custom focus states and a dark mode
  that follows the system theme

## Technologies Used

- [React 19](https://react.dev/)
- [React Router 7](https://reactrouter.com/)
- [Vite](https://vite.dev/)
- CSS Modules for component-scoped styling
- [DOMPurify](https://github.com/cure53/DOMPurify) for input sanitization
- [ESLint](https://eslint.org/)

## Screenshots

<!-- Add screenshots here, e.g.: -->
<!-- ![Desktop view](./docs/screenshot-desktop.png) -->
<!-- ![Mobile view](./docs/screenshot-mobile.png) -->

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/matheusbizservices/CodeTheDreamTodoList3.git
cd CodeTheDreamTodoList3
npm install
```

Create a `.env` file in the project root with the backend API target used by
the local dev proxy:

```
VITE_TARGET=https://ctd-learns-node-l42tx.ondigitalocean.app
```

## Available Scripts

- `npm run dev` - start the Vite dev server with the API proxy at `/api`
- `npm run build` - build the app for production into `dist/`
- `npm run preview` - serve the production build locally
- `npm run lint` - run ESLint over the project

## Design Decisions

Styling is done with **CSS Modules**, which Vite supports out of the box.
Each component gets its own `*.module.css` file so class names are scoped
locally and never collide between components. Shared values (colors,
spacing, radii, typography) live as CSS custom properties in `src/index.css`
so every module can reference the same design tokens and the app
automatically adapts to the user's light/dark color scheme preference.

User input (todo titles, login fields) is trimmed, sanitized with DOMPurify
to strip any HTML/script content, and validated against a max length before
it's sent to the API or rendered.

## Deployment

This project deploys to [Vercel](https://vercel.com/) as a static site. Since
the app calls relative `/api/*` endpoints (proxied to the backend during
local development via the Vite dev server), a `vercel.json` rewrite rule
forwards `/api/*` requests to the Code the Dream backend in production.

## Future Improvements

- Add unit tests for the reducer and form validation logic
- Add a dark/light theme toggle in addition to the system preference
- Persist sort/filter/search preferences across sessions
- Add drag-and-drop reordering of todos
- Add pagination for large todo lists

## License

MIT

## Contact

[GitHub: matheusbizservices](https://github.com/matheusbizservices)
