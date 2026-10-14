import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Filter,
  Users,
  Mail,
  ChevronDown,
  Check
} from 'lucide-react';
import SearchAutocomplete from '../components/SearchAutocomplete';

export interface Member {
  id: string;
  name: string;
  email?: string;
  role: string;
  products: string[];
  avatarColor: string;
}

export const MEMBERS_STORAGE_KEY = 'cis_members';

export const defaultMembers: Member[] = [
  { id: '1', name: 'Júlio César', email: 'julio.cesar@sesi.org.br', role: 'Gestor de Contas', products: ['Portal do Cidadão V2'], avatarColor: '#1265AF' },
  { id: '2', name: 'Ana Júlia Rodrigues', email: 'ana.julia@sesi.org.br', role: 'Product Owner', products: ['Portal do Cidadão V2', 'API Integração SESI'], avatarColor: '#0D4D87' },
  { id: '3', name: 'Livio Leitão', email: 'livio.leitao@sesi.org.br', role: 'Designer UI/UX', products: ['App Gestão Industrial'], avatarColor: '#5BA9F0' },
  { id: '4', name: 'Samara Campos', email: 'samara.campos@sesi.org.br', role: 'Gestora Geral', products: [], avatarColor: '#1B76CA' },
  { id: '5', name: 'Felipe Dantas', email: 'felipe.dantas@sesi.org.br', role: 'Analista de Sistemas', products: ['Dashboard BI Institucional'], avatarColor: '#8B5CF6' },
  { id: '6', name: 'João Vitor Dos Santos', email: 'joao.vitor@sesi.org.br', role: 'Desenvolvedor Backend', products: ['API Integração SESI'], avatarColor: '#22C55E' },
  { id: '7', name: 'Gabriel Novais Lima', email: 'gabriel.novais@sesi.org.br', role: 'Desenvolvedor Frontend', products: ['Portal do Cidadão V2'], avatarColor: '#F59E0B' },
  { id: '8', name: 'Isabele Oliveira', email: 'isabele.oliveira@sesi.org.br', role: 'Designer UI/UX', products: ['App Gestão Industrial', 'Sistema de Matrícula'], avatarColor: '#475569' },
  { id: '9', name: 'Victor Emmanuel', email: '', role: 'Analista de QA', products: ['Portal do Cidadão V2'], avatarColor: '#1265AF' },
  { id: '10', name: 'Gessika Rodrigues', email: 'gessika.rodriguez@sesi.org.br', role: 'Scrum Master', products: ['Dashboard BI Institucional'], avatarColor: '#0D4D87' },
  { id: '11', name: 'Anderson Reges', email: '', role: 'Desenvolvedor Backend', products: [], avatarColor: '#5BA9F0' },
  { id: '12', name: 'Bia Magalhães', email: 'bia.magalhaes@sesi.org.br', role: 'Product Marketing', products: ['Sistema de Matrícula'], avatarColor: '#1B76CA' },
];

const avatarColors = ['#1265AF', '#0D4D87', '#5BA9F0', '#1B76CA', '#8B5CF6', '#22C55E', '#F59E0B', '#475569'];

const ALL_PRODUCTS = [
  'Portal do Cidadão V2',
  'App Gestão Industrial',
  'API Integração SESI',
  'Dashboard BI Institucional',
  'Sistema de Matrícula',
];

