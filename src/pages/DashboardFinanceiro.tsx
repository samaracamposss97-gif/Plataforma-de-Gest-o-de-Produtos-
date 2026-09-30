import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Clock, AlertTriangle, 
  Sparkles, Download, Filter, Target, Activity, FileText, ChevronRight, Zap,
  Briefcase, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import DonutProgress from '../components/DonutProgress';

/* ── MOCK DATA ── */
const kpiData = {
  totalPortfolio: 'R$ 15.4M',
  orcamentoPrevisto: 'R$ 12.0M',
  valorAprovado: 'R$ 10.5M',
  recursosAplicados: 'R$ 8.2M',
  saldoDisponivel: 'R$ 2.3M',
  horasPrevistas: '14.500h',
  horasRealizadas: '11.200h',
  percentualConsumido: 78,
  desvioFinanceiro: '+4.5%'
};

const evolutionData = [
  { month: 'Jan', previsto: 1000, realizado: 900 },
  { month: 'Fev', previsto: 2000, realizado: 2100 },
  { month: 'Mar', previsto: 3500, realizado: 3800 },
  { month: 'Abr', previsto: 5000, realizado: 4900 },
  { month: 'Mai', previsto: 7000, realizado: 7500 },
  { month: 'Jun', previsto: 8500, realizado: 8200 },
];

const distributionData = [
  { name: 'Software', value: 45 },
  { name: 'Mobile', value: 25 },
  { name: 'Infraestrutura', value: 15 },
  { name: 'Analytics', value: 15 },
];

const productCostData = [
  { name: 'Portal V2', orcamento: 2500, consumido: 2100 },
  { name: 'App Gestão', orcamento: 1800, consumido: 1950 },
  { name: 'API SESI', orcamento: 1200, consumido: 1100 },
  { name: 'Dashboard BI', orcamento: 900, consumido: 400 },
  { name: 'Matrícula', orcamento: 1500, consumido: 800 },
];

const riskProjects = [
  { id: 1, name: 'App Gestão Industrial', previsto: 'R$ 1.8M', realizado: 'R$ 1.95M', deviation: '+8.3%', status: 'Em Risco' },
  { id: 2, name: 'Portal do Cidadão V2', previsto: 'R$ 2.5M', realizado: 'R$ 2.10M', deviation: '-16.0%', status: 'No Prazo' },
  { id: 3, name: 'API Integração SESI', previsto: 'R$ 1.2M', realizado: 'R$ 1.10M', deviation: '-8.3%', status: 'No Prazo' },
  { id: 4, name: 'Plataforma RH', previsto: 'R$ 800k', realizado: 'R$ 850k', deviation: '+6.2%', status: 'Alerta' },
];

const PIE_COLORS = ['#1265AF', '#5BA9F0', '#F59E0B', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.96)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '12px 16px', boxShadow: 'var(--shadow-md)',
      fontSize: '0.8rem', fontFamily: 'inherit', backdropFilter: 'blur(8px)'
    }}>
      <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontWeight: 600 }}>{p.name}: <span style={{ color: 'var(--text-main)' }}>
            {p.name === 'consumido' || p.name === 'orcamento' || p.name === 'previsto' || p.name === 'realizado' 
              ? `R$ ${(p.value * 1000).toLocaleString('pt-BR')}` 
              : p.value}
          </span></span>
        </div>
      ))}
    </div>
  );
};

