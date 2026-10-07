import React, { useState } from 'react';
import { CatchRecord, Species } from '../../types';
import { Plus, ChevronRight, BarChart3, MapPin, Scale, Ruler, Compass } from 'lucide-react';

interface LogbookScreenProps {
  catches: CatchRecord[];
  allSpecies: Species[];
  onOpenLogModal: () => void;
}

export const LogbookScreen: React.FC<LogbookScreenProps> = ({
  catches,
  allSpecies,
  onOpenLogModal,
}) => {
  const [activeTab, setActiveTab] = useState<'capturas' | 'estadisticas'>('capturas');

  return (
    <div className="screen-content mockup-logbook-screen">
      {/* 1. MOCKUP TOP HEADER (Phone 5 Style) */}
      <div className="logbook-mockup-header">
        <h2 className="logbook-page-title">Diario de capturas</h2>
        <button className="add-catch-circle-blue-btn" onClick={onOpenLogModal} title="Registrar Captura">
          <Plus size={20} />
        </button>
      </div>

      {/* 2. TAB PILLS (Mis capturas / Estadísticas) */}
      <div className="logbook-mockup-tabs">
        <button
          className={`log-tab-btn ${activeTab === 'capturas' ? 'active' : ''}`}
          onClick={() => setActiveTab('capturas')}
        >
          Mis capturas
        </button>
        <button
          className={`log-tab-btn ${activeTab === 'estadisticas' ? 'active' : ''}`}
          onClick={() => setActiveTab('estadisticas')}
        >
          Estadísticas
        </button>
      </div>

      {/* 3. CAPTURAS LIST (Matching Phone 5 Cards) */}
      {activeTab === 'capturas' ? (
        <div className="mockup-catches-list">
          {catches.map((c) => (
            <div key={c.id} className="mockup-catch-card">
              {/* Card Header Row with Map Thumbnail & Meta */}
              <div className="catch-card-top-row">
                <div className="catch-meta-left">
                  <div className="catch-map-mini-thumb">
                    <MapPin size={14} className="text-cyan" />
                  </div>
                  <div className="catch-title-group">
                    <span className="catch-sp-heading">{c.speciesName}</span>
                    <span className="catch-time-place">
                      {new Date(c.caughtAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}{' '}
                      {new Date(c.caughtAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}{' '}
                      {c.zoneName}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted" />
              </div>

              {/* Big Catch Photo */}
              <div className="catch-big-photo-wrap">
                <img src={c.photoUrl} alt={c.speciesName} className="catch-big-photo" />
              </div>

              {/* 3-Column Stats Row (Peso / Longitud / Señuelo) */}
              <div className="catch-stats-3col-bar">
                <div className="stat-col">
                  <span className="stat-lbl">Peso</span>
                  <span className="stat-val">{c.weightLb} lb</span>
                </div>
                <div className="stat-col">
                  <span className="stat-lbl">Longitud</span>
                  <span className="stat-val">{c.lengthCm} cm</span>
                </div>
                <div className="stat-col">
                  <span className="stat-lbl">Señuelo</span>
                  <span className="stat-val">{c.lureUsed}</span>
                </div>
              </div>

              {/* Angler Note */}
              {c.notes && (
                <div className="catch-note-footer">
                  <p>{c.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Estadísticas Tab */
        <div className="stats-tab-content">
          <div className="stat-metric-card">
            <span className="stat-title">Total de Capturas</span>
            <span className="stat-number">{catches.length} piezas</span>
          </div>
          <div className="stat-metric-card">
            <span className="stat-title">Especie Más Frecuente</span>
            <span className="stat-number">Robalo (50%)</span>
          </div>
          <div className="stat-metric-card">
            <span className="stat-title">Mayor Peso Registrado</span>
            <span className="stat-number">48.5 lb (Atún)</span>
          </div>
        </div>
      )}
    </div>
  );
};
