import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  Trash2,
  Pencil,
  Check,
  X,
  Filter,
  UserCog
} from 'lucide-react';
import SearchAutocomplete from '../components/SearchAutocomplete';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  permission: 'Administrador' | 'Gestor' | 'Membro' | 'Convidado';
  status: 'Ativo' | 'Pendente' | 'Inativo';
  avatarColor: string;
}

const STORAGE_KEY = 'cis_system_users';

const defaultSystemUsers: SystemUser[] = [
  { id: '1', name: 'Júlio César', email: 'julio.cesar@sesi.org.br', permission: 'Administrador', status: 'Ativo', avatarColor: '#1265AF' },
  { id: '2', name: 'Ana Júlia Rodrigues', email: 'ana.julia@sesi.org.br', permission: 'Administrador', status: 'Ativo', avatarColor: '#0D4D87' },
  { id: '3', name: 'Livio Leitão', email: 'livio.leitao@sesi.org.br', permission: 'Membro', status: 'Ativo', avatarColor: '#5BA9F0' },
  { id: '4', name: 'Samara Campos', email: 'samara.campos@sesi.org.br', permission: 'Administrador', status: 'Ativo', avatarColor: '#1B76CA' },
  { id: '5', name: 'Felipe Dantas', email: 'felipe.dantas@sesi.org.br', permission: 'Membro', status: 'Ativo', avatarColor: '#8B5CF6' },
  { id: '6', name: 'João Vitor Dos Santos', email: 'joao.vitor@sesi.org.br', permission: 'Membro', status: 'Ativo', avatarColor: '#22C55E' },
  { id: '7', name: 'Gabriel Novais Lima', email: 'gabriel.novais@sesi.org.br', permission: 'Membro', status: 'Ativo', avatarColor: '#F59E0B' },
  { id: '8', name: 'Isabele Oliveira', email: 'isabele.oliveira@sesi.org.br', permission: 'Membro', status: 'Ativo', avatarColor: '#475569' },
  { id: '9', name: 'Victor Emmanuel', email: 'victor.emmanuel@sesi.org.br', permission: 'Gestor', status: 'Ativo', avatarColor: '#1265AF' },
  { id: '10', name: 'Gessika Rodrigues', email: 'gessika.rodriguez@sesi.org.br', permission: 'Gestor', status: 'Ativo', avatarColor: '#0D4D87' },
  { id: '11', name: 'Anderson Reges', email: 'anderson.reges@sesi.org.br', permission: 'Convidado', status: 'Pendente', avatarColor: '#5BA9F0' },
  { id: '12', name: 'Bia Magalhães', email: 'bia.magalhaes@sesi.org.br', permission: 'Convidado', status: 'Pendente', avatarColor: '#1B76CA' },
];

const avatarColors = ['#1265AF', '#0D4D87', '#5BA9F0', '#1B76CA', '#8B5CF6', '#22C55E', '#F59E0B', '#475569'];

