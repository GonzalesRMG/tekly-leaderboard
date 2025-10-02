import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSeasons, getRaces, getRaceResults } from '../services/api';

function SeasonResultsPage() {
  const { seasonId } = useParams();
  const [season, setSeason] = React.useState(null);
  const [races, setRaces] = React.useState([]);
  const [raceResults, setRaceResults] = React.useState({}); // raceId -> results[]
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Load season list to resolve name (if available) and races for this season
        const [seasonsRes, racesRes] = await Promise.all([
          getSeasons().catch(() => ({ data: [] })),
          getRaces(seasonId),
        ]);

        const seasons = seasonsRes?.data || [];
        const found = seasons.find((s) => String(s.season_id || s.id) === String(seasonId));
        if (!ignore) setSeason(found || { season_id: seasonId });

        const racesData = racesRes.data || [];
        if (!ignore) setRaces(racesData);

        // Load results for each race concurrently
        const resultsEntries = await Promise.all(
          racesData.map(async (race) => {
            const rid = race.race_id || race.id;
            try {
              const res = await getRaceResults(rid);
              return [rid, res.data || []];
            } catch (e) {
              return [rid, []];
            }
          })
        );
        if (!ignore) {
          const map = Object.fromEntries(resultsEntries);
          setRaceResults(map);
        }
      } catch (e) {
        if (!ignore) setError(e.message || 'Failed to load season results');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [seasonId]);

  if (loading) return <p>Loading season…</p>;
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;

  return (
    <div>
      <p><Link to="/">← All Seasons</Link></p>
      <h1>{season?.name || season?.title || `Season ${season?.season_id || seasonId}`}</h1>

      {races.length === 0 ? (
        <p>No races yet for this season.</p>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {races.map((race) => {
            const rid = race.race_id || race.id;
            const results = raceResults[rid] || [];
            return (
              <section key={rid} style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
                <header style={{ padding: '8px 12px', background: '#fafafa', borderBottom: '1px solid #eee' }}>
                  <strong>{race.track_name || race.name || `Race ${rid}`}</strong>
                  {(race.race_date || race.date) && (
                    <span style={{ marginLeft: 8, color: '#666' }}>• {new Date(race.race_date || race.date).toLocaleDateString()}</span>
                  )}
                </header>
                <div style={{ padding: 12, overflowX: 'auto' }}>
                  {results.length === 0 ? (
                    <p style={{ margin: 0 }}>No results.</p>
                  ) : (
                    <table cellPadding={8} style={{ borderCollapse: 'collapse', minWidth: 640, width: '100%' }}>
                      <thead>
                        <tr>
                          <th align="left">Position</th>
                          <th align="left">Racer</th>
                          <th align="right">Best Time</th>
                          <th align="right">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r, idx) => (
                          <tr key={r.result_id || r.id || idx} style={{ borderTop: '1px solid #eee' }}>
                            <td>{r.position ?? idx + 1}</td>
                            <td>{r.racer_name || r.racerName || r.driver || r.participation_id || '-'}</td>
                            <td align="right">{r.best_time || r.bestTime || r.time || '-'}</td>
                            <td align="right">{r.points ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SeasonResultsPage;