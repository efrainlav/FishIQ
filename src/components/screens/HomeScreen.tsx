import React, { useState } from 'react';
import { Species, Zone, HourlyScore, CatchRecord } from '../../types';
import { AuthModal } from './AuthModal';
import { Signal, Wifi, BatteryMedium } from 'lucide-react';

interface HomeScreenProps {
  currentZone: Zone;
  selectedSpecies: Species;
  onSelectSpecies: (species: Species) => void;
  allSpecies: Species[];
  hourlyScores: HourlyScore[];
  onOpenLogCatch: () => void;
  onNavigateToTab: (tab: 'map' | 'forecast' | 'logbook' | 'ai' | 'admin') => void;
  recentCatches: CatchRecord[];
  onLoginSuccess?: (name: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTab,
  onLoginSuccess,
}) => {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  const handleAuthSuccess = (userName: string) => {
    if (onLoginSuccess) onLoginSuccess(userName);
    onNavigateToTab('forecast');
  };

  return (
    <div className="clean-immersive-home-screen">
      {/* 1. FULL BACKGROUND IMAGE: Complete Leaping Snook & Ocean Splash */}
      <div className="clean-hero-bg-container">
        <img
          src="/images/splash_fish.jpg"
          alt="Robalo saltando completo con salpicadura de agua marina"
          className="clean-hero-fish-img"
        />
        {/* Soft atmospheric gradient for top logo readability & bottom button contrast */}
        <div className="clean-hero-top-vignette" />
        <div className="clean-hero-bottom-vignette" />
      </div>

      {/* 2. TOP GROUP: MOBILE STATUS BAR + CLEAN FLOATING LOGO */}
      <div className="clean-hero-top-group">
        <div className="clean-mobile-status-bar">
          <span className="status-clock">9:41</span>
          <div className="status-icons-strip">
            <Signal size={13} className="status-icon" />
            <Wifi size={13} className="status-icon" />
            <BatteryMedium size={16} className="status-icon" />
          </div>
        </div>

        <div className="clean-floating-brand-center">
          <div className="clean-fish-emblem-wrap">
            <svg viewBox="0 0 120 48" className="clean-floating-fish-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cyanBrandGrad" x1="16" y1="24" x2="105" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="65%" stopColor="#00d2ff" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
              {/* Upper crest wave / fin */}
              <path
                d="M38 10C54 3 82 7 98 17C89 19 79 17 67 16C53 15 44 18 38 10Z"
                fill="#38bdf8"
              />
              {/* Streamlined main fish body */}
              <path
                d="M16 25C29 13 65 10 94 19C105 23 102 31 92 34C77 40 40 44 16 25Z"
                fill="url(#cyanBrandGrad)"
              />
              {/* Top tail fin */}
              <path d="M87 18C95 12 106 10 113 12C109 19 103 23 96 23Z" fill="#00f2fe" />
              {/* Bottom tail fin */}
              <path d="M90 30C98 36 106 38 112 36C108 31 101 27 95 27Z" fill="#0284c7" />
              {/* Eye */}
              <circle cx="34" cy="22" r="3" fill="#ffffff" />
              <circle cx="35" cy="22" r="1.5" fill="#04162c" />
            </svg>
          </div>

          <h1 className="clean-brand-logotype">
            FISH<span className="logotype-iq-cyan">IQ</span>
          </h1>
          <div className="clean-brand-strapline">SMART FISHING LATAM</div>
        </div>
      </div>

      {/* 4. CLEAN BOTTOM ACTIONS (2 Clean Buttons: Iniciar sesión & Registrarse + Explorar) */}
      <div className="clean-hero-cta-section">
        <button
          className="clean-btn-solid-blue"
          onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
        >
          Iniciar sesión
        </button>

        <button
          className="clean-btn-outline-blue"
          onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
        >
          Registrarse
        </button>

        <button
          className="clean-btn-explore-link"
          onClick={() => onNavigateToTab('forecast')}
        >
          Explorar sin cuenta
        </button>

        <div className="iphone-home-indicator-bar" />
      </div>

      {/* 5. AUTH MODAL (Login / Register sheet) */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

