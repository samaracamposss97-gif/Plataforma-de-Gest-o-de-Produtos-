import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Package,
  X,
  User,
  Calendar,
  Tag,
  ChevronRight,
  Clock,
  TrendingUp,
  LayoutGrid,
  List,
  Code,
  Smartphone,
  Server,
  LineChart,
  Cpu
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  stage: string;
  lead: string;
  deadline: string;
  progress: number;
  category: string;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Portal do Cidadão V2',      stage: 'Desenvolvimento', lead: 'Ana Silva',     deadline: '20-06-2026', progress: 65, category: 'Software'  },
  { id: 2, name: 'App Gestão Industrial',      stage: 'Ideação',         lead: 'Bruno Costa',   deadline: '15-08-2026', progress: 10, category: 'Mobile'    },
  { id: 3, name: 'API Integração SESI',        stage: 'Entrega',         lead: 'Carla Dias',    deadline: '01-06-2026', progress: 90, category: 'Backend'   },
  { id: 4, name: 'Dashboard BI Institucional', stage: 'Planejamento',    lead: 'Diego Souza',   deadline: '30-07-2026', progress: 30, category: 'Analytics' },
];

/* ── helpers ── */
const stageConfig: Record<string, { badgeClass: string }> = {
  'Ideação':         { badgeClass: 'badge-purple' },
  'Planejamento':    { badgeClass: 'badge-warning' },
  'Desenvolvimento': { badgeClass: 'badge-info' },
  'Entrega':         { badgeClass: 'badge-success' },
};

const categoryConfig: Record<string, { icon: React.ReactNode }> = {
  'Software':  { icon: <Code size={20} /> },
  'Mobile':    { icon: <Smartphone size={20} /> },
  'Backend':   { icon: <Server size={20} /> },
  'Analytics': { icon: <LineChart size={20} /> },
  'Hardware':  { icon: <Cpu size={20} /> },
};

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

const getProgressColor = (p: number) => {
  if (p >= 80) return 'var(--success)';
  if (p >= 50) return 'var(--primary)';
  if (p >= 25) return 'var(--warning)';
  return 'var(--danger)';
};

const ProductBoard = () => {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm]     = useState('');
  const [isAdding, setIsAdding]         = useState(false);
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid');
  const [newProduct, setNewProduct]     = useState({
    name: '', lead: '', category: 'Software', deadline: '',
  });

  const filteredProducts = productsList.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.lead) return;

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      stage: 'Ideação',
      lead: newProduct.lead,
      deadline: newProduct.deadline || 'A definir',
      progress: 0,
      category: newProduct.category,
    };

    setProductsList([product, ...productsList]);
    setIsAdding(false);
    setNewProduct({ name: '', lead: '', category: 'Software', deadline: '' });
  };

  return (
    <div style={{ position: 'relative', paddingBottom: '4rem' }}>

      {/* ── HEADER ── */}
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Portfólio de Produtos
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Visão consolidada das soluções e sistemas em andamento.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: '#FFFFFF', borderRadius: 12, padding: '0.6rem 1.1rem',
            border: '1px solid rgba(18,101,175,0.1)', boxShadow: '0 2px 8px rgba(18,101,175,0.04)',
          }}>
            <Search size={16} color="var(--text-muted)" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', width: 200, fontSize: '0.875rem', fontFamily: 'inherit' }}
            />
          </div>

          {/* View toggle */}
          <div style={{
            display: 'flex', gap: 0,
            background: '#FFFFFF', border: '1px solid rgba(18,101,175,0.1)',
            borderRadius: 10, overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(18,101,175,0.04)',
          }}>
            {(['grid', 'list'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '0.55rem 0.8rem', border: 'none', cursor: 'pointer',
                  background: viewMode === mode ? 'rgba(18,101,175,0.08)' : 'transparent',
                  color: viewMode === mode ? 'var(--primary)' : 'var(--text-muted)',
                  borderRight: mode === 'grid' ? '1px solid rgba(18,101,175,0.08)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {mode === 'grid' ? <LayoutGrid size={16} strokeWidth={1.5} /> : <List size={16} strokeWidth={1.5} />}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={() => setIsAdding(true)}>
            <Plus size={16} strokeWidth={2} /> Novo Produto
          </button>
        </div>
      </header>

      {/* ── ADD PRODUCT MODAL ── */}
      {isAdding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,23,42,0.45)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsAdding(false)}>
          <div className="glass-card" style={{ width: 500, padding: '2.5rem', borderRadius: 24, boxShadow: '0 32px 80px rgba(18,101,175,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Novo Produto</h2>
              <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nome do Produto</label>
                <input required placeholder="Ex: Portal de Inteligência V3" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Responsável (Lead)</label>
                <input required placeholder="Nome do gestor do produto" value={newProduct.lead} onChange={e => setNewProduct({...newProduct, lead: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Categoria</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    <option>Software</option>
                    <option>Mobile</option>
                    <option>Backend</option>
                    <option>Analytics</option>
                    <option>Hardware</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Prazo Estimado</label>
                  <input type="date" value={newProduct.deadline} onChange={e => setNewProduct({...newProduct, deadline: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredProducts.length > 0 ? filteredProducts.map(product => {
            const stage = stageConfig[product.stage] || stageConfig['Ideação'];
            const cat   = categoryConfig[product.category] || categoryConfig['Software'];
            const progColor = getProgressColor(product.progress);

            return (
              <div
                key={product.id}
                className="glass-card"
                onClick={() => navigate(`/produtos/${product.id}`)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: 'rgba(18,101,175,0.08)', border: '1px solid rgba(18,101,175,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                  }}>
                    {cat.icon}
                  </div>
                  <span className={`badge ${stage.badgeClass}`}>
                    {product.stage}
                  </span>
                </div>

                {/* Category & Name */}
                <div style={{ marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {product.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  {product.name}
                </h3>

                {/* Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: 'linear-gradient(135deg, rgba(18,101,175,0.12), rgba(91,169,240,0.08))',
                      border: '1px solid rgba(18,101,175,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)',
                      flexShrink: 0,
                    }}>
                      {getInitials(product.lead)}
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{product.lead}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)' }}>
                    <Clock size={14} strokeWidth={1.5} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{product.deadline}</span>
                  </div>
                </div>

                {/* Progress */}
                <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(18,101,175,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Progresso</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: progColor }}>{product.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: 5, background: 'rgba(18,101,175,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${product.progress}%`, height: '100%', background: progColor, borderRadius: 999, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>
            );
          }) : (
            <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Package size={40} strokeWidth={1} style={{ opacity: 0.4, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
              <p style={{ fontWeight: 500 }}>Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Responsável</th>
                <th>Estágio</th>
                <th>Progresso</th>
                <th>Prazo</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? filteredProducts.map(product => {
                const stage = stageConfig[product.stage] || stageConfig['Ideação'];
                const cat   = categoryConfig[product.category] || categoryConfig['Software'];
                const progColor = getProgressColor(product.progress);

                return (
                  <tr key={product.id} onClick={() => navigate(`/produtos/${product.id}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid var(--border-subtle)' }}>
                          {React.cloneElement(cat.icon as React.ReactElement<{ size?: number }>, { size: 16 })}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-app)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {getInitials(product.lead)}
                        </div>
                        <span style={{ color: 'var(--text-secondary)' }}>{product.lead}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${stage.badgeClass}`}>{product.stage}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 80, height: 4, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ width: `${product.progress}%`, height: '100%', background: progColor, borderRadius: 999 }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{product.progress}%</span>
                      </div>
                    </td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}><Clock size={14} /> {product.deadline}</div></td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductBoard;
