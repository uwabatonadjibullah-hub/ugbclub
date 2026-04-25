import React, { useEffect, useState, useRef } from 'react';
import { collection, query, getDocs, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/firebase';



export default function MediaVault() {
  const [media, setMedia] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playing, setPlaying] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setMedia(data);
      } catch (e) {
        console.warn('Media fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const featured = media.find(m => m.featured) || media[0];
  const grid = media.filter(m => !m.featured || m.id !== featured?.id);

  const filtered = grid.filter(m =>
    !searchQuery ||
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-fade page-container">
      <div className="page-header page-header--row">
        <div>
          <h1 className="page-title">UGB <span className="text-accent">TV</span></h1>
          <div className="page-bar"></div>
          <p className="page-sub">
            Exclusive highlights, cinematic documentaries, and behind-the-scenes access.<br />
            <strong>Produced by NAD PRODUCTION.</strong>
          </p>
        </div>
        <div className="page-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <VideoCard media={featured} featured onPlay={() => setPlaying(featured.id)} playing={playing === featured.id} />
      )}

      {/* Grid */}
      <div className="media-grid">
        {loading ? (
          <p className="empty-state">Loading videos...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No videos found.</p>
        ) : (
          filtered.map(m => (
            <VideoCard key={m.id} media={m} onPlay={() => setPlaying(m.id)} playing={playing === m.id} />
          ))
        )}
      </div>
    </div>
  );
}

function VideoCard({ media, featured, onPlay, playing }) {
  const timerRef = useRef(null);
  const [counted, setCounted] = useState(false);

  const handlePlay = () => {
    onPlay();
    if (!counted) {
      // 10-second view rule
      timerRef.current = setTimeout(async () => {
        setCounted(true);
        try {
          await updateDoc(doc(db, 'media', media.id), { viewCount: increment(1) });
        } catch { /* demo mode */ }
      }, 10000);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className={`video-card${featured ? ' video-card--featured' : ''}`} onClick={handlePlay}>
      {playing && media.videoURL ? (
        <div className="video-card__player">
          {media.embedCode ? (
            <div dangerouslySetInnerHTML={{ __html: media.embedCode }} />
          ) : (
            <video src={media.videoURL} controls autoPlay className="video-card__video" />
          )}
        </div>
      ) : (
        <>
          <img
            src={media.thumbnailURL || 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop'}
            alt={media.title}
            className="video-card__thumb"
          />
          <div className="video-card__overlay" />
          <div className="video-card__play-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width={featured ? 40 : 24} height={featured ? 40 : 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </div>
          <div className="video-card__meta">
            {featured && <span className="video-badge">Documentary Feature</span>}
            {!featured && <span className="video-tag">{media.type || 'Highlights'}</span>}
            <h3 className={`video-card__title${featured ? ' video-card__title--lg' : ''}`}>{media.title}</h3>
            {media.viewCount > 0 && (
              <span className="video-views">{media.viewCount.toLocaleString()} views</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
