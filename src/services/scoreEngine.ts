import { Species, EnvironmentalConditions, HourlyScore, ScoreTier, FactorSubscore } from '../types';

export const SCORE_ENGINE_VERSION = 'v0.1.0-deterministic';

export function classifyScore(score: number): ScoreTier {
  if (score >= 90) return 'Excepcional';
  if (score >= 75) return 'Muy buena';
  if (score >= 60) return 'Buena';
  if (score >= 40) return 'Regular';
  return 'Baja';
}

/**
 * Calculates deterministic subscores (0-100) for each of the 9 environmental factors
 * based on the target species biological preferences and current conditions.
 */
export function calculateFactorSubscores(species: Species, cond: EnvironmentalConditions): FactorSubscore[] {
  const prefs = species.preferences;
  const weights = species.weights;

  // 1. Marea / Movimiento (Tide)
  let tideSubscore = 50;
  if (prefs.preferredTides.includes(cond.tidePhase)) {
    tideSubscore = 92;
  } else if (cond.tidePhase === 'Subiendo' || cond.tidePhase === 'Bajando') {
    tideSubscore = 75; // Moving water is always decent
  } else {
    tideSubscore = 38; // Slack water usually slows down bite
  }
  const tideExplanation = prefs.preferredTides.includes(cond.tidePhase)
    ? `Marea ${cond.tidePhase.toLowerCase()} activa (${cond.tideHeightM}m), alineada con la ventana trófica del ${species.commonName}.`
    : `Marea en fase ${cond.tidePhase.toLowerCase()}; el ${species.commonName} prefiere marea ${prefs.preferredTides.join(' o ')}.`;

  // 2. Hora / Luz (Solar)
  let solarSubscore = 50;
  if (prefs.preferredSun.includes(cond.solarPosition)) {
    solarSubscore = 95;
  } else if (cond.solarPosition === 'Amanecer' || cond.solarPosition === 'Atardecer') {
    solarSubscore = 85;
  } else if (cond.solarPosition === 'Mediodía') {
    solarSubscore = 40;
  } else {
    solarSubscore = 55;
  }
  const solarExplanation = prefs.preferredSun.includes(cond.solarPosition)
    ? `Horario ${cond.solarPosition.toLowerCase()} óptimo para la actividad predatoria de la especie.`
    : `Posición solar (${cond.solarPosition.toLowerCase()}) fuera del pico de actividad habitual.`;

  // 3. Corriente Marina (Current)
  let currentSubscore = 60;
  const curr = cond.tideCurrentKnots;
  if (curr >= prefs.optimalCurrentKnotsMin && curr <= prefs.optimalCurrentKnotsMax) {
    currentSubscore = 95;
  } else if (curr < prefs.optimalCurrentKnotsMin) {
    const diff = prefs.optimalCurrentKnotsMin - curr;
    currentSubscore = Math.max(25, Math.round(95 - diff * 40));
  } else {
    const diff = curr - prefs.optimalCurrentKnotsMax;
    currentSubscore = Math.max(20, Math.round(95 - diff * 35));
  }
  const currentExplanation = curr >= prefs.optimalCurrentKnotsMin && curr <= prefs.optimalCurrentKnotsMax
    ? `Corriente favorable de ${curr} kts dentro del rango ideal (${prefs.optimalCurrentKnotsMin}–${prefs.optimalCurrentKnotsMax} kts).`
    : curr < prefs.optimalCurrentKnotsMin
    ? `Corriente débil (${curr} kts); menor arrastre de carnada.`
    : `Corriente excesiva (${curr} kts); dificulta posicionamiento y troleo.`;

  // 4. Temperatura del Agua (SST)
  let sstSubscore = 50;
  const temp = cond.sstCelsius;
  if (temp >= prefs.tempOptimalMin && temp <= prefs.tempOptimalMax) {
    sstSubscore = 96;
  } else if (temp < prefs.tempOptimalMin) {
    const diff = prefs.tempOptimalMin - temp;
    sstSubscore = Math.max(20, Math.round(96 - diff * 22));
  } else {
    const diff = temp - prefs.tempOptimalMax;
    sstSubscore = Math.max(25, Math.round(96 - diff * 20));
  }
  const sstExplanation = temp >= prefs.tempOptimalMin && temp <= prefs.tempOptimalMax
    ? `Temperatura de agua ${temp}°C ideal para el metabolismo del ${species.commonName} (${prefs.tempOptimalMin}–${prefs.tempOptimalMax}°C).`
    : `Agua a ${temp}°C fuera de la franja térmica preferida (${prefs.tempOptimalMin}–${prefs.tempOptimalMax}°C).`;

  // 5. Viento (Wind)
  let windSubscore = 70;
  const wind = cond.windSpeedKnots;
  if (wind <= 5) {
    windSubscore = 78; // calma chicha
  } else if (wind <= prefs.maxToleratedWindKnots) {
    windSubscore = 90; // brisa rizando superficie = excelente
  } else if (wind <= prefs.maxToleratedWindKnots + 6) {
    windSubscore = 52;
  } else {
    windSubscore = 25; // viento fuerte
  }
  const windExplanation = wind <= prefs.maxToleratedWindKnots && wind >= 6
    ? `Brisa de ${wind} kts (${cond.windDirectionLabel}) oxigena y riza el agua sin dificultar maniobra.`
    : wind > prefs.maxToleratedWindKnots
    ? `Viento de ${wind} kts por encima del límite aconsejado (${prefs.maxToleratedWindKnots} kts).`
    : `Mar en calma (${wind} kts); la carnada y peces pueden mostrarse desconfiados.`;

  // 6. Presión Barométrica (Pressure & Trend)
  let pressureSubscore = 70;
  const pTrend = cond.pressureTrend3h;
  if (Math.abs(pTrend) <= 0.6) {
    pressureSubscore = 88; // Muy estable
  } else if (pTrend > 0.6 && pTrend <= 2.0) {
    pressureSubscore = 92; // Subiendo suave = buen augurio
  } else if (pTrend < -1.5) {
    pressureSubscore = 45; // Caída brusca (frente o tormenta inminente)
  } else {
    pressureSubscore = 65;
  }
  const pressureExplanation = Math.abs(pTrend) <= 0.6
    ? `Barómetro estable en ${cond.pressureHpa} hPa (variación 3h de ${pTrend > 0 ? '+' : ''}${pTrend} hPa).`
    : pTrend < -1.5
    ? `Caída de presión de ${pTrend} hPa en 3h; puede alterar la vejiga natatoria y apetito.`
    : `Presión en aumento (+${pTrend} hPa en 3h), favoreciendo el apetito de peces costeros.`;

  // 7. Oleaje y Swell (Wave)
  let waveSubscore = 80;
  const wave = cond.waveHeightM;
  if (wave <= 0.8) {
    waveSubscore = 92;
  } else if (wave <= 1.5) {
    waveSubscore = 80;
  } else if (wave <= 2.2) {
    waveSubscore = 55;
  } else {
    waveSubscore = 25;
  }
  const waveExplanation = wave <= 1.2
    ? `Ola suave de ${wave}m con periodo de ${cond.wavePeriodSec}s; condiciones de pesca cómodas y seguras.`
    : `Oleaje de ${wave}m; aguas batidas con swell pronunciado.`;

  // 8. Fase Lunar e Iluminación (Moon)
  let moonSubscore = 65;
  const illum = cond.moonIllumination;
  if (illum < 15 || illum > 85) {
    // Luna nueva o luna llena = mareas vivas más fuertes
    moonSubscore = 88;
  } else {
    moonSubscore = 70;
  }
  const moonExplanation = illum < 15 || illum > 85
    ? `${cond.moonPhase} (${illum}% luz): genera corrientes de mareas vivas que concentran peces forrajeros.`
    : `${cond.moonPhase} (${illum}% iluminación): marea muerta intermedia.`;

  // 9. Temporada Regional (Season)
  const currentMonth = new Date(cond.timestamp).getMonth() + 1;
  const isPeakSeason = prefs.seasonPeakMonths.includes(currentMonth);
  const seasonSubscore = isPeakSeason ? 95 : 60;
  const seasonExplanation = isPeakSeason
    ? `Mes ${currentMonth} dentro del pico de temporada anual documentado para Panamá.`
    : `Mes fuera del pico histórico principal, aunque con presencia regular en la zona.`;

  const rawSubscores: { key: string; label: string; weight: number; subscore: number; explanation: string }[] = [
    { key: 'tide', label: 'Marea / Movimiento', weight: weights.tide, subscore: tideSubscore, explanation: tideExplanation },
    { key: 'solar', label: 'Hora / Luz', weight: weights.solar, subscore: solarSubscore, explanation: solarExplanation },
    { key: 'current', label: 'Corriente Marina', weight: weights.current, subscore: currentSubscore, explanation: currentExplanation },
    { key: 'sst', label: 'Temperatura SST', weight: weights.sst, subscore: sstSubscore, explanation: sstExplanation },
    { key: 'wind', label: 'Viento', weight: weights.wind, subscore: windSubscore, explanation: windExplanation },
    { key: 'pressure', label: 'Presión Barométrica', weight: weights.pressure, subscore: pressureSubscore, explanation: pressureExplanation },
    { key: 'wave', label: 'Oleaje / Swell', weight: weights.wave, subscore: waveSubscore, explanation: waveExplanation },
    { key: 'moon', label: 'Fase Lunar', weight: weights.moon, subscore: moonSubscore, explanation: moonExplanation },
    { key: 'season', label: 'Temporada Panamá', weight: weights.season, subscore: seasonSubscore, explanation: seasonExplanation },
  ];

  return rawSubscores.map(item => {
    const weightedScore = (item.subscore * item.weight) / 100;
    let status: 'favorable' | 'neutral' | 'unfavorable' = 'neutral';
    if (item.subscore >= 75) status = 'favorable';
    else if (item.subscore < 55) status = 'unfavorable';

    return {
      key: item.key,
      label: item.label,
      weight: item.weight,
      subscore: item.subscore,
      weightedScore,
      status,
      explanation: item.explanation,
    };
  });
}

