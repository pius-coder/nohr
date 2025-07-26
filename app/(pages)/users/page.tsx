/**
 * 🚀 Page: /users
 * Exemple de page avec file-based routing NOHR
 * Affiche la liste des utilisateurs avec appels API
 */

import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse {
  success: boolean;
  data?: User[];
  count?: number;
  error?: string;
  message?: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [creating, setCreating] = useState(false);

  // 📊 Charger les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data: ApiResponse = await response.json();
      
      if (data.success && data.data) {
        setUsers(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error while fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Créer un nouvel utilisateur
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email) {
      setError('Name and email are required');
      return;
    }

    try {
      setCreating(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setNewUser({ name: '', email: '', role: 'user' });
        fetchUsers(); // Recharger la liste
        setError(null);
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (err) {
      setError('Network error while creating user');
      console.error('Error creating user:', err);
    } finally {
      setCreating(false);
    }
  };

  // 🗑️ Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        fetchUsers(); // Recharger la liste
        setError(null);
      } else {
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Network error while deleting user');
      console.error('Error deleting user:', err);
    }
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1>👥 Gestion des Utilisateurs - NOHR</h1>
      <p>Démonstration des appels API avec React et Hono</p>

      {/* Formulaire de création */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2>➕ Ajouter un utilisateur</h2>
        <form onSubmit={createUser} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nom:</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rôle:</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: '8px 16px',
              backgroundColor: creating ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: creating ? 'not-allowed' : 'pointer',
            }}
          >
            {creating ? 'Création...' : 'Créer'}
          </button>
        </form>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Liste des utilisateurs */}
      <div>
        <h2>📋 Liste des utilisateurs ({users.length})</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '24px' }}>⏳</div>
            <p>Chargement des utilisateurs...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>
                    <a 
                      href={`/users/${user.id}`}
                      style={{ color: '#007acc', textDecoration: 'none' }}
                    >
                      {user.name}
                    </a>
                  </h3>
                  <p style={{ margin: '0', color: '#666' }}>
                    📧 {user.email} | 🏷️ {user.role}
                  </p>
                  {user.created_at && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#999' }}>
                      Créé le: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`/users/${user.id}`}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#007acc',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '0.9em'
                    }}
                  >
                    Voir
                  </a>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9em'
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
        <h2>🔗 Navigation</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <a href="/" style={{ color: '#007acc', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Retour à l'accueil
          </a>
          <a href="/about" style={{ color: '#28a745', textDecoration: 'none', fontWeight: 'bold' }}>
            → À propos
          </a>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
