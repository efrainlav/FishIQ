import { Species, Zone, HourlyScore, ChatMessage } from '../types';

export function generateAIResponse(
  userQuery: string,
  zone: Zone,
  species: Species,
  scores: HourlyScore[]
): ChatMessage {
  const queryLower = userQuery.toLowerCase();
  const bestWindow = [...scores].sort((a, b) => b.score - a.score)[0];
  const currentHour = scores[0];

  let replyText = '';
  let warning: string | undefined = undefined;
  let recommendedTime: string | undefined = undefined;
  let bestLure: string | undefined = undefined;

  // Case 1: "¿Cuándo salir / mejor hora / mañana / hoy?"
  if (queryLower.includes('cuándo') || queryLower.includes('hora') || queryLower.includes('mañana') || queryLower.includes('hoy') || queryLower.includes('ventana')) {
    recommendedTime = bestWindow.timeLabel;
    bestLure = species.preferences.recommendedLures[0];
    replyText = `Para pescar **${species.commonName}** en **${zone.name}**, la mejor ventana identificada es a las **${bestWindow.timeLabel}** con un **FISHIQ Score de ${bestWindow.score}/100 (${bestWindow.tier})**.

**Razones clave que favorecen la ventana:**
• ${bestWindow.topPositiveFactors.join('\n• ')}

${bestWindow.topNegativeFactors.length > 0 ? `**Factores limitantes a considerar:**\n• ${bestWindow.topNegativeFactors.join('\n• ')}` : ''}

**Recomendación táctica:** Utiliza *${bestLure}* con técnica de *${species.preferences.recommendedTechniques[0]}*.`;
  }
  // Case 2: Señuelos o técnica
  else if (queryLower.includes('señuelo') || queryLower.includes('lure') || queryLower.includes('técnica') || queryLower.includes('tecnica') || queryLower.includes('carnada')) {
    bestLure = species.preferences.recommendedLures[0];
    replyText = `Para **${species.commonName}** en la zona de **${zone.name}** (${species.depthRangeText}):

**Señuelos prioritarios:**
${species.preferences.recommendedLures.map((l, i) => `${i + 1}. ${l}`).join('\n')}

**Técnicas recomendadas:** ${species.preferences.recommendedTechniques.join(' y ')}.
**Profundidad objetivo:** ${species.preferences.depthMinM}m a ${species.preferences.depthMaxM}m.`;
  }
  // Case 3: Condición del mar / marea / seguridad
  else if (queryLower.includes('mar') || queryLower.includes('marea') || queryLower.includes('viento') || queryLower.includes('ola') || queryLower.includes('seguridad')) {
    warning = 'Recuerda: FISHIQ evalúa apetito biológico de pesca, NO seguridad náutica oficial. Revisa siempre boletines de AMP / SINAPROC antes de zarpar.';
    replyText = `**Estado actual del mar en ${zone.name}:**
• Marea: **${currentHour.conditions.tidePhase}** (altura: ${currentHour.conditions.tideHeightM}m, corriente: ${currentHour.conditions.tideCurrentKnots} kts).
• Temperatura superficial (SST): **${currentHour.conditions.sstCelsius}°C**.
• Viento: **${currentHour.conditions.windSpeedKnots} kts** del ${currentHour.conditions.windDirectionLabel}.
• Oleaje / Swell: **${currentHour.conditions.waveHeightM}m** (periodo ${currentHour.conditions.wavePeriodSec}s).
• Fase lunar: **${currentHour.conditions.moonPhase}** (${currentHour.conditions.moonIllumination}% iluminada).`;
  }
  // Default: Explicación contextual de la especie y score actual
  else {
    recommendedTime = bestWindow.timeLabel;
    replyText = `Actualmente en **${zone.name}**, el índice para **${species.commonName}** está en **${currentHour.score}/100 (${currentHour.tier})**.

La especie presenta mayor apetito cuando el agua alcanza entre **${species.preferences.tempOptimalMin}°C y ${species.preferences.tempOptimalMax}°C** y la marea se encuentra **${species.preferences.preferredTides.join(' o ')}**.

¿Deseas que analicemos otra hora específica, señuelos sugeridos o una zona alternativa?`;
  }

  return {
    id: 'ai-' + Date.now(),
    sender: 'assistant',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: replyText,
    chips: [
      `¿Mejor hora para ${species.commonName}?`,
      '¿Qué señuelo usar?',
      '¿Cómo está la marea hoy?',
      'Verificar condiciones de viento',
    ],
    structuredData: {
      speciesName: species.commonName,
      recommendedTime,
      score: bestWindow.score,
      bestLure,
      warning,
    },
  };
}
