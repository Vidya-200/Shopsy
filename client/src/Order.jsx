import React, { useEffect, useState } from "react";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/order");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await fetch(`http://localhost:3001/order/${id}`, {
        method: "DELETE",
      });

      
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const updateStatus = async (id, status, isLocked) => {
  if (isLocked) {
    alert("Status already delivered. Cannot change again.");
    return;
  }

  try {
    const shouldLock = status === "Delivered";

    const res = await fetch(`http://localhost:3001/order/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        statusLocked: shouldLock,
      }),
    });

    const updatedOrder = await res.json(); 

    if (!res.ok) {
      throw new Error("Update failed");
    }

   
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === id ? updatedOrder : order
      )
    );

  } catch (err) {
    console.error("Status update failed", err);
  }
};

  if (loading) return <h2>Loading orders...</h2>;
  return (
    <div className="dashboard">
      <h2>Order Dashboard</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-5)}</td>

                <td>
                  {order.customer.firstName} {order.customer.lastName}
                  <br />
                  {order.customer.phone}
                </td>

                <td>
                  {order.items.map((item, i) => (
                    <div key={i}>
                      {item.name} (x{item.quantity})
                    </div>
                  ))}
                </td>

                <td>₹{order.total}</td>
                <td>{order.paymentMethod}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

               
                <td>
                  <select
  value={order.status || "Pending"}
  disabled={order.status === "Delivered" || order.statusLocked} 
  onChange={(e) =>
    updateStatus(order._id, e.target.value, order.statusLocked)
  }
>
                    <option>Pending</option>
                    <option>Order Confirmed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>

                
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteOrder(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Order;