import React, { useState } from 'react';
import { Species, Zone, CatchRecord, EnvironmentalConditions, FishingModality } from '../../types';
import { Camera, MapPin, X, Check, Lock, ShieldCheck, Thermometer, Waves, Wind, Anchor } from 'lucide-react';

interface LogCatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCatch: (catchRecord: CatchRecord) => void;
  allSpecies: Species[];
  currentZone: Zone;
  currentConditions: EnvironmentalConditions;
  currentScore: number;
}

export const LogCatchModal: React.FC<LogCatchModalProps> = ({
  isOpen,
  onClose,
  onSaveCatch,
  allSpecies,
  currentZone,
  currentConditions,
  currentScore,
}) => {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(allSpecies[0]?.id || 'atun');
  const [weightLb, setWeightLb] = useState('');
  const [lengthCm, setLengthCm] = useState('');
  const [technique, setTechnique] = useState<FishingModality>('Spinning / Casting');
  const [lureUsed, setLureUsed] = useState('');
  const [notes, setNotes] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
  );

  if (!isOpen) return null;

  const selectedSpecies = allSpecies.find((s) => s.id === selectedSpeciesId) || allSpecies[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: CatchRecord = {
      id: 'catch-' + Date.now(),
      speciesId: selectedSpecies.id,
      speciesName: selectedSpecies.commonName,
      caughtAt: new Date().toISOString(),
      weightLb: parseFloat(weightLb) || 12.5,
      lengthCm: parseFloat(lengthCm) || 65,
      technique,
      lureUsed: lureUsed || selectedSpecies.preferences.recommendedLures[0] || 'Señuelo artesanal',
      zoneName: currentZone.name,
      lat: currentZone.lat,
      lon: currentZone.lon,
      isPrivate,
      notes: notes || 'Captura registrada con FISHIQ Móvil',
      photoUrl,
      // Immutable snapshot attached at this exact moment
      environmentalSnapshot: {
        sstCelsius: currentConditions.sstCelsius,
        tidePhase: currentConditions.tidePhase,
        tideHeightM: currentConditions.tideHeightM,
        windSpeedKnots: currentConditions.windSpeedKnots,
        waveHeightM: currentConditions.waveHeightM,
        pressureHpa: currentConditions.pressureHpa,
        moonPhase: currentConditions.moonPhase,
        scoreCalculated: currentScore,
        provider: currentConditions.provider,
      },
    };

    onSaveCatch(newRecord);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-sheet log-catch-sheet">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Camera size={20} className="modal-title-icon" />
            <div>
              <h3>Registrar Captura</h3>
              <p className="modal-subtitle">Snapshot ambiental adjuntado automáticamente</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="log-catch-form">
          {/* Photo Uploader */}
          <div className="photo-upload-zone">
            {photoUrl ? (
              <div className="photo-preview-wrap">
                <img src={photoUrl} alt="Vista previa" className="photo-preview-img" />
                <label className="change-photo-btn">
                  <Camera size={16} /> Cambiar Foto
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              </div>
            ) : (
              <label className="photo-placeholder-box">
                <Camera size={32} />
                <span>Tomar foto o subir de galería</span>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Species Selector */}
          <div className="form-group">
            <label className="form-label">Especie Capturada</label>
            <select
              value={selectedSpeciesId}
              onChange={(e) => setSelectedSpeciesId(e.target.value)}
              className="form-input"
            >
              {allSpecies.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.avatarEmoji} {sp.commonName} ({sp.scientificName})
                </option>
              ))}
            </select>
          </div>

          {/* Weight and Length Row */}
          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">Peso (libras / lb)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Ej. 24.5"
                value={weightLb}
                onChange={(e) => setWeightLb(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Talla (cm)</label>
              <input
                type="number"
                step="1"
                placeholder="Ej. 78"
                value={lengthCm}
                onChange={(e) => setLengthCm(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Technique and Lure */}
          <div className="form-group">
            <label className="form-label">Modalidad / Técnica</label>
            <select
              value={technique}
              onChange={(e) => setTechnique(e.target.value as FishingModality)}
              className="form-input"
            >
              <option value="Spinning / Casting">Spinning / Casting</option>
              <option value="Trolling">Trolling (Curricán)</option>
              <option value="Jigging">Jigging / Slow Pitch</option>
              <option value="Fondo (Bottom)">Fondo (Bottom)</option>
              <option value="Mosca (Fly)">Mosca (Fly Fishing)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Señuelo o Carnada Usada</label>
            <input
              type="text"
              placeholder={`Sugerido: ${selectedSpecies.preferences.recommendedLures[0] || 'Popper / Jig'}`}
              value={lureUsed}
              onChange={(e) => setLureUsed(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Immutable Environmental Snapshot Callout (Brief Section 8) */}
          <div className="snapshot-preview-card">
            <div className="snapshot-card-title">
              <ShieldCheck size={16} className="text-emerald" /> Snapshot Ambiental Guardado Automáticamente
            </div>
            <div className="snapshot-grid-items">
              <div className="snap-pill">
                <Thermometer size={14} /> Agua: <strong>{currentConditions.sstCelsius}°C</strong>
              </div>
              <div className="snap-pill">
                <Anchor size={14} /> Marea: <strong>{currentConditions.tidePhase} ({currentConditions.tideHeightM}m)</strong>
              </div>
              <div className="snap-pill">
                <Wind size={14} /> Viento: <strong>{currentConditions.windSpeedKnots} kts</strong>
              </div>
              <div className="snap-pill">
                <Waves size={14} /> Oleaje: <strong>{currentConditions.waveHeightM}m</strong>
              </div>
              <div className="snap-pill highlight">
                <span>FISHIQ Score: <strong>{currentScore}/100</strong></span>
              </div>
            </div>
            <div className="gps-auto-tag">
              <MapPin size={13} /> GPS fijado en: {currentZone.name} ({currentZone.lat.toFixed(3)}, {currentZone.lon.toFixed(3)})
            </div>
          </div>

          {/* Privacy Switch */}
          <div className="privacy-toggle-row">
            <div className="privacy-label-group">
              <span className="privacy-title"><Lock size={15} /> Spot Privado (Recomendado)</span>
              <span className="privacy-hint">Solo tú podrás ver este punto en el mapa. Coordenadas encriptadas.</span>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notas de la Jornada</label>
            <textarea
              placeholder="Detalles de la pelea, estructura o actividad de aves..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="form-textarea"
            />
          </div>

          {/* Submit CTA */}
          <button type="submit" className="save-catch-submit-btn">
            <Check size={18} /> Guardar en Mi Diario de Capturas
          </button>
        </form>
      </div>
    </div>
  );
};
