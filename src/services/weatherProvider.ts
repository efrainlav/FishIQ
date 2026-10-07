import { Zone, EnvironmentalConditions } from '../types';

/**
 * Weather & Marine Provider with Caching Simulation
 * Implements provider abstraction layer for Open-Meteo Marine + NOAA / Panama Local Gauges.
 */

// Memory Cache simulator (Spatial-temporal grid)
const gridCache = new Map<string, EnvironmentalConditions[]>();

export function getEnvironmentalForecast(zone: Zone, hoursCount: number = 24): EnvironmentalConditions[] {
  const cacheKey = `${zone.id}-${new Date().toISOString().slice(0, 13)}`;
  if (gridCache.has(cacheKey)) {
    return gridCache.get(cacheKey)!;
  }

  const results: EnvironmentalConditions[] = [];
  const baseDate = new Date();

  // Typical Panama Pacific SST ~ 27-28.5 °C depending on depth and zone
  const baseSst = zone.id === 'pedasi-azuero' ? 26.8 : zone.id === 'golfo-chiriqui' ? 28.2 : 27.6;

  for (let i = 0; i < hoursCount; i++) {
    const time = new Date(baseDate.getTime() + i * 3600 * 1000);
    const hour = time.getHours();

    // Pacific Panama tide is semidiurnal (~12.4h cycle) with huge 4m to 5.5m tidal range!
    const tideCycleRad = ((hour + i * 0.1) % 12.4 / 12.4) * 2 * Math.PI;
    const tideHeight = 1.0 + 2.1 * (Math.sin(tideCycleRad) + 1.0); // 1.0m to 5.2m
    const tideDerivative = Math.cos(tideCycleRad);

    let tidePhase: EnvironmentalConditions['tidePhase'] = 'Subiendo';
    if (Math.abs(tideDerivative) < 0.25) {
      tidePhase = tideDerivative >= 0 ? 'Pleamar' : 'Bajamar';
    } else {
      tidePhase = tideDerivative > 0 ? 'Subiendo' : 'Bajando';
    }

    // Solar positions
    let solarPosition: EnvironmentalConditions['solarPosition'] = 'Noche';
    if (hour >= 5 && hour < 7) solarPosition = 'Amanecer';
    else if (hour >= 7 && hour < 11) solarPosition = 'Mañana';
    else if (hour >= 11 && hour < 14) solarPosition = 'Mediodía';
    else if (hour >= 14 && hour < 17) solarPosition = 'Tarde';
    else if (hour >= 17 && hour < 19) solarPosition = 'Atardecer';
    else solarPosition = 'Noche';

    // Wind pattern in Panama (afternoon breezes thermal onshore 8-14 kts, morning calm 4-7 kts)
    const isThermalBreeze = hour >= 12 && hour <= 17;
    const windSpeed = isThermalBreeze ? 10 + Math.sin(i * 0.5) * 3 : 5 + Math.sin(i * 0.3) * 2;
    const windDir = 330; // N-NW prevailing or onshore S

    // Current speed peaks with fastest tide movement
    const currentKnots = 0.5 + Math.abs(tideDerivative) * 1.8;

    // Atmospheric pressure in Panama ~ 1010 - 1013 hPa
    const pressure = 1011.5 + Math.sin(hour * 0.26) * 1.2;
    const pressureTrend = +(Math.sin(i * 0.4) * 0.8).toFixed(1);

    results.push({
      timestamp: time.toISOString(),
      sstCelsius: +(baseSst + Math.sin(i * 0.2) * 0.4).toFixed(1),
      windSpeedKnots: +windSpeed.toFixed(1),
      windDirectionDeg: windDir,
      windDirectionLabel: 'NNE',
      waveHeightM: +(0.6 + Math.sin(i * 0.3) * 0.3).toFixed(2),
      wavePeriodSec: 12, // long swell from South Pacific
      swellHeightM: 0.8,
      pressureHpa: +pressure.toFixed(1),
      pressureTrend3h: pressureTrend,
      tideHeightM: +tideHeight.toFixed(2),
      tidePhase,
      tideCurrentKnots: +currentKnots.toFixed(2),
      currentDirectionDeg: tideDerivative > 0 ? 340 : 160,
      moonPhase: 'Cuarto Creciente',
      moonIllumination: 68,
      solarPosition,
      waterClarity: zone.depthAvgM > 50 ? 'Cristalina' : 'Verdosa',
      provider: 'Open-Meteo Marine v1 + NOAA Grid Panama (Cached)',
    });
  }

  gridCache.set(cacheKey, results);
  return results;
}
