import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchAutocomplete from '../components/SearchAutocomplete';
import {
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
  Cpu,
  Filter
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
  const [selectedResponsavel, setSelectedResponsavel] = useState('Todos');
  const [selectedProduto, setSelectedProduto] = useState('Todos');
  const [selectedEtapa, setSelectedEtapa] = useState('Todas');
  const [isAdding, setIsAdding]         = useState(false);
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('list');
  const [newProduct, setNewProduct] = useState({
    name: '', lead: '', category: 'Software', deadline: '',
    productId: '',
    productCR: '',
    description: '',
    dorResolve: '',
    proposta: '',
    cliente: '',
    beneficios: '',
    custos: '',
    metodologia: '',
    escalabilidade: '',
    canalVendas: '',
    estrategiaMercado: '',
    transferenciatec: '',
  });

  const fieldStyle = {
    padding: '0.6rem 0.9rem',
    borderRadius: 10,
    border: '1px solid rgba(18,101,175,0.14)',
    fontSize: '0.82rem',
    color: 'var(--text-main)',
    background: '#fff',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    marginBottom: '0.3rem',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  const filteredProducts = productsList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchResponsavel = selectedResponsavel === 'Todos' || p.lead === selectedResponsavel;
    const matchProduto = selectedProduto === 'Todos' || p.name === selectedProduto;
    const matchEtapa = selectedEtapa === 'Todas' || p.stage === selectedEtapa;
    return matchSearch && matchResponsavel && matchProduto && matchEtapa;
  });

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
    setNewProduct({ name: '', lead: '', category: 'Software', deadline: '', productId: '', productCR: '', description: '', dorResolve: '', proposta: '', cliente: '', beneficios: '', custos: '', metodologia: '', escalabilidade: '', canalVendas: '', estrategiaMercado: '', transferenciatec: '' });
  };

  return (
    <div style={{ position: 'relative', paddingBottom: '4rem' }}>

      {/* ── HEADER ── */}
      <header className="page-header-sticky" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Portfólio de Produtos
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Visão consolidada das soluções e sistemas em andamento.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{
            display: 'flex', gap: 0,
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.6)',
            borderRadius: 999, overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(18,101,175,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
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

      {/* ── SEARCH + FILTERS ── */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <SearchAutocomplete
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar produtos..."
          suggestions={productsList.map(p => p.name)}
          containerStyle={{ flex: 1, minWidth: 220 }}
          inputStyle={{ width: '100%' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, height: 'var(--btn-height)' }}>
          <Filter size={15} strokeWidth={1.5} /> Filtros
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Responsável</label>
          <select className="filter-pill" value={selectedResponsavel} onChange={e => setSelectedResponsavel(e.target.value)}>
            <option value="Todos">Todos</option>
            {Array.from(new Set(productsList.map(p => p.lead))).map(lead => (
              <option key={lead} value={lead}>{lead}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Produto</label>
          <select className="filter-pill" value={selectedProduto} onChange={e => setSelectedProduto(e.target.value)}>
            <option value="Todos">Todos os Produtos</option>
            {productsList.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Etapa</label>
          <select className="filter-pill" value={selectedEtapa} onChange={e => setSelectedEtapa(e.target.value)}>
            <option value="Todas">Todas</option>
            {Object.keys(stageConfig).map(stage => <option key={stage} value={stage}>{stage}</option>)}
          </select>
        </div>
      </div>

      {/* ── ADD PRODUCT MODAL ── */}
      {isAdding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,23,42,0.45)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setIsAdding(false)}>
          <div className="glass-card" style={{ width: 760, maxWidth: '100%', maxHeight: '90vh', padding: '2rem', borderRadius: 24, boxShadow: '0 32px 80px rgba(18,101,175,0.18)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(18,101,175,0.08)' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.15rem' }}>Novo Produto</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Preencha as informações essenciais para estruturar o produto</p>
              </div>
              <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Bloco 1: Identificação */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={13} strokeWidth={2.5} /> Identificação do Produto
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Nome do Produto *</label>
                    <input required placeholder="Ex: Portal de Inteligência V3" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={fieldStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Responsável (Lead) *</label>
                    <select required value={newProduct.lead} onChange={e => setNewProduct({...newProduct, lead: e.target.value})} style={fieldStyle}>
                      <option value="">Selecionar responsável...</option>
                      <option value="Ana Silva">Ana Silva (Gestora Responsável)</option>
                      <option value="Bruno Costa">Bruno Costa (Product Owner)</option>
                      <option value="Carla Dias">Carla Dias (Scrum Master)</option>
                      <option value="Diego Souza">Diego Souza (Desenvolvedor Frontend)</option>
                      <option value="Larissa Gomes">Larissa Gomes (Desenvolvedor Backend)</option>
                      <option value="Marcos Oliveira">Marcos Oliveira (Analista de QA)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>ID do Produto</label>
                    <input placeholder="Ex: CIS-2026-001" value={newProduct.productId} onChange={e => setNewProduct({...newProduct, productId: e.target.value})} style={fieldStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>CR (Código de Referência)</label>
                    <input placeholder="Ex: CR-0042" value={newProduct.productCR} onChange={e => setNewProduct({...newProduct, productCR: e.target.value})} style={fieldStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Categoria</label>
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={fieldStyle}>
                      <option>Software</option>
                      <option>Mobile</option>
                      <option>Backend</option>
                      <option>Analytics</option>
                      <option>Hardware</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Prazo Estimado</label>
                    <input type="date" value={newProduct.deadline} onChange={e => setNewProduct({...newProduct, deadline: e.target.value})} style={fieldStyle} />
                  </div>
                </div>
              </div>

              {/* Bloco 2: Visão do Produto */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={13} strokeWidth={2.5} /> Visão e Estratégia
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>1. O que o produto entrega? (Visão)</label>
                    <textarea placeholder="Descreva o que o produto entrega de valor ao mercado..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>2. Qual dor o produto resolve?</label>
                      <textarea placeholder="Problema central que o produto soluciona..." value={newProduct.dorResolve} onChange={e => setNewProduct({...newProduct, dorResolve: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                    </div>
                    <div>
                      <label style={labelStyle}>3. Estratégia ou Proposta de Valor</label>
                      <textarea placeholder="Como o produto se diferencia e gera valor..." value={newProduct.proposta} onChange={e => setNewProduct({...newProduct, proposta: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                    </div>
                    <div>
                      <label style={labelStyle}>4. Defina o cliente deste produto</label>
                      <textarea placeholder="Perfil do cliente-alvo, segmento, setor..." value={newProduct.cliente} onChange={e => setNewProduct({...newProduct, cliente: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                    </div>
                    <div>
                      <label style={labelStyle}>5. Quais os benefícios?</label>
                      <textarea placeholder="Principais benefícios e impactos gerados..." value={newProduct.beneficios} onChange={e => setNewProduct({...newProduct, beneficios: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco 3: Execução e Mercado */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={13} strokeWidth={2.5} /> Execução e Mercado
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>6. Composição de Custos</label>
                    <textarea placeholder="Estrutura de custos: desenvolvimento, operacional, licenças..." value={newProduct.custos} onChange={e => setNewProduct({...newProduct, custos: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                  </div>
                  <div>
                    <label style={labelStyle}>7. Metodologia Aplicada</label>
                    <textarea placeholder="Ex: Scrum, Kanban, Design Thinking, Lean..." value={newProduct.metodologia} onChange={e => setNewProduct({...newProduct, metodologia: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                  </div>
                  <div>
                    <label style={labelStyle}>8. Escalabilidade do Produto</label>
                    <textarea placeholder="Como o produto escala: regioes, usuarios, modulos..." value={newProduct.escalabilidade} onChange={e => setNewProduct({...newProduct, escalabilidade: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                  </div>
                  <div>
                    <label style={labelStyle}>9. Canal de Vendas</label>
                    <textarea placeholder="Canais de distribuição e comercialização do produto..." value={newProduct.canalVendas} onChange={e => setNewProduct({...newProduct, canalVendas: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                  </div>
                  <div>
                    <label style={labelStyle}>10. Estratégia de Penetração de Mercado</label>
                    <textarea placeholder="Como o produto entrará e conquistará o mercado..." value={newProduct.estrategiaMercado} onChange={e => setNewProduct({...newProduct, estrategiaMercado: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                  </div>
                  <div>
                    <label style={labelStyle}>11. Transferência de Tecnologia</label>
                    <textarea placeholder="Prevê transferência? Para quem? Condições?" value={newProduct.transferenciatec} onChange={e => setNewProduct({...newProduct, transferenciatec: e.target.value})} style={{...fieldStyle, minHeight: 60}} />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(18,101,175,0.08)' }}>
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
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
              >
                {/* Decorative fluid blob, purely for UI polish */}
                <div aria-hidden="true" style={{
                  position: 'absolute', top: '-30%', right: '-20%', width: 180, height: 150,
                  borderRadius: '60% 40% 34% 66% / 56% 34% 66% 44%',
                  background: 'radial-gradient(circle at 32% 30%, #9CC7F5 0%, #1265AF 75%)',
                  opacity: 0.1, filter: 'blur(1px)', pointerEvents: 'none', zIndex: -1,
                }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(18,101,175,0.12), rgba(91,169,240,0.06))',
                    border: '1px solid rgba(18,101,175,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                  }}>
                    {cat.icon}
                  </div>
                  <span className={`badge ${stage.badgeClass}`} style={{ borderRadius: 999 }}>
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
                  <div style={{ width: '100%', height: 7, background: 'rgba(18,101,175,0.1)', borderRadius: 999, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(18,101,175,0.08)' }}>
                    <div style={{ width: `${Math.max(product.progress, 3)}%`, height: '100%', background: progColor, borderRadius: 999, transition: 'width 0.6s ease' }} />
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
          <div style={{ overflowX: 'auto' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Responsável</th>
                <th>Etapa</th>
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
                          {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 16 })}
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
                    <td><span className={`badge ${stage.badgeClass}`} style={{ borderRadius: 999 }}>{product.stage}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 80, height: 6, background: 'rgba(18,101,175,0.1)', borderRadius: 999, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(18,101,175,0.08)' }}>
                          <div style={{ width: `${Math.max(product.progress, 4)}%`, height: '100%', background: progColor, borderRadius: 999 }} />
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
          {filteredProducts.length > 0 && (
            <div style={{ padding: '0.85rem 1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductBoard;