const DashboardFinanceiro = () => {
  const [filterPeriod, setFilterPeriod] = useState('2026');

  return (
    <div style={{ paddingBottom: '4rem' }} className="fade-up">

      {/* ── HEADER ── */}
      <header className="page-header-sticky" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Dashboard Financeiro
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Monitoramento estratégico de orçamento, custos e distribuição de recursos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#FFFFFF', borderRadius: 14, padding: '0.4rem 0.5rem 0.4rem 1rem',
            border: '1px solid rgba(18,101,175,0.1)', boxShadow: '0 2px 8px rgba(18,101,175,0.02)',
          }}>
            <Filter size={16} color="var(--text-muted)" />
            <select 
              value={filterPeriod} 
              onChange={e => setFilterPeriod(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', padding: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', boxShadow: 'none' }}
            >
              <option value="2026">Ano: 2026</option>
              <option value="2025">Ano: 2025</option>
              <option value="Q1">Q1 2026</option>
              <option value="Q2">Q2 2026</option>
            </select>
          </div>
          <button className="btn-secondary">
            <Download size={16} strokeWidth={2} />
            Relatório PDF
          </button>
        </div>
      </header>

      {/* ── KPIs EXECUTIVOS ── */}
      <div className="grid-auto-5" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Orçamento Previsto', value: kpiData.orcamentoPrevisto, sub: 'Para o período', icon: Target, color: 'var(--primary)', bg: 'rgba(18,101,175,0.08)' },
          { label: 'Valor Aprovado', value: kpiData.valorAprovado, sub: '87% do previsto', icon: DollarSign, color: 'var(--success)', bg: 'var(--success-bg)' },
          { label: 'Recursos Aplicados', value: kpiData.recursosAplicados, sub: 'Consumido até agora', icon: Activity, color: 'var(--warning)', bg: 'var(--warning-bg)', progress: kpiData.percentualConsumido },
          { label: 'Saldo Disponível', value: kpiData.saldoDisponivel, sub: 'Caixa restante', icon: Briefcase, color: 'var(--primary-light)', bg: 'rgba(91,169,240,0.12)', spotlight: true },
          { label: 'Desvio Financeiro', value: kpiData.desvioFinanceiro, sub: 'Acima do planejado', icon: AlertTriangle, color: 'var(--danger)', bg: 'var(--danger-bg)' },
        ].map((kpi, idx) => (
          kpi.spotlight ? (
            <div key={idx} className="gradient-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.75)' }}>
                  {kpi.label}
                </span>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.18)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <kpi.icon size={16} strokeWidth={2} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: '0.25rem' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                  {kpi.sub}
                </div>
              </div>
            </div>
          ) : (
            <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                  {kpi.label}
                </span>
                {kpi.progress !== undefined ? (
                  <DonutProgress value={kpi.progress} size={38} strokeWidth={4} colorFrom="var(--warning)" colorTo="#D97706" label="" />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <kpi.icon size={16} strokeWidth={2} />
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '0.25rem' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: kpi.color === 'var(--danger)' ? kpi.color : 'var(--text-muted)' }}>
                  {kpi.sub}
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* ── GRÁFICOS ── */}
      <div className="grid-split-2-1" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Curva de Consumo */}
        <div className="glass-card" style={{ padding: '1.5rem 1.5rem 1rem 1.5rem', height: 400 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Evolução de Custos vs Previsto</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Acompanhamento temporal do orçamento executado.</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrevisto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--text-muted)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--text-muted)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(18,101,175,0.05)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="previsto" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrevisto)" dot={false} />
              <Area type="monotone" dataKey="realizado" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRealizado)"
                dot={{ r: 3, fill: 'var(--primary)', strokeWidth: 0 }}
                activeDot={{ r: 7, fill: 'var(--primary)', stroke: '#ffffff', strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', height: 400, display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            padding: '1.25rem 1.5rem', 
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(91,169,240,0.05))',
            borderBottom: '1px solid rgba(139,92,246,0.1)',
            display: 'flex', alignItems: 'center', gap: '0.75rem'
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>
              <Sparkles size={16} strokeWidth={2} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#4C1D95' }}>Insights da IA</h3>
              <p style={{ fontSize: '0.75rem', color: '#6D28D9', opacity: 0.8 }}>Análise em tempo real</p>
            </div>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
            
            <div style={{ background: 'var(--danger-bg)', padding: '1rem', borderRadius: 16, border: '1px solid rgba(239,68,68,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--danger)' }}>
                <AlertTriangle size={15} strokeWidth={2.5} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Risco de Estouro</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>O <strong>App Gestão Industrial</strong> projeta um desvio de <strong>+8.3%</strong> no fechamento. Aceleração no consumo de horas na fase de testes.</p>
            </div>

            <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: 16, border: '1px solid rgba(34,197,94,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--success)' }}>
                <TrendingDown size={15} strokeWidth={2.5} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Economia Projetada</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>O <strong>Portal do Cidadão V2</strong> finalizou o backend com economia de 16%. O saldo de R$ 400k pode ser realocado.</p>
            </div>

            <div style={{ background: 'var(--info-bg)', padding: '1rem', borderRadius: 16, border: '1px solid rgba(18,101,175,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--primary)' }}>
                <Zap size={15} strokeWidth={2.5} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Padrão Detectado</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>Historicamente, projetos Mobile no CIS excedem o orçamento em 12% devido a integrações com legado.</p>
            </div>

          </div>
        </div>
      </div>

      {/* ── ROW 2: Tabela & Distribuição ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        
        {/* Análise do Orçamento do Produto */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Análise do Orçamento do Produto</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Comparativo Previsto · Realizado · Desvio · Status</p>
            </div>
            <button className="btn-dark btn-sm">Ver Todos</button>
          </div>
          
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Previsto</th>
                  <th>Realizado</th>
                  <th>Desvio</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {riskProjects.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.name}</td>
                    <td style={{ fontWeight: 600 }}>{p.previsto}</td>
                    <td>{p.realizado}</td>
                    <td>
                      <span style={{ color: p.deviation.startsWith('+') ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                        {p.deviation}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        p.status === 'Em Risco' ? 'badge-danger' : 
                        p.status === 'Alerta' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Consumo por Produto (Barras) */}
        <div className="glass-card" style={{ padding: '1.5rem', height: 400 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Consumo de Orçamento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productCostData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad_consumido" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--primary-dark)" />
                  <stop offset="100%" stopColor="var(--primary-light)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(18,101,175,0.05)" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => `${v/1000}k`} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-main)', fontWeight: 600 }} width={90} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(18,101,175,0.04)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '10px' }} />
              <Bar dataKey="orcamento" name="Orçamento" fill="var(--text-faint)" radius={[6, 6, 6, 6]} barSize={12} isAnimationActive={false} />
              <Bar dataKey="consumido" name="Consumido" fill="url(#grad_consumido)" radius={[6, 6, 6, 6]} barSize={12} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default DashboardFinanceiro;
