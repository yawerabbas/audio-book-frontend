// App.js

import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // Changed BrowserRouter to HashRouter
import Audiobooks from './pages/Audiobooks';
import AudiobooksDetails from './pages/AudiobookDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Render Audiobooks component for the root route */}
        <Route exact path="/" element={<Audiobooks />} />

        {/* Render AudiobooksDetails component for the /audiobooks/:id route */}
        <Route path="/audiobooks/:id" element={<AudiobooksDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
