
import { useState, useEffect } from 'react';
import { UISettings } from '@/types';

export function useUISettingsState() {
  const [uiSettings, setUISettings] = useState<UISettings>(() => {
    const saved = localStorage.getItem("uiSettings");
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      compactMode: false,
      currency: 'INR',
      dateFormat: 'dd/MM/yyyy',
      sidebarCollapsed: false,
      defaultPaymentMethod: 'cash',
      defaultReportPeriod: 'month'
    };
  });

  useEffect(() => {
    localStorage.setItem("uiSettings", JSON.stringify(uiSettings));
  }, [uiSettings]);

  const updateUISettings = (settings: Partial<UISettings>) => {
    setUISettings(prev => ({ ...prev, ...settings }));
  };

  return {
    uiSettings,
    updateUISettings
  };
}
