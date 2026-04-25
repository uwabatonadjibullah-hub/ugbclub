import React, { useEffect, useState, useRef } from 'react';
import { collection, query, getDocs, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const demoVideos = [
  { id: 'm1', title: 'The Rise of UGB: Season 1', type: 'Documentary Feature', featured: true, thumbnailURL: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop', viewCount: 1240 },
  { id: 'm2', title: 'Training Camp: Week 1', type: 'Highlights', thumbnailURL: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', viewCount: 380 },
  { id: 'm3', title: "Coach's Locker Room Speech", type: 'Highlights', thumbnailURL: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', viewCount: 520 },
  { id: 'm4', title: 'Top 10 Plays of the Month', type: 'Highlights', thumbnailURL: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', viewCount: 890 },
  { id: 'm5', title: 'AZAM Partnership Reveal', type: 'Highlights', thumbnailURL: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', viewCount: 312 },
  { id: 'm6', title: 'Player Spotlight: #12', type: 'Spotlight', thumbnailURL: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', viewCount: 760 },
  { id: 'm7', title: 'Road Game Vlog', type: 'Vlog', thumbnailURL: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop', viewCount: 418 },
];

export default function MediaVault() {
  const [media, setMedia] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setMedia(data.length > 0 ? data : demoVideos);
      } catch { setMedia(demoVideos); }
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
        {filtered.map(m => (
          <VideoCard key={m.id} media={m} onPlay={() => setPlaying(m.id)} playing={playing === m.id} />
        ))}
        {filtered.length === 0 && <p className="empty-state">No videos found.</p>}
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
