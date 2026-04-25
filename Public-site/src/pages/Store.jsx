import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useCart } from '../context/CartContext';



const CATEGORIES = ['All', 'Authentic', 'Lifestyle', 'Fan Gear', 'Accessories'];

export default function Store() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [catFilter, setCatFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(data);
      } catch (e) {
        console.warn('Products fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 600);
  };

  const filtered = products.filter(p => {
    const matchCat = catFilter === 'All' || p.category === catFilter;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-fade page-container">
      <div className="page-header page-header--row">
        <div>
          <div className="page-pre">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Official Merch
          </div>
          <h1 className="page-title">Team Store</h1>
          <div className="page-bar"></div>
        </div>
        <div className="store-controls">
          <div className="page-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`filter-tab${catFilter === c ? ' filter-tab--active' : ''}`}
                onClick={() => setCatFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-grid">
        {loading ? (
          <p className="empty-state">Loading products...</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No products found.</p>
        ) : (
          filtered.map(product => (
            <div key={product.id} className="product-card">
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
                    onClick={() => handleAdd(product)}
                  >
                    {addedId === product.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
