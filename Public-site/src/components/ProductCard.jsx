import React from 'react';

export default function ProductCard({ product, onAdd, isAdded, className = "" }) {
  return (
    <div className={`product-card ${className}`}>
      <div className="product-card__img">
        <img src={product.imageURL} alt={product.name} loading="lazy" />
        {product.isNew && <span className="product-badge">NEW</span>}
      </div>
      <div className="product-card__body">
        <p className="product-card__cat">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__footer">
          <span className="product-card__price">
            {new Intl.NumberFormat('en-RW').format(product.price)} RWF
          </span>
          <button
            className={`add-btn${isAdded ? ' add-btn--added' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            aria-label="Add to cart"
          >
            {isAdded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
