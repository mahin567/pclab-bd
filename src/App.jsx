import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

export function Nav() {
  const { user, logout } = useAuth();
  return (
    <header className="nav">
      <Link to="/"><img src="/logo.png" alt="PC Lab Bangladesh" className="nav-logo" /></Link>
      <nav>
        <Link to="/products">Products</Link>
        <a href="/#services">Services</a>
        <a href="/#contact">Contact</a>
        {user ? (<><Link to="/dashboard">Dashboard</Link><button className="btn ghost" onClick={logout}>Log out</button></>)
              : (<><Link to="/login">Log in</Link><Link to="/register" className="btn">Sign up</Link></>)}
      </nav>
    </header>
  );
}

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
