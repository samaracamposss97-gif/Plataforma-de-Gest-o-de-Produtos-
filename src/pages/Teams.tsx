import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  X,
  Shield,
  Filter,
  Check,
  ExternalLink,
  Users
} from 'lucide-react';
import SearchAutocomplete from '../components/SearchAutocomplete';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;          // Job title/Role (e.g. Designer UI/UX)
  accountType: string;   // Tipo de Conta (e.g. Proprietário, Administrador, Membro, Convidado)
  team: string;          // Equipe / Setor (e.g. Desenvolvimento, Design, Gestão)
  status: 'Online' | 'Offline';
  avatarColor: string;
  associatedProduct?: string; // Produto específico da plataforma
}

const defaultUsers: User[] = [
  { id: '1', name: 'Júlio César', email: 'julio.cesar@sesi.org.br', role: 'Gestor de Contas', accountType: 'Administrador', team: 'Gestão', status: 'Offline', avatarColor: '#1265AF' },
  { id: '2', name: 'Ana Júlia Rodrigues', email: 'ana.julia@sesi.org.br', role: 'Product Owner', accountType: 'Administrador', team: 'Desenvolvimento', status: 'Online', avatarColor: '#0D4D87' },
  { id: '3', name: 'Livio Leitão', email: 'livio.leitao@sesi.org.br', role: 'Designer UI/UX', accountType: 'Membro', team: 'Design', status: 'Offline', avatarColor: '#5BA9F0' },
  { id: '4', name: 'Samara Campos', email: 'samara.campos@sesi.org.br', role: 'Gestora Geral', accountType: 'Proprietário', team: 'Gestão', status: 'Offline', avatarColor: '#1B76CA' },
  { id: '5', name: 'Felipe Dantas', email: 'felipe.dantas@sesi.org.br', role: 'Analista de Sistemas', accountType: 'Membro', team: 'Desenvolvimento', status: 'Offline', avatarColor: '#8B5CF6' },
  { id: '6', name: 'João Vitor Dos Santos', email: 'joao.vitor@sesi.org.br', role: 'Desenvolvedor Backend', accountType: 'Membro', team: 'Desenvolvimento', status: 'Offline', avatarColor: '#22C55E' },
  { id: '7', name: 'Gabriel Novais Lima', email: 'gabriel.novais@sesi.org.br', role: 'Desenvolvedor Frontend', accountType: 'Membro', team: 'Desenvolvimento', status: 'Online', avatarColor: '#F59E0B' },
  { id: '8', name: 'Isabele Oliveira', email: 'isabele.oliveira@sesi.org.br', role: 'Designer UI/UX', accountType: 'Membro', team: 'Design', status: 'Offline', avatarColor: '#475569' },
  { id: '9', name: 'Victor Emmanuel', email: 'victor.emmanuel@sesi.org.br', role: 'Analista de QA', accountType: 'Membro', team: 'Desenvolvimento', status: 'Online', avatarColor: '#1265AF' },
  { id: '10', name: 'Gessika Rodrigues', email: 'gessika.rodriguez@sesi.org.br', role: 'Scrum Master', accountType: 'Membro', team: 'Desenvolvimento', status: 'Offline', avatarColor: '#0D4D87' },
  { id: '11', name: 'Anderson Reges', email: 'anderson.reges@sesi.org.br', role: 'Desenvolvedor Backend', accountType: 'Convidado', team: 'Desenvolvimento', status: 'Offline', avatarColor: '#5BA9F0' },
  { id: '12', name: 'Bia Magalhães', email: 'bia.magalhaes@sesi.org.br', role: 'Product Marketing', accountType: 'Convidado', team: 'Marketing', status: 'Offline', avatarColor: '#1B76CA' }
];

const avatarColors = ['#1265AF', '#0D4D87', '#5BA9F0', '#1B76CA', '#8B5CF6', '#22C55E', '#F59E0B', '#475569'];

