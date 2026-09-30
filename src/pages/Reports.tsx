import React, { useState } from 'react';
import {
  Download, Filter, FileText, Package, TrendingUp, DollarSign,
  BookOpen, FolderOpen, Activity, Clock, ChevronRight, Search,
  Printer, Share2, X, CheckCircle, AlertCircle, Pause,
  Calendar, User, Tag, BarChart2, FilePlus, Eye
} from 'lucide-react';

/* ── TIPOS DE RELATÓRIOS ── */
const reportCategories = [
  {
    id: 'produtos',
    label: 'Relatórios de Produtos',
    icon: Package,
    color: 'var(--primary)',
    bg: 'rgba(18,101,175,0.06)',
    reports: [
      { id: 'p1', name: 'Portfólio Geral de Produtos', desc: 'Todos os produtos cadastrados com seus respectivos status e informações consolidadas.' },
      { id: 'p2', name: 'Produtos em Andamento', desc: 'Relatório com todos os produtos ativos e seu percentual de avanço atual.' },
      { id: 'p3', name: 'Produtos Concluídos', desc: 'Histórico de produtos entregues com datas, responsáveis e indicadores finais.' },
      { id: 'p4', name: 'Produtos Pausados', desc: 'Listagem dos produtos suspensos com justificativas e última atualização registrada.' },
      { id: 'p5', name: 'Ciclo de Vida dos Produtos', desc: 'Evolução temporal de cada produto desde a ideação até a entrega final.' },
      { id: 'p6', name: 'Desempenho do Portfólio', desc: 'Indicadores consolidados de progresso, aderência ao prazo e eficiência de entrega.' },
    ]
  },
  {
    id: 'etapas',
    label: 'Relatórios de Etapas',
    icon: TrendingUp,
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.06)',
    reports: [
      { id: 'e1', name: 'Progresso por Macro Etapa', desc: 'Status atual de cada macro etapa registrada nos produtos do portfólio.' },
      { id: 'e2', name: 'Micro Etapas Pendentes', desc: 'Listagem de todas as micro etapas ainda não concluídas por produto.' },
      { id: 'e3', name: 'Atrasos e Gargalos', desc: 'Etapas com desvio em relação ao prazo planejado, ordenadas por criticidade.' },
      { id: 'e4', name: 'Tempo Médio por Etapa', desc: 'Análise do tempo real gasto em cada etapa comparado ao estimado.' },
      { id: 'e5', name: 'Linha do Tempo dos Produtos', desc: 'Timeline visual consolidada com todas as etapas e marcos dos produtos.' },
    ]
  },
  {
    id: 'financeiro',
    label: 'Relatórios Financeiros',
    icon: DollarSign,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.06)',
    reports: [
      { id: 'f1', name: 'Orçamento Previsto x Aprovado', desc: 'Comparativo entre o orçamento inicialmente previsto e o valor formalmente aprovado.' },
      { id: 'f2', name: 'Custo Previsto x Realizado', desc: 'Análise de desvio financeiro entre o planejamento e a execução real dos produtos.' },
      { id: 'f3', name: 'Horas Previstas x Realizadas', desc: 'Comparativo de esforço estimado versus esforço efetivamente aplicado por produto.' },
      { id: 'f4', name: 'Recursos Aplicados por Produto', desc: 'Distribuição detalhada dos recursos financeiros consumidos por cada produto.' },
      { id: 'f5', name: 'Saldo Disponível do Portfólio', desc: 'Posição financeira atual com indicação de saldo por produto e total consolidado.' },
      { id: 'f6', name: 'Distribuição de Custos por Categoria', desc: 'Alocação de custos segmentada por tipo de produto, equipe e natureza da despesa.' },
    ]
  },
  {
    id: 'aprendizados',
    label: 'Relatórios de Aprendizados',
    icon: BookOpen,
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.06)',
    reports: [
      { id: 'a1', name: 'Aprendizados Registrados', desc: 'Consolidado de todos os aprendizados e lições aprendidas documentados na plataforma.' },
      { id: 'a2', name: 'Conhecimento Reaproveitado', desc: 'Registro de práticas, componentes e decisões reutilizadas de projetos anteriores.' },
      { id: 'a3', name: 'Melhorias Aplicadas', desc: 'Melhorias identificadas em projetos passados e incorporadas nos produtos atuais.' },
    ]
  },
  {
    id: 'evidencias',
    label: 'Relatórios de Evidências',
    icon: FolderOpen,
    color: '#5BA9F0',
    bg: 'rgba(91,169,240,0.08)',
    reports: [
      { id: 'ev1', name: 'Evidências por Produto', desc: 'Listagem de todos os documentos, registros e arquivos vinculados a cada produto.' },
      { id: 'ev2', name: 'Histórico Documental', desc: 'Linha do tempo de documentos inseridos, aprovados e atualizados na plataforma.' },
      { id: 'ev3', name: 'Comprovações e Entregas', desc: 'Relatório de evidências das entregas formais de cada produto e etapa concluída.' },
    ]
  },
  {
    id: 'desempenho',
    label: 'Relatórios de Desempenho',
    icon: Activity,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.06)',
    reports: [
      { id: 'd1', name: 'Desempenho Consolidado do Portfólio', desc: 'Visão executiva com os principais indicadores de desempenho de todos os produtos.' },
      { id: 'd2', name: 'Produtividade por Responsável', desc: 'Análise de horas, entregas e contribuições por profissional alocado nos produtos.' },
      { id: 'd3', name: 'Comparativo Entre Produtos', desc: 'Análise comparativa de indicadores de desempenho entre os produtos do portfólio.' },
      { id: 'd4', name: 'Evolução Geral do Portfólio', desc: 'Avanço percentual acumulado de todos os produtos ao longo do período selecionado.' },
    ]
  },
];

