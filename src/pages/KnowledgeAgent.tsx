import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, User, Sparkles, History, Lightbulb,
  Brain, Zap, Clock, BookOpen, FileText, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const suggestions = [
  'Quais foram as lições do Portal do Cidadão?',
  'Esforço previsto no Q1 2025',
  'Riscos recorrentes em projetos de API',
  'Aprendizados reutilizáveis de mobile',
];

const KnowledgeAgent = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Olá! Sou o Assistente de Inteligência Institucional do CIS. Como posso ajudar você hoje? Posso consultar experiências passadas, lições aprendidas ou detalhes técnicos de produtos anteriores.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Com base no repositório do CIS, identifiquei que em projetos similares ao "${msg}", as lições aprendidas sugerem foco na integração de APIs legadas logo na fase de planejamento para evitar atrasos na entrega. Deseja ver os documentos de evidência desse projeto?`
      }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>

      {/* ── MAIN CHAT ── */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', borderRadius: 24 }}>

        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '1rem',
          background: 'linear-gradient(135deg, rgba(18,101,175,0.04), rgba(91,169,240,0.02))',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, #1265AF, #1B76CA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(18,101,175,0.25)',
          }}>
            <Brain size={22} color="white" strokeWidth={1.5} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Oráculo IA — CIS
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Consulta em linguagem natural sobre a memória institucional
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, padding: '2rem', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
        }} className="custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  gap: '0.9rem',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #1265AF, #1B76CA)'
                    : 'rgba(18,101,175,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(18,101,175,0.1)',
                }}>
                  {msg.role === 'user'
                    ? <User size={16} color="white" strokeWidth={1.5} />
                    : <Sparkles size={16} color="var(--primary)" strokeWidth={1.5} />}
                </div>

                {/* Bubble */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #1265AF, #1B76CA)'
                    : 'rgba(255,255,255,0.9)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  boxShadow: msg.role === 'user'
                    ? '0 8px 24px rgba(18,101,175,0.2)'
                    : '0 4px 12px rgba(18,101,175,0.06)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(18,101,175,0.06)',
                  fontWeight: 500,
                }}>
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', gap: '0.9rem', alignSelf: 'flex-start' }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(18,101,175,0.08)', border: '1px solid rgba(18,101,175,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={16} color="var(--primary)" strokeWidth={1.5} />
                </div>
                <div style={{
                  padding: '1rem 1.25rem', borderRadius: '4px 18px 18px 18px',
                  background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(18,101,175,0.06)',
                  display: 'flex', gap: '6px', alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(18,101,175,0.06)',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      opacity: 0.6,
                    }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', background: 'rgba(247,250,253,0.8)' }}>
          <div style={{
            display: 'flex', gap: '0.75rem', alignItems: 'center',
            background: '#FFFFFF', borderRadius: 16,
            border: '1.5px solid rgba(18,101,175,0.12)',
            padding: '0.5rem 0.5rem 0.5rem 1.25rem',
            boxShadow: '0 4px 16px rgba(18,101,175,0.06)',
            transition: 'all 0.2s',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte sobre projetos, riscos, aprendizados..."
              style={{
                flex: 1, background: 'none', border: 'none',
                color: 'var(--text-main)', outline: 'none',
                fontSize: '0.9rem', fontFamily: 'inherit', fontWeight: 500,
              }}
            />
            <button
              onClick={() => handleSend()}
              style={{
                background: 'linear-gradient(135deg, #1265AF, #1B76CA)',
                color: 'white', border: 'none', borderRadius: 12,
                padding: '0.65rem 1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.8rem', fontWeight: 700, fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(18,101,175,0.25)',
                transition: 'all 0.2s',
              }}
            >
              <Send size={16} strokeWidth={1.5} /> Enviar
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }} className="custom-scrollbar">

        {/* Histórico */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <History size={15} strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Histórico Recente</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['"Quais foram as lições do projeto X?"', '"Esforço previsto no Q1 2025"'].map((q, i) => (
              <button key={i} onClick={() => handleSend(q.replace(/"/g, ''))}
                style={{
                  background: 'rgba(18,101,175,0.04)', border: '1px solid rgba(18,101,175,0.06)',
                  borderRadius: 10, padding: '0.65rem 0.9rem', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500, textAlign: 'left',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(18,101,175,0.08)'; e.currentTarget.style.borderColor = 'rgba(18,101,175,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(18,101,175,0.04)'; e.currentTarget.style.borderColor = 'rgba(18,101,175,0.06)'; }}
              >
                <span>{q}</span>
                <ChevronRight size={13} color="var(--text-faint)" />
              </button>
            ))}
          </div>
        </div>

        {/* Sugestões */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
              <Lightbulb size={15} strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Sugestões</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { title: 'Padrões de UI', desc: 'Veja os templates de design validados em 2025.', icon: <BookOpen size={14} /> },
              { title: 'Riscos Comuns', desc: 'Quais os riscos mais frequentes em projetos de mobile?', icon: <Zap size={14} /> },
            ].map((s, i) => (
              <button key={i} onClick={() => handleSend(s.title)}
                style={{
                  background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(18,101,175,0.06)',
                  borderRadius: 12, padding: '0.9rem 1rem', cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(18,101,175,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', color: 'var(--primary)' }}>
                  {s.icon}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{s.title}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick asks */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(139,92,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
              <FileText size={15} strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Perguntas Rápidas</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSend(s)}
                style={{
                  background: 'none', border: 'none', padding: '0.4rem 0',
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.gap = '0.6rem'; }}
                onMouseLeave={e => { e.currentTarget.style.gap = '0.4rem'; }}
              >
                <ChevronRight size={13} /> {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeAgent;
