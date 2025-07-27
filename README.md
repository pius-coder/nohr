# 🚀 NOHR Framework

> **Modern Full-Stack Framework** - Node.js + Hono + React with Server-Side Rendering

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-org/nohr)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-18+-blue.svg)](https://reactjs.org/)
[![Hono](https://img.shields.io/badge/hono-4.7+-orange.svg)](https://hono.dev/)

**NOHR** is a cutting-edge full-stack framework that combines the power of **Node.js**, the speed of **Hono**, and the flexibility of **React** to create high-performance web applications with native Server-Side Rendering.

## ✨ Key Features

- 🚀 **Ultra-Fast SSR** - Native server-side rendering with Hono's blazing speed
- 📁 **File-System Routing** - Automatic routing based on file structure (Next.js-like)
- 🎨 **Nested Layouts** - Powerful layout system with automatic nesting
- ⚡ **Hot Reload** - Instant development feedback with `tsx watch`
- 🔧 **API Routes** - Built-in API routing with REST conventions
- 📦 **Modern Stack** - TypeScript, ESM, and latest tooling
- 🎯 **Zero Config** - Works out of the box with sensible defaults
- 🔄 **SPA Navigation** - Client-side routing without page reloads

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript execution |
| **Server** | Hono | Ultra-fast web framework |
| **Frontend** | React 18 | UI library with SSR |
| **Build** | esbuild | Lightning-fast bundling |
| **Dev Server** | tsx | TypeScript execution |
| **Package Manager** | pnpm | Efficient dependency management |

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/nohr.git
cd nohr

# Install dependencies
pnpm install

# Generate routes
pnpm generate

# Start development server
pnpm dev
```

🎉 Your app is now running at **http://localhost:3000**

## 📁 Project Structure

```
nohr/
├── app/
│   ├── (pages)/                 # 📄 Web pages with automatic routing
│   │   ├── layout.tsx          # Root layout (applied to all pages)
│   │   ├── page.tsx            # Home page "/"
│   │   ├── about/
│   │   │   └── page.tsx        # About page "/about"
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Dashboard layout
│   │   │   └── page.tsx        # Dashboard page "/dashboard"
│   │   └── users/
│   │       ├── page.tsx        # Users page "/users"
│   │       └── [id]/
│   │           └── page.tsx    # Dynamic page "/users/:id"
│   └── api/                     # 🔌 API routes
│       ├── users/
│       │   └── route.ts        # API "/api/users"
│       └── products/
│           ├── route.ts        # API "/api/products"
│           └── [id]/
│               └── route.ts    # API "/api/products/:id"
├── src/
│   ├── components/             # 🧩 Reusable React components
│   ├── generated/              # 🤖 Auto-generated code (do not edit)
│   ├── client.tsx              # Client-side entry point
│   └── server.ts               # Hono server with SSR
├── public/                     # 📁 Static assets
├── dist/                       # 📦 Production build
└── scripts/                    # 🔧 Build and generation scripts
```

## 📖 Available Scripts

```bash
# Development
pnpm dev                    # Start development server with hot reload
pnpm generate              # Generate all routes (pages + API)
pnpm generate-routes       # Generate page routes only
pnpm generate-api-routes   # Generate API routes only

# Production
pnpm build                 # Build for production
pnpm build:client         # Build client bundle only
pnpm start                # Start production server

# Utilities
pnpm clean                # Clean build artifacts
pnpm type-check          # Run TypeScript type checking
```

## 🎯 Usage Guide

### Creating Pages

Create a file `app/(pages)/my-page/page.tsx`:

```tsx
// Simple page
export default function MyPage() {
  return (
    <div>
      <h1>My New Page</h1>
      <p>This page is automatically available at /my-page</p>
    </div>
  );
}

// Page with server-side data loading
export default function UserPage({ user, params }) {
  return (
    <div>
      <h1>User: {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

export async function loadData({ params }) {
  const user = await fetchUser(params.id);
  return { user };
}

// SEO metadata
export const metadata = {
  title: 'User Profile',
  description: 'View user profile information'
};
```

### Creating API Routes

Create a file `app/api/my-api/route.ts`:

```typescript
import { Context } from 'hono';

// GET /api/my-api
export async function GET(c: Context) {
  const data = await fetchData();
  return c.json({ success: true, data });
}

// POST /api/my-api
export async function POST(c: Context) {
  const body = await c.req.json();
  const result = await createItem(body);
  return c.json({ success: true, result }, 201);
}
```

### Creating Layouts

Create a file `app/(pages)/dashboard/layout.tsx`:

```tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>Dashboard Navigation</nav>
      </aside>
      <main className="content">
        {children}
      </main>
    </div>
  );
}
```

### Navigation

Use the `Link` component for client-side navigation:

```tsx
import { Link } from '@/src/components/Link';

export default function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/dashboard" prefetch>Dashboard</Link>
      <Link to="/users">Users</Link>
    </nav>
  );
}
```

## 🎨 Advanced Features

### Dynamic Routes
- `[id]` in folder names creates dynamic segments
- Access parameters via `params.id` in components and `loadData`

### Nested Layouts
- Layouts automatically nest based on file structure
- Root layout applies to all pages
- Specific layouts apply to their directory and subdirectories

### Server-Side Data Loading
- Use `loadData` function for server-side data fetching
- Data is automatically passed as props to your component
- Supports async operations and database queries

### Client vs Server Components
- All components are server-rendered by default
- Use `"use client"` directive for interactive components
- Server components can import and render client components

## 📊 Performance & Optimization

NOHR is built for performance:

- **🚀 Fast SSR** - Server-side rendering with Hono's speed
- **⚡ Minimal Hydration** - Only interactive components are hydrated
- **📦 Code Splitting** - Automatic code splitting per route
- **🔄 Smart Caching** - Intelligent caching strategies
- **📱 Core Web Vitals** - Optimized for Google's performance metrics

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/your-username/nohr.git
cd nohr

# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - Ultra-fast web framework
- [React](https://react.dev/) - UI library
- [esbuild](https://esbuild.github.io/) - Fast bundler
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

<div align="center">

**Built with ❤️ by the NOHR Team**

[Website](https://nohr.dev) • [Documentation](https://docs.nohr.dev) • [Examples](https://github.com/nohr-framework/examples)

</div>
