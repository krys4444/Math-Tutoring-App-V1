# Math Tutoring App

A personalized AI-powered math tutoring application built with Next.js, Supabase, and OpenAI.

## Features

- User authentication with Supabase
- Grade-level selection during signup
- Personalized learning experiences
- AI-powered tutoring
- Progress tracking

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
\`\`\`

## Database Setup

Run the SQL scripts in the `scripts/` folder to set up the database tables:

1. `create-grades-table.sql`
2. `create-user-grade-table.sql`
3. Other existing scripts for user interests

## Tech Stack

- Next.js 14
- TypeScript
- Supabase (Authentication & Database)
- Tailwind CSS
- shadcn/ui components
- OpenAI API
