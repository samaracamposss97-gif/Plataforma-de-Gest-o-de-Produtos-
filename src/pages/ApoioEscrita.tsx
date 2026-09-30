import React, { useState } from 'react';
import {
  FileText, Download, ChevronRight, FolderOpen, Filter,
  Plus, Trash2, Check, X, Upload, Globe, Link
} from 'lucide-react';
import SearchAutocomplete from '../components/SearchAutocomplete';

interface Template { id: number; name: string; type: string; lastUpdated: string; }
interface Theme { id: string; title: string; description: string; fase: string; templates: Template[]; }

// Varied fluid blob decorations — cycled per card so they don't all look the same
const THEME_BLOBS = [
  { top: '-25%', right: '-15%', left: 'auto', bottom: 'auto', width: 180, height: 150, radius: '62% 38% 33% 67% / 58% 32% 68% 42%', from: '#9CC7F5', to: '#1265AF' },
  { top: 'auto', right: '-18%', left: 'auto', bottom: '-20%', width: 200, height: 170, radius: '45% 55% 65% 35% / 40% 62% 38% 60%', from: '#AED4F7', to: '#1B76CA' },
  { top: '-20%', right: 'auto', left: '-15%', bottom: 'auto', width: 170, height: 190, radius: '38% 62% 58% 42% / 60% 38% 62% 40%', from: '#5BA9F0', to: '#0D4D87' },
  { top: 'auto', right: 'auto', left: '-12%', bottom: '-22%', width: 190, height: 160, radius: '55% 45% 40% 60% / 65% 40% 60% 35%', from: '#CFE6FB', to: '#5BA9F0' },
];

