import React from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Hourglass,
  Layers,
  FileCheck,
  UserCheck,
  Activity,
  Zap,
  Download,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const products = [
  { id: 1, name: 'Portal do Cidadão V2',      stage: 'Desenvolvimento', lead: 'Ana Silva',     deadline: '20-06-2026', progress: 65, category: 'Software'   },
  { id: 2, name: 'App Gestão Industrial',      stage: 'Ideação',         lead: 'Bruno Costa',   deadline: '15-08-2026', progress: 10, category: 'Mobile'     },
  { id: 3, name: 'API Integração SESI',        stage: 'Entrega',         lead: 'Carla Dias',    deadline: '01-06-2026', progress: 90, category: 'Backend'    },
  { id: 4, name: 'Dashboard BI Institucional', stage: 'Planejamento',    lead: 'Diego Souza',   deadline: '30-07-2026', progress: 30, category: 'Analytics'  },
  { id: 5, name: 'Sistema de Matrícula',       stage: 'Desenvolvimento', lead: 'Fernanda Lima', deadline: '10-07-2026', progress: 45, category: 'Software'   },
];

/* ── helpers ── */
const stageColor = (s: string) => {
  if (s === 'Entrega')        return 'var(--success)';
  if (s === 'Desenvolvimento') return 'var(--primary)';
  if (s === 'Planejamento')   return 'var(--warning)';
  return 'var(--purple)';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.96)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: 'var(--shadow-md)',
      fontSize: '0.8rem',
      fontFamily: 'inherit',
      backdropFilter: 'blur(8px)'
    }}>
      <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontWeight: 600 }}>{p.name}: <span style={{ color: 'var(--text-main)' }}>{p.value}</span></span>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const totalProducts  = products.length;
  const inProgress     = products.filter(p => p.progress > 0 && p.progress < 100).length;
  const avgProgress    = Math.round(products.reduce((a, p) => a + p.progress, 0) / totalProducts);
  const nearCompletion = products.filter(p => p.progress >= 80).length;

  const stageData = [
    { name: 'Ideação',         value: products.filter(p => p.stage === 'Ideação').length },
    { name: 'Planejamento',    value: products.filter(p => p.stage === 'Planejamento').length },
    { name: 'Desenvolvimento', value: products.filter(p => p.stage === 'Desenvolvimento').length },
    { name: 'Entrega',         value: products.filter(p => p.stage === 'Entrega').length },
  ];

  const bottleneckData = [
    { name: 'Aprovação Jurídica', count: 12, avgDelay: 5 },
    { name: 'Design Review',      count: 8,  avgDelay: 3 },
    { name: 'QA / Testes',        count: 15, avgDelay: 7 },
    { name: 'Infraestrutura',     count: 6,  avgDelay: 4 },
  ];

  const timePerStageData = [
    { stage: 'Ideação',         time: 15 },
    { stage: 'Planejamento',    time: 22 },
    { stage: 'Desenvolvimento', time: 45 },
    { stage: 'Entrega',         time: 10 },
  ];

  const PIE_COLORS = ['var(--purple)', 'var(--warning)', 'var(--primary)', 'var(--success)'];

  const alerts = [
    { id: 1, type: 'danger',  icon: <Clock   size={16} />, title: 'Prazo Vencendo',        desc: '3 produtos com entrega em menos de 48h',                category: 'Prazos'       },
    { id: 2, type: 'warning', icon: <AlertTriangle size={16} />, title: 'Atraso Detectado', desc: 'API Integração SESI com 5 dias de desvio',              category: 'Atrasos'      },
    { id: 3, type: 'info',    icon: <UserCheck size={16} />, title: 'Sem Responsável',      desc: 'Etapa "QA" do Portal V2 aguardando atribuição',         category: 'Equipe'       },
    { id: 4, type: 'warning', icon: <FileCheck size={16} />, title: 'Ausência de Evidências',desc: 'App Gestão Industrial sem documentos anexados',        category: 'Conformidade' },
    { id: 5, type: 'danger',  icon: <AlertCircle size={16} />, title: 'Campos Obrigatórios',desc: 'Dashboard BI com dados financeiros pendentes',          category: 'Cadastro'     },
    { id: 6, type: 'purple',  icon: <ShieldCheck size={16} />, title: 'LGPD & Privacidade', desc: 'Revisão de fluxo de dados sensíveis necessária',        category: 'Governança'   },
  ];

  const alertColors: Record<string, { badge: string; iconColor: string }> = {
    danger:  { badge: 'badge-danger',  iconColor: 'var(--danger)' },
    warning: { badge: 'badge-warning', iconColor: 'var(--warning)' },
    info:    { badge: 'badge-info',    iconColor: 'var(--info)' },
    purple:  { badge: 'badge-purple',  iconColor: 'var(--purple)' },
  };

  const kpiCards = [
    {
      label: 'Total de Produtos',
      value: totalProducts,
      sub: 'Cadastrados no CIS',
      icon: <Package size={22} strokeWidth={1.5} />,
      iconColor: 'var(--primary)',
      accent: 'var(--primary)',
    },
    {
      label: 'Em Andamento',
      value: inProgress,
      sub: 'Projetos ativos',
      icon: <Layers size={22} strokeWidth={1.5} />,
      iconColor: 'var(--primary-light)',
      accent: 'var(--primary-light)',
    },
    {
      label: 'Progresso Médio',
      value: `${avgProgress}%`,
      sub: 'Geral do portfólio',
      icon: <Activity size={22} strokeWidth={1.5} />,
      iconColor: 'var(--info)',
      accent: 'var(--info)',
      bar: true,
      barValue: avgProgress,
    },
    {
      label: 'Prazos Próximos',
      value: nearCompletion,
      sub: 'Próximos 15 dias',
      icon: <Hourglass size={22} strokeWidth={1.5} />,
      iconColor: 'var(--warning)',
      accent: 'var(--warning)',
      danger: true,
    },
  ];

  const governanceItems = [
    { label: 'Auditoria Mensal',  status: 'OK',      badge: 'badge-success' },
    { label: 'LGPD',              status: '92%',     badge: 'badge-info' },
    { label: 'Documentação',      status: 'Pendente',badge: 'badge-warning' },
    { label: 'Finanças',          status: 'OK',      badge: 'badge-success' },
  ];

  return (
    <div style={{ paddingBottom: '4rem' }}>

      {/* ── HEADER ── */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Dashboard Gerencial
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Monitoramento Estratégico e Governança de Produtos
          </p>
        </div>

        <button className="btn-primary">
          <Download size={18} strokeWidth={1.5} />
          Exportar Relatório
        </button>
      </header>

      {/* ── KPI CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {kpiCards.map((card, i) => (
          <div key={i} className="glass-card stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
              }}>
                {card.label}
              </span>
              <div style={{ color: card.iconColor }}>
                {card.icon}
              </div>
            </div>

            <div>
              <span style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: 'var(--text-main)',
              }}>
                {card.value}
              </span>
            </div>

            {card.bar && (
              <div>
                <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${card.barValue}%`, height: '100%',
                    background: card.accent,
                    borderRadius: 999,
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </div>
              </div>
            )}

            <span style={{
              fontSize: '0.8rem',
              color: card.danger ? card.accent : 'var(--text-muted)',
              fontWeight: card.danger ? 600 : 500,
            }}>
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW 1 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Gargalos */}
        <div className="glass-card" style={{ height: 360, padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Gargalos Recorrentes</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Atrasos por etapa · Últimos 30 dias</p>
            </div>
            <span className="badge badge-danger">
              Atenção
            </span>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={bottleneckData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={true} vertical={false} />
              <XAxis type="number" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} width={120} tick={{ fill: 'var(--text-main)', fontWeight: 500 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--info-bg)' }} />
              <Bar dataKey="count" fill="var(--danger)" radius={[0, 6, 6, 0]} name="Ocorrências" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tempo por etapa */}
        <div className="glass-card" style={{ height: 360, padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Tempo Médio por Etapa</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Dias gastos em cada fase</p>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={timePerStageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="stage" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="time" name="Dias"
                stroke="var(--primary)" strokeWidth={3}
                fill="url(#areaGradient)"
                activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--bg-app)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── CHARTS ROW 2 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Produtos por Etapa */}
        <div className="glass-card" style={{ height: 340, padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Produtos por Etapa</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Distribuição do portfólio</p>
          </div>
          <ResponsiveContainer width="100%" height="75%">
            <BarChart data={stageData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad_ideacao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
                <linearGradient id="grad_planejamento" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
                <linearGradient id="grad_desenvolvimento" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1265AF" />
                  <stop offset="100%" stopColor="#5BA9F0" />
                </linearGradient>
                <linearGradient id="grad_entrega" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{ fill: 'var(--text-muted)' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(18,101,175,0.04)' }} />
              <Bar dataKey="value" name="Produtos" radius={[8, 8, 8, 8]} barSize={28}>
                {stageData.map((entry, index) => {
                  let grad = "url(#grad_ideacao)";
                  if (entry.name === 'Planejamento') grad = "url(#grad_planejamento)";
                  if (entry.name === 'Desenvolvimento') grad = "url(#grad_desenvolvimento)";
                  if (entry.name === 'Entrega') grad = "url(#grad_entrega)";
                  return <Cell key={index} fill={grad} filter="drop-shadow(0px 4px 6px rgba(18,101,175,0.1))" />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time de Entregas */}
        <div className="glass-card" style={{ height: 340, padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Time de Entregas</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Progresso por produto</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: 220, paddingRight: '0.5rem' }} className="custom-scrollbar">
            {products.sort((a, b) => b.progress - a.progress).map(product => (
              <div key={product.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.85rem 1rem', borderRadius: 16,
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(18,101,175,0.06)',
                boxShadow: '0 2px 8px rgba(18,101,175,0.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(18,101,175,0.08)';
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = 'rgba(18,101,175,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(18,101,175,0.02)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.borderColor = 'rgba(18,101,175,0.06)';
              }}
              >
                <div style={{
                  padding: '0.35rem 0.6rem', borderRadius: 999,
                  background: 'linear-gradient(135deg, rgba(18,101,175,0.12), rgba(91,169,240,0.08))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(18,101,175,0.05)',
                }}>
                  <div style={{
                    fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)',
                  }}>
                    {product.progress}%
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem', fontWeight: 500 }}>
                    <Clock size={12} strokeWidth={2} /> {product.deadline}
                  </div>
                </div>
                <ArrowRight size={14} color="var(--text-faint)" strokeWidth={2} />
              </div>
            ))}
          </div>
        </div>

        {/* Foco Governança */}
        <div className="glass-card" style={{ height: 340, padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'var(--info-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)',
            }}>
              <ShieldCheck size={16} strokeWidth={1.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.1rem' }}>Foco Governança</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Conformidade e status</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Auditoria Mensal',  status: 'OK',      type: 'ok' },
              { label: 'LGPD',              status: '92%',     type: 'lgpd' },
              { label: 'Documentação',      status: 'Pendente',type: 'pendente' },
              { label: 'Finanças',          status: 'OK',      type: 'ok' },
            ].map((item, i) => {
              let bg = '';
              let color = '';
              if (item.type === 'ok') {
                bg = 'linear-gradient(135deg, rgba(34,197,94,0.14), rgba(74,222,128,0.08))';
                color = 'var(--success)';
              } else if (item.type === 'lgpd') {
                bg = 'linear-gradient(135deg, rgba(18,101,175,0.14), rgba(91,169,240,0.08))';
                color = 'var(--primary)';
              } else {
                bg = 'linear-gradient(135deg, rgba(245,158,11,0.14), rgba(251,191,36,0.08))';
                color = 'var(--warning)';
              }

              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.65rem 0.9rem',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: 12,
                  border: '1px solid rgba(18,101,175,0.05)',
                  boxShadow: '0 2px 8px rgba(18,101,175,0.02)',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(18,101,175,0.06)';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'rgba(18,101,175,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(18,101,175,0.02)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.borderColor = 'rgba(18,101,175,0.05)';
                }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
                  <span style={{
                    background: bg,
                    color: color,
                    padding: '0.3rem 0.75rem',
                    borderRadius: 999,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    border: '1px solid rgba(0,0,0,0.02)',
                  }}>
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── GOVERNANCE ALERTS SECTION ── */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'var(--warning-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--warning)',
            }}>
              <Zap size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.1rem' }}>
                Governança, Prazos e Alertas
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Monitoramento automático de conformidade e riscos
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>4 Críticos</span>
            <span className="badge badge-info" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>12 Totais</span>
          </div>
        </div>

        {/* Alert Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          {alerts.map((alert) => {
            const c = alertColors[alert.type] || alertColors.info;
            return (
              <div
                key={alert.id}
                style={{
                  padding: '1rem',
                  borderRadius: 14,
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border)',
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: c.iconColor, flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border)'
                }}>
                  {React.cloneElement(alert.icon, { size: 16 })}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <span className={`badge ${c.badge}`} style={{ marginBottom: '0.5rem', fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>
                    {alert.category}
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2, marginBottom: '0.25rem' }}>
                    {alert.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    {alert.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Governance pillars */}
        <div style={{
          padding: '1rem 1.25rem',
          background: 'var(--info-bg)',
          borderRadius: 14,
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { title: 'Rastreabilidade', desc: 'Controle de responsáveis' },
              { title: 'LGPD',            desc: 'Verificação automática'   },
              { title: 'Contas',          desc: 'Evidências centralizadas' },
              { title: 'Financeiro',      desc: 'Alertas de desvios'       },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--primary)',
                  marginTop: 6, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
