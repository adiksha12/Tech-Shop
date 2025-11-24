import React from 'react'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const { cart, incQty, decQty, removeItem, isCartOpen, closeCart } = useCart();

  if (!isCartOpen) return null;

  const parsePrice = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const n = String(val).replace(/[^0-9.]/g, "");
    return parseFloat(n) || 0;
  };

  const total = cart.reduce((s, p) => s + parsePrice(p.price) * (p.qty || 1), 0);

  return (
    <div style={styles.overlay} onClick={closeCart}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h5 style={{ margin: 0 }}>Your Cart</h5>
          <button className="btn btn-sm btn-outline-light" onClick={closeCart}>Close</button>
        </div>

        <div style={styles.content}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#bbb' }}>
              <img src="/empty-cart.png" width="140" alt="Empty" />
              <h5>Your Cart is Empty</h5>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} style={styles.item}>
                  <img src={item.image} width={90} alt={item.name} />
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <h6 style={{ margin: 0 }}>{item.name}</h6>
                    <p style={{ margin: '6px 0' }}>₹{parsePrice(item.price).toLocaleString('en-IN')}</p>

                    <div className="d-flex align-items-center" style={{ gap: 8 }}>
                      <button className="btn btn-outline-light btn-sm" onClick={() => decQty(item.id)}>-</button>
                      <span style={{ padding: '0 8px' }}>{item.qty}</span>
                      <button className="btn btn-outline-light btn-sm" onClick={() => incQty(item.id)}>+</button>
                      <button className="btn btn-sm btn-danger ms-3" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}

              <div style={styles.summary}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total</span>
                  <strong>₹{total.toLocaleString('en-IN')}</strong>
                </div>
                <button className="btn btn-danger w-100 mt-3">Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1050,
  },
  drawer: {
    width: 760,
    maxWidth: '100%',
    height: '100%',
    background: '#0b0b0b',
    color: '#fff',
    padding: 20,
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  content: {
    minHeight: 200,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    marginBottom: 12,
  },
  summary: {
    marginTop: 20,
  }
}
