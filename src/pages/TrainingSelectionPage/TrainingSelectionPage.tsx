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
  const [webAppReady, setWebAppReady] = useState(false);

  useEffect(() => {
    // Initialize WebApp properly
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      setWebAppReady(true);
      console.log('WebApp initialized and ready');
    }
  }, []);

  const handleSelectTraining = (trainingType: string, trainingName: string) => {
    const trainingData = {
      trainingType,
      trainingName,
      timestamp: new Date().toISOString(),
    };

    console.log('Training selected:', trainingData);

    if (window.Telegram?.WebApp) {
      try {
        // Method 1: Try sendData (works on mobile, not macOS)
        console.log('Attempting sendData...');
        window.Telegram.WebApp.sendData(JSON.stringify(trainingData));
        console.log('sendData completed');
        
        // Close after a delay
        setTimeout(() => {
          window.Telegram?.WebApp.close();
        }, 500);
        
      } catch (error) {
        console.error('sendData failed:', error);
        
        // Method 2: Fallback - send via API and close
        sendDataViaAPI(trainingData);
      }
    } else {
      // Development fallback
      alert(`Selected: ${trainingName}`);
    }
  };

  const sendDataViaAPI = async (data: any) => {
    try {
      // Send to your bot's webhook/API endpoint
      const response = await fetch('https://your-bot-api.com/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      console.log('API response:', response);
      window.Telegram?.WebApp?.close();
    } catch (error) {
      console.error('API send failed:', error);
      window.Telegram?.WebApp?.close();
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
      </List>
    </Page>
  );
};