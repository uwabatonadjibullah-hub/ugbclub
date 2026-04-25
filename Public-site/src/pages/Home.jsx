import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useCart } from '../context/CartContext';
import SliderSection from '../components/SliderSection';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [schedule, setSchedule] = useState([]);
  const [players, setPlayers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    // Fetch recent schedule (upcoming + 2 past)
    const fetchSchedule = async () => {
      try {
        const q = query(collection(db, 'schedule'), orderBy('date', 'desc'), limit(5));
        const snap = await getDocs(q);
        setSchedule(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.warn('Schedule fetch:', e); }
    };

    // Fetch active players
    const fetchPlayers = async () => {
      try {
        const q = query(collection(db, 'players'), where('status', '==', 'active'), limit(8));
        const snap = await getDocs(q);
        setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.warn('Players fetch:', e); }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(6));
        const snap = await getDocs(q);
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.warn('Products fetch:', e); }
    };

    Promise.all([fetchSchedule(), fetchPlayers(), fetchProducts()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 600);
  };



  return (
    <div className="page-fade">
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop')` }} />
        <div className="hero__overlay" />
        <div className="hero__content">
          <div className="hero__badge">Official Digital Home</div>
          <h1 className="hero__title">
            The <span className="hero__title--accent">UNITED</span><br />
            Generation for<br />
            Basketball.
          </h1>
          <p className="hero__sub">
            Experience the energy, track the stats, and watch exclusive cinematic content. Welcome to the United Generation.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => navigate('/schedule')}>
              Match Center
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
            <button className="btn btn--ghost" onClick={() => navigate('/media')}>
              Watch Highlights
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* MATCH CENTER SLIDER */}
      <section className="home-section home-section--dark-alt">
        <div className="container">
          <SliderSection
            title="Match Center"
            viewAllLabel="Full Schedule"
            onViewAll={() => navigate('/schedule')}
            scrollAmount={480}
          >
            {loading ? <div style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>Loading...</div> : schedule.length === 0 ? <div style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>No content available</div> : schedule.map(game => (
              <div key={game.id} className={`match-card${game.status === 'upcoming' ? ' match-card--next' : ''}`}>
                <div className="match-card__header">
                  {game.status === 'upcoming'
                    ? <span className="match-tag match-tag--live"><span className="pulse-dot"></span> Next Match</span>
                    : <span className="match-tag">Final Result</span>
                  }
                  <span className="match-date">
                    {game.date ? new Date(game.date).toLocaleDateString('en-RW', { month: 'short', day: 'numeric' }) : '—'}
                    {game.time ? ` • ${game.time}` : ''}
                  </span>
                </div>
                <div className="match-card__teams">
                  <div className="match-team">
                    <div className="team-logo team-logo--ugb">UGB</div>
                    <span className="team-name">United Gen.</span>
                    {game.status === 'completed' && (
                      <span className={`score ${game.result === 'win' ? 'score--win' : 'score--loss'}`}>{game.ugbScore}</span>
                    )}
                  </div>
                  <div className="match-vs">
                    {game.status === 'upcoming' ? 'VS' : (
                      <span className={`result-badge result-badge--${game.result}`}>{game.result?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="match-team">
                    <div className="team-logo team-logo--opp">{game.opponentAbbr || 'OPP'}</div>
                    <span className="team-name team-name--dim">{game.opponent || 'Opponent'}</span>
                    {game.status === 'completed' && (
                      <span className="score score--dim">{game.opponentScore}</span>
                    )}
                  </div>
                </div>
                <div className="match-venue">@ {game.venue || 'TBD'}</div>
              </div>
            ))}
          </SliderSection>
        </div>
      </section>

      {/* THE SQUAD SLIDER */}
      <section className="home-section">
        <div className="container">
          <SliderSection
            title="The Squad"
            viewAllLabel="Full Roster"
            onViewAll={() => navigate('/roster')}
            scrollAmount={320}
          >
            {loading ? <div style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>Loading...</div> : players.length === 0 ? <div style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>No content available</div> : players.map(player => (
              <div key={player.id} className="player-card" onClick={() => navigate('/roster')}>
                <div className="player-card__img">
                  <img
                    src={player.photoURL || 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400&auto=format&fit=crop'}
                    alt={player.name}
                  />
                  <div className="player-card__overlay" />
                  <span className="player-card__num">#{player.number}</span>
                </div>
                <div className="player-card__info">
                  <span className="player-card__pos">#{player.number} | {player.position}</span>
                  <h3 className="player-card__name">{player.name}</h3>
                </div>
              </div>
            ))}
            {/* View All Card */}
            <div className="player-card player-card--view-all" onClick={() => navigate('/roster')}>
              <div className="view-all-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </div>
              <span>View All Players</span>
            </div>
          </SliderSection>
        </div>
      </section>

      <section className="home-section home-section--dark-alt">
        <div className="container">
          <div className="slider-section__header">
            <div>
              <p className="slider-section__subtitle">Fresh Drops</p>
              <h2 className="slider-section__title">Official Merch</h2>
              <div className="slider-section__bar"></div>
            </div>
            <button className="view-all-btn" onClick={() => navigate('/store')}>
              Shop All
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <div className="product-grid" style={{ marginTop: '2rem' }}>
            {loading ? (
              <div style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>Loading...</div>
            ) : products.length === 0 ? (
              <div style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>No content available</div>
            ) : (
              products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAdd={handleAddToCart} 
                  isAdded={addedId === product.id} 
                />
              ))
            )}
          </div>
          
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <button className="btn btn--ghost" onClick={() => navigate('/store')}>
              Visit Full Store
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
