import React, { useState } from 'react';
import { Species, Zone, HourlyScore } from '../../types';
import {
  Clock,
  Waves,
  Wind,
  Moon,
  Thermometer,
  Gauge,
  ChevronDown,
  Info,
  ChevronRight,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';

interface ForecastScreenProps {
  currentZone: Zone;
  selectedSpecies: Species;
  allSpecies: Species[];
  onSelectSpecies: (species: Species) => void;
  hourlyScores: HourlyScore[];
}

export const ForecastScreen: React.FC<ForecastScreenProps> = ({
  currentZone,
  selectedSpecies,
  allSpecies,
  onSelectSpecies,
  hourlyScores,
}) => {
  const [timeTab, setTimeTab] = useState<'hoy' | 'manana' | '7dias'>('hoy');
  const [showSubscores, setShowSubscores] = useState(false);

  const activeForecast = hourlyScores[0] || {
    score: 87,
    tier: 'Excelente actividad',
    timeLabel: '06:10',
    conditions: {
      windSpeedKnots: 5,
      windDirectionLabel: 'SE',
      waveHeightM: 1.2,
      sstCelsius: 29.0,
      tidePhase: 'Subiendo',
      tideHeightM: 1.2,
      pressureHpa: 1011,
      moonPhase: 'Creciente',
      moonIllumination: 63,
    },
    subscores: [],
    topPositiveFactors: [],
    topNegativeFactors: [],
    algorithmVersion: 'v0.1.0-deterministic',
  };

  const cond = activeForecast.conditions;

  return (
    <div className="screen-content mockup-forecast-screen">
      {/* 1. MOCKUP TOP HEADER (Phone 3 Style) */}
      <div className="forecast-mockup-header">
        <div className="species-header-dropdown-wrap">
          <select
            className="species-dropdown-select"
            value={selectedSpecies.id}
            onChange={(e) => {
              const sp = allSpecies.find((s) => s.id === e.target.value);
              if (sp) onSelectSpecies(sp);
            }}
          >
            {allSpecies.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.commonName}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="dropdown-arrow" />
        </div>

        <button className="info-circle-btn" onClick={() => setShowSubscores(!showSubscores)} title="Ver modelo matemático">
          <Info size={18} />
        </button>
      </div>

      {/* 2. FISH HERO ARTWORK BANNER */}
      <div className="forecast-fish-artwork-card">
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
          alt={selectedSpecies.commonName}
          className="fish-hero-image"
        />
        <div className="fish-artwork-gradient"></div>
        <div className="fish-artwork-title-chip">
          <span>{selectedSpecies.commonName} • {currentZone.name}</span>
        </div>
      </div>

      {/* 3. TIME TABS (Hoy / Mañana / 7 días) */}
      <div className="mockup-day-tabs">
        <button
          className={`day-tab-btn ${timeTab === 'hoy' ? 'active' : ''}`}
          onClick={() => setTimeTab('hoy')}
        >
          Hoy
        </button>
        <button
          className={`day-tab-btn ${timeTab === 'manana' ? 'active' : ''}`}
          onClick={() => setTimeTab('manana')}
        >
          Mañana
        </button>
        <button
          className={`day-tab-btn ${timeTab === '7dias' ? 'active' : ''}`}
          onClick={() => setTimeTab('7dias')}
        >
          7 días
        </button>
      </div>

      {/* 4. WHITE/HIGH-CONTRAST MOCKUP SCORE CARD (Phone 3 Centerpiece) */}
      <div className="mockup-white-score-container">
        {/* Score Dial & Status Row */}
        <div className="score-dial-status-row">
          {/* Circular radial meter */}
          <div className="mockup-circular-gauge">
            <svg viewBox="0 0 100 100" className="gauge-svg">
              <circle cx="50" cy="50" r="42" className="gauge-bg" />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="gauge-val"
                style={{ strokeDasharray: '264', strokeDashoffset: '34' }}
              />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-number">87</span>
              <span className="gauge-scale">/100</span>
            </div>
          </div>

          <div className="score-status-texts">
            <h3 className="score-status-title">Excelente actividad</h3>
            <p className="score-status-date">Mañana, 14 de oct.</p>
          </div>
        </div>

        {/* 2x3 Metrics Grid from Mockup */}
        <div className="mockup-metrics-grid-2x3">
          <div className="metric-box">
            <div className="metric-icon-wrap"><Clock size={16} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Mejor horario</span>
              <span className="metric-val">6:10 – 8:40 a.m.</span>
              <span className="metric-sub">Marea subiendo</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Waves size={16} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Marea</span>
              <span className="metric-val">Subiendo</span>
              <span className="metric-sub">↑ 1.2 m</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Wind size={16} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Viento</span>
              <span className="metric-val">5 kt</span>
              <span className="metric-sub">SE</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Moon size={16} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Luna</span>
              <span className="metric-val">63%</span>
              <span className="metric-sub">Creciente</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Thermometer size={16} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Temperatura</span>
              <span className="metric-val">29°C</span>
              <span className="metric-sub">SST óptimo</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Gauge size={16} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Presión</span>
              <span className="metric-val">1011 hPa</span>
              <span className="metric-sub">Estable</span>
            </div>
          </div>
        </div>

        {/* 5. SEÑUELOS RECOMENDADOS SECTION */}
        <div className="recommended-lures-mockup-section">
          <div className="lures-header-row">
            <h4>Señuelos recomendados</h4>
            <ChevronRight size={16} className="text-muted" />
          </div>

          <div className="lures-images-row">
            <div className="lure-item-card">
              <div className="lure-badge-icon">🎣</div>
              <span className="lure-name">Crankbait</span>
              <span className="lure-sub">Deep Runner</span>
            </div>
            <div className="lure-item-card">
              <div className="lure-badge-icon">⚡</div>
              <span className="lure-name">Minnow</span>
              <span className="lure-sub">Suspendido</span>
            </div>
            <div className="lure-item-card">
              <div className="lure-badge-icon">🌊</div>
              <span className="lure-name">Popper</span>
              <span className="lure-sub">Superficie</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. EXPANDABLE 9-FACTOR SUBSCORES & AUDIT */}
      <div className="expand-subscores-card">
        <button className="toggle-subscores-btn" onClick={() => setShowSubscores(!showSubscores)}>
          <Sliders size={16} />
          <span>{showSubscores ? 'Ocultar' : 'Ver'} auditoría de los 9 factores matemáticos</span>
          <ChevronDown size={16} className={showSubscores ? 'rotate-180' : ''} />
        </button>

        {showSubscores && (
          <div className="subscores-table-content">
            <div className="engine-badge-tag">Versión Algoritmo: {activeForecast.algorithmVersion}</div>
            <div className="subscores-items-list">
              {activeForecast.subscores.map((s) => (
                <div key={s.key} className="subscore-mini-row">
                  <div className="subscore-left">
                    <span className="subscore-name">{s.label} ({s.weight}%)</span>
                    <span className="subscore-expl">{s.explanation}</span>
                  </div>
                  <span className={`subscore-badge-val ${s.status}`}>{s.subscore}/100</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
