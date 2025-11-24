import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import EmptyCart from '../pages/EmptyCart'
import { useCart } from '../context/CartContext'
import Fcard from '../pages/Fcard'
import Tcard from '../pages/Tcard'
import ProductDetails from '../pages/ProductDetails'
import CartPage from '../pages/CartPage'
import { FProducts } from '../Data/FProducts'
import { topproducts } from '../Data/TopProducts'
import Products from '../pages/Products'

// Home Component
function Home() {
  return (
    <>
      <Fcard products={FProducts} />
      <Tcard Tproduct={topproducts} />
      <Footer />
    </>
  )
}

// Main Router
export default function Navigation() {
  const { cart } = useCart();

  return (
    <>
      <Header />
      <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={cart.length === 0 ? <EmptyCart /> : <CartPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </>
  )
}
