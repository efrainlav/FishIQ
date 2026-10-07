import React, { useState } from 'react';
import { CatchRecord, Species } from '../../types';
import { BookOpen, MapPin, Lock, Filter, Plus, Calendar, Award, Scale, Waves, Thermometer, Anchor, Trash2 } from 'lucide-react';

interface LogbookScreenProps {
  catches: CatchRecord[];
  allSpecies: Species[];
  onOpenLogModal: () => void;
  onDeleteCatch?: (id: string) => void;
}

export const LogbookScreen: React.FC<LogbookScreenProps> = ({
  catches,
  allSpecies,
  onOpenLogModal,
  onDeleteCatch,
}) => {
  const [selectedFilterSpecies, setSelectedFilterSpecies] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredCatches = catches.filter((c) => {
    if (selectedFilterSpecies === 'all') return true;
    return c.speciesId === selectedFilterSpecies;
  });

  // Calculate statistics
  const totalCatches = catches.length;
  const biggestCatch = [...catches].sort((a, b) => b.weightLb - a.weightLb)[0];

  return (
    <div className="screen-content logbook-screen">
      {/* Header & Stats Banner */}
      <div className="logbook-header-banner">
        <div className="logbook-banner-top">
          <div>
            <h2>Diario de Capturas</h2>
            <p className="logbook-sub">Tu bitácora privada de pesca en el Pacífico de Panamá</p>
          </div>
          <button className="add-catch-btn-pill" onClick={onOpenLogModal}>
            <Plus size={16} /> Nueva Captura
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="logbook-stats-grid">
          <div className="stat-box">
            <span className="stat-box-num">{totalCatches}</span>
            <span className="stat-box-lbl">Capturas Totales</span>
          </div>
          <div className="stat-box highlight">
            <span className="stat-box-num">{biggestCatch ? `${biggestCatch.weightLb} lb` : '—'}</span>
            <span className="stat-box-lbl">Récord Personal</span>
          </div>
          <div className="stat-box">
            <span className="stat-box-num">100%</span>
            <span className="stat-box-lbl">Privacidad Activa</span>
          </div>
        </div>
      </div>

      {/* Filter and Mode Bar */}
      <div className="logbook-controls-bar">
        <div className="species-filter-group">
          <Filter size={15} />
          <select
            value={selectedFilterSpecies}
            onChange={(e) => setSelectedFilterSpecies(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las especies ({catches.length})</option>
            {allSpecies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.avatarEmoji} {s.commonName}
              </option>
            ))}
          </select>
        </div>

        <div className="view-mode-tabs">
          <button
            className={`mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            Lista
          </button>
          <button
            className={`mode-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            <MapPin size={14} /> Mapa Privado
          </button>
        </div>
      </div>

      {/* Mode 1: List View */}
      {viewMode === 'list' && (
        <div className="catches-list-container">
          {filteredCatches.length === 0 ? (
            <div className="empty-logbook-card">
              <BookOpen size={40} className="empty-icon" />
              <h3>No hay capturas registradas</h3>
              <p>Aún no has registrado piezas de esta especie o tu diario está vacío.</p>
              <button className="primary-cta-btn" onClick={onOpenLogModal}>
                Registrar Mi Primera Captura
              </button>
            </div>
          ) : (
            filteredCatches.map((c) => (
              <div key={c.id} className="catch-card-item">
                <div className="catch-card-media">
                  {c.photoUrl ? (
                    <img src={c.photoUrl} alt={c.speciesName} className="catch-card-img" />
                  ) : (
                    <div className="catch-img-placeholder">🐟</div>
                  )}
                  <span className="catch-weight-pill">
                    <Scale size={13} /> {c.weightLb} lb • {c.lengthCm} cm
                  </span>
                  {c.isPrivate && (
                    <span className="catch-private-tag" title="Spot privado no compartido">
                      <Lock size={12} /> Privado
                    </span>
                  )}
                </div>

                <div className="catch-card-body">
                  <div className="catch-body-header">
                    <h3 className="catch-sp-name">{c.speciesName}</h3>
                    <span className="catch-date">
                      <Calendar size={13} /> {new Date(c.caughtAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="catch-zone-lure">
                    <span className="catch-zone-tag"><MapPin size={12} /> {c.zoneName}</span>
                    <span className="catch-lure-tag">🎣 {c.lureUsed}</span>
                  </div>

                  {c.notes && <p className="catch-notes-snippet">"{c.notes}"</p>}

                  {/* Immutable Environmental Snapshot Box */}
                  <div className="catch-snapshot-box">
                    <div className="snapshot-box-title">Snapshot Ambiental del Momento:</div>
                    <div className="snapshot-box-items">
                      <span><Thermometer size={12} /> {c.environmentalSnapshot.sstCelsius}°C SST</span>
                      <span><Anchor size={12} /> Marea {c.environmentalSnapshot.tidePhase} ({c.environmentalSnapshot.tideHeightM}m)</span>
                      <span><Waves size={12} /> Oleaje {c.environmentalSnapshot.waveHeightM}m</span>
                      <span className="score-snapshot-tag">Score: {c.environmentalSnapshot.scoreCalculated}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Mode 2: Private Map View */}
      {viewMode === 'map' && (
        <div className="private-map-view-card">
          <div className="private-map-notice">
            <Lock size={16} />
            <span>
              <strong>Mapa Privado de Coordenadas:</strong> Solo tú tienes acceso a estos puntos. No se transmiten públicamente a otros pescadores.
            </span>
          </div>

          <div className="private-spots-list-preview">
            {catches.map((c) => (
              <div key={c.id} className="private-spot-summary-row">
                <div className="spot-dot"></div>
                <div className="spot-details">
                  <span className="spot-sp">{c.speciesName} ({c.weightLb} lb)</span>
                  <span className="spot-coords">
                    Lat: {c.lat.toFixed(4)}, Lon: {c.lon.toFixed(4)} — {c.zoneName}
                  </span>
                </div>
                <span className="spot-score-pill">Score {c.environmentalSnapshot.scoreCalculated}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
