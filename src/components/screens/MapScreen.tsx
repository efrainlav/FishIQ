import React, { useEffect, useRef, useState } from 'react';
import { Zone, Spot, Species } from '../../types';
import L from 'leaflet';
import { Search, ChevronDown, Navigation, Layers, Heart, Plus, Minus, Lock, Sparkles, MapPin } from 'lucide-react';

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

  const [activeLayer, setActiveLayer] = useState<'map' | 'satellite' | 'bathymetry'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingSpot, setIsAddingSpot] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');

  // Hotspots for current species matching the mockups
  const hotspots = [
    { id: 'h1', name: 'Lago Bayano (Sector Este)', lat: 9.172, lon: -78.885, score: 87, depth: 14, species: 'robalo', zone: 'bayano' },
    { id: 'h2', name: 'Bahía de Panamá (Canal)', lat: 8.805, lon: -79.54, score: 88, depth: 25, species: 'robalo', zone: 'panama-bay' },
    { id: 'h3', name: 'Manglares de Chepo', lat: 8.98, lon: -79.15, score: 79, depth: 8, species: 'robalo', zone: 'panama-bay' },
    { id: 'h4', name: 'Bajo San José (Perlas)', lat: 8.275, lon: -79.11, score: 89, depth: 62, species: 'atun', zone: 'las-perlas' },
    { id: 'h5', name: 'Los Frailes (Pedasí)', lat: 7.345, lon: -79.998, score: 92, depth: 85, species: 'dorado', zone: 'pedasi-azuero' },
  ];

  // Initialize and update map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentZone.lat, currentZone.lon],
        zoom: currentZone.zoom,
        zoomControl: false,
      });

      // Satellite Imagery Tile Layer (Esri World Imagery)
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Esri Satellite' }
      );

      // Ocean Base Tile Layer
      const oceanLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Esri Ocean, GEBCO' }
      );

      // Street/Standard Map Layer
      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: 'OpenStreetMap' }
      );

      // Attach active tile layer
      if (activeLayer === 'satellite') satLayer.addTo(map);
      else if (activeLayer === 'bathymetry') oceanLayer.addTo(map);
      else streetLayer.addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([currentZone.lat, currentZone.lon], currentZone.zoom);
    }
  }, [currentZone, activeLayer]);

  // Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layerGroup = L.layerGroup();

    // Hotspot markers
    hotspots.forEach((hs) => {
      const iconHtml = `
        <div class="mockup-map-pin hotspot-pin">
          <div class="hotspot-outer-ring"></div>
          <div class="hotspot-center-dot"></div>
          <span class="hotspot-badge-lbl">${hs.score}</span>
        </div>
      `;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-div-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([hs.lat, hs.lon], { icon: customIcon });
      marker.bindPopup(`
        <div class="map-popup-card">
          <h4>⚡ ${hs.name}</h4>
          <div class="popup-score-tag">Fishing Score: ${hs.score}/100</div>
          <p><strong>Especie:</strong> ${selectedSpecies.commonName}</p>
          <p><strong>Fondo:</strong> ${hs.depth}m</p>
        </div>
      `);
      layerGroup.addLayer(marker);
    });

    // User Private Spots
    userSpots.forEach((spot) => {
      const iconHtml = `
        <div class="mockup-map-pin private-pin">
          <div class="private-center-dot">🔒</div>
        </div>
      `;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([spot.lat, spot.lon], { icon: customIcon });
      marker.bindPopup(`
        <div class="map-popup-card">
          <h4>🔒 ${spot.name}</h4>
          <p><strong>Profundidad:</strong> ${spot.depthM} m</p>
          <p><strong>Privacidad:</strong> Punto secreto de usuario</p>
        </div>
      `);
      layerGroup.addLayer(marker);
    });

    layerGroup.addTo(map);
    return () => {
      map.removeLayer(layerGroup);
    };
  }, [selectedSpecies, userSpots]);

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
      {/* 1. MOCKUP TOP BAR & SEARCH (Phone 2 Style) */}
      <div className="map-mockup-top-header">
        <div className="map-title-row">
          <h2 className="map-page-title">Mapa de pesca</h2>
          <select
            className="zone-header-dropdown"
            value={currentZone.id}
            onChange={(e) => {
              const z = allZones.find((item) => item.id === e.target.value);
              if (z) onSelectZone(z);
            }}
          >
            {allZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input Bar */}
        <div className="map-search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar zona, especie o lugar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="map-search-input"
          />
        </div>

        {/* Layer Filter Pills */}
        <div className="map-layer-pills-row">
          <button
            className={`map-pill-btn ${activeLayer === 'map' ? 'active' : ''}`}
            onClick={() => setActiveLayer('map')}
          >
            🗺️ Mapa
          </button>
          <button
            className={`map-pill-btn ${activeLayer === 'satellite' ? 'active' : ''}`}
            onClick={() => setActiveLayer('satellite')}
          >
            🛰️ Satélite
          </button>
          <button
            className={`map-pill-btn ${activeLayer === 'bathymetry' ? 'active' : ''}`}
            onClick={() => setActiveLayer('bathymetry')}
          >
            🌊 Batimetría
          </button>
        </div>
      </div>

      {/* 2. LEAFLET MAP ELEMENT */}
      <div id="fishiq-map-container" ref={mapContainerRef} className="mockup-leaflet-canvas"></div>

      {/* 3. FLOATING RIGHT CONTROL BUTTONS */}
      <div className="map-floating-right-tools">
        <button className="tool-circle-btn" onClick={handleRecenter} title="Mi Ubicación GPS">
          <Navigation size={18} />
        </button>
        <button
          className="tool-circle-btn"
          onClick={() => setActiveLayer(activeLayer === 'satellite' ? 'bathymetry' : 'satellite')}
          title="Alternar Capas"
        >
          <Layers size={18} />
        </button>
        <button className="tool-circle-btn" onClick={() => setIsAddingSpot(true)} title="Guardar Spot">
          <Heart size={18} />
        </button>
        <button className="tool-circle-btn zoom-btn" onClick={() => handleZoom(1)} title="Acercar">
          <Plus size={18} />
        </button>
        <button className="tool-circle-btn zoom-btn" onClick={() => handleZoom(-1)} title="Alejar">
          <Minus size={18} />
        </button>
      </div>

      {/* 4. FLOATING BOTTOM CARD (Matching Phone 2 in Mockup) */}
      <div className="map-floating-bottom-card" onClick={onNavigateToForecast}>
        <div className="card-thumb-wrap">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80"
            alt={currentZone.name}
            className="card-thumb-img"
          />
        </div>

        <div className="card-info-col">
          <div className="card-zone-title">
            <span>{currentZone.name.split('&')[0]}</span>
            <ChevronDown size={14} />
          </div>
          <div className="card-sp-subtitle">
            <span>{selectedSpecies.avatarEmoji} {selectedSpecies.commonName}</span>
          </div>
          <div className="card-activity-meta">
            <span className="text-emerald font-bold">Excelente actividad</span>
            <span className="dot-sep">•</span>
            <span>6:10 – 8:40 a.m.</span>
          </div>
        </div>

        <div className="card-score-circle-green">
          <span className="score-val">87</span>
        </div>
      </div>
    </div>
  );
};
