export default function AboutPage() {
  return (
    <div className="container">
      <h1>📖 À propos de NOHR</h1>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>🎯 Qu'est-ce que NOHR ?</h2>
        <p>
          <strong>NOHR</strong> est un framework full-stack moderne qui combine :
        </p>
        <ul>
          <li><strong>Node.js</strong> - Runtime JavaScript performant</li>
          <li><strong>Hono</strong> - Framework web ultra-rapide</li>
          <li><strong>React</strong> - Bibliothèque UI avec SSR</li>
        </ul>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>⚡ Avantages</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>🚀 Performance</h3>
            <p>SSR natif avec hydratation optimisée</p>
          </div>
          <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>🔧 Simplicité</h3>
            <p>Un seul serveur pour tout gérer</p>
          </div>
          <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>📦 Moderne</h3>
            <p>TypeScript, ESM, et outils récents</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>🛠️ Stack Technique</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Composant</th>
              <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Technologie</th>
              <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Rôle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Runtime</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Node.js 18+</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Exécution JavaScript</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Serveur</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Hono</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>API & SSR</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Frontend</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>React 19</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Interface utilisateur</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Build</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>esbuild</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Bundling rapide</td>
            </tr>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Package Manager</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>pnpm</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>Gestion des dépendances</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>🔗 Navigation</h2>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <a
            href="/"
            style={{
              color: "#007acc",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            ← Retour à l'accueil
          </a>
          <a
            href="/users"
            style={{
              color: "#28a745",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            → Voir les utilisateurs
          </a>
        </div>
      </div>
    </div>
  );
}
