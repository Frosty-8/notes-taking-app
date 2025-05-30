# Browser Notes

A simple note-taking application built with [Next.js](https://nextjs.org) that allows users to create, edit, view, and delete notes directly in the browser, with data persisted in localStorage.

## Features

- Create, edit, and delete notes
- View notes with formatted timestamps
- Responsive design with a sidebar for note navigation
- Dark mode support
- Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components
- Local storage for persistent note data
- Optimized with Geist font and Tailwind CSS animations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   git clone <repository-url>
   cd note-taking

2. Install dependencies:
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install

### Running the Development Server

Start the development server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Project Structure

- `app/`: Contains the main Next.js application files
  - `page.tsx`: Main page component handling note creation, editing, and viewing
  - `layout.tsx`: Root layout with global styles and metadata
  - `globals.css`: Global Tailwind CSS styles with custom theme variables
- `components/`: Reusable React components
  - `Sidebars.tsx`: Sidebar for note navigation
  - `Header.tsx`: Header with new note button
  - `NotesEdit.tsx`: Component for editing notes
  - `NotesView.tsx`: Component for viewing notes
  - `EmptyState.tsx`: Component for empty state display
  - `ui/`: shadcn/ui components (Button, Card, Input, Textarea, ScrollArea)
- `lib/`: Utility functions and types
  - `storage.ts`: Functions for localStorage operations and date formatting
  - `types.ts`: TypeScript interface for Note
  - `utils.ts`: Utility for merging Tailwind classes
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `eslint.config.mjs`: ESLint configuration
- `postcss.config.mjs`: PostCSS configuration for Tailwind CSS
- `components.json`: shadcn/ui configuration

### Available Scripts

- `npm run dev`: Runs the app in development mode with Turbopack
- `npm run build`: Builds the app for production
- `npm run start`: Starts the production server
- `npm run lint`: Runs ESLint for code linting

## Dependencies

- **Next.js**: Framework for server-side rendering and static site generation
- **React**: UI library
- **TypeScript**: Type safety for JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible and customizable UI components
- **Lucide React**: Icon library
- **MongoDB/Mongoose**: Included but not used in the current implementation (for potential future backend integration)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

## Deployment

Deploy the application using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) for the easiest setup. Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/vercel/next.js).

## License

This project is licensed under the MIT License.