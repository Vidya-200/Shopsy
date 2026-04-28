import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const handleCheckout = (item) => {
    navigate("/checkout", { state: { checkoutItems: [item] } });
  };

  
  const increaseQty = (id) => {
    const updatedCart = cart.map(item =>
      item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  
  const decreaseQty = (id) => {
    const updatedCart = cart.map(item =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

 
  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

 
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

 return (
  <div className="cart-container">
    <div className="cart">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <h3>Cart is empty</h3>
      ) : (
        <>
          {cart.map(item => (
            <div className="cart-card" key={item._id}>

              <div className="cart-left">
                <img
                  src={`${baseUrl}/uploads/${item.image}`}
                  alt={item.product}
                />
              </div>

              <div className="cart-right">
                <h3>{item.product}</h3>
                <p className="price">Price: ₹ {item.price}</p>
                <p className="discount">Discount: {item.discount}% Off</p>
                <p className="category">Category: {item.category}</p>
                <p className="color">Color: {item.color}</p>
                <p className="subtotal">
                  Subtotal: ₹ {item.price * item.quantity}
                </p>

                <div className="qty-control">
                  <button onClick={() => decreaseQty(item._id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item._id)}>+</button>
                </div>

                <div className="cart-buttons">
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>

                  <button
                    className="buy-btn"
                    onClick={() => handleCheckout(item)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}

          <h2 className="total">Total: ₹ {totalPrice}</h2>
        </>
      )}
    </div>
  </div>
);
}

export default Cart;