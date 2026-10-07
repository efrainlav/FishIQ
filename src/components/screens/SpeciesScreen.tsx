import React, { useState } from 'react';
import { Species, Zone, HourlyScore } from '../../types';
import { Fish, Waves, Thermometer, Anchor, Target, Sparkles, ChevronRight, Check } from 'lucide-react';

interface SpeciesScreenProps {
  allSpecies: Species[];
  selectedSpecies: Species;
  onSelectSpecies: (species: Species) => void;
  currentZone: Zone;
  hourlyScores: HourlyScore[];
  onNavigateToForecast: () => void;
}

export const SpeciesScreen: React.FC<SpeciesScreenProps> = ({
  allSpecies,
  selectedSpecies,
  onSelectSpecies,
  currentZone,
  hourlyScores,
  onNavigateToForecast,
}) => {
  const [detailSpecies, setDetailSpecies] = useState<Species>(selectedSpecies);
  const currentScore = hourlyScores[0]?.score || 75;

  return (
    <div className="screen-content species-screen">
      <div className="section-header-compact">
        <span className="section-title-tag">CATÁLOGO PILOTO PANAMÁ</span>
        <span className="species-count-badge">8 Especies Marinas</span>
      </div>

      <div className="species-intro-banner">
        <Fish size={22} className="banner-icon" />
        <div className="banner-texts">
          <h4>Especies Clave del Pacífico Panameño</h4>
          <p>Fichas biológicas parametrizadas con profundidades, señuelos y preferencias tróficas.</p>
        </div>
      </div>

      {/* Grid of the 8 Species Cards */}
      <div className="species-cards-grid">
        {allSpecies.map((sp) => {
          const isSelected = sp.id === selectedSpecies.id;
          const isInspecting = sp.id === detailSpecies.id;

          return (
            <div
              key={sp.id}
              className={`species-card-item ${isInspecting ? 'inspecting' : ''} ${isSelected ? 'active-target' : ''}`}
              onClick={() => setDetailSpecies(sp)}
            >
              <div className="card-top-header">
                <span className="sp-card-emoji">{sp.avatarEmoji}</span>
                <span className="sp-category-pill">{sp.category}</span>
              </div>

              <h3 className="sp-card-name">{sp.commonName}</h3>
              <p className="sp-card-sci">{sp.scientificName}</p>

              <div className="sp-card-quick-stats">
                <div className="stat-pair">
                  <span className="stat-label">Profundidad:</span>
                  <span className="stat-val">{sp.depthRangeText}</span>
                </div>
                <div className="stat-pair">
                  <span className="stat-label">Agua ideal:</span>
                  <span className="stat-val">{sp.preferences.tempOptimalMin} – {sp.preferences.tempOptimalMax}°C</span>
                </div>
              </div>

              <div className="sp-card-footer">
                {isSelected ? (
                  <span className="current-target-indicator">
                    <Check size={14} /> Especie Activa
                  </span>
                ) : (
                  <button
                    className="select-target-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSpecies(sp);
                      setDetailSpecies(sp);
                    }}
                  >
                    Fijar Objetivo
                  </button>
                )}
                <span className="inspect-arrow"><ChevronRight size={16} /></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Drawer / Modal for the currently inspected species */}
      <div className="species-detail-drawer">
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-emoji">{detailSpecies.avatarEmoji}</span>
            <div>
              <h2>{detailSpecies.commonName}</h2>
              <span className="sci-name-drawer">{detailSpecies.scientificName}</span>
            </div>
          </div>
          <button
            className="set-active-drawer-btn"
            onClick={() => {
              onSelectSpecies(detailSpecies);
            }}
          >
            {selectedSpecies.id === detailSpecies.id ? '✓ Seleccionada' : 'Seleccionar Especie'}
          </button>
        </div>

        <p className="drawer-bio-desc">{detailSpecies.description}</p>

        {/* Biological Sweet Spots */}
        <div className="drawer-grid-parameters">
          <div className="drawer-param-box">
            <div className="param-header"><Waves size={16} /> Rango de Profundidad</div>
            <div className="param-value">{detailSpecies.depthRangeText}</div>
            <div className="param-hint">Estructuras, cantos y rompientes</div>
          </div>

          <div className="drawer-param-box">
            <div className="param-header"><Thermometer size={16} /> Temperatura Óptima</div>
            <div className="param-value">
              {detailSpecies.preferences.tempOptimalMin}°C a {detailSpecies.preferences.tempOptimalMax}°C
            </div>
            <div className="param-hint">SST óptima para actividad trófica</div>
          </div>

          <div className="drawer-param-box">
            <div className="param-header"><Anchor size={16} /> Fases de Marea Preferidas</div>
            <div className="param-value">{detailSpecies.preferences.preferredTides.join(', ')}</div>
            <div className="param-hint">Movimiento de agua con mayor pique</div>
          </div>

          <div className="drawer-param-box">
            <div className="param-header"><Target size={16} /> Temporada en Panamá</div>
            <div className="param-value">{detailSpecies.seasonText}</div>
            <div className="param-hint">Pico migratorio y estacional</div>
          </div>
        </div>

        {/* Recommended Lures & Techniques */}
        <div className="lures-techniques-section">
          <h4>Señuelos Recomendados</h4>
          <div className="lure-chips-list">
            {detailSpecies.preferences.recommendedLures.map((lure, i) => (
              <span key={i} className="lure-chip">
                🎣 {lure}
              </span>
            ))}
          </div>

          <h4 className="tech-heading">Técnicas de Pesca Aconsejadas</h4>
          <div className="technique-badges-row">
            {detailSpecies.preferences.recommendedTechniques.map((tech, i) => (
              <span key={i} className="technique-pill">
                ⚓ {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action to calculate score */}
        <div className="drawer-footer-actions">
          <button
            className="calculate-score-cta"
            onClick={() => {
              onSelectSpecies(detailSpecies);
              onNavigateToForecast();
            }}
          >
            <Sparkles size={18} /> Ver Pronóstico Horario de {detailSpecies.commonName}
          </button>
        </div>
      </div>
    </div>
  );
};
