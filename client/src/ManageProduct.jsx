import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./manageproduct.css";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("${baseUrl}/products")
      .then(result => setProducts(result.data))
      .catch(err => console.log(err));
  }, []);

  const deleteProduct = (id) => {
    axios.delete(`${baseUrl}/deleteProduct/${id}`)
      .then(res => {
        alert("Product Deleted");
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="manage-container">
      <h2>Manage Products</h2>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Description</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Color</th>
            <th>Discount</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.product}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>{product.brand}</td>
              <td>{product.stock}</td>
              <td>{product.color}</td>
              <td>{product.discount}%</td>
              <td>⭐ {product.rating}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/editproduct/${product._id}`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageProduct;