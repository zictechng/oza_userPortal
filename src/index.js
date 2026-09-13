import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';
import { Provider } from 'react-redux';
import store from 'storeMtg/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import App from './App';
import { AppProvider } from 'contexts/AppContext';

// ── SSO: runs synchronously before ANY render, before PersistGate ──
const params = new URLSearchParams(window.location.search);
const ssoParam = params.get('sso');

// ✅ REPLACE WITH — write to persist:root BEFORE persistStore runs:
if (ssoParam) {
  try {
    const payload = JSON.parse(atob(ssoParam));
    if (payload?.msg === '200' && payload?.token) {

      // Build exact authUser state shape
      const authState = {
        loading: false,
        user: payload,
        error: null,
        errorMessage: '',
        userToken: payload.token,
        isAuth: true,
      };

      // Write directly into persist:root BEFORE persistStore(store) is called
      // This means REHYDRATE will load OUR data, not empty state
      const existingPersist = localStorage.getItem('persist:root');
      const existing = existingPersist ? JSON.parse(existingPersist) : {};
      localStorage.setItem('persist:root', JSON.stringify({
        ...existing,
        authUser: JSON.stringify(authState),
        _persist: JSON.stringify({ version: 2, rehydrated: true }),
      }));

      window.history.replaceState({}, '', '/user');
    }
  } catch (e) { console.error('SSO error', e); }
}

// persistStore NOW reads our localStorage — REHYDRATE loads authUser with token
let persister = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persister}>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);