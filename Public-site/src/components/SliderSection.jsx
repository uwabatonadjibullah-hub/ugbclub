import React, { useRef, useState } from 'react';

export default function SliderSection({ title, subtitle, viewAllLabel, onViewAll, children, scrollAmount = 400 }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const scroll = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    }
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    startXRef.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftRef.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
  };
  const onMouseLeave = () => { setIsDragging(false); if (trackRef.current) trackRef.current.style.cursor = 'grab'; };
  const onMouseUp = () => { setIsDragging(false); if (trackRef.current) trackRef.current.style.cursor = 'grab'; };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <div className="slider-section">
      <div className="slider-section__header">
        <div>
          {subtitle && <p className="slider-section__subtitle">{subtitle}</p>}
          <h2 className="slider-section__title">{title}</h2>
          <div className="slider-section__bar"></div>
        </div>
        {onViewAll && (
          <button className="view-all-btn" onClick={onViewAll}>
            {viewAllLabel || 'View All'}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        )}
      </div>

      <div className="slider-wrapper">
        {/* Left Arrow */}
        <button className="slider-arrow slider-arrow--left" onClick={() => scroll(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        {/* Track */}
        <div
          className="slider-track"
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          style={{ cursor: 'grab' }}
        >
          {children}
        </div>

        {/* Right Arrow */}
        <button className="slider-arrow slider-arrow--right" onClick={() => scroll(1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
