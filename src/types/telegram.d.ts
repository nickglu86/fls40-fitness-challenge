declare global {
    interface Window {
      Telegram?: {
        WebApp: {
          sendData: (data: string) => void;
          close: () => void;
          ready: () => void;
          expand: () => void;
          version: string;
          platform: string;
          colorScheme: 'light' | 'dark';
          themeParams: Record<string, string>;
          initData: string;
          initDataUnsafe: {
            user?: {
              id: number;
              first_name: string;
              last_name?: string;
              username?: string;
              language_code?: string;
            };
            chat?: {
              id: number;
              type: string;
              title: string;
            };
          };
        };
      };
    }
  }
  
  export {};