import React, { useEffect, useRef, useState } from 'react';
import { Zone, Spot, Species } from '../../types';
import L from 'leaflet';
import { Layers, MapPin, Plus, Lock, Eye, Waves, Sparkles, Navigation } from 'lucide-react';

interface MapScreenProps {
  currentZone: Zone;
  allZones: Zone[];
  onSelectZone: (zone: Zone) => void;
  userSpots: Spot[];
  onAddSpot: (spot: Spot) => void;
  selectedSpecies: Species;
  allSpecies: Species[];
  onSelectSpecies: (species: Species) => void;
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
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [showBathymetry, setShowBathymetry] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showPrivateSpots, setShowPrivateSpots] = useState(true);
  const [isAddingSpot, setIsAddingSpot] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotDepth, setNewSpotDepth] = useState('35');

  // Simulated Hotspots in Panama for current species
  const hotspots = [
    { id: 'h1', name: 'Drop-off Contadora (Perlas)', lat: 8.61, lon: -79.02, score: 89, depth: 55, species: 'atun' },
    { id: 'h2', name: 'Canal de Taboga Este', lat: 8.795, lon: -79.54, score: 84, depth: 22, species: 'jurel' },
    { id: 'h3', name: 'Canto Los Frailes Sur', lat: 7.33, lon: -80.01, score: 92, depth: 95, species: 'dorado' },
    { id: 'h4', name: 'Boca Río Pacora', lat: 8.99, lon: -79.28, score: 86, depth: 6, species: 'robalo' },
    { id: 'h5', name: 'Banco Hannibal Central', lat: 7.38, lon: -81.79, score: 95, depth: 140, species: 'atun' },
  ];

  // Initialize and update map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map
      const map = L.map(mapContainerRef.current, {
        center: [currentZone.lat, currentZone.lon],
        zoom: currentZone.zoom,
        zoomControl: false,
      });

      // Esri Ocean Basemap (crisp, professional nautical and bathymetric styling)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri, GEBCO, NOAA, National Geographic',
          maxZoom: 14,
        }
      ).addTo(map);

      // Add ocean reference labels
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 14,
        }
      ).addTo(map);

      // Zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([currentZone.lat, currentZone.lon], currentZone.zoom);
    }
  }, [currentZone]);

  // Render markers and layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Layer group for dynamic items
    const markersLayer = L.layerGroup();

    // 1. Private User Spots
    if (showPrivateSpots) {
      userSpots.forEach((spot) => {
        const iconHtml = `
          <div class="custom-map-pin private-pin">
            <span class="pin-symbol">🔒</span>
            <span class="pin-label">${spot.name} (${spot.depthM}m)</span>
          </div>
        `;
        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-div-icon',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        const marker = L.marker([spot.lat, spot.lon], { icon: customIcon });
        marker.bindPopup(`
          <div class="map-popup-card">
            <h4>🔒 ${spot.name}</h4>
            <p><strong>Profundidad:</strong> ${spot.depthM} metros</p>
            <p><strong>Privacidad:</strong> Exclusivo del usuario (privado)</p>
            <p class="popup-note">${spot.notes || 'Sin notas'}</p>
          </div>
        `);
        markersLayer.addLayer(marker);
      });
    }

    // 2. Hotspots for selected species
    if (showHotspots) {
      hotspots.forEach((hs) => {
        const isMatched = hs.species === selectedSpecies.id;
        const iconHtml = `
          <div class="custom-map-pin hotspot-pin ${isMatched ? 'pulsing-hot' : 'dimmed'}">
            <span class="pin-score">${hs.score}</span>
            <span class="pin-label">${hs.name}</span>
          </div>
        `;
        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-div-icon',
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        });

        const marker = L.marker([hs.lat, hs.lon], { icon: customIcon });
        marker.bindPopup(`
          <div class="map-popup-card">
            <h4>⚡ Hotspot Calculado</h4>
            <div class="popup-score-tag">FISHIQ Score: ${hs.score}/100</div>
            <p><strong>Lugar:</strong> ${hs.name}</p>
            <p><strong>Estructura / Fondo:</strong> ${hs.depth}m (Batimetría GEBCO)</p>
            <p><strong>Especie recomendada:</strong> ${selectedSpecies.commonName}</p>
          </div>
        `);
        markersLayer.addLayer(marker);
      });
    }

    // 3. Batimetría GEBCO simulated depth contours
    if (showBathymetry) {
      // Circles representing bathymetric drops and seamounts
      const seamounts = [
        { lat: 8.35, lon: -79.05, radius: 9000, label: 'Fosa Las Perlas (120m)' },
        { lat: 7.35, lon: -80.05, radius: 12000, label: 'Plataforma Continental Azuero (200m)' },
        { lat: 7.39, lon: -81.79, radius: 15000, label: 'Bajo Hannibal (Banco oceánico)' },
      ];

      seamounts.forEach((sm) => {
        const circle = L.circle([sm.lat, sm.lon], {
          radius: sm.radius,
          color: '#00e5ff',
          weight: 1.5,
          opacity: 0.6,
          fillColor: '#0077b6',
          fillOpacity: 0.12,
          dashArray: '4, 6',
        });
        circle.bindTooltip(`Curva GEBCO: ${sm.label}`, { sticky: true });
        markersLayer.addLayer(circle);
      });
    }

    markersLayer.addTo(map);

    return () => {
      map.removeLayer(markersLayer);
    };
  }, [showBathymetry, showHotspots, showPrivateSpots, userSpots, selectedSpecies]);

  // Handle click on map to add spot
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isAddingSpot) {
        const newSpot: Spot = {
          id: 'spot-' + Date.now(),
          name: newSpotName || `Punto GPS (${e.latlng.lat.toFixed(3)}, ${e.latlng.lng.toFixed(3)})`,
          zoneId: currentZone.id,
          lat: +e.latlng.lat.toFixed(4),
          lon: +e.latlng.lng.toFixed(4),
          depthM: parseInt(newSpotDepth) || 30,
          isPrivate: true,
          targetSpecies: [selectedSpecies.id],
          notes: `Guardado en ${currentZone.name}`,
          createdAt: new Date().toISOString(),
        };
        onAddSpot(newSpot);
        setIsAddingSpot(false);
        setNewSpotName('');
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isAddingSpot, newSpotName, newSpotDepth, currentZone, selectedSpecies, onAddSpot]);

  return (
    <div className="screen-content map-screen-wrapper">
      {/* Top Map Control Bar */}
      <div className="map-floating-top-bar">
        <div className="map-species-chip">
          <span className="chip-label">Especie:</span>
          <select
            value={selectedSpecies.id}
            onChange={(e) => {
              const sp = allSpecies.find((s) => s.id === e.target.value);
              if (sp) onSelectSpecies(sp);
            }}
            className="map-species-select"
          >
            {allSpecies.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.avatarEmoji} {sp.commonName}
              </option>
            ))}
          </select>
        </div>

        <div className="map-layer-toggles">
          <button
            className={`map-toggle-btn ${showBathymetry ? 'active' : ''}`}
            onClick={() => setShowBathymetry(!showBathymetry)}
            title="Capas de batimetría GEBCO 2026"
          >
            <Waves size={15} /> Batimetría
          </button>
          <button
            className={`map-toggle-btn ${showHotspots ? 'active' : ''}`}
            onClick={() => setShowHotspots(!showHotspots)}
            title="Hotspots calculados por FISHIQ Score"
          >
            <Sparkles size={15} /> Hotspots
          </button>
          <button
            className={`map-toggle-btn ${showPrivateSpots ? 'active' : ''}`}
            onClick={() => setShowPrivateSpots(!showPrivateSpots)}
            title="Spots privados guardados"
          >
            <Lock size={15} /> Mis Spots ({userSpots.length})
          </button>
        </div>
      </div>

      {/* Map Container Element */}
      <div id="fishiq-map-container" ref={mapContainerRef} className="leaflet-map-element"></div>

      {/* Floating Action Button for adding spot */}
      <div className="map-floating-bottom-controls">
        {!isAddingSpot ? (
          <button className="add-spot-fab" onClick={() => setIsAddingSpot(true)}>
            <Plus size={18} /> Marcar Spot Privado
          </button>
        ) : (
          <div className="add-spot-prompt-card">
            <div className="prompt-header">
              <MapPin size={16} /> Toca en el mapa para fijar coordenadas
            </div>
            <div className="prompt-inputs">
              <input
                type="text"
                placeholder="Nombre del spot (ej. Roca Secreta)"
                value={newSpotName}
                onChange={(e) => setNewSpotName(e.target.value)}
                className="spot-input"
              />
              <input
                type="number"
                placeholder="Profundidad (m)"
                value={newSpotDepth}
                onChange={(e) => setNewSpotDepth(e.target.value)}
                className="spot-depth-input"
              />
            </div>
            <div className="prompt-actions">
              <button className="cancel-spot-btn" onClick={() => setIsAddingSpot(false)}>
                Cancelar
              </button>
              <span className="privacy-badge-note">
                <Lock size={12} /> 100% Privado en tu cuenta
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
