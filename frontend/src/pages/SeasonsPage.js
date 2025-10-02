import React, { useEffect, useState } from 'react';
import { getSeasons, createSeason, updateSeason, deleteSeason } from '../services/api';

function SeasonsPage() {
  const [seasons, setSeasons] = useState([]);
  const [newSeason, setNewSeason] = useState({
    name: '',
    start_date: '',
    end_date: '',
    drop_lowest_count: 0,
  });

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await getSeasons();
      setSeasons(response.data);
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  };

  const handleCreateSeason = async () => {
    try {
      await createSeason(newSeason);
      fetchSeasons();
      setNewSeason({ name: '', start_date: '', end_date: '', drop_lowest_count: 0 });
    } catch (error) {
      console.error('Error creating season:', error);
    }
  };

  const handleUpdateSeason = async (id, updatedData) => {
    try {
      await updateSeason(id, updatedData);
      fetchSeasons();
    } catch (error) {
      console.error('Error updating season:', error);
    }
  };

  const handleDeleteSeason = async (id) => {
    try {
      await deleteSeason(id);
      fetchSeasons();
    } catch (error) {
      console.error('Error deleting season:', error);
    }
  };

  return (
    <div>
      <h1>Seasons</h1>
      <div>
        <input
          type="text"
          placeholder="Season Name"
          value={newSeason.name}
          onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={newSeason.start_date}
          onChange={(e) => setNewSeason({ ...newSeason, start_date: e.target.value })}
        />
        <input
          type="date"
          placeholder="End Date"
          value={newSeason.end_date}
          onChange={(e) => setNewSeason({ ...newSeason, end_date: e.target.value })}
        />
        <input
          type="number"
          placeholder="Drop Lowest Count"
          value={newSeason.drop_lowest_count}
          onChange={(e) => setNewSeason({ ...newSeason, drop_lowest_count: parseInt(e.target.value, 10) || 0 })}
        />
        <button onClick={handleCreateSeason}>Add Season</button>
      </div>
      <ul>
        {seasons.map((season) => (
          <li key={season.season_id}>
            {season.name} ({season.start_date} - {season.end_date}) - Drop Lowest: {season.drop_lowest_count}
            <button
              onClick={() =>
                handleUpdateSeason(season.season_id, {
                  ...season,
                  name: 'Updated Season Name',
                })
              }
            >
              Update
            </button>
            <button onClick={() => handleDeleteSeason(season.season_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SeasonsPage;