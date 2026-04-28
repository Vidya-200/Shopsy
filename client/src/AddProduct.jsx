import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product", product);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);
    formData.append("color", color); 
    formData.append("stock", stock);
    formData.append("discount", discount);
    formData.append("rating", rating);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:3001/add-product", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Product added successfully");
        setProduct("");
        setCategory("");
        setDescription("");
        setPrice("");
        setBrand("");
        setColor("");
        setStock("");
        setDiscount("");
        setRating("");
        setImage(null);

        document.querySelector('input[type="file"]').value = "";
        navigate("/view-product");
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  };

  return (
    <div className="container add-product-page">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit} className="add-product-form">
        <label>Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
        />

        <label>Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <label>Category</label>
        <input
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label>Description</label>
        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Price</label>
        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Brand Name</label>
        <input
          type="text"
          placeholder="Enter brand name"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <label>Color</label>
        <input
          type="text" 
          placeholder="Enter color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />  

        <label>Stock Quantity</label>
        <input
          type="number"
          placeholder="Enter stock quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <label>Discount %</label>
        <input
          type="number"
          placeholder="Enter discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <label>Rating</label>
        <input
          type="number"
          placeholder="Enter rating (1 to 5)"
          min="1"
          max="5"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <div className="actions">
          <button type="submit" className="primary-btn">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;