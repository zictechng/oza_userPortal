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
import { setSsoAuth } from 'storeMtg/authSlice';

// ── SSO: runs synchronously before ANY render, before PersistGate ──
const params = new URLSearchParams(window.location.search);
const ssoParam = params.get('sso');
if (ssoParam) {
  try {
    const payload = JSON.parse(atob(ssoParam));
    if (payload?.msg === '200' && payload?.token) {
      // Dispatch directly into store — synchronous, instant, before render
      store.dispatch(setSsoAuth(payload));
      // Clean URL
      window.history.replaceState({}, '', '/user');
    }
  } catch (e) {}
}

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