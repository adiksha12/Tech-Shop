import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

export default function CartPage() {
  const { cart, incQty, decQty, removeItem } = useCart();
  const navigate = useNavigate();

  const parsePrice = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    // Remove currency symbols and commas
    const n = String(val).replace(/[^0-9.]/g, "");
    return parseFloat(n) || 0;
  };

  const total = cart.reduce(
    (s, p) => s + parsePrice(p.price) * (p.qty || 1),
    0
  );

  if (cart.length === 0)
    return (
      <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
        <div className="text-center p-5">
          <img src="/empty-cart.png" width="140" />
          <h3>Your Cart is Empty</h3>
          <button className="btn btn-danger mt-3" onClick={() => navigate('/products')}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
      <div className="container py-4">
        <div className="row">
          <div className="col-12 col-lg-8">
            <h2>Cart</h2>

            {cart.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center border p-3 mb-3"
              >
                <img src={item.image} width="120" />

                <div style={{ flex: 1, marginLeft: 16 }}>
                  <h5>{item.name}</h5>
                  <p className="text-secondary mb-2">{item.category}</p>
                  <p className="mb-2">₹{parsePrice(item.price).toLocaleString('en-IN')} <del className="text-secondary ms-2">{item.oldPrice}</del></p>

                  <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-outline-light" onClick={() => decQty(item.id)}>-</button>
                    <span className="px-3">{item.qty}</span>
                    <button className="btn btn-outline-light" onClick={() => incQty(item.id)}>+</button>
                    <button className="btn btn-sm btn-danger ms-3" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="col-12 col-lg-4">
            <div className="p-4" style={{ background: '#0b0b0b', borderRadius: 6 }}>
              <h5>Order Summary <small className="text-secondary">({cart.length} item{cart.length>1?'s':''})</small></h5>

              <div className="d-flex justify-content-between mt-3">
                <div className="text-secondary">Original Price</div>
                <div>₹{cart.reduce((s,p)=>s+parsePrice(p.oldPrice || p.price)*(p.qty||1),0).toLocaleString('en-IN')}</div>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <div className="text-secondary">Discount</div>
                <div className="text-success">- ₹{(cart.reduce((s,p)=>s+parsePrice(p.oldPrice || p.price)*(p.qty||1),0)-total).toLocaleString('en-IN')}</div>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <div className="text-secondary">Delivery</div>
                <div className="text-success">Free</div>
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary">Total Price</div>
                  <h4 className="mb-0">₹{total.toLocaleString('en-IN')}</h4>
                </div>
                <div style={{ width: 160 }}>
                  <button className="btn btn-danger w-100">Checkout</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      {/* Footer (advantages + footer) to match site layout */}
      <Footer />
    </div>
  );
}
