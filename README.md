# Sworn

Sworn is a modern music streaming application built with **React**, **TypeScript** and **Vite**. The goal of the project is to provide a clean and accessible interface for browsing, searching and playing tracks.

## Installation

1. Clone the repository.
2. Install dependencies with your preferred package manager:
   ```bash
   npm install
   # or
   yarn install
   ```

## Development

Run the app locally with the development server:

```bash
npm run dev
# or
yarn dev
```

Create a `.env` file from `.env.example` and provide your OAuth client IDs for
Google and Dropbox.

## Building for Production

Create an optimized build:

```bash
npm run build
# or
yarn build
```

After building you can preview the production build using:

```bash
npm run preview
# or
yarn preview
```

## Folder Structure

```
src/
  components/    # Reusable UI and layout components
  hooks/         # Custom React hooks
  utils/         # Utility functions
  data/          # Mock data used by the application
  types/         # TypeScript type definitions
```

## Screenshots

Below are some screenshots showing the app in action. Replace the placeholder paths with real screenshots if available.

![Home screen](docs/screenshot-home.png)
![Player screen](docs/screenshot-player.png)

