import { createContext, useState, useContext } from "react";

export const CartContext = createContext();   // <-- EXPORT THIS

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((s) => !s);

  // Add to cart
  const addToCart = (product) => {
    const exists = cart.find((p) => p.id === product.id);
    if (exists) return;
    setCart([...cart, { ...product, qty: 1 }]);
  };

  // Increase qty
  const incQty = (id) => {
    setCart(
      cart.map((p) =>
        p.id === id ? { ...p, qty: p.qty + 1 } : p
      )
    );
  };

  // Decrease qty
  const decQty = (id) => {
    setCart(
      cart.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, incQty, decQty, removeItem, isCartOpen, openCart, closeCart, toggleCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
