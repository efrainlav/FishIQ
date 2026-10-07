import React, { useEffect, useRef, useState } from 'react';
import { Zone, Spot, Species } from '../../types';
import L from 'leaflet';
import { Search, ChevronDown, Navigation, Layers, Bookmark, Plus, Minus, ArrowLeft } from 'lucide-react';

interface MapScreenProps {
  currentZone: Zone;
  allZones: Zone[];
  onSelectZone: (zone: Zone) => void;
  userSpots: Spot[];
  onAddSpot: (spot: Spot) => void;
  selectedSpecies: Species;
  allSpecies: Species[];
  onSelectSpecies: (species: Species) => void;
  onNavigateToForecast: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  currentZone,
  allZones,
  onSelectZone,
  userSpots,
  onAddSpot,
  selectedSpecies,
  allSpecies,
  onSelectSpecies,
  onNavigateToForecast,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [activeLayer, setActiveLayer] = useState<'map' | 'satellite' | 'bathymetry'>('map');
  const [searchQuery, setSearchQuery] = useState('');

  // Hotspots matching Phone 2
  const hotspots = [
    { id: 'h1', name: 'Lago Bayano', lat: 9.172, lon: -78.885, score: 87, depth: 14, species: 'robalo', color: '#ef4444' },
    { id: 'h2', name: 'Bahía de Panamá', lat: 8.805, lon: -79.54, score: 88, depth: 25, species: 'robalo', color: '#0ea5e9' },
    { id: 'h3', name: 'Manglares de Chepo', lat: 8.98, lon: -79.15, score: 79, depth: 8, species: 'robalo', color: '#eab308' },
    { id: 'h4', name: 'Punta Chame', lat: 8.68, lon: -79.72, score: 84, depth: 16, species: 'jurel', color: '#10b981' },
    { id: 'h5', name: 'Bajo San José (Perlas)', lat: 8.275, lon: -79.11, score: 89, depth: 62, species: 'atun', color: '#3b82f6' },
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentZone.lat, currentZone.lon],
        zoom: currentZone.zoom,
        zoomControl: false,
      });

      // Ocean / Street / Satellite tile providers
      const oceanLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Esri Ocean, GEBCO' }
      );

      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Esri Satellite' }
      );

      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: 'OpenStreetMap' }
      );

      if (activeLayer === 'satellite') satLayer.addTo(map);
      else if (activeLayer === 'bathymetry') oceanLayer.addTo(map);
      else streetLayer.addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([currentZone.lat, currentZone.lon], currentZone.zoom);
    }
  }, [currentZone, activeLayer]);

  // Spot Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layerGroup = L.layerGroup();

    hotspots.forEach((hs) => {
      const iconHtml = `
        <div class="mockup-pin-wrapper" style="--pin-color: ${hs.color}">
          <div class="pin-drop-circle">
            <span class="pin-fish-icon">🐟</span>
          </div>
          <div class="pin-pulse-wave"></div>
        </div>
      `;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'leaflet-clean-icon',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([hs.lat, hs.lon], { icon: customIcon });
      marker.bindPopup(`
        <div class="clean-map-popup">
          <h4>${hs.name}</h4>
          <div class="popup-score-pill">Fishing Score: <strong>${hs.score}</strong></div>
          <p>Profundidad: ${hs.depth} m • Especie: ${selectedSpecies.commonName}</p>
        </div>
      `);
      layerGroup.addLayer(marker);
    });

    layerGroup.addTo(map);
    return () => {
      map.removeLayer(layerGroup);
    };
  }, [selectedSpecies]);

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentZone.lat, currentZone.lon], currentZone.zoom);
    }
  };

  return (
    <div className="screen-content mockup-map-screen">
      {/* 1. TOP HEADER & SEARCH (Phone 2 Style) */}
      <div className="map-mockup-top-header">
        <div className="map-header-bar">
          <div className="map-header-left">
            <ArrowLeft size={18} className="map-back-arrow" />
            <span className="map-title-text">Mapa de pesca</span>
          </div>

          <div className="zone-select-pill">
            <select
              className="zone-dropdown"
              value={currentZone.id}
              onChange={(e) => {
                const z = allZones.find((item) => item.id === e.target.value);
                if (z) onSelectZone(z);
              }}
            >
              {allZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name.split('&')[0]}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="zone-chevron" />
          </div>
        </div>

        {/* Clean Pure White Search Bar (Phone 2) */}
        <div className="white-search-bar-wrap">
          <Search size={16} className="search-icon-gray" />
          <input
            type="text"
            placeholder="Buscar zona, especie o lugar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="white-search-input"
          />
        </div>

        {/* Layer Pills Row */}
        <div className="map-layer-pills-row">
          <button
            className={`map-pill-btn ${activeLayer === 'map' ? 'active-blue' : ''}`}
            onClick={() => setActiveLayer('map')}
          >
            🗺️ Mapa
          </button>
          <button
            className={`map-pill-btn ${activeLayer === 'satellite' ? 'active-blue' : ''}`}
            onClick={() => setActiveLayer('satellite')}
          >
            Satélite
          </button>
          <button
            className={`map-pill-btn ${activeLayer === 'bathymetry' ? 'active-blue' : ''}`}
            onClick={() => setActiveLayer('bathymetry')}
          >
            Batimetría
          </button>
        </div>
      </div>

      {/* 2. LEAFLET MAP ELEMENT */}
      <div id="fishiq-map-container" ref={mapContainerRef} className="mockup-leaflet-canvas"></div>

      {/* 3. RIGHT FLOATING ACTION BUTTONS */}
      <div className="map-floating-right-tools">
        <button className="tool-circle-btn" onClick={handleRecenter} title="Mi Ubicación GPS">
          <Navigation size={18} />
        </button>
        <button
          className="tool-circle-btn"
          onClick={() => setActiveLayer(activeLayer === 'map' ? 'satellite' : 'map')}
          title="Alternar Capas"
        >
          <Layers size={18} />
        </button>
        <button className="tool-circle-btn" onClick={() => alert('Spot añadido a favoritos')} title="Guardar">
          <Bookmark size={18} />
        </button>
        <button className="tool-circle-btn zoom-btn" onClick={() => handleZoom(1)} title="Acercar">
          <Plus size={18} />
        </button>
        <button className="tool-circle-btn zoom-btn" onClick={() => handleZoom(-1)} title="Alejar">
          <Minus size={18} />
        </button>
      </div>

      {/* 4. FLOATING BOTTOM CARD (Bayano, Robalo, Score 87) */}
      <div className="map-floating-bottom-card" onClick={onNavigateToForecast}>
        <div className="card-thumb-wrap">
          <img
            src="/images/bayano_spot.jpg"
            alt={currentZone.name}
            className="card-thumb-img"
          />
        </div>

        <div className="card-info-col">
          <div className="card-zone-title">
            <span>{currentZone.name.split('&')[0]}</span>
            <ChevronDown size={14} className="text-muted" />
          </div>
          <div className="card-sp-subtitle">
            <span className="sp-yellow-dot">🟡</span>
            <span>{selectedSpecies.commonName}</span>
          </div>
          <div className="card-activity-meta">
            <span className="text-green-bright">Excelente actividad</span>
            <span className="dot-sep">•</span>
            <span className="text-white">6:10 – 8:40 a.m.</span>
          </div>
        </div>

        <div className="card-score-box-green">
          <span className="score-num-bold">87</span>
        </div>
      </div>
    </div>
  );
};