const STATUS_STYLE: Record<SystemUser['status'], { color: string; bg: string }> = {
  Ativo: { color: 'var(--success)', bg: 'var(--success-bg)' },
  Pendente: { color: 'var(--warning)', bg: 'var(--warning-bg)' },
  Inativo: { color: 'var(--text-muted)', bg: 'rgba(100,116,139,0.08)' },
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSystemUsers));
    return defaultSystemUsers;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState<SystemUser['permission']>('Membro');
  const [editStatus, setEditStatus] = useState<SystemUser['status']>('Ativo');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPermission = selectedPermission === 'Todos' || u.permission === selectedPermission;
      const matchStatus = selectedStatus === 'Todos' || u.status === selectedStatus;
      return matchSearch && matchPermission && matchStatus;
    });
  }, [users, searchTerm, selectedPermission, selectedStatus]);

  const resetInviteForm = () => {
    setInviteName('');
    setInviteEmail('');
    setInvitePermission('Membro');
    setEditStatus('Ativo');
    setEditingUserId(null);
  };

  const handleOpenInvite = () => {
    resetInviteForm();
    setIsInviteOpen(true);
  };

  const handleOpenEdit = (user: SystemUser) => {
    setEditingUserId(user.id);
    setInviteName(user.name);
    setInviteEmail(user.email);
    setInvitePermission(user.permission);
    setEditStatus(user.status);
    setIsInviteOpen(true);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const duplicate = users.some(u => u.email.toLowerCase() === inviteEmail.trim().toLowerCase() && u.id !== editingUserId);
    if (duplicate) {
      alert('Este e-mail já está cadastrado.');
      return;
    }

    if (editingUserId) {
      setUsers(users.map(u => u.id === editingUserId ? {
        ...u,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        permission: invitePermission,
        status: editStatus,
      } : u));
      setIsInviteOpen(false);
      resetInviteForm();
    } else {
      const newUser: SystemUser = {
        id: `user-${Date.now()}`,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        permission: invitePermission,
        status: 'Pendente',
        avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      };

      setUsers([newUser, ...users]);
      setIsInviteOpen(false);
      resetInviteForm();
      alert('Convite enviado! O usuário aparecerá como "Pendente" até aceitar.');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover o acesso deste usuário à plataforma?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleUpdatePermission = (id: string, permission: SystemUser['permission']) => {
    setUsers(users.map(u => u.id === id ? { ...u, permission } : u));
  };

  const handleUpdateStatus = (id: string, status: SystemUser['status']) => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
  };

  return (
    <div style={{ paddingBottom: '5rem' }} className="fade-up">
      <header className="page-header-sticky" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Usuários
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Visualize quem tem login na plataforma e convide novos usuários.
          </p>
        </div>
        <button className="btn-primary" onClick={handleOpenInvite}>
          <UserPlus size={15} /> Convidar Usuário
        </button>
      </header>

      <div className="filter-bar" style={{ marginBottom: '2rem' }}>
        <SearchAutocomplete
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por nome ou e-mail…"
          suggestions={users.map(u => u.name)}
          containerStyle={{ flex: 1, minWidth: 220 }}
          inputStyle={{ width: '100%' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, height: 'var(--btn-height)' }}>
          <Filter size={15} strokeWidth={1.5} /> Filtros
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Permissão</label>
          <select className="filter-pill" value={selectedPermission} onChange={e => setSelectedPermission(e.target.value)}>
            <option value="Todos">Todas</option>
            <option value="Administrador">Administrador</option>
            <option value="Gestor">Gestor</option>
            <option value="Membro">Membro</option>
            <option value="Convidado">Convidado</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</label>
          <select className="filter-pill" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Pendente">Pendente</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '16px', border: '1px dashed var(--border)' }}>
          <UserCog size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h4 style={{ fontWeight: 600, color: '#111' }}>Nenhum usuário encontrado</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tente ajustar os filtros ou pesquisar por outro termo.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>E-mail</th>
                  <th>Permissão</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const ss = STATUS_STYLE[user.status];
                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${user.avatarColor} 0%, ${user.avatarColor}CC 100%)`,
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
                          }}>
                            {getInitials(user.name)}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td>
                        <select
                          value={user.permission}
                          onChange={e => handleUpdatePermission(user.id, e.target.value as SystemUser['permission'])}
                          style={{
                            padding: '0.35rem 0.6rem', fontSize: '0.78rem', borderRadius: '8px',
                            border: '1px solid rgba(18,101,175,0.14)', background: 'rgba(18,101,175,0.05)',
                            fontWeight: 600, color: 'var(--primary)', cursor: 'pointer',
                          }}
                        >
                          <option value="Administrador">Administrador</option>
                          <option value="Gestor">Gestor</option>
                          <option value="Membro">Membro</option>
                          <option value="Convidado">Convidado</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={user.status}
                          onChange={e => handleUpdateStatus(user.id, e.target.value as SystemUser['status'])}
                          style={{
                            padding: '0.3rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, borderRadius: 999,
                            border: 'none', color: ss.color, background: ss.bg, cursor: 'pointer',
                          }}
                        >
                          <option value="Ativo">Ativo</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Inativo">Inativo</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="btn-icon"
                          title="Editar usuário"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn-icon btn-icon-danger"
                          title="Remover acesso"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0.85rem 1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {isInviteOpen && (
        <div className="modal-backdrop" onClick={() => { setIsInviteOpen(false); resetInviteForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, color: '#1d2939' }}>{editingUserId ? 'Editar Usuário' : 'Convidar Usuário'}</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {editingUserId ? 'Atualize os dados de acesso deste usuário.' : 'A pessoa receberá acesso de login à plataforma.'}
                </p>
              </div>
              <button onClick={() => { setIsInviteOpen(false); resetInviteForm(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Nome *</label>
                <input type="text" placeholder="Nome completo" value={inviteName} onChange={e => setInviteName(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>E-mail *</label>
                <input type="email" placeholder="exemplo@sesi.org.br" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
              </div>

              <div style={{ display: editingUserId ? 'grid' : 'block', gridTemplateColumns: editingUserId ? '1fr 1fr' : undefined, gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Permissão</label>
                  <select value={invitePermission} onChange={e => setInvitePermission(e.target.value as SystemUser['permission'])} style={{ background: 'white' }}>
                    <option value="Administrador">Administrador</option>
                    <option value="Gestor">Gestor</option>
                    <option value="Membro">Membro</option>
                    <option value="Convidado">Convidado</option>
                  </select>
                </div>

                {editingUserId && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Status</label>
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value as SystemUser['status'])} style={{ background: 'white' }}>
                      <option value="Ativo">Ativo</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                )}
              </div>

              {!editingUserId && (
                <div style={{
                  background: 'rgba(18, 101, 175, 0.04)', borderRadius: '8px', padding: '0.75rem',
                  fontSize: '0.75rem', color: 'var(--text-secondary)', borderLeft: '3px solid #1265af',
                }}>
                  <strong style={{ color: '#1265af' }}>ℹ Convite:</strong> o usuário entra como "Pendente" até aceitar o acesso.
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                {editingUserId ? <><Check size={16} /> Salvar Alterações</> : <><UserPlus size={16} /> Enviar Convite</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
