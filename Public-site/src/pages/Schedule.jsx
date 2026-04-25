import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { seedData } from '../data/seedData';

const demoGames = seedData.fixtures_2026.map((f, i) => ({
  id: `seed_f${i}`,
  ...f
}));

export default function Schedule() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'schedule'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setGames(data.length > 0 ? data : demoGames);
      } catch { setGames(demoGames); }
    };
    fetch();
  }, []);

  const filtered = games.filter(g =>
    !searchQuery ||
    g.opponent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fmt = (dateStr) => {
    if (!dateStr) return { day: '—', date: '—', month: '—' };
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    };
  };

  return (
    <div className="page-fade page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Season Schedule</h1>
          <div className="page-bar"></div>
          <p className="page-sub">2026 Regular Season &amp; Playoffs</p>
        </div>
        <div className="page-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search opponent or venue..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="schedule-list">
        {filtered.map(game => {
          const { day, date, month } = fmt(game.date);
          return (
            <div key={game.id} className={`schedule-row${game.status === 'upcoming' ? ' schedule-row--upcoming' : ' schedule-row--past'}`}>
              <div className="schedule-row__left">
                <div className="schedule-date">
                  <span className="schedule-date__day">{day}</span>
                  <span className="schedule-date__num">{date}</span>
                  <span className="schedule-date__month">{month}</span>
                </div>
                <div className="schedule-teams">
                  <div className="team-logo team-logo--ugb team-logo--sm">UGB</div>
                  <span className="match-vs-sm">{game.isAway ? '@' : 'VS'}</span>
                  <div className="team-logo team-logo--opp team-logo--sm">{game.opponentAbbr || 'OPP'}</div>
                </div>
                <div className="schedule-info">
                  <h3 className="schedule-info__name">{game.opponent || 'Opponent'}</h3>
                  <p className="schedule-info__venue">
                    {game.venue} • {game.status === 'upcoming' ? (game.time || 'TBD') : 'Final'}
                  </p>
                </div>
              </div>
              <div className="schedule-row__right">
                {game.status === 'upcoming' ? (
                  <button className="btn btn--primary btn--sm" onClick={() => alert('Ticket details coming soon!')}>
                    Get Tickets
                  </button>
                ) : (
                  <div className="schedule-result">
                    <div className="schedule-score">
                      <span className={game.result === 'win' ? 'score--win' : 'score--dim'}>{game.ugbScore}</span>
                      <span className="score-sep">–</span>
                      <span className={game.result === 'loss' ? 'score--win' : 'score--dim'}>{game.opponentScore}</span>
                      <span className={`result-badge result-badge--${game.result}`}>{game.result?.toUpperCase()}</span>
                    </div>
                    <button className="icon-btn" onClick={() => navigate('/media')} title="Watch Highlights">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty-state">No games found for &ldquo;{searchQuery}&rdquo;</div>
        )}
      </div>
    </div>
  );
}
