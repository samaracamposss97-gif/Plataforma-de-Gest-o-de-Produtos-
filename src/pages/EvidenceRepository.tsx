import React, { useState } from 'react';
import {
  Filter, Upload, BookOpen, Lightbulb, AlertTriangle,
  CheckCircle2, Clock, FileText, ArrowUpRight, Brain, Sparkles,
  TrendingUp, Tag, Users, Star, ChevronRight, Shield,
  FileCheck, Folder, Activity, Hash, Calendar, Package, X, Download
} from 'lucide-react';
import SearchAutocomplete from '../components/SearchAutocomplete';

/* ── DATA ── */
const mockDocuments = [
  {
    id: '1',
    name: 'Arquitetura do Portal V2',
    summary: 'Diagrama e especificação técnica completa da nova arquitetura em microsserviços.',
    type: 'PDF', category: 'Documentação',
    product: 'Portal do Cidadão V2', author: 'Ana Silva',
    date: '27-05-2026', size: '2.4 MB',
    tags: ['Arquitetura', 'API', 'Backend'],
    views: 47,
  },
  {
    id: '2',
    name: 'Evidências de Teste QA',
    summary: 'Registros completos dos testes de carga e unitários realizados no sprint 4.',
    type: 'DOCX', category: 'Evidência',
    product: 'API Integração SESI', author: 'Carlos Mendes',
    date: '26-05-2026', size: '1.1 MB',
    tags: ['QA', 'Testes', 'Sprint 4'],
    views: 31,
  },
  {
    id: '3',
    name: 'Lições Aprendidas — Fase 1',
    summary: 'Consolidação dos aprendizados organizacionais da primeira fase de entrega.',
    type: 'XLSX', category: 'Aprendizado',
    product: 'Sistema de Matrícula', author: 'Fernanda Lima',
    date: '25-05-2026', size: '450 KB',
    tags: ['Aprendizado', 'Entrega', 'Retrospectiva'],
    views: 62,
  },
  {
    id: '4',
    name: 'Matriz de Riscos Atualizada',
    summary: 'Levantamento atualizado de riscos técnicos e operacionais com plano de mitigação.',
    type: 'PDF', category: 'Risco',
    product: 'Dashboard BI Institucional', author: 'Diego Souza',
    date: '22-05-2026', size: '1.8 MB',
    tags: ['Risco', 'Governança', 'BI'],
    views: 28,
  },
  {
    id: '5',
    name: 'Aprovação Jurídica do Contrato',
    summary: 'Documento de aprovação formal emitido pelo jurídico para início da fase de testes.',
    type: 'MSG', category: 'Aprovação',
    product: 'App Gestão Industrial', author: 'Bruno Costa',
    date: '20-05-2026', size: '120 KB',
    tags: ['Jurídico', 'Aprovação', 'Contrato'],
    views: 15,
  },
  {
    id: '6',
    name: 'Relatório de Conformidade LGPD',
    summary: 'Auditoria de fluxos de dados pessoais e adequação à LGPD em todos os módulos.',
    type: 'PDF', category: 'LGPD',
    product: 'Portal do Cidadão V2', author: 'Ana Silva',
    date: '18-05-2026', size: '3.2 MB',
    tags: ['LGPD', 'Privacidade', 'Auditoria'],
    views: 88,
  },
];

const timeline = [
  { when: 'Hoje', events: [
    { icon: <FileCheck size={14} />, text: 'QA anexou evidência de testes — API SESI', time: '14:32', color: 'var(--success)' },
    { icon: <Lightbulb size={14} />, text: 'Novo aprendizado registrado — Portal V2', time: '11:08', color: 'var(--warning)' },
  ]},
  { when: 'Ontem', events: [
    { icon: <Shield size={14} />, text: 'Jurídico aprovou contrato — App Industrial', time: '16:45', color: 'var(--primary)' },
    { icon: <AlertTriangle size={14} />, text: 'Novo risco identificado — Dashboard BI', time: '09:20', color: 'var(--danger)' },
  ]},
  { when: '25/05', events: [
    { icon: <BookOpen size={14} />, text: 'Consolidação de lições — Matrícula', time: '15:00', color: 'var(--purple, #8B5CF6)' },
  ]},
];

const topProducts = [
  { name: 'Portal do Cidadão V2', count: 148, color: 'var(--primary)' },
  { name: 'Dashboard BI Institucional', count: 97, color: '#8B5CF6' },
  { name: 'API Integração SESI', count: 84, color: 'var(--success)' },
  { name: 'Sistema de Matrícula', count: 71, color: 'var(--warning)' },
];

