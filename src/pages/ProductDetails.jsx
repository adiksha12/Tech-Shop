import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productData from "../Data/Product_Details"; // 19 products array
import { Aproducts } from "../Data/Aproducts";
import { topproducts } from "../Data/TopProducts";
import RelatedCard from "./RelatedCard";
import './ProductDetails.css';
import { getReviewsForProduct } from "../Data/Reviews";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

  // helper to resolve image paths that are stored as "/images/filename" in data
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

export default function ProductDetails() {
  const { id } = useParams();
  const pid = Number(id);
  let product = productData.find((p) => p.id === pid);

  // If not found in the detailed dataset, try Aproducts or topproducts and synthesize a detail object
  if (!product) {
    const ap = Aproducts.find((p) => p.id === pid);
    const tp = topproducts.find((p) => p.id === pid);
    const src = ap || tp;
    if (src) {
      const parseNum = (v) => Number(String(v).replace(/[^0-9.]/g, '')) || 0;
      // when creating a synthesized product from the smaller datasets,
      // ensure we have an images array of up to 4 items. If the small dataset
      // only provides a single imported image, try to find the full images
      // set from `productData` by matching title; otherwise duplicate the
      // single image to provide thumbnails.
      let imagesList = src.images || (src.image ? [src.image] : []);
      if ((!imagesList || imagesList.length < 4) && src.name) {
        const match = productData.find(p => p.title && p.title.toLowerCase() === String(src.name).toLowerCase());
        if (match && match.images && match.images.length) {
          imagesList = match.images.slice(0,4);
        }
      }
      if (!imagesList || imagesList.length === 0) imagesList = [];
      // if still fewer than 4, duplicate the first image to fill slots (keeps UI consistent)
      if (imagesList.length > 0 && imagesList.length < 4) {
        const first = imagesList[0];
        while (imagesList.length < 4) imagesList.push(first);
      }
      product = {
        id: src.id,
        title: src.name || src.title,
        info: src.category || src.info || '',
        rating: src.rating ? '★★★★★' : '★★★★★',
        ratings: src.ratingCount || src.ratings || 0,
        finalPrice: parseNum(src.price || src.finalPrice),
        originalPrice: parseNum(src.oldPrice || src.originalPrice) || parseNum(src.price || src.finalPrice),
        mainImage: (src.image || (imagesList && imagesList[0])) || null,
        images: imagesList,
        brand: src.brand || '',
        category: src.category || '',
        type: src.type || '',
        connectivity: src.connectivity || '',
        microphone: src.microphone || '',
      };
    }
  }

  if (!product) {
    return (
      <div className="container text-white py-5">
        <h3>Product not found</h3>
      </div>
    );
  }

  const initialImg = product.mainImage || (product.images && product.images[0]);
  const [activeImg, setActiveImg] = useState(initialImg ? resolveImg(initialImg) : null);

  // update active image when product changes (when navigating between products)
  useEffect(() => {
    const next = product.mainImage || (product.images && product.images[0]);
    setActiveImg(next ? resolveImg(next) : null);
  }, [product.id]);

  const {
    title,
    info,
    rating,
    ratings,
    finalPrice,
    originalPrice,
    mainImage,
    images,
    brand,
    category,
    type,
    connectivity,
    microphone,
  } = product;

  const youSave = (originalPrice || 0) - (finalPrice || 0);
  const discountPercentage = originalPrice ? Math.round((youSave / originalPrice) * 100) : 0;
  // related products: prefer same-brand items, but always provide 4 cards by
  // falling back to fixed items from `productData` when not enough matches.
  let relatedProducts = productData.filter((p) => p.brand === brand && p.id !== pid).slice(0, 4);
  if (relatedProducts.length < 4) {
    const needed = 4 - relatedProducts.length;
    const extras = productData.filter(p => p.id !== pid && !relatedProducts.some(r => r.id === p.id)).slice(0, needed);
    relatedProducts = relatedProducts.concat(extras);
  }

  const { cart, addToCart } = useCart();
  const inCart = cart.find((p) => p.id === product.id);

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: '#fff', paddingBottom: 60, paddingTop: 0 }}>
      <div className="container-fluid px-0 text-white">

      {/* PRODUCT SECTION */}
      <div className="row align-items-center">

        {/* LEFT : IMAGES */}
        <div className="col-md-5 d-flex">

          {/* Thumbnails (limit 4) */}
          <div className="d-flex flex-column gap-3 me-4" style={{ width: 90 }}>
            {(images || []).slice(0, 4).map((img, index) => {
              const resolved = resolveImg(img);
              return (
                <div key={index} style={{ padding: 6, borderRadius: 6, border: activeImg === resolved ? '2px solid #fff' : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }} onClick={() => setActiveImg(resolved)}>
                  <img
                    src={resolved}
                    alt={`thumb-${index}`}
                    width="64"
                    height="64"
                    className="rounded"
                    style={{ objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )
            })}
          </div>

          {/* MAIN IMAGE */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={activeImg}
              alt={title}
              className="img-fluid rounded"
              style={{
                width: '100%',
                maxWidth: 640,
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        {/* RIGHT : PRODUCT INFO */}
        <div className="col-md-7">

          <h3>{title}</h3>
          <p className="text-secondary">{info}</p>

          {/* Ratings */}
          <div className="d-flex align-items-center mb-2">
            <span className="me-2 text-warning fs-5">{rating || "★★★★★"}</span>
            <span className="text-light">| {ratings || 0} Ratings</span>
          </div>

          {/* PRICE */}
          <h4 className="mt-3">
            ₹{(finalPrice || 0).toLocaleString()} {" "}
            <span className="text-secondary text-decoration-line-through fs-5">
              ₹{(originalPrice || 0).toLocaleString()}
            </span>
          </h4>

          <p className="text-success fw-bold">
            You Save ₹{youSave} ({discountPercentage}%) &nbsp;
            <span className="badge bg-success">In stock</span>
          </p>

          <p className="text-secondary">(Inclusive of all Taxes)</p>

          {/* OFFER BUTTONS */}
          <h5 className="mt-4">Offers and Discounts</h5>
          <div className="d-flex gap-3 mt-3">
            <button className="btn btn-outline-light">No Cost EMI on Credit Card</button>
            <button className="btn btn-outline-light">Pay Later & Avail Cashback</button>
          </div>

          {/* BUY / ADD TO CART */}
          <button
            className={`btn mt-4 px-4 ${inCart ? 'btn-success' : 'btn-danger'}`}
            onClick={() => { if (!inCart) addToCart({ id: product.id, name: title, price: `₹${finalPrice}`, image: resolveImg(activeImg) }); }}
            disabled={!!inCart}
          >
            {inCart ? 'Added' : 'Add to Cart'}
          </button>

        </div>
      </div>

      {/* SPECIFICATIONS / OVERVIEW / REVIEWS */}
      <div className="mt-5">
        <ul className="nav justify-content-center mb-3 product-tabs" role="tablist" style={{ gap: 150 }}>
          <li className="nav-item">
            <button className="nav-link active bg-transparent text-white fs-4" data-bs-toggle="tab" data-bs-target="#specs">
              Specifications
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link bg-transparent text-white fs-4" data-bs-toggle="tab" data-bs-target="#overview">
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link bg-transparent text-white fs-4" data-bs-toggle="tab" data-bs-target="#reviews">
              Reviews
            </button>
          </li>
        </ul>

        <div className="d-flex justify-content-center">
          <div className="tab-content" style={{ width: '100%', maxWidth: 1000 }}>
            <div className="p-3" style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, background: '#0b0b0b' }}>
              <div className="tab-pane fade show active" id="specs">
                <div className="row">
                  <div className="col-md-3 fw-bold">Brand</div>
                  <div className="col-md-9">{brand}</div>

                  <div className="col-md-3 fw-bold">Category</div>
                  <div className="col-md-9">{category}</div>

                  <div className="col-md-3 fw-bold">Type</div>
                  <div className="col-md-9">{type}</div>

                  <div className="col-md-3 fw-bold">Connectivity</div>
                  <div className="col-md-9">{connectivity}</div>

                  <div className="col-md-3 fw-bold">Microphone</div>
                  <div className="col-md-9">{microphone}</div>
                </div>
              </div>

              <div className="tab-pane fade" id="overview">
                <p className="text-secondary">Product overview will be added here…</p>
              </div>

              <div className="tab-pane fade" id="reviews">
                <div>
                  {/* Render deterministic dummy reviews for all products */}
                  {(() => {
                    const revs = getReviewsForProduct(product.id || pid) || [];
                    if (!revs || revs.length === 0) {
                      return <p className="text-secondary">No reviews yet. Be the first to review this product.</p>;
                    }
                    return (
                      <div className="d-flex flex-column gap-3">
                        {revs.map((r) => (
                          <div key={r.id} style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 12, borderRadius: 8, background: '#070707' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="fw-bold text-white">{r.name}</div>
                              <div className="text-warning">{'★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)}</div>
                            </div>
                            <div className="text-secondary mb-2">{r.text}</div>
                            <div className="text-muted" style={{ fontSize: 12 }}>{r.date}</div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <h3 className="mt-5 px-0">Related Products</h3>

      <div className="container-fluid px-0">
        <div className="row row-cols-2 row-cols-md-4 g-4 mt-3">
          {relatedProducts.map((rp) => (
            <div className="col" key={rp.id}>
              <RelatedCard product={rp} />
            </div>
          ))}
        </div>
      </div>

      <Footer />
      </div>
    </div>
  );
}
