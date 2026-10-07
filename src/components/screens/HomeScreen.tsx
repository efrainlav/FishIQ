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
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
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
  const bestWindow = [...hourlyScores].sort((a, b) => b.score - a.score)[0] || currentForecast;

  return (
    <div className="screen-content home-screen">
      {/* 1. MOCKUP HERO HEADER (Phone 1 Style) */}
      <section className="mockup-splash-hero-card">
        <div className="splash-logo-container">
          <div className="splash-fish-logo-icon">
            <svg viewBox="0 0 100 50" className="brand-svg-fish" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 25C25 8 60 5 85 15C95 20 90 28 80 32C65 38 35 42 10 25Z" fill="url(#fishGrad)" />
              <path d="M75 18C82 12 92 10 98 12C95 18 90 22 84 22Z" fill="#00e5ff" />
              <path d="M78 28C85 34 92 36 98 34C94 30 88 26 82 26Z" fill="#0077b6" />
              <circle cx="28" cy="22" r="3" fill="#ffffff" />
              <defs>
                <linearGradient id="fishGrad" x1="10" y1="25" x2="85" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00e5ff" />
                  <stop offset="1" stopColor="#0077b6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="mockup-brand-title">FISHIQ</h1>
          <div className="mockup-brand-sub">SMART FISHING LATAM</div>
          <p className="mockup-brand-slogan">Mejores decisiones. Más capturas.</p>
        </div>

        {/* Feature Icons Strip from Reference Mockup */}
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

        {/* Hero Leaping Fish Graphic */}
        <div className="splash-fish-artwork">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
            alt="Robalo jumping out of water"
            className="splash-hero-img"
          />
          <div className="splash-img-overlay-glow"></div>
        </div>

        {/* Action Buttons from Mockup */}
        <div className="splash-cta-buttons">
          <button className="mockup-btn-primary" onClick={() => onNavigateToTab('forecast')}>
            Comenzar
          </button>
          <button className="mockup-btn-secondary" onClick={() => onNavigateToTab('map')}>
            Explorar Mapa Inteligente
          </button>
        </div>
      </section>

      {/* 2. LIVE DASHBOARD QUICK SUMMARY */}
      <section className="live-snapshot-card">
        <div className="section-header-compact">
          <span className="section-title-tag">CONDICIONES EN {currentZone.name.toUpperCase()}</span>
          <span className="score-badge-green">Score {currentForecast.score}/100</span>
        </div>

        <div className="conditions-grid-2x3">
          <div className="cond-mini-tile">
            <Clock size={16} className="text-cyan" />
            <div className="tile-texts">
              <span className="tile-lbl">Mejor horario</span>
              <span className="tile-val">6:10 – 8:40 a.m.</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Waves size={16} className="text-cyan" />
            <div className="tile-texts">
              <span className="tile-lbl">Marea ({cond.tidePhase})</span>
              <span className="tile-val">↑ {cond.tideHeightM} m</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Wind size={16} className="text-cyan" />
            <div className="tile-texts">
              <span className="tile-lbl">Viento</span>
              <span className="tile-val">{cond.windSpeedKnots} kt {cond.windDirectionLabel}</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Moon size={16} className="text-cyan" />
            <div className="tile-texts">
              <span className="tile-lbl">Luna</span>
              <span className="tile-val">{cond.moonIllumination}% {cond.moonPhase}</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Thermometer size={16} className="text-cyan" />
            <div className="tile-texts">
              <span className="tile-lbl">Temperatura</span>
              <span className="tile-val">{cond.sstCelsius}°C</span>
            </div>
          </div>

          <div className="cond-mini-tile">
            <Gauge size={16} className="text-cyan" />
            <div className="tile-texts">
              <span className="tile-lbl">Presión</span>
              <span className="tile-val">{cond.pressureHpa} hPa</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SPECIES SELECTOR ROW */}
      <section className="species-picker-section">
        <div className="section-header-compact">
          <span className="section-title-tag">SELECCIONAR ESPECIE</span>
          <span className="station-provider-tag">8 especies de Panamá</span>
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
          <span className="section-title-tag">ÚLTIMAS CAPTURAS DE LA COMUNIDAD</span>
          <button className="text-link-btn" onClick={() => onNavigateToTab('logbook')}>
            Ver diario ({recentCatches.length}) <ChevronRight size={14} />
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
