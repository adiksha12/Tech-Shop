import React from "react";
import Navigation from "./routing/Navigation";
import CartProvider from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Navigation />
    </CartProvider>
  );
}
