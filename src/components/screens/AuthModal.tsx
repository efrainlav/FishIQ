import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (email ? email.split('@')[0] : 'Capitán');
    onSuccess(finalName);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-sheet auth-sheet">
        <button className="close-modal-btn" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        <div className="auth-sheet-header">
          <div className="auth-brand-logo">
            <span className="auth-brand-title">FISH<span className="text-cyan">IQ</span></span>
          </div>
          <h2>{mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Accede a tus pronósticos y spots favoritos en Panamá.'
              : 'Regístrate para guardar tus capturas y personalizar el score.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group-clean">
              <label><User size={15} /> Nombre completo o Apodo</label>
              <input
                type="text"
                placeholder="Ej. Capitán Richard"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="clean-input-field"
              />
            </div>
          )}

          <div className="form-group-clean">
            <label><Mail size={15} /> Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="clean-input-field"
            />
          </div>

          <div className="form-group-clean">
            <label><Lock size={15} /> Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="clean-input-field"
            />
          </div>

          <button type="submit" className="primary-cta-btn auth-submit-btn">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratis'}
          </button>
        </form>

        <div className="auth-switch-row">
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button type="button" className="switch-auth-link" onClick={() => setMode('register')}>
                Registrarme
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button type="button" className="switch-auth-link" onClick={() => setMode('login')}>
                Iniciar sesión
              </button>
            </p>
          )}
        </div>

        <div className="auth-privacy-badge">
          <ShieldCheck size={14} className="text-emerald" />
          <span>Datos cifrados y privados para pescadores deportivos</span>
        </div>
      </div>
    </div>
  );
};
