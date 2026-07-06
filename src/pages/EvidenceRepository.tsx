import React, { useState } from 'react';
import {
  Search, Filter, Upload, BookOpen, Lightbulb, AlertTriangle,
  CheckCircle2, Clock, FileText, ArrowUpRight, Brain, Sparkles,
  TrendingUp, Tag, Users, Star, ChevronRight, Zap, Shield,
  FileCheck, Folder, Activity, Hash, Calendar, Package
} from 'lucide-react';

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
  { label: 'Evidências Validadas',    value: '856',   icon: <FileCheck size={18} strokeWidth={1.5} />,  color: 'var(--success)',  bg: 'rgba(34,197,94,0.08)' },
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

  const filtered = mockDocuments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: '4rem' }}>

      {/* ── HEADER ── */}
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Biblioteca Institucional
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Central de conhecimento, evidências e histórico organizacional do CIS/FIEC
          </p>
        </div>
        <button className="btn-primary">
          <Upload size={16} strokeWidth={1.5} />
          Novo Registro
        </button>
      </header>

      {/* ── KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {metrics.map((m, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {m.label}
              </span>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                {m.icon}
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-main)', lineHeight: 1 }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH HERO ── */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(18,101,175,0.04) 0%, rgba(91,169,240,0.02) 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--info-bg)', borderRadius: 999, padding: '0.35rem 1rem', marginBottom: '0.75rem' }}>
            <Brain size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.03em' }}>BUSCA INTELIGENTE</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pesquise por documentos, aprendizados, riscos, decisões ou qualquer produto</p>
        </div>

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <Search size={20} color="var(--primary)" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }} />
          <input
            type="text"
            placeholder="Pesquisar documentos, aprendizados, riscos, decisões ou produtos…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '1rem 1.25rem 1rem 3.25rem',
              borderRadius: 16, fontSize: '0.95rem',
              border: '1.5px solid rgba(18,101,175,0.15)',
              background: '#FFFFFF', boxShadow: '0 4px 20px rgba(18,101,175,0.08)',
              color: 'var(--text-main)',
            }}
          />
          <button style={{
            position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #1265AF, #1B76CA)', color: 'white',
            border: 'none', borderRadius: 10, padding: '0.55rem 1rem',
            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <Zap size={14} /> Buscar
          </button>
        </div>

        {/* Quick filters */}
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {['LGPD', 'Risco', 'Aprendizado', 'Entrega', 'Jurídico', 'Auditoria', 'API', 'Falha'].map(tag => (
            <button key={tag} style={{
              background: 'rgba(18,101,175,0.06)', color: 'var(--primary)',
              border: '1px solid rgba(18,101,175,0.12)', borderRadius: 999,
              padding: '0.3rem 0.85rem', fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(18,101,175,0.06)'; e.currentTarget.style.color = 'var(--primary)'; }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN 2-COLUMN LAYOUT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── LEFT: Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem 1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
              Categorias
            </div>
            {sidebarCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: activeCategory === cat.label ? 'rgba(18,101,175,0.08)' : 'transparent',
                  color: activeCategory === cat.label ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeCategory === cat.label ? 700 : 500,
                  fontSize: '0.85rem', fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { if (activeCategory !== cat.label) e.currentTarget.style.background = 'rgba(18,101,175,0.04)'; }}
                onMouseLeave={e => { if (activeCategory !== cat.label) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>{cat.icon} {cat.label}</span>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700,
                  background: activeCategory === cat.label ? 'rgba(18,101,175,0.12)' : 'rgba(0,0,0,0.04)',
                  color: activeCategory === cat.label ? 'var(--primary)' : 'var(--text-muted)',
                  padding: '0.15rem 0.5rem', borderRadius: 999,
                }}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTER: Cards ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Registros Recentes
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {filtered.length} itens
              </span>
            </h2>
            <button className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}>
              <Filter size={14} /> Filtros
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(doc => {
              const cs = catStyle[doc.category] || { color: 'var(--primary)', bg: 'rgba(18,101,175,0.1)' };
              return (
                <div key={doc.id}
                  className="glass-card"
                  style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', borderRadius: 20 }}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{
                        background: cs.bg, color: cs.color,
                        padding: '0.25rem 0.75rem', borderRadius: 999,
                        fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.03em',
                      }}>
                        {doc.category.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontWeight: 600 }}>{doc.type} · {doc.size}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-faint)', fontSize: '0.75rem' }}>
                      <Star size={13} strokeWidth={1.5} />
                      <span>{doc.views} acessos</span>
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
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '0.9rem', borderTop: '1px solid rgba(18,101,175,0.05)',
                  }}>
                    <div style={{ display: 'flex', gap: '1.25rem' }}>
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
                    <button style={{
                      background: 'none', border: '1px solid rgba(18,101,175,0.12)',
                      borderRadius: 8, color: 'var(--primary)', cursor: 'pointer',
                      padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--primary)'; }}
                    >
                      Abrir <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EvidenceRepository;
