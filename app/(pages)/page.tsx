import { useState, useEffect } from "react";

export default function HomePage() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Détecter si on est côté client pour éviter les problèmes d'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchHello = async () => {
    try {
      const response = await fetch("/api/hello");
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Erreur API:", error);
      setMessage("Erreur lors de la récupération des données");
    }
  };

  return (
    <div className="container">
      <h1>🚀 NOHR - Architectures Unifi</h1>
      <p>
        sa Bienvenue dans l'architecture <strong>Node.js + Hono + React</strong>{" "}
        !
      </p>

      <div style={{ marginBottom: "20px" }}>
        <h2>✨ Fonctionnalits</h2>
        <ul>
          <li>✅ Server-Side Rendring (SSR)</li>
          <li>✅ Un seul serveur unifié</li>
          <li>✅ API routes intégrées</li>
          <li>✅ React avec dratation</li>
          <li>✅ TypeScript partout</li>
          <li>✅ Node.js + pnpm</li>
        </ul>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>🎮 Test d'Interactivité</h2>
        <p>
          Compteur (côté client) : <strong>{count}</strong>
        </p>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Incrémenter
        </button>
        <button
          onClick={() => setCount(0)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#666",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>🌐 Test API</h2>
        <button
          onClick={fetchHello}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          Appeler /api/hello
        </button>
        {message && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#e7f3ff",
              border: "1px solid #b3d9ff",
              borderRadius: "4px",
            }}
          >
            <strong>Réponse API :</strong> {message}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>🔗 Navigation</h2>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <a
            href="/about"
            style={{
              color: "#007acc",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            → Page À propos
          </a>
          <a
            href="/users"
            style={{
              color: "#28a745",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            → Gestion Utilisateurs
          </a>
          <a
            href="/users/123"
            style={{
              color: "#dc3545",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            → Utilisateur #123
          </a>
        </div>
      </div>

      <div>
        <h2>📊 Performance NOHR</h2>
        <p style={{ fontSize: "0.9em", color: "#666" }}>
          Ouvrez la console pour voir les métriques de performance en temps
          réel.
        </p>
      </div>
    </div>
  );
}
