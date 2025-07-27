# 🚀 NOHR Framework - Conventions d'Implémentation

> **Le Contrat NOHR** : Ce document définit les règles de codage et de structure de fichiers pour toute application construite avec NOHR. Le respect de ces conventions est **obligatoire** pour que les automatisations (routage, data-loading) et les optimisations (code-splitting, SSR) fonctionnent.

## 📁 1. Structure des Fichiers et Dossiers

La structure des fichiers est la **source de vérité** pour le routage de l'application.

```
app/                          # Dossier racine de l'application
├── (pages)/                  # 🔥 OBLIGATOIRE - Routes de pages web
│   ├── layout.tsx           # Layout racine (obligatoire)
│   ├── page.tsx             # Page d'accueil "/"
│   ├── about/
│   │   └── page.tsx         # Page "/about"
│   └── users/
│       ├── layout.tsx       # Layout pour "/users/*"
│       ├── page.tsx         # Page "/users"
│       └── [id]/
│           └── page.tsx     # Page "/users/:id"
├── api/                      # 🔥 OBLIGATOIRE - Routes API
│   ├── users/
│   │   ├── route.ts         # API "/api/users"
│   │   └── [id]/
│   │       └── route.ts     # API "/api/users/:id"
│   └── products/
│       └── route.ts         # API "/api/products"
├── components/               # Composants React partagés
├── lib/                      # Fonctions utilitaires
└── layouts/                  # Layouts réutilisables (optionnel)

public/                       # 🔥 OBLIGATOIRE - Assets statiques
├── favicon.ico
├── images/
└── fonts/

src/                          # Code du framework NOHR
├── generated/                # 🤖 AUTO-GÉNÉRÉ - Ne pas modifier
│   ├── routes.ts
│   └── api-routes.ts
├── components/
│   ├── Link.tsx
│   └── Router.tsx
├── client.tsx
└── server.ts
```

## 📄 2. Pages (`app/(pages)/**/*.tsx`)

Une **page** est un composant React associé à une URL.

### Règles Obligatoires

- **Nom du fichier** : `page.tsx` (exactement)
- **Export principal** : `export default function PageName() { ... }`
- **Props automatiques** : `{ params, pathname, ...loadData }`

### Exemple de Page Simple

```tsx
// app/(pages)/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>À Propos de Nous</h1>
      <p>Bienvenue sur notre site NOHR !</p>
    </div>
  );
}
```

### Récupération de Données (SSR)

```tsx
// app/(pages)/users/[id]/page.tsx
interface UserPageProps {
  params: { id: string };
  pathname: string;
  user?: User; // Données de loadData
}

export default function UserPage({ params, user }: UserPageProps) {
  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// 🔥 FONCTION MAGIQUE - Exécutée côté serveur uniquement
export async function loadData({ params }: { params: { id: string } }) {
  // Appel API, base de données, etc.
  const user = await fetchUser(params.id);
  
  // ⚠️ IMPORTANT : Retourner un objet sérialisable JSON
  return { user };
}
```

### Métadonnées SEO

```tsx
// app/(pages)/users/[id]/page.tsx
export const metadata = {
  title: 'Profil Utilisateur',
  description: 'Détails du profil utilisateur',
  keywords: ['utilisateur', 'profil', 'NOHR']
};
```

## 🔌 3. Routes API (`app/api/**/*.ts`)

Une **route API** est un point d'entrée pour manipuler des données.

### Règles Obligatoires

- **Nom du fichier** : `route.ts` (exactement)
- **Pas d'export default** : Uniquement des exports nommés
- **Exports autorisés** : `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`
- **Signature** : `export async function GET(c: Context) { ... }`

### Exemple d'API Complète

```typescript
// app/api/users/route.ts
import { Context } from 'hono';

// 🔥 GET /api/users - Récupérer tous les utilisateurs
export async function GET(c: Context) {
  const users = await db.users.findMany();
  
  return c.json({
    success: true,
    data: users,
    count: users.length
  });
}

// 🔥 POST /api/users - Créer un utilisateur
export async function POST(c: Context) {
  try {
    const body = await c.req.json();
    
    // Validation
    if (!body.name || !body.email) {
      return c.json({
        success: false,
        error: 'Name and email are required'
      }, 400);
    }
    
    const user = await db.users.create({ data: body });
    
    return c.json({
      success: true,
      data: user
    }, 201);
    
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request'
    }, 400);
  }
}
```

