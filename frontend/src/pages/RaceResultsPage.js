import React, { useEffect, useState } from 'react';
import { getSeasons, getRaces, getRaceResults, getSeasonParticipation, getCars, createRaceResult } from '../services/api';

function RaceResultsPage() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [races, setRaces] = useState([]);
  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [raceResults, setRaceResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState([]);
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ participation_id: '', car_id: '', position: '', points: '', fastest_lap: false });

  // Load seasons on mount + preload cars
  useEffect(() => {
    (async () => {
      try {
        setError('');
        const [seasonsRes, carsRes] = await Promise.all([getSeasons(), getCars()]);
        setSeasons(seasonsRes.data || []);
        setCars(carsRes.data || []);
      } catch (e) {
        setError('Failed to load seasons or cars');
        console.error(e);
      }
    })();
  }, []);

  // When a season is selected, load races and participation; reset race/results/form
  useEffect(() => {
    (async () => {
      setRaces([]);
      setSelectedRaceId('');
      setRaceResults([]);
      setParticipants([]);
      setShowForm(false);
      setForm({ participation_id: '', car_id: '', position: '', points: '', fastest_lap: false });
      if (!selectedSeasonId) return;
      try {
        setError('');
        const [racesRes, partsRes] = await Promise.all([
          getRaces(selectedSeasonId),
          getSeasonParticipation(selectedSeasonId),
        ]);
        setRaces(racesRes.data || []);
        setParticipants(partsRes.data || []);
      } catch (e) {
        setError('Failed to load races or participants');
        console.error(e);
      }
    })();
  }, [selectedSeasonId]);

  // When a race is selected, load race results
  useEffect(() => {
    (async () => {
      if (!selectedRaceId) return;
      try {
        setLoading(true);
        setError('');
        const res = await getRaceResults(selectedRaceId);
        setRaceResults(res.data || []);
      } catch (e) {
        setError('Failed to load race results');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedRaceId]);

  const selectedParticipant = participants.find(
    (p) => String(p.participation_id) === String(form.participation_id)
  );
  const filteredCars = selectedParticipant
    ? cars.filter((c) => String(c.class_id) === String(selectedParticipant.class_id))
    : [];

  const handleFormChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'participation_id' ? { car_id: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRaceId) {
      setError('Select a race first');
      return;
    }
    if (!form.participation_id || !form.car_id || !form.position || form.points === '') {
      setError('Fill all required fields');
      return;
    }
    try {
      setError('');
      await createRaceResult({
        race_id: selectedRaceId,
        participation_id: Number(form.participation_id),
        car_id: Number(form.car_id),
        position: Number(form.position),
        points: Number(form.points),
        fastest_lap: Boolean(form.fastest_lap),
      });
      setShowForm(false);
      setForm({ participation_id: '', car_id: '', position: '', points: '', fastest_lap: false });
      const res = await getRaceResults(selectedRaceId);
      setRaceResults(res.data || []);
    } catch (e) {
      const msg = e?.response?.data || 'Failed to create race result';
      setError(msg);
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Race Results</h1>

      {/* Season selector */}
      <div style={{ marginBottom: 12 }}>
        <label>
          Season:&nbsp;
          <select
            value={selectedSeasonId}
            onChange={(e) => setSelectedSeasonId(e.target.value)}
          >
            <option value="">Select Season</option>
            {seasons.map((s) => (
              <option key={s.season_id} value={s.season_id}>
                {s.name} ({s.start_date} - {s.end_date})
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Race selector (shown once a season is selected) */}
      {selectedSeasonId && (
        <div style={{ marginBottom: 12 }}>
          <label>
            Race:&nbsp;
            <select
              value={selectedRaceId}
              onChange={(e) => setSelectedRaceId(e.target.value)}
            >
              <option value="">Select Race</option>
              {races.map((r) => (
                <option key={r.race_id} value={r.race_id}>
                  {r.track_name} ({r.race_date})
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <div>Loading...</div>}

      {/* Race header using selected race, fallback to result payload */}
      {selectedRaceId && (
        (() => {
          const selectedRace = races.find((r) => String(r.race_id) === String(selectedRaceId));
          const headerTrack = selectedRace?.track_name || raceResults[0]?.race_track_name;
          const headerDate = selectedRace?.race_date || raceResults[0]?.race_date;
          return (headerTrack || headerDate) ? (
            <div style={{ margin: '12px 0', fontWeight: 600 }}>
              {headerTrack || 'Race'} {headerDate ? `– ${headerDate}` : ''}
            </div>
          ) : null;
        })()
      )}

      {/* Toggle to add a result (only when race selected) */}
      {selectedRaceId && (
        <div style={{ margin: '12px 0' }}>
          <button onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Cancel' : 'Add Result'}
          </button>
        </div>
      )}

      {/* Add Result form */}
      {selectedRaceId && showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 16, border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <label>
              Participant
              <select
                value={form.participation_id}
                onChange={(e) => handleFormChange('participation_id', e.target.value)}
                required
              >
                <option value="">Select participant</option>
                {participants.map((p) => (
                  <option key={p.participation_id} value={p.participation_id}>
                    {p.steam_name} – {p.class_name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Car
              <select
                value={form.car_id}
                onChange={(e) => handleFormChange('car_id', e.target.value)}
                required
                disabled={!selectedParticipant}
              >
                <option value="">{selectedParticipant ? 'Select car' : 'Select participant first'}</option>
                {filteredCars.map((c) => (
                  <option key={c.car_id} value={c.car_id}>
                    {c.car_name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Position
              <input
                type="number"
                min="1"
                value={form.position}
                onChange={(e) => handleFormChange('position', e.target.value)}
                required
              />
            </label>

            <label>
              Points
              <input
                type="number"
                min="0"
                value={form.points}
                onChange={(e) => handleFormChange('points', e.target.value)}
                required
              />
            </label>

            <label style={{ alignSelf: 'center' }}>
              <input
                type="checkbox"
                checked={form.fastest_lap}
                onChange={(e) => handleFormChange('fastest_lap', e.target.checked)}
              />
              &nbsp;Fastest Lap
            </label>
          </div>
          <div style={{ marginTop: 12 }}>
            <button type="submit">Save Result</button>
          </div>
        </form>
      )}

      {/* Results table */}
      {selectedRaceId && !loading && (
        raceResults.length === 0 ? (
          <div>No results yet for this race.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Position</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Racer</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Class</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Car</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Points</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Fastest Lap</th>
              </tr>
            </thead>
            <tbody>
              {raceResults
                .slice()
                .sort((a, b) => a.position - b.position)
                .map((res) => (
                  <tr key={res.result_id}>
                    <td style={{ padding: '6px 4px' }}>{res.position}</td>
                    <td style={{ padding: '6px 4px' }}>
                      {res.racer_name || 'Unknown racer'}
                      {res.racer_ac_name ? ` (${res.racer_ac_name})` : ''}
                    </td>
                    <td style={{ padding: '6px 4px' }}>{res.class_name || '-'}</td>
                    <td style={{ padding: '6px 4px' }}>{res.car_name || res.car_id}</td>
                    <td style={{ padding: '6px 4px' }}>{res.points}</td>
                    <td style={{ padding: '6px 4px' }}>{res.fastest_lap ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}

export default RaceResultsPage;