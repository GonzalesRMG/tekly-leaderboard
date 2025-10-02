import React, { useEffect, useState } from 'react';
import { getRacers, createRacer, updateRacer, deleteRacer } from '../services/api';

function RacersPage() {
  const [racers, setRacers] = useState([]);
  const [newRacer, setNewRacer] = useState({ steam_name: '', ac_name: '', rank: 'Rookie' });

  useEffect(() => {
    fetchRacers();
  }, []);

  const fetchRacers = async () => {
    try {
      const response = await getRacers();
      console.log('Fetched racers:', response.data); // Debugging log
      setRacers(response.data);
    } catch (error) {
      console.error('Error fetching racers:', error);
    }
  };

  const handleCreateRacer = async () => {
    try {
      await createRacer(newRacer);
      fetchRacers();
      setNewRacer({ steam_name: '', ac_name: '', rank: 'Rookie' });
    } catch (error) {
      console.error('Error creating racer:', error);
    }
  };

  const handleUpdateRacer = async (id, updatedData) => {
    try {
      await updateRacer(id, updatedData);
      fetchRacers();
    } catch (error) {
      console.error('Error updating racer:', error);
    }
  };

  const handleDeleteRacer = async (id) => {
    try {
      await deleteRacer(id);
      fetchRacers();
    } catch (error) {
      console.error('Error deleting racer:', error);
    }
  };

  return (
    <div>
      <h1>Racers</h1>
      <div>
        <input
          type="text"
          placeholder="Steam Name"
          value={newRacer.steam_name}
          onChange={(e) => setNewRacer({ ...newRacer, steam_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="AC Name"
          value={newRacer.ac_name}
          onChange={(e) => setNewRacer({ ...newRacer, ac_name: e.target.value })}
        />
        <select
          value={newRacer.rank}
          onChange={(e) => setNewRacer({ ...newRacer, rank: e.target.value })}
        >
          <option value="Rookie">Rookie</option>
          <option value="Amateur">Amateur</option>
          <option value="Pro">Pro</option>
          <option value="Expert">Expert</option>
        </select>
        <button onClick={handleCreateRacer}>Add Racer</button>
      </div>
      <ul>
        {racers.map((racer) => (
          <li key={racer.racer_id}>
            {racer.steam_name} ({racer.ac_name}) - {racer.rank}
            <button onClick={() => handleUpdateRacer(racer.racer_id, { ...racer, rank: 'Pro' })}>Promote to Pro</button>
            <button onClick={() => handleDeleteRacer(racer.racer_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RacersPage;