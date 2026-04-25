import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartPanel from './components/CartPanel';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Roster from './pages/Roster';
import Store from './pages/Store';
import MediaVault from './pages/MediaVault';
import Payment from './pages/Payment';
import './index.css';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/roster" element={<Roster />} />
              <Route path="/store" element={<Store />} />
              <Route path="/media" element={<MediaVault />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <CartPanel />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
