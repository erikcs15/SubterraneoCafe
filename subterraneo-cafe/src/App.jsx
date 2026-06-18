import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages - Cliente
import Home from "./pages/Home";
import MyOrders from "./pages/MyOrders";

// Pages - Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminCatalog from "./pages/admin/AdminCatalog";

// Components
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";

const ProtectedAdmin = ({ children }) => {
  const { user, userRole } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (userRole !== "admin") return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />
      <CartDrawer />
      <Routes>
        {/* Cliente */}
        <Route path="/" element={<Home />} />
        <Route path="/mis-pedidos" element={<MyOrders />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          }
        />
        <Route
          path="/admin/pedido/:orderId"
          element={
            <ProtectedAdmin>
              <AdminOrderDetail />
            </ProtectedAdmin>
          }
        />
        <Route
          path="/admin/catalogo"
          element={
            <ProtectedAdmin>
              <AdminCatalog />
            </ProtectedAdmin>
          }
        />
      </Routes>
    </div>
  );
};

export default App;