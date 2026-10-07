import React from 'react';
import { Species, Zone, HourlyScore, CatchRecord } from '../../types';
import {
  Wind,
  Waves,
  Thermometer,
  Gauge,
  Moon,
  Clock,
  Sparkles,
  PlusCircle,
  TrendingUp,
  MapPin,
  ChevronRight,
  Anchor,
  AlertCircle
} from 'lucide-react';

interface HomeScreenProps {
  currentZone: Zone;
  selectedSpecies: Species;
  onSelectSpecies: (species: Species) => void;
  allSpecies: Species[];
  hourlyScores: HourlyScore[];
  onOpenLogCatch: () => void;
  onNavigateToTab: (tab: 'map' | 'forecast' | 'species' | 'ai' | 'logbook') => void;
  recentCatches: CatchRecord[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentZone,
  selectedSpecies,
  onSelectSpecies,
  allSpecies,
  hourlyScores,
  onOpenLogCatch,
  onNavigateToTab,
  recentCatches,
}) => {
  const currentForecast = hourlyScores[0] || {
    score: 75,
    tier: 'Muy buena',
    timeLabel: '06:00',
    conditions: {
      windSpeedKnots: 8,
      windDirectionLabel: 'NNE',
      waveHeightM: 0.8,
      sstCelsius: 27.5,
      tidePhase: 'Subiendo',
      tideHeightM: 3.4,
      pressureHpa: 1012,
      moonPhase: 'Cuarto Creciente',
    },
    topPositiveFactors: [],
    topNegativeFactors: [],
  };

  const cond = currentForecast.conditions;

  // Find best window in the next 24h
  const bestWindow = [...hourlyScores].sort((a, b) => b.score - a.score)[0] || currentForecast;

  // Helper color for score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'score-excepcional';
    if (score >= 75) return 'score-muy-buena';
    if (score >= 60) return 'score-buena';
    if (score >= 40) return 'score-regular';
    return 'score-baja';
  };

  return (
    <div className="screen-content home-screen">
      {/* 1. Live Conditions Ribbon */}
      <section className="conditions-ribbon-card">
        <div className="section-header-compact">
          <span className="section-title-tag">CONDICIONES EN VIVO</span>
          <span className="station-provider-tag">Open-Meteo + NOAA Grid</span>
        </div>

        <div className="conditions-grid">
          <div className="condition-item">
            <div className="cond-icon-wrap wind">
              <Wind size={18} />
            </div>
            <div className="cond-data">
              <span className="cond-label">Viento</span>
              <span className="cond-value">{cond.windSpeedKnots} <small>kts {cond.windDirectionLabel}</small></span>
            </div>
          </div>

          <div className="condition-item">
            <div className="cond-icon-wrap tide">
              <Anchor size={18} />
            </div>
            <div className="cond-data">
              <span className="cond-label">Marea ({cond.tidePhase})</span>
              <span className="cond-value">{cond.tideHeightM} <small>m</small></span>
            </div>
          </div>

          <div className="condition-item">
            <div className="cond-icon-wrap wave">
              <Waves size={18} />
            </div>
            <div className="cond-data">
              <span className="cond-label">Oleaje</span>
              <span className="cond-value">{cond.waveHeightM} <small>m</small></span>
            </div>
          </div>

          <div className="condition-item">
            <div className="cond-icon-wrap temp">
              <Thermometer size={18} />
            </div>
            <div className="cond-data">
              <span className="cond-label">Agua (SST)</span>
              <span className="cond-value">{cond.sstCelsius} <small>°C</small></span>
            </div>
          </div>

          <div className="condition-item">
            <div className="cond-icon-wrap pressure">
              <Gauge size={18} />
            </div>
            <div className="cond-data">
              <span className="cond-label">Presión</span>
              <span className="cond-value">{cond.pressureHpa} <small>hPa</small></span>
            </div>
          </div>

          <div className="condition-item">
            <div className="cond-icon-wrap moon">
              <Moon size={18} />
            </div>
            <div className="cond-data">
              <span className="cond-label">Luna</span>
              <span className="cond-value">{cond.moonPhase.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Target Species Selector Pills */}
      <section className="species-picker-section">
        <div className="section-header-compact">
          <span className="section-title-tag">ESPECIE OBJETIVO</span>
          <button className="text-link-btn" onClick={() => onNavigateToTab('species')}>
            Ver las 8 fichas <ChevronRight size={14} />
          </button>
        </div>

        <div className="species-scroll-row">
          {allSpecies.map((sp) => {
            const isSelected = sp.id === selectedSpecies.id;
            return (
              <button
                key={sp.id}
                className={`species-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectSpecies(sp)}
              >
                <span className="sp-emoji">{sp.avatarEmoji}</span>
                <span className="sp-name">{sp.commonName}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FISHIQ SCORE HERO CARD */}
      <section className={`score-hero-card ${getScoreColor(currentForecast.score)}`}>
        <div className="score-hero-glow"></div>
        <div className="hero-top-row">
          <div>
            <span className="score-badge-label">FISHIQ SCORE AHORA</span>
            <h2 className="score-species-name">{selectedSpecies.commonName}</h2>
            <p className="score-zone-context">
              <MapPin size={13} /> {currentZone.name}
            </p>
          </div>

          <div className="score-circle-display">
            <div className="score-number">{currentForecast.score}</div>
            <div className="score-scale">/100</div>
            <div className="score-tier-pill">{currentForecast.tier}</div>
          </div>
        </div>

        {/* Best Window Callout */}
        <div className="best-window-callout">
          <div className="window-icon-box">
            <Clock size={20} />
          </div>
          <div className="window-texts">
            <div className="window-title">MEJOR VENTANA PRÓXIMA: {bestWindow.timeLabel} HRS</div>
            <div className="window-desc">
              Pico con <strong>Score {bestWindow.score} ({bestWindow.tier})</strong>. Marea favorable para {selectedSpecies.commonName}.
            </div>
          </div>
          <button
            className="view-forecast-btn"
            onClick={() => onNavigateToTab('forecast')}
            title="Ver evolución horaria"
          >
            Detalles <ChevronRight size={16} />
          </button>
        </div>

        {/* Top Factor Bullets */}
        <div className="factor-bullets-container">
          <div className="factor-bullet-header">Factores determinantes en este momento:</div>
          {currentForecast.topPositiveFactors.slice(0, 2).map((item, idx) => (
            <div key={idx} className="factor-pill positive">
              <span className="factor-sign">+</span>
              <span className="factor-text">{item}</span>
            </div>
          ))}
          {currentForecast.topNegativeFactors.slice(0, 1).map((item, idx) => (
            <div key={idx} className="factor-pill negative">
              <span className="factor-sign">-</span>
              <span className="factor-text">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Quick Action Callouts */}
      <section className="quick-actions-row">
        <button className="quick-action-btn primary" onClick={onOpenLogCatch}>
          <div className="qa-icon-wrap">
            <PlusCircle size={22} />
          </div>
          <div className="qa-texts">
            <span className="qa-title">Registrar Captura</span>
            <span className="qa-sub">Guarda foto + snapshot ambiental</span>
          </div>
        </button>

        <button className="quick-action-btn secondary" onClick={() => onNavigateToTab('ai')}>
          <div className="qa-icon-wrap ai-accent">
            <Sparkles size={22} />
          </div>
          <div className="qa-texts">
            <span className="qa-title">Preguntar a FISHIQ AI</span>
            <span className="qa-sub">Asistente táctico sin alucinaciones</span>
          </div>
        </button>
      </section>

      {/* 5. Recent Activity / Captures Preview */}
      <section className="recent-activity-section">
        <div className="section-header-compact">
          <span className="section-title-tag">DIARIO RECIENTE EN PANAMÁ</span>
          <button className="text-link-btn" onClick={() => onNavigateToTab('logbook')}>
            Ver todo ({recentCatches.length}) <ChevronRight size={14} />
          </button>
        </div>

        <div className="recent-catches-preview-row">
          {recentCatches.slice(0, 2).map((c) => (
            <div key={c.id} className="mini-catch-card" onClick={() => onNavigateToTab('logbook')}>
              <div className="mini-catch-img-wrap">
                <img src={c.photoUrl} alt={c.speciesName} className="mini-catch-img" />
                <span className="mini-catch-weight">{c.weightLb} lb</span>
              </div>
              <div className="mini-catch-info">
                <div className="mini-catch-sp">{c.speciesName}</div>
                <div className="mini-catch-lure">{c.lureUsed.split('(')[0]}</div>
                <div className="mini-catch-snap">
                  Score {c.environmentalSnapshot.scoreCalculated} • {c.environmentalSnapshot.tidePhase}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer reminder as required by brief Section 9 */}
      <div className="marine-disclaimer-box">
        <AlertCircle size={16} />
        <span>
          <strong>Aviso FISHIQ:</strong> Este pronóstico evalúa probabilidad de pesca deportiva según biología y oceanografía. No sustituye la navegación segura ni informes meteorológicos de salvaguarda marítima.
        </span>
      </div>
    </div>
  );
};
