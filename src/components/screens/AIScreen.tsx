import React, { useState } from 'react';
import { Species, Zone, HourlyScore, ChatMessage } from '../../types';
import { generateAIResponse } from '../../services/aiService';
import { Sparkles, Send, ShieldAlert, Bot, User, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface AIScreenProps {
  currentZone: Zone;
  selectedSpecies: Species;
  hourlyScores: HourlyScore[];
}

export const AIScreen: React.FC<AIScreenProps> = ({
  currentZone,
  selectedSpecies,
  hourlyScores,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      timestamp: 'Ahora',
      text: `¡Hola, Capitán! Soy **FISHIQ AI**, tu asistente táctico de pesca deportiva para el **Pacífico de Panamá**.

Estoy sincronizado con los datos de **${currentZone.name}** y los parámetros del **${selectedSpecies.commonName}**. Mis respuestas se basan estrictamente en el motor de scoring determinístico y condiciones oceanográficas reales.

¿En qué te puedo asesorar para tu próxima salida?`,
      chips: [
        `¿Cuál es la mejor hora para pescar ${selectedSpecies.commonName}?`,
        `¿Qué señuelos y técnicas me recomiendas hoy?`,
        `¿Cómo afectará la marea y la luna la picada?`,
        `¿Cómo están el viento y el oleaje en ${currentZone.name}?`,
      ],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate short server latency
    setTimeout(() => {
      const response = generateAIResponse(text, currentZone, selectedSpecies, hourlyScores);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="screen-content ai-screen">
      {/* Header Context Banner */}
      <div className="ai-context-banner">
        <div className="ai-banner-left">
          <div className="ai-avatar-glow">
            <Bot size={22} />
          </div>
          <div>
            <div className="ai-title">FISHIQ AI Táctico</div>
            <div className="ai-subtitle">
              Analizando: {selectedSpecies.commonName} en {currentZone.name}
            </div>
          </div>
        </div>
        <div className="ai-ver-tag">Motor v0.1 • Sin Alucinaciones</div>
      </div>

      {/* Messages Thread */}
      <div className="ai-messages-container">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`chat-message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
              {!isUser && (
                <div className="bot-avatar">
                  <Bot size={18} />
                </div>
              )}

              <div className="message-bubble">
                <div className="message-text">
                  {m.text.split('\n').map((line, i) => (
                    <p key={i}>
                      {line.startsWith('**') ? (
                        <strong>{line.replace(/\*\*/g, '')}</strong>
                      ) : line.startsWith('• ') ? (
                        <span className="bullet-item">• {line.slice(2)}</span>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>

                {/* Structured Data Callout if provided */}
                {m.structuredData && (
                  <div className="structured-ai-card">
                    {m.structuredData.recommendedTime && (
                      <div className="struct-row">
                        <CheckCircle2 size={16} className="text-emerald" />
                        <span>Mejor hora sugerida: <strong>{m.structuredData.recommendedTime} HRS</strong> (Score: {m.structuredData.score}/100)</span>
                      </div>
                    )}
                    {m.structuredData.bestLure && (
                      <div className="struct-row">
                        <span>🎣 Señuelo estelar: <em>{m.structuredData.bestLure}</em></span>
                      </div>
                    )}
                    {m.structuredData.warning && (
                      <div className="struct-warning-row">
                        <AlertTriangle size={15} />
                        <span>{m.structuredData.warning}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Action Chips for next prompts */}
                {m.chips && m.chips.length > 0 && !isUser && (
                  <div className="message-chips-row">
                    {m.chips.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        className="quick-chip-btn"
                        onClick={() => handleSend(chip)}
                      >
                        {chip} <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                )}

                <span className="message-timestamp">{m.timestamp}</span>
              </div>

              {isUser && (
                <div className="user-avatar">
                  <User size={18} />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="chat-message-row assistant-row">
            <div className="bot-avatar">
              <Bot size={18} />
            </div>
            <div className="message-bubble typing-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className="ai-safety-footer">
        <ShieldAlert size={14} />
        <span>Respuestas basadas en datos oceanográficos para pesca. Respete siempre la seguridad marítima.</span>
      </div>

      {/* Input bar */}
      <div className="ai-input-bar">
        <input
          type="text"
          placeholder={`Pregunta sobre ${selectedSpecies.commonName} o condiciones...`}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="ai-text-input"
        />
        <button
          className="ai-send-btn"
          onClick={() => handleSend()}
          disabled={!inputVal.trim() || isTyping}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
