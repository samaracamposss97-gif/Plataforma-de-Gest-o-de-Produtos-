import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for any credentials
    onLogin();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <img
            src="/logo_sesi.png"
            alt="Centro de Inovação SESI"
            style={{ width: '100%', maxWidth: '160px', height: 'auto', objectFit: 'contain' }}
          />
          <h2 style={{ marginTop: '1rem', color: '#111111', fontSize: '1.5rem', fontWeight: 700 }}>
            Plataforma de Gestão
          </h2>
          <p style={{ color: '#627d98', fontSize: '0.875rem' }}>
            Faça login para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d9e2ec',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = '#d9e2ec'}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d9e2ec',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = '#d9e2ec'}
            />
          </div>
          <button
            type="submit"
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
              boxShadow: '0 4px 6px rgba(18, 101, 175, 0.2)'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <LogIn size={20} />
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
