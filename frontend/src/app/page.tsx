"use client";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? {...item, quantity: item.quantity + 1} : item
        );
      }
      return [...prev, {product, quantity: 1}];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      const res = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: totalPrice,
          customer: { name: "Guest User", email: "guest@example.com" }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Order placed successfully! ID: ' + data.orderId);
        setCart([]);
        setCartOpen(false);
      }
    } catch (err) {
      alert('Failed to place order.');
    }
  };

  return (
    <main>
      <nav className="navbar">
        <div className="nav-logo">CHIKENPEDIA</div>
        <div className="nav-links">
          <a href="#" className="nav-link">Home</a>
          <a href="#menu" className="nav-link">Menu</a>
          <a href="http://localhost:8080/admin" className="nav-link">Admin</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <img src="/images/hero.png" alt="Fried Chicken Background" className="hero-image" />
        </div>
        <div className="hero-content">
          <h1 className="title">The Art of <br/>Perfect Chicken</h1>
          <p className="subtitle">
            Experience the crispiest, juiciest, most perfectly seasoned fried chicken on the planet. 
            Crafted with passion, delivered with speed.
          </p>
          <button className="cta-button" onClick={() => document.getElementById('menu')?.scrollIntoView({behavior: 'smooth'})}>
            Discover Our Menu
          </button>
        </div>
      </section>

      <div className="main-container">
        <div className="grid" id="menu">
          {loading ? (
            <p className="loading-text">Preparing the feast...</p>
          ) : products.length > 0 ? (
            products.map(p => (
              <div className="glass-panel" key={p.id}>
                <div className="product-image-container">
                  <span style={{color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px'}}>Premium Quality</span>
                </div>
                <h2 className="product-title">{p.name}</h2>
                <p className="product-desc">{p.description}</p>
                <div className="price-row">
                  <span className="price">${p.price}</span>
                  <button className="buy-btn" onClick={() => addToCart(p)}>Add to Cart</button>
                </div>
              </div>
            ))
          ) : (
            <p>No chicken found. Contact administration.</p>
          )}
        </div>
      </div>

      <footer style={{padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', color: 'var(--text-secondary)'}}>
        <div className="nav-logo" style={{marginBottom: '1rem', fontSize: '1.2rem'}}>CHIKENPEDIA</div>
        <p>&copy; 2026 Chikenpedia. Crafted for chicken lovers everywhere.</p>
      </footer>


      <button className="floating-cart-btn" onClick={() => setCartOpen(true)}>
        🛒
        {cart.length > 0 && <span className="cart-badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>}
      </button>

      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Selection</h2>
          <button style={{background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer'}} onClick={() => setCartOpen(false)}>×</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{color: 'var(--text-muted)'}}>Your bucket is empty.</p>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.product.id}>
                <div>
                  <div style={{fontWeight: 600}}>{item.product.name}</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Qty: {item.quantity}</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{color: 'var(--primary-color)', fontWeight: 800}}>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</div>
                  <button style={{background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem'}} onClick={() => removeFromCart(item.product.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-total">
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
            <span>Total</span>
            <span style={{fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)'}}>${totalPrice.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" disabled={cart.length === 0} onClick={handleCheckout}>
            Checkout Now
          </button>
        </div>
      </div>
    </main>
  );
}


