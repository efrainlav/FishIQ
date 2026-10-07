// FISHIQ Types Specification (Brief v1.0)

export type FishingModality = 'Trolling' | 'Jigging' | 'Spinning / Casting' | 'Fondo (Bottom)' | 'Mosca (Fly)';

export type ScoreTier = 'Baja' | 'Regular' | 'Buena' | 'Muy buena' | 'Excepcional';

export interface EnvironmentalConditions {
  timestamp: string; // ISO string
  sstCelsius: number; // Sea Surface Temp (e.g. 27.5 °C)
  windSpeedKnots: number;
  windDirectionDeg: number;
  windDirectionLabel: string;
  waveHeightM: number;
  wavePeriodSec: number;
  swellHeightM: number;
  pressureHpa: number;
  pressureTrend3h: number; // +/- hPa
  tideHeightM: number;
  tidePhase: 'Subiendo' | 'Bajando' | 'Pleamar' | 'Bajamar';
  tideCurrentKnots: number;
  currentDirectionDeg: number;
  moonPhase: string; // e.g. "Luna Creciente"
  moonIllumination: number; // 0 - 100%
  solarPosition: 'Amanecer' | 'Mañana' | 'Mediodía' | 'Tarde' | 'Atardecer' | 'Noche';
  waterClarity: 'Cristalina' | 'Verdosa' | 'Turbia';
  provider: string; // e.g. "Open-Meteo Marine + NOAA Grid Panama"
}

export interface FactorWeight {
  key: string;
  name: string;
  weight: number; // % (sum to 100)
  description: string;
}

export interface SpeciesPreferences {
  tempOptimalMin: number;
  tempOptimalMax: number;
  depthMinM: number;
  depthMaxM: number;
  preferredTides: string[];
  preferredSun: string[];
  optimalCurrentKnotsMin: number;
  optimalCurrentKnotsMax: number;
  maxToleratedWindKnots: number;
  seasonPeakMonths: number[]; // 1-12
  recommendedLures: string[];
  recommendedTechniques: FishingModality[];
}

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Pelágico' | 'Costero / Estuario' | 'Arrecife / Fondo';
  avatarEmoji: string;
  description: string;
  depthRangeText: string;
  seasonText: string;
  preferences: SpeciesPreferences;
  weights: {
    tide: number;
    solar: number;
    current: number;
    sst: number;
    wind: number;
    pressure: number;
    wave: number;
    moon: number;
    season: number;
  };
}

export interface FactorSubscore {
  key: string;
  label: string;
  weight: number;
  subscore: number; // 0 - 100
  weightedScore: number;
  status: 'favorable' | 'neutral' | 'unfavorable';
  explanation: string;
}

export interface HourlyScore {
  timeLabel: string; // e.g. "06:00"
  fullTimestamp: string;
  score: number; // 0 - 100
  tier: ScoreTier;
  subscores: FactorSubscore[];
  topPositiveFactors: string[];
  topNegativeFactors: string[];
  conditions: EnvironmentalConditions;
  algorithmVersion: string;
}

export interface Zone {
  id: string;
  name: string;
  region: 'Pacífico' | 'Caribe' | 'Lago';
  lat: number;
  lon: number;
  zoom: number;
  depthAvgM: number;
  description: string;
  spotsCount: number;
}

export interface Spot {
  id: string;
  name: string;
  zoneId: string;
  lat: number;
  lon: number;
  depthM: number;
  isPrivate: boolean;
  notes?: string;
  targetSpecies: string[];
  createdAt: string;
}

export interface CatchRecord {
  id: string;
  speciesId: string;
  speciesName: string;
  caughtAt: string;
  weightLb: number;
  lengthCm: number;
  technique: FishingModality;
  lureUsed: string;
  zoneName: string;
  lat: number;
  lon: number;
  isPrivate: boolean;
  notes: string;
  photoUrl?: string;
  environmentalSnapshot: {
    sstCelsius: number;
    tidePhase: string;
    tideHeightM: number;
    windSpeedKnots: number;
    waveHeightM: number;
    pressureHpa: number;
    moonPhase: string;
    scoreCalculated: number;
    provider: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  chips?: string[];
  structuredData?: {
    speciesName?: string;
    recommendedTime?: string;
    score?: number;
    bestLure?: string;
    warning?: string;
  };
}

export interface UserProfile {
  name: string;
  experience: 'Novato' | 'Aficionado' | 'Capitán / Guía';
  preferredModality: FishingModality;
  preferredUnits: 'Metric' | 'Imperial';
  privateSpotsDefault: boolean;
  activePlan: 'Plan Piloto Panamá (Pro)';
}
