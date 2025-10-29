import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { jwtDecode } from "jwt-decode";
import CategoriesList from "./pages/Categories/CategoriesList";
import AddCategory from "./pages/Categories/AddCategory";
import EditCategory from "./pages/Categories/EditCategory";
import CategoryDetails from "./pages/Categories/CategoryDetails";
import ProductsList from "./pages/Products/ProductsList";
import AddProduct from "./pages/Products/AddProduct";
import EditProduct from "./pages/Products/EditProduct";
import ProductDetails from "./pages/Products/ProductDetails";
import OrdersList from "./pages/Orders/OrdersList";
import OrderDetails from "./pages/Orders/OrderDetails";
import CreateOrder from "./pages/Orders/CreateOrder";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUserName(decoded.email || "User");
      } catch (err) {
        setIsLoggedIn(false);
        setUserName("");
      }
    }
  }, []);

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userName={userName}
        setUserName={setUserName}
      />

      <Routes>
        {/* تمرير الحالة والـ userName للـ Home */}
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} userName={userName} />} />

        {/* تمرير setter و setUserName للـ Login لتحديث الحالة فورًا بعد تسجيل الدخول */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />}
        />

        <Route path="/register" element={<Register />} />

        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/add" element={<AddCategory />} />
        <Route path="/categories/edit/:id" element={<EditCategory />} />
        <Route path="/categories/:id" element={<CategoryDetails />} />

    {/* Products routes */}
    <Route path="/products" element={<ProductsList />} />
    <Route path="/products/add" element={<AddProduct />} />
    <Route path="/products/edit/:id" element={<EditProduct />} />
    <Route path="/products/:id" element={<ProductDetails />} />

        {/* Orders routes */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/create"
          element={
            <ProtectedRoute>
              <CreateOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;