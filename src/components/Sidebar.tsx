import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  BookOpen,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  PenTool,
  PieChart,
  CircleDollarSign,
  LogOut
} from 'lucide-react';

const menuItems = [
  { 
    label: 'Dashboards', 
    icon: LayoutDashboard,
    subItems: [
      { label: 'Visão Gerencial', path: '/', icon: PieChart },
      { label: 'Visão Financeira', path: '/dashboard-financeiro', icon: CircleDollarSign },
    ]
  },
  { label: 'Portfólio',           path: '/produtos',    icon: Package },
  { label: 'Evolução',            path: '/evolucao',    icon: TrendingUp },
  { label: 'Biblioteca',          path: '/evidencias',  icon: BookOpen },
  { label: 'Apoio à escrita',     path: '/apoio-escrita', icon: PenTool },
];

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isDashboardsOpen, setIsDashboardsOpen] = useState(true);
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src="/logo_sesi.png"
            alt="Centro de Inovação SESI"
            style={{ width: '100%', maxWidth: '160px', height: 'auto', objectFit: 'contain' }}
          />
        </div>
        <div style={{
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--text-main)',
        }}>
          Plataforma de Gestão
        </div>
      </div>

      {/* Section label */}
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        paddingLeft: '0.85rem',
        marginBottom: '0.5rem',
      }}>
        Menu Principal
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto' }} className="custom-scrollbar">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          
          if (item.subItems) {
            const isAnyChildActive = item.subItems.some(sub => 
              sub.path === '/' ? location.pathname === '/' : location.pathname.startsWith(sub.path)
            );

            return (
              <div key={idx} style={{ marginBottom: '0.2rem' }}>
                <div 
                  className={`nav-item ${isAnyChildActive && !isDashboardsOpen ? 'active' : ''}`} 
                  onClick={() => setIsDashboardsOpen(!isDashboardsOpen)}
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: isDashboardsOpen ? 'rgba(18, 101, 175, 0.02)' : 'transparent',
                    color: isDashboardsOpen || isAnyChildActive ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <Icon size={18} />
                    <span style={{ flex: 1, fontWeight: isDashboardsOpen || isAnyChildActive ? 700 : 600 }}>{item.label}</span>
                  </div>
                  {isDashboardsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                
                {isDashboardsOpen && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.15rem', 
                    marginLeft: '1.25rem', 
                    marginTop: '0.25rem',
                    paddingLeft: '0.5rem',
                    borderLeft: '1px solid var(--border-subtle)'
                  }}>
                    {item.subItems.map(sub => (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        end={sub.path === '/'}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        style={{ padding: '0.65rem 0.85rem', fontSize: '0.82rem' }}
                      >
                        <sub.icon size={16} />
                        <span style={{ flex: 1 }}>{sub.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem',
        marginTop: '1rem'
      }}>
        {[
          { label: 'Configurações', icon: Settings },
          { label: 'Suporte',       icon: HelpCircle },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="nav-item"
            style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
          >
            <Icon size={18} />
            <span style={{ flex: 1 }}>{label}</span>
          </button>
        ))}

        {/* User profile pill */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          borderRadius: 12,
          background: 'rgba(247,250,253,0.5)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#FFFFFF';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(18,101,175,0.04)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(247,250,253,0.5)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0,
            boxShadow: '0 2px 6px rgba(18,101,175,0.2)'
          }}>
            GS
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Gestor CIS
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrador</div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            title="Sair"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              padding: '0.25rem',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#e11d48'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
