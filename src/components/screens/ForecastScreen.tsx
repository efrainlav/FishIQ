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
  ArrowLeft,
  ChevronRight,
  Sliders
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
        <div className="forecast-header-left">
          <ArrowLeft size={18} className="text-white" />
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
            <ChevronDown size={16} className="text-white" />
          </div>
        </div>

        <button className="header-circle-icon-btn" onClick={() => setShowSubscores(!showSubscores)} title="Auditoría matemática">
          <ChevronDown size={18} />
        </button>
      </div>

      {/* 2. REALISTIC FISH ILLUSTRATION HERO (Matching Phone 3) */}
      <div className="forecast-fish-artwork-card">
        <img
          src="/images/robalo_illustration.jpg"
          alt={selectedSpecies.commonName}
          className="fish-hero-image"
        />
        <div className="fish-artwork-gradient"></div>
      </div>

      {/* 3. TIME TABS (Hoy / Mañana / 7 días) */}
      <div className="mockup-day-tabs">
        <button
          className={`day-tab-btn ${timeTab === 'hoy' ? 'active-white' : ''}`}
          onClick={() => setTimeTab('hoy')}
        >
          Hoy
        </button>
        <button
          className={`day-tab-btn ${timeTab === 'manana' ? 'active-white' : ''}`}
          onClick={() => setTimeTab('manana')}
        >
          Mañana
        </button>
        <button
          className={`day-tab-btn ${timeTab === '7dias' ? 'active-white' : ''}`}
          onClick={() => setTimeTab('7dias')}
        >
          7 días
        </button>
      </div>

      {/* 4. CRISP PURE WHITE CARD (Centerpiece of Phone 3) */}
      <div className="pure-white-score-card">
        {/* Score Dial & Status Row */}
        <div className="score-dial-status-row">
          {/* Circular radial gauge with green stroke */}
          <div className="mockup-circular-gauge">
            <svg viewBox="0 0 100 100" className="gauge-svg">
              <circle cx="50" cy="50" r="40" className="gauge-track-gray" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="gauge-stroke-green"
                style={{ strokeDasharray: '251', strokeDashoffset: '32' }}
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
            <div className="metric-icon-wrap"><Clock size={18} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Mejor horario</span>
              <span className="metric-val">6:10 – 8:40 a.m.</span>
              <span className="metric-sub">Marea subiendo</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Waves size={18} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Marea</span>
              <span className="metric-val">Subiendo</span>
              <span className="metric-sub">↑ 1.2 m</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Wind size={18} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Viento</span>
              <span className="metric-val">5 kt</span>
              <span className="metric-sub">SE</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Moon size={18} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Luna</span>
              <span className="metric-val">63%</span>
              <span className="metric-sub">Creciente</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Thermometer size={18} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Temperatura</span>
              <span className="metric-val">29°C</span>
              <span className="metric-sub">SST óptima</span>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap"><Gauge size={18} /></div>
            <div className="metric-texts">
              <span className="metric-lbl">Presión</span>
              <span className="metric-val">1011 hPa</span>
              <span className="metric-sub">Estable</span>
            </div>
          </div>
        </div>

        {/* 5. SEÑUELOS RECOMENDADOS SECTION (Phone 3) */}
        <div className="recommended-lures-white-section">
          <div className="lures-header-row">
            <h4>Señuelos recomendados</h4>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          <div className="lures-realistic-photo-wrap">
            <img
              src="/images/lures_set.jpg"
              alt="Señuelos recomendados para robalo: Crankbait, Minnow, Popper"
              className="lures-realistic-img"
            />
          </div>
        </div>
      </div>

      {/* 6. EXPANDABLE MATHEMATICAL AUDIT */}
      <div className="expand-subscores-card">
        <button className="toggle-subscores-btn" onClick={() => setShowSubscores(!showSubscores)}>
          <Sliders size={16} />
          <span>{showSubscores ? 'Ocultar' : 'Ver'} auditoría de los 9 factores oceanográficos</span>
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
