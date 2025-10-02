import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RacersPage from './pages/RacersPage';
import ClassesPage from './pages/ClassesPage';
import CarsPage from './pages/CarsPage';
import SeasonsPage from './pages/SeasonsPage';
import RaceResultsPage from './pages/RaceResultsPage';
import HomePage from './pages/HomePage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/racers" element={<RacersPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/seasons" element={<SeasonsPage />} />
        <Route path="/race-results" element={<RaceResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
