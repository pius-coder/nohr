# 🚀 NOHR - Node.js + Hono + React

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/USERNAME/nohr)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-blue?logo=react)](https://reactjs.org/)
[![Hono](https://img.shields.io/badge/Hono-4.7+-orange?logo=hono)](https://hono.dev/)

**NOHR** est une architecture unifiée moderne qui combine **Node.js**, **Hono** et **React** pour créer des applications web performantes avec SSR (Server-Side Rendering) et CSR (Client-Side Rendering).

## ✨ Fonctionnalités

- ✅ **Server-Side Rendering (SSR)** avec React
- ✅ **Client-Side Hydration** pour l'interactivité
- ✅ **Routing** basé sur les fichiers (comme Next.js)
- ✅ **API Routes** avec Hono
- ✅ **TypeScript** support complet
- ✅ **Build optimisé** avec esbuild
- ✅ **Compression gzip** automatique

## 🛠️ Stack Technique

| Composant       | Technologie | Rôle                    |
| --------------- | ----------- | ----------------------- |
| Runtime         | Node.js 18+ | Exécution JavaScript    |
| Serveur         | Hono        | API & SSR               |
| Frontend        | React 19    | Interface utilisateur   |
| Build           | esbuild     | Bundling rapide         |
| Package Manager | pnpm        | Gestion des dépendances |
| Types           | TypeScript  | Type safety             |

## 🚀 Installation

### Prérequis

- Node.js 18+
- pnpm (recommandé) ou npm

### Installation des dépendances

```bash
# Avec pnpm (recommandé)
pnpm install

# Ou avec npm
npm install
```

## 🎯 Utilisation

### Développement

```bash
# Démarrer le serveur de développement
pnpm dev

# Ou avec npm
npm run dev
```

Le serveur sera disponible sur `http://localhost:3000`

### Production

```bash
# Build pour la production
pnpm build

# Démarrer en production
pnpm start
```

### Scripts disponibles

- `pnpm dev` - Serveur de développement avec watch
- `pnpm build` - Build client + serveur
- `pnpm start` - Démarrer en production
- `pnpm type-check` - Vérification TypeScript
- `pnpm clean` - Nettoyer le dossier dist

## 📁 Structure du projet

```
nohr/
├── app/                    # Application
│   ├── (pages)/           # Pages React avec file-based routing
│   │   ├── page.tsx       # Page d'accueil (/)
│   │   ├── about/         # Page à propos (/about)
│   │   └── users/         # Pages utilisateurs (/users)
│   └── api/               # API Routes
│       ├── hello/         # API Hello (/api/hello)
│       └── users/         # API Users (/api/users)
├── src/                   # Code source
│   ├── server.ts          # Serveur Hono avec SSR
│   └── client.tsx         # Client React avec hydratation
├── dist/                  # Build output
└── package.json
```

## 🌐 Routes disponibles

### Pages

- `/` - Page d'accueil
- `/about` - À propos de NOHR
- `/users` - Liste des utilisateurs
- `/users/:id` - Détail d'un utilisateur

### API

- `GET /api/hello` - API de test
- `POST /api/hello` - Test POST
- `GET /api/hello/health` - Health check
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur
- `GET /api/users/:id` - Détail d'un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

## 🎮 Fonctionnalités de démonstration

1. **SSR + Hydratation** - Les pages sont rendues côté serveur puis hydratées côté client
2. **API intégrées** - Appels API depuis les composants React
3. **Routing dynamique** - Routes avec paramètres (`/users/:id`)
4. **Gestion d'état** - State management avec React hooks
5. **Performance** - Métriques temps réel dans la console

## 📊 Performance

NOHR est optimisé pour la performance :

- **Bundle size** : ~0.3MB
- **Hydratation** : ~60ms
- **SSR render** : ~20ms
- **Compression** : Gzip automatique
- **Cache** : Headers optimisés

## 🔧 Configuration

### TypeScript

Le projet utilise TypeScript avec une configuration stricte. Voir `tsconfig.json`.

### Build

esbuild est utilisé pour un bundling ultra-rapide :

- **Client** : Bundle ESM pour le navigateur
- **Serveur** : Bundle Node.js optimisé

### Développement

Le serveur de développement utilise `tsx` avec watch mode pour un rechargement automatique.

## 🚀 Déploiement

NOHR peut être déployé sur n'importe quelle plateforme supportant Node.js :

- Vercel
- Netlify
- Railway
- Render
- VPS avec PM2

## 🤝 Comparaison avec BHR

| Aspect          | BHR (Bun)    | NOHR (Node.js) |
| --------------- | ------------ | -------------- |
| Runtime         | Bun          | Node.js        |
| Package Manager | Bun          | pnpm           |
| Performance     | Ultra-rapide | Très rapide    |
| Compatibilité   | Récent       | Mature         |
| Écosystème      | Émergent     | Établi         |

## 📝 Licence

MIT

## 🙏 Remerciements

- [Hono](https://hono.dev) - Framework web ultra-rapide
- [React](https://react.dev) - Bibliothèque UI
- [esbuild](https://esbuild.github.io) - Bundler rapide
- [TypeScript](https://typescriptlang.org) - Type safety
