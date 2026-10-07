import React, { useState } from 'react';
import { FishingModality } from '../../types';
import { Waves, MapPin, ShieldCheck, Check, Sparkles, Navigation, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModality: (modality: FishingModality) => void;
  currentModality: FishingModality;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSelectModality,
  currentModality,
}) => {
  const [step, setStep] = useState(1);
  const [hasGrantedGps, setHasGrantedGps] = useState(false);
  const [selectedMod, setSelectedMod] = useState<FishingModality>(currentModality);

  if (!isOpen) return null;

  const modalities: { id: FishingModality; title: string; desc: string; icon: string }[] = [
    { id: 'Spinning / Casting', title: 'Spinning / Casting', desc: 'Lances de costa, manglares o superficie con señuelos artificiales.', icon: '🎣' },
    { id: 'Trolling', title: 'Trolling (Curricán)', desc: 'Troleo de altura para pelágicos (dorado, atún, wahoo).', icon: '🚤' },
    { id: 'Jigging', title: 'Jigging / Slow Pitch', desc: 'Vertical en piedras y cantos profundos para pargo y jurel.', icon: '⚓' },
    { id: 'Fondo (Bottom)', title: 'Fondo Tradicional', desc: 'Pesca fondeada con plomo y carnada para corvina y pargo.', icon: '🪨' },
  ];

  const requestGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setHasGrantedGps(true);
        },
        () => {
          setHasGrantedGps(true); // Fallback to simulated zone
        }
      );
    } else {
      setHasGrantedGps(true);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-sheet onboarding-sheet">
        <button className="close-modal-btn" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        {step === 1 && (
          <div className="onboarding-step-content">
            <div className="onboarding-hero-icon">
              <Waves size={36} className="text-cyan" />
            </div>
            <h2>Bienvenido a FISHIQ</h2>
            <p className="onboarding-tagline">SMART FISHING LATAM • PILOTO PANAMÁ</p>

            <div className="value-prop-card">
              <p>
                Predice las mejores ventanas de pesca con nuestro <strong>FISHIQ Score (0–100)</strong>, combinando mareas, satélite, batimetría y biología marina para las 8 especies reina del Pacífico.
              </p>
            </div>

            <div className="onboarding-disclaimer-notice">
              <ShieldCheck size={18} className="text-emerald" />
              <span>
                <strong>Principio del MVP:</strong> Predicción biológica de pique deportivo, <em>NO navegación marítima</em>.
              </span>
            </div>

            <button className="primary-cta-btn" onClick={() => setStep(2)}>
              Siguiente: Configurar Ubicación
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step-content">
            <div className="onboarding-hero-icon">
              <MapPin size={36} className="text-cyan" />
            </div>
            <h2>Permisos de Ubicación GPS</h2>
            <p className="onboarding-subtext">
              Para calcular automáticamente las mareas, temperaturas y corrientes exactas de tu costa o embarcación.
            </p>

            <div className="gps-permission-box">
              <div className="gps-box-status">
                {hasGrantedGps ? (
                  <span className="gps-status-granted">
                    <Check size={18} /> Coordenadas Activas (Pacífico de Panamá)
                  </span>
                ) : (
                  <span className="gps-status-pending">Permiso pendiente</span>
                )}
              </div>
              <button
                className={`request-gps-btn ${hasGrantedGps ? 'granted' : ''}`}
                onClick={requestGps}
              >
                <Navigation size={16} /> {hasGrantedGps ? 'Ubicación Conectada' : 'Habilitar GPS en este Dispositivo'}
              </button>
            </div>

            <div className="privacy-reassurance">
              <span>🔒 <strong>Privacidad Garantizada:</strong> Tus spots y coordenadas nunca se hacen públicas sin tu autorización expresa.</span>
            </div>

            <button className="primary-cta-btn" onClick={() => setStep(3)}>
              Siguiente: Tu Modalidad de Pesca
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step-content">
            <div className="onboarding-hero-icon">
              <Sparkles size={36} className="text-cyan" />
            </div>
            <h2>Tu Modalidad Preferida</h2>
            <p className="onboarding-subtext">
              Personalizaremos el scoring y los señuelos recomendados para tu estilo.
            </p>

            <div className="modality-options-list">
              {modalities.map((m) => {
                const isSelected = selectedMod === m.id;
                return (
                  <div
                    key={m.id}
                    className={`modality-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedMod(m.id)}
                  >
                    <span className="mod-icon">{m.icon}</span>
                    <div className="mod-texts">
                      <div className="mod-title">{m.title}</div>
                      <div className="mod-desc">{m.desc}</div>
                    </div>
                    {isSelected && <Check size={18} className="mod-check" />}
                  </div>
                );
              })}
            </div>

            <button
              className="primary-cta-btn"
              onClick={() => {
                onSelectModality(selectedMod);
                onClose();
              }}
            >
              Comenzar a Pescar con FISHIQ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
