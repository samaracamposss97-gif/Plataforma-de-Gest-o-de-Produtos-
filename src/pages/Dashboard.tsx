import React, { useMemo, useCallback, useState } from "react";
import {
  Clock,
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
  Filter,
  X,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import {
  products,
  alertsData,
  bottleneckData,
  avgTimePerStageData,
  alertColors,
} from "../data/dashboardData";
import DonutProgress from "../components/DonutProgress";

// dd-mm-yyyy → Date
const parseDeadline = (deadline: string): Date => {
  const [day, month, year] = deadline.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// yyyy-mm-dd (native <input type="date"> value) → Date
const parseISODate = (iso: string): Date => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// ── Icon map (keeps data file JSX-free) ──────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  Clock:         <Clock size={16} />,
  AlertTriangle: <AlertTriangle size={16} />,
  UserCheck:     <UserCheck size={16} />,
  FileCheck:     <FileCheck size={16} />,
  AlertCircle:   <AlertCircle size={16} />,
  ShieldCheck:   <ShieldCheck size={16} />,
};

// ── CustomTooltip (memoised) ─────────────────────────────────────────────────
const CustomTooltip = React.memo(({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(255,255,255,0.96)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "12px 16px",
      boxShadow: "var(--shadow-md)",
      fontSize: "0.8rem",
      fontFamily: "inherit",
      backdropFilter: "blur(8px)",
    }}>
      <p style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ fontWeight: 600 }}>{p.name}: <span style={{ color: "var(--text-main)" }}>{p.value}</span></span>
        </div>
      ))}
    </div>
  );
});

// ── KpiCard (memoised) — clean white card, blue used only as accent detail
//    plus a soft fluid blob shape decorating the background ──
const KPI_BLOB_TONES = [
  ["#5BA9F0", "#1265AF"],
  ["#9CC7F5", "#1B76CA"],
  ["#AED4F7", "#5BA9F0"],
  ["#CFE6FB", "#5BA9F0"],
];

interface KpiCardProps {
  label: string; value: string | number; sub: string;
  icon: React.ReactNode; iconColor: string; accent: string;
  bar?: boolean; barValue?: number; danger?: boolean; variant?: number; spotlight?: boolean;
}
const KpiCard = React.memo(({ label, value, sub, icon, bar, barValue, danger, variant = 0, spotlight }: KpiCardProps) => {
  const [from, to] = KPI_BLOB_TONES[variant % KPI_BLOB_TONES.length];

  if (spotlight) {
    return (
      <div className="gradient-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>
            {label}
          </span>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>{icon}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", position: "relative" }}>
          <span style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: "#ffffff" }}>
            {value}
          </span>
          {bar && (
            <DonutProgress
              value={barValue ?? 0}
              size={58}
              strokeWidth={6}
              colorFrom="#ffffff"
              colorTo="rgba(255,255,255,0.7)"
              trackColor="rgba(255,255,255,0.22)"
              label={<span style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: 800 }}>{Math.round(barValue ?? 0)}%</span>}
            />
          )}
        </div>
        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", fontWeight: 500, position: "relative" }}>
          {sub}
        </span>
      </div>
    );
  }

  return (
    <div className="glass-card stat-card" style={{
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Fluid blob decoration, tucked in the corner and mostly clipped by the card */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-38%", right: "-28%", width: 170, height: 150,
        borderRadius: "62% 38% 33% 67% / 58% 32% 68% 42%",
        background: `radial-gradient(circle at 32% 30%, ${from} 0%, ${to} 70%)`,
        opacity: 0.16, filter: "blur(1px)", pointerEvents: "none", zIndex: -1,
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          {label}
        </span>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${to}, ${from})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", boxShadow: `0 4px 10px ${to}40` }}>{icon}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", position: "relative" }}>
        <span style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--text-main)" }}>
          {value}
        </span>
        {bar && (
          <DonutProgress value={barValue ?? 0} size={52} strokeWidth={6} colorFrom={from} colorTo={to} />
        )}
      </div>
      <span style={{ fontSize: "0.8rem", color: danger ? "var(--warning)" : "var(--text-muted)", fontWeight: danger ? 600 : 500, position: "relative" }}>
        {sub}
      </span>
    </div>
  );
});

