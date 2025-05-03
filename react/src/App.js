import React from 'react';
import { Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import store, { persistor } from './store';
import GlobalStyles from './styles/GlobalStyles';
import History from "./services/history";
import Rotas from './routes';
import ConditionalNavBar from './components/ConditionalNavBar';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={History}>
          <ConditionalNavBar />
          <Rotas />
          <GlobalStyles />
          <ToastContainer autoClose={3000} className="toast-container" />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
