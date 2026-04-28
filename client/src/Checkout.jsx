import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";


const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phone: '',
    paymentMethod: 'cod',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const buyNowCart = params.get('cart');
    const buyNowTotal = params.get('total');

    if (buyNowCart && buyNowTotal) {
      const decodedCart = JSON.parse(decodeURIComponent(buyNowCart));
      setCart(decodedCart);
      setTotal(parseFloat(buyNowTotal));
    } else {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(storedCart);
      const calculatedTotal = storedCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotal(calculatedTotal);
    }
  }, [location.search]);

  const validateForm = () => {
    const newErrors = {};

    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip.trim()) newErrors.zip = 'Zip code is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryMonth.trim()) newErrors.expiryMonth = 'Expiry month is required';
      if (!formData.expiryYear.trim()) newErrors.expiryYear = 'Expiry year is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';

      if (formData.cardNumber && !/^\d{16}$/.test(formData.cardNumber.replace(/\D/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (formData.cvv && !/^\d{3}$/.test(formData.cvv.replace(/\D/g, ''))) {
        newErrors.cvv = 'Please enter a valid 3-digit CVV';
      }
    }

   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePaymentChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

 const handlePlaceOrder = async () => {
  if (!validateForm()) return;

  if (!cart.length) {
    setApiError("Cart is empty");
    return;
  }

  setLoading(true);

  try {
    
    if (formData.paymentMethod === "cod") {
      await fetch("${baseUrl}/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          total,
          paymentMethod: "cod",
        }),
      });

      localStorage.removeItem("cart");
      setCart([]);
      setOrderPlaced(true);
      return;
    }

   
    const loaded = await loadRazorpay();
    if (!loaded) {
      setApiError("Razorpay SDK failed to load");
      return;
    }

    const res = await fetch("${baseUrl}/create-order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ amount: total }),
});

const text = await res.text();

let order;
try {
  order = JSON.parse(text);
} catch (err) {
  console.error("Server returned non-JSON:", text);
  throw new Error("Invalid server response");
}

if (!order.id) {
  throw new Error("Order creation failed");
}

    
    const options = {
      key: "rzp_test_Sc8B6Js01KxpH9", 
      amount: order.amount,
      currency: "INR",
      name: "Shopsy",
      description: "Order Payment",
      order_id: order.id,

      handler: async function (response) {
        console.log("Payment Success:", response);

        await fetch("${baseUrl}/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: formData,
            items: cart,
            total,
            paymentId: response.razorpay_payment_id,
            paymentMethod: "online",
          }),
        });

        localStorage.removeItem("cart");
        setCart([]);
        setOrderPlaced(true);
      },

      prefill: {
        name: formData.firstName,
        email: formData.email,
        contact: formData.phone,
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("ERROR:", err);
    setApiError(err.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};
  

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};




  return (
    <div className="checkout-page">
      <div className="container">
        <h2>Checkout</h2>

        <div className="box">
       
        <h3>Billing</h3>

        <input
          type="text"
          name="firstName"
          placeholder="First Name *"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <div className="error-message">{errors.firstName}</div>}
        <input
          type="text"
          name="lastName"
          placeholder="Last Name *"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <div className="error-message">{errors.lastName}</div>}
        <input
          type="text"
          name="address"
          placeholder="Address *"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <div className="error-message">{errors.address}</div>}
        <input
          type="text"
          name="city"
          placeholder="City *"
          value={formData.city}
          onChange={handleChange}
        />
        {errors.city && <div className="error-message">{errors.city}</div>}

        <div className="row">
          <input
            type="text"
            name="state"
            placeholder="State *"
            value={formData.state}
            onChange={handleChange}
          />
          <input
            type="text"
            name="zip"
            placeholder="Zip *"
            value={formData.zip}
            onChange={handleChange}
          />
        </div>
        {errors.state && <div className="error-message">{errors.state}</div>}
        {errors.zip && <div className="error-message">{errors.zip}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
        <input
          type="text"
          name="phone"
          placeholder="Phone *"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <div className="error-message">{errors.phone}</div>}

      
        <h3>Payment</h3>

        <div className="pay">
          <label>
            <input
              type="radio"
              name="payment"
              checked={formData.paymentMethod === 'cod'}
              onChange={() => handlePaymentChange('cod')}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              checked={formData.paymentMethod === 'card'}
              onChange={() => handlePaymentChange('card')}
            />
            Card
          </label>

           <label>
            <input
              type="radio"
              name="payment"
              checked={formData.paymentMethod === 'upi'}
              onChange={() => handlePaymentChange('upi')}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              name="payment"
              checked={formData.paymentMethod === 'netbanking'}
              onChange={() => handlePaymentChange('netbanking')}
            />
            Net Banking
          </label>
        </div>

        {formData.paymentMethod === 'card' && (
          <>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number *"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="16"
            />
            {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}

            <div className="row">
              <input
                type="text"
                name="expiryMonth"
                placeholder="MM *"
                value={formData.expiryMonth}
                onChange={handleChange}
                maxLength="2"
              />
              <input
                type="text"
                name="expiryYear"
                placeholder="YY *"
                value={formData.expiryYear}
                onChange={handleChange}
                maxLength="2"
              />
            </div>
            {errors.expiryMonth && <div className="error-message">{errors.expiryMonth}</div>}
            {errors.expiryYear && <div className="error-message">{errors.expiryYear}</div>}

            <input
              type="text"
              name="cvv"
              placeholder="CVV *"
              value={formData.cvv}
              onChange={handleChange}
              maxLength="3"
            />
            {errors.cvv && <div className="error-message">{errors.cvv}</div>}
          </>
        )}

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div className="summary-item" key={item._id || `${item.product}-${index}`}>
                <div>
                  <p className="item-name">{item.product || item.name}</p>
                  <small>Qty: {item.quantity || 1}</small>
                </div>
                <span className="item-price">
                  ₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}
                </span>
              </div>
            ))
          ) : (
            <p className="empty-cart">No products selected.</p>
          )}
        </div>

        <div className="order">
          <p>
            Total <span>₹{total}</span>
          </p>
          <button onClick={handlePlaceOrder} disabled={loading}>
            {loading ? "Processing..." : 
             formData.paymentMethod === "cod" ? "Place Order" : 
             "Place Order"}
          </button>
        </div>

        {apiError && <div className="error-message" style={{ marginTop: '10px' }}>{apiError}</div>}

        {orderPlaced && (
          <div className="order-success-message">
            <div className="success-content">
              <h3> Order Placed Successfully!</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Checkout;