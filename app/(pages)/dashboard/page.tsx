// 🚀 NOHR Dashboard Page - Vue d'ensemble du dashboard
// Cette page utilise le DashboardLayout automatiquement

import React from 'react';

interface DashboardPageProps {
  params: Record<string, string>;
  pathname: string;
  stats?: {
    users: number;
    products: number;
    orders: number;
    revenue: number;
  };
}

export default function DashboardPage({ stats }: DashboardPageProps) {
  return (
    <div className="dashboard-overview">
      <div className="page-header">
        <h1>📊 Vue d'ensemble</h1>
        <p>Bienvenue sur votre dashboard NOHR</p>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.users || 0}</div>
            <div className="stat-label">Utilisateurs</div>
          </div>
          <div className="stat-trend positive">+12%</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.products || 0}</div>
            <div className="stat-label">Produits</div>
          </div>
          <div className="stat-trend positive">+8%</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.orders || 0}</div>
            <div className="stat-label">Commandes</div>
          </div>
          <div className="stat-trend negative">-3%</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.revenue || 0}€</div>
            <div className="stat-label">Revenus</div>
          </div>
          <div className="stat-trend positive">+15%</div>
        </div>
      </div>

      {/* Graphiques et tableaux */}
      <div className="dashboard-widgets">
        <div className="widget">
          <div className="widget-header">
            <h3>📈 Activité récente</h3>
            <button className="widget-action">Voir tout</button>
          </div>
          <div className="widget-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-details">
                  <div className="activity-title">Nouvel utilisateur inscrit</div>
                  <div className="activity-time">Il y a 5 minutes</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">🛒</div>
                <div className="activity-details">
                  <div className="activity-title">Nouvelle commande #1234</div>
                  <div className="activity-time">Il y a 12 minutes</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📦</div>
                <div className="activity-details">
                  <div className="activity-title">Produit ajouté au catalogue</div>
                  <div className="activity-time">Il y a 1 heure</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="widget">
          <div className="widget-header">
            <h3>🎯 Objectifs du mois</h3>
            <button className="widget-action">Modifier</button>
          </div>
          <div className="widget-content">
            <div className="goals-list">
              <div className="goal-item">
                <div className="goal-label">Nouveaux utilisateurs</div>
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                  <div className="progress-text">75/100</div>
                </div>
              </div>
              <div className="goal-item">
                <div className="goal-label">Chiffre d'affaires</div>
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }}></div>
                  </div>
                  <div className="progress-text">6k/10k €</div>
                </div>
              </div>
              <div className="goal-item">
                <div className="goal-label">Satisfaction client</div>
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '90%' }}></div>
                  </div>
                  <div className="progress-text">4.5/5.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-overview {
          max-width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #6c757d;
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: bold;
          color: #2c3e50;
        }

        .stat-label {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .stat-trend {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .stat-trend.positive {
          background: #d4edda;
          color: #155724;
        }

        .stat-trend.negative {
          background: #f8d7da;
          color: #721c24;
        }

        .dashboard-widgets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .widget {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .widget-header h3 {
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .widget-action {
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .widget-action:hover {
          text-decoration: underline;
        }

        .widget-content {
          padding: 1.5rem;
        }

        .activity-list, .goals-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .activity-title {
          font-weight: 500;
          color: #2c3e50;
        }

        .activity-time {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .goal-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .goal-label {
          font-weight: 500;
          color: #2c3e50;
          min-width: 150px;
        }

        .goal-progress {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.8rem;
          color: #6c757d;
          min-width: 60px;
          text-align: right;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-widgets {
            grid-template-columns: 1fr;
          }

          .goal-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .goal-progress {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

// 🔥 Fonction de récupération de données côté serveur
export async function loadData() {
  console.log('[SSR] 📊 Loading dashboard stats...');
  
  // Simuler des appels API pour récupérer les statistiques
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // En production, ces données viendraient de votre base de données
  const stats = {
    users: 1247,
    products: 89,
    orders: 156,
    revenue: 12450
  };
  
  return { stats };
}

// 🎯 Métadonnées pour le SEO
export const metadata = {
  title: 'Dashboard - NOHR Framework',
  description: 'Vue d\'ensemble du dashboard administrateur',
  keywords: ['dashboard', 'admin', 'statistiques', 'NOHR']
};
