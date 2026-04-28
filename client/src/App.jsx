import React from "react";
import Home from "./Home";
import Login from "./login";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./register";
import Admin from "./Admin";
import Dashboard from "./Dashboard";
import AddProduct from "./AddProduct";
import ViewProduct from "./ViewProduct";
import ManageProduct from "./ManageProduct";
import EditProduct from "./EditProduct";
import ManageUser from "./ManageUser";
import SingleProduct from "./SingleProduct";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Order from "./Order";






function App() {
  return (
    
    <BrowserRouter>
     <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={< Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/view-product" element={<ViewProduct />} />
        <Route path="/manage-product" element={<ManageProduct />} />  
        <Route path="/editproduct/:id" element={<EditProduct />} /> 
        <Route path="/manage-user" element={<ManageUser />} /> 
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order" element={<Order />} />
        
       </Routes>
    </BrowserRouter>
    
  );
}

export default App
