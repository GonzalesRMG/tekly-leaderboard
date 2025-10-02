import React from 'react';
import { Link } from 'react-router-dom';
import { getSeasons } from '../services/api';

function SeasonsListPage() {
  const [seasons, setSeasons] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await getSeasons();
        if (!ignore) setSeasons(res.data || []);
      } catch (e) {
        if (!ignore) setError(e.message || 'Failed to load seasons');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  if (loading) return <p>Loading seasons…</p>;
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;

  return (
    <div>
      <h1>Seasons</h1>
      {seasons.length === 0 ? (
        <p>No seasons yet.</p>
      ) : (
        <ul style={{ lineHeight: 1.8 }}>
          {seasons.map((s) => (
            <li key={s.id}>
              <Link to={`/seasons/${s.id}`}>{s.name || s.title || `Season ${s.id}`}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SeasonsListPage;