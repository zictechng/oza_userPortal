
import React, { createContext, useContext, useState, useEffect } from 'react';
import client from 'components/client';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [appName, setAppName] = useState('');
  const [appLogo, setAppLogo] = useState('');
  const [appShortName, setAppShortName] = useState('');
  const [appLoading, setAppLoading] = useState(true);

  const fetchAppSettings = async () => {
    try {
      const res = await client.get('/api/app_setting');
      if (res.data.msg === '201' && res.data.feedAll?.[0]) {
        const d = res.data.feedAll[0];
        setAppName(d.app_name || '');
        setAppLogo(d.app_logo || '');
        setAppShortName(d.app_short_name || '');
        // Store in localStorage for offline access
        localStorage.setItem('app_name', d.app_name || '');
        localStorage.setItem('app_logo', d.app_logo || '');
        localStorage.setItem('app_short_name', d.app_short_name || '');
      }
    } catch (e) {
      // Fallback to localStorage if API fails
      setAppName(localStorage.getItem('app_name') || '');
      setAppLogo(localStorage.getItem('app_logo') || '');
      setAppShortName(localStorage.getItem('app_short_name') || '');
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    // Load from localStorage immediately for instant display
    setAppName(localStorage.getItem('app_name') || '');
    setAppLogo(localStorage.getItem('app_logo') || '');
    setAppShortName(localStorage.getItem('app_short_name') || '');
    // Then fetch fresh from API
    fetchAppSettings();
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