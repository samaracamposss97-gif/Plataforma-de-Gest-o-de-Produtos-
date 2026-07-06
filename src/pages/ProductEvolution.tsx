import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Eye, 
  X, 
  Paperclip, 
  Brain, 
  Target, 
  AlertTriangle, 
  ShieldCheck, 
  MessageSquare,
  CheckCircle2,
  Calendar,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertOctagon,
  Users,
  TrendingUp,
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecordItem {
  id: string;
  type: 'Evidência' | 'Decisão' | 'Aprendizado' | 'Dificuldade' | 'Risco' | 'Observação' | 'Pendência';
  content: string;
  date: string;
  microStage?: string;
  mentions?: string;
  attachments?: string[];
}

interface PhaseData {
  id: string;
  title: string;
  responsible: string;
  progress: number;
  startDate: string;
  endDate: string;
  evidence: string;
  learnings: string;
  decisions: string;
  difficulties: string;
  riscos: string;
  observations: string;
  topics?: string[];
  records?: RecordItem[];
}

interface Product {
  id: number;
  name: string;
  lead: string;
  deadline: string;
  category: string;
}

const defaultPhasesList: PhaseData[] = [
  { 
    id: 'imersao', 
    title: 'Imersão', 
    responsible: 'Ana Silva', 
    progress: 100, 
    startDate: '2026-01-01', 
    endDate: '2026-01-15', 
    evidence: '', 
    learnings: '', 
    decisions: '', 
    difficulties: '', 
    riscos: '', 
    observations: '', 
    topics: ['Público Alvo', 'Tamanho e Potencial de Mercado', 'Parcerias Estratégicas'], 
    records: [
      { id: 'r1', type: 'Evidência', content: 'Ata de reunião com stakeholders assinada', date: '10/01/2026' },
      { id: 'r2', type: 'Decisão', content: 'Uso de React e TypeScript no frontend', date: '05/01/2026' },
      { id: 'r3', type: 'Aprendizado', content: 'Usuários preferem login por biometria', date: '12/01/2026' }
    ] 
  },
  { 
    id: 'visao', 
    title: 'Visão do Produto', 
    responsible: 'Bruno Costa', 
    progress: 100, 
    startDate: '2026-01-16', 
    endDate: '2026-02-05', 
    evidence: '', 
    learnings: '', 
    decisions: '', 
    difficulties: '', 
    riscos: '', 
    observations: '', 
    topics: ['Proposta de Valor', 'Mapeamento de Jornadas', 'Arquitetura de Alto Nível'], 
    records: [
      { id: 'r4', type: 'Dificuldade', content: 'Atraso na liberação da API externa de homologação', date: '25/01/2026' },
      { id: 'r5', type: 'Risco', content: 'Dependência de fornecedor único para infraestrutura', date: '02/02/2026' }
    ] 
  },
  { 
    id: 'estrategia', 
    title: 'Estratégia', 
    responsible: 'Carla Dias', 
    progress: 65, 
    startDate: '2026-02-06', 
    endDate: '2026-03-20', 
    evidence: '', 
    learnings: '', 
    decisions: '', 
    difficulties: '', 
    riscos: '', 
    observations: '', 
    topics: ['Business Model Canvas', 'Roadmap de Features', 'Backlog de Requisitos'], 
    records: [] 
  },
  { 
    id: 'lancamento', 
    title: 'Lançamento', 
    responsible: 'Diego Souza', 
    progress: 0, 
    startDate: '2026-03-21', 
    endDate: '2026-04-15', 
    evidence: '', 
    learnings: '', 
    decisions: '', 
    difficulties: '', 
    riscos: '', 
    observations: '', 
    topics: ['Piloto Operacional', 'Go-To-Market', 'Rollout de Versões'], 
    records: [] 
  },
  { 
    id: 'evolucao', 
    title: 'Evolução', 
    responsible: 'Ana Silva', 
    progress: 0, 
    startDate: '2026-04-16', 
    endDate: '2026-06-30', 
    evidence: '', 
    learnings: '', 
    decisions: '', 
    difficulties: '', 
    riscos: '', 
    observations: '', 
    topics: ['Métricas de Uso', 'Melhoria Contínua', 'Suporte Técnico'], 
    records: [] 
  },
  { 
    id: 'repasses', 
    title: 'Repasses', 
    responsible: 'Bruno Costa', 
    progress: 0, 
    startDate: '2026-07-01', 
    endDate: '2026-07-15', 
    evidence: '', 
    learnings: '', 
    decisions: '', 
    difficulties: '', 
    riscos: '', 
    observations: '', 
    topics: ['Transferência de Tecnologia', 'Documentação Final', 'Encerramento'], 
    records: [] 
  }
];

