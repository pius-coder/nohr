// 🚀 NOHR Root Layout - Layout racine de l'application
// Ce layout s'applique à toutes les pages de l'application

import React from "react";
import { Link } from "../../src/components/Link";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>NOHR Framework</title>
        <meta
          name="description"
          content="Architecture unifiée Node.js + Hono + React"
        />
        <link rel="preload" href="/client.js" as="script" />

        {/* Styles globaux intégrés */}
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
            
            .layout-container {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }
            
            .header {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
              padding: 1rem 0;
              position: sticky;
              top: 0;
              z-index: 100;
            }
            
            .nav-container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 2rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .logo {
              font-size: 1.5rem;
              font-weight: bold;
              color: #667eea;
              text-decoration: none;
            }
            
            .nav-links {
              display: flex;
              gap: 2rem;
              list-style: none;
            }
            
            .nav-links a {
              color: #333;
              text-decoration: none;
              font-weight: 500;
              padding: 0.5rem 1rem;
              border-radius: 6px;
              transition: all 0.2s ease;
            }
            
            .nav-links a:hover {
              background: #667eea;
              color: white;
              transform: translateY(-1px);
            }
            
            .main-content {
              flex: 1;
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
              width: 100%;
            }
            
            .footer {
              background: rgba(0, 0, 0, 0.8);
              color: white;
              text-align: center;
              padding: 2rem;
              margin-top: auto;
            }
            
            .footer-content {
              max-width: 1200px;
              margin: 0 auto;
            }
            
            .footer-links {
              display: flex;
              justify-content: center;
              gap: 2rem;
              margin-bottom: 1rem;
            }
            
            .footer-links a {
              color: #ccc;
              text-decoration: none;
              transition: color 0.2s ease;
            }
            
            .footer-links a:hover {
              color: white;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
              .nav-container {
                flex-direction: column;
                gap: 1rem;
              }
              
              .nav-links {
                gap: 1rem;
              }
              
              .main-content {
                padding: 1rem;
              }
              
              .footer-links {
                flex-direction: column;
                gap: 1rem;
              }
            }
          `,
          }}
        />
      </head>
      <body>
        <div className="layout-container">
          {/* Header avec Navigation */}
          <header className="header">
            <div className="nav-container">
              <Link to="/" className="logo">
                🚀 NOHR
              </Link>

              <nav>
                <ul className="nav-links">
                  <li>
                    <Link to="/">Accueil</Link>
                  </li>
                  <li>
                    <Link to="/about">À propos</Link>
                  </li>
                  <li>
                    <Link to="/users">Utilisateurs</Link>
                  </li>
                  <li>
                    <Link to="/dashboard" prefetch>
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Contenu Principal */}
          <main className="main-content">
            <div id="root">{children}</div>
          </main>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-links">
                <Link to="/about">À propos</Link>
                <Link to="/api/test">API Test</Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
              <p>
                &copy; 2025 NOHR Framework - Architecture unifiée Node.js + Hono
                + React
              </p>
            </div>
          </footer>
        </div>

        {/* Scripts NOHR */}
        <script id="__NOHR_DATA__" type="application/json">
          {JSON.stringify({ framework: "NOHR", version: "1.0.0" })}
        </script>
        <script type="module" src="/client.js" async />
      </body>
    </html>
  );
}