// ── AlertCard (memoised) ─────────────────────────────────────────────────────
const AlertCard = React.memo(({ alert }: { alert: typeof alertsData[0] }) => {
  const c = alertColors[alert.type] || alertColors.info;
  const icon = ICON_MAP[alert.iconName];
  const onEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
  }, []);
  const onLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
  }, []);
  return (
    <div style={{ padding: "1rem", borderRadius: 14, background: "var(--bg-app)", border: "1px solid var(--border)", display: "flex", gap: "0.75rem", alignItems: "flex-start", transition: "all 0.2s ease", cursor: "default" }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", color: c.iconColor, flexShrink: 0, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
        {icon}
      </div>
      <div style={{ overflow: "hidden" }}>
        <span className={`badge ${c.badge}`} style={{ marginBottom: "0.5rem", fontSize: "0.65rem", padding: "0.2rem 0.5rem" }}>{alert.category}</span>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)", lineHeight: 1.2, marginBottom: "0.25rem" }}>{alert.title}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.3 }}>{alert.desc}</div>
      </div>
    </div>
  );
});

// ── ProductRow (memoised) ────────────────────────────────────────────────────
const ProductRow = React.memo(({ product }: { product: typeof products[0] }) => {
  const onEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 8px 16px rgba(18,101,175,0.08)";
    e.currentTarget.style.background = "#FFFFFF";
    e.currentTarget.style.borderColor = "rgba(18,101,175,0.15)";
  }, []);
  const onLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(18,101,175,0.02)";
    e.currentTarget.style.background = "rgba(255,255,255,0.6)";
    e.currentTarget.style.borderColor = "rgba(18,101,175,0.06)";
  }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 1rem", borderRadius: 16, background: "rgba(255,255,255,0.6)", border: "1px solid rgba(18,101,175,0.06)", boxShadow: "0 2px 8px rgba(18,101,175,0.02)", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer" }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div style={{ padding: "0.35rem 0.6rem", borderRadius: 999, background: "linear-gradient(135deg,rgba(18,101,175,0.12),rgba(91,169,240,0.08))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(18,101,175,0.05)" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--primary)" }}>{product.progress}%</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-faint)", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.1rem", fontWeight: 500 }}>
          <Clock size={12} strokeWidth={2} /> {product.deadline}
        </div>
      </div>
      <ArrowRight size={14} color="var(--text-faint)" strokeWidth={2} />
    </div>
  );
});

// ── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const hasActiveFilters = selectedProductId !== "all" || !!dateFrom || !!dateTo;
  const clearFilters = () => { setSelectedProductId("all"); setDateFrom(""); setDateTo(""); };

  const filteredProducts = useMemo(() => products.filter(p => {
    if (selectedProductId !== "all" && String(p.id) !== selectedProductId) return false;
    if (dateFrom || dateTo) {
      const deadline = parseDeadline(p.deadline);
      if (dateFrom && deadline < parseISODate(dateFrom)) return false;
      if (dateTo && deadline > parseISODate(dateTo)) return false;
    }
    return true;
  }), [selectedProductId, dateFrom, dateTo]);

  const totalProducts  = useMemo(() => filteredProducts.length, [filteredProducts]);
  const inProgress     = useMemo(() => filteredProducts.filter(p => p.progress > 0 && p.progress < 100).length, [filteredProducts]);
  const avgProgress    = useMemo(() => filteredProducts.length ? Math.round(filteredProducts.reduce((a, p) => a + p.progress, 0) / filteredProducts.length) : 0, [filteredProducts]);
  const nearCompletion = useMemo(() => filteredProducts.filter(p => p.progress >= 80).length, [filteredProducts]);

  const sortedProducts = useMemo(() => [...filteredProducts].sort((a, b) => b.progress - a.progress), [filteredProducts]);

  const filteredStageData = useMemo(() => (
    ["Ideação", "Planejamento", "Desenvolvimento", "Entrega"].map(name => ({
      name,
      value: filteredProducts.filter(p => p.stage === name).length,
    }))
  ), [filteredProducts]);

  const kpiCards = useMemo(() => [
    { label: "Total de Produtos", value: totalProducts, sub: "Cadastrados no CIS",   icon: <Package  size={22} strokeWidth={1.5} />, iconColor: "var(--primary)",       accent: "var(--primary)" },
    { label: "Em Andamento",      value: inProgress,    sub: "Projetos ativos",      icon: <Layers   size={22} strokeWidth={1.5} />, iconColor: "var(--primary-light)", accent: "var(--primary-light)" },
    { label: "Progresso Médio",   value: `${avgProgress}%`, sub: "Geral do portfólio", icon: <Activity size={22} strokeWidth={1.5} />, iconColor: "var(--info)",         accent: "var(--info)", bar: true, barValue: avgProgress, spotlight: true },
    { label: "Prazos Próximos",   value: nearCompletion, sub: "Próximos 15 dias",   icon: <Hourglass size={22} strokeWidth={1.5} />, iconColor: "var(--warning)",       accent: "var(--warning)", danger: true },
  ], [totalProducts, inProgress, avgProgress, nearCompletion]);

  return (
    <div style={{ paddingBottom: "4rem" }}>

      {/* HEADER */}
      <header className="page-header-sticky" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 500, letterSpacing: "-0.03em", color: "var(--text-main)", marginBottom: "0.25rem" }}>Dashboard Gerencial</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500 }}>Monitoramento Estratégico e Governança de Produtos</p>
        </div>
        <button className="btn-primary">
          <Download size={18} strokeWidth={1.5} /> Exportar Relatório
        </button>
      </header>

      {/* FILTERS */}
      <div className="filter-bar" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 700, alignSelf: "center" }}>
          <Filter size={15} strokeWidth={1.5} /> Filtros
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Produto</label>
          <select
            className="filter-pill"
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            style={{ minWidth: 200 }}
          >
            <option value="all">Todos os produtos</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Prazo de</label>
          <input
            className="filter-pill"
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Até</label>
          <input
            className="filter-pill"
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn-ghost"
            style={{ marginLeft: "auto", alignSelf: "flex-end" }}
          >
            <X size={14} /> Limpar filtros
          </button>
        )}
      </div>

      {/* KPI CARDS */}
      <div className="grid-auto-4" style={{ gap: "1.5rem", marginBottom: "2rem" }}>
        {kpiCards.map((card, i) => <KpiCard key={i} {...card} variant={i} />)}
      </div>

      {/* CHARTS ROW 1 – Impedimentos */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="glass-card" style={{ height: 340, padding: "1.5rem 1.5rem 1rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.2rem" }}>Impedimentos (Frequência)</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Ocorrências e impacto por tipo de bloqueio · Últimos 30 dias</p>
            </div>
            <span className="badge badge-danger">Atenção</span>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={bottleneckData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grad_danger"  x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#F87171" /><stop offset="100%" stopColor="#DC2626" /></linearGradient>
                <linearGradient id="grad_warning" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FBBF24" /><stop offset="100%" stopColor="#D97706" /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal vertical={false} />
              <XAxis type="number" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: "var(--text-muted)" }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} width={140} tick={{ fill: "var(--text-main)", fontWeight: 500 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--info-bg)" }} />
              <Bar dataKey="count"    fill="url(#grad_danger)"  radius={[0,6,6,0]} name="Ocorrências"          barSize={18} />
              <Bar dataKey="avgDelay" fill="url(#grad_warning)" radius={[0,6,6,0]} name="Dias Médio de Atraso" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>

        {/* Produtos por Etapa */}
        <div className="glass-card" style={{ height: 340, padding: "1.5rem 1.5rem 1rem 1.5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.2rem" }}>Produtos por Etapa</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Distribuição do portfólio</p>
          </div>
          <ResponsiveContainer width="100%" height="75%">
            <BarChart data={filteredStageData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad_ideacao"         x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0D4D87" /><stop offset="100%" stopColor="#1265AF" /></linearGradient>
                <linearGradient id="grad_planejamento"    x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1265AF" /><stop offset="100%" stopColor="#1B76CA" /></linearGradient>
                <linearGradient id="grad_desenvolvimento" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1B76CA" /><stop offset="100%" stopColor="#5BA9F0" /></linearGradient>
                <linearGradient id="grad_entrega"         x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5BA9F0" /><stop offset="100%" stopColor="#AED4F7" /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: "var(--text-muted)" }} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{ fill: "var(--text-muted)" }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(18,101,175,0.04)" }} />
              <Bar dataKey="value" name="Produtos" radius={[8,8,8,8]} barSize={28}>
                {filteredStageData.map((entry, index) => {
                  const grad = entry.name === "Planejamento" ? "url(#grad_planejamento)" : entry.name === "Desenvolvimento" ? "url(#grad_desenvolvimento)" : entry.name === "Entrega" ? "url(#grad_entrega)" : "url(#grad_ideacao)";
                  return <Cell key={index} fill={grad} filter="drop-shadow(0px 4px 6px rgba(18,101,175,0.1))" />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progresso das Entregas */}
        <div className="glass-card" style={{ height: 340, padding: "1.5rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.2rem" }}>Progresso das Entregas</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Progresso por produto</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", maxHeight: 220, paddingRight: "0.5rem" }} className="custom-scrollbar">
            {sortedProducts.map(product => <ProductRow key={product.id} product={product} />)}
          </div>
        </div>

        {/* Tempo Médio por Etapa */}
        <div className="glass-card" style={{ height: 340, padding: "1.5rem 1.5rem 1rem 1.5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.2rem" }}>Tempo Médio por Etapa</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Dias corridos, média do portfólio</p>
          </div>
          <ResponsiveContainer width="100%" height="75%">
            <BarChart data={avgTimePerStageData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad_time_ideacao"         x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0D4D87" /><stop offset="100%" stopColor="#1265AF" /></linearGradient>
                <linearGradient id="grad_time_planejamento"    x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1265AF" /><stop offset="100%" stopColor="#1B76CA" /></linearGradient>
                <linearGradient id="grad_time_desenvolvimento" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1B76CA" /><stop offset="100%" stopColor="#5BA9F0" /></linearGradient>
                <linearGradient id="grad_time_entrega"         x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5BA9F0" /><stop offset="100%" stopColor="#AED4F7" /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: "var(--text-muted)" }} />
              <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{ fill: "var(--text-muted)" }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(18,101,175,0.04)" }} />
              <Bar dataKey="value" name="Dias" radius={[8,8,8,8]} barSize={28}>
                {avgTimePerStageData.map((entry, index) => {
                  const grad = entry.name === "Planejamento" ? "url(#grad_time_planejamento)" : entry.name === "Desenvolvimento" ? "url(#grad_time_desenvolvimento)" : entry.name === "Entrega" ? "url(#grad_time_entrega)" : "url(#grad_time_ideacao)";
                  return <Cell key={index} fill={grad} filter="drop-shadow(0px 4px 6px rgba(18,101,175,0.1))" />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GOVERNANCE ALERTS */}
      <div className="glass-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--warning-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--warning)" }}>
              <Zap size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.1rem" }}>Governança, Prazos e Alertas</h2>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Monitoramento automático de conformidade e riscos</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span className="badge badge-danger" style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}>4 Críticos</span>
            <span className="badge badge-info"   style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}>12 Totais</span>
          </div>
        </div>
        <div className="grid-auto-3" style={{ gap: "0.75rem", marginBottom: "1rem" }}>
          {alertsData.map(alert => <AlertCard key={alert.id} alert={alert} />)}
        </div>
        <div style={{ padding: "1rem 1.25rem", background: "var(--info-bg)", borderRadius: 14, border: "1px solid var(--border)" }}>
          <div className="grid-auto-4" style={{ gap: "1rem" }}>
            {[
              { title: "Rastreabilidade", desc: "Controle de responsáveis" },
              { title: "LGPD",            desc: "Verificação automática"   },
              { title: "Contas",          desc: "Evidências centralizadas" },
              { title: "Financeiro",      desc: "Alertas de desvios"       },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-main)" }}>{item.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>{item.desc}</div>
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
