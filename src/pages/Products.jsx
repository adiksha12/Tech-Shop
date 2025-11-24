import React, { useMemo, useState } from 'react'
import { Aproducts } from '../Data/Aproducts'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Footer from '../components/Footer'

function parsePrice(val){
  if(typeof val === 'number') return val
  if(!val) return 0
  return parseFloat(String(val).replace(/[^0-9.]/g,''))||0
}

export default function Products(){
  const navigate = useNavigate()
  const { cart, addToCart } = useCart()
  const [sort, setSort] = useState('Latest')
  const [brands, setBrands] = useState({JBL:false, boAt:false, Sony:false})
  const [categories, setCategories] = useState({Headphones:false, Earbuds:false, Earphones:false, Neckbands:false})
  const prices = useMemo(()=>Aproducts.map(p=>parsePrice(p.price)),[])
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice])
  const [minRange, setMinRange] = useState(minPrice)
  const [maxRange, setMaxRange] = useState(maxPrice)

  const toggleBrand = (b)=> setBrands(prev=>({...prev, [b]: !prev[b]}))
  const toggleCategory = (c)=> setCategories(prev=>({...prev, [c]: !prev[c]}))

  const filtered = useMemo(()=>{
    let list = [...Aproducts]

    // brand filter
    const activeBrands = Object.keys(brands).filter(b=>brands[b])
    if(activeBrands.length>0){
      list = list.filter(p=>{
        const name = (p.name||'').toLowerCase()
        return activeBrands.some(b=>name.includes(b.toLowerCase()))
      })
    }

    // category filter
    const activeCats = Object.keys(categories).filter(c=>categories[c])
    if(activeCats.length>0){
      list = list.filter(p=> activeCats.includes(p.section) )
    }

    // price filter
    list = list.filter(p=>{
      const v = parsePrice(p.price)
      return v >= priceRange[0] && v <= priceRange[1]
    })

    // sort
    if(sort === 'Latest'){
      list.sort((a,b)=> b.id - a.id)
    } else if(sort === 'Featured'){
      list.sort((a,b)=> (b.rating||0) - (a.rating||0))
    } else if(sort === 'Top Rated'){
      list.sort((a,b)=> (b.rating||0) - (a.rating||0))
    } else if(sort === 'Price(Lowest First)'){
      list.sort((a,b)=> parsePrice(a.price) - parsePrice(b.price))
    } else if(sort === 'Price(Highest First)'){
      list.sort((a,b)=> parsePrice(b.price) - parsePrice(a.price))
    }

    return list
  },[sort, brands, categories, priceRange])

  return (
    <div className="w-100 bg-black text-white" style={{minHeight:'100vh'}}>
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <h2>All Products</h2>
          </div>
        </div>

        <div className="row mt-3 align-items-stretch">
          <aside className="col-12 col-md-4 mb-4 d-flex">
            <div className="p-3 bg-black rounded flex-grow-1" style={{background:'#0b0b0b', height: '100%', overflowY:'auto'}}>
              <h6 className="mb-2">Sort By</h6>
              <select className="form-select mb-3" value={sort} onChange={e=>setSort(e.target.value)}>
                <option>Latest</option>
                <option>Featured</option>
                <option>Top Rated</option>
                <option>Price(Lowest First)</option>
                <option>Price(Highest First)</option>
              </select>

              <h6 className="mb-2">Filter By (Brands)</h6>
              <div className="mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="brandJBL" checked={brands.JBL} onChange={()=>toggleBrand('JBL')} />
                  <label className="form-check-label" htmlFor="brandJBL">JBL</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="brandBoAt" checked={brands.boAt} onChange={()=>toggleBrand('boAt')} />
                  <label className="form-check-label" htmlFor="brandBoAt">BoAt</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="brandSony" checked={brands.Sony} onChange={()=>toggleBrand('Sony')} />
                  <label className="form-check-label" htmlFor="brandSony">Sony</label>
                </div>
              </div>

              <h6 className="mb-2">Category</h6>
              <div className="mb-3">
                {['Headphones','Earbuds','Earphones','Neckbands'].map(c=> (
                  <div className="form-check" key={c}>
                    <input className="form-check-input" type="checkbox" id={`cat-${c}`} checked={categories[c]} onChange={()=>toggleCategory(c)} />
                    <label className="form-check-label" htmlFor={`cat-${c}`}>{c}</label>
                  </div>
                ))}
              </div>

              <h6 className="mb-2">Price</h6>
              <div className="mb-3">
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div className="d-flex align-items-center gap-2">
                    <input type="range" min={minPrice} max={maxPrice} value={minRange} onChange={e=>{
                      const v = Number(e.target.value)
                      const newMin = Math.min(v, maxRange)
                      setMinRange(newMin)
                      setPriceRange([newMin, maxRange])
                    }} style={{accentColor:'#ff6600', width:'100%'}} />
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input type="range" min={minPrice} max={maxPrice} value={maxRange} onChange={e=>{
                      const v = Number(e.target.value)
                      const newMax = Math.max(v, minRange)
                      setMaxRange(newMax)
                      setPriceRange([minRange, newMax])
                    }} style={{accentColor:'#ff6600', width:'100%'}} />
                  </div>
                  <div className="d-flex justify-content-between">
                    <small className="text-secondary">₹{minPrice}</small>
                    <small className="text-secondary">₹{maxPrice}</small>
                  </div>
                  <div className="d-flex justify-content-between">
                    <input type="number" className="form-control" style={{width: '48%'}} value={priceRange[0]} onChange={e=>{const v=Number(e.target.value)||minPrice; setPriceRange([v, priceRange[1]]); setMinRange(v)}} />
                    <input type="number" className="form-control" style={{width: '48%'}} value={priceRange[1]} onChange={e=>{const v=Number(e.target.value)||maxPrice; setPriceRange([priceRange[0], v]); setMaxRange(v)}} />
                  </div>
                </div>
                <small className="text-secondary">Range: ₹{minPrice} - ₹{maxPrice}</small>
              </div>

              <div className="d-grid">
                <button className="btn btn-outline-light" onClick={()=>{setBrands({JBL:false,boAt:false,Sony:false}); setCategories({Headphones:false,Earbuds:false,Earphones:false,Neckbands:false}); setPriceRange([minPrice,maxPrice]); setMinRange(minPrice); setMaxRange(maxPrice); setSort('Latest')}}>Reset Filters</button>
              </div>
            </div>
          </aside>

          <main className="col-12 col-md-8">
            {filtered.length===0 ? (
              <div className="text-center py-5">
                <h4>Your search returned no products</h4>
                <p className="mb-3">Try adjusting filters or start shopping</p>
                <button className="btn btn-danger" onClick={()=>navigate('/products')}>Start Shopping</button>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {filtered.map(p=> (
                  <div className="col" key={p.id}>
                    <div className="card bg-black text-white h-100 border-light">
                      <img src={p.image} className="card-img-top" alt={p.name} style={{cursor:'pointer'}} onClick={()=>navigate(`/product/${p.id}`)} />
                      <div className="card-body">
                        <h6 className="text-danger mb-1">{p.rating} ★</h6>
                        <h5 style={{cursor:'pointer'}} onClick={()=>navigate(`/product/${p.id}`)}>{p.name}</h5>
                        <p className="text-truncate text-secondary">{p.category}</p>
                      </div>
                      <div className="card-footer border-light">
                        <h5>₹{parsePrice(p.price).toLocaleString('en-IN')} <del className="text-secondary ms-2">{p.oldPrice}</del></h5>
                        <div className="d-grid">
                          <button
                            className="btn mt-2"
                            onClick={()=> addToCart(p)}
                            style={{ background: cart.find(c=>c.id===p.id)? 'green' : 'red', color:'#fff' }}
                          >
                            {cart.find(c=>c.id===p.id)? 'Added' : 'Add to cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