/**
 * Calculates the final FISHIQ Score (0-100) and full breakdown
 */
export function calculateFISHIQScore(
  species: Species,
  conditions: EnvironmentalConditions,
  timeLabel: string
): HourlyScore {
  const subscores = calculateFactorSubscores(species, conditions);

  // Sum weights to normalize in case weights don't sum to exactly 100
  const totalWeight = subscores.reduce((sum, s) => sum + s.weight, 0);
  const weightedSum = subscores.reduce((sum, s) => sum + (s.subscore * s.weight), 0);

  const rawScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
  const finalScore = Math.max(0, Math.min(100, rawScore));

  // Determine top positive and negative factors
  const sortedByContribution = [...subscores].sort((a, b) => b.subscore - a.subscore);
  const topPositiveFactors = sortedByContribution
    .filter(s => s.subscore >= 70)
    .slice(0, 3)
    .map(s => `${s.label}: ${s.explanation}`);

  const topNegativeFactors = sortedByContribution
    .reverse()
    .filter(s => s.subscore < 65)
    .slice(0, 3)
    .map(s => `${s.label}: ${s.explanation}`);

  return {
    timeLabel,
    fullTimestamp: conditions.timestamp,
    score: finalScore,
    tier: classifyScore(finalScore),
    subscores,
    topPositiveFactors,
    topNegativeFactors,
    conditions,
    algorithmVersion: SCORE_ENGINE_VERSION,
  };
}
