import React from 'react';
import { Zone } from '../types';
import { Compass, ShieldCheck, Waves } from 'lucide-react';

interface HeaderProps {
  currentZone: Zone;
  onSelectZone: (zone: Zone) => void;
  allZones: Zone[];
  units: 'Metric' | 'Imperial';
  onToggleUnits: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentZone,
  onSelectZone,
  allZones,
  units,
  onToggleUnits,
  onOpenOnboarding,
}) => {
  return (
    <header className="fishiq-header">
      <div className="header-top-row">
        <div className="brand-badge" onClick={onOpenOnboarding} role="button" tabIndex={0} title="Ver información de FISHIQ">
          <div className="logo-icon-wrapper">
            <Waves className="logo-icon" size={20} />
          </div>
          <div className="brand-texts">
            <div className="brand-name">FISHIQ <span className="beta-chip">PILOTO</span></div>
            <div className="brand-subtitle">Smart Fishing Latam</div>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="unit-toggle-btn"
            onClick={onToggleUnits}
            title="Cambiar unidades"
          >
            {units === 'Metric' ? '°C / m' : '°F / kts'}
          </button>

          <div className="live-status-pill" title="Datos ambientales sincronizados y cacheados">
            <span className="live-dot"></span>
            <span className="live-text">EN VIVO</span>
          </div>
        </div>
      </div>

      <div className="zone-selector-bar">
        <Compass size={16} className="zone-compass-icon" />
        <select
          className="zone-select"
          value={currentZone.id}
          onChange={(e) => {
            const z = allZones.find((item) => item.id === e.target.value);
            if (z) onSelectZone(z);
          }}
        >
          {allZones.map((z) => (
            <option key={z.id} value={z.id}>
              📍 {z.name} ({z.region})
            </option>
          ))}
        </select>
        <span className="safe-disclaimer-mini" title="Predicción deportiva, no navegación marítima">
          <ShieldCheck size={14} /> Pesca Deportiva
        </span>
      </div>
    </header>
  );
};
