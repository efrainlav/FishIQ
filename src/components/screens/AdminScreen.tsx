import React, { useState } from 'react';
import { Species, Zone, HourlyScore } from '../../types';
import { Sliders, Shield, Save, RotateCcw, Activity, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminScreenProps {
  allSpecies: Species[];
  onUpdateSpeciesWeights: (speciesId: string, newWeights: Species['weights']) => void;
  allZones: Zone[];
  activeScore: HourlyScore;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  allSpecies,
  onUpdateSpeciesWeights,
  allZones,
  activeScore,
}) => {
  const [selectedSpId, setSelectedSpId] = useState(allSpecies[0]?.id || 'atun');
  const targetSpecies = allSpecies.find((s) => s.id === selectedSpId) || allSpecies[0];

  const [localWeights, setLocalWeights] = useState<Species['weights']>({ ...targetSpecies.weights });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSpeciesChange = (id: string) => {
    setSelectedSpId(id);
    const sp = allSpecies.find((s) => s.id === id);
    if (sp) {
      setLocalWeights({ ...sp.weights });
      setSaveStatus(null);
    }
  };

  const handleWeightChange = (key: keyof Species['weights'], val: number) => {
    setLocalWeights((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, val)),
    }));
    setSaveStatus(null);
  };

  const totalSum = Object.values(localWeights).reduce((a, b) => a + b, 0);

  const handleSave = () => {
    onUpdateSpeciesWeights(selectedSpId, localWeights);
    setSaveStatus('¡Pesos actualizados con éxito! El motor ha recalculado el score inmediatamente.');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleReset = () => {
    setLocalWeights({ ...targetSpecies.weights });
    setSaveStatus(null);
  };

  return (
    <div className="screen-content admin-screen">
      <div className="admin-header-card">
        <div className="admin-title-row">
          <div className="admin-badge"><Shield size={18} /> PANEL ADMINISTRATIVO</div>
          <span className="version-tag">Versión Algoritmo: {activeScore.algorithmVersion}</span>
        </div>
        <h2>Calibración del FISHIQ Score v0.1</h2>
        <p className="admin-subtitle">
          Edición en caliente de las 9 ponderaciones biológicas sin desplegar código nuevo.
        </p>
      </div>

      {/* Target Species Selector */}
      <div className="admin-species-selector-box">
        <label className="admin-label">Especie a Calibrar:</label>
        <select
          value={selectedSpId}
          onChange={(e) => handleSpeciesChange(e.target.value)}
          className="admin-select"
        >
          {allSpecies.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.avatarEmoji} {sp.commonName} ({sp.scientificName})
            </option>
          ))}
        </select>
      </div>

      {/* Weight Sum Validation Alert */}
      <div className={`weight-sum-banner ${totalSum === 100 ? 'valid' : 'warning'}`}>
        <div>
          <strong>Suma de Pesos: {totalSum}%</strong>
          <span className="sum-hint">
            {totalSum === 100
              ? ' (Óptimo: normalizado al 100%)'
              : ' (Aviso: la suma ideal es 100% para evitar desviaciones en el score)'}
          </span>
        </div>
        {totalSum !== 100 && <AlertCircle size={18} />}
      </div>

      {saveStatus && (
        <div className="save-success-banner">
          <CheckCircle2 size={16} /> {saveStatus}
        </div>
      )}

      {/* 9 Weight Sliders Grid */}
      <div className="weights-sliders-list">
        <div className="slider-item-card">
          <div className="slider-header">
            <span>Marea / Movimiento de Agua</span>
            <span className="slider-value-badge">{localWeights.tide}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={localWeights.tide}
            onChange={(e) => handleWeightChange('tide', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-desc">Estado, tendencia y cercanía a pleamar/bajamar.</div>
        </div>

        <div className="slider-item-card">
          <div className="slider-header">
            <span>Hora / Posición Solar</span>
            <span className="slider-value-badge">{localWeights.solar}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={localWeights.solar}
            onChange={(e) => handleWeightChange('solar', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-desc">Amanecer, atardecer y ventana preferida de la especie.</div>
        </div>

        <div className="slider-item-card">
          <div className="slider-header">
            <span>Corriente Marina</span>
            <span className="slider-value-badge">{localWeights.current}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={localWeights.current}
            onChange={(e) => handleWeightChange('current', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-desc">Velocidad en nudos vs rango biológico favorable.</div>
        </div>

        <div className="slider-item-card">
          <div className="slider-header">
            <span>Temperatura Superficial del Agua (SST)</span>
            <span className="slider-value-badge">{localWeights.sst}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={localWeights.sst}
            onChange={(e) => handleWeightChange('sst', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-desc">SST (°C) vs rango óptimo de la especie.</div>
        </div>

        <div className="slider-item-card">
          <div className="slider-header">
            <span>Viento y Dirección</span>
            <span className="slider-value-badge">{localWeights.wind}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={localWeights.wind}
            onChange={(e) => handleWeightChange('wind', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-desc">Velocidad del viento y efecto biológico/operativo.</div>
        </div>

        <div className="slider-item-card">
          <div className="slider-header">
            <span>Presión Barométrica y Tendencia</span>
            <span className="slider-value-badge">{localWeights.pressure}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={localWeights.pressure}
            onChange={(e) => handleWeightChange('pressure', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-desc">Presión barométrica (hPa) y variación en 3 horas.</div>
        </div>

        <div className="slider-item-card">
          <div className="slider-header">
            <span>Oleaje y Swell</span>
            <span className="slider-value-badge">{localWeights.wave}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            value={localWeights.wave}
            onChange={(e) => handleWeightChange('wave', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-desc">Condición de mar; penalización de extremos.</div>
        </div>

        <div className="slider-item-card">
          <div className="slider-header">
            <span>Fase Lunar e Iluminación</span>
            <span className="slider-value-badge">{localWeights.moon}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={localWeights.moon}
            onChange={(e) => handleWeightChange('moon', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-desc">Fase e iluminación como factor secundario.</div>
        </div>

        <div className="slider-item-card">
          <div className="slider-header">
            <span>Temporada Regional (Panamá)</span>
            <span className="slider-value-badge">{localWeights.season}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={localWeights.season}
            onChange={(e) => handleWeightChange('season', parseInt(e.target.value))}
            className="weight-slider"
          />
          <div className="slider-desc">Mes calendario vs estacionalidad regional histórica.</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="admin-actions-bar">
        <button className="reset-weights-btn" onClick={handleReset}>
          <RotateCcw size={16} /> Restaurar Originales
        </button>
        <button className="save-weights-btn" onClick={handleSave}>
          <Save size={16} /> Guardar Calibración
        </button>
      </div>

      {/* Pilot Zones Summary */}
      <div className="admin-zones-card">
        <h3>Zonas Piloto Activas ({allZones.length})</h3>
        <div className="zones-list-tags">
          {allZones.map((z) => (
            <span key={z.id} className="zone-admin-pill">
              📍 {z.name} ({z.depthAvgM}m promedio)
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