const historyData = [
  { id: 1, name: 'Portfólio Geral de Produtos', category: 'Produtos', date: '27/05/2026', format: 'PDF', user: 'Gestor CIS' },
  { id: 2, name: 'Custo Previsto x Realizado', category: 'Financeiro', date: '26/05/2026', format: 'Excel', user: 'Gestor CIS' },
  { id: 3, name: 'Aprendizados Registrados', category: 'Aprendizados', date: '25/05/2026', format: 'PDF', user: 'Gestor CIS' },
  { id: 4, name: 'Progresso por Macro Etapa', category: 'Etapas', date: '24/05/2026', format: 'CSV', user: 'Gestor CIS' },
  { id: 5, name: 'Evidências por Produto', category: 'Evidências', date: '23/05/2026', format: 'PDF', user: 'Gestor CIS' },
];

const categoryBadgeColor: Record<string, string> = {
  'Produtos': 'badge-info',
  'Financeiro': 'badge-warning',
  'Aprendizados': 'badge-success',
  'Etapas': 'badge-purple',
  'Evidências': 'badge-info',
  'Desempenho': 'badge-danger',
};

/* ── MODAL DE EMISSÃO ── */
const ReportModal = ({ report, onClose }: { report: any, onClose: () => void }) => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [format, setFormat] = useState('PDF');
  const [period, setPeriod] = useState('mai-2026');
  const [product, setProduct] = useState('todos');

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2000);
  };

  const narrative = `O relatório "${report.name}" foi consolidado com base nos dados registrados na plataforma para o período selecionado. Os produtos analisados apresentaram evolução consistente, com destaque para o cumprimento das etapas planejadas e manutenção dos indicadores financeiros dentro dos limites aprovados. Os registros institucionais foram validados e estão disponíveis para exportação e prestação de contas.`;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,23,42,0.5)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <div className="glass-card" style={{ width: '100%', maxWidth: 560, padding: '2rem', borderRadius: 24, boxShadow: '0 32px 80px rgba(18,101,175,0.15)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Emitir Relatório</p>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{report.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.5 }}>{report.desc}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', borderRadius: 8, marginLeft: '1rem', flexShrink: 0 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Período</label>
              <select value={period} onChange={e => setPeriod(e.target.value)} style={{ width: '100%' }}>
                <option value="mai-2026">Maio 2026</option>
                <option value="abr-2026">Abril 2026</option>
                <option value="q2-2026">Q2 2026</option>
                <option value="2026">2026 Completo</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Produto</label>
              <select value={product} onChange={e => setProduct(e.target.value)} style={{ width: '100%' }}>
                <option value="todos">Todos os Produtos</option>
                <option value="portal">Portal do Cidadão V2</option>
                <option value="app">App Gestão Industrial</option>
                <option value="api">API Integração SESI</option>
                <option value="bi">Dashboard BI Institucional</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Formato de Exportação</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['PDF', 'Excel', 'CSV'].map(f => (
                <button key={f} onClick={() => setFormat(f)} style={{ padding: '0.55rem 1.1rem', borderRadius: 10, border: `1.5px solid ${format === f ? 'var(--primary)' : 'rgba(18,101,175,0.1)'}`, background: format === f ? 'rgba(18,101,175,0.06)' : '#FFFFFF', color: format === f ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {generated && (
          <div style={{ padding: '1.25rem', borderRadius: 16, background: 'rgba(18,101,175,0.03)', border: '1px solid rgba(18,101,175,0.08)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={15} color="var(--success)" strokeWidth={2.5} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prévia do Relatório — Gerado pela IA</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.7, fontWeight: 500 }}>{narrative}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button>
          {!generated ? (
            <button onClick={handleGenerate} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={generating}>
              {generating ? (
                <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Gerando...</>
              ) : (
                <><FileText size={15} /> Gerar Relatório</>
              )}
            </button>
          ) : (
            <button className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
              <Download size={15} /> Baixar {format}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── PÁGINA PRINCIPAL ── */
const Reports = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [periodFilter, setPeriodFilter] = useState('mai-2026');
  const [productFilter, setProductFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');

  const allReports = reportCategories.flatMap(cat =>
    cat.reports.map(r => ({ ...r, categoryId: cat.id, categoryLabel: cat.label, color: cat.color, bg: cat.bg }))
  );

  const filteredReports = allReports.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || r.categoryId === activeCategory;
    const matchType = typeFilter === 'todos' || r.categoryId === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div style={{ paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── HEADER ── */}
      <header className="page-header-sticky" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 0 }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Emissão de Relatórios
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Geração e exportação de relatórios institucionais, operacionais e executivos.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.7rem 1.1rem' }}>
            <Printer size={15} /> Imprimir
          </button>
          <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.7rem 1.1rem' }}>
            <Share2 size={15} /> Compartilhar
          </button>
          <button className="btn-primary" style={{ fontSize: '0.8rem' }}>
            <Download size={15} /> Exportação Completa
          </button>
        </div>
      </header>

      {/* ── FILTROS AVANÇADOS ── */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#FFFFFF', borderRadius: 12, padding: '0.55rem 1rem', border: '1px solid rgba(18,101,175,0.1)', flex: '1 1 220px', minWidth: 180, maxWidth: 280 }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            placeholder="Buscar relatório..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'inherit', width: '100%', padding: 0, boxShadow: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700 }}>
          <Filter size={14} />
        </div>

        {[
          { label: 'Período', value: periodFilter, set: setPeriodFilter, options: [['mai-2026','Maio 2026'],['abr-2026','Abril 2026'],['q2-2026','Q2 2026'],['2026','2026 Completo']] },
          { label: 'Produto', value: productFilter, set: setProductFilter, options: [['todos','Todos os Produtos'],['portal','Portal Cidadão V2'],['app','App Gestão Industrial'],['api','API SESI'],['bi','Dashboard BI']] },
          { label: 'Tipo', value: typeFilter, set: setTypeFilter, options: [['todos','Todos os Tipos'],['produtos','Produtos'],['etapas','Etapas'],['financeiro','Financeiro'],['aprendizados','Aprendizados'],['evidencias','Evidências'],['desempenho','Desempenho']] },
        ].map((f, i) => (
          <select key={i} value={f.value} onChange={e => { f.set(e.target.value); if (f.label === 'Tipo') setActiveCategory(e.target.value === 'todos' ? null : e.target.value); }}
            style={{ padding: '0.55rem 0.9rem', borderRadius: 10, border: '1px solid rgba(18,101,175,0.1)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', background: '#FFFFFF', boxShadow: 'none', cursor: 'pointer', width: 'auto' }}>
            {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}

        {(search || activeCategory || typeFilter !== 'todos') && (
          <button onClick={() => { setSearch(''); setActiveCategory(null); setTypeFilter('todos'); setPeriodFilter('mai-2026'); setProductFilter('todos'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: 8 }}>
            <X size={12} /> Limpar
          </button>
        )}
      </div>

      {/* ── CATEGORIAS (nav pills) ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{ padding: '0.5rem 1rem', borderRadius: 10, border: `1.5px solid ${!activeCategory ? 'var(--primary)' : 'rgba(18,101,175,0.1)'}`, background: !activeCategory ? 'rgba(18,101,175,0.06)' : '#FFFFFF', color: !activeCategory ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
          Todos
        </button>
        {reportCategories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            style={{ padding: '0.5rem 1rem', borderRadius: 10, border: `1.5px solid ${activeCategory === cat.id ? cat.color : 'rgba(18,101,175,0.08)'}`, background: activeCategory === cat.id ? cat.bg : '#FFFFFF', color: activeCategory === cat.id ? cat.color : 'var(--text-secondary)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <cat.icon size={13} strokeWidth={2.5} />
            {cat.label.replace('Relatórios de ', '').replace('Relatórios ', '')}
          </button>
        ))}
      </div>

      {/* ── LISTA DE RELATÓRIOS ── */}
      {search || activeCategory ? (
        /* Resultados filtrados */
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {filteredReports.length} relatório{filteredReports.length !== 1 ? 's' : ''} encontrado{filteredReports.length !== 1 ? 's' : ''}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredReports.length > 0 ? filteredReports.map(r => (
              <div key={r.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: 14, background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(18,101,175,0.05)', transition: 'all 0.25s ease', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(18,101,175,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: r.bg, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={17} strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{r.desc}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedReport(r)} className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.55rem 1rem', flexShrink: 0 }}>
                  <FilePlus size={13} /> Emitir
                </button>
              </div>
            )) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <FileText size={32} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Nenhum relatório encontrado para os filtros aplicados.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Grade de categorias */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reportCategories.map(cat => (
            <div key={cat.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <cat.icon size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.1rem' }}>{cat.label}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cat.reports.length} relatórios disponíveis</p>
                  </div>
                </div>
                <button onClick={() => setActiveCategory(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: cat.color, background: cat.bg, border: 'none', padding: '0.45rem 0.9rem', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Ver todos <ChevronRight size={12} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {cat.reports.map(r => (
                  <div key={r.id}
                    style={{ padding: '1rem 1.25rem', borderRadius: 14, background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(18,101,175,0.05)', display: 'flex', flexDirection: 'column', gap: '0.6rem', transition: 'all 0.25s ease', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(18,101,175,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{r.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.desc}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button onClick={() => setSelectedReport({ ...r, color: cat.color, bg: cat.bg })} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: cat.color, background: cat.bg, border: 'none', padding: '0.4rem 0.85rem', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                        <FilePlus size={12} /> Emitir
                      </button>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'transparent', border: 'none', padding: '0.4rem 0.75rem', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <Eye size={12} /> Pré-visualizar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HISTÓRICO ── */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Histórico de Emissões</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Relatórios gerados e exportados recentemente.</p>
          </div>
        </div>
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Relatório</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Formato</th>
              <th>Emitido por</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map(row => (
              <tr key={row.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{row.name}</td>
                <td><span className={`badge ${categoryBadgeColor[row.category] || 'badge-info'}`}>{row.category}</span></td>
                <td style={{ color: 'var(--text-secondary)' }}>{row.date}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{row.format}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{row.user}</td>
                <td>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: 8, border: '1px solid rgba(18,101,175,0.1)', background: 'transparent', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Download size={12} /> Baixar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReport && <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Reports;