const typeColor: Record<string, { color: string; bg: string }> = {
  PDF:  { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  DOCX: { color: '#1265AF', bg: 'rgba(18,101,175,0.08)' },
  XLSX: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
};

const FASES = ['Ideação', 'Planejamento', 'Desenvolvimento', 'Entrega'];

const initialThemes: Theme[] = [
  {
    id: 'ideacao', title: 'Fase de Ideação', fase: 'Ideação',
    description: 'Modelos para descoberta e validação inicial de conceitos.',
    templates: [
      { id: 1, name: 'Canvas de Proposta de Valor',     type: 'PDF',  lastUpdated: '12-05-2026' },
      { id: 2, name: 'Ata de Reunião de Stakeholders',  type: 'DOCX', lastUpdated: '10-04-2026' },
      { id: 3, name: 'Template de Matriz CSD',          type: 'XLSX', lastUpdated: '22-03-2026' },
    ]
  },
  {
    id: 'planejamento', title: 'Planejamento e Estratégia', fase: 'Planejamento',
    description: 'Documentos para definição de roadmap e alinhamento.',
    templates: [
      { id: 4, name: 'Plano de Projeto CIS',           type: 'PDF',  lastUpdated: '15-05-2026' },
      { id: 5, name: 'Modelo de Roadmap Trimestral',   type: 'XLSX', lastUpdated: '01-05-2026' },
      { id: 6, name: 'Análise de Riscos e Impacto',    type: 'PDF',  lastUpdated: '20-04-2026' },
    ]
  },
  {
    id: 'execucao', title: 'Execução e Entrega', fase: 'Desenvolvimento',
    description: 'Acompanhamento técnico e gestão de entregáveis.',
    templates: [
      { id: 7, name: 'Relatório Semanal de Status',    type: 'DOCX', lastUpdated: '18-05-2026' },
      { id: 8, name: 'Checklist de QA e Homologação',  type: 'PDF',  lastUpdated: '11-05-2026' },
    ]
  },
  {
    id: 'pos-entrega', title: 'Pós-Entrega e Sustentação', fase: 'Entrega',
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
  const [selectedFase, setSelectedFase] = useState('Todas');
  const [selectedTema, setSelectedTema] = useState('Todos');
  const [selectedModelo, setSelectedModelo] = useState('Todos');
  const [activeThemeForAdd, setActiveThemeForAdd] = useState<string | null>(null);
  const [templateSource, setTemplateSource] = useState<'upload' | 'drive'>('upload');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateType, setNewTemplateType] = useState('PDF');
  const [driveUrl, setDriveUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTheme, setNewTheme] = useState({ title: '', description: '', fase: FASES[0] });

  const filteredThemes = themes.filter(theme => {
    const matchSearch = theme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.templates.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFase = selectedFase === 'Todas' || theme.fase === selectedFase;
    const matchTema = selectedTema === 'Todos' || theme.id === selectedTema;
    const matchModelo = selectedModelo === 'Todos' || theme.templates.some(t => t.type === selectedModelo);
    return matchSearch && matchFase && matchTema && matchModelo;
  });

  const handleDownload = (name: string) =>
    alert(`Iniciando download do modelo: ${name}\nEste arquivo é um template oficial CIS.`);

  const handleAddTheme = () => {
    if (!newTheme.title) return;
    setThemes([...themes, { id: Date.now().toString(), title: newTheme.title, description: newTheme.description, fase: newTheme.fase, templates: [] }]);
    setNewTheme({ title: '', description: '', fase: FASES[0] });
    setIsAdding(false);
  };

  const handleOpenAddTemplateModal = (themeId: string) => {
    setActiveThemeForAdd(themeId);
    setNewTemplateName('');
    setNewTemplateType('PDF');
    setDriveUrl('');
    setUploadedFileName('');
    setTemplateSource('upload');
  };

  const handleSaveTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThemeForAdd) return;

    const finalName = newTemplateName.trim() || uploadedFileName || (templateSource === 'drive' ? 'Documento do Google Drive' : 'Novo Modelo');
    
    setThemes(themes.map(t => t.id !== activeThemeForAdd ? t : {
      ...t,
      templates: [...t.templates, { 
        id: Date.now(), 
        name: finalName + (templateSource === 'drive' ? ' (Google Drive)' : ''), 
        type: newTemplateType, 
        lastUpdated: new Date().toLocaleDateString('pt-BR') 
      }]
    }));

    setActiveThemeForAdd(null);
    alert(templateSource === 'drive' ? 'Documento do Google Drive vinculado com sucesso!' : 'Arquivo adicionado com sucesso!');
  };

  const handleDeleteTheme = (themeId: string) => {
    if (confirm('Deseja realmente excluir este tema e todos os seus modelos?'))
      setThemes(themes.filter(t => t.id !== themeId));
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>

      {/* ── HEADER ── */}
      <header className="page-header-sticky" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Apoio à Escrita
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Acesse e gerencie modelos padronizados de relatórios separados por temática.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} strokeWidth={2} /> Novo Tema
        </button>
      </header>

      {/* ── SEARCH + FILTERS ── */}
      <div className="filter-bar" style={{ marginBottom: '2rem' }}>
        <SearchAutocomplete
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar modelos..."
          suggestions={themes.flatMap(t => [t.title, ...t.templates.map(tpl => tpl.name)])}
          containerStyle={{ flex: 1, minWidth: 220 }}
          inputStyle={{ width: '100%' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, height: 'var(--btn-height)' }}>
          <Filter size={15} strokeWidth={1.5} /> Filtros
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fase</label>
          <select className="filter-pill" value={selectedFase} onChange={e => setSelectedFase(e.target.value)}>
            <option value="Todas">Todas as Fases</option>
            {FASES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tema</label>
          <select className="filter-pill" value={selectedTema} onChange={e => setSelectedTema(e.target.value)}>
            <option value="Todos">Todos os Temas</option>
            {themes.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modelo</label>
          <select className="filter-pill" value={selectedModelo} onChange={e => setSelectedModelo(e.target.value)}>
            <option value="Todos">Todos os Modelos</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="XLSX">XLSX</option>
          </select>
        </div>
      </div>

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
            <select
              value={newTheme.fase}
              onChange={e => setNewTheme({ ...newTheme, fase: e.target.value })}
              style={{ padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid rgba(18,101,175,0.12)', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit', color: 'var(--text-main)', background: 'white' }}
            >
              {FASES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleAddTheme} className="btn-primary"><Check size={16} /> Salvar Temática</button>
            </div>
          </div>
        </div>
      )}

      {/* ── THEME CARDS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {filteredThemes.length > 0 ? filteredThemes.map((theme, idx) => {
          const blob = THEME_BLOBS[idx % THEME_BLOBS.length];
          return (
          <div key={theme.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', borderRadius: 24, position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(18,101,175,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(18,101,175,0.05)'; }}
          >
            {/* Decorative fluid blob, purely for UI polish — shape varies per card */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: blob.top, right: blob.right, left: blob.left, bottom: blob.bottom,
              width: blob.width, height: blob.height, borderRadius: blob.radius,
              background: `radial-gradient(circle at 32% 30%, ${blob.from} 0%, ${blob.to} 70%)`,
              opacity: 0.1, filter: 'blur(2px)', pointerEvents: 'none', zIndex: -1,
            }} />

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
                <button onClick={() => handleOpenAddTemplateModal(theme.id)}
                  style={{ width: 30, height: 30, background: 'rgba(18,101,175,0.06)', border: '1px solid rgba(18,101,175,0.08)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', transition: 'all 0.2s' }}
                  title="Adicionar Modelo / Subir do Drive"
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
            <button
              className="btn-secondary"
              style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
            >
              Ver Tudo <ChevronRight size={16} />
            </button>
          </div>
        );}) : (
          <div style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum resultado encontrado.
          </div>
        )}
      </div>

      {/* ── ADD TEMPLATE / DRIVE MODAL ── */}
      {activeThemeForAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,23,42,0.6)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setActiveThemeForAdd(null)}>
          <div className="glass-card" style={{ width: 520, maxWidth: '100%', padding: '2rem', borderRadius: 24, boxShadow: '0 32px 80px rgba(18,101,175,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(18,101,175,0.08)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Adicionar Documento / Modelo</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Escolha entre upload de arquivo ou vincular do Google Drive</p>
              </div>
              <button onClick={() => setActiveThemeForAdd(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Source Selection Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(18,101,175,0.04)', padding: '0.3rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setTemplateSource('upload')}
                style={{
                  flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none',
                  background: templateSource === 'upload' ? 'white' : 'transparent',
                  color: templateSource === 'upload' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: templateSource === 'upload' ? 700 : 500, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: templateSource === 'upload' ? '0 2px 8px rgba(18,101,175,0.08)' : 'none'
                }}
              >
                <Upload size={15} /> Upload de Arquivo
              </button>
              <button
                type="button"
                onClick={() => setTemplateSource('drive')}
                style={{
                  flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none',
                  background: templateSource === 'drive' ? 'white' : 'transparent',
                  color: templateSource === 'drive' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: templateSource === 'drive' ? 700 : 500, fontSize: '0.85rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: templateSource === 'drive' ? '0 2px 8px rgba(18,101,175,0.08)' : 'none'
                }}
              >
                <Globe size={15} /> Google Drive
              </button>
            </div>

            <form onSubmit={handleSaveTemplateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Título do Modelo / Documento *</label>
                <input
                  required
                  placeholder="Ex: Template de Relatório Executivo"
                  value={newTemplateName}
                  onChange={e => setNewTemplateName(e.target.value)}
                  style={{ padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid rgba(18,101,175,0.14)', outline: 'none' }}
                />
              </div>

              {templateSource === 'upload' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Selecione o Arquivo *</label>
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '1.5rem', borderRadius: '16px', border: '2px dashed rgba(18,101,175,0.2)',
                    background: 'rgba(18,101,175,0.02)', cursor: 'pointer', gap: '0.5rem'
                  }}>
                    <Upload size={24} color="var(--primary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                      {uploadedFileName ? `Arquivo selecionado: ${uploadedFileName}` : 'Clique aqui para escolher um arquivo no seu computador'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Formatos aceitos: PDF, DOCX, XLSX
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFileName(file.name);
                          if (!newTemplateName) setNewTemplateName(file.name.replace(/\.[^/.]+$/, ''));
                          const ext = file.name.split('.').pop()?.toUpperCase() || '';
                          if (ext === 'DOC' || ext === 'DOCX') setNewTemplateType('DOCX');
                          else if (ext === 'XLS' || ext === 'XLSX') setNewTemplateType('XLSX');
                          else setNewTemplateType('PDF');
                        }
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Link do Google Drive *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(18,101,175,0.14)', borderRadius: 12, padding: '0.75rem 1rem' }}>
                    <Link size={16} color="var(--primary)" />
                    <input
                      required
                      type="url"
                      placeholder="https://docs.google.com/document/d/..."
                      value={driveUrl}
                      onChange={e => setDriveUrl(e.target.value)}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cole o link compartilhado do Google Docs ou Google Drive.</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setActiveThemeForAdd(null)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> {templateSource === 'drive' ? 'Vincular Google Drive' : 'Salvar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApoioEscrita;
