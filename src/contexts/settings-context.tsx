
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { group, type GroupProfile } from '@/lib/organization';

export interface EmailSettings {
    smtpServer?: string;
    smtpPort?: number | string;
    smtpUser?: string;
    smtpPass?: string;
    fromName?: string;
    fromEmail?: string;
}

export interface AppSettings extends GroupProfile {
  dateFormat: 'mm-dd-yyyy' | 'dd-mm-yyyy' | 'yyyy-mm-dd';
  emailSettings?: EmailSettings;
}

interface SettingsContextType {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  isLoaded: boolean;
}

const SETTINGS_STORAGE_KEY = 'appSettings';

const defaultSettings: AppSettings = {
  ...group,
  dateFormat: 'mm-dd-yyyy',
  emailSettings: {
    smtpServer: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    fromName: '',
    fromEmail: '',
  }
};

export const currencySymbols: Record<AppSettings['currency'], string> = {
    USD: '$',
    CAD: 'C$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    JPY: '¥',
    ZAR: 'R',
    BRL: 'R$',
    INR: '₹',
}

export function getCurrencySymbol(currencyCode: AppSettings['currency']) {
    return currencySymbols[currencyCode] || '$';
}


export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  isLoaded: false,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Merge with defaults to ensure new settings are not missing
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const handleSetSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings: handleSetSettings, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}
