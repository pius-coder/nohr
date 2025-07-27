// 🚀 NOHR Dashboard Layout - Layout spécifique au dashboard
// Ce layout s'applique à toutes les pages sous /dashboard/*

import React from 'react';
import { Link } from '../../../src/components/Link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>📊 Dashboard</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li>
              <Link to="/dashboard" className="sidebar-link">
                🏠 Vue d'ensemble
              </Link>
            </li>
            <li>
              <Link to="/dashboard/analytics" className="sidebar-link">
                📈 Analytics
              </Link>
            </li>
            <li>
              <Link to="/dashboard/users" className="sidebar-link">
                👥 Gestion Utilisateurs
              </Link>
            </li>
            <li>
              <Link to="/dashboard/settings" className="sidebar-link">
                ⚙️ Paramètres
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">Admin</div>
              <div className="user-role">Administrateur</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="dashboard-content">
        <div className="dashboard-header">
          <div className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <span>Dashboard</span>
          </div>
          
          <div className="dashboard-actions">
            <button className="btn-secondary">🔔 Notifications</button>
            <button className="btn-primary">➕ Nouveau</button>
          </div>
        </div>
        
        <div className="dashboard-body">
          {children}
        </div>
      </main>

      {/* Styles intégrés pour le dashboard */}
      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: calc(100vh - 200px); /* Ajuster selon le header/footer */
          background: #f8f9fa;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .dashboard-sidebar {
          width: 280px;
          background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .sidebar-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-menu li {
          margin: 0.25rem 0;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .sidebar-link:hover {
          background: rgba(255,255,255,0.1);
          color: white;
          border-left-color: #3498db;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #3498db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-role {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
        }

        .dashboard-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e9ecef;
          background: white;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .breadcrumb a {
          color: #007bff;
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .breadcrumb-separator {
          color: #adb5bd;
        }

        .dashboard-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }

        .dashboard-body {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-layout {
            flex-direction: column;
          }

          .dashboard-sidebar {
            width: 100%;
            height: auto;
          }

          .sidebar-nav {
            display: none; /* Masquer sur mobile, implémenter un menu burger */
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .dashboard-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
