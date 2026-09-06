import React, { createContext, useContext, useState, useEffect } from 'react';
import client from 'components/client';

const AppContext = createContext({});

// Read from localStorage synchronously on module load
// This ensures values are available on first render
const getStoredValue = (key, fallback = '') => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  // Initialize from localStorage immediately — no empty flash
  const [appName, setAppName] = useState(() => getStoredValue('app_name'));
  const [appLogo, setAppLogo] = useState(() => getStoredValue('app_logo'));
  const [appShortName, setAppShortName] = useState(() => getStoredValue('app_short_name'));
  const [appLoading, setAppLoading] = useState(true);

  const fetchAppSettings = async () => {
    try {
      const res = await client.get('/api/app_settingPage');
      if (res.data.msg === '201' && res.data.feedAll?.[0]) {
        const d = res.data.feedAll[0];
        const name = d.app_name || '';
        const logo = d.app_logo || '';
        const shortName = d.app_short_name || '';

        setAppName(name);
        setAppLogo(logo);
        setAppShortName(shortName);

        // Persist for next load
        localStorage.setItem('app_name', name);
        localStorage.setItem('app_logo', logo);
        localStorage.setItem('app_short_name', shortName);
      }
    } catch (e) {
      // Keep existing localStorage values — already loaded in useState initializer
      console.log('AppContext fetch error:', e.message);
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    fetchAppSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider value={{
      appName,
      appLogo,
      appShortName,
      appLoading,
      fetchAppSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContext;