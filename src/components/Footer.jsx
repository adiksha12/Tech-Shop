import React, { useState, useEffect } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowUp } from "react-icons/fa";
import { FaTruckFast, FaShieldHalved, FaTags, FaCreditCard } from "react-icons/fa6";


export default function Footer() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setShowButton(true);
      else setShowButton(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
<>

     <div className="w-100 bg-black text-white py-5">
  <div className="container text-center pb-4">
    <h2 className="fw-bold mb-5 text-white">Our Advantages</h2>

    <div className="row justify-content-center">

      {/* Item 1 */}
      <div className="col-md-3 d-flex align-items-start mb-4">
        <FaTruckFast size={32} color="#f1542d" className="me-3" />
        <div>
          <h6 className="fw-bold d-flex align-items-center gap-2 text-white">
            Express Delivery
          </h6>
          <p className="mb-0 small text-secondary">Ships in 24 Hours</p>
        </div>
      </div>

      {/* Item 2 */}
      <div className="col-md-3 d-flex align-items-start mb-4">
        <FaShieldHalved size={32} color="#ff3c2f" className="me-3" />
        <div>
          <h6 className="fw-bold d-flex align-items-center gap-2 text-white">
            Brand Warranty
          </h6>
          <p className="mb-0 small text-secondary">100% Original products</p>
        </div>
      </div>

      {/* Item 3 */}
      <div className="col-md-3 d-flex align-items-start mb-4">
        <FaTags size={32} color="#ff3e2f" className="me-3" />
        <div>
          <h6 className="fw-bold d-flex align-items-center gap-2 text-white">
            Exciting Deals
          </h6>
          <p className="mb-0 small text-secondary">On all prepaid orders</p>
        </div>
      </div>

      {/* Item 4 */}
      <div className="col-md-3 d-flex align-items-start mb-4">
        <FaCreditCard size={32} color="#ff3c2f" className="me-3" />
        <div>
          <h6 className="fw-bold d-flex align-items-center gap-2 text-white">
            Secure Payments
          </h6>
          <p className="mb-0 small text-secondary">SSL / Secure certificate</p>
        </div>
      </div>

    </div>
  </div>
</div>

    <footer className="bg-dark text-light pt-5 pb-5 position-relative">

      <div className="container">
        <div className="row g-5">
          {/* Tech-Shop */}
          <div className="col-12 col-md-3">
            <h2 className="h5 text-white mb-3">Tech-Shop</h2>
            <p className="small mb-3">
              Subscribe to our Email alerts to receive
              <br />
              early discount offers, and new products info.
            </p>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address*"
                className="form-control"
              />
              <button className="btn btn-danger">Subscribe</button>
            </div>
          </div>

          {/* Help */}
          <div className="col-12 col-md-3">
            <h3 className="h6 text-white mb-3">Help</h3>
            <ul className="list-unstyled small">
              {["FAQs", "Track Order", "Cancel Order", "Return Order", "Warranty Info"].map((item, i) => (
                <li key={i} className="mb-2">
                  <a href="#" className="text-light text-decoration-none hover text-warning">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="col-12 col-md-3">
            <h3 className="h6 text-white mb-3">Policies</h3>
            <ul className="list-unstyled small">
              {["Return Policy", "Security", "Sitemap", "Privacy Policy", "Terms & Conditions"].map((item, i) => (
                <li key={i} className="mb-2">
                  <a href="#" className="text-light text-decoration-none hover text-warning">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-12 col-md-3">
            <h3 className="h6 text-white mb-3">Company</h3>
            <ul className="list-unstyled small">
              {["About Us", "Contact Us", "Service Centres", "Careers", "Affiliates"].map((item, i) => (
                <li key={i} className="mb-2">
                  <a href="#" className="text-light text-decoration-none hover text-warning">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-secondary mt-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
          <p className="mb-2 mb-md-0 small">2025 | All Rights Reserved ©.</p>
          <div className="d-flex gap-3 fs-5">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <Icon key={i} className="text-light hover text-warning" />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="btn btn-danger position-fixed bottom-0 end-0 m-3"
          style={{ zIndex: 1000 }}
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
    </>
  );
}