const aiInsights = [
  { icon: <TrendingUp size={16} />, label: 'Padrão detectado', text: 'Riscos de integração de API se repetem em 3 projetos — revisar arquitetura padrão.', type: 'warning' },
  { icon: <Sparkles size={16} />, label: 'Aprendizado reutilizável', text: '"Lições Aprendidas — Fase 1" pode ser aproveitada no App Gestão Industrial.', type: 'info' },
  { icon: <Brain size={16} />, label: 'Conteúdo relacionado', text: 'Relatório LGPD e Aprovação Jurídica pertencem ao mesmo fluxo de conformidade.', type: 'purple' },
];

const sidebarCategories = [
  { icon: <Clock size={15} />,      label: 'Recentes',     count: 12 },
  { icon: <FileCheck size={15} />,  label: 'Evidências',   count: 856 },
  { icon: <Lightbulb size={15} />,  label: 'Aprendizados', count: 124 },
  { icon: <AlertTriangle size={15} />, label: 'Riscos',    count: 45 },
  { icon: <BookOpen size={15} />,   label: 'Decisões',     count: 23 },
  { icon: <AlertTriangle size={15} />, label: 'Dificuldade', count: 5 },
  { icon: <Lightbulb size={15} />,  label: 'Observações',  count: 11 },
  { icon: <Folder size={15} />,     label: 'Pendências',   count: 7 },
];

const metrics = [
  { label: 'Total de Documentos',     value: '1.248', icon: <Folder size={18} strokeWidth={1.5} />,    color: 'var(--primary)',  bg: 'rgba(18,101,175,0.08)' },
  { label: 'Aprendizados Registrados',value: '124',   icon: <Lightbulb size={18} strokeWidth={1.5} />,  color: '#F59E0B',        bg: 'rgba(245,158,11,0.08)' },
  { label: 'Riscos Mitigados',        value: '45',    icon: <AlertTriangle size={18} strokeWidth={1.5} />, color: 'var(--danger)', bg: 'rgba(239,68,68,0.08)' },
];

const catStyle: Record<string, { color: string; bg: string }> = {
  Documentação: { color: 'var(--primary)',  bg: 'rgba(18,101,175,0.1)' },
  Evidência:    { color: 'var(--success)',  bg: 'rgba(34,197,94,0.1)' },
  Aprendizado:  { color: '#F59E0B',        bg: 'rgba(245,158,11,0.1)' },
  Risco:        { color: 'var(--danger)',   bg: 'rgba(239,68,68,0.1)' },
  Aprovação:    { color: '#8B5CF6',        bg: 'rgba(139,92,246,0.1)' },
  LGPD:         { color: 'var(--primary)',  bg: 'rgba(18,101,175,0.1)' },
};