const Teams: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cis_users');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('cis_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedTeam, setSelectedTeam] = useState('Todos');
  const [selectedAccountType, setSelectedAccountType] = useState('Todos');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  // Invite form states
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Designer UI/UX');
  const [inviteTeam, setInviteTeam] = useState('Design');
  const [inviteAccountType, setInviteAccountType] = useState('Membro');
  const [inviteProduct, setInviteProduct] = useState('Portal do Cidadão V2');

  // Create user form states
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createRole, setCreateRole] = useState('');
  const [createTeam, setCreateTeam] = useState('Desenvolvimento');
  const [createAccountType, setCreateAccountType] = useState('Membro');
  const [createStatus, setCreateStatus] = useState<'Online' | 'Offline'>('Offline');
  const [createProduct, setCreateProduct] = useState('Portal do Cidadão V2');

  const productsListOptions = [
    'Todos os Produtos / Geral',
    'Portal do Cidadão V2',
    'App Gestão Industrial',
    'API Integração SESI',
    'Dashboard BI Institucional',
    'Sistema de Matrícula'
  ];

  useEffect(() => {
    localStorage.setItem('cis_users', JSON.stringify(users));
  }, [users]);

  // Extract unique teams for filter select
  const teamsList = useMemo(() => {
    const set = new Set(users.map(u => u.team).filter(Boolean));
    return Array.from(set);
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = selectedStatus === 'Todos' || 
                          (selectedStatus === 'Online' && u.status === 'Online') || 
                          (selectedStatus === 'Offline' && u.status === 'Offline');

      const matchTeam = selectedTeam === 'Todos' || u.team === selectedTeam;

      const matchAccountType = selectedAccountType === 'Todos' || u.accountType === selectedAccountType;

      return matchSearch && matchStatus && matchTeam && matchAccountType;
    });
  }, [users, searchTerm, selectedStatus, selectedTeam, selectedAccountType]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    if (users.some(u => u.email.toLowerCase() === inviteEmail.trim().toLowerCase())) {
      alert('Este e-mail já está cadastrado.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      accountType: inviteAccountType,
      team: inviteTeam,
      status: 'Offline',
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      associatedProduct: inviteProduct
    };

    setUsers([...users, newUser]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    alert('Convite enviado e usuário cadastrado com sucesso!');
    setInviteRole('Designer UI/UX');
    setInviteTeam('Design');
    setInviteAccountType('Membro');
    setInviteProduct('Portal do Cidadão V2');
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Deseja realmente remover este usuário da plataforma?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim() || !createEmail.trim() || !createRole.trim()) return;

    if (users.some(u => u.email.toLowerCase() === createEmail.trim().toLowerCase())) {
      alert('Este e-mail já está cadastrado.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: createName.trim(),
      email: createEmail.trim(),
      role: createRole.trim(),
      accountType: createAccountType,
      team: createTeam,
      status: createStatus,
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      associatedProduct: createProduct
    };

    setUsers([...users, newUser]);
    setIsCreateUserModalOpen(false);
    setCreateName('');
    setCreateEmail('');
    setCreateRole('');
    setCreateTeam('Desenvolvimento');
    setCreateAccountType('Membro');
    setCreateStatus('Offline');
    setCreateProduct('Portal do Cidadão V2');
    alert('Usuário criado com sucesso!');
  };

  const handleUpdatePermission = (id: string, type: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, accountType: type } : u));
  };

  const handleUpdateTeam = (id: string, team: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, team } : u));
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <div style={{ paddingBottom: '5rem' }} className="fade-up">
        {/* Top Header Section */}
        <header className="page-header-sticky" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Equipes
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Gerencie os usuários, equipes e níveis de acesso da plataforma
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Criar Novo Usuário */}
            <button
              id="btn-criar-usuario"
              onClick={() => setIsCreateUserModalOpen(true)}
              className="btn-primary"
            >
              <Plus size={15} />
              Criar Usuário
            </button>

            {/* Convidar */}
            <button
              id="btn-convidar"
              onClick={() => setIsInviteModalOpen(true)}
              className="btn-danger"
            >
              <ExternalLink size={15} />
              Convidar
            </button>
          </div>
        </header>

        {/* Toolbar / Filters */}
        <div className="filter-bar" style={{ marginBottom: '2rem' }}>
          <SearchAutocomplete
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Pesquisar por nome, e-mail ou função…"
            suggestions={users.map(u => u.name)}
            containerStyle={{ flex: 1, minWidth: 220 }}
            inputStyle={{ width: '100%' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, height: 'var(--btn-height)' }}>
            <Filter size={15} strokeWidth={1.5} /> Filtros
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</label>
            <select
              className="filter-pill"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Equipe</label>
            <select
              className="filter-pill"
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
            >
              <option value="Todos">Todas</option>
              {teamsList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tipo de conta</label>
            <select
              className="filter-pill"
              value={selectedAccountType}
              onChange={e => setSelectedAccountType(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Proprietário">Proprietário</option>
              <option value="Administrador">Administrador</option>
              <option value="Membro">Membro</option>
              <option value="Convidado">Convidado</option>
            </select>
          </div>
        </div>

        {/* Grid of Users (ClickUp Style cards) */}
        {filteredUsers.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '5rem 2rem', 
            background: 'white', 
            borderRadius: '16px', 
            border: '1px dashed var(--border)' 
          }}>
            <Users size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h4 style={{ fontWeight: 600, color: '#111' }}>Nenhum colaborador encontrado</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tente ajustar os filtros ou pesquisar por outro termo.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', 
            gap: '1.25rem' 
          }}>
            {filteredUsers.map(user => {
              const initials = getInitials(user.name);
              return (
                <div
                  key={user.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(18,101,175,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                >
                  {/* Delete button absolute */}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    title="Remover usuário"
                  >
                    <Trash2 size={12} />
                  </button>

                  {/* Avatar */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${user.avatarColor} 0%, ${user.avatarColor}CC 100%)`,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    flexShrink: 0,
                    boxShadow: `0 6px 14px ${user.avatarColor}4D`
                  }}>
                    {initials}
                  </div>

                  {/* User Info */}
                  <div style={{ width: '100%' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.4rem', 
                      fontWeight: 700, 
                      fontSize: '0.9rem',
                      color: '#1d2939',
                      marginBottom: '0.2rem'
                    }}>
                      <span style={{ 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        maxWidth: '120px' 
                      }} title={user.name}>
                        {user.name}
                      </span>
                      <span 
                        style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: user.status === 'Online' ? '#22c55e' : 'transparent',
                          border: user.status === 'Online' ? 'none' : '1.5px solid #98a2b3',
                          display: 'inline-block',
                          flexShrink: 0
                        }} 
                        title={user.status}
                      />
                    </div>
                    
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.role}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--primary)', background: 'rgba(18,101,175,0.06)', borderRadius: 999, padding: '0.15rem 0.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                      {user.associatedProduct || 'Todos os Produtos'}
                    </div>
                  </div>

                  {/* Dropdowns for Permissions/Setor inline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%', borderTop: '1px solid #f2f4f7', paddingTop: '0.5rem' }}>
                    
                    {/* Account Type dropdown selection */}
                    <select
                      value={user.accountType}
                      onChange={e => handleUpdatePermission(user.id, e.target.value)}
                      style={{
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.7rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(18,101,175,0.1)',
                        background: 'rgba(18,101,175,0.05)',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Proprietário">Proprietário</option>
                      <option value="Administrador">Admin</option>
                      <option value="Membro">Membro</option>
                      <option value="Convidado">Convidado</option>
                    </select>

                    {/* Team/Setor dropdown selection */}
                    <select
                      value={user.team}
                      onChange={e => handleUpdateTeam(user.id, e.target.value)}
                      style={{
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.7rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(18,101,175,0.06)',
                        background: 'rgba(107,123,140,0.05)',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Gestão">Gestão</option>
                      <option value="Desenvolvimento">Desenvolvimento</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="QA">QA</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Convidar Modal (Popup Form) - Outside fade-up container */}
      {isInviteModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsInviteModalOpen(false)}>
          <div 
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '420px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>Convidar Pessoa</h3>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Nome Completo</label>
                <input
                  type="text"
                  placeholder="Nome do colaborador"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>E-mail</label>
                <input
                  type="email"
                  placeholder="exemplo@sesi.org.br"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Função/Cargo</label>
                <input
                  type="text"
                  placeholder="Ex: Designer UI/UX"
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Equipe/Setor</label>
                  <select
                    value={inviteTeam}
                    onChange={e => setInviteTeam(e.target.value)}
                    style={{ background: 'white' }}
                  >
                    <option value="Gestão">Gestão</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="QA">QA</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Permissão</label>
                  <select
                    value={inviteAccountType}
                    onChange={e => setInviteAccountType(e.target.value)}
                    style={{ background: 'white' }}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Membro">Membro</option>
                    <option value="Convidado">Convidado</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Produto Associado *</label>
                <select
                  value={inviteProduct}
                  onChange={e => setInviteProduct(e.target.value)}
                  style={{ background: 'white' }}
                >
                  {productsListOptions.map(prod => (
                    <option key={prod} value={prod}>{prod}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="btn-danger" 
                style={{ marginTop: '0.5rem', width: '100%' }}
              >
                Convidar Colaborador
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Criar Novo Usuário Modal - Outside fade-up container */}
      {isCreateUserModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateUserModalOpen(false)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '460px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, color: '#1d2939' }}>Criar Novo Usuário</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Cadastre um usuário diretamente na plataforma</p>
              </div>
              <button
                onClick={() => setIsCreateUserModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Nome do novo usuário"
                  value={createName}
                  onChange={e => setCreateName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>E-mail *</label>
                <input
                  type="email"
                  placeholder="usuario@sesi.org.br"
                  value={createEmail}
                  onChange={e => setCreateEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Função / Cargo *</label>
                <input
                  type="text"
                  placeholder="Ex: Desenvolvedor Frontend"
                  value={createRole}
                  onChange={e => setCreateRole(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Equipe / Setor</label>
                  <select
                    value={createTeam}
                    onChange={e => setCreateTeam(e.target.value)}
                    style={{ background: 'white' }}
                  >
                    <option value="Gestão">Gestão</option>
                    <option value="Desenvolvimento">Desenvolvimento</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="QA">QA</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Permissão</label>
                  <select
                    value={createAccountType}
                    onChange={e => setCreateAccountType(e.target.value)}
                    style={{ background: 'white' }}
                  >
                    <option value="Proprietário">Proprietário</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Membro">Membro</option>
                    <option value="Convidado">Convidado</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Produto Associado *</label>
                <select
                  value={createProduct}
                  onChange={e => setCreateProduct(e.target.value)}
                  style={{ background: 'white' }}
                >
                  {productsListOptions.map(prod => (
                    <option key={prod} value={prod}>{prod}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Status Inicial</label>
                <select
                  value={createStatus}
                  onChange={e => setCreateStatus(e.target.value as 'Online' | 'Offline')}
                  style={{ background: 'white' }}
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div style={{
                background: 'rgba(18, 101, 175, 0.04)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                borderLeft: '3px solid #1265af'
              }}>
                <strong style={{ color: '#1265af' }}>ℹ Criação direta:</strong> O usuário será adicionado imediatamente à plataforma sem precisar aceitar convite.
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: '0.5rem', width: '100%' }}
              >
                <Plus size={16} />
                Criar Usuário
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Teams;
