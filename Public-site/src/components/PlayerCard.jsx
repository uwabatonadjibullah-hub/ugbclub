import React from 'react';

export default function PlayerCard({ player, former, className = "" }) {
  return (
    <div className={`player-card-full ${former ? 'player-card-full--former' : ''} ${className}`}>
      <div className="player-card-full__img">
        <img
          src={player.photoURL || 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400&auto=format&fit=crop'}
          alt={player.name}
          loading="lazy"
        />
        <div className="player-card-full__overlay" />
        <div className="player-card-full__num">#{player.number}</div>
        {former && <div className="player-card-full__departed">DEPARTED</div>}
      </div>
      <div className="player-card-full__info">
        <div className="player-card-full__pos">#{player.number} | {player.position}</div>
        <h3 className="player-card-full__name">{player.name}</h3>
        <div className="player-stats">
          <div className="stat">
            <span className="stat__label">PPG</span>
            <span className="stat__val">{player.stats?.ppg || '—'}</span>
          </div>
          <div className="stat">
            <span className="stat__label">REB</span>
            <span className="stat__val">{player.stats?.reb || '—'}</span>
          </div>
          <div className="stat">
            <span className="stat__label">AST</span>
            <span className="stat__val">{player.stats?.ast || '—'}</span>
          </div>
        </div>
        {former && player.departedDate && (
          <p className="player-card-full__depart">
            Departed {new Date(player.departedDate).toLocaleDateString('en-RW', { year: 'numeric', month: 'short' })}
          </p>
        )}
      </div>
    </div>
  );
}
