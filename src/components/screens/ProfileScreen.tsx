import React, { useState } from 'react';
import { UserProfile, FishingModality } from '../../types';
import { User, Shield, Lock, Bell, Sliders, CheckCircle, Award } from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  units: 'Metric' | 'Imperial';
  onToggleUnits: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  units,
  onToggleUnits,
}) => {
  const [name, setName] = useState(user.name);
  const [modality, setModality] = useState<FishingModality>(user.preferredModality);
  const [experience, setExperience] = useState(user.experience);
  const [privateDefault, setPrivateDefault] = useState(user.privateSpotsDefault);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name,
      preferredModality: modality,
      experience,
      privateSpotsDefault: privateDefault,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="screen-content profile-screen">
      {/* Profile Header */}
      <div className="profile-hero-card">
        <div className="profile-avatar-circle">
          <User size={36} />
        </div>
        <div className="profile-hero-texts">
          <h2>{name}</h2>
          <span className="profile-plan-badge">
            <Award size={14} /> {user.activePlan}
          </span>
          <p className="profile-status-desc">Capitán registrado para el piloto de Panamá</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="save-success-banner">
          <CheckCircle size={16} /> Perfil y preferencias actualizados correctamente.
        </div>
      )}

      {/* Preferences Form */}
      <div className="profile-form-section">
        <div className="form-group">
          <label className="form-label">Nombre de Usuario / Capitán</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nivel de Experiencia</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value as any)}
            className="form-input"
          >
            <option value="Novato">Novato (Iniciándose en la pesca)</option>
            <option value="Aficionado">Aficionado (Salidas regulares de fin de semana)</option>
            <option value="Capitán / Guía">Capitán / Guía de Pesca Profesional</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Modalidad Predilecta</label>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value as FishingModality)}
            className="form-input"
          >
            <option value="Spinning / Casting">Spinning / Casting</option>
            <option value="Trolling">Trolling (Curricán de altura)</option>
            <option value="Jigging">Jigging / Slow Pitch</option>
            <option value="Fondo (Bottom)">Fondo (Bottom)</option>
            <option value="Mosca (Fly)">Mosca (Fly)</option>
          </select>
        </div>

        {/* Units Configuration */}
        <div className="profile-setting-row">
          <div className="setting-label-col">
            <span className="setting-title">Sistema de Unidades</span>
            <span className="setting-desc">Métrico (°C, km/h, metros) vs Imperial (°F, nudos, pies)</span>
          </div>
          <button className="unit-switch-pill" onClick={onToggleUnits}>
            {units === 'Metric' ? 'Métrico (°C/m)' : 'Imperial (°F/kts)'}
          </button>
        </div>

        {/* Privacy Configuration */}
        <div className="profile-setting-row">
          <div className="setting-label-col">
            <span className="setting-title"><Lock size={15} /> Spots Privados por Defecto</span>
            <span className="setting-desc">Oculta tus coordenadas GPS ante cualquier comunidad o ranking futuro.</span>
          </div>
          <label className="switch-toggle">
            <input
              type="checkbox"
              checked={privateDefault}
              onChange={(e) => setPrivateDefault(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <button className="primary-cta-btn" onClick={handleSave}>
          Guardar Preferencias
        </button>
      </div>

      {/* Subscription & Legal Notice */}
      <div className="profile-footer-card">
        <div className="footer-plan-title">
          <Shield size={16} /> FISHIQ MVP v1.0 — Licencia Piloto Panamá
        </div>
        <p className="footer-plan-text">
          Acceso ilimitado al motor determinístico, las 8 especies marinas del Pacífico de Panamá y las consultas del asistente contextual FISHIQ AI.
        </p>
      </div>
    </div>
  );
};
