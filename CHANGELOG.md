# 📋 NOHR Framework - Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-27

### 🚀 Ajouté
- **Architecture NOHR complète** - Framework full-stack Node.js + Hono + React
- **Routage automatique basé sur le système de fichiers** pour les pages
- **Routage API automatique** avec convention `route.ts`
- **Système de layouts imbriqués** avec support automatique
- **Server-Side Rendering (SSR)** optimisé avec streaming
- **Code splitting intelligent** avec lazy loading
- **Navigation côté client** sans rechargement de page
- **Fonction `loadData`** pour la récupération de données côté serveur
- **Composant `<Link>`** pour la navigation SPA
- **Générateur de routes automatique** (`generate-routes.mjs`)
- **Générateur de routes API automatique** (`generate-api-routes.mjs`)
- **Support TypeScript complet** avec types générés
- **Hot reload** en développement avec `tsx watch`

### 📁 Structure de Fichiers
```
app/
├── (pages)/                  # Pages web avec routage automatique
│   ├── layout.tsx           # Layout racine (nouveau)
│   ├── page.tsx             # Page d'accueil
│   ├── about/page.tsx       # Page /about
│   ├── dashboard/           # Section dashboard (nouveau)
│   │   ├── layout.tsx       # Layout dashboard (nouveau)
│   │   └── page.tsx         # Page /dashboard (nouveau)
│   └── users/
│       ├── page.tsx         # Page /users
│       └── [id]/page.tsx    # Page /users/:id avec loadData
├── api/                      # Routes API automatiques
│   ├── products/
│   │   ├── route.ts         # API /api/products (nouveau)
│   │   └── [id]/route.ts    # API /api/products/:id (nouveau)
│   └── users/
│       └── route.ts         # API /api/users (nouveau)
src/
├── components/
│   ├── Link.tsx             # Navigation côté client (nouveau)
│   ├── Router.tsx           # Routeur principal (nouveau)
│   └── SimpleRouter.tsx     # Routeur simplifié (nouveau)
├── generated/               # Code auto-généré
│   ├── routes.ts            # Routes pages avec layouts (nouveau)
│   └── api-routes.ts        # Routes API (nouveau)
├── client.tsx               # Point d'entrée client optimisé
└── server.ts                # Serveur Hono avec SSR
```

### 🎯 Fonctionnalités Principales

#### Routage Automatique
- **Pages** : Créer `app/(pages)/ma-page/page.tsx` → Route `/ma-page`
- **API** : Créer `app/api/mon-api/route.ts` → Route `/api/mon-api`
- **Dynamique** : `[id]` dans le nom de dossier → paramètre `:id`
- **Layouts** : `layout.tsx` s'applique automatiquement aux pages enfants

#### Server-Side Rendering
- **Fonction `loadData`** : Récupération de données côté serveur
- **Hydratation intelligente** : Pas de mismatch serveur/client
- **Métriques de performance** : Temps de rendu et Core Web Vitals
- **Sérialisation automatique** : Données passées du serveur au client

#### Navigation Côté Client
- **Composant `<Link>`** : Navigation sans rechargement
- **Router intelligent** : Gestion des routes et paramètres
- **Historique du navigateur** : Support boutons précédent/suivant
- **Préchargement** : Option `prefetch` pour les liens

### 🔧 API et Conventions

#### Pages (`app/(pages)/**/*.tsx`)
```tsx
// Composant de page
export default function MaPage({ params, ...data }) {
  return <div>Ma Page</div>;
}

// Récupération de données (optionnel)
export async function loadData({ params }) {
  const data = await fetchData(params.id);
  return { data };
}

// Métadonnées SEO (optionnel)
export const metadata = {
  title: 'Ma Page',
  description: 'Description de ma page'
};
```

#### Routes API (`app/api/**/*.ts`)
```typescript
import { Context } from 'hono';

export async function GET(c: Context) {
  return c.json({ message: 'Hello' });
}

export async function POST(c: Context) {
  const body = await c.req.json();
  return c.json({ created: body }, 201);
}
```

#### Layouts (`app/(pages)/**/layout.tsx`)
```tsx
export default function MonLayout({ children }) {
  return (
    <div>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
```

### 🛠️ Scripts de Build
- `pnpm generate` : Génère toutes les routes (pages + API)
- `pnpm generate-routes` : Génère uniquement les routes de pages
- `pnpm generate-api-routes` : Génère uniquement les routes API
- `pnpm dev` : Développement avec hot reload
- `pnpm build` : Build de production
- `pnpm build:client` : Build du client JavaScript

### 📊 Métriques et Performance
- **Temps de rendu SSR** : Affiché dans les logs serveur
- **Temps d'hydratation** : Mesuré côté client
- **Core Web Vitals** : LCP, FID, CLS automatiquement mesurés
- **Code splitting** : Chargement à la demande des composants
- **Préchargement** : Assets critiques préchargés

### 🔍 Routes Générées Automatiquement

#### Pages Web
- `GET /` → `app/(pages)/page.tsx`
- `GET /about` → `app/(pages)/about/page.tsx`
- `GET /dashboard` → `app/(pages)/dashboard/page.tsx` (avec layouts)
- `GET /users` → `app/(pages)/users/page.tsx`
- `GET /users/:id` → `app/(pages)/users/[id]/page.tsx` (avec loadData)

#### API Routes
- `[GET, POST, DELETE] /api/products` → `app/api/products/route.ts`
- `[GET, PUT, DELETE, PATCH] /api/products/:id` → `app/api/products/[id]/route.ts`
- `[GET, POST, PUT, DELETE] /api/users` → `app/api/users/route.ts`

### 🎨 Layouts Imbriqués
- **Layout racine** : `app/(pages)/layout.tsx` (appliqué à toutes les pages)
- **Layout dashboard** : `app/(pages)/dashboard/layout.tsx` (appliqué aux pages /dashboard/*)
- **Imbrication automatique** : Les layouts sont automatiquement imbriqués selon l'arborescence

### 🧪 Tests et Validation
- **API testées avec curl** : Toutes les routes API fonctionnelles
- **Navigation testée** : Links et routage côté client opérationnels
- **SSR validé** : Rendu serveur et hydratation sans erreur
- **Layouts testés** : Imbrication correcte des layouts

### 📚 Documentation
- **CONVENTIONS.md** : Guide complet des conventions de développement
- **README.md** : Instructions d'installation et d'utilisation
- **CHANGELOG.md** : Historique des modifications (ce fichier)

### 🔧 Configuration
- **TypeScript** : Configuration complète avec types générés
- **ESBuild** : Build rapide pour le client et le serveur
- **Hono** : Serveur web moderne et performant
- **React 18** : Avec support SSR et Suspense

---

## [0.1.0] - 2025-07-26

### 🚀 Version Initiale
- Configuration de base du projet
- Serveur Hono basique
- Rendu React côté serveur
- Routes manuelles pour les pages
- API de test fonctionnelle

---

**🎯 Prochaines Versions Prévues :**
- **v1.1.0** : Middleware d'authentification
- **v1.2.0** : Support des bases de données (Prisma/Drizzle)
- **v1.3.0** : Déploiement automatisé (Docker/Vercel)
- **v2.0.0** : React Server Components
