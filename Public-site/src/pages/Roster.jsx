import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const demoActive = Array.from({ length: 8 }, (_, i) => ({
  id: `p${i + 1}`,
  name: 'Player Name',
  number: 9 + i + 1,
  position: ['GUARD', 'FORWARD', 'CENTER', 'GUARD', 'FORWARD', 'GUARD', 'CENTER', 'FORWARD'][i],
  photoURL: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400&auto=format&fit=crop',
  stats: { ppg: (10 + (i + 1) * 1.5).toFixed(1), reb: (3 + (i + 1) * 0.8).toFixed(1), ast: (2 + i * 0.5).toFixed(1) },
  status: 'active',
}));

const demoFormer = [
  { id: 'pf1', name: 'Former Player', number: 3, position: 'GUARD', photoURL: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400&auto=format&fit=crop', status: 'departed', departedDate: '2025-06-01', stats: { ppg: '14.2', reb: '4.1', ast: '3.8' } },
];

const POSITIONS = ['All', 'Guards', 'Forwards', 'Centers'];
const posMap = { Guards: 'GUARD', Forwards: 'FORWARD', Centers: 'CENTER' };

export default function Roster() {
  const [players, setPlayers] = useState([]);
  const [former, setFormer] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const activeQ = query(collection(db, 'players'), where('status', '==', 'active'));
        const departedQ = query(collection(db, 'players'), where('status', '==', 'departed'));
        const [aSnap, dSnap] = await Promise.all([getDocs(activeQ), getDocs(departedQ)]);
        const active = aSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const departed = dSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPlayers(active.length > 0 ? active : demoActive);
        setFormer(departed.length > 0 ? departed : demoFormer);
      } catch {
        setPlayers(demoActive);
        setFormer(demoFormer);
      }
    };
    fetch();
  }, []);

  const applyFilter = (list) => {
    return list.filter(p => {
      const matchPos = filter === 'All' || p.position === posMap[filter];
      const matchSearch = !searchQuery ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.number).includes(searchQuery);
      return matchPos && matchSearch;
    });
  };

  const filteredActive = applyFilter(players);
  const filteredFormer = applyFilter(former);

  return (
    <div className="page-fade page-container">
      <div className="page-header page-header--row">
        <div>
          <h1 className="page-title">Team Roster</h1>
          <div className="page-bar"></div>
        </div>
        <div className="roster-controls">
          <div className="page-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search player..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {POSITIONS.map(pos => (
              <button
                key={pos}
                className={`filter-tab${filter === pos ? ' filter-tab--active' : ''}`}
                onClick={() => setFilter(pos)}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Players */}
      <div className="player-grid">
        {filteredActive.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
        {filteredActive.length === 0 && (
          <p className="empty-state">No active players match your search.</p>
        )}
      </div>

      {/* Former Players */}
      {filteredFormer.length > 0 && (
        <>
          <div className="section-divider">
            <h2 className="section-divider__title">Former Players</h2>
            <div className="page-bar"></div>
          </div>
          <div className="player-grid player-grid--former">
            {filteredFormer.map(player => (
              <PlayerCard key={player.id} player={player} former />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PlayerCard({ player, former }) {
  return (
    <div className={`player-card-full${former ? ' player-card-full--former' : ''}`}>
      <div className="player-card-full__img">
        <img
          src={player.photoURL || 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400&auto=format&fit=crop'}
          alt={player.name}
        />
        <div className="player-card-full__overlay" />
        <div className="player-card-full__num">#{player.number}</div>
        {former && <div className="player-card-full__departed">DEPARTED</div>}
      </div>
      <div className="player-card-full__info">
        <div className="player-card-full__pos">#{player.number} | {player.position}</div>
        <h3 className="player-card-full__name">{player.name}</h3>
        <div className="player-stats">
          <div className="stat"><span className="stat__label">PPG</span><span className="stat__val">{player.stats?.ppg || '—'}</span></div>
          <div className="stat"><span className="stat__label">REB</span><span className="stat__val">{player.stats?.reb || '—'}</span></div>
          <div className="stat"><span className="stat__label">AST</span><span className="stat__val">{player.stats?.ast || '—'}</span></div>
        </div>
        {former && player.departedDate && (
          <p className="player-card-full__depart">Departed {new Date(player.departedDate).toLocaleDateString('en-RW', { year: 'numeric', month: 'short' })}</p>
        )}
      </div>
    </div>
  );
}
