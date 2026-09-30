import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Sliders, 
  Check, 
  Lock, 
  Eye, 
  EyeOff, 
  Users, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  Save, 
  RotateCcw
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'senha' | 'perfis' | 'padroes'>('senha');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Default settings states
  const [language, setLanguage] = useState('pt-BR');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsWeeklyReport, setNotificationsWeeklyReport] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState('BRL');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Permissions Matrix data
  const [permissions, setPermissions] = useState([
    { module: 'Portfólio de Produtos', admin: true, manager: true, member: true, guest: false },
    { module: 'Criar / Editar Produtos', admin: true, manager: true, member: false, guest: false },
    { module: 'Evolução e Governança', admin: true, manager: true, member: true, guest: false },
    { module: 'Biblioteca Institucional', admin: true, manager: true, member: true, guest: true },
    { module: 'Apoio à Escrita (Modelos)', admin: true, manager: true, member: true, guest: true },
    { module: 'Gestão de Equipes', admin: true, manager: false, member: false, guest: false },
    { module: 'Configurações do Sistema', admin: true, manager: false, member: false, guest: false },
  ]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      alert('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleSaveDefaults = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const togglePermission = (index: number, role: 'admin' | 'manager' | 'member' | 'guest') => {
    const updated = [...permissions];
    updated[index][role] = !updated[index][role];
    setPermissions(updated);
  };

  return (
    <div style={{ paddingBottom: '5rem' }} className="fade-up">
      {/* Header */}
      <header className="page-header-sticky">
        <h1 style={{ fontSize: '2.25rem', margin: 0, fontWeight: 500, color: '#333333', letterSpacing: '-0.03em' }}>
          Configurações da Plataforma
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>
          Gerencie segurança, perfis de acesso e parâmetros globais do sistema CIS.
        </p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { id: 'senha', label: 'Mudança de Senha', icon: Key },
          { id: 'perfis', label: 'Perfis e Permissões', icon: ShieldCheck },
          { id: 'padroes', label: 'Configurações Padrão', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={isActive ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.85rem' }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MUDANÇA DE SENHA */}
      {activeTab === 'senha' && (
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(18,101,175,0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Alterar Senha de Acesso</h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mantenha sua conta segura atualizando sua senha periodicamente.</p>
            </div>
          </div>

          {passwordSuccess && (
            <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Check size={18} /> Senha alterada com sucesso!
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Senha Atual *</label>
              <div style={{ position: 'relative' }}>
                <input
                  required
                  type={showPasswords ? 'text' : 'password'}
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 2.75rem 0.75rem 1rem', borderRadius: 12, border: '1px solid rgba(18,101,175,0.14)', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Nova Senha *</label>
              <input
                required
                type={showPasswords ? 'text' : 'password'}
                placeholder="No mínimo 6 caracteres"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid rgba(18,101,175,0.14)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Confirmar Nova Senha *</label>
              <input
                required
                type={showPasswords ? 'text' : 'password'}
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid rgba(18,101,175,0.14)', outline: 'none' }}
              />
            </div>

            <div style={{ paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                <Save size={16} /> Atualizar Senha
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: PERFIS E PERMISSÕES */}
      {activeTab === 'perfis' && (
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>Matriz de Perfis e Permissões</h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Configure as ações autorizadas para cada nível de acesso no protótipo.</p>
            </div>
            <button onClick={() => alert('Permissões redefinidas para o padrão do CIS.')} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
              <RotateCcw size={14} /> Restaurar Padrões
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="enterprise-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Módulo / Funcionalidade</th>
                  <th style={{ textAlign: 'center', padding: '1rem' }}>Administrador</th>
                  <th style={{ textAlign: 'center', padding: '1rem' }}>Gestor</th>
                  <th style={{ textAlign: 'center', padding: '1rem' }}>Membro</th>
                  <th style={{ textAlign: 'center', padding: '1rem' }}>Convidado</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((item, idx) => (
                  <tr key={item.module} style={{ borderBottom: '1px solid rgba(18,101,175,0.06)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {item.module}
                    </td>
                    {(['admin', 'manager', 'member', 'guest'] as const).map(role => (
                      <td key={role} style={{ textAlign: 'center', padding: '1rem' }}>
                        <input
                          type="checkbox"
                          checked={item[role]}
                          onChange={() => togglePermission(idx, role)}
                          className="checkbox-rounded"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONFIGURAÇÕES PADRÃO */}
      {activeTab === 'padroes' && (
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(18,101,175,0.08)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Parâmetros Globais do Sistema</h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ajuste idioma, tema visual e relatórios de notificação.</p>
            </div>
          </div>

          {savedSuccess && (
            <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Check size={18} /> Configurações salvas com sucesso!
            </div>
          )}

          <form onSubmit={handleSaveDefaults} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Globe size={14} /> Idioma Padrão
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  style={{ padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid rgba(18,101,175,0.14)', background: 'white' }}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sun size={14} /> Tema da Interface
                </label>
                <select
                  value={theme}
                  onChange={e => setTheme(e.target.value as any)}
                  style={{ padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid rgba(18,101,175,0.14)', background: 'white' }}
                >
                  <option value="light">Modo Claro (Padrão SESI)</option>
                  <option value="dark">Modo Escuro (Dark Mode)</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(18,101,175,0.08)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Notificações e Alertas
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notificationsEmail}
                  onChange={e => setNotificationsEmail(e.target.checked)}
                  className="checkbox-rounded"
                />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>Receber alertas de prazos e etapas por e-mail</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notificationsWeeklyReport}
                  onChange={e => setNotificationsWeeklyReport(e.target.checked)}
                  className="checkbox-rounded"
                />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>Receber resumo executivo semanal do portfólio</span>
              </label>
            </div>

            <div style={{ paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                <Save size={16} /> Salvar Configurações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