/* ── COMPONENT ── */
const EvidenceRepository = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Recentes');
  const [selectedProduct, setSelectedProduct] = useState('Todos');
  const [selectedDoc, setSelectedDoc] = useState<typeof mockDocuments[number] | null>(null);

  const productsList = ['Todos', 'Portal do Cidadão V2', 'API Integração SESI', 'Sistema de Matrícula', 'Dashboard BI Institucional', 'App Gestão Industrial'];

  const filtered = mockDocuments.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchProduct = selectedProduct === 'Todos' || d.product === selectedProduct;
    const matchCategory = activeCategory === 'Recentes' || d.category.toLowerCase() === activeCategory.toLowerCase();

    return matchSearch && matchProduct && matchCategory;
  });

  return (
    <div style={{ paddingBottom: '4rem' }}>

      {/* ── HEADER ── */}
      <header className="page-header-sticky" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Biblioteca Institucional
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Central de conhecimento, evidências e histórico organizacional do CIS/FIEC
          </p>
        </div>
      </header>

      {/* ── KPIs ── */}
      <div className="grid-auto-3" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        {metrics.map((m, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden="true" style={{
              position: 'absolute', top: '-35%', right: '-25%', width: 150, height: 130,
              borderRadius: '60% 40% 34% 66% / 56% 34% 66% 44%',
              background: `radial-gradient(circle at 32% 30%, ${m.color} 0%, var(--primary-dark) 75%)`,
              opacity: 0.1, filter: 'blur(1px)', pointerEvents: 'none', zIndex: -1
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {m.label}
              </span>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                {m.icon}
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-main)', lineHeight: 1, position: 'relative' }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <SearchAutocomplete
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar documentos, aprendizados, riscos, decisões ou produtos…"
          suggestions={Array.from(new Set(mockDocuments.flatMap(d => [d.name, d.product, ...d.tags])))}
          containerStyle={{ flex: 1, minWidth: 220 }}
          inputStyle={{ width: '100%' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, height: 'var(--btn-height)' }}>
          <Filter size={15} strokeWidth={1.5} /> Filtros
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Produtos</label>
          <select className="filter-pill" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            {productsList.map(p => (
              <option key={p} value={p}>{p === 'Todos' ? 'Todos os Produtos' : p}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Categorias</label>
          <select className="filter-pill" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
            {sidebarCategories.map(cat => (
              <option key={cat.label} value={cat.label}>{cat.label} ({cat.count})</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── DOCUMENT LIST ── */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-main)', margin: '0 0 1.5rem 0' }}>
          Registros
          <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {filtered.length} itens
          </span>
        </h2>

        <div className="grid-auto-3" style={{ gap: '1.25rem' }}>
          {filtered.map(doc => {
            const cs = catStyle[doc.category] || { color: 'var(--primary)', bg: 'rgba(18,101,175,0.1)' };
            return (
              <div key={doc.id}
                className="glass-card"
                style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', borderRadius: 20, display: 'flex', flexDirection: 'column' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(18,101,175,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(18,101,175,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(18,101,175,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(18,101,175,0.05)';
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: cs.bg, color: cs.color,
                      padding: '0.2rem 0.65rem', borderRadius: 999,
                      fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.03em',
                    }}>
                      {doc.category.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontWeight: 600 }}>{doc.type} · {doc.size}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-faint)', fontSize: '0.75rem' }}>
                    <Star size={13} strokeWidth={1.5} />
                    <span>{doc.views}</span>
                  </div>
                </div>

                {/* Card Body */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>
                  {doc.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {doc.summary}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {doc.tags.map(tag => (
                    <span key={tag} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                      background: 'rgba(18,101,175,0.06)', color: 'var(--primary)',
                      borderRadius: 999, padding: '0.2rem 0.6rem',
                      fontSize: '0.72rem', fontWeight: 600,
                      border: '1px solid rgba(18,101,175,0.08)',
                    }}>
                      <Hash size={10} /> {tag}
                    </span>
                  ))}
                </div>

                {/* Card Footer */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '0.5rem',
                  paddingTop: '0.9rem', borderTop: '1px solid rgba(18,101,175,0.05)',
                  marginTop: 'auto',
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      <Package size={13} strokeWidth={1.5} />
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{doc.product}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      <Users size={13} strokeWidth={1.5} />
                      <span>{doc.author}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      <Calendar size={13} strokeWidth={1.5} />
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <button
                    className="btn-secondary"
                    style={{ alignSelf: 'flex-start', height: 'auto', padding: '0.4rem 0.9rem', fontSize: '0.75rem' }}
                    onClick={e => { e.stopPropagation(); setSelectedDoc(doc); }}
                  >
                    Abrir <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RECORD DETAILS MODAL ── */}
      {selectedDoc && (() => {
        const cs = catStyle[selectedDoc.category] || { color: 'var(--primary)', bg: 'rgba(18,101,175,0.1)' };
        return (
          <div className="modal-backdrop" onClick={() => setSelectedDoc(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    background: cs.bg, color: cs.color,
                    padding: '0.2rem 0.65rem', borderRadius: 999,
                    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.03em',
                  }}>
                    {selectedDoc.category.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600 }}>{selectedDoc.type} · {selectedDoc.size}</span>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="btn-icon btn-icon-glass btn-icon-danger"
                  title="Fechar"
                >
                  <X size={16} />
                </button>
              </div>

              <h3 style={{ margin: '0 0 0.6rem', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                {selectedDoc.name}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                {selectedDoc.summary}
              </p>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {selectedDoc.tags.map(tag => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                    background: 'rgba(18,101,175,0.06)', color: 'var(--primary)',
                    borderRadius: 999, padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem', fontWeight: 600,
                    border: '1px solid rgba(18,101,175,0.08)',
                  }}>
                    <Hash size={11} /> {tag}
                  </span>
                ))}
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem',
                padding: '1rem 1.1rem', borderRadius: 14, background: 'rgba(18,101,175,0.03)',
                border: '1px solid rgba(18,101,175,0.06)', marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <Package size={14} strokeWidth={1.5} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedDoc.product}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <Users size={14} strokeWidth={1.5} color="var(--text-muted)" />
                  <span>{selectedDoc.author}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} strokeWidth={1.5} color="var(--text-muted)" />
                  <span>{selectedDoc.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <Star size={14} strokeWidth={1.5} color="var(--text-muted)" />
                  <span>{selectedDoc.views} visualizações</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button className="btn-secondary" onClick={() => setSelectedDoc(null)}>Fechar</button>
                <button className="btn-primary">
                  <Download size={16} /> Baixar Arquivo
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default EvidenceRepository;
