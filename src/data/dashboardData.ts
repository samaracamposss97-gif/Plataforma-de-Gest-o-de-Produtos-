// Dashboard static data - extracted from component to avoid re-creation on every render

export const products = [
  { id: 1, name: 'Portal do Cidadão V2',       stage: 'Desenvolvimento', lead: 'Ana Silva',     deadline: '20-06-2026', progress: 65, category: 'Software'  },
  { id: 2, name: 'App Gestão Industrial',       stage: 'Ideação',         lead: 'Bruno Costa',   deadline: '15-08-2026', progress: 10, category: 'Mobile'    },
  { id: 3, name: 'API Integração SESI',         stage: 'Entrega',         lead: 'Carla Dias',    deadline: '01-06-2026', progress: 90, category: 'Backend'   },
  { id: 4, name: 'Dashboard BI Institucional',  stage: 'Planejamento',    lead: 'Diego Souza',   deadline: '30-07-2026', progress: 30, category: 'Analytics' },
  { id: 5, name: 'Sistema de Matrícula',        stage: 'Desenvolvimento', lead: 'Fernanda Lima', deadline: '10-07-2026', progress: 45, category: 'Software'  },
];

export const alertsData = [
  { id: 1, type: 'danger',  iconName: 'Clock',         title: 'Prazo Vencendo',         desc: '3 produtos com entrega em menos de 48h',               category: 'Prazos'       },
  { id: 2, type: 'warning', iconName: 'AlertTriangle', title: 'Atraso Detectado',        desc: 'API Integração SESI com 5 dias de desvio',             category: 'Atrasos'      },
  { id: 3, type: 'info',    iconName: 'UserCheck',     title: 'Sem Responsável',         desc: 'Etapa "QA" do Portal V2 aguardando atribuição',        category: 'Equipe'       },
  { id: 4, type: 'warning', iconName: 'FileCheck',     title: 'Ausência de Evidências',  desc: 'App Gestão Industrial sem documentos anexados',        category: 'Conformidade' },
  { id: 5, type: 'danger',  iconName: 'AlertCircle',   title: 'Campos Obrigatórios',     desc: 'Dashboard BI com dados financeiros pendentes',         category: 'Cadastro'     },
  { id: 6, type: 'purple',  iconName: 'ShieldCheck',   title: 'LGPD & Privacidade',      desc: 'Revisão de fluxo de dados sensíveis necessária',       category: 'Governança'   },
];

export const stageData = [
  { name: 'Ideação',         value: products.filter(p => p.stage === 'Ideação').length },
  { name: 'Planejamento',    value: products.filter(p => p.stage === 'Planejamento').length },
  { name: 'Desenvolvimento', value: products.filter(p => p.stage === 'Desenvolvimento').length },
  { name: 'Entrega',         value: products.filter(p => p.stage === 'Entrega').length },
];

export const avgTimePerStageData = [
  { name: 'Ideação',         value: 14 },
  { name: 'Planejamento',    value: 21 },
  { name: 'Desenvolvimento', value: 38 },
  { name: 'Entrega',         value: 9  },
];

export const bottleneckData = [
  { name: 'Aprovação Jurídica', count: 12, avgDelay: 5 },
  { name: 'Design Review',      count: 8,  avgDelay: 3 },
  { name: 'QA / Testes',        count: 15, avgDelay: 7 },
  { name: 'Infraestrutura',     count: 6,  avgDelay: 4 },
];

export const PIE_COLORS = ['var(--purple)', 'var(--warning)', 'var(--primary)', 'var(--success)'];

export const governanceData = [
  { label: 'Auditoria Mensal',  status: 'Conforme', pct: 100, type: 'ok',      action: false, icon: '✔' },
  { label: 'LGPD / Privacidade',status: '92%',      pct: 92,  type: 'lgpd',    action: false, icon: '🔒' },
  { label: 'Documentação',      status: 'Pendente', pct: 40,  type: 'pendente',action: true,  icon: '⚠' },
  { label: 'Financeiro',        status: 'Conforme', pct: 100, type: 'ok',      action: false, icon: '✔' },
];

export const alertColors: Record<string, { badge: string; iconColor: string }> = {
  danger:  { badge: 'badge-danger',  iconColor: 'var(--danger)'  },
  warning: { badge: 'badge-warning', iconColor: 'var(--warning)' },
  info:    { badge: 'badge-info',    iconColor: 'var(--info)'    },
  purple:  { badge: 'badge-purple',  iconColor: 'var(--purple)'  },
};
