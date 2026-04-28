import { useState, useEffect } from "react";
import axios from "axios";
import women from "./images/women.jpg";
import men from "./images/men.jpg";
import kid from "./images/kid.jpg";
import foot from "./images/foot.jfif";
import beauty from "./images/beauty.webp";
import accessories from "./images/accessories.jpg";
import homedecor from "./images/homedecor.webp";
import homefurnishing from "./images/homefurnishing.jpg";
import kitchen from "./images/kitchen.webp";
import sports from "./images/sports.jpeg";
import toy from "./images/toy.jpg";
import electronic_accessories from "./images/electronic_accessories.webp";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <div className="navbar">
        <h3 className="shop-title">Shopsy</h3>

        <div className="search-bar">
          <i className="fa fa-search"></i>
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
          />
        </div>

        <div className="nav-menu">

          <div className="nav-item user-menu">
            {user ? (
              <>
                <span onClick={() => setShowDropdown(!showDropdown)}>
                  {user.name} ⌄
                </span>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/register" className="nav-item">
                Register
              </Link>
            )}
          </div>

          <Link to="/cart" className="nav-item">
            <i className="fa fa-shopping-cart"></i> Cart
          </Link>

          <Link to="/my-orders" className="nav-item">
            <i className="fa fa-briefcase"></i> My Orders
          </Link>

          <div className="nav-item">
            <i className="fa fa-ellipsis-v"></i>
          </div>
        </div>
      </div>

      <div className="category-wrapper">
        <div className="category-container">

          <div className="category-item">
            <img src={women} alt="Women" />
            <p>Women Clothing</p>
          </div>

          <div className="category-item">
            <img src={men} alt="Men" />
            <p>Men Clothing</p>
          </div>

          <div className="category-item">
            <img src={kid} alt="Kids" />
            <p>Kids Clothing</p>
          </div>

          <div className="category-item">
            <img src={foot} alt="Footwear" />
            <p>Footwear</p>
          </div>

          <div className="category-item">
            <img src={beauty} alt="Beauty" />
            <p>Beauty Wellness & More</p>
          </div>

          <div className="category-item">
            <img src={electronic_accessories} alt="Electronic Accessories" />
            <p>Electronic Accessories</p>
          </div>

          <div className="category-item">
            <img src={accessories} alt="Accessories" />
            <p>Accessories & More</p>
          </div>

          <div className="category-item">
            <img src={homedecor} alt="Home Decor" />
            <p>Home Decor</p>
          </div>

          <div className="category-item">
            <img src={homefurnishing} alt="Home Furnishing" />
            <p>Home Furnishing</p>
          </div>

          <div className="category-item">
            <img src={sports} alt="Sports" />
            <p>Sports</p>
          </div>

          <div className="category-item">
            <img src={toy} alt="Toy" />
            <p>Toy</p>
          </div>

          <div className="category-item">
            <img src={kitchen} alt="Kitchen" />
            <p>Kitchen & Appliances</p>
          </div>
        </div>
      </div>

      <div className="product-section">
        <h2>Products</h2>

        <div className="product-container">
          {products.map((item, index) => (
            <div className="product-card" key={index}>
              <img
                src={`http://localhost:3001/uploads/${item.image}`}
                alt={item.product}
                onClick={() => navigate(`/product/${item._id}`)}
                style={{ cursor: "pointer" }}
              />

              <h3>{item.product}</h3>
              <p className="discount">{item.discount}% Off</p>
              <p className="price">₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-top">

          <div className="footer-col">
            <h5>ABOUT</h5>
            <p>Contact Us</p>
            <p>Careers</p>
          </div>

          <div className="footer-col">
            <h5>HELP</h5>
            <p>Payments</p>
            <p>Shipping</p>
            <p>Cancellation & Returns</p>
            <p>FAQ</p>
          </div>

          <div className="footer-col">
            <h5>SOCIAL</h5>
            <p>Facebook</p>
            <p>Instagram</p>
            <p>Twitter</p>
          </div>

        </div>
      </footer>
    </>
  );
}

export default Home;