## 🎯 4. Routage Dynamique

Les segments d'URL dynamiques utilisent des **crochets** `[]`.

### Pages Dynamiques
- `app/(pages)/users/[id]/page.tsx` → `/users/123`
- `app/(pages)/blog/[slug]/page.tsx` → `/blog/mon-article`
- `app/(pages)/shop/[category]/[product]/page.tsx` → `/shop/electronics/laptop`

### API Dynamiques
- `app/api/users/[id]/route.ts` → `GET /api/users/123`
- `app/api/posts/[slug]/route.ts` → `POST /api/posts/mon-article`

### Accès aux Paramètres

```tsx
// Dans une page
export default function ProductPage({ params }: { params: { category: string, product: string } }) {
  return <h1>{params.category} - {params.product}</h1>;
}

// Dans une API
export async function GET(c: Context) {
  const id = c.req.param('id');
  const user = await db.users.findById(id);
  return c.json({ user });
}
```

## ⚡ 5. Composants Client vs Serveur

NOHR adopte une philosophie **"Server-First"** pour une performance optimale.

### Composants Serveur (Par Défaut)

```tsx
// app/components/UserCard.tsx
// 🔥 SERVEUR - Pas de directive, pas de hooks
export default function UserCard({ user }: { user: User }) {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

### Composants Client (Interactifs)

```tsx
// app/components/Counter.tsx
"use client"; // 🔥 OBLIGATOIRE pour l'interactivité

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Compteur: {count}
    </button>
  );
}
```

### Règles de Composition

```tsx
// app/(pages)/dashboard/page.tsx
// 🔥 SERVEUR - Peut importer des composants client
import Counter from '@/app/components/Counter'; // Client
import UserCard from '@/app/components/UserCard'; // Serveur

export default function DashboardPage({ users }: { users: User[] }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <Counter /> {/* Interactif côté client */}
      
      {users.map(user => (
        <UserCard key={user.id} user={user} /> // Rendu côté serveur
      ))}
    </div>
  );
}
```

## 🎨 6. Système de Layouts

Les **layouts** permettent de partager une interface commune entre plusieurs pages.

### Layout Racine (Obligatoire)

```tsx
// app/(pages)/layout.tsx
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mon App NOHR</title>
      </head>
      <body>
        <header>
          <nav>Navigation Principale</nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>&copy; 2025 Mon App NOHR</p>
        </footer>
      </body>
    </html>
  );
}
```

### Layout Niché

```tsx
// app/(pages)/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>Menu Dashboard</nav>
      </aside>
      <section className="content">
        {children}
      </section>
    </div>
  );
}
```

## 🔗 7. Navigation

Utilisez le composant `<Link>` pour la navigation côté client.

```tsx
import { Link } from '@/src/components/Link';

export default function Navigation() {
  return (
    <nav>
      <Link to="/">Accueil</Link>
      <Link to="/about">À propos</Link>
      <Link to="/users">Utilisateurs</Link>
      <Link to="/dashboard" prefetch>Dashboard</Link>
    </nav>
  );
}
```

## ⚠️ 8. Règles Importantes

### ✅ À Faire
- Respecter exactement les noms de fichiers (`page.tsx`, `route.ts`, `layout.tsx`)
- Utiliser `export default` pour les pages et layouts
- Utiliser `export function` pour les méthodes API
- Placer `"use client"` en première ligne pour l'interactivité
- Retourner des objets sérialisables JSON dans `loadData`

### ❌ À Éviter
- Modifier les fichiers dans `src/generated/`
- Utiliser `export const GET = () => {}` dans les APIs
- Oublier la directive `"use client"` pour les hooks
- Retourner des fonctions ou classes dans `loadData`
- Créer des fichiers avec d'autres noms que `page.tsx` ou `route.ts`

---

**🎯 En respectant ces conventions, NOHR vous offre :**
- ⚡ Routage automatique
- 🚀 Code splitting intelligent  
- 📊 SSR optimisé
- 🔄 Hot reload
- 📱 Navigation SPA
- 🎨 Layouts imbriqués
- 🔌 API type-safe
