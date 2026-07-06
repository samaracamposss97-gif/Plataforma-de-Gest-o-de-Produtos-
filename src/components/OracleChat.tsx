import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OracleChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput]   = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Olá! Sou o Oráculo CIS. Como posso ajudar na construção do seu produto hoje?' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: input }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Analisando sua pergunta no repositório institucional... Com base nas experiências passadas, recomendo focar na validação de riscos durante esta fase.',
      }]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.08, boxShadow: '0 16px 40px rgba(18,101,175,0.40)' }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: 58, height: 58,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1265AF 0%, #1B76CA 100%)',
          color: 'white', border: 'none',
          boxShadow: '0 8px 28px rgba(18,101,175,0.35)',
          cursor: 'pointer', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={24} /></motion.div>
            : <motion.div key="open"  initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Sparkles size={24} /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed', bottom: '6.5rem', right: '2rem',
              width: 380, height: 560,
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(24px)',
              borderRadius: 24,
              border: '1px solid rgba(18,101,175,0.12)',
              boxShadow: '0 24px 64px rgba(18,101,175,0.16), inset 0 1px 0 rgba(255,255,255,0.80)',
              zIndex: 2000,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(18,101,175,0.06) 0%, rgba(91,169,240,0.04) 100%)',
              borderBottom: '1px solid rgba(18,101,175,0.08)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #1265AF, #5BA9F0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(18,101,175,0.25)',
              }}>
                <Sparkles size={20} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111111' }}>Oráculo CIS</h4>
                <div style={{ fontSize: '0.72rem', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 0 2px rgba(34,197,94,0.25)' }} />
                  Online · IA Ativa
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111111', padding: 4, borderRadius: 8, display: 'flex' }}
                onMouseEnter={e => e.currentTarget.style.color = '#111111'}
                onMouseLeave={e => e.currentTarget.style.color = '#111111'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start', gap: '0.3rem' }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '0.8rem 1.05rem',
                    borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                    background: msg.type === 'user'
                      ? 'linear-gradient(135deg, #1265AF, #1B76CA)'
                      : 'rgba(18,101,175,0.05)',
                    color: msg.type === 'user' ? 'white' : '#111111',
                    fontSize: '0.875rem',
                    lineHeight: 1.55,
                    border: msg.type === 'bot' ? '1px solid rgba(18,101,175,0.08)' : 'none',
                    boxShadow: msg.type === 'user'
                      ? '0 4px 12px rgba(18,101,175,0.25)'
                      : '0 2px 6px rgba(18,101,175,0.04)',
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#111111', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {msg.type === 'user' ? <User size={9} /> : <Bot size={9} />}
                    {msg.type === 'user' ? 'Você' : 'Oráculo'}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{
                    padding: '0.8rem 1.05rem',
                    borderRadius: '4px 18px 18px 18px',
                    background: 'rgba(18,101,175,0.05)',
                    border: '1px solid rgba(18,101,175,0.08)',
                    display: 'flex', gap: '4px', alignItems: 'center',
                  }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#1265AF', opacity: 0.5,
                        animation: `bounce 1.2s ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(18,101,175,0.08)', background: 'rgba(255,255,255,0.95)' }}>
              <div style={{
                display: 'flex', gap: '0.6rem', alignItems: 'center',
                background: 'rgba(18,101,175,0.04)',
                padding: '0.45rem 0.45rem 0.45rem 1rem',
                borderRadius: 14,
                border: '1px solid rgba(18,101,175,0.10)',
              }}>
                <input
                  type="text"
                  placeholder="Pergunte ao Oráculo CIS..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  style={{
                    flex: 1, background: 'none', border: 'none',
                    color: '#111111', outline: 'none', fontSize: '0.875rem',
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    background: 'linear-gradient(135deg, #1265AF, #1B76CA)',
                    color: 'white', border: 'none',
                    width: 36, height: 36, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(18,101,175,0.25)',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
};

export default OracleChat;
