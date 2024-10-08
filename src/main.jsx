import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {ModalProvider} from './components/Mobal/ModalContext.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ModalProvider>
    <App />
  </ModalProvider>
);
