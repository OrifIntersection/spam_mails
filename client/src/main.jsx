// •  React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import App from './App';

// •  Modules
import FrontPage from './modules/frontpage';
import LoadingPage from './modules/loadingpage';

// •  Feuille de styles
import './tailwind-setup.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*<App />*/}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/frontpage" element={<FrontPage />} />
        <Route path="/loading" element={<LoadingPage />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)