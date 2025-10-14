import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';

const TRAINING_TYPES = [
  { id: 'gym', name: 'Gym', emoji: '💪' },
  { id: 'yoga', name: 'Yoga', emoji: '🧘' },
  { id: 'running', name: 'Running', emoji: '🏃' },
  { id: 'tennis', name: 'Tennis', emoji: '🎾' },
];

export const TrainingSelectionPage: FC = () => {
  const handleSelectTraining = (trainingType: string, trainingName: string) => {
    // Send data back to the Telegram chat
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(
        JSON.stringify({
          trainingType,
          trainingName,
          timestamp: new Date().toISOString(),
        })
      );
      
      // Close the mini app
      window.Telegram.WebApp.close();
    } else {
      // For development/testing outside Telegram
      console.log('Training selected:', trainingName);
      alert(`Selected: ${trainingName}`);
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