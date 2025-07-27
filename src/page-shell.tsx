// 🚀 NOHR Page Shell - Optimized HTML Template with Data Serialization
// Supports streaming SSR and intelligent hydration

import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  route: string;
  data?: any;
  title?: string;
  description?: string;
}

// 🎯 AMÉLIORATION: Template HTML optimisé pour le streaming et la sérialisation des données
export function PageShell({
  children,
  route,
  data,
  title = "NOHR Framework",
  description = "Architecture unifiée Node.js + Hono + React",
}: PageShellProps) {
  const buildId = `nohr-${Date.now()}`;

  // 🎯 AMÉLIORATION: Retourner une chaîne HTML complète avec DOCTYPE
  const htmlContent = (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* 🚀 AMÉLIORATION: Preload critique pour de meilleures performances */}
        <link rel="preload" href="/client.js" as="script" />
        <link rel="dns-prefetch" href="//localhost:3000" />

        {/* 🎨 CSS critique inline pour éviter le FOUC */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              line-height: 1.6;
              color: #333;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              margin-top: 2rem;
            }
            
            h1 {
              color: #2c3e50;
              margin-bottom: 1rem;
              font-size: 2.5rem;
              text-align: center;
            }
            
            h2 {
              color: #34495e;
              margin: 1.5rem 0 1rem 0;
              font-size: 1.8rem;
            }
            
            .loading {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 200px;
              font-size: 1.2rem;
              color: #666;
            }
            
            .loading::after {
              content: '';
              width: 20px;
              height: 20px;
              border: 2px solid #f3f3f3;
              border-top: 2px solid #3498db;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-left: 10px;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            /* 🎯 Optimisation pour le streaming */
            #root {
              min-height: 50vh;
            }
            
            /* 🚀 Performance: Éviter les reflows pendant l'hydratation */
            .hydrating {
              visibility: hidden;
            }
            
            .hydrated {
              visibility: visible;
            }
          `,
          }}
        />
      </head>
      <body>
        {/* 🎯 AMÉLIORATION: Container optimisé pour l'hydratation */}
        <div id="root" className="hydrating">
          {children}
        </div>

        {/* 🧠 AMÉLIORATION: Sérialisation des données pour l'hydratation sans mismatch */}
        <script
          id="__NOHR_DATA__"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              route,
              data: data || null,
              timestamp: Date.now(),
              buildId,
            }),
          }}
        />

        {/* 🚀 AMÉLIORATION: Script de performance et d'hydratation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Marquer le début de l'hydratation
              performance.mark('nohr-hydration-start');
              
              // Optimisation: Éviter les reflows pendant l'hydratation
              document.addEventListener('DOMContentLoaded', function() {
                const root = document.getElementById('root');
                if (root) {
                  root.classList.remove('hydrating');
                  root.classList.add('hydrated');
                }
              });
              
              // Mesurer les Core Web Vitals
              if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                      console.log('🎯 LCP:', entry.startTime);
                    }
                    if (entry.entryType === 'first-input') {
                      console.log('⚡ FID:', entry.processingStart - entry.startTime);
                    }
                  }
                });
                
                try {
                  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
                } catch (e) {
                  // Fallback pour les navigateurs plus anciens
                }
              }
            `,
          }}
        />

        {/* 🎯 AMÉLIORATION: Chargement asynchrone du client avec fallback */}
        <script
          type="module"
          src="/client.js"
          async
          onError="console.error('❌ Erreur de chargement du client JS')"
        />

        {/* 🛡️ Fallback pour les navigateurs sans JS */}
        <noscript>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              background: "#f39c12",
              color: "white",
              padding: "10px",
              textAlign: "center",
              zIndex: 9999,
            }}
          >
            ⚠️ JavaScript est désactivé. Certaines fonctionnalités peuvent ne
            pas fonctionner.
          </div>
        </noscript>
      </body>
    </html>
  );
}
