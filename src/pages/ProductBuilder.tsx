import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Paperclip, 
  FileText,
  Info,
  FileBarChart,
  X,
  BookOpen,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Check,
  RotateCcw,
  TrendingUp,
  Building2,
  Users,
  Target,
  Clock,
  Eye,
  Download,
  ShieldCheck,
  Lock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Link as LinkIcon,
  Brain,
  History,
  FileSearch,
  DollarSign,
  GitBranch,
  Edit3,
  Layout,
  MessageSquare,
  Save
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
  records?: RecordItem[];
  topics?: string[];
}

const defaultPhases: PhaseData[] = [
  { 
    id: 'imersao', title: 'Imersão', responsible: 'Ana Silva', progress: 100, 
    startDate: '2026-01-01', endDate: '2026-01-15',
    evidence: 'Ata de reunião com stakeholders assinada\nUso de React e TypeScript no frontend\nUsuários preferem login por biometria', learnings: 'Usuários preferem login por biometria', decisions: 'Uso de React e TypeScript no frontend', difficulties: '', riscos: '', observations: '',
    records: [
      { id: 'r1', type: 'Evidência', content: 'Ata de reunião com stakeholders assinada', date: '10/01/2026' },
      { id: 'r2', type: 'Decisão', content: 'Uso de React e TypeScript no frontend', date: '05/01/2026' },
      { id: 'r3', type: 'Aprendizado', content: 'Usuários preferem login por biometria', date: '12/01/2026' }
    ],
    topics: ['Público alvo', 'Tamanho e potencial do mercado', 'Parcerias']
  },
  { 
    id: 'visao', title: 'Visão do Produto', responsible: 'Bruno Costa', progress: 100, 
    startDate: '2026-01-16', endDate: '2026-02-05',
    evidence: '', learnings: '', decisions: '', difficulties: 'Atraso na liberação da API externa de homologação', riscos: 'Dependência de fornecedor único para infraestrutura', observations: 'Revisar escopo de relatórios institucionais',
    records: [
      { id: 'r4', type: 'Dificuldade', content: 'Atraso na liberação da API externa de homologação', date: '25/01/2026' },
      { id: 'r5', type: 'Risco', content: 'Dependência de fornecedor único para infraestrutura', date: '02/02/2026' },
      { id: 'r6', type: 'Observação', content: 'Revisar escopo de relatórios institucionais', date: '04/02/2026' }
    ],
    topics: ['Levantamento de riscos', 'FIT dos produtos', 'Pilares estratégicos', 'Jornada do usuário', 'Identidade visual']
  },
  { 
    id: 'estrategia', title: 'Estratégia', responsible: 'Carla Dias', progress: 65, 
    startDate: '2026-02-06', endDate: '2026-03-20',
    evidence: '', learnings: '', decisions: '', difficulties: '', riscos: '', observations: '',
    records: [],
    topics: ['Alinhamento estratégico', 'OKRs e métricas', 'Estratégia de mercado', 'Experiência do usuário', 'Teste e validação']
  },
  { 
    id: 'lancamento', title: 'Lançamento', responsible: 'Diego Souza', progress: 0, 
    startDate: '2026-03-21', endDate: '2026-04-15',
    evidence: '', learnings: '', decisions: '', difficulties: '', riscos: '', observations: '',
    records: [],
    topics: ['Definição de lançamento', 'Jornada impactada', 'Identidade visual', 'Nome do produto', 'Plano go-to-market']
  },
  { 
    id: 'evolucao', title: 'Evolução', responsible: 'Ana Silva', progress: 0, 
    startDate: '2026-04-16', endDate: '2026-06-30',
    evidence: '', learnings: '', decisions: '', difficulties: '', riscos: '', observations: '',
    records: [],
    topics: ['Roadmap do produto', 'Evidências futures', 'Critérios de priorização']
  },
  { 
    id: 'repasses', title: 'Repasses', responsible: 'Bruno Costa', progress: 0, 
    startDate: '2026-07-01', endDate: '2026-08-15',
    evidence: '', learnings: '', decisions: '', difficulties: '', riscos: '', observations: '',
    records: [],
    topics: ['Acompanhamento métricas', 'Repasses e mentorias', 'Registro de marcas']
  }
];

const formatCurrencyInput = (value: number | undefined | null) => {
  if (value === undefined || value === null || isNaN(value)) return '';
  // Avoid rendering "0,00" if user deleted everything, but wait, returning "0,00" is standard for currency inputs.
  // Actually, returning "" on 0 allows placeholder to show.
  if (value === 0) return '';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseCurrencyInput = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, '');
  if (!onlyNumbers) return 0;
  return Number(onlyNumbers) / 100;
};

const ProductBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const tabRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabRef.current) {
      const scrollAmount = 200;
      tabRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Shared state synchronized through localStorage by product ID
  const [productPhases, setProductPhases] = useState<PhaseData[]>(() => {
    const key = `cis_product_phases_${id}`;
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    return defaultPhases;
  });

  const savePhases = (newPhases: PhaseData[]) => {
    setProductPhases(newPhases);
    localStorage.setItem(`cis_product_phases_${id}`, JSON.stringify(newPhases));
  };

  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  
  // Topic Metadata State
  const [topicMetadata, setTopicMetadata] = useState<Record<string, { 
    context: string, 
    files: string[], 
    startDate: string, 
    endDate: string, 
    responsible: string 
  }>>({});

  const [activePhase, setActivePhase] = useState(productPhases[0].id);
  const [showGuide, setShowGuide] = useState(false);
  const [isImproving, setIsImproving] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [savedVersions, setSavedVersions] = useState<{id: string, version: string, date: string, author: string, status: string, statusColor: string, statusBg: string, changes: string, size: string}[]>([
    { id: 'v5', version: 'v5.0', date: '02/07/2026', author: 'Ana Silva', status: 'Atual', statusColor: 'var(--success)', statusBg: 'rgba(34,197,94,0.08)', changes: 'Atualização do escopo pós-piloto. Inclusão de 3 micro etapas em Lançamento. Revisão de metas financeiras.', size: '2.4 MB' },
    { id: 'v4', version: 'v4.2', date: '18/06/2026', author: 'Bruno Costa', status: 'Aprovado', statusColor: 'var(--primary)', statusBg: 'rgba(18,101,175,0.08)', changes: 'Correção de indicadores financeiros. Adição de evidências da etapa de Estratégia. Atualização do responsável macro.', size: '2.1 MB' },
    { id: 'v3', version: 'v3.1', date: '05/06/2026', author: 'Ana Silva', status: 'Aprovado', statusColor: 'var(--primary)', statusBg: 'rgba(18,101,175,0.08)', changes: 'Revisão completa da seção de precificação. Inclusão de referências bibliográficas regulatórias. Ajuste de datas.', size: '1.9 MB' },
    { id: 'v2', version: 'v2.0', date: '20/05/2026', author: 'Carla Dias', status: 'Arquivado', statusColor: '#64748b', statusBg: 'rgba(100,116,139,0.08)', changes: 'Reestruturação do plano de etapas. Inclusão da aba LGPD. Definição de empresa piloto e critérios de seleção.', size: '1.6 MB' },
    { id: 'v1', version: 'v1.0', date: '02/05/2026', author: 'Ana Silva', status: 'Arquivado', statusColor: '#64748b', statusBg: 'rgba(100,116,139,0.08)', changes: 'Versão inicial do relatório do produto. Cadastro das informações básicas, macro etapas e responsáveis.', size: '0.9 MB' }
  ]);
  const [saveVersionName, setSaveVersionName] = useState('');
  const [saveVersionNotes, setSaveVersionNotes] = useState('');
  const [saveVersionSuccess, setSaveVersionSuccess] = useState(false);
  const [showSavePanel, setShowSavePanel] = useState(false);

  // States for Evolução do Produto (Kanban)
  const [selectedPhase, setSelectedPhase] = useState<PhaseData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [recordType, setRecordType] = useState<'Evidência' | 'Decisão' | 'Aprendizado' | 'Dificuldade' | 'Risco' | 'Observação' | 'Pendência'>('Evidência');
  const [recordText, setRecordText] = useState('');
  const [recordMentions, setRecordMentions] = useState('');
  const [recordAttachments, setRecordAttachments] = useState<File[]>([]);
  const [associationType, setAssociationType] = useState<string>('Macro Etapa');
  const [filterType, setFilterType] = useState<string>('Todos');
  
  // Drive State
  const [driveFiles, setDriveFiles] = useState<{id: string, name: string, size: string, date: string, type: string}[]>([
    { id: '1', name: 'Manual_Gestao_Conhecimento.pdf', size: '2.4 MB', date: '01/03/2026', type: 'application/pdf' },
    { id: '2', name: 'Politica_Seguranca_Informacao.docx', size: '1.1 MB', date: '15/02/2026', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  ]);

  const handleDetailsClick = (phase: PhaseData) => {
    setSelectedPhase(phase);
    setIsDetailsModalOpen(true);
    setRecordType('Evidência');
    setRecordText('');
    setAssociationType('Macro Etapa');
  };

  const handleEditClick = (phase: PhaseData) => {
    setSelectedPhase(phase);
    setIsEditModalOpen(true);
  };

  const handleAddRecord = () => {
    if (!recordText.trim() || !selectedPhase) return;

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
    
    let updatedPhase = {
      ...selectedPhase,
      records: updatedRecords
    };

    // Sync to corresponding single fields for backward compatibility
    if (recordType === 'Evidência') {
      const current = selectedPhase.evidence || '';
      updatedPhase.evidence = current ? `${current}\n- ${recordText}` : `- ${recordText}`;
    } else if (recordType === 'Decisão') {
      const current = selectedPhase.decisions || '';
      updatedPhase.decisions = current ? `${current}\n- ${recordText}` : `- ${recordText}`;
    } else if (recordType === 'Aprendizado') {
      const current = selectedPhase.learnings || '';
      updatedPhase.learnings = current ? `${current}\n- ${recordText}` : `- ${recordText}`;
    } else if (recordType === 'Dificuldade') {
      const current = selectedPhase.difficulties || '';
      updatedPhase.difficulties = current ? `${current}\n- ${recordText}` : `- ${recordText}`;
    } else if (recordType === 'Risco') {
      const current = selectedPhase.riscos || '';
      updatedPhase.riscos = current ? `${current}\n- ${recordText}` : `- ${recordText}`;
    } else if (recordType === 'Observação') {
      const current = selectedPhase.observations || '';
      updatedPhase.observations = current ? `${current}\n- ${recordText}` : `- ${recordText}`;
    }

    setSelectedPhase(updatedPhase);
    savePhases(productPhases.map(p => p.id === selectedPhase.id ? updatedPhase : p));
    setRecordText('');
    setRecordMentions('');
    setRecordAttachments([]);
    setAssociationType('Macro Etapa');
  };

  const handleDeleteRecord = (recordId: string) => {
    if (!selectedPhase) return;

    const updatedRecords = (selectedPhase.records || []).filter(r => r.id !== recordId);
    const updatedPhase = {
      ...selectedPhase,
      records: updatedRecords
    };

    setSelectedPhase(updatedPhase);
    savePhases(productPhases.map(p => p.id === selectedPhase.id ? updatedPhase : p));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPhase) {
      savePhases(productPhases.map(p => p.id === selectedPhase.id ? selectedPhase : p));
      setIsEditModalOpen(false);
    }
  };

  const handleAddPhase = () => {
    const newId = `fase-${Date.now()}`;
    const newPhase: PhaseData = {
      id: newId,
      title: 'Nova Macro Etapa',
      responsible: 'Gestor',
      progress: 0,
      startDate: '',
      endDate: '',
      evidence: '',
      learnings: '',
      decisions: '',
      difficulties: '',
      riscos: '',
      observations: '',
      records: [],
      topics: ['Nova Micro Etapa']
    };
    savePhases([...productPhases, newPhase]);
    setActivePhase(newId);
  };

  const handleRemovePhase = (phaseId: string) => {
    if (confirm('Deseja realmente remover esta macro etapa?')) {
      const newPhases = productPhases.filter(p => p.id !== phaseId);
      savePhases(newPhases);
      if (activePhase === phaseId && newPhases.length > 0) {
        setActivePhase(newPhases[0].id);
      }
    }
  };

  const handleAddTopic = (phaseId: string) => {
    const newTopic = `Nova Micro Etapa ${productPhases.find(p => p.id === phaseId)?.topics?.length || 0 + 1}`;
    const newPhases = productPhases.map(p => 
      p.id === phaseId ? { ...p, topics: [...(p.topics || []), newTopic] } : p
    );
    savePhases(newPhases);
  };

  const handleImproveTopicText = (topic: string) => {
    const currentText = topicMetadata[topic]?.context || '';
    if (!currentText) return;
    setIsImproving(topic);
    setTimeout(() => {
      const improvedText = `[REVISADO POR IA]: ${currentText}\n\nAnálise: Refinado para conformidade institucional e clareza estratégica.`;
      handleUpdateTopicMetadata(topic, 'context', improvedText);
      setIsImproving(null);
    }, 1500);
  };

  // New Team State
  const [team, setTeam] = useState([
    { role: 'Gestor Responsável', name: 'Ana Silva', description: '', hours: 0, hourlyRate: 0 },
    { role: 'Product Owner', name: '', description: '', hours: 0, hourlyRate: 0 },
    { role: 'Scrum Master', name: '', description: '', hours: 0, hourlyRate: 0 }
  ]);

  const [expenses, setExpenses] = useState<{name: string, description: string, value: number}[]>([]);

  const expensesTotal = expenses.reduce((acc, exp) => acc + (Number(exp.value) || 0), 0);

  const recursosAplicados = team.reduce((acc, member) => {
    const hours = Number(member.hours) || 0;
    const rate = Number(member.hourlyRate) || 0;
    return acc + (hours * rate);
  }, 0) + expensesTotal;

  const professionalRoles = [
    'Designer UI/UX',
    'Desenvolvedor Frontend',
    'Desenvolvedor Backend',
    'Analista de QA',
    'Arquiteto de Soluções',
    'Analista de Dados',
    'Especialista em Segurança'
  ];

  const [productDetails, setProductDetails] = useState({
    name: id === '1' ? 'Portal do Cidadão V2' : id === '2' ? 'App Gestão Industrial' : 'Produto CIS',
    category: 'Software / Institucional',
    link: '',
    description: 'Este produto visa integrar os serviços institucionais em uma plataforma única e intuitiva.',
    startDate: '2024-01-15',
    endDate: '2024-12-20',
    complexity: 'Média',
    totalValue: 150000
  });

  const saldoDisponivel = (Number(productDetails.totalValue) || 0) - recursosAplicados;

  const [pricingData, setPricingData] = useState({
    custoHospedagem: 0,
    custoDesenvolvimento: 0,
    custoPublicidade: 0,
    contratosTerceiros: 0,
    outrosCustosFixos: 0,
    outrosCustosVariaveis: 0,
    markup: 0,
    equipeExecucao: 0,
    esforco: 'Baixo',
    modelo: 'Por assinatura',
    quantidadeClientes: 1,
    estimativaROI: ''
  });

  const getEsforcoPercent = (nivel: string) => {
    if (nivel === 'Alto') return 0.15;
    if (nivel === 'Médio') return 0.10;
    return 0.06;
  };

  const totalFixos = (Number(pricingData.custoDesenvolvimento) || 0) + (Number(pricingData.outrosCustosFixos) || 0) + (Number(pricingData.equipeExecucao) || 0);
  const totalVariaveis = (Number(pricingData.custoHospedagem) || 0) + (Number(pricingData.custoPublicidade) || 0) + (Number(pricingData.contratosTerceiros) || 0) + (Number(pricingData.outrosCustosVariaveis) || 0);
  const totalCustosBase = totalFixos + totalVariaveis;
  const custoEsforco = (Number(pricingData.equipeExecucao) || 0) * getEsforcoPercent(pricingData.esforco);
  const totalCustosComEsforco = totalCustosBase + custoEsforco;

  const markupPercent = Number(pricingData.markup) || 0;
  const margemLucro = markupPercent > 0 ? (markupPercent / (100 + markupPercent)) * 100 : 0;
  const precoTotalComMarkup = totalCustosComEsforco * (1 + (markupPercent / 100));

  const precoFinal = pricingData.modelo === 'Por assinatura' && (Number(pricingData.quantidadeClientes) || 0) > 0 
                     ? precoTotalComMarkup / Number(pricingData.quantidadeClientes) 
                     : precoTotalComMarkup;

  const [knowledgeData, setKnowledgeData] = useState({
    aprendizados: '',
    decisoes: '',
    dificuldades: '',
    riscos: '',
    observacoes: ''
  });

  const [pilotoData, setPilotoData] = useState({
    nomeEmpresa: '',
    razaoSocial: '',
    cnpj: '',
    segmento: '',
    porte: '',
    unidade: '',
    responsavel: '',
    cargo: '',
    contatos: '',
    status: 'Em implantação',
    dataInicio: '',
    dataFim: '',
    objetivo: '',
    setorValidado: '',
    oQueFoiTestado: '',
    comoFoiTestado: '',
    resultados: '',
    evidencias: ''
  });

  const [productImages, setProductImages] = useState<{id: number, url: string, nome: string, descricao: string, funcionalidade: string, data: string, responsavel: string, versao: string, status: string}[]>([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [newImage, setNewImage] = useState({
    url: '',
    nome: '',
    descricao: '',
    funcionalidade: '',
    data: '',
    responsavel: '',
    versao: '',
    status: 'Homologação'
  });
  const [imageLayout, setImageLayout] = useState<'grid' | 'carrossel'>('grid');
  const [imageFilter, setImageFilter] = useState('');

  const progress = 65;

  const handleAddTeamMember = () => {
    setTeam([...team, { role: '', name: '', description: '', hours: 0, hourlyRate: 0 }]);
  };

  const handleUpdateTeamMember = (index: number, field: 'role' | 'name' | 'description' | 'hours' | 'hourlyRate', value: any) => {
    const newTeam = [...team];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setTeam(newTeam);
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { name: '', description: '', value: 0 }]);
  };

  const handleUpdateExpense = (index: number, field: 'name' | 'description' | 'value', value: any) => {
    const newExpenses = [...expenses];
    newExpenses[index] = { ...newExpenses[index], [field]: value };
    setExpenses(newExpenses);
  };

  const handleRemoveExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleRemoveTeamMember = (index: number) => {
    setTeam(team.filter((_, i) => i !== index));
  };

  const handleUpdateTopicMetadata = (topic: string, field: string, value: string) => {
    setTopicMetadata(prev => ({
      ...prev,
      [topic]: {
        ...(prev[topic] || { context: '', files: [], startDate: '', endDate: '', responsible: '' }),
        [field]: value
      }
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="fade-up">
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111111' }}>Informações sobre o Produto</h3>
                <p style={{ color: '#111111', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Cadastre e atualize as informações essenciais do ciclo estratégico do produto.</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Nome do Produto</label>
                    <input 
                      style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }}
                      value={productDetails.name}
                      onChange={e => setProductDetails({...productDetails, name: e.target.value})}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Link do Produto</label>
                    <div style={{ position: 'relative' }}>
                      <LinkIcon size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#111111', opacity: 0.7 }} />
                      <input 
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }}
                        placeholder="https://..."
                        value={productDetails.link}
                        onChange={e => setProductDetails({...productDetails, link: e.target.value})}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Categoria</label>
                    <select 
                      style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'white' }}
                      value={productDetails.category}
                      onChange={e => setProductDetails({...productDetails, category: e.target.value})}
                    >
                      <option>Software / Institucional</option>
                      <option>Hardware / Equipamento</option>
                      <option>Serviço / Consultoria</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Descrição do Produto</label>
                    <textarea 
                      style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '90px', resize: 'none' }}
                      value={productDetails.description}
                      onChange={e => setProductDetails({...productDetails, description: e.target.value})}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Data de Início</label>
                      <input type="date" style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={productDetails.startDate} onChange={e => setProductDetails({...productDetails, startDate: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Prazo de Conclusão</label>
                      <input type="date" style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={productDetails.endDate} onChange={e => setProductDetails({...productDetails, endDate: e.target.value})} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Complexidade</label>
                      <select 
                        style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'white' }}
                        value={productDetails.complexity}
                        onChange={e => setProductDetails({...productDetails, complexity: e.target.value})}
                      >
                        <option>Baixa</option>
                        <option>Média</option>
                        <option>Alta</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Valor Total do Produto (R$)</label>
                      <input 
                        type="text"
                        style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }}
                        value={formatCurrencyInput(productDetails.totalValue)}
                        onChange={e => setProductDetails({...productDetails, totalValue: parseCurrencyInput(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111111' }}>Equipe do Produto</h3>
                  <p style={{ color: '#111111', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Gerencie os profissionais alocados no desenvolvimento técnico e estratégico.</p>
                </div>
                <button 
                  onClick={handleAddTeamMember}
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Adicionar Profissional
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {team.map((member, idx) => {
                  const initial = member.name ? member.name.charAt(0).toUpperCase() : '?';
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '1.75rem', 
                        background: 'rgba(255, 255, 255, 0.85)', 
                        borderRadius: '24px', 
                        border: '1px solid rgba(18, 101, 175, 0.06)', 
                        position: 'relative',
                        boxShadow: '0 8px 24px rgba(18, 101, 175, 0.04)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(18, 101, 175, 0.08)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(18, 101, 175, 0.04)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {idx > 2 && (
                        <button 
                          onClick={() => handleRemoveTeamMember(idx)}
                          style={{ 
                            position: 'absolute', 
                            right: '1.25rem', 
                            top: '1.25rem', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            color: 'var(--danger)',
                            padding: '0.4rem',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      )}
                      
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.75rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, rgba(18,101,175,0.1), rgba(18,101,175,0.02))',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          border: '1px solid rgba(18,101,175,0.1)'
                        }}>
                          {initial}
                        </div>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                            {member.role || 'Novo Integrante'}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {member.name || 'Nome não definido'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Função */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Função</label>
                          {idx <= 2 ? (
                            <div style={{ 
                              padding: '0.6rem 1rem', 
                              fontWeight: 700, 
                              fontSize: '0.85rem', 
                              background: 'rgba(18, 101, 175, 0.04)', 
                              borderRadius: '12px', 
                              color: 'var(--primary)', 
                              border: '1px solid rgba(18, 101, 175, 0.08)',
                              display: 'inline-block',
                              width: 'fit-content'
                            }}>
                              {member.role}
                            </div>
                          ) : (
                            <select 
                              style={{ width: '100%' }}
                              value={member.role}
                              onChange={e => handleUpdateTeamMember(idx, 'role', e.target.value)}
                            >
                              <option value="">Selecione...</option>
                              {professionalRoles.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                          )}
                        </div>

                        {/* Descrição */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descrição das Responsabilidades</label>
                          <textarea 
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            placeholder="Descreva as responsabilidades no produto..."
                            value={member.description || ''}
                            onChange={e => handleUpdateTeamMember(idx, 'description', e.target.value)}
                          />
                        </div>

                        {/* Nome do Profissional */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nome do Profissional</label>
                          <input 
                            placeholder="Digite o nome completo..."
                            value={member.name}
                            onChange={e => handleUpdateTeamMember(idx, 'name', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'construcao': {
        const activePhaseObj = productPhases.find(p => p.id === activePhase) || productPhases[0];
        
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }} className="fade-up">
            {/* Left Column: Macro Stages List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
                <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#111111', letterSpacing: '0.08em', fontWeight: 700 }}>Macro Etapas</h3>
                <button 
                  onClick={handleAddPhase} 
                  style={{ background: 'rgba(18, 101, 175, 0.08)', border: 'none', color: 'var(--primary)', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                  title="Adicionar Macro Etapa"
                >
                  <Plus size={16} />
                </button>
              </div>
              {productPhases.map((phase) => (
                <div key={phase.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => setActivePhase(phase.id)}
                    style={{ 
                      flex: 1,
                      padding: '0.9rem 1.25rem', 
                      borderRadius: '14px', 
                      border: '1px solid',
                      borderColor: activePhase === phase.id ? 'var(--primary)' : 'rgba(18, 101, 175, 0.06)',
                      background: activePhase === phase.id ? 'rgba(18, 101, 175, 0.06)' : 'rgba(255, 255, 255, 0.7)',
                      color: activePhase === phase.id ? 'var(--primary)' : '#111111',
                      textAlign: 'left', 
                      cursor: 'pointer', 
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                      fontSize: '0.9rem', 
                      fontWeight: activePhase === phase.id ? 600 : 500,
                      boxShadow: activePhase === phase.id ? '0 4px 12px rgba(18, 101, 175, 0.04)' : 'none'
                    }}
                    onMouseEnter={e => {
                      if(activePhase !== phase.id) e.currentTarget.style.borderColor = 'rgba(18, 101, 175, 0.2)';
                    }}
                    onMouseLeave={e => {
                      if(activePhase !== phase.id) e.currentTarget.style.borderColor = 'rgba(18, 101, 175, 0.06)';
                    }}
                  >
                    {phase.title}
                  </button>
                  <button 
                    onClick={() => handleRemovePhase(phase.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'var(--danger)', 
                      padding: '8px',
                      borderRadius: '8px'
                    }}
                    title="Remover Macro Etapa"
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Right Column: Macro and Micro Stage details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Macro Stage Details Card */}
              <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'linear-gradient(135deg, white 0%, rgba(18, 101, 175, 0.01) 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <span className="badge badge-info" style={{ textTransform: 'uppercase', fontSize: '0.65rem', padding: '0.25rem 0.6rem' }}>Macro Etapa</span>
                    <input 
                      style={{ fontSize: '1.6rem', fontWeight: 800, border: 'none', background: 'transparent', outline: 'none', flex: 1, borderBottom: '1px dashed rgba(18, 101, 175, 0.2)', paddingBottom: '0.2rem', borderRadius: 0, boxShadow: 'none' }}
                      value={activePhaseObj.title}
                      onChange={(e) => {
                        const newPhases = productPhases.map(p => p.id === activePhaseObj.id ? { ...p, title: e.target.value } : p);
                        savePhases(newPhases);
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contexto / Escopo da Macro Etapa</label>
                      <textarea 
                        style={{ width: '100%', padding: '0.85rem 1.05rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '130px', resize: 'vertical' }}
                        placeholder="Descreva o escopo geral, metas estratégicas e objetivos da macro etapa..."
                        value={activePhaseObj.evidence || ''}
                        onChange={(e) => {
                          const newPhases = productPhases.map(p => p.id === activePhaseObj.id ? { ...p, evidence: e.target.value } : p);
                          savePhases(newPhases);
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px dashed var(--primary)',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: 'rgba(18, 101, 175, 0.03)',
                        transition: 'all 0.2s'
                      }}>
                        <Paperclip size={15} /> Anexar Evidência
                        <input 
                          type="file" 
                          style={{ display: 'none' }} 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const current = activePhaseObj.evidence || '';
                              const separator = current ? '\n' : '';
                              const newPhases = productPhases.map(p => p.id === activePhaseObj.id ? { 
                                ...p, 
                                evidence: `${current}${separator}[Arquivo Anexado: ${file.name}]` 
                              } : p);
                              savePhases(newPhases);
                              alert(`Arquivo "${file.name}" anexado com sucesso à Macro Etapa!`);
                            }
                          }}
                        />
                      </label>
                      <button 
                        onClick={() => {
                          const current = activePhaseObj.evidence || '';
                          if (!current) return;
                          setIsImproving(activePhaseObj.id);
                          setTimeout(() => {
                            const newPhases = productPhases.map(p => p.id === activePhaseObj.id ? { 
                              ...p, 
                              evidence: `[REVISADO POR ORÁCULO IA]: ${current}\n\nAnálise: Macro etapa refinada estrategicamente para conformidade institucional.` 
                            } : p);
                            savePhases(newPhases);
                            setIsImproving(null);
                          }, 1000);
                        }}
                        disabled={!activePhaseObj.evidence || isImproving === activePhaseObj.id}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'rgba(18, 101, 175, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                      >
                        {isImproving === activePhaseObj.id ? <RefreshCw className="spin" size={15} /> : <Sparkles size={15} />}
                        Melhorar com Oráculo IA
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '18px', border: '1px solid rgba(18, 101, 175, 0.08)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111111' }}>Data de Início</label>
                      <input 
                        type="date" 
                        style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }} 
                        value={activePhaseObj.startDate || ''} 
                        onChange={(e) => {
                          const newPhases = productPhases.map(p => p.id === activePhaseObj.id ? { ...p, startDate: e.target.value } : p);
                          savePhases(newPhases);
                        }} 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111111' }}>Data de Término</label>
                      <input 
                        type="date" 
                        style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }} 
                        value={activePhaseObj.endDate || ''} 
                        onChange={(e) => {
                          const newPhases = productPhases.map(p => p.id === activePhaseObj.id ? { ...p, endDate: e.target.value } : p);
                          savePhases(newPhases);
                        }} 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111111' }}>Responsáveis Macro</label>
                      <input 
                        style={{ padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }} 
                        placeholder="Nomes separados por vírgula..." 
                        value={activePhaseObj.responsible || ''} 
                        onChange={(e) => {
                          const newPhases = productPhases.map(p => p.id === activePhaseObj.id ? { ...p, responsible: e.target.value } : p);
                          savePhases(newPhases);
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro Stages Section */}
              <div className="glass-card" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 700, color: '#111111' }}>Micro Etapas</h3>
                    <p style={{ color: '#111111', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Acompanhe e detalhe as atividades técnicas específicas desta macro etapa.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const newTopic = `Nova Micro Etapa ${activePhaseObj.topics ? activePhaseObj.topics.length + 1 : 1}`;
                      const newPhases = productPhases.map(p => p.id === activePhaseObj.id ? {
                        ...p,
                        topics: [...(p.topics || []), newTopic]
                      } : p);
                      savePhases(newPhases);
                    }} 
                    className="btn-primary" 
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '12px' }}
                  >
                    <Plus size={16} /> Adicionar Micro Etapa
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(activePhaseObj.topics || []).map((topic) => {
                    const isExpanded = expandedTopic === topic;
                    const metadata = topicMetadata[topic] || { context: '', startDate: '', endDate: '', responsible: '' };

                    return (
                      <div key={topic} style={{ border: '1px solid rgba(18, 101, 175, 0.08)', borderRadius: '14px', overflow: 'hidden', background: 'white', boxShadow: '0 2px 8px rgba(18, 101, 175, 0.01)' }}>
                        <div 
                          onClick={() => setExpandedTopic(isExpanded ? null : topic)}
                          style={{ padding: '1.25rem 1.5rem', background: isExpanded ? 'rgba(18, 101, 175, 0.02)' : 'white', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        >
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                          <span style={{ flex: 1, fontWeight: 600, color: '#111111', fontSize: '0.95rem' }}>{topic}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newPhases = productPhases.map(p => p.id === activePhaseObj.id ? {
                                ...p,
                                topics: (p.topics || []).filter(t => t !== topic)
                              } : p);
                              savePhases(newPhases);
                            }}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer', 
                              color: 'var(--danger)', 
                              marginRight: '0.5rem',
                              padding: '6px',
                              borderRadius: '6px'
                            }}
                            title="Excluir Micro Etapa"
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <Trash2 size={14} />
                          </button>
                          {isExpanded ? <ChevronUp size={18} color="#111111" /> : <ChevronDown size={18} color="#111111" />}
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                              <div style={{ padding: '1.75rem', background: 'rgba(18, 101, 175, 0.01)', borderTop: '1px solid rgba(18, 101, 175, 0.06)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.75rem' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contexto da Micro Etapa</label>
                                      <textarea 
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '125px', resize: 'vertical' }}
                                        placeholder="Descreva o contexto técnico, descobertas e atividades executadas..."
                                        value={metadata.context}
                                        onChange={e => handleUpdateTopicMetadata(topic, 'context', e.target.value)}
                                      />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                      <label style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.7rem',
                                        borderRadius: '10px',
                                        border: '1px dashed var(--primary)',
                                        color: 'var(--primary)',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        background: 'rgba(18, 101, 175, 0.03)',
                                        transition: 'all 0.2s'
                                      }}>
                                        <Paperclip size={14} /> Anexar Evidência
                                        <input 
                                          type="file" 
                                          style={{ display: 'none' }} 
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const current = metadata.context || '';
                                              const separator = current ? '\n' : '';
                                              handleUpdateTopicMetadata(topic, 'context', `${current}${separator}[Arquivo Anexado: ${file.name}]`);
                                              alert(`Arquivo "${file.name}" anexado com sucesso à Micro Etapa!`);
                                            }
                                          }}
                                        />
                                      </label>
                                      <button 
                                        onClick={() => handleImproveTopicText(topic)}
                                        disabled={!metadata.context || isImproving === topic}
                                        style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', border: 'none', background: 'rgba(18, 101, 175, 0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                                      >
                                        {isImproving === topic ? <RefreshCw className="spin" size={14} /> : <Sparkles size={14} />}
                                        Melhorar com Oráculo IA
                                      </button>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem', background: 'white', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.08)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#111111' }}>Data de Início</label>
                                      <input type="date" style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }} value={metadata.startDate} onChange={e => handleUpdateTopicMetadata(topic, 'startDate', e.target.value)} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#111111' }}>Data de Término</label>
                                      <input type="date" style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }} value={metadata.endDate} onChange={e => handleUpdateTopicMetadata(topic, 'endDate', e.target.value)} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#111111' }}>Responsáveis Micro</label>
                                      <input style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }} placeholder="Nomes separados por vírgula..." value={metadata.responsible} onChange={e => handleUpdateTopicMetadata(topic, 'responsible', e.target.value)} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        );
      }
      case 'conhecimento': {
        const allRecords = productPhases.flatMap(phase => 
          (phase.records || []).map(record => ({
            ...record,
            phaseTitle: phase.title,
            phaseId: phase.id
          }))
        );

        const filteredRecords = filterType === 'Todos' 
          ? allRecords 
          : allRecords.filter(r => r.type === filterType);

        const groupStyles: Record<string, { bg: string, color: string, icon: React.ReactNode }> = {
          'Evidência': { bg: 'rgba(18, 101, 175, 0.08)', color: 'var(--primary)', icon: <Paperclip size={15} /> },
          'Decisão': { bg: '#e0f2fe', color: '#0369a1', icon: <Target size={15} /> },
          'Aprendizado': { bg: '#dcfce7', color: '#15803d', icon: <Brain size={15} /> },
          'Dificuldade': { bg: '#fee2e2', color: '#b91c1c', icon: <AlertTriangle size={15} /> },
          'Risco': { bg: '#fef3c7', color: '#b45309', icon: <ShieldCheck size={15} /> },
          'Observação': { bg: '#f1f5f9', color: '#475569', icon: <MessageSquare size={15} /> },
          'Pendência': { bg: '#f3e8ff', color: '#7c3aed', icon: <Clock size={15} /> }
        };

        return (
          <div className="glass-card fade-up" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#111111' }}>Gestão de Conhecimento do Produto</h2>
                <p style={{ color: '#111111', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>Repositório consolidado e reativo de inteligência estratégica gerada durante o ciclo de vida.</p>
              </div>
              
              <div style={{ background: 'rgba(18, 101, 175, 0.06)', padding: '0.6rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.1)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                Total de Registros: {allRecords.length}
              </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(18, 101, 175, 0.08)' }}>
              {['Todos', 'Evidência', 'Decisão', 'Aprendizado', 'Dificuldade', 'Risco', 'Observação', 'Pendência'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: filterType === type ? 'var(--primary)' : 'rgba(18, 101, 175, 0.08)',
                    background: filterType === type ? 'var(--primary)' : 'white',
                    color: filterType === type ? 'white' : '#111111',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {type === 'Todos' ? 'Todos os Registros' : type}
                </button>
              ))}
            </div>

            {/* Records List */}
            {filteredRecords.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(18, 101, 175, 0.01)', borderRadius: '16px', border: '1px dashed rgba(18, 101, 175, 0.12)' }}>
                <Brain size={48} color="#111111" style={{ margin: '0 auto 1.25rem', opacity: 0.4 }} />
                <h3 style={{ margin: 0, color: '#111111', fontSize: '1.15rem' }}>Nenhum registro encontrado</h3>
                <p style={{ color: '#111111', fontSize: '0.875rem', marginTop: '0.5rem' }}>Adicione novos aprendizados, evidências ou decisões através da aba **Evolução do Produto** para consolidar a base de conhecimento.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredRecords.map((record) => {
                  const style = groupStyles[record.type] || { bg: '#f1f5f9', color: '#475569', icon: <Info size={15} /> };
                  return (
                    <div 
                      key={record.id}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem', 
                        background: 'white', 
                        borderRadius: '16px', 
                        border: '1px solid rgba(18, 101, 175, 0.05)',
                        boxShadow: '0 2px 8px rgba(18, 101, 175, 0.01)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                        {/* Type Icon Badge */}
                        <div style={{ 
                          width: '38px', 
                          height: '38px', 
                          borderRadius: '10px', 
                          background: style.bg, 
                          color: style.color, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {style.icon}
                        </div>

                        {/* Content & Tag */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111111' }}>{record.content}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 700, 
                              textTransform: 'uppercase', 
                              background: 'rgba(18, 101, 175, 0.04)', 
                              color: '#111111', 
                              padding: '0.15rem 0.5rem', 
                              borderRadius: '6px',
                              border: '1px solid rgba(18, 101, 175, 0.05)'
                            }}>
                              Etapa: {record.phaseTitle}
                            </span>
                            {record.microStage && record.microStage !== 'Macro Etapa' && (
                              <span style={{ 
                                fontSize: '0.7rem', 
                                fontWeight: 700, 
                                textTransform: 'uppercase', 
                                background: 'rgba(18, 101, 175, 0.06)', 
                                color: 'var(--primary)', 
                                padding: '0.15rem 0.5rem', 
                                borderRadius: '6px',
                                border: '1px solid rgba(18, 101, 175, 0.1)'
                              }}>
                                Micro: {record.microStage}
                              </span>
                            )}
                            <span style={{ fontSize: '0.75rem', color: '#111111' }}>Cadastrado em {record.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delete action directly synchronized */}
                      <button 
                        onClick={() => {
                          if (confirm('Deseja realmente remover este registro da base de conhecimento?')) {
                            const newPhases = productPhases.map(p => {
                              if (p.id === record.phaseId) {
                                return {
                                  ...p,
                                  records: (p.records || []).filter(r => r.id !== record.id)
                                };
                              }
                              return p;
                            });
                            savePhases(newPhases);
                          }
                        }}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          color: 'var(--danger)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px',
                          borderRadius: '8px',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        title="Remover Registro"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      case 'evolucao_produto': {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="fade-up">
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700, color: '#111111' }}>Evolução do Produto (Kanban)</h2>
              <p style={{ color: '#111111', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Acompanhamento tático de progresso e governança deste produto.</p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1.25rem' }}>
              {productPhases.map(phase => (
                <div key={phase.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px', flexShrink: 0 }}>
                  <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#111111', paddingLeft: '0.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>{phase.title}</h3>
                  
                  {/* Kanban Card */}
                  <div className="glass-card" style={{ padding: '1.5rem', minHeight: '170px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.85)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span className="badge badge-info" style={{ fontSize: '0.68rem', fontWeight: 700 }}>{phase.title}</span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button 
                          onClick={() => handleDetailsClick(phase)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            color: '#111111', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            padding: '6px',
                            borderRadius: '6px'
                          }} 
                          title="Ver Detalhes e Governança"
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(18, 101, 175, 0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditClick(phase)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            color: '#111111', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            padding: '6px',
                            borderRadius: '6px'
                          }} 
                          title="Editar Etapa"
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(18, 101, 175, 0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <Edit3 size={15} />
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                        <span style={{ color: '#111111', fontWeight: 600 }}>Progresso</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{phase.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(18, 101, 175, 0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${phase.progress}%`, height: '100%', background: phase.progress === 100 ? 'var(--success)' : 'var(--primary)', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: '#111111' }}>
                      <div style={{ 
                        width: '26px', 
                        height: '26px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        boxShadow: '0 2px 6px rgba(18, 101, 175, 0.15)'
                      }}>
                        {phase.responsible ? phase.responsible.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span style={{ fontWeight: 600, color: '#111111' }}>{phase.responsible || 'Sem responsável'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'financeiro':
        return (
          <div className="glass-card fade-up" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#111111' }}>Gestão Financeira</h2>
              <p style={{ color: '#111111', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Acompanhamento orçamentário e valor de mercado do projeto em tempo real.</p>
            </div>

            {/* Financial Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              
              <div style={{ padding: '1.75rem', background: 'white', borderRadius: '18px', border: '1px solid rgba(18, 101, 175, 0.06)', boxShadow: 'var(--shadow-sm)' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor Total do Produto</label>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>
                  R$ {(Number(productDetails.totalValue) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p style={{ fontSize: '0.72rem', color: '#111111', marginTop: '0.5rem', margin: 0 }}>Parâmetro definido na aba de informações.</p>
              </div>

              <div style={{ padding: '1.75rem', background: 'rgba(34, 197, 94, 0.03)', borderRadius: '18px', border: '1px solid rgba(34, 197, 94, 0.15)', boxShadow: 'var(--shadow-sm)' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recursos Aplicados</label>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', letterSpacing: '-0.02em' }}>
                  R$ {recursosAplicados.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p style={{ fontSize: '0.72rem', color: '#166534', marginTop: '0.5rem', margin: 0 }}>Custo consolidado de equipe + despesas adicionais.</p>
              </div>

              <div style={{ padding: '1.75rem', background: saldoDisponivel >= 0 ? 'rgba(18, 101, 175, 0.03)' : 'rgba(239, 68, 68, 0.03)', borderRadius: '18px', border: `1px solid ${saldoDisponivel >= 0 ? 'rgba(18, 101, 175, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`, boxShadow: 'var(--shadow-sm)' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111111', marginBottom: '0.5rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saldo Disponível</label>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: saldoDisponivel >= 0 ? 'var(--primary)' : 'var(--danger)', letterSpacing: '-0.02em' }}>
                  R$ {saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p style={{ fontSize: '0.72rem', color: saldoDisponivel >= 0 ? 'var(--primary-dark)' : '#b91c1c', marginTop: '0.5rem', margin: 0 }}>Diferencial (Valor Total - Recursos Aplicados).</p>
              </div>
            </div>

            {/* Team Cost Breakdown */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(18, 101, 175, 0.08)', paddingBottom: '0.75rem', fontWeight: 700, color: '#111111' }}>Detalhamento de Custos com Equipe (Recursos Aplicados)</h3>
            
            <div style={{ overflowX: 'auto', marginBottom: '3.5rem', border: '1px solid rgba(18, 101, 175, 0.06)', borderRadius: '14px', background: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(18, 101, 175, 0.08)', color: '#111111', background: 'rgba(18, 101, 175, 0.02)' }}>
                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem' }}>Papel / Função</th>
                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem' }}>Nome do Profissional</th>
                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', width: '130px' }}>Horas</th>
                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', width: '200px' }}>Valor Hora (R$)</th>
                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Valor Total Previsto</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member, idx) => {
                    const hours = Number(member.hours) || 0;
                    const rate = Number(member.hourlyRate) || 0;
                    const total = hours * rate;

                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(18, 101, 175, 0.04)' }} className="product-row">
                        <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.9rem', color: '#111111' }}>{member.role || '-'}</td>
                        <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.9rem' }}>{member.name || '-'}</td>
                        <td style={{ padding: '0.75rem 1.25rem' }}>
                          <input 
                            type="number"
                            min="0"
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }}
                            value={member.hours || ''}
                            onChange={(e) => handleUpdateTeamMember(idx, 'hours', Number(e.target.value))}
                            placeholder="0"
                          />
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem' }}>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#111111', fontWeight: 600 }}>R$</span>
                            <input 
                              type="text"
                              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.1rem', borderRadius: '10px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }}
                              value={formatCurrencyInput(member.hourlyRate)}
                              onChange={(e) => handleUpdateTeamMember(idx, 'hourlyRate', parseCurrencyInput(e.target.value))}
                              placeholder="0,00"
                            />
                          </div>
                        </td>
                        <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right', fontWeight: 700, color: '#111111', fontSize: '0.95rem' }}>
                          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Expenses Breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(18, 101, 175, 0.08)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: '#111111' }}>Despesas Adicionais</h3>
              <button 
                onClick={handleAddExpense}
                className="btn-primary"
                style={{ padding: '0.55rem 1.1rem', borderRadius: '10px', fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Adicionar Despesa
              </button>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid rgba(18, 101, 175, 0.06)', borderRadius: '14px', background: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(18, 101, 175, 0.08)', color: '#111111', background: 'rgba(18, 101, 175, 0.02)' }}>
                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem' }}>Nome da Despesa</th>
                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem' }}>Descrição</th>
                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', width: '200px' }}>Valor (R$)</th>
                    <th style={{ padding: '1.1rem 1.25rem', fontWeight: 600, fontSize: '0.85rem', width: '180px', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#111111', fontSize: '0.9rem', fontWeight: 600 }}>
                        Nenhuma despesa adicional cadastrada no momento.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(18, 101, 175, 0.04)' }} className="product-row">
                        <td style={{ padding: '0.75rem 1.25rem' }}>
                          <input 
                            type="text"
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }}
                            value={expense.name}
                            onChange={(e) => handleUpdateExpense(idx, 'name', e.target.value)}
                            placeholder="Ex: Servidores em Cloud"
                          />
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem' }}>
                          <input 
                            type="text"
                            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }}
                            value={expense.description}
                            onChange={(e) => handleUpdateExpense(idx, 'description', e.target.value)}
                            placeholder="Descrição complementar..."
                          />
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem' }}>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#111111' }}>R$</span>
                            <input 
                              type="text"
                              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.1rem', borderRadius: '10px', border: '1px solid rgba(18, 101, 175, 0.12)', fontSize: '0.85rem' }}
                              value={formatCurrencyInput(expense.value)}
                              onChange={(e) => handleUpdateExpense(idx, 'value', parseCurrencyInput(e.target.value))}
                              placeholder="0,00"
                            />
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                            <button 
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)', padding: '6px', borderRadius: '6px' }}
                              title="Salvar Despesa"
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--success-bg)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <label 
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Anexar Nota Fiscal / Comprovante"
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-glow-sm)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                              <Paperclip size={16} />
                              <input type="file" style={{ display: 'none' }} onChange={() => alert('Nota Fiscal anexada à despesa com sucesso!')} />
                            </label>
                            <button 
                              onClick={() => handleRemoveExpense(idx)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '6px', borderRadius: '6px' }}
                              title="Remover Despesa"
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        );
      case 'precificacao':
        return (
          <div className="glass-card fade-up" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#111111' }}>Precificação do Produto</h2>
              <p style={{ color: '#111111', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Gestão estratégica de CAPEX/OPEX, premissas de markup e simulação de ROI.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
              {/* Custos Fixos */}
              <div style={{ padding: '1.75rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '18px', border: '1px solid rgba(18, 101, 175, 0.08)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(18, 101, 175, 0.08)', paddingBottom: '0.5rem', fontWeight: 700, color: '#111111' }}>Custos Fixos (CAPEX)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Custo de Desenvolvimento (R$)</label>
                    <input type="text" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={formatCurrencyInput(pricingData.custoDesenvolvimento)} onChange={e => setPricingData({...pricingData, custoDesenvolvimento: parseCurrencyInput(e.target.value)})} placeholder="0,00" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Custo da Equipe de Execução (R$)</label>
                    <input type="text" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={formatCurrencyInput(pricingData.equipeExecucao)} onChange={e => setPricingData({...pricingData, equipeExecucao: parseCurrencyInput(e.target.value)})} placeholder="0,00" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Outros Custos Fixos (R$)</label>
                    <input type="text" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={formatCurrencyInput(pricingData.outrosCustosFixos)} onChange={e => setPricingData({...pricingData, outrosCustosFixos: parseCurrencyInput(e.target.value)})} placeholder="0,00" />
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(18, 101, 175, 0.08)', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem', color: '#111111' }}>
                  <span>Total Fixos:</span>
                  <span>R$ {totalFixos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Custos Variáveis */}
              <div style={{ padding: '1.75rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '18px', border: '1px solid rgba(18, 101, 175, 0.08)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(18, 101, 175, 0.08)', paddingBottom: '0.5rem', fontWeight: 700, color: '#111111' }}>Custos Variáveis / Recorrentes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Custo Hospedagem (R$)</label>
                    <input type="text" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={formatCurrencyInput(pricingData.custoHospedagem)} onChange={e => setPricingData({...pricingData, custoHospedagem: parseCurrencyInput(e.target.value)})} placeholder="0,00" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Custo com Publicidade (R$)</label>
                    <input type="text" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={formatCurrencyInput(pricingData.custoPublicidade)} onChange={e => setPricingData({...pricingData, custoPublicidade: parseCurrencyInput(e.target.value)})} placeholder="0,00" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Contratos com Terceiros (R$)</label>
                    <input type="text" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={formatCurrencyInput(pricingData.contratosTerceiros)} onChange={e => setPricingData({...pricingData, contratosTerceiros: parseCurrencyInput(e.target.value)})} placeholder="0,00" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Outros Custos Variáveis (R$)</label>
                    <input type="text" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={formatCurrencyInput(pricingData.outrosCustosVariaveis)} onChange={e => setPricingData({...pricingData, outrosCustosVariaveis: parseCurrencyInput(e.target.value)})} placeholder="0,00" />
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(18, 101, 175, 0.08)', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem', color: '#111111' }}>
                  <span>Total Variáveis:</span>
                  <span>R$ {totalVariaveis.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
              {/* Premissas e Esforço */}
              <div style={{ padding: '1.75rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '18px', border: '1px solid rgba(18, 101, 175, 0.08)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(18, 101, 175, 0.08)', paddingBottom: '0.5rem', fontWeight: 700, color: '#111111' }}>Premissas e Esforço</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Markup (%)</label>
                    <input type="number" step="0.1" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pricingData.markup || ''} onChange={e => setPricingData({...pricingData, markup: Number(e.target.value)})} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Margem de Lucro Automática (%)</label>
                    <input type="text" readOnly style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'rgba(18, 101, 175, 0.04)', color: 'var(--primary)', fontWeight: 700 }} value={margemLucro.toFixed(2) + '%'} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Esforço Estimado</label>
                  <select style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'white' }} value={pricingData.esforco} onChange={e => setPricingData({...pricingData, esforco: e.target.value})}>
                    <option value="Baixo">Baixo (6%)</option>
                    <option value="Médio">Médio (10%)</option>
                    <option value="Alto">Alto (15%)</option>
                  </select>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#111111', lineHeight: '1.4' }}>
                  * O custo do esforço é gerado a partir do cálculo de governança: <strong>Equipe de Execução</strong> × <strong>% do Esforço Estimado</strong>.
                </div>
              </div>

              {/* Modelo de Precificação e Resultado */}
              <div style={{ padding: '1.75rem', background: 'rgba(34, 197, 94, 0.03)', borderRadius: '18px', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(34, 197, 94, 0.15)', paddingBottom: '0.5rem', color: '#15803d', fontWeight: 700 }}>Modelo de Precificação</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#166534' }}>Tipo de Proposta</label>
                    <select style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)', background: 'white' }} value={pricingData.modelo} onChange={e => setPricingData({...pricingData, modelo: e.target.value})}>
                      <option value="Por assinatura">Por Assinatura</option>
                      <option value="Para empresa">Proposta para Empresa</option>
                    </select>
                  </div>

                  {pricingData.modelo === 'Por assinatura' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="fade-up">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#166534' }}>Previsão de Clientes (Qtd)</label>
                        <input type="number" min="1" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }} value={pricingData.quantidadeClientes || ''} onChange={e => setPricingData({...pricingData, quantidadeClientes: Number(e.target.value)})} />
                        <span style={{ fontSize: '0.72rem', color: '#15803d' }}>Rateado por este número.</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#166534' }}>Estimativa de ROI</label>
                        <input type="text" style={{ padding: '0.7rem 0.9rem', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }} value={pricingData.estimativaROI || ''} onChange={e => setPricingData({...pricingData, estimativaROI: e.target.value})} placeholder="Ex: 12 meses" />
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '0.5rem', padding: '1.5rem', background: 'white', borderRadius: '14px', border: '1px solid rgba(34, 197, 94, 0.15)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111111', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {pricingData.modelo === 'Por assinatura' ? 'Preço Final por Assinante' : 'Preço Final do Projeto'}
                    </label>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
                      R$ {precoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        );
      case 'empresa_piloto':
        return (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111111', marginBottom: '0.25rem' }}>Empresa Piloto</h2>
              <p style={{ color: '#111111', fontSize: '0.875rem', marginBottom: '2rem' }}>Cadastre os dados e acompanhe o andamento da validação em ambiente real.</p>
              
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111111', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(18,101,175,0.1)' }}>Dados da Empresa</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Nome da Empresa</label>
                  <input style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pilotoData.nomeEmpresa} onChange={e => setPilotoData({...pilotoData, nomeEmpresa: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Razão Social</label>
                  <input style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pilotoData.razaoSocial} onChange={e => setPilotoData({...pilotoData, razaoSocial: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>CNPJ</label>
                  <input style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pilotoData.cnpj} onChange={e => setPilotoData({...pilotoData, cnpj: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Segmento de Atuação</label>
                  <input style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pilotoData.segmento} onChange={e => setPilotoData({...pilotoData, segmento: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Porte da Empresa</label>
                  <select style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'white' }} value={pilotoData.porte} onChange={e => setPilotoData({...pilotoData, porte: e.target.value})}>
                    <option value="">Selecione...</option>
                    <option value="Micro">Micro</option>
                    <option value="Pequena">Pequena</option>
                    <option value="Média">Média</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Unidade/Filial</label>
                  <input style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pilotoData.unidade} onChange={e => setPilotoData({...pilotoData, unidade: e.target.value})} />
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111111', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(18,101,175,0.1)' }}>Responsáveis</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Responsável principal</label>
                  <input style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pilotoData.responsavel} onChange={e => setPilotoData({...pilotoData, responsavel: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Cargo do responsável</label>
                  <input style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pilotoData.cargo} onChange={e => setPilotoData({...pilotoData, cargo: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Contatos principais</label>
                  <input style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} placeholder="Email, Telefone..." value={pilotoData.contatos} onChange={e => setPilotoData({...pilotoData, contatos: e.target.value})} />
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111111', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(18,101,175,0.1)' }}>Status e Cronograma</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Status do Piloto</label>
                  <select style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'white' }} value={pilotoData.status} onChange={e => setPilotoData({...pilotoData, status: e.target.value})}>
                    <option value="Em implantação">Em implantação</option>
                    <option value="Em validação">Em validação</option>
                    <option value="Em operação">Em operação</option>
                    <option value="Encerrado">Encerrado</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Data de Início</label>
                  <input type="date" style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pilotoData.dataInicio} onChange={e => setPilotoData({...pilotoData, dataInicio: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Data de Encerramento (Prevista)</label>
                  <input type="date" style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={pilotoData.dataFim} onChange={e => setPilotoData({...pilotoData, dataFim: e.target.value})} />
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111111', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(18,101,175,0.1)' }}>Detalhes da Validação</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Objetivo do piloto</label>
                    <textarea style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '80px', resize: 'vertical' }} value={pilotoData.objetivo} onChange={e => setPilotoData({...pilotoData, objetivo: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Setor onde será validado</label>
                    <textarea style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '80px', resize: 'vertical' }} value={pilotoData.setorValidado} onChange={e => setPilotoData({...pilotoData, setorValidado: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>O que foi testado</label>
                    <textarea style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '80px', resize: 'vertical' }} value={pilotoData.oQueFoiTestado} onChange={e => setPilotoData({...pilotoData, oQueFoiTestado: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Como foi testado</label>
                    <textarea style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '80px', resize: 'vertical' }} value={pilotoData.comoFoiTestado} onChange={e => setPilotoData({...pilotoData, comoFoiTestado: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Resultados dos testes</label>
                    <textarea style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '80px', resize: 'vertical' }} value={pilotoData.resultados} onChange={e => setPilotoData({...pilotoData, resultados: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Evidências</label>
                    <textarea style={{ padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '80px', resize: 'vertical' }} placeholder="Links para documentos, atas, etc." value={pilotoData.evidencias} onChange={e => setPilotoData({...pilotoData, evidencias: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'imagens_produto':
        return (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111111', marginBottom: '0.25rem' }}>Imagens do Produto</h2>
                  <p style={{ color: '#111111', fontSize: '0.875rem' }}>Galeria visual de telas, mockups e evidências do produto.</p>
                </div>
                <button className="btn-primary" onClick={() => setImageModalOpen(true)} style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Inserir Imagem
                </button>
              </div>

              {/* Filtros e Layout */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(18,101,175,0.1)' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input placeholder="Filtrar imagens..." style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(18,101,175,0.2)', fontSize: '0.85rem' }} value={imageFilter} onChange={e => setImageFilter(e.target.value)} />
                  <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(18,101,175,0.2)', fontSize: '0.85rem', background: 'white' }}>
                    <option value="">Todas as Etapas</option>
                    <option value="Prototipação">Prototipação</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Homologação">Homologação</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setImageLayout('grid')} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: imageLayout === 'grid' ? 'var(--primary)' : 'transparent', color: imageLayout === 'grid' ? 'white' : '#111111', cursor: 'pointer' }}><Layout size={18} /></button>
                  <button onClick={() => setImageLayout('carrossel')} style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: imageLayout === 'carrossel' ? 'var(--primary)' : 'transparent', color: imageLayout === 'carrossel' ? 'white' : '#111111', cursor: 'pointer' }}><History size={18} /></button>
                </div>
              </div>

              {/* Galeria */}
              {productImages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed rgba(18,101,175,0.2)', borderRadius: '16px' }}>
                  <Eye size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111111' }}>Nenhuma imagem encontrada</h3>
                  <p style={{ color: '#111111', fontSize: '0.875rem' }}>Faça o upload da primeira imagem do produto.</p>
                </div>
              ) : (
                <div style={{ display: imageLayout === 'grid' ? 'grid' : 'flex', gridTemplateColumns: imageLayout === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', flexDirection: imageLayout === 'carrossel' ? 'column' : 'row', gap: '1.5rem' }}>
                  {productImages.filter(img => img.nome.toLowerCase().includes(imageFilter.toLowerCase()) || img.funcionalidade.toLowerCase().includes(imageFilter.toLowerCase())).map((img) => (
                    <div key={img.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', display: imageLayout === 'carrossel' ? 'flex' : 'block' }}>
                      <div style={{ height: imageLayout === 'carrossel' ? '180px' : '180px', width: imageLayout === 'carrossel' ? '280px' : '100%', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {img.url ? <img src={img.url} alt={img.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Eye size={32} color="#111111" style={{ opacity: 0.3 }} />}
                        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                          <button style={{ background: 'rgba(255,255,255,0.9)', border: 'none', padding: '0.35rem', borderRadius: '6px', cursor: 'pointer' }} title="Excluir" onClick={() => setProductImages(productImages.filter(i => i.id !== img.id))}><Trash2 size={14} color="var(--danger)" /></button>
                        </div>
                      </div>
                      <div style={{ padding: '1.25rem', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111111' }}>{img.nome}</h4>
                          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{img.status}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#111111', marginBottom: '1rem', minHeight: '35px' }}>{img.descricao}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: '#111111' }}>
                          <div><strong>Seção:</strong> {img.funcionalidade}</div>
                          <div><strong>Versão:</strong> {img.versao}</div>
                          <div><strong>Data:</strong> {img.data}</div>
                          <div><strong>Por:</strong> {img.responsavel}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal de Inserir Imagem */}
            <AnimatePresence>
              {imageModalOpen && (
                <div className="modal-backdrop" onClick={() => setImageModalOpen(false)}>
                  <motion.div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '700px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111111' }}>Inserir Imagem do Produto</h3>
                      <button onClick={() => setImageModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#111111" /></button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Upload Area */}
                      <div style={{ border: '2px dashed rgba(18,101,175,0.3)', borderRadius: '16px', padding: '2rem', textAlign: 'center', background: 'rgba(18,101,175,0.02)', cursor: 'pointer' }}>
                        <Plus size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111111' }}>Arraste e solte imagens aqui</div>
                        <div style={{ fontSize: '0.75rem', color: '#111111' }}>ou clique para selecionar do computador</div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Nome da Imagem</label>
                          <input style={{ padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={newImage.nome} onChange={e => setNewImage({...newImage, nome: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Funcionalidade/Tela/Seção</label>
                          <input style={{ padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={newImage.funcionalidade} onChange={e => setNewImage({...newImage, funcionalidade: e.target.value})} />
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Descrição</label>
                        <textarea style={{ padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '60px' }} value={newImage.descricao} onChange={e => setNewImage({...newImage, descricao: e.target.value})} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Data</label>
                          <input type="date" style={{ padding: '0.7rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={newImage.data} onChange={e => setNewImage({...newImage, data: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Responsável</label>
                          <input style={{ padding: '0.7rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={newImage.responsavel} onChange={e => setNewImage({...newImage, responsavel: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Versão</label>
                          <input style={{ padding: '0.7rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }} value={newImage.versao} onChange={e => setNewImage({...newImage, versao: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111111' }}>Status</label>
                          <select style={{ padding: '0.7rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'white' }} value={newImage.status} onChange={e => setNewImage({...newImage, status: e.target.value})}>
                            <option>Prototipação</option>
                            <option>Desenvolvimento</option>
                            <option>Homologação</option>
                            <option>Em Produção</option>
                          </select>
                        </div>
                      </div>

                      <button 
                        className="btn-primary" 
                        style={{ marginTop: '1rem', padding: '0.85rem', borderRadius: '12px' }}
                        onClick={() => {
                          if (newImage.nome) {
                            setProductImages([...productImages, { ...newImage, id: Date.now() }]);
                            setImageModalOpen(false);
                            setNewImage({ url: '', nome: '', descricao: '', funcionalidade: '', data: '', responsavel: '', versao: '', status: 'Homologação' });
                          }
                        }}
                      >
                        Salvar Imagem
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'lgpd':
        return (
          <div className="glass-card fade-up" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111111', marginBottom: '0.75rem' }}>Segurança & LGPD</h2>
            <p style={{ color: '#111111', maxWidth: '540px', margin: '0 auto', fontSize: '0.95rem' }}>Mapeamento de dados pessoais sensíveis, registro de consentimento dos titulares, relatórios de impacto à proteção de dados e governança regulatória.</p>
          </div>
        );
      case 'referencias':
        return (
          <div className="glass-card fade-up" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111111', margin: 0 }}>Referências Bibliográficas (Drive do Produto)</h2>
                <p style={{ color: '#111111', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Repositório centralizado de arquivos, normas e referências para este produto.</p>
              </div>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(18, 101, 175, 0.2)' }}>
                <Plus size={16} /> Novo Arquivo
                <input 
                  type="file" 
                  style={{ display: 'none' }} 
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files).map(f => ({
                        id: Date.now().toString() + Math.random().toString(),
                        name: f.name,
                        size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
                        date: new Date().toLocaleDateString('pt-BR'),
                        type: f.type || 'unknown'
                      }));
                      setDriveFiles([...driveFiles, ...newFiles]);
                    }
                  }}
                />
              </label>
            </div>
            
            {driveFiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(18, 101, 175, 0.02)', borderRadius: '16px', border: '1px dashed rgba(18, 101, 175, 0.15)' }}>
                <BookOpen size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#111111', marginBottom: '0.5rem' }}>Nenhum arquivo no repositório</h3>
                <p style={{ color: '#111111', opacity: 0.8, fontSize: '0.9rem' }}>Faça o upload de documentos e referências importantes para o projeto.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {driveFiles.map(file => (
                  <div key={file.id} style={{ padding: '1.25rem', background: 'white', borderRadius: '14px', border: '1px solid rgba(18, 101, 175, 0.08)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ padding: '0.75rem', background: 'rgba(18, 101, 175, 0.05)', borderRadius: '12px', color: 'var(--primary)' }}>
                        <Paperclip size={24} />
                      </div>
                      <button 
                        onClick={() => setDriveFiles(driveFiles.filter(f => f.id !== file.id))}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }}
                        title="Excluir arquivo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 600, color: '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.name}>
                        {file.name}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#111111', opacity: 0.8 }}>
                        <span>{file.size}</span>
                        <span>{file.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'historico': {
        const reportVersions = savedVersions;

        return (
          <div className="glass-card fade-up" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111111', margin: 0 }}>Histórico de Versões do Relatório</h2>
              <p style={{ color: '#111111', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Trilha completa de versões geradas, aprovadas e arquivadas deste produto.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reportVersions.map((v, idx) => (
                <div
                  key={v.id}
                  style={{
                    padding: '1.5rem',
                    background: idx === 0 ? 'rgba(34,197,94,0.03)' : 'white',
                    borderRadius: '16px',
                    border: idx === 0 ? '1.5px solid rgba(34,197,94,0.2)' : '1px solid rgba(18,101,175,0.07)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.5rem',
                    boxShadow: '0 2px 8px rgba(18,101,175,0.02)'
                  }}
                >
                  {/* Version badge */}
                  <div style={{
                    minWidth: '60px',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    background: v.statusBg,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: v.statusColor }}>{v.version}</div>
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        background: v.statusBg,
                        color: v.statusColor,
                        border: `1px solid ${v.statusColor}22`
                      }}>{v.status}</span>
                      <span style={{ fontSize: '0.8rem', color: '#111111', fontWeight: 600 }}>📅 {v.date}</span>
                      <span style={{ fontSize: '0.8rem', color: '#111111', fontWeight: 600 }}>👤 {v.author}</span>
                      <span style={{ fontSize: '0.8rem', color: '#111111', fontWeight: 600 }}>📄 {v.size}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#111111', margin: 0, lineHeight: 1.6 }}>{v.changes}</p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 0.9rem', borderRadius: '8px',
                        border: '1px solid rgba(18,101,175,0.12)',
                        background: 'white', color: 'var(--primary)',
                        fontWeight: 600, fontSize: '0.78rem',
                        cursor: 'pointer', whiteSpace: 'nowrap'
                      }}
                    >
                      <Eye size={13} /> Visualizar
                    </button>
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 0.9rem', borderRadius: '8px',
                        border: '1px solid rgba(18,101,175,0.12)',
                        background: 'white', color: '#111111',
                        fontWeight: 600, fontSize: '0.78rem',
                        cursor: 'pointer', whiteSpace: 'nowrap'
                      }}
                    >
                      <Download size={13} /> Baixar PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      default:
        return (
          <div className="glass-card fade-up" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeTab}</h2>
            <p style={{ color: '#111111' }}>Módulo estratégico em fase de estruturação e homologação no sistema.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '5rem' }}>
      <button 
        onClick={() => navigate('/produtos')} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#111111', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          cursor: 'pointer', 
          marginBottom: '1.5rem', 
          fontSize: '0.85rem',
          fontWeight: 600,
          padding: '6px 12px',
          borderRadius: '8px',
          transition: 'all 0.15s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(18, 101, 175, 0.05)';
          e.currentTarget.style.color = 'var(--primary)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'none';
          e.currentTarget.style.color = '#111111';
        }}
      >
        <ArrowLeft size={15} /> Voltar para o Portfólio
      </button>

      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2.25rem', margin: 0, fontWeight: 800, color: '#111111', letterSpacing: '-0.04em' }}>{productDetails.name}</h1>
            <span className="badge badge-info" style={{ fontWeight: 700 }}>{productDetails.category}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: '#111111', fontSize: '0.85rem', fontWeight: 600 }}>ID: #{id}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '220px' }}>
              <span style={{ color: '#111111', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Ciclo de Vida: {progress}%</span>
              <div style={{ width: '100%', height: '6px', background: 'rgba(18, 101, 175, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(95deg, var(--primary) 0%, var(--primary-light) 100%)', borderRadius: '10px' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <button 
             onClick={() => setShowPreview(true)} 
             className="btn-primary"
             style={{ padding: '0.75rem 1.5rem', borderRadius: '14px' }}
           >
             <FileSearch size={18} /> Ver Relatório Completo
           </button>
        </div>
      </header>

      <div className="tabs-wrapper" style={{ position: 'relative', marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={() => scrollTabs('left')}
          className="scroll-btn"
          style={{
            position: 'absolute',
            left: '-15px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'white',
            border: '1px solid rgba(18, 101, 175, 0.12)',
            boxShadow: '0 4px 12px rgba(18, 101, 175, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#111111'
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <nav 
          ref={tabRef}
          className="no-scrollbar" 
          style={{ 
            flex: 1,
            display: 'flex', 
            gap: '2rem', 
            borderBottom: '1px solid rgba(18, 101, 175, 0.08)', 
            overflowX: 'auto', 
            paddingBottom: '2px',
            paddingLeft: '25px',
            paddingRight: '25px',
            scrollBehavior: 'smooth'
          }}
        >
          {[
            { id: 'info', label: 'Informações do Produto', icon: <Info size={16} /> },
            { id: 'construcao', label: 'Construção do Produto', icon: <Building2 size={16} /> },
            { id: 'evolucao_produto', label: 'Evolução do Produto', icon: <Layout size={16} /> },
            { id: 'precificacao', label: 'Precificação', icon: <TrendingUp size={16} /> },
            { id: 'empresa_piloto', label: 'Empresa Piloto', icon: <Users size={16} /> },
            { id: 'imagens_produto', label: 'Imagens do Produto', icon: <Eye size={16} /> },
            { id: 'financeiro', label: 'Financeiro', icon: <DollarSign size={16} /> },
            { id: 'lgpd', label: 'LGPD', icon: <ShieldCheck size={16} /> },
            { id: 'referencias', label: 'Referências Bibliográficas', icon: <BookOpen size={16} /> },
            { id: 'conhecimento', label: 'Gestão do Conhecimento', icon: <Brain size={16} /> },
            { id: 'historico', label: 'Histórico', icon: <History size={16} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '1rem 0.25rem', background: 'none', border: 'none', 
                color: activeTab === tab.id ? 'var(--primary)' : '#111111',
                fontWeight: activeTab === tab.id ? 700 : 500,
                borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '0.9rem',
                transition: 'all 0.18s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => scrollTabs('right')}
          className="scroll-btn"
          style={{
            position: 'absolute',
            right: '-15px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'white',
            border: '1px solid rgba(18, 101, 175, 0.12)',
            boxShadow: '0 4px 12px rgba(18, 101, 175, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#111111'
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {renderTabContent()}

      {/* Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedPhase && (
          <div className="modal-backdrop" onClick={() => setIsDetailsModalOpen(false)}>
            <motion.div 
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ maxWidth: '800px', width: '90%' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Histórico da Etapa: {selectedPhase.title}</h2>
                  <p style={{ color: '#111111', fontSize: '0.85rem', margin: 0 }}>Gestão de Conhecimento e Registro de Rastreabilidade</p>
                </div>
                <button onClick={() => setIsDetailsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111111' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left: Add new record form */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Cadastrar Registro</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Tipo de Registro</label>
                      <select 
                        style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'white', color: '#111111', fontSize: '0.875rem' }}
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Associar a</label>
                      <select 
                        style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'white', color: '#111111', fontSize: '0.875rem' }}
                        value={associationType}
                        onChange={(e) => setAssociationType(e.target.value)}
                      >
                        <option value="Macro Etapa">Macro Etapa ({selectedPhase.title})</option>
                        {(selectedPhase.topics || []).map(topic => (
                          <option key={topic} value={topic}>Micro Etapa: {topic}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Conteúdo</label>
                      <textarea 
                        style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '120px', resize: 'vertical', color: '#111111', fontSize: '0.875rem' }}
                        placeholder="Descreva a evidência, aprendizado ou decisão obtido nesta etapa..."
                        value={recordText}
                        onChange={(e) => setRecordText(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Pessoas Mencionadas (@)</label>
                      <input 
                        style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', color: '#111111', fontSize: '0.875rem' }}
                        placeholder="Ex: @João, @Maria"
                        value={recordMentions}
                        onChange={(e) => setRecordMentions(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
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
                    <button onClick={handleAddRecord} disabled={!recordText.trim()} className="btn-primary" style={{ padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <Plus size={16} /> Adicionar à Base
                    </button>
                  </div>
                </div>

                {/* Right: Listed records */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Linha do Tempo de Governança</h3>
                  <div className="custom-scrollbar" style={{ flex: 1, maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
                    {(!selectedPhase.records || selectedPhase.records.length === 0) ? (
                      <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '8px', color: '#111111', border: '1px dashed var(--border)' }}>
                        Nenhum registro cadastrado nesta etapa.
                      </div>
                    ) : (
                      selectedPhase.records.map((rec) => (
                        <div key={rec.id} style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: rec.type === 'Risco' ? 'orange' : rec.type === 'Dificuldade' ? 'red' : 'var(--primary)' }}>
                                {rec.type}
                              </span>
                              {rec.microStage && rec.microStage !== 'Macro Etapa' && (
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(0, 99, 190, 0.05)', color: 'var(--primary)', padding: '0.05rem 0.3rem', borderRadius: '4px', border: '1px solid var(--primary-light)' }}>
                                  {rec.microStage}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#111111' }}>{rec.content}</span>
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
                          <button onClick={() => handleDeleteRecord(rec.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '2px' }}>
                            <Trash2 size={14} />
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

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedPhase && (
          <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
            <motion.div 
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ maxWidth: '550px', width: '90%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Editar Etapa: {selectedPhase.title}</h2>
                <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111111' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Início</label>
                    <input 
                      type="date" 
                      style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }}
                      value={selectedPhase.startDate || ''}
                      onChange={(e) => setSelectedPhase({ ...selectedPhase, startDate: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Término</label>
                    <input 
                      type="date" 
                      style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }}
                      value={selectedPhase.endDate || ''}
                      onChange={(e) => setSelectedPhase({ ...selectedPhase, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Responsável</label>
                    <input 
                      style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }}
                      placeholder="Nome do gestor..."
                      value={selectedPhase.responsible || ''}
                      onChange={(e) => setSelectedPhase({ ...selectedPhase, responsible: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Progresso (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)' }}
                      value={selectedPhase.progress}
                      onChange={(e) => setSelectedPhase({ ...selectedPhase, progress: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111111' }}>Evidências / Observações Gerais</label>
                  <textarea 
                    style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', minHeight: '100px', resize: 'vertical' }}
                    placeholder="Notas adicionais sobre a etapa..."
                    value={selectedPhase.evidence || ''}
                    onChange={(e) => setSelectedPhase({ ...selectedPhase, evidence: e.target.value })}
                  />
                </div>

                {/* Document attachment integration inside the modal */}
                <div style={{ border: '1px dashed var(--primary)', borderRadius: '14px', padding: '1.25rem', background: 'rgba(18, 101, 175, 0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                    <Paperclip size={24} color="var(--primary)" style={{ marginBottom: '0.25rem' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>Anexar Documento de Evidência</span>
                    <span style={{ fontSize: '0.75rem', color: '#111111' }}>Formatos suportados: PDF, DOCX, XLSX, PNG (Max 10MB)</span>
                    <input 
                      type="file" 
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const currentEvidence = selectedPhase.evidence || '';
                          const separator = currentEvidence ? '\n' : '';
                          const updatedEvidence = `${currentEvidence}${separator}[Documento Anexado: ${file.name}]`;
                          setSelectedPhase({
                            ...selectedPhase,
                            evidence: updatedEvidence
                          });
                          alert(`Documento "${file.name}" anexado à etapa com sucesso!`);
                        }
                      }} 
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(18, 101, 175, 0.12)', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#111111', transition: 'all 0.2s' }}>Cancelar</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Salvar Alterações</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Relatório Completo Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="modal-backdrop" onClick={() => setShowPreview(false)} style={{ padding: '2rem' }}>
            <motion.div 
              className="modal-content custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid rgba(18, 101, 175, 0.1)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#111111' }}>Relatório Completo do Produto</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>{productDetails.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    onClick={() => { setShowSavePanel(!showSavePanel); setSaveVersionSuccess(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: showSavePanel ? 'var(--primary)' : 'rgba(18,101,175,0.07)',
                      color: showSavePanel ? 'white' : 'var(--primary)',
                      border: '1px solid rgba(18,101,175,0.15)',
                      borderRadius: '10px', padding: '0.6rem 1.1rem',
                      cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Save size={16} /> Salvar Versão
                  </button>
                  <button onClick={() => { setShowPreview(false); setShowSavePanel(false); setSaveVersionName(''); setSaveVersionNotes(''); setSaveVersionSuccess(false); }} style={{ background: 'rgba(239,68,68,0.07)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '0.6rem 1.1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>Fechar</button>
                </div>
              </div>

              {/* Save Version Panel */}
              {showSavePanel && (
                <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: saveVersionSuccess ? 'rgba(34,197,94,0.05)' : 'rgba(18,101,175,0.03)', borderRadius: '16px', border: saveVersionSuccess ? '1.5px solid rgba(34,197,94,0.25)' : '1.5px solid rgba(18,101,175,0.12)', transition: 'all 0.3s' }}>
                  {saveVersionSuccess ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={20} color="var(--success)" />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--success)', fontSize: '0.95rem' }}>Versão salva com sucesso!</p>
                        <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem', color: '#111111' }}>A nova versão foi adicionada ao Histórico do produto.</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 700, color: '#111111', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={16} color="var(--primary)" /> Salvar Nova Versão do Relatório
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nome / Versão</label>
                          <input
                            placeholder="Ex: v6.0, Versão Final, Aprovado em reunião..."
                            value={saveVersionName}
                            onChange={e => setSaveVersionName(e.target.value)}
                            style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(18,101,175,0.15)', fontSize: '0.875rem', color: '#111111', outline: 'none' }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</label>
                          <select
                            style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(18,101,175,0.15)', fontSize: '0.875rem', color: '#111111', background: 'white' }}
                            id="saveVersionStatus"
                          >
                            <option value="Rascunho">Rascunho</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Arquivado">Arquivado</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Notas / Descrição das Alterações</label>
                        <textarea
                          placeholder="Descreva as principais alterações desta versão..."
                          value={saveVersionNotes}
                          onChange={e => setSaveVersionNotes(e.target.value)}
                          rows={3}
                          style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(18,101,175,0.15)', fontSize: '0.875rem', color: '#111111', resize: 'vertical', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => setShowSavePanel(false)} style={{ padding: '0.6rem 1.1rem', borderRadius: '10px', border: '1px solid rgba(18,101,175,0.12)', background: 'white', color: '#111111', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Cancelar</button>
                        <button
                          disabled={!saveVersionName.trim()}
                          onClick={() => {
                            const statusEl = document.getElementById('saveVersionStatus') as HTMLSelectElement;
                            const chosenStatus = statusEl ? statusEl.value : 'Rascunho';
                            const statusColors: Record<string, {color: string, bg: string}> = {
                              'Aprovado': { color: 'var(--primary)', bg: 'rgba(18,101,175,0.08)' },
                              'Rascunho': { color: '#b45309', bg: 'rgba(245,158,11,0.08)' },
                              'Arquivado': { color: '#64748b', bg: 'rgba(100,116,139,0.08)' },
                            };
                            const sc = statusColors[chosenStatus] || statusColors['Rascunho'];
                            const newVersion = {
                              id: 'v_' + Date.now(),
                              version: saveVersionName.trim(),
                              date: new Date().toLocaleDateString('pt-BR'),
                              author: productDetails.manager || 'Usuário',
                              status: chosenStatus,
                              statusColor: sc.color,
                              statusBg: sc.bg,
                              changes: saveVersionNotes.trim() || 'Sem notas adicionadas.',
                              size: '—'
                            };
                            setSavedVersions(prev => [newVersion, ...prev]);
                            setSaveVersionSuccess(true);
                            setSaveVersionName('');
                            setSaveVersionNotes('');
                          }}
                          style={{
                            padding: '0.6rem 1.25rem', borderRadius: '10px',
                            background: saveVersionName.trim() ? 'var(--primary)' : 'rgba(18,101,175,0.3)',
                            color: 'white', border: 'none',
                            fontWeight: 700, fontSize: '0.875rem',
                            cursor: saveVersionName.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', gap: '0.4rem'
                          }}
                        >
                          <Save size={15} /> Salvar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {/* 1. Informações do Produto */}
                <section>
                  <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>1. Informações do Produto</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: '#111111' }}>
                    <div><strong>Nome:</strong> {productDetails.name}</div>
                    <div><strong>Categoria:</strong> {productDetails.category}</div>
                    <div><strong>Gestor Responsável:</strong> {productDetails.manager}</div>
                    <div><strong>Status:</strong> {productDetails.status}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong>Descrição:</strong> {productDetails.description}</div>
                  </div>
                </section>

                {/* 2. Construção do Produto */}
                <section>
                  <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>2. Construção do Produto</h3>
                  <p style={{ fontSize: '0.9rem', color: '#333' }}>Fases mapeadas para estruturação do produto: {productPhases.length} etapas no total.</p>
                  <ul style={{ fontSize: '0.9rem', color: '#444', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {productPhases.map((p: any) => <li key={p.id}><strong>{p.title}:</strong> {p.progress}% concluído (Responsável: {p.responsible})</li>)}
                  </ul>
                </section>

                {/* 3. Evolução do Produto */}
                <section>
                  <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>3. Evolução do Produto</h3>
                  <p style={{ fontSize: '0.9rem', color: '#333' }}>Consolidação dos ciclos de melhoria e roadmap de próximos passos. Log de auditoria e cronologia de upgrades registrados.</p>
                </section>

                {/* 4. Precificação */}
                <section>
                  <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>4. Precificação</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: '#111111' }}>
                    <div><strong>Custo Fixo Total:</strong> R$ {totalFixos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div><strong>Custo Variável Total:</strong> R$ {totalVariaveis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div><strong>Markup:</strong> {pricingData.markup}%</div>
                    <div><strong>Preço Final Estimado:</strong> R$ {precoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  </div>
                </section>

                {/* 5. Empresa Piloto */}
                <section>
                  <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>5. Empresa Piloto</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem', color: '#111111' }}>
                    <div><strong>Empresa:</strong> {pilotoData.nomeEmpresa || 'Não informado'}</div>
                    <div><strong>Responsável:</strong> {pilotoData.responsavel || 'Não informado'}</div>
                    <div><strong>Status:</strong> {pilotoData.status}</div>
                    <div><strong>Início Previsto:</strong> {pilotoData.dataInicio || 'Não definido'}</div>
                  </div>
                </section>

                {/* 6. Financeiro */}
                <section>
                  <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>6. Financeiro</h3>
                  <p style={{ fontSize: '0.9rem', color: '#333' }}>Módulo de consolidação de CAPEX e OPEX reais versus orçado. Acompanhamento de DRE e projeção de lucratividade estruturados.</p>
                </section>

                {/* 7. LGPD */}
                <section>
                  <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>7. Segurança & LGPD</h3>
                  <p style={{ fontSize: '0.9rem', color: '#333' }}>Mapeamento de dados pessoais sensíveis em conformidade, registro de consentimento dos titulares documentado e relatórios de impacto à proteção de dados (RIPD) avaliados.</p>
                </section>

                {/* 8. Referências Bibliográficas */}
                <section>
                  <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>8. Referências Bibliográficas</h3>
                  <p style={{ fontSize: '0.9rem', color: '#333' }}>Normas regulamentares, artigos acadêmicos, manuais técnicos e bases legais de governança estratégica que fundamentam a arquitetura do produto estão indexados na base do conhecimento.</p>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductBuilder;
