import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.email) {
      axios.get(`http://localhost:3001/my-orders/${user.email}`)
        .then(res => {
          setOrders(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order, index) => (
          <div className="order-card" key={index}>
            <h3>Order #{index + 1}</h3>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div className="order-item" key={i}>
                  <img
                    src={`http://localhost:3001/uploads/${item.image}`}
                    alt={item.product}
                  />
                  <div>
                    <p>{item.product}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹ {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;