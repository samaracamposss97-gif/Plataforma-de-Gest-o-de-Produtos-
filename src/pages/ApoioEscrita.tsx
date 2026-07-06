import React, { useState } from 'react';
import {
  FileText, Search, Download, ChevronRight, FolderOpen,
  Plus, Trash2, Check, X, PenTool
} from 'lucide-react';

interface Template { id: number; name: string; type: string; lastUpdated: string; }
interface Theme { id: string; title: string; description: string; templates: Template[]; }

const typeColor: Record<string, { color: string; bg: string }> = {
  PDF:  { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  DOCX: { color: '#1265AF', bg: 'rgba(18,101,175,0.08)' },
  XLSX: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
};

const initialThemes: Theme[] = [
  {
    id: 'ideacao', title: 'Fase de Ideação',
    description: 'Modelos para descoberta e validação inicial de conceitos.',
    templates: [
      { id: 1, name: 'Canvas de Proposta de Valor',     type: 'PDF',  lastUpdated: '12-05-2026' },
      { id: 2, name: 'Ata de Reunião de Stakeholders',  type: 'DOCX', lastUpdated: '10-04-2026' },
      { id: 3, name: 'Template de Matriz CSD',          type: 'XLSX', lastUpdated: '22-03-2026' },
    ]
  },
  {
    id: 'planejamento', title: 'Planejamento e Estratégia',
    description: 'Documentos para definição de roadmap e alinhamento.',
    templates: [
      { id: 4, name: 'Plano de Projeto CIS',           type: 'PDF',  lastUpdated: '15-05-2026' },
      { id: 5, name: 'Modelo de Roadmap Trimestral',   type: 'XLSX', lastUpdated: '01-05-2026' },
      { id: 6, name: 'Análise de Riscos e Impacto',    type: 'PDF',  lastUpdated: '20-04-2026' },
    ]
  },
  {
    id: 'execucao', title: 'Execução e Entrega',
    description: 'Acompanhamento técnico e gestão de entregáveis.',
    templates: [
      { id: 7, name: 'Relatório Semanal de Status',    type: 'DOCX', lastUpdated: '18-05-2026' },
      { id: 8, name: 'Checklist de QA e Homologação',  type: 'PDF',  lastUpdated: '11-05-2026' },
    ]
  },
  {
    id: 'pos-entrega', title: 'Pós-Entrega e Sustentação',
    description: 'Encerramento, métricas de sucesso e repasses.',
    templates: [
      { id: 9,  name: 'Relatório de Lições Aprendidas', type: 'PDF', lastUpdated: '19-05-2026' },
      { id: 10, name: 'Termo de Encerramento e Aceite',  type: 'PDF', lastUpdated: '05-05-2026' },
    ]
  },
];

const ApoioEscrita = () => {
  const [themes, setThemes]           = useState<Theme[]>(initialThemes);
  const [searchTerm, setSearchTerm]   = useState('');
  const [isAdding, setIsAdding]       = useState(false);
  const [newTheme, setNewTheme]       = useState({ title: '', description: '' });

  const filteredThemes = themes
    .map(t => ({ ...t, templates: t.templates.filter(tp => tp.name.toLowerCase().includes(searchTerm.toLowerCase())) }))
    .filter(t => t.templates.length > 0 || searchTerm === '');

  const handleDownload = (name: string) =>
    alert(`Iniciando download do modelo: ${name}\nEste arquivo é um template oficial CIS.`);

  const handleAddTheme = () => {
    if (!newTheme.title) return;
    setThemes([...themes, { id: Date.now().toString(), title: newTheme.title, description: newTheme.description, templates: [] }]);
    setNewTheme({ title: '', description: '' });
    setIsAdding(false);
  };

  const handleAddTemplate = (themeId: string) => {
    const name = prompt('Nome do novo modelo:');
    if (!name) return;
    setThemes(themes.map(t => t.id !== themeId ? t : {
      ...t,
      templates: [...t.templates, { id: Date.now(), name, type: 'PDF', lastUpdated: new Date().toLocaleDateString() }]
    }));
  };

  const handleDeleteTheme = (themeId: string) => {
    if (confirm('Deseja realmente excluir este tema e todos os seus modelos?'))
      setThemes(themes.filter(t => t.id !== themeId));
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>

      {/* ── HEADER ── */}
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Apoio à Escrita
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Acesse e gerencie modelos padronizados de relatórios separados por temática.
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
              placeholder="Buscar modelos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', width: 220, fontSize: '0.875rem', fontFamily: 'inherit' }}
            />
          </div>
          <button className="btn-primary" onClick={() => setIsAdding(true)}>
            <Plus size={16} strokeWidth={2} /> Novo Tema
          </button>
        </div>
      </header>

      {/* ── ADD THEME FORM ── */}
      {isAdding && (
        <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem', border: '2px dashed rgba(18,101,175,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Adicionar Nova Temática</h3>
            <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input
              placeholder="Título do Tema (ex: Sustentabilidade)"
              value={newTheme.title}
              onChange={e => setNewTheme({ ...newTheme, title: e.target.value })}
              style={{ padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid rgba(18,101,175,0.12)', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit', color: 'var(--text-main)' }}
            />
            <textarea
              placeholder="Breve descrição da finalidade desta temática..."
              value={newTheme.description}
              onChange={e => setNewTheme({ ...newTheme, description: e.target.value })}
              style={{ padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid rgba(18,101,175,0.12)', outline: 'none', minHeight: 80, resize: 'vertical', fontSize: '0.9rem', fontFamily: 'inherit', color: 'var(--text-main)' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleAddTheme} className="btn-primary"><Check size={16} /> Salvar Temática</button>
            </div>
          </div>
        </div>
      )}

      {/* ── THEME CARDS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {filteredThemes.length > 0 ? filteredThemes.map(theme => (
          <div key={theme.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', borderRadius: 24 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(18,101,175,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(18,101,175,0.05)'; }}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: 'rgba(18,101,175,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)',
              }}>
                <FolderOpen size={22} strokeWidth={1.5} />
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button onClick={() => handleAddTemplate(theme.id)}
                  style={{ width: 30, height: 30, background: 'rgba(18,101,175,0.06)', border: '1px solid rgba(18,101,175,0.08)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', transition: 'all 0.2s' }}
                  title="Adicionar Modelo"
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(18,101,175,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(18,101,175,0.06)'}
                >
                  <Plus size={15} strokeWidth={2} />
                </button>
                <button onClick={() => handleDeleteTheme(theme.id)}
                  style={{ width: 30, height: 30, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.08)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', transition: 'all 0.2s' }}
                  title="Excluir Tema"
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>
              {theme.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {theme.description}
            </p>

            {/* Template count badge */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                color: 'var(--primary)', background: 'rgba(18,101,175,0.08)', borderRadius: 999,
                padding: '0.3rem 0.75rem', border: '1px solid rgba(18,101,175,0.1)',
              }}>
                {theme.templates.length} Modelos
              </span>
            </div>

            {/* Template list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: 'auto' }}>
              {theme.templates.map(template => {
                const tc = typeColor[template.type] || { color: 'var(--primary)', bg: 'rgba(18,101,175,0.08)' };
                return (
                  <div key={template.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', background: 'rgba(247,250,253,0.8)',
                      borderRadius: 12, border: '1px solid rgba(18,101,175,0.05)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(18,101,175,0.06)'; e.currentTarget.style.borderColor = 'rgba(18,101,175,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(247,250,253,0.8)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(18,101,175,0.05)'; }}
                    onClick={() => handleDownload(template.name)}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tc.color, flexShrink: 0 }}>
                      <FileText size={15} strokeWidth={1.5} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {template.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.1rem' }}>
                        {template.type} · {template.lastUpdated}
                      </div>
                    </div>
                    <Download size={14} color="var(--text-muted)" strokeWidth={1.5} />
                  </div>
                );
              })}

              {theme.templates.length === 0 && (
                <div style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1.5px dashed rgba(18,101,175,0.12)', borderRadius: 12 }}>
                  Nenhum modelo nesta temática.
                </div>
              )}
            </div>

            {/* Ver tudo */}
            <button style={{
              marginTop: '1.25rem', background: 'none', border: '1px solid rgba(18,101,175,0.12)',
              color: 'var(--primary)', padding: '0.75rem', borderRadius: 12, cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '0.4rem', fontFamily: 'inherit', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--primary)'; }}
            >
              Ver Tudo <ChevronRight size={16} />
            </button>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum resultado encontrado.
          </div>
        )}
      </div>

      {/* ── CTA FOOTER ── */}
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(18,101,175,0.05), rgba(91,169,240,0.02))' }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(18,101,175,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 1rem' }}>
          <PenTool size={22} strokeWidth={1.5} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Precisa de uma nova temática?
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Adicione novos grupos de relatórios ou solicite suporte à governança.
        </p>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> Criar Nova Temática
        </button>
      </div>
    </div>
  );
};

export default ApoioEscrita;
