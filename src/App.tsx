import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_ZONES,
  INITIAL_SPECIES,
  INITIAL_SPOTS,
  INITIAL_CATCHES,
  DEFAULT_USER,
} from './data/mockData';
import { Zone, Species, Spot, CatchRecord, UserProfile, FishingModality } from './types';
import { getEnvironmentalForecast } from './services/weatherProvider';
import { calculateFISHIQScore } from './services/scoreEngine';

import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';

// Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { MapScreen } from './components/screens/MapScreen';
import { ForecastScreen } from './components/screens/ForecastScreen';
import { SpeciesScreen } from './components/screens/SpeciesScreen';
import { AIScreen } from './components/screens/AIScreen';
import { LogbookScreen } from './components/screens/LogbookScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { LogCatchModal } from './components/screens/LogCatchModal';
import { OnboardingModal } from './components/screens/OnboardingModal';

export const App: React.FC = () => {
  // Persistent or default state
  const [zones] = useState<Zone[]>(INITIAL_ZONES);
  const [currentZone, setCurrentZone] = useState<Zone>(INITIAL_ZONES[0]);

  const [speciesList, setSpeciesList] = useState<Species[]>(() => {
    const saved = localStorage.getItem('fishiq_species');
    return saved ? JSON.parse(saved) : INITIAL_SPECIES;
  });

  const [selectedSpecies, setSelectedSpecies] = useState<Species>(speciesList[0]);

  const [userSpots, setUserSpots] = useState<Spot[]>(() => {
    const saved = localStorage.getItem('fishiq_spots');
    return saved ? JSON.parse(saved) : INITIAL_SPOTS;
  });

  const [catches, setCatches] = useState<CatchRecord[]>(() => {
    const saved = localStorage.getItem('fishiq_catches');
    return saved ? JSON.parse(saved) : INITIAL_CATCHES;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fishiq_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [units, setUnits] = useState<'Metric' | 'Imperial'>('Metric');
  const [isLogCatchOpen, setIsLogCatchOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('fishiq_species', JSON.stringify(speciesList));
  }, [speciesList]);

  useEffect(() => {
    localStorage.setItem('fishiq_spots', JSON.stringify(userSpots));
  }, [userSpots]);

  useEffect(() => {
    localStorage.setItem('fishiq_catches', JSON.stringify(catches));
  }, [catches]);

  useEffect(() => {
    localStorage.setItem('fishiq_user', JSON.stringify(userProfile));
  }, [userProfile]);

  // Dynamically calculate 24h environmental conditions and hourly FISHIQ scores
  const hourlyScores = useMemo(() => {
    const conditions24h = getEnvironmentalForecast(currentZone, 24);
    return conditions24h.map((cond, idx) => {
      const hour = new Date(cond.timestamp).getHours();
      const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
      return calculateFISHIQScore(selectedSpecies, cond, timeLabel);
    });
  }, [currentZone, selectedSpecies]);

  // Handlers
  const handleAddSpot = (newSpot: Spot) => {
    setUserSpots((prev) => [newSpot, ...prev]);
  };

  const handleSaveCatch = (newCatch: CatchRecord) => {
    setCatches((prev) => [newCatch, ...prev]);
  };

  const handleUpdateSpeciesWeights = (speciesId: string, newWeights: Species['weights']) => {
    setSpeciesList((prev) =>
      prev.map((sp) => {
        if (sp.id === speciesId) {
          const updated = { ...sp, weights: newWeights };
          if (selectedSpecies.id === speciesId) {
            setSelectedSpecies(updated);
          }
          return updated;
        }
        return sp;
      })
    );
  };

  const handleCompleteOnboarding = (modality: FishingModality) => {
    setUserProfile((prev) => ({ ...prev, preferredModality: modality }));
    localStorage.setItem('fishiq_onboarding_completed', 'true');
    setIsOnboardingOpen(false);
  };

  return (
    <div className="fishiq-app-root">
      {/* Top Header (visible on inner tabs, clean on home and map to match full-bleed mockups) */}
      {activeTab !== 'home' && activeTab !== 'map' && (
        <Header
          currentZone={currentZone}
          onSelectZone={setCurrentZone}
          allZones={zones}
          units={units}
          onToggleUnits={() => setUnits((u) => (u === 'Metric' ? 'Imperial' : 'Metric'))}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />
      )}

      {/* Main Screen Body */}
      <main className="main-viewport-container">
        {activeTab === 'home' && (
          <HomeScreen
            currentZone={currentZone}
            selectedSpecies={selectedSpecies}
            onSelectSpecies={setSelectedSpecies}
            allSpecies={speciesList}
            hourlyScores={hourlyScores}
            onOpenLogCatch={() => setIsLogCatchOpen(true)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            recentCatches={catches}
          />
        )}

        {activeTab === 'map' && (
          <MapScreen
            currentZone={currentZone}
            allZones={zones}
            onSelectZone={setCurrentZone}
            userSpots={userSpots}
            onAddSpot={handleAddSpot}
            selectedSpecies={selectedSpecies}
            allSpecies={speciesList}
            onSelectSpecies={setSelectedSpecies}
            onNavigateToForecast={() => setActiveTab('forecast')}
            onNavigateBack={() => setActiveTab('forecast')}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastScreen
            currentZone={currentZone}
            selectedSpecies={selectedSpecies}
            allSpecies={speciesList}
            onSelectSpecies={setSelectedSpecies}
            hourlyScores={hourlyScores}
          />
        )}

        {activeTab === 'species' && (
          <SpeciesScreen
            allSpecies={speciesList}
            selectedSpecies={selectedSpecies}
            onSelectSpecies={setSelectedSpecies}
            currentZone={currentZone}
            hourlyScores={hourlyScores}
            onNavigateToForecast={() => setActiveTab('forecast')}
          />
        )}

        {activeTab === 'logbook' && (
          <LogbookScreen
            catches={catches}
            allSpecies={speciesList}
            onOpenLogModal={() => setIsLogCatchOpen(true)}
          />
        )}

        {activeTab === 'ai' && (
          <AIScreen
            currentZone={currentZone}
            selectedSpecies={selectedSpecies}
            hourlyScores={hourlyScores}
          />
        )}

        {activeTab === 'admin' && (
          <AdminScreen
            allSpecies={speciesList}
            onUpdateSpeciesWeights={handleUpdateSpeciesWeights}
            allZones={zones}
            activeScore={hourlyScores[0]}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (cleanly omitted on Inicio to match the immersive mobile splash) */}
      {activeTab !== 'home' && (
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          catchCount={catches.length}
        />
      )}

      {/* Modals */}
      <LogCatchModal
        isOpen={isLogCatchOpen}
        onClose={() => setIsLogCatchOpen(false)}
        onSaveCatch={handleSaveCatch}
        allSpecies={speciesList}
        currentZone={currentZone}
        currentConditions={hourlyScores[0]?.conditions}
        currentScore={hourlyScores[0]?.score || 75}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSelectModality={handleCompleteOnboarding}
        currentModality={userProfile.preferredModality}
      />
    </div>
  );
};

export default App;
