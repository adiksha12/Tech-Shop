import { FaTrash } from "react-icons/fa";

export default function CartDrawer({
  open,
  setOpen,
  cart,
  incQty,
  decQty,
  removeItem,
}) {
  const total = cart.reduce(
    (sum, item) =>
      sum + item.qty * Number(item.price.replace("₹", "").replace(",", "")),
    0
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: open ? 0 : "-420px",
        width: "420px",
        height: "100vh",
        background: "#111",
        color: "#fff",
        transition: "0.3s",
        padding: "20px",
        zIndex: 9999,
        overflowY: "auto",
      }}
    >
      <h3 className="d-flex justify-content-between">
        Cart
        <span
          onClick={() => setOpen(false)}
          style={{ cursor: "pointer", fontSize: "26px" }}
        >
          ✖
        </span>
      </h3>

      <hr style={{ borderColor: "#333" }} />

      {cart.length === 0 ? (
        <h4 className="text-secondary mt-5 text-center">Your cart is empty</h4>
      ) : (
        cart.map((item) => (
          <div
            key={item.id}
            className="d-flex align-items-center bg-dark p-2 rounded mb-3"
          >
            <img src={item.image} width="80" className="me-3" />
            <div className="flex-grow-1">
              <h6>{item.name}</h6>
              <p>
                {item.price}{" "}
                <del className="text-secondary">{item.oldPrice}</del>
              </p>

              {/* Quantity buttons */}
              <div className="d-flex">
                <button
                  onClick={() => decQty(item.id)}
                  className="btn btn-danger btn-sm"
                >
                  -
                </button>
                <span className="px-3">{item.qty}</span>
                <button
                  onClick={() => incQty(item.id)}
                  className="btn btn-success btn-sm"
                >
                  +
                </button>
              </div>
            </div>

            <FaTrash
              className="ms-3"
              style={{ cursor: "pointer", color: "#ff4444" }}
              onClick={() => removeItem(item.id)}
            />
          </div>
        ))
      )}

      {cart.length > 0 && (
        <>
          <hr />
          <h4>Total: ₹{total}</h4>

          <button className="btn btn-danger w-100 mt-3">Checkout</button>
        </>
      )}
    </div>
  );
}
