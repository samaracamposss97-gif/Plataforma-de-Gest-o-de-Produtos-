import React, { useState } from 'react';
import { LogIn, CheckCircle2 } from 'lucide-react';

// Deterministic pseudo-random in [0, 1), so the entrance-scatter offsets are
// stable across re-renders without needing Math.random() or a dependency.
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

interface LoginProps {
  onLogin: () => void;
}

// Fictional testimonials for the login background wall — same avatar-card
// pattern as the Equipes page, colored with the platform's own palette.
const AVATAR_COLORS = ['#1265AF', '#1B76CA', '#5BA9F0', '#0D4D87', '#8B5CF6', '#22C55E'];
const testimonials = [
  { name: 'Camila Duarte',  handle: 'camila.duarte',  quote: 'Centralizamos todo o conhecimento do CIS em um só lugar.' },
  { name: 'Rafael Nunes',   handle: 'rafael.nunes',   quote: 'A busca inteligente economiza horas toda semana.' },
  { name: 'Beatriz Lopes',  handle: 'bia.lopes',      quote: 'Setup foi rápido e a equipe adotou sem resistência.' },
  { name: 'Diego Farias',   handle: 'diego.farias',   quote: 'Finalmente temos rastreabilidade completa dos produtos.' },
  { name: 'Larissa Prado',  handle: 'larissa.prado',  quote: 'Os dashboards financeiros mudaram nossas reuniões.' },
  { name: 'Thiago Rocha',   handle: 'thiago.rocha',   quote: 'Muito mais fácil registrar evidências agora.' },
  { name: 'Fernanda Reis',  handle: 'fe.reis',        quote: 'Intuitiva mesmo pra quem não é da área técnica.' },
  { name: 'Marcos Vieira',  handle: 'marcos.vieira',  quote: 'Ótima visibilidade do progresso de cada etapa.' },
  { name: 'Juliana Cardoso',handle: 'ju.cardoso',     quote: 'Reduziu bastante o retrabalho entre as equipes.' },
  { name: 'Pedro Henrique', handle: 'pedro.h',        quote: 'Suporte rápido, equipe sempre disponível.' },
  { name: 'Aline Barros',   handle: 'aline.barros',   quote: 'A governança de prazos ficou impecável.' },
  { name: 'Gustavo Melo',   handle: 'gustavo.melo',   quote: 'Interface bonita e rápida — uso todo dia.' },
].map((t, i) => ({
  ...t,
  initials: t.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
  color: AVATAR_COLORS[i % AVATAR_COLORS.length],
}));

// 4 horizontal rows, each a long repeating slice of the testimonials (offset
// per row so neighbors don't line up) duplicated once for a seamless loop.
const CARD_ROWS = 4;
const CARDS_PER_ROW = 10;
const testimonialRows = Array.from({ length: CARD_ROWS }, (_, ri) => {
  const list = Array.from({ length: CARDS_PER_ROW }, (_, i) => testimonials[(i * CARD_ROWS + ri) % testimonials.length]);
  return [...list, ...list];
});

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for any credentials
    onLogin();
  };

  const glassInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem 1.5rem',
    borderRadius: '999px',
    border: '1px solid rgba(18, 101, 175, 0.14)',
    background: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(10px) saturate(160%)',
    WebkitBackdropFilter: 'blur(10px) saturate(160%)',
    fontSize: '1rem',
    color: 'var(--text-main)',
    outline: 'none',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(18,101,175,0.04)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  return (
    <div className="login-bg" style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
    }}>
      {/* Subtle photographic grain — breaks up the flat gradient without adding color */}
      <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5, mixBlendMode: 'multiply', pointerEvents: 'none' }}>
        <filter id="login-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#login-grain)" />
      </svg>

      {/* Testimonial wall — tilted back in 3D (like the reference), 4 rows
          scrolling horizontally, alternating left→right / right→left, each
          looping seamlessly since its list is duplicated. A flat radial fade
          sits on top (outside the tilted layer) so the wall recedes behind
          the centered login card instead of competing with it. */}
      <div className="login-cards-bg" aria-hidden="true">
        <div className="login-cards-grid">
          {testimonialRows.map((row, ri) => (
            <div key={ri} className="login-cards-row" style={{
              animationDirection: ri % 2 === 0 ? 'normal' : 'reverse',
              animationDuration: `${38 + ri * 6}s`,
            }}>
              {row.map((t, i) => {
                const seed = ri * 137 + i * 11;
                const sx = (pseudoRandom(seed) - 0.5) * 700;
                const sy = (pseudoRandom(seed + 1) - 0.5) * 500;
                const srot = (pseudoRandom(seed + 2) - 0.5) * 140;
                const edelay = pseudoRandom(seed + 3) * 0.6;
                return (
                  <div key={i} className="login-testi-flip" style={{
                    ['--sx' as string]: `${sx.toFixed(0)}px`,
                    ['--sy' as string]: `${sy.toFixed(0)}px`,
                    ['--srot' as string]: `${srot.toFixed(0)}deg`,
                    ['--edelay' as string]: `${edelay.toFixed(2)}s`,
                  } as React.CSSProperties}>
                    <div className="login-testi-card">
                      <div className="login-testi-head">
                        <div className="login-testi-avatar" style={{ background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}CC 100%)` }}>
                          {t.initials}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="login-testi-name">
                            {t.name}
                            <span className="login-testi-flag">BR</span>
                          </div>
                          <div className="login-testi-handle">@{t.handle}</div>
                        </div>
                      </div>
                      <p className="login-testi-quote">{t.quote}</p>
                    </div>
                    <div className="login-testi-card login-testi-card--back">
                      <CheckCircle2 size={22} color="#ffffff" strokeWidth={1.75} />
                      <div className="login-testi-back-title">Depoimento verificado</div>
                      <div className="login-testi-back-sub">Plataforma de Gestão · CIS/SESI</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="login-cards-fade" />
      </div>

      {/* Liquid glass card */}
      <div style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        padding: '4rem',
        borderRadius: '32px',
        boxShadow: '0 24px 60px rgba(13, 77, 135, 0.35), inset 0 1px 0 rgba(255,255,255,0.8)',
        width: '100%',
        maxWidth: '520px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <img
            src="/logo_sesi.png"
            alt="Centro de Inovação SESI"
            style={{ width: '100%', maxWidth: '190px', height: 'auto', objectFit: 'contain' }}
          />
          <h2 style={{ marginTop: '1.25rem', color: '#333333', fontSize: '1.75rem', fontWeight: 500 }}>
            Plataforma de Gestão
          </h2>
          <p style={{ color: '#627d98', fontSize: '0.95rem' }}>
            Faça login para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={glassInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(18, 101, 175, 0.16), inset 0 1px 0 rgba(255,255,255,0.6)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(18, 101, 175, 0.14)';
              e.target.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(18,101,175,0.04)';
            }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={glassInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(18, 101, 175, 0.16), inset 0 1px 0 rgba(255,255,255,0.6)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(18, 101, 175, 0.14)';
              e.target.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(18,101,175,0.04)';
            }}
          />
          <button type="submit" className="btn-primary btn-lg" style={{ marginTop: '0.5rem', width: '100%' }}>
            <LogIn size={18} />
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
