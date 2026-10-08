import React, { useEffect, useRef, useState } from 'react';
import { Zone, Spot, Species } from '../../types';
import L from 'leaflet';
import {
  Search,
  ChevronDown,
  Navigation,
  Layers,
  Waves,
  Crosshair,
  Ruler,
  Compass,
  Plus,
  Minus,
  ArrowLeft,
  Signal,
  Wifi,
  BatteryMedium,
} from 'lucide-react';

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
  onNavigateBack?: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  currentZone,
  allZones,
  onSelectZone,
  userSpots,
  selectedSpecies,
  onNavigateToForecast,
  onNavigateBack,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [activeLayer, setActiveLayer] = useState<'map' | 'satellite' | 'bathymetry'>('satellite');
  const [searchQuery, setSearchQuery] = useState('');

  // Hotspots matching the official mockups with colored pins
  const hotspots = [
    {
      id: 'h1',
      name: 'Bayano',
      fullName: 'Lago Bayano & Cañita',
      lat: 9.172,
      lon: -78.885,
      score: 87,
      depth: 14,
      color: '#ef4444',
      badgeClass: 'pin-red',
    },
    {
      id: 'h2',
      name: 'Bahía de Panamá',
      fullName: 'Bahía de Panamá (Canal)',
      lat: 8.805,
      lon: -79.54,
      score: 88,
      depth: 25,
      color: '#f59e0b',
      badgeClass: 'pin-amber',
    },
    {
      id: 'h3',
      name: 'Manglares Chepo',
      fullName: 'Manglares de Chepo',
      lat: 8.98,
      lon: -79.15,
      score: 79,
      depth: 8,
      color: '#10b981',
      badgeClass: 'pin-green',
    },
    {
      id: 'h4',
      name: 'Bajo San José',
      fullName: 'Archipiélago de las Perlas',
      lat: 8.275,
      lon: -79.11,
      score: 89,
      depth: 62,
      color: '#0284c7',
      badgeClass: 'pin-blue',
    },
    {
      id: 'h5',
      name: 'Los Frailes',
      fullName: 'Pedasí & Los Frailes',
      lat: 7.345,
      lon: -79.998,
      score: 92,
      depth: 85,
      color: '#06b6d4',
      badgeClass: 'pin-cyan',
    },
  ];

  // Initialize and update map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentZone.lat, currentZone.lon],
        zoom: currentZone.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Esri Satellite World Imagery
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      );

      // Esri Ocean / Bathymetry Base
      const oceanLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      );

      // OpenStreetMap Standard Map
      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19 }
      );

      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      if (activeLayer === 'satellite') satLayer.addTo(map);
      else if (activeLayer === 'bathymetry') oceanLayer.addTo(map);
      else streetLayer.addTo(map);

      mapInstanceRef.current = map;
    } else {
      const map = mapInstanceRef.current;
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      // Esri Satellite World Imagery
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      );
      // Esri Ocean / Bathymetry Base
      const oceanLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      );
      // OpenStreetMap Standard Map
      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19 }
      );

      if (activeLayer === 'satellite') satLayer.addTo(map);
      else if (activeLayer === 'bathymetry') oceanLayer.addTo(map);
      else streetLayer.addTo(map);

      map.setView([currentZone.lat, currentZone.lon], currentZone.zoom);
    }

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [currentZone, activeLayer]);

  // Markers & Bathymetric Contours
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layerGroup = L.layerGroup();

    // 1. Simulated Bathymetric Depth Contours (Teal & Luminous Cyan Lines)
    const bathymetryCurves = [
      { coords: [[9.25, -79.8], [9.1, -79.6], [8.95, -79.4], [8.85, -79.1], [8.92, -78.7]], color: '#22d3ee', depth: '10m' },
      { coords: [[9.15, -79.85], [8.98, -79.62], [8.82, -79.38], [8.72, -79.08], [8.8, -78.65]], color: '#00d2ff', depth: '25m' },
      { coords: [[9.05, -79.9], [8.85, -79.65], [8.65, -79.35], [8.55, -79.0], [8.65, -78.6]], color: '#0284c7', depth: '50m' },
      { coords: [[8.9, -79.95], [8.7, -79.7], [8.48, -79.3], [8.38, -78.9], [8.5, -78.5]], color: '#1e3a8a', depth: '100m' },
    ];

    bathymetryCurves.forEach((curve) => {
      L.polyline(curve.coords as L.LatLngExpression[], {
        color: curve.color,
        weight: 1.8,
        opacity: 0.75,
        dashArray: '4, 4',
      }).addTo(layerGroup);
    });

    // 2. Colored Hotspot Badges with Fish Icon (Phone 2 Mockup Style)
    hotspots.forEach((hs) => {
      const isBayano = hs.id === 'h1';
      const iconHtml = `
        <div class="mockup-pin-badge ${hs.badgeClass} ${isBayano ? 'active-pulse' : ''}">
          <svg viewBox="0 0 24 24" class="pin-fish-icon" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93c-2.83.48-5.33-1.42-5.93-4.25-.38-1.78.33-3.48 1.63-4.54 1.1-.9 2.59-1.25 4.3-.87 1.25.28 2.22 1.05 2.76 2.08l-2.02.94c-.28-.53-.78-.92-1.41-1.06-.9-.2-1.76.01-2.35.5-.66.54-1.02 1.4-1 2.3.03.95.53 1.8 1.34 2.15.8.35 1.76.22 2.45-.33l1.88 1.08c-.75.8-1.75 1.28-2.9 1.45z"/>
          </svg>
          ${isBayano ? '<div class="active-location-teardrop">📍</div>' : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-mockup-pin-wrapper',
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([hs.lat, hs.lon], { icon: customIcon });
      marker.bindPopup(`
        <div class="map-popup-card">
          <h4>⚡ ${hs.fullName}</h4>
          <div class="popup-score-tag">Fishing Score: ${hs.score}/100</div>
          <p><strong>Especie clave:</strong> ${selectedSpecies.commonName}</p>
          <p><strong>Profundidad:</strong> ${hs.depth} m</p>
        </div>
      `);
      layerGroup.addLayer(marker);
    });

    // 3. User Private Spots
    userSpots.forEach((spot) => {
      const iconHtml = `
        <div class="mockup-pin-badge pin-dark">
          <span style="font-size: 13px;">🔒</span>
        </div>
      `;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-mockup-pin-wrapper',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([spot.lat, spot.lon], { icon: customIcon });
      marker.bindPopup(`
        <div class="map-popup-card">
          <h4>🔒 ${spot.name}</h4>
          <p><strong>Profundidad:</strong> ${spot.depthM} m</p>
          <p>Spot secreto privado</p>
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
    <div className="mockup-map-screen-fullscreen">
      {/* 1. STATUS BAR (9:41, Signal, Wifi, Battery) */}
      <div className="clean-mobile-status-bar map-status-bar">
        <span className="status-clock">9:41</span>
        <div className="status-icons-strip">
          <Signal size={13} className="status-icon" />
          <Wifi size={13} className="status-icon" />
          <BatteryMedium size={16} className="status-icon" />
        </div>
      </div>

      {/* 2. TOP FLOATING HEADER (Back arrow + Title + Dropdown, Search, Layer Pills) */}
      <div className="map-mockup-floating-header">
        {/* Title row */}
        <div className="map-header-title-row">
          <button
            className="map-back-nav-btn"
            onClick={onNavigateBack || onNavigateToForecast}
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="map-title-zone-trigger">
            <span className="map-page-title">Mapa de pesca</span>
            <ChevronDown size={18} className="map-title-chevron" />
            <select
              className="map-zone-hidden-select"
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
        </div>

        {/* Search input bar (White pill matching mockup) */}
        <div className="map-search-white-pill">
          <Search size={18} className="search-icon-gray" />
          <input
            type="text"
            placeholder="Buscar zona, especie o lugar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="map-search-white-input"
          />
        </div>

        {/* Layer selector pills: Mapa (solid blue active), Satélite, Batimetría */}
        <div className="map-layer-pills-row">
          <button
            className={`map-layer-pill ${activeLayer === 'map' ? 'active' : ''}`}
            onClick={() => setActiveLayer('map')}
          >
            🗺️ Mapa
          </button>
          <button
            className={`map-layer-pill ${activeLayer === 'satellite' ? 'active' : ''}`}
            onClick={() => setActiveLayer('satellite')}
          >
            🛰️ Satélite
          </button>
          <button
            className={`map-layer-pill ${activeLayer === 'bathymetry' ? 'active' : ''}`}
            onClick={() => setActiveLayer('bathymetry')}
          >
            🌊 Batimetría
          </button>
        </div>
      </div>

      {/* 3. FULL-HEIGHT LEAFLET MAP CANVAS */}
      <div id="fishiq-map-container" ref={mapContainerRef} className="mockup-leaflet-full-canvas" />

      {/* 4. FLOATING ACTION TOOLS ON RIGHT EDGE */}
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
        <button
          className="tool-circle-btn"
          onClick={() => setActiveLayer('bathymetry')}
          title="Curvas Batimétricas"
        >
          <Waves size={18} />
        </button>
        <button className="tool-circle-btn" title="Área de pesca">
          <Crosshair size={18} />
        </button>
        <button className="tool-circle-btn" title="Medir distancia">
          <Ruler size={18} />
        </button>
        <button className="tool-circle-btn" onClick={handleRecenter} title="Centrar">
          <Compass size={18} />
        </button>
        <button className="tool-circle-btn zoom-btn" onClick={() => handleZoom(1)} title="Acercar">
          <Plus size={18} />
        </button>
        <button className="tool-circle-btn zoom-btn" onClick={() => handleZoom(-1)} title="Alejar">
          <Minus size={18} />
        </button>
      </div>

      {/* 5. FLOATING BOTTOM SPOT CARD (Bayano - Phone 2 Style) */}
      <div className="map-floating-bottom-card" onClick={onNavigateToForecast}>
        <div className="card-thumb-wrap">
          <img
            src="/images/bayano_spot.jpg"
            alt="Lago Bayano"
            className="card-thumb-img"
          />
        </div>

        <div className="card-info-col">
          <div className="card-zone-title">
            <span>Bayano</span>
            <ChevronDown size={15} />
          </div>
          <div className="card-sp-subtitle">
            <span className="sp-dot-amber" />
            <span>{selectedSpecies.commonName}</span>
          </div>
          <div className="card-activity-meta">
            <span className="text-emerald-bright font-bold">Excelente actividad</span>
            <span className="dot-sep">•</span>
            <span>6:10 – 8:40 a.m.</span>
          </div>
        </div>

        {/* Bright lime green score pill badge (matching mockup) */}
        <div className="card-score-pill-neon">
          <span className="score-val-big">87</span>
        </div>
      </div>
    </div>
  );
};
