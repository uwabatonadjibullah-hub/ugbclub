import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useCart } from '../context/CartContext';
import SliderSection from '../components/SliderSection';

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

      {/* OFFICIAL MERCH SLIDER */}
      <section className="home-section home-section--dark-alt">
        <div className="container">
          <SliderSection
            title="Official Merch"
            subtitle="Fresh Drops"
            viewAllLabel="Shop All"
            onViewAll={() => navigate('/store')}
            scrollAmount={360}
          >
            {loading ? <div style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>Loading...</div> : products.length === 0 ? <div style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>No content available</div> : products.map(product => (
              <div key={product.id} className="product-card product-card--slider">
                <div className="product-card__img">
                  <img src={product.imageURL} alt={product.name} />
                  {product.isNew && <span className="product-badge">NEW</span>}
                </div>
                <div className="product-card__body">
                  <p className="product-card__cat">{product.category}</p>
                  <h3 className="product-card__name">{product.name}</h3>
                  <div className="product-card__footer">
                    <span className="product-card__price">{new Intl.NumberFormat('en-RW').format(product.price)} RWF</span>
                    <button
                      className={`add-btn${addedId === product.id ? ' add-btn--added' : ''}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedId === product.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </SliderSection>
        </div>
      </section>
    </div>
  );
}
