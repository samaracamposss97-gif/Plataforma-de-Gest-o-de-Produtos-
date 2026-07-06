import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Info, ChevronDown, ChevronUp, Paperclip, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const constructionPhases = [
  {
    title: 'Imersão',
    count: 3,
    topics: ['Público alvo', 'Tamanho e potencial do mercado', 'Parcerias']
  },
  {
    title: 'Visão do Produto',
    count: 5,
    topics: ['Levantamento de riscos', 'FIT dos produtos', 'Pilares estratégicos', 'Jornada do usuário', 'Identidade visual']
  },
  {
    title: 'Estratégia',
    count: 6,
    topics: ['Alinhamento estratégico', 'OKRs e métricas', 'Estratégia de mercado', 'Experiência do usuário', 'Teste e validação']
  },
  {
    title: 'Lançamento',
    count: 5,
    topics: ['Definição de lançamento', 'Jornada impactada', 'Identidade visual', 'Nome do produto', 'Plano go-to-market']
  },
  {
    title: 'Evolução',
    count: 3,
    topics: ['Roadmap do produto', 'Evidências futuras', 'Critérios de priorização']
  },
  {
    title: 'Repasses',
    count: 3,
    topics: ['Acompanhamento métricas', 'Repasses e mentorias', 'Registro de marcas']
  }
];

interface ProductDetailProps {
  product: any;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [topicData, setTopicData] = useState<Record<string, { text: string, files: string[] }>>({});

  const handleTopicClick = (topic: string) => {
    setExpandedTopic(expandedTopic === topic ? null : topic);
  };

  const handleTextChange = (topic: string, text: string) => {
    setTopicData(prev => ({
      ...prev,
      [topic]: { ...prev[topic] || { text: '', files: [] }, text }
    }));
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        width: '600px', 
        height: '100vh', 
        background: 'var(--bg-sidebar)', 
        zIndex: 1000,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        borderLeft: '1px solid var(--border)',
        padding: '2rem',
        overflowY: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{product.category}</span>
          <h2 style={{ fontSize: '1.75rem', color: 'white' }}>{product.name}</h2>
          <p style={{ color: '#111111' }}>Responsável: {product.lead}</p>
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#111111', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.03)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={18} color="var(--primary)" />
          Progresso de Construção
        </h3>
        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
          <div style={{ width: `${product.progress}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--accent-cyan))' }}></div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#111111' }}>{product.progress}% concluído • {product.stage}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {constructionPhases.map((phase) => (
          <div key={phase.title}>
            <div style={{ 
              background: 'linear-gradient(to right, var(--primary), transparent)', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h4 style={{ color: 'white', fontSize: '1rem' }}>{phase.title} ({phase.count})</h4>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid var(--border)',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {phase.topics.map((topic) => {
                const isExpanded = expandedTopic === topic;
                const hasData = topicData[topic]?.text.length > 0;

                return (
                  <div key={topic} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div 
                      onClick={() => handleTopicClick(topic)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        padding: '0.75rem',
                        borderRadius: '6px',
                        background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      className="topic-item"
                    >
                      {hasData ? <CheckCircle2 size={18} color="var(--success)" /> : <Circle size={18} color="#111111" />}
                      <span style={{ fontSize: '0.9rem', color: isExpanded ? 'var(--primary)' : '#111111', flex: 1 }}>
                        {topic}
                      </span>
                      {isExpanded ? <ChevronUp size={16} color="#111111" /> : <ChevronDown size={16} color="#111111" />}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ padding: '0 0.75rem 0.75rem 2.5rem' }}>
                            <textarea 
                              placeholder="Descreva aqui o contexto, aprendizados ou decisões..."
                              value={topicData[topic]?.text || ''}
                              onChange={(e) => handleTextChange(topic, e.target.value)}
                              style={{ 
                                width: '100%', 
                                minHeight: '100px', 
                                background: 'rgba(0,0,0,0.2)', 
                                border: '1px solid var(--border)', 
                                borderRadius: '8px', 
                                padding: '0.75rem', 
                                color: 'white',
                                outline: 'none',
                                fontSize: '0.85rem',
                                resize: 'vertical',
                                marginBottom: '0.75rem'
                              }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <button className="nav-item" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', margin: 0 }}>
                                <Paperclip size={14} />
                                Anexar Evidência
                              </button>
                              <span style={{ fontSize: '0.7rem', color: '#111111' }}>Salvo automaticamente</span>
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
        ))}
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: '#111111', marginBottom: '1rem' }}>
          Toda evidência anexada aqui será automaticamente enviada ao repositório central.
        </p>
        <button className="btn-primary" style={{ width: '100%' }}>
          Gerar Documentação Automática
        </button>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
