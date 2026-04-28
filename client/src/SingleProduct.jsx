import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SingleProduct.css";


function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  const handleAddToCart = () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find(item => item._id === product._id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart "); 
  navigate("/cart");
};
  useEffect(() => {
    axios.get(`http://localhost:3001/getProduct/${id}`)
      .then(res => {
        setProduct(res.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  if (!product) {
    return <h2>Loading...</h2>;
  }

 return (
  <div className="single-product-container">
    <div className="single-product">
      <div className="product-left">
        <img
          src={`http://localhost:3001/uploads/${product.image}`}
          alt={product.product}
        />
      </div>

      <div className="product-right">
        <h1>{product.product}</h1>
        <p className="price">₹ {product.price}</p>
        <p className="discount">{product.discount}% Off</p>
        <p className="category">Category: {product.category}</p>
         <p className="color">Color: {product.color}</p>
        <p className="rating">Rating: ⭐ {product.rating}</p>
       <p className="desc">{product.description}</p>

        <button className="cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);
}

export default SingleProduct;