/* ── Compact multi-select for products (checkbox dropdown with chips) ── */
const ProductMultiSelect = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const toggle = (product: string) => {
    if (value.includes(product)) onChange(value.filter(p => p !== product));
    else onChange([...value, product]);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(18, 101, 175, 0.14)',
          fontSize: '0.85rem', background: 'white', cursor: 'pointer', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', minHeight: '42px', flexWrap: 'wrap', gap: '4px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
          {value.length === 0 ? (
            <span style={{ color: 'var(--text-faint)' }}>Selecionar produto(s)...</span>
          ) : (
            value.map(p => (
              <span key={p} style={{
                background: 'rgba(18, 101, 175, 0.08)', color: 'var(--primary)', padding: '2px 8px',
                borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, display: 'inline-flex',
                alignItems: 'center', gap: '4px', border: '1px solid rgba(18, 101, 175, 0.12)',
              }}>
                {p}
                <span onClick={(e) => { e.stopPropagation(); toggle(p); }} style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--text-secondary)' }}>×</span>
              </span>
            ))
          )}
        </div>
        <ChevronDown size={14} style={{ color: 'var(--text-secondary)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
      </div>

      {isOpen && (
        <div className="custom-scrollbar" style={{
          position: 'absolute', top: '100%', left: 0, right: 0, background: 'white',
          border: '1px solid rgba(18, 101, 175, 0.12)', borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(18, 101, 175, 0.12)', zIndex: 999, marginTop: '4px',
          maxHeight: '220px', overflowY: 'auto', padding: '4px',
        }}>
          {ALL_PRODUCTS.map(p => {
            const selected = value.includes(p);
            return (
              <div
                key={p}
                onClick={() => toggle(p)}
                style={{
                  padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: '8px', fontSize: '0.85rem',
                  background: selected ? 'rgba(18, 101, 175, 0.04)' : 'transparent',
                  fontWeight: selected ? 700 : 500, color: selected ? 'var(--primary)' : 'var(--text-main)',
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${selected ? 'var(--primary)' : 'rgba(18,101,175,0.3)'}`,
                  background: selected ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {selected && <Check size={11} color="white" strokeWidth={3} />}
                </span>
                {p}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const Membros: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(defaultMembers));
    return defaultMembers;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formProducts, setFormProducts] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  const productOptions = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => m.products.forEach(p => set.add(p)));
    return Array.from(set);
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchProduct = selectedProduct === 'Todos' || m.products.includes(selectedProduct);
      return matchSearch && matchProduct;
    });
  }, [members, searchTerm, selectedProduct]);

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('');
    setFormProducts([]);
    setEditingMemberId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMemberId(member.id);
    setFormName(member.name);
    setFormEmail(member.email || '');
    setFormRole(member.role);
    setFormProducts(member.products);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim() || formProducts.length === 0) return;

    if (editingMemberId) {
      setMembers(members.map(m => m.id === editingMemberId ? {
        ...m,
        name: formName.trim(),
        email: formEmail.trim() || undefined,
        role: formRole.trim(),
        products: formProducts,
      } : m));
    } else {
      const newMember: Member = {
        id: `member-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim() || undefined,
        role: formRole.trim(),
        products: formProducts,
        avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      };
      setMembers([newMember, ...members]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover este membro da plataforma?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  return (
    <div style={{ paddingBottom: '5rem' }} className="fade-up">
      <header className="page-header-sticky" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Membros
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Cadastre pessoas que podem ser mencionadas e associadas a produtos na plataforma.
          </p>
        </div>
        <button className="btn-primary" onClick={handleOpenCreate}>
          <Plus size={15} /> Novo Membro
        </button>
      </header>

      <div className="filter-bar" style={{ marginBottom: '2rem' }}>
        <SearchAutocomplete
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por nome, e-mail ou função…"
          suggestions={members.map(m => m.name)}
          containerStyle={{ flex: 1, minWidth: 220 }}
          inputStyle={{ width: '100%' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, height: 'var(--btn-height)' }}>
          <Filter size={15} strokeWidth={1.5} /> Filtros
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Produto</label>
          <select className="filter-pill" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
            <option value="Todos">Todos os Produtos</option>
            {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', border: '1px dashed var(--border)' }}>
          <Users size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h4 style={{ fontWeight: 600, color: '#111' }}>Nenhum membro encontrado</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tente ajustar os filtros ou pesquisar por outro termo.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filteredMembers.map(member => (
            <div
              key={member.id}
              className="glass-card"
              style={{
                padding: '1.25rem', borderRadius: '20px', display: 'flex', flexDirection: 'column',
                gap: '0.75rem', position: 'relative', transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(18,101,175,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${member.avatarColor} 0%, ${member.avatarColor}CC 100%)`,
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.95rem', fontWeight: 800, flexShrink: 0, boxShadow: `0 6px 14px ${member.avatarColor}4D`,
                  }}>
                    {getInitials(member.name)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1d2939', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={member.name}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {member.role}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleOpenEdit(member)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    title="Editar membro"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    title="Remover membro"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {member.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <Mail size={13} strokeWidth={1.5} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', borderTop: '1px solid #f2f4f7', paddingTop: '0.65rem' }}>
                {member.products.length === 0 ? (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontStyle: 'italic' }}>Nenhum produto associado</span>
                ) : (
                  member.products.map(p => (
                    <span key={p} style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--primary)', background: 'rgba(18,101,175,0.06)', borderRadius: 999, padding: '0.15rem 0.55rem' }}>
                      {p}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => { setIsModalOpen(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, color: '#1d2939' }}>{editingMemberId ? 'Editar Membro' : 'Novo Membro'}</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Essa pessoa poderá ser mencionada e associada a produtos.</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Nome *</label>
                <input type="text" placeholder="Nome completo" value={formName} onChange={e => setFormName(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>E-mail</label>
                <input type="email" placeholder="exemplo@sesi.org.br (opcional)" value={formEmail} onChange={e => setFormEmail(e.target.value)} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Função *</label>
                <input type="text" placeholder="Ex: Designer UI/UX" value={formRole} onChange={e => setFormRole(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Produto Associado *</label>
                <ProductMultiSelect value={formProducts} onChange={setFormProducts} />
                {formProducts.length === 0 && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Selecione ao menos um produto.</span>
                )}
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }} disabled={!formName.trim() || !formRole.trim() || formProducts.length === 0}>
                {editingMemberId ? <><Check size={16} /> Salvar Alterações</> : <><Plus size={16} /> Salvar Membro</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membros;
