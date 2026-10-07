import React, { useState } from 'react';
import { Species, Zone, HourlyScore } from '../../types';
import { Clock, Info, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Sliders, Waves, Wind, Thermometer, Anchor } from 'lucide-react';

interface ForecastScreenProps {
  currentZone: Zone;
  selectedSpecies: Species;
  hourlyScores: HourlyScore[];
}

export const ForecastScreen: React.FC<ForecastScreenProps> = ({
  currentZone,
  selectedSpecies,
  hourlyScores,
}) => {
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);

  const activeForecast = hourlyScores[selectedHourIndex] || hourlyScores[0];
  const cond = activeForecast.conditions;

  const getScoreColorClass = (score: number) => {
    if (score >= 90) return 'score-excepcional';
    if (score >= 75) return 'score-muy-buena';
    if (score >= 60) return 'score-buena';
    if (score >= 40) return 'score-regular';
    return 'score-baja';
  };

  return (
    <div className="screen-content forecast-screen">
      {/* Top Context Header */}
      <div className="forecast-header-card">
        <div className="header-badge-row">
          <span className="species-chip-bold">
            {selectedSpecies.avatarEmoji} {selectedSpecies.commonName}
          </span>
          <span className="zone-chip-outline">{currentZone.name}</span>
        </div>
        <h2 className="forecast-title">Pronóstico Horario & Scoring Biológico</h2>
        <p className="forecast-subtitle">
          Evolución del FISHIQ Score calculada mediante motor determinístico y explicable.
        </p>
      </div>

      {/* Hourly Timeline Horizontal Scroll Bar */}
      <section className="hourly-timeline-section">
        <div className="timeline-title-row">
          <span><Clock size={15} /> HORAS DE LA JORNADA</span>
          <span className="timeline-hint">Desliza y toca para inspeccionar</span>
        </div>

        <div className="hourly-bars-carousel">
          {hourlyScores.map((h, idx) => {
            const isSelected = idx === selectedHourIndex;
            return (
              <button
                key={idx}
                className={`hourly-bar-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedHourIndex(idx)}
              >
                <span className="bar-time">{h.timeLabel}</span>
                <div className="bar-meter-track">
                  <div
                    className={`bar-meter-fill ${getScoreColorClass(h.score)}`}
                    style={{ height: `${h.score}%` }}
                  ></div>
                </div>
                <span className="bar-score">{h.score}</span>
                <span className="bar-tide-mini">{h.conditions.tidePhase.slice(0, 3)}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Hour Score Breakdown Card */}
      <section className={`active-hour-card ${getScoreColorClass(activeForecast.score)}`}>
        <div className="active-hour-summary">
          <div>
            <span className="hour-time-badge">HORA SELECCIONADA: {activeForecast.timeLabel}</span>
            <div className="active-score-display">
              <span className="score-big">{activeForecast.score}</span>
              <span className="score-total">/100</span>
              <span className="tier-tag">{activeForecast.tier}</span>
            </div>
            <div className="active-meta-line">
              {cond.solarPosition} • Marea {cond.tidePhase} ({cond.tideHeightM}m) • {cond.windSpeedKnots} kts
            </div>
          </div>
        </div>

        {/* Explainability Bullets (Required by Brief Section 5) */}
        <div className="explainability-boxes-grid">
          <div className="explain-box positive-box">
            <div className="explain-box-title">
              <CheckCircle2 size={16} className="text-emerald" /> Factores que más Favorecen (+):
            </div>
            {activeForecast.topPositiveFactors.length > 0 ? (
              activeForecast.topPositiveFactors.map((f, i) => (
                <div key={i} className="explain-item">
                  <ArrowUpRight size={14} className="explain-arrow up" />
                  <span>{f}</span>
                </div>
              ))
            ) : (
              <div className="explain-item empty">Condiciones generales intermedias.</div>
            )}
          </div>

          <div className="explain-box negative-box">
            <div className="explain-box-title">
              <XCircle size={16} className="text-rose" /> Factores que Limitan el Score (-):
            </div>
            {activeForecast.topNegativeFactors.length > 0 ? (
              activeForecast.topNegativeFactors.map((f, i) => (
                <div key={i} className="explain-item">
                  <ArrowDownRight size={14} className="explain-arrow down" />
                  <span>{f}</span>
                </div>
              ))
            ) : (
              <div className="explain-item empty">Sin factores fuertemente limitantes en esta hora.</div>
            )}
          </div>
        </div>

        {/* The 9 Subscores Table Breakdown */}
        <div className="subscores-table-section">
          <div className="subscores-table-header">
            <span><Sliders size={15} /> DESGLOSE DETALLADO DE LOS 9 FACTORES</span>
            <span className="engine-version-pill">{activeForecast.algorithmVersion}</span>
          </div>

          <div className="subscores-list">
            {activeForecast.subscores.map((s) => (
              <div key={s.key} className="subscore-row">
                <div className="subscore-info-col">
                  <div className="subscore-title-row">
                    <span className="subscore-label">{s.label}</span>
                    <span className="subscore-weight-badge">{s.weight}% peso</span>
                  </div>
                  <div className="subscore-explanation-text">{s.explanation}</div>
                </div>

                <div className="subscore-meter-col">
                  <div className="subscore-num">{s.subscore}/100</div>
                  <div className="subscore-progress-bar">
                    <div
                      className={`progress-fill ${s.status}`}
                      style={{ width: `${s.subscore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Footer (Brief Section 4 Requirement) */}
        <div className="audit-log-footer">
          <Info size={14} />
          <span>
            <strong>Auditoría Ambiental:</strong> Proveedor: {cond.provider} | Timestamp: {cond.timestamp} | Coordenadas: [{currentZone.lat}, {currentZone.lon}]
          </span>
        </div>
      </section>
    </div>
  );
};
