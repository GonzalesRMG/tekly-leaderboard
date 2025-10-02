import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RacersPage from './pages/RacersPage';
import ClassesPage from './pages/ClassesPage';
import CarsPage from './pages/CarsPage';
import SeasonsPage from './pages/SeasonsPage';
import RaceResultsPage from './pages/RaceResultsPage';
import HomePage from './pages/HomePage';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import SignInPage from './pages/SignInPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSeasonsPage from './pages/admin/AdminSeasonsPage';
import AdminRaceResultsPage from './pages/admin/AdminRaceResultsPage';
import AdminRacersPage from './pages/admin/AdminRacersPage';
import AdminCarsPage from './pages/admin/AdminCarsPage';
import AdminClassesPage from './pages/admin/AdminClassesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public area */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/racers" element={<RacersPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/seasons" element={<SeasonsPage />} />
          <Route path="/race-results" element={<RaceResultsPage />} />
        </Route>

        {/* Auth */}
        <Route path="/signin" element={<SignInPage />} />

        {/* Admin area */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="seasons" element={<AdminSeasonsPage />} />
          <Route path="race-results" element={<AdminRaceResultsPage />} />
          <Route path="racers" element={<AdminRacersPage />} />
          <Route path="cars" element={<AdminCarsPage />} />
          <Route path="classes" element={<AdminClassesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
