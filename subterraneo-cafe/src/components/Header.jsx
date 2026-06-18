import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, ClipboardList, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import AuthModal from "./AuthModal";

const Header = () => {
  const { user, userRole, logout } = useAuth();
  const { totalItems, setCartOpen } = useCart();
  const [showAuth, setShowAuth] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserMenu(false);
    navigate("/");
  };

  return (
    <>
      <header style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 20px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28, color: "var(--text-primary)",
              letterSpacing: 2
            }}>
              SUBTERRÁNEO <span style={{ color: "var(--accent)" }}>CAFÉ</span>
            </h1>
          </Link>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

            {/* Carrito */}
            {userRole !== "admin" && (
              <button
                onClick={() => setCartOpen(true)}
                style={{
                  background: "transparent", border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius)", padding: "8px 14px",
                  color: "var(--text-primary)", display: "flex",
                  alignItems: "center", gap: 8, position: "relative"
                }}
              >
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="badge" style={{ position: "absolute", top: -8, right: -8 }}>
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {/* Usuario */}
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  style={{
                    background: "var(--accent-light)", border: "1px solid var(--accent)",
                    borderRadius: "var(--radius)", padding: "8px 14px",
                    color: "var(--accent)", display: "flex", alignItems: "center", gap: 8
                  }}
                >
                  <User size={18} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>
                    {user.email.split("@")[0]}
                  </span>
                </button>

                {userMenu && (
                  <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius)", minWidth: 180, zIndex: 200,
                    overflow: "hidden"
                  }}>
                    {userRole === "admin" ? (
                      <>
                        <Link to="/admin" onClick={() => setUserMenu(false)} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "12px 16px", color: "var(--text-primary)",
                          textDecoration: "none", fontSize: 14,
                          borderBottom: "1px solid var(--border)"
                        }}>
                          <ClipboardList size={16} /> Pedidos
                        </Link>
                        <Link to="/admin/catalogo" onClick={() => setUserMenu(false)} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "12px 16px", color: "var(--text-primary)",
                          textDecoration: "none", fontSize: 14,
                          borderBottom: "1px solid var(--border)"
                        }}>
                          <Settings size={16} /> Catálogo
                        </Link>
                      </>
                    ) : (
                      <Link to="/mis-pedidos" onClick={() => setUserMenu(false)} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 16px", color: "var(--text-primary)",
                        textDecoration: "none", fontSize: 14,
                        borderBottom: "1px solid var(--border)"
                      }}>
                        <ClipboardList size={16} /> Mis Pedidos
                      </Link>
                    )}
                    <button onClick={handleLogout} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 16px", color: "var(--accent)",
                      background: "transparent", border: "none",
                      width: "100%", fontSize: 14, textAlign: "left"
                    }}>
                      <LogOut size={16} /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn-primary" onClick={() => setShowAuth(true)}
                style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <User size={16} /> Ingresar
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Header;