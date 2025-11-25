import React from 'react'
import { useNavigate } from 'react-router-dom'
import productData from '../Data/Product_Details'

export default function Fcard({ products }) {
  const navigate = useNavigate()

  return (
    <div className="bg-black text-white py-4">
      <h1 className='text-center text-white'>Feature products</h1>

      <div className='d-flex justify-content-center text-center mt-5 gap-5 flex-wrap'>
        {products.map((item, index) => (
          <div key={index}>
            <div
              className="card bg-black text-white border border-light h-100 d-flex flex-column"
              style={{
                width: "225px",
                height: "350px",
                transition: "all 0.3s ease",
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = "scale(1.2)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => {
                // try direct id first (works for topproducts and Aproducts),
                // otherwise find a matching product in productData by title/name
                let targetId = item.id;
                const found = productData.find(p => (p.title && (p.title === item.name || p.title === item.title)));
                if (found) targetId = found.id;
                navigate(`/product/${targetId}`);
              }}
            >
              <h5 className="card-title text-center p-2 text-white">
                {item.name}
              </h5>

              <img
                src={item.image}
                className="card-img-top mx-auto"
                style={{ width: "150px", height: "150px", objectFit: "contain" }}
                alt={item.name}
              />

              <div className="card-body text-white">
                <p className="card-text text-white">
                  {item.price} <del className="text-secondary">{item.oldPrice}</del>
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
