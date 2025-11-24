import React,{ useContext, useState, useMemo, useEffect, useRef } from 'react'
import { FaSearch } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import boat131 from "../images/boat131-1.png"
import jbl from "../images/jbl500bt-1.png"
import sony from "../images/sonyXb910n-1.png"
import "../components/Header.css"
import { useCart } from "../context/CartContext"; 
import { useNavigate, useLocation } from "react-router-dom";
import productData from "../Data/Product_Details";
import { Aproducts } from "../Data/Aproducts";
import { topproducts } from "../Data/TopProducts";
import resolveImg from '../utils/resolveImg'


export default function Header() {
  const { cart, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // build unified product index for search
  const productsIndex = useMemo(() => {
    const list = [];
    // prefer Product_Details entries (detailed data)
    productData.forEach(p => list.push({ id: p.id, title: p.title || p.name || '', image: p.mainImage || (p.images && p.images[0]) || '', source: 'details' }));
    Aproducts.forEach(p => list.push({ id: p.id, title: p.name || '', image: p.image || '', source: 'a' }));
    topproducts.forEach(p => list.push({ id: p.id, title: p.name || '', image: p.image || '', source: 'top' }));
    // de-duplicate by id, keep first occurrence
    const seen = new Map();
    for (const it of list) {
      if (!seen.has(it.id)) seen.set(it.id, it);
    }
    return Array.from(seen.values());
  }, []);

  const suggestions = useMemo(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    return productsIndex.filter(p => p.title.toLowerCase().includes(q)).slice(0, 8);
  }, [query, productsIndex]);

  // default recommended products (4)
  const recommended = useMemo(() => topproducts.slice(0,4).map(p=>({ id: p.id, title: p.name, image: p.image })), []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(()=> inputRef.current && inputRef.current.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  // close on ESC or click outside
  useEffect(()=>{
    function onKey(e){ if(e.key === 'Escape') setSearchOpen(false); }
    function onClick(e){ if(searchOpen && inputRef.current && !inputRef.current.contains(e.target) && !e.target.closest('.search-overlay')) setSearchOpen(false); }
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClick);
    return ()=>{ window.removeEventListener('keydown', onKey); window.removeEventListener('click', onClick); }
  }, [searchOpen]);
  return (
    <>
      <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar bg-dark navbar-dark">
        <div className="container-fluid">

          <a
            className="navbar-brand text-white fs-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Tech-Shop
          </a>

          <ul className="d-flex list-unstyled gap-5 text-white fs-5 m-0">

            <li style={{ cursor: "pointer" }} onClick={(e)=>{ e.stopPropagation(); setSearchOpen(true); }}>
              <FaSearch />
            </li>

            {/* CART ICON */}
            <li
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart />

              {cart.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-10px",
                    background: "red",
                    padding: "2px 6px",
                    borderRadius: "50%",
                    fontSize: "12px",
                  }}
                >
                  {cart.length}
                </span>
              )}
            </li>

            {/* PERSON ICON → OPENS MODAL */}
            <li
              data-bs-toggle="modal"
              data-bs-target="#accountPrompt"
              style={{ cursor: "pointer" }}
            >
              <IoPerson />
            </li>

          </ul>
        </div>
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div className="search-overlay" style={{ position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 1050, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 'min(1100px, 95%)', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 12 }}>
            <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} className="form-control bg-dark text-light" placeholder="Search products..." />

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ maxHeight: 260, overflowY: 'auto', paddingRight: 6 }}>
                  {suggestions.length === 0 ? (
                    <div className="text-secondary p-3">Type to search products...</div>
                  ) : (
                    suggestions.map(s => (
                      <div key={s.id} onClick={(e)=>{ e.stopPropagation(); setSearchOpen(false); navigate(`/product/${s.id}`); }} className="p-2 border-bottom d-flex align-items-center" style={{ cursor: 'pointer', gap: 8 }}>
                        <img src={resolveImg(s.image)} alt="thumb" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                        <div>
                          <div>{s.title}</div>
                          <small className="text-muted">{s.source}</small>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ width: 280 }}>
                <div className="text-white mb-2">Recommended</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {recommended.map(r=> (
                    <div key={r.id} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }} onClick={(e)=> { e.stopPropagation(); setSearchOpen(false); navigate(`/product/${r.id}`); }}>
                      <img src={r.image} style={{ width: 56, height: 56, objectFit: 'contain' }} />
                      <div className="small">{r.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
                ACCOUNT PROMPT MODAL
      ===================================================== */}
      <div
        className="modal fade"
        id="accountPrompt"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm modal-dialog-scrollable modal-dialog-end">
          <div className="modal-content bg-dark text-light p-3">

            <h6 className="mb-2">
              <strong>Hello!</strong>
            </h6>

            <p className="mb-2">Access account and manage orders</p>

            <button
              className="btn btn-outline-light w-100 mb-2"
              data-bs-target="#loginModal"
              data-bs-toggle="modal"
              data-bs-dismiss="modal"
            >
              Login / Signup
            </button>

            <small className="text-muted">Please Login</small>
          </div>
        </div>
      </div>

      {/* =====================================================
                      LOGIN MODAL
      ===================================================== */}
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content bg-dark text-light p-4">

            <div className="modal-header border-0">
              <h5 className="modal-title">Login</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <p>
                New to Tech-Shop?{" "}
                <span
                  className="text-info"
                  style={{ cursor: "pointer" }}
                  data-bs-target="#signupModal"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Create an account
                </span>
              </p>

              <input
                type="email"
                className="form-control mt-2"
                placeholder="Email"
              />

              <input
                type="password"
                className="form-control mt-3"
                placeholder="Password"
              />

              <button className="btn btn-danger w-100 mt-3">Login</button>

              <p className="text-center mt-3">or login with</p>

              <div className="d-flex justify-content-around">
                <button className="btn btn-primary">Facebook</button>
                <button className="btn btn-danger">Google</button>
                <button className="btn btn-info text-white">Twitter</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
                       SIGNUP MODAL
      ===================================================== */}
      <div
        className="modal fade"
        id="signupModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content bg-dark text-light p-4">

            <div className="modal-header border-0">
              <h5 className="modal-title">Signup</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <p>
                Already have an account?{" "}
                <span
                  className="text-info"
                  style={{ cursor: "pointer" }}
                  data-bs-target="#loginModal"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Login
                </span>
              </p>

              <input type="text" className="form-control" placeholder="Username" />

              <input
                type="email"
                className="form-control mt-2"
                placeholder="Email"
              />

              <input
                type="password"
                className="form-control mt-2"
                placeholder="Password"
              />

              <input
                type="password"
                className="form-control mt-2"
                placeholder="Confirm Password"
              />

              <button className="btn btn-danger w-100 mt-3">Signup</button>

              <p className="text-center mt-3">or Signup with</p>

              <div className="d-flex justify-content-around">
                <button className="btn btn-primary">Facebook</button>
                <button className="btn btn-danger">Google</button>
                <button className="btn btn-info text-white">Twitter</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>

      {/* CAROUSEL (only show on home path) */}
      {location.pathname === "/" && (
        <div className="bg-black text-white">
          <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">

            <div className="carousel-inner">

              {/* Slide 1 */}
              <div className="carousel-item active" style={{minHeight:"600px"}}>
                <div className="container py-5 d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div className="text-center text-md-start order-1">
                    <h6>Sony WH-XB910N</h6>
                    <h2>Give Your Favourite <br /> Music A Boost.</h2>
                    <p><strong>₹13,489</strong> <del className="text-secondary">₹19,990</del></p>
                    <button className="btn btn-danger" onClick={() => navigate('/product/7')}>Shop Now</button>
                  </div>
                  <img src={sony} alt="Sony" className="img-fluid product-img order-2" style={{ maxWidth: "400px" }} />
                </div>
              </div>

              {/* Slide 2 */}
              <div className="carousel-item" style={{minHeight:"600px"}}>
                <div className="container py-5 d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div className="text-center text-md-start order-1">
                    <h6>boAt Airdopes 131</h6>
                    <h2>Featherweight For<br /> Comfort All-Day.</h2>
                    <p><strong>₹1,099</strong> <del className="text-secondary">₹2,990</del></p>
                    <button className="btn btn-danger" onClick={() => navigate('/product/3')}>Shop Now</button>
                  </div>
                  <img src={boat131} alt="boAt" className="img-fluid product-img order-2" style={{ maxWidth: "400px" }} />
                </div>
              </div>

              {/* Slide 3 */}
              <div className="carousel-item" style={{minHeight:"600px"}}>
                <div className="container py-5 d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div className="text-center text-md-start order-1">
                    <h6>JBL Live 660NC</h6>
                    <h2>Keep The Noise Out,<br /> Or In. You Choose.</h2>
                    <p><strong>₹9,999</strong> <del className="text-secondary">₹14,999</del></p>
                    <button className="btn btn-danger" onClick={() => navigate('/product/1')}>Shop Now</button>
                  </div>
                  <img src={jbl} alt="JBL" className="img-fluid product-img order-2" style={{ maxWidth: "400px" }} />
                </div>
              </div>

            </div>

            {/* Small dot indicators (replace prev/next) */}
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
