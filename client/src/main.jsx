import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import VerifyEmail from './components/VerifyEmail.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
