import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Tekly Leaderboard</h1>
      <p>Select a section:</p>
      <ul style={{ lineHeight: 1.8 }}>
        <li><Link to="/racers">Racers</Link></li>
        <li><Link to="/classes">Classes</Link></li>
        <li><Link to="/cars">Cars</Link></li>
        <li><Link to="/seasons">Seasons</Link></li>
        <li><Link to="/race-results">Race Results</Link></li>
      </ul>
    </div>
  );
}

export default HomePage;