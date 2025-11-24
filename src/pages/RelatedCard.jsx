import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function RelatedCard({ product }) {
  function resolveImg(path) {
    if (!path) return path;
    if (typeof path !== 'string') return path;
    if (path.startsWith('/images/')) {
      const filename = path.replace('/images/', '');
      try {
        return new URL(`../images/${filename}`, import.meta.url).href;
      } catch (e) {
        return path;
      }
    }
    return path;
  }
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const inCart = cart.find((p) => p.id === product.id);

  return (
    <div className="card bg-dark text-white h-100 rounded-3 p-0" style={{cursor: 'pointer', minHeight: 360, display: 'flex', flexDirection: 'column', overflow: 'hidden'}} onClick={() => navigate(`/product/${product.id}`)}>
      <div style={{height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b0b'}}>
        <img
          src={resolveImg(product.mainImage || (product.images && product.images[0]))}
          alt={product.title}
          className="img-fluid"
          style={{ maxHeight: 200, objectFit: "contain" }}
        />
      </div>

      <div className="card-body d-flex flex-column" style={{flex: 1}}>
        <p className="text-warning m-0">{product.rating || '★★★★★'}</p>
        <h6 className="mt-2 text-truncate" title={product.title}>{product.title}</h6>
        <p className="text-secondary small mb-2 text-truncate">{product.info}</p>

        <div className="mt-auto">
          <h6 className="mb-2">
            ₹{product.finalPrice || ''} <span className="text-secondary text-decoration-line-through">{product.originalPrice || ''}</span>
          </h6>

          <button
            className={`w-100 btn ${inCart ? 'btn-success' : 'btn-danger'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!inCart) addToCart({ id: product.id, name: product.title, price: `₹${product.finalPrice}`, image: resolveImg(product.mainImage || (product.images && product.images[0])) });
            }}
            disabled={!!inCart}
          >
            {inCart ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
