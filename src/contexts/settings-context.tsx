
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

export interface CompanySettings {
  companyName: string;
  companyWebsite: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: 'US' | 'CA' | 'GB' | 'AU' | 'ZA' | 'DE' | 'JP' | 'CN' | 'BR' | 'IN';
  currency: 'USD' | 'CAD' | 'EUR' | 'GBP' | 'AUD' | 'JPY' | 'ZAR' | 'BRL' | 'INR';
  dateFormat: 'mm-dd-yyyy' | 'dd-mm-yyyy' | 'yyyy-mm-dd';
}

interface SettingsContextType {
  settings: CompanySettings;
  setSettings: (settings: CompanySettings) => void;
  isLoaded: boolean;
}

const SETTINGS_STORAGE_KEY = 'companySettings';

const defaultSettings: CompanySettings = {
  companyName: 'Spend Inc.',
  companyWebsite: 'https://spend.com',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  currency: 'USD',
  dateFormat: 'mm-dd-yyyy',
};

export const currencySymbols: Record<CompanySettings['currency'], string> = {
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

export function getCurrencySymbol(currencyCode: CompanySettings['currency']) {
    return currencySymbols[currencyCode] || '$';
}


export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
  isLoaded: false,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const handleSetSettings = (newSettings: CompanySettings) => {
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