const ProductEvolution = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<number | null>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [productPhasesMap, setProductPhasesMap] = useState<Record<number, PhaseData[]>>({});
  
  // Modal details state
  const [selectedPhase, setSelectedPhase] = useState<PhaseData | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [recordType, setRecordType] = useState<'Evidência' | 'Decisão' | 'Aprendizado' | 'Dificuldade' | 'Risco' | 'Observação' | 'Pendência'>('Evidência');
  const [recordText, setRecordText] = useState('');
  const [recordMentions, setRecordMentions] = useState('');
  const [recordAttachments, setRecordAttachments] = useState<File[]>([]);
  const [associationType, setAssociationType] = useState<string>('Macro Etapa');

  // Load products list and their local phase data
  useEffect(() => {
    // Standard initial products
    const initialProducts: Product[] = [
      { id: 1, name: 'Portal do Cidadão V2', lead: 'Ana Silva', deadline: '2026-06-20', category: 'Software' },
      { id: 2, name: 'App Gestão Industrial', lead: 'Bruno Costa', deadline: '2026-08-15', category: 'Mobile' },
      { id: 3, name: 'API Integração SESI', lead: 'Carla Dias', deadline: '2026-06-01', category: 'Backend' },
      { id: 4, name: 'Dashboard BI Institucional', lead: 'Diego Souza', deadline: '2026-07-30', category: 'Analytics' }
    ];

    setProducts(initialProducts);

    // Load each product phases from localStorage or fallback
    const tempMap: Record<number, PhaseData[]> = {};
    initialProducts.forEach(prod => {
      const stored = localStorage.getItem(`cis_product_phases_${prod.id}`);
      if (stored) {
        tempMap[prod.id] = JSON.parse(stored);
      } else {
        // Build customized default phases based on project characteristics
        const customDefaults = defaultPhasesList.map((p, idx) => {
          let progressVal = 0;
          if (prod.id === 1) {
            // Portal do Cidadão: Imersão (100), Visão (100), Estratégia (65)
            progressVal = idx === 0 || idx === 1 ? 100 : idx === 2 ? 65 : 0;
          } else if (prod.id === 2) {
            // App Gestão Industrial: Imersão (40)
            progressVal = idx === 0 ? 40 : 0;
          } else if (prod.id === 3) {
            // API Integração SESI: Imersão (100), Visão (100), Estratégia (100), Lançamento (90)
            progressVal = idx <= 2 ? 100 : idx === 3 ? 90 : 0;
          } else if (prod.id === 4) {
            // Dashboard BI: Imersão (100), Visão (30)
            progressVal = idx === 0 ? 100 : idx === 1 ? 30 : 0;
          }
          return { ...p, progress: progressVal };
        });
        tempMap[prod.id] = customDefaults;
        localStorage.setItem(`cis_product_phases_${prod.id}`, JSON.stringify(customDefaults));
      }
    });
    setProductPhasesMap(tempMap);
  }, []);

  const saveProductPhases = (productId: number, newPhases: PhaseData[]) => {
    const updatedMap = { ...productPhasesMap, [productId]: newPhases };
    setProductPhasesMap(updatedMap);
    localStorage.setItem(`cis_product_phases_${productId}`, JSON.stringify(newPhases));
  };

  const handleDetailsClick = (productId: number, phase: PhaseData) => {
    setSelectedProductId(productId);
    setSelectedPhase(phase);
    setIsDetailsModalOpen(true);
    setRecordType('Evidência');
    setRecordText('');
    setAssociationType('Macro Etapa');
  };

  const handleAddRecord = () => {
    if (!recordText.trim() || !selectedPhase || !selectedProductId) return;

    const newRecord: RecordItem = {
      id: Date.now().toString(),
      type: recordType,
      content: recordText,
      date: new Date().toLocaleDateString('pt-BR'),
      microStage: associationType,
      mentions: recordMentions,
      attachments: recordAttachments.map(f => f.name)
    };

    const updatedRecords = [...(selectedPhase.records || []), newRecord];
    const updatedPhase = { ...selectedPhase, records: updatedRecords };

    setSelectedPhase(updatedPhase);

    // Save back to general state & localStorage
    const productPhases = productPhasesMap[selectedProductId] || [];
    const updatedPhases = productPhases.map(p => p.id === selectedPhase.id ? updatedPhase : p);
    saveProductPhases(selectedProductId, updatedPhases);
    setRecordText('');
    setRecordMentions('');
    setRecordAttachments([]);
    setAssociationType('Macro Etapa');
  };

  const handleDeleteRecord = (recordId: string) => {
    if (!selectedPhase || !selectedProductId) return;

    const updatedRecords = (selectedPhase.records || []).filter(r => r.id !== recordId);
    const updatedPhase = { ...selectedPhase, records: updatedRecords };

    setSelectedPhase(updatedPhase);

    const productPhases = productPhasesMap[selectedProductId] || [];
    const updatedPhases = productPhases.map(p => p.id === selectedPhase.id ? updatedPhase : p);
    saveProductPhases(selectedProductId, updatedPhases);
  };

  // Helper to determine if a stage is delayed
  // A stage is late if the progress < 100, its end date is specified, and that end date has already passed.
  const isStageDelayed = (phase: PhaseData) => {
    if (phase.progress === 100) return false;
    if (!phase.endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(phase.endDate);
    return end < today;
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '5rem' }} className="fade-up">
      
      {/* Header */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', margin: 0, fontWeight: 800, color: '#111111', letterSpacing: '-0.03em' }}>Evolução do Portfólio (Executive Timeline)</h1>
          <p style={{ color: '#111111', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>Acompanhamento executivo consolidado com macro e micro etapas de todos os projetos ativos no CIS.</p>
        </div>

        {/* Search */}
        <div className="glass-card" style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid rgba(18, 101, 175, 0.08)', borderRadius: '14px', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s' }}>
          <Search size={16} color="var(--primary)" />
          <input 
            type="text" 
            placeholder="Buscar projetos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#111111', outline: 'none', width: '220px', fontSize: '0.9rem', fontWeight: 600 }}
          />
        </div>
      </header>

      {/* Projects List Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredProducts.map((prod) => {
          const phases = productPhasesMap[prod.id] || [];
          
          // Calculate macro progress
          const totalProgress = phases.reduce((acc, p) => acc + p.progress, 0);
          const averageProgress = phases.length > 0 ? Math.round(totalProgress / phases.length) : 0;
          const activeStage = phases.find(p => p.progress > 0 && p.progress < 100) || phases.find(p => p.progress === 0);
          const completedPhasesCount = phases.filter(p => p.progress === 100).length;
          const totalPhasesCount = phases.length;

          return (
            <div 
              key={prod.id} 
              className="glass-card" 
              style={{ 
                padding: '2.5rem', 
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem'
              }}
            >
              {/* Header flex row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>{prod.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#111111', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                    {prod.category === 'Software' ? 'SESI Nacional · Educação' : prod.category === 'Mobile' ? 'SESI SP · Saúde' : `CIS Portfolio · ${prod.category}`}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    padding: '0.35rem 0.85rem', 
                    borderRadius: '20px', 
                    background: 'rgba(18, 101, 175, 0.08)', 
                    color: 'var(--primary)',
                    border: '1px solid rgba(18, 101, 175, 0.08)'
                  }}>
                    Em andamento
                  </span>
                  
                  {/* Clickable details icon button */}
                  <button 
                    onClick={() => {
                      if (activeStage) {
                        handleDetailsClick(prod.id, activeStage);
                      } else if (phases.length > 0) {
                        handleDetailsClick(prod.id, phases[0]);
                      }
                    }}
                    style={{ 
                      background: 'rgba(18, 101, 175, 0.05)', 
                      border: '1px solid rgba(18, 101, 175, 0.08)', 
                      cursor: 'pointer', 
                      color: 'var(--primary)', 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(18, 101, 175, 0.05)';
                      e.currentTarget.style.color = 'var(--primary)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="Ver Detalhes do Projeto"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Metadata row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', background: 'rgba(18, 101, 175, 0.03)', padding: '0.85rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#111111' }}>
                  <Users size={15} color="var(--primary)" style={{ opacity: 0.8 }} />
                  <span>Resp.: <strong style={{ color: '#111111' }}>{prod.lead}</strong></span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#111111' }}>
                  <Calendar size={15} color="var(--primary)" style={{ opacity: 0.8 }} />
                  <span>Prazo: <strong style={{ color: '#111111' }}>{new Date(prod.deadline).toLocaleDateString('pt-BR')}</strong></span>
                </div>

                <div style={{ flexGrow: 1 }} />

                {/* Priority Badge */}
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: 'var(--danger)',
                  border: '1px solid rgba(239, 68, 68, 0.1)',
                  padding: '0.25rem 0.65rem', 
                  borderRadius: '10px'
                }}>
                  Alta Prioridade
                </span>

                {/* Completion Percent Badge */}
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: 'rgba(34, 197, 94, 0.08)',
                  color: 'var(--success)',
                  border: '1px solid rgba(34, 197, 94, 0.1)',
                  padding: '0.25rem 0.65rem', 
                  borderRadius: '10px'
                }}>
                  {averageProgress}% completo
                </span>
              </div>

              {/* Progress bar section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: '#111111', fontWeight: 600 }}>Etapas Concluídas</span>
                  <span style={{ fontWeight: 700, color: '#111111' }}>{completedPhasesCount} de {totalPhasesCount} ({Math.round((completedPhasesCount / totalPhasesCount) * 100)}%)</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(18, 101, 175, 0.05)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(18, 101, 175, 0.04)' }}>
                  <div 
                    style={{ 
                      width: `${(completedPhasesCount / totalPhasesCount) * 100}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)', 
                      borderRadius: '6px',
                      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Connecting line heading and timeline area */}
              <div style={{ borderTop: '1px solid rgba(18, 101, 175, 0.08)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '0.75rem', textTransform: 'uppercase', color: '#111111', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Linha do Tempo de Governança
                </h4>
                
                {/* Nodes row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 0.5rem' }}>
                  {phases.map((phase, idx) => {
                    const isCompleted = phase.progress === 100;
                    const isCurrentActive = activeStage?.id === phase.id;
                    const nextPhase = phases[idx + 1];
                    const isNextCompleted = nextPhase ? nextPhase.progress === 100 : false;

                    return (
                      <div key={phase.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                        
                        {/* Connecting Line to the next node */}
                        {idx < phases.length - 1 && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            left: 'calc(50% + 18px)',
                            width: 'calc(100% - 36px)',
                            height: '4px',
                            background: isCompleted && isNextCompleted 
                              ? 'var(--success)' 
                              : isCompleted 
                                ? 'linear-gradient(90deg, var(--success) 0%, rgba(18, 101, 175, 0.2) 100%)' 
                                : 'rgba(18, 101, 175, 0.08)',
                            borderRadius: '2px',
                            zIndex: 0
                          }} />
                        )}

                        {/* Node circle */}
                        <button
                          onClick={() => handleDetailsClick(prod.id, phase)}
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: isCompleted 
                              ? 'var(--success)' 
                              : isCurrentActive 
                                ? 'var(--primary)' 
                                : 'white',
                            border: isCurrentActive 
                              ? '4px solid var(--primary-light)' 
                              : '3px solid rgba(18, 101, 175, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            zIndex: 1,
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: isCurrentActive 
                              ? '0 0 12px var(--primary-glow), 0 4px 10px rgba(18, 101, 175, 0.15)' 
                              : isCompleted 
                                ? '0 4px 10px rgba(34, 197, 94, 0.15)' 
                                : 'none',
                            padding: 0
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.15)';
                            if (isCurrentActive) {
                              e.currentTarget.style.boxShadow = '0 0 16px rgba(18, 101, 175, 0.35)';
                            } else if (isCompleted) {
                              e.currentTarget.style.boxShadow = '0 0 16px rgba(34, 197, 94, 0.35)';
                            } else {
                              e.currentTarget.style.borderColor = 'var(--primary)';
                              e.currentTarget.style.boxShadow = '0 4px 10px rgba(18, 101, 175, 0.08)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = isCurrentActive 
                              ? '0 0 12px var(--primary-glow), 0 4px 10px rgba(18, 101, 175, 0.15)' 
                              : isCompleted 
                                ? '0 4px 10px rgba(34, 197, 94, 0.15)' 
                                : 'none';
                            if (!isCurrentActive && !isCompleted) {
                              e.currentTarget.style.borderColor = 'rgba(18, 101, 175, 0.12)';
                            }
                          }}
                          title={`Clique para ver detalhes de ${phase.title}`}
                        >
                          {isCompleted ? (
                            <Check size={14} color="white" strokeWidth={3} />
                          ) : isCurrentActive ? (
                            <Clock size={12} color="white" />
                          ) : null}
                        </button>

                        {/* Label under circle */}
                        <span style={{
                          marginTop: '0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: isCurrentActive ? 700 : 600,
                          color: isCompleted 
                            ? 'var(--success)' 
                            : isCurrentActive 
                              ? 'var(--primary)' 
                              : '#111111',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}>
                          {phase.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Details / Timeline Governance Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedPhase && selectedProductId && (
          <div className="modal-backdrop" onClick={() => setIsDetailsModalOpen(false)}>
            <motion.div 
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ maxWidth: '850px', width: '95%', padding: '2.5rem' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800, color: '#111111' }}>Histórico da Etapa: {selectedPhase.title}</h2>
                  <p style={{ color: '#111111', fontSize: '0.85rem', margin: '0.25rem 0 0 0', fontWeight: 600 }}>Gestão de Conhecimento e Registro de Rastreabilidade • {products.find(p => p.id === selectedProductId)?.name}</p>
                </div>
                <button 
                  onClick={() => setIsDetailsModalOpen(false)} 
                  style={{ 
                    background: 'rgba(18, 101, 175, 0.05)', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: '#111111',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                    e.currentTarget.style.color = 'var(--danger)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(18, 101, 175, 0.05)';
                    e.currentTarget.style.color = '#111111';
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Phase Info Header Cards */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '1rem', 
                marginBottom: '2rem', 
                padding: '1.25rem', 
                background: 'rgba(18, 101, 175, 0.03)', 
                borderRadius: '16px', 
                border: '1px solid rgba(18, 101, 175, 0.08)' 
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#111111', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>Responsável</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>{selectedPhase.responsible || 'Sem responsável'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#111111', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>Data de Início</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>{selectedPhase.startDate ? new Date(selectedPhase.startDate).toLocaleDateString('pt-BR') : 'A definir'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#111111', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>Data Limite</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111111' }}>{selectedPhase.endDate ? new Date(selectedPhase.endDate).toLocaleDateString('pt-BR') : 'A definir'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#111111', display: 'block', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>Progresso</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{selectedPhase.progress}%</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left: Add new record form */}
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', fontWeight: 700, color: '#111111' }}>Cadastrar Registro</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Tipo de Registro</label>
                      <select 
                        style={{ 
                          padding: '0.75rem 1rem', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(18, 101, 175, 0.12)', 
                          background: 'white', 
                          color: '#111111',
                          fontSize: '0.875rem',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        value={recordType}
                        onChange={(e) => setRecordType(e.target.value as any)}
                      >
                        <option value="Evidência">Evidência</option>
                        <option value="Decisão">Decisão</option>
                        <option value="Aprendizado">Aprendizado</option>
                        <option value="Dificuldade">Dificuldade</option>
                        <option value="Risco">Risco</option>
                        <option value="Observação">Observação</option>
                        <option value="Pendência">Pendência</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Associar a</label>
                      <select 
                        style={{ 
                          padding: '0.75rem 1rem', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(18, 101, 175, 0.12)', 
                          background: 'white', 
                          color: '#111111',
                          fontSize: '0.875rem',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        value={associationType}
                        onChange={(e) => setAssociationType(e.target.value)}
                      >
                        <option value="Macro Etapa">Macro Etapa ({selectedPhase.title})</option>
                        {(selectedPhase.topics || []).map(topic => (
                          <option key={topic} value={topic}>Micro Etapa: {topic}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Conteúdo</label>
                      <textarea 
                        style={{ 
                          padding: '0.75rem 1rem', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(18, 101, 175, 0.12)', 
                          minHeight: '120px', 
                          resize: 'vertical',
                          outline: 'none',
                          color: '#111111',
                          fontSize: '0.875rem',
                          transition: 'border-color 0.2s'
                        }}
                        placeholder="Descreva a evidência, aprendizado ou decisão obtido nesta etapa..."
                        value={recordText}
                        onChange={(e) => setRecordText(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Pessoas Mencionadas (@)</label>
                      <input 
                        style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', color: '#111111', fontSize: '0.875rem' }}
                        placeholder="Ex: @João, @Maria"
                        value={recordMentions}
                        onChange={(e) => setRecordMentions(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Anexos</label>
                      <input 
                        type="file"
                        multiple
                        style={{ padding: '0.5rem', borderRadius: '12px', border: '1px dashed rgba(18, 101, 175, 0.3)', color: '#111111', fontSize: '0.8rem' }}
                        onChange={(e) => {
                          if (e.target.files) {
                            setRecordAttachments(Array.from(e.target.files));
                          }
                        }}
                      />
                    </div>
                    <button 
                      onClick={handleAddRecord} 
                      disabled={!recordText.trim()} 
                      className="btn-primary" 
                      style={{ 
                        padding: '0.75rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                        opacity: !recordText.trim() ? 0.6 : 1,
                        cursor: !recordText.trim() ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Plus size={16} /> Adicionar à Base
                    </button>
                  </div>
                </div>

                {/* Right: Listed records */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', fontWeight: 700, color: '#111111' }}>Linha do Tempo de Governança</h3>
                  <div className="custom-scrollbar" style={{ flex: 1, maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
                    {(!selectedPhase.records || selectedPhase.records.length === 0) ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(18, 101, 175, 0.02)', borderRadius: '16px', color: '#111111', border: '1px dashed rgba(18, 101, 175, 0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nenhum registro cadastrado</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Use o formulário ao lado para registrar governança.</span>
                      </div>
                    ) : (
                      selectedPhase.records.map((rec) => (
                        <div 
                          key={rec.id} 
                          style={{ 
                            padding: '1rem', 
                            background: 'rgba(255, 255, 255, 0.5)', 
                            borderRadius: '14px', 
                            border: '1px solid rgba(18, 101, 175, 0.06)', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start', 
                            gap: '0.5rem',
                            boxShadow: '0 2px 8px rgba(18, 101, 175, 0.02)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(18, 101, 175, 0.15)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(18, 101, 175, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(18, 101, 175, 0.06)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(18, 101, 175, 0.02)';
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ 
                                fontSize: '0.65rem', 
                                fontWeight: 700, 
                                textTransform: 'uppercase', 
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                background: rec.type === 'Risco' 
                                  ? 'rgba(245, 158, 11, 0.08)' 
                                  : rec.type === 'Dificuldade' 
                                    ? 'rgba(239, 68, 68, 0.08)' 
                                    : 'rgba(18, 101, 175, 0.08)',
                                color: rec.type === 'Risco' 
                                  ? 'var(--warning)' 
                                  : rec.type === 'Dificuldade' 
                                    ? 'var(--danger)' 
                                    : 'var(--primary)',
                                border: `1px solid ${
                                  rec.type === 'Risco' 
                                    ? 'rgba(245, 158, 11, 0.12)' 
                                    : rec.type === 'Dificuldade' 
                                      ? 'rgba(239, 68, 68, 0.12)' 
                                      : 'rgba(18, 101, 175, 0.12)'
                                }`
                              }}>
                                {rec.type}
                              </span>
                              {rec.microStage && rec.microStage !== 'Macro Etapa' && (
                                <span style={{ 
                                  fontSize: '0.65rem', 
                                  fontWeight: 600, 
                                  textTransform: 'uppercase', 
                                  background: 'rgba(18, 101, 175, 0.04)', 
                                  color: 'var(--primary)', 
                                  padding: '0.2rem 0.5rem', 
                                  borderRadius: '6px', 
                                  border: '1px solid rgba(18, 101, 175, 0.08)' 
                                }}>
                                  {rec.microStage}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.875rem', color: '#111111', fontWeight: 600, lineHeight: 1.5 }}>{rec.content}</span>
                            {rec.mentions && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{rec.mentions}</span>}
                            {rec.attachments && rec.attachments.length > 0 && (
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                {rec.attachments.map(att => (
                                  <span key={att} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#e2e8f0', borderRadius: '4px', color: '#475569' }}>📎 {att}</span>
                                ))}
                              </div>
                            )}
                            <span style={{ fontSize: '0.7rem', color: '#111111' }}>{rec.date}</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteRecord(rec.id)} 
                            style={{ 
                              background: 'rgba(239, 68, 68, 0.05)', 
                              border: 'none', 
                              cursor: 'pointer', 
                              color: 'var(--danger)', 
                              padding: '6px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--danger)';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                              e.currentTarget.style.color = 'var(--danger)';
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductEvolution;
