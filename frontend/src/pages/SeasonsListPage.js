import React from 'react';
import { Link } from 'react-router-dom';
import { getSeasons } from '../services/api';
import './SeasonsListPage.css'; // new styles

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

  if (loading) {
    return (
      <div className="seasons-page">
        <h1>Seasons</h1>
        <div className="seasons-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="season-card skeleton" key={i}>
              <div className="skeleton-line w60" />
              <div className="skeleton-line w40" />
              <div className="skeleton-pill" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;

  return (
    <div className="seasons-page">
      <h1>Seasons</h1>
      {seasons.length === 0 ? (
        <div className="empty-state">
          <p>No seasons yet.</p>
          <p className="hint">Create one to start tracking leaderboard progress.</p>
        </div>
      ) : (
        <div className="seasons-grid" role="list">
          {seasons.map((s) => {
            const id = s.season_id || s.id;
            const name = s.name || s.title || `Season ${id}`;
            const isActive = s.active || s.status === 'active';
            const eventsCount = s.events_count ?? s.event_count ?? (Array.isArray(s.events) ? s.events.length : null);
            return (
              <Link
                to={`/seasons/${id}`}
                key={id}
                className={`season-card ${isActive ? 'is-active' : 'is-past'}`}
                role="listitem"
              >
                <div className="season-card-head">
                  <h2 className="season-title">{name}</h2>
                  <span className={`status-badge ${isActive ? 'active' : 'past'}`}>{isActive ? 'Current' : 'Past'}</span>
                </div>
                <div className="season-meta">
                  {eventsCount != null && (
                    <span className="meta-chip">{eventsCount} event{eventsCount === 1 ? '' : 's'}</span>
                  )}
                </div>
                <div className="chevron" aria-hidden="true">›</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SeasonsListPage;