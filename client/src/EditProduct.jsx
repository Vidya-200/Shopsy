import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    product: "",
    price: "",
    category: "",
    description: "",
    brand: "",
    stock: "",
    color: "",
    discount: "",
    rating: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/getProduct/${id}`)
      .then(res => {
        if (res.data) {
          setProduct({
            product: res.data.product || "",
            price: res.data.price || "",
            category: res.data.category || "",
            description: res.data.description || "",
            brand: res.data.brand || "",
            stock: res.data.stock || "",
            color: res.data.color || "",
            discount: res.data.discount || "",
            rating: res.data.rating || ""
          });
        } else {
          setError("Product not found");
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to load product");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product.product.trim() || !product.price.trim() || !product.category.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    axios.put(`http://localhost:3001/updateProduct/${id}`, product)
      .then(res => {
        alert("Product Updated Successfully");
        navigate("/manage-product");
      })
      .catch(err => {
        console.log(err);
        alert("Failed to update product");
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="product"
            value={product.product}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price *</label>
          <input
            type="text"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={product.color}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={product.discount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            step="0.1"
            value={product.rating}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="update-btn">Update Product</button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/manage-product")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;