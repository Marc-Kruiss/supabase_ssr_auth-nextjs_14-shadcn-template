# Next.js Project with Prisma, Supabase, TailwindCSS and Shadcn

## Introduction

This project demonstrates setting up a Next.js application utilizing Prisma as an ORM, Supabase for authentication and real-time database functionalities, Shadcn for UI components and styling (with TailwindCSS), and Google Sign-Up for authentication. It also includes the use of the new `supabase/ssr` package for creating Supabase clients optimized for Server-Side Rendering.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

## Installation

To get started with this project, follow these steps:

1. Clone the repository.
2. Install dependencies by running `npm install`.
3. Populate your `.env` file with necessary environment variables including `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Usage

### Prisma

1. Initialize Prisma using `npx prisma init`.
2. Add your database model to `schema.prisma` and execute `npx prisma db push` to sync your database.

### Supabase

1. Set up a new Supabase project and add the URL and Anon Key to your `.env` file.
2. Install the Supabase CLI and generate types based on your schema with `npx supabase gen types typescript --project-id YOUR_PROJECT_ID`.

### Shadcn

1. Initialize Shadcn with `npx shadcn-ui@latest init` following the on-screen instructions.
2. To install all Shadcn components, run `npx shadcn-ui@latest add`.

### Supabase SSR

Utilize the `supabase/ssr` package for creating Supabase clients. This involves setting up client, middleware, and server utilities under the `utils/supabase` directory.

- **Client:** `utils/supabase/client.ts`
- **Middleware:** `utils/supabase/middleware.ts`
- **Server:** `utils/supabase/server.ts`

### Authentication

Implement sign up, sign in, and sign out functionalities using Supabase's authentication features, including Google Sign-Up.

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Prisma ORM for simplified database querying.
- Supabase for real-time database and authentication.
- Shadcn for sleek UI components and styling.
- Integration with Google Sign-Up for an additional authentication method.
- Supabase SSR for optimized server-side Supabase client creation.

## Dependencies

- Next.js
- Prisma
- Supabase
- Shadcn
- @supabase/auth-helpers-nextjs
- next-themes
- supabase/ssr

## Configuration

Key configurations involve setting up the `.env` file and customizing the `schema.prisma` for your database models.

## Examples

A basic usage example is described in the [Usage](#usage) section.

## Troubleshooting

For any issues encountered during setup or usage, refer to the official documentation of the technologies used.

## Contributors

Feel free to contribute to this project. Any help is welcomed!

## License

This project is licensed under the MIT License. For more details, see the `LICENSE` file.

## References

### GitHub Repository

For the source code and latest updates, visit the official Supabase GitHub repository: ["Supabase Github"](https://github.com/supabase/supabase)

### Reference Blog Post

This project setup was inspired by and based on the blog post: ["Setting up a Next.js project with Prisma"](https://dev.to/isaacdyor/setting-up-nextjs-project-with-prisma-200j). For a detailed guide and additional context, check out this resource.
