import React, { useState } from 'react';
import { Species, Zone, HourlyScore } from '../../types';
import { Bot, Send, MoreHorizontal, ArrowRight, Sparkles } from 'lucide-react';

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
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'm1',
      sender: 'user',
      text: '¿Dónde puedo pescar robalo mañana en Panamá?',
    },
    {
      id: 'm2',
      sender: 'assistant',
      text: 'Mañana las mejores condiciones para robalo en Panamá son:',
      rankedSpots: [
        {
          id: 1,
          name: 'Bahía de Panamá',
          score: 88,
          time: '6:10 – 8:40 a.m.',
          img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 2,
          name: 'Lago Bayano',
          score: 87,
          time: '6:30 – 9:00 a.m.',
          img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 3,
          name: 'Manglares de Chepo',
          score: 79,
          time: '5:50 – 8:20 a.m.',
          img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
        },
      ],
      summaryNote:
        'Habrá marea creciente, viento leve del SE (5–8 kt) y buena probabilidad de actividad cerca de desembocaduras y manglares.',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: `Para pescar **${selectedSpecies.commonName}** en **${currentZone.name}**, el pronóstico indica un Fishing Score de **87/100 (Excelente actividad)**.`,
        summaryNote:
          'Se recomienda utilizar señuelos tipo Crankbait o Minnow suspendido en cambios de marea. Viento moderado de 5 kt del SE.',
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="screen-content mockup-ai-screen">
      {/* 1. MOCKUP TOP HEADER (Phone 4 Style) */}
      <div className="ai-mockup-header">
        <div className="ai-header-left">
          <div className="ai-round-icon-wrap">
            <Bot size={20} />
          </div>
          <span className="ai-header-title">Asistente IA</span>
        </div>
        <button className="ai-more-btn">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* 2. CHAT MESSAGES CONTAINER */}
      <div className="ai-mockup-chat-thread">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`mockup-chat-row ${isUser ? 'user-side' : 'bot-side'}`}>
              <div className={`mockup-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
                <p className="bubble-text-content">{m.text}</p>

                {/* Ranked Cards (from mockup Phone 4) */}
                {m.rankedSpots && (
                  <div className="mockup-ranked-spots-list">
                    {m.rankedSpots.map((spot: any) => (
                      <div key={spot.id} className="ranked-spot-card">
                        <span className="spot-rank-number">{spot.id}</span>
                        <div className="spot-thumb-wrap">
                          <img src={spot.img} alt={spot.name} className="spot-thumb-img" />
                        </div>
                        <div className="spot-details-wrap">
                          <span className="spot-title-txt">{spot.name}</span>
                          <span className="spot-score-green">Fishing Score: {spot.score}</span>
                          <span className="spot-time-txt">{spot.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary note below cards */}
                {m.summaryNote && <p className="bubble-summary-note">{m.summaryNote}</p>}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="mockup-chat-row bot-side">
            <div className="mockup-bubble bot-bubble typing-dots-wrap">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="ai-quick-suggestions-bar">
        <button className="ai-sugg-chip" onClick={() => handleSend('¿Qué señuelo me recomiendas para robalo?')}>
          🎣 ¿Qué señuelo usar?
        </button>
        <button className="ai-sugg-chip" onClick={() => handleSend('¿Cómo estará el viento y la marea?')}>
          🌊 Marea y viento
        </button>
      </div>

      {/* 3. INPUT BAR (Phone 4 Style) */}
      <div className="ai-mockup-input-bar">
        <input
          type="text"
          placeholder="Escribe tu consulta..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="ai-mockup-text-input"
        />
        <button
          className="ai-mockup-send-circle-btn"
          onClick={() => handleSend()}
          disabled={!inputVal.trim() || isTyping}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
