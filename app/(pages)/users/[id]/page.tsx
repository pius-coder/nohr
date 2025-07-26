/**
 * 🚀 Page: /users/[id]
 * Page dynamique pour afficher un utilisateur spécifique
 */

import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

interface Props {
  params: { id: string };
}

const UserPage: React.FC<Props> = ({ params }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

  const userId = params.id;

  // 📊 Charger les données de l'utilisateur
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setUser(data.data);
        setEditForm({
          name: data.data.name,
          email: data.data.email,
          role: data.data.role
        });
        setError(null);
      } else {
        setError(data.error || 'User not found');
      }
    } catch (err) {
      setError('Network error while fetching user');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Mettre à jour l'utilisateur
  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.data);
        setEditing(false);
        setError(null);
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Network error while updating user');
      console.error('Error updating user:', err);
    }
  };

  // 🗑️ Supprimer l'utilisateur
  const deleteUser = async () => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        // Rediriger vers la liste des utilisateurs
        window.location.href = '/users';
      } else {
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Network error while deleting user');
      console.error('Error deleting user:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px' }}>⏳</div>
          <p>Chargement de l'utilisateur...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>❌ Erreur</h1>
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
        <a href="/users" style={{ color: '#007acc', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Retour à la liste des utilisateurs
        </a>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <h1>👤 Utilisateur non trouvé</h1>
        <p>L'utilisateur avec l'ID {userId} n'existe pas.</p>
        <a href="/users" style={{ color: '#007acc', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Retour à la liste des utilisateurs
        </a>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>👤 Utilisateur #{user.id}</h1>
      
      {/* Informations utilisateur */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        {editing ? (
          <form onSubmit={updateUser}>
            <h2>✏️ Modifier l'utilisateur</h2>
            <div style={{ display: 'grid', gap: '15px', maxWidth: '400px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nom:</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rôle:</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <h2>📋 Informations</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Nom:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rôle:</strong> <span style={{ 
                padding: '2px 8px', 
                backgroundColor: user.role === 'admin' ? '#dc3545' : '#007acc', 
                color: 'white', 
                borderRadius: '4px',
                fontSize: '0.9em'
              }}>{user.role}</span></p>
              {user.created_at && (
                <p><strong>Créé le:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}
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

      {/* Actions */}
      {!editing && (
        <div style={{ marginBottom: '30px' }}>
          <h2>⚡ Actions</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007acc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✏️ Modifier
            </button>
            <button
              onClick={deleteUser}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ paddingTop: '20px', borderTop: '1px solid #ddd' }}>
        <h2>🔗 Navigation</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <a href="/users" style={{ color: '#007acc', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Liste des utilisateurs
          </a>
          <a href="/" style={{ color: '#28a745', textDecoration: 'none', fontWeight: 'bold' }}>
            → Accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
