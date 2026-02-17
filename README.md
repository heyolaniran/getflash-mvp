
# GetFlash MVP

A SaaS platform with streamlined user onboarding and profile customization.

## Features

- **Authentication**: Email/Password login and signup via Supabase.
- **Profile Customization**: Users must set a unique `@tag` upon first login.
- **Dashboard**: Protected area accessible only after profile completion.
- **Modern UI**: Built with Tailwind CSS, Framer Motion, and Glassmorphism design.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Animations**: Framer Motion

## Getting Started

1.  **Clone the repository** (if you haven't already).

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.
    ```bash
    cp .env.local.example .env.local
    ```

    You can find your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your Supabase project settings -> API.


4.  **Database & Auth Setup**:
    - Run the SQL commands provided in `schema.sql` in the Supabase SQL Editor.
    - **IMPORTANT**: Go to Authentication -> Providers -> Email and DISABLE "Confirm email". This allows users to sign up and login immediately without email verification.

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

6.  **Open [http://localhost:3000](http://localhost:3000)** with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: UI components (currently inline or simple).
- `lib/supabase/`: Supabase client and server utilities.
- `schema.sql`: Database schema definition.

## Customization

- To change the design, edit `app/globals.css` or Tailwind config.
- To add more profile fields, update the `profiles` table in Supabase and the form in `app/profile/client-profile-form.tsx`.
