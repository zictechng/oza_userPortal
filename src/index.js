import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/App.css';
import { Provider } from 'react-redux';
import store from 'storeMtg/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import App from './App';

let persister = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persister}>  {/* this line is added because of persist value */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </PersistGate>
  </Provider>,
);
