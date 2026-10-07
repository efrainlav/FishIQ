import React from 'react';
import { Species, Zone, HourlyScore, CatchRecord } from '../../types';
import {
  Cloud,
  Waves,
  Moon,
  MapPin,
  Fish,
  BarChart3,
  Clock,
  ChevronRight,
  Wind,
  Thermometer,
  Gauge
} from 'lucide-react';

interface HomeScreenProps {
  currentZone: Zone;
  selectedSpecies: Species;
  onSelectSpecies: (species: Species) => void;
  allSpecies: Species[];
  hourlyScores: HourlyScore[];
  onOpenLogCatch: () => void;
  onNavigateToTab: (tab: 'map' | 'forecast' | 'logbook' | 'ai' | 'admin') => void;
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
    topPositiveFactors: [],
    topNegativeFactors: [],
  };

  const cond = currentForecast.conditions;

  return (
    <div className="screen-content home-screen">
      {/* 1. MOCKUP HERO SCREEN (Exact Match Phone 1) */}
      <section className="mockup-splash-hero-card">
        {/* Logo and Brand */}
        <div className="splash-logo-container">
          <div className="splash-fish-logo-icon">
            <svg viewBox="0 0 100 48" className="brand-svg-fish" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 24C24 9 58 6 84 15C93 19 89 27 80 30C66 36 34 40 12 24Z" fill="url(#cyanBlueGrad)" />
              <path d="M74 17C81 11 91 9 97 11C94 17 89 21 83 21Z" fill="#00d2ff" />
              <path d="M77 27C84 33 91 35 97 33C93 29 87 25 81 25Z" fill="#0077b6" />
              <circle cx="28" cy="21" r="3.2" fill="#ffffff" />
              <defs>
                <linearGradient id="cyanBlueGrad" x1="12" y1="24" x2="84" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00d2ff" />
                  <stop offset="1" stopColor="#0077b6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="mockup-brand-title">FISH<span className="brand-iq-cyan">IQ</span></h1>
          <div className="mockup-brand-sub">SMART FISHING LATAM</div>
          <p className="mockup-brand-slogan">Mejores decisiones. Más capturas.</p>
        </div>

        {/* Feature Icons Strip */}
        <div className="feature-icons-strip">
          <div className="feature-item" onClick={() => onNavigateToTab('forecast')}>
            <div className="feature-icon-circle"><Cloud size={16} /></div>
            <span>Clima</span>
          </div>
          <div className="feature-item" onClick={() => onNavigateToTab('forecast')}>
            <div className="feature-icon-circle"><Waves size={16} /></div>
            <span>Mareas</span>
          </div>
          <div className="feature-item" onClick={() => onNavigateToTab('forecast')}>
            <div className="feature-icon-circle"><Moon size={16} /></div>
            <span>Luna</span>
          </div>
          <div className="feature-item" onClick={() => onNavigateToTab('map')}>
            <div className="feature-icon-circle"><MapPin size={16} /></div>
            <span>Mapas</span>
          </div>
          <div className="feature-item" onClick={() => onNavigateToTab('forecast')}>
            <div className="feature-icon-circle"><Fish size={16} /></div>
            <span>Especies</span>
          </div>
          <div className="feature-item" onClick={() => onNavigateToTab('ai')}>
            <div className="feature-icon-circle"><BarChart3 size={16} /></div>
            <span>IA y datos</span>
          </div>
        </div>

        {/* Leaping Snook Hero Graphic (High Resolution from Mockup) */}
        <div className="splash-fish-artwork">
          <img
            src="/images/splash_fish.jpg"
            alt="Robalo saltando en el mar"
            className="splash-hero-img"
          />
          <div className="splash-img-overlay-glow"></div>
        </div>

        {/* Buttons Exactly Matching Phone 1 Mockup */}
        <div className="splash-cta-buttons">
          <button className="mockup-btn-primary" onClick={() => onNavigateToTab('forecast')}>
            Comenzar
          </button>
          <button className="mockup-btn-secondary" onClick={() => onNavigateToTab('map')}>
            Iniciar sesión
          </button>
          <button className="mockup-btn-link" onClick={() => onNavigateToTab('map')}>
            Explorar sin cuenta
          </button>
        </div>
      </section>

      {/* 2. LIVE DASHBOARD QUICK SUMMARY IN PANAMA */}
      <section className="live-snapshot-card">
        <div className="section-header-compact">
          <span className="section-title-tag">CONDICIONES EN {currentZone.name.toUpperCase()}</span>
          <span className="score-badge-green">Fishing Score: {currentForecast.score}/100</span>
        </div>

        <div className="conditions-grid-2x3">
          <div className="cond-mini-tile">
            <Clock size={16} className="text-cyan-bright" />
            <div className="tile-texts">
              <span className="tile-lbl">Mejor horario</span>
              <span className="tile-val">6:10 – 8:40 a.m.</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Waves size={16} className="text-cyan-bright" />
            <div className="tile-texts">
              <span className="tile-lbl">Marea ({cond.tidePhase})</span>
              <span className="tile-val">↑ {cond.tideHeightM} m</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Wind size={16} className="text-cyan-bright" />
            <div className="tile-texts">
              <span className="tile-lbl">Viento</span>
              <span className="tile-val">{cond.windSpeedKnots} kt {cond.windDirectionLabel}</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Moon size={16} className="text-cyan-bright" />
            <div className="tile-texts">
              <span className="tile-lbl">Luna</span>
              <span className="tile-val">{cond.moonIllumination}% {cond.moonPhase}</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Thermometer size={16} className="text-cyan-bright" />
            <div className="tile-texts">
              <span className="tile-lbl">Temperatura</span>
              <span className="tile-val">{cond.sstCelsius}°C</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Gauge size={16} className="text-cyan-bright" />
            <div className="tile-texts">
              <span className="tile-lbl">Presión</span>
              <span className="tile-val">{cond.pressureHpa} hPa</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SPECIES SELECTOR */}
      <section className="species-picker-section">
        <div className="section-header-compact">
          <span className="section-title-tag">ESPECIE ACTIVA</span>
          <span className="station-provider-tag">Piloto Panamá</span>
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

      {/* 4. RECENT CATCHES PREVIEW */}
      <section className="recent-activity-section">
        <div className="section-header-compact">
          <span className="section-title-tag">DIARIO DE PESCA RECIENTE</span>
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
                <div className="mini-catch-lure">{c.lureUsed} • {c.lengthCm} cm</div>
                <div className="mini-catch-snap">
                  Score {c.environmentalSnapshot.scoreCalculated} • {c.zoneName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
