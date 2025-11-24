import React, { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { useNavigate } from 'react-router-dom'
export default function Tcard({ Tproduct }) {
  const { cart, addToCart } = useCart();
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? Tproduct.slice(0, 11)
      : Tproduct.filter((p) => p.section === activeCategory);

  const categories = ["All", "Headphones", "Earbuds", "Earphones", "Neckbands"];

  return (
    <div className="w-100 bg-black text-white py-5">
      <div className="container">
        
        <h1 className="text-center text-white">Top products</h1>

        {/* Category Filter */}
        <ul className="d-flex justify-content-around list-unstyled mt-5">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 18px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.3s",
                backgroundColor:
                  activeCategory === cat ? "#ff6600" : "transparent",
                color: activeCategory === cat ? "#fff" : "#fff",
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat) {
                  e.target.style.backgroundColor = "#ff6600";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              {cat}
            </li>
          ))}
        </ul>

        {/* Products Grid */}
        <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
          {filteredProducts.map((item, index) => (
            <div className="col" key={index}>
              <div className="card bg-black text-white border-light h-100">

                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.name}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${item.id}`)}
                />

                <div className="card-body">
                  <p className="text-danger">{item.rating}</p>
                  <h5 style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h5>
                  <p className="text-truncate">{item.category}</p>
                </div>

                <div className="card-footer border-light">
                  <h5>
                    {item.price}
                    <del className="text-secondary ms-2">{item.oldPrice}</del>
                  </h5>
                  <button
  onClick={() => addToCart(item)}
  className="btn w-100 mt-2"
  style={{
    background: cart.find((p) => p.id === item.id) ? "green" : "red",
    color: "#fff",
    transition: "0.3s"
  }}
>
  {cart.find((p) => p.id === item.id) ? "Added" : "Add to cart"}
</button>

                </div>

              </div>
            </div>
          ))}

          {/* Browse All Products Card */}
          <div className="col">
            <div className="card bg-black text-white border-light h-100">
              <div className="card-body d-flex justify-content-center align-items-center text-center">
                <button className="btn btn-outline-light" onClick={()=>navigate('/products')}>Browse All Products <FaArrowRightLong /></button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
