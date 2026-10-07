import React from 'react';
import { Home, Map, Activity, Fish, BookOpen, Sparkles, Sliders } from 'lucide-react';

export type TabId = 'home' | 'map' | 'forecast' | 'species' | 'logbook' | 'ai' | 'admin';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  catchCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab, catchCount }) => {
  const tabs: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'map', label: 'Mapa', icon: <Map size={20} /> },
    { id: 'forecast', label: 'Score', icon: <Activity size={20} /> },
    { id: 'species', label: 'Especies', icon: <Fish size={20} /> },
    { id: 'logbook', label: 'Diario', icon: <BookOpen size={20} />, badge: catchCount },
    { id: 'ai', label: 'FISHIQ AI', icon: <Sparkles size={20} /> },
    { id: 'admin', label: 'Calibrar', icon: <Sliders size={20} /> },
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="nav-items-container">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-button ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.id)}
              aria-label={tab.label}
            >
              <div className="nav-icon-container">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="nav-badge">{tab.badge}</span>
                )}
                {tab.id === 'ai' && <span className="ai-pulse-dot"></span>}
              </div>
              <span className="nav-tab-label">{tab.label}</span>
              {isActive && <div className="active-indicator-pill"></div>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
