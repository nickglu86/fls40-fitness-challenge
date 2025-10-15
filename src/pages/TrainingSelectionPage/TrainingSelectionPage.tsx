import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import { useEffect, useState } from 'react';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';

const TRAINING_TYPES = [
  { id: 'gym', name: 'Gym', emoji: '💪' },
  { id: 'yoga', name: 'Yoga', emoji: '🧘' },
  { id: 'running', name: 'Running', emoji: '🏃' },
  { id: 'tennis', name: 'Tennis', emoji: '🎾' },
];

export const TrainingSelectionPage: FC = () => {
  const [debugInfo, setDebugInfo] = useState('Loading...');

  useEffect(() => {
    // Debug what's available on the window object
    const debugWindow = () => {
      console.log('=== DEBUG WINDOW OBJECT ===');
      console.log('window.Telegram:', window.Telegram);
      console.log('window.Telegram?.WebApp:', window.Telegram?.WebApp);
      console.log('typeof window.Telegram:', typeof window.Telegram);
      console.log('typeof window.Telegram?.WebApp:', typeof window.Telegram?.WebApp);
      
      if (window.Telegram?.WebApp) {
        console.log('WebApp methods available:', Object.keys(window.Telegram.WebApp));
        console.log('WebApp.sendData:', typeof window.Telegram.WebApp.sendData);
        console.log('WebApp.close:', typeof window.Telegram.WebApp.close);
        console.log('WebApp.ready:', typeof window.Telegram.WebApp.ready);
      }

      // Check if we're in Telegram by looking at user agent or other indicators
      console.log('User Agent:', navigator.userAgent);
      console.log('Location:', window.location.href);
      
      // Set debug info for display
      const info = {
        hasTelegram: !!window.Telegram,
        hasWebApp: !!window.Telegram?.WebApp,
        userAgent: navigator.userAgent,
        location: window.location.href
      };
      setDebugInfo(JSON.stringify(info, null, 2));
    };

    // Check immediately and after delays
    debugWindow();
    setTimeout(debugWindow, 500);
    setTimeout(debugWindow, 1000);
  }, []);

  const handleSelectTraining = (trainingType: string, trainingName: string) => {
    const trainingData = {
      trainingType,
      trainingName,
      timestamp: new Date().toISOString(),
    };

    console.log('=== SELECTING TRAINING ===');
    console.log('Training data:', trainingData);
    console.log('window.Telegram exists:', !!window.Telegram);
    console.log('window.Telegram.WebApp exists:', !!window.Telegram?.WebApp);

    // Try multiple ways to detect Telegram environment
    const isTelegramEnv = 
      window.Telegram?.WebApp ||
      navigator.userAgent.includes('TelegramBot') ||
      window.location.href.includes('tgWebAppData') ||
      !!window.location.search.match(/tgWebAppData/);

    console.log('isTelegramEnv:', isTelegramEnv);

    if (isTelegramEnv && window.Telegram?.WebApp) {
      try {
        console.log('Attempting to send data via WebApp...');
        window.Telegram.WebApp.sendData(JSON.stringify(trainingData));
        console.log('Data sent successfully!');
        
        setTimeout(() => {
            window.Telegram?.WebApp?.close();
          }, 100);
      } catch (error) {
        console.error('Error sending data:', error);
        alert(`Error: ${error}`);
      }
    } else {
      // Fallback - but also try direct window access
      console.log('Using fallback method...');
      
      // Try alternative approach
      try {
        if (window.Telegram && window.Telegram.WebApp) {
          console.log('Found WebApp in fallback, trying again...');
          window.Telegram.WebApp.sendData(JSON.stringify(trainingData));
          window.Telegram.WebApp.close();
          return;
        }
      } catch (e) {
        console.log('Fallback WebApp access failed:', e);
      }
      
      alert(`Selected: ${trainingName}\n\nDebug Info:\n${debugInfo}`);
    }
  };

  return (
    <Page back={false}>
      <List>
        <Section
          header="Choose Your Training"
          footer="Select the type of training you completed"
        >
          {TRAINING_TYPES.map((training) => (
            <Cell
              key={training.id}
              before={<span style={{ fontSize: '24px' }}>{training.emoji}</span>}
              onClick={() => handleSelectTraining(training.id, training.name)}
            >
              {training.name}
            </Cell>
          ))}
        </Section>
        
        <Section header="Debug Info">
          <Cell subtitle={debugInfo}>
            Environment Debug
          </Cell>
        </Section>
      </List>
    </Page>
  );
};