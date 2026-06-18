import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQty, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!user) return toast.error("Inicia sesión para ordenar");
    if (cartItems.length === 0) return toast.error("Tu carrito está vacío");

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems,
        total: totalPrice,
        status: "received",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      clearCart();
      setCartOpen(false);
      toast.success("¡Pedido enviado! 🎉");
      navigate("/mis-pedidos");
    } catch (e) {
      toast.error("Error al enviar el pedido");
    }
  };

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={() => setCartOpen(false)} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300
      }} />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "100%", maxWidth: 420,
        background: "var(--bg-secondary)", borderLeft: "1px solid var(--border)",
        zIndex: 400, display: "flex", flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <h2 style={{ fontSize: 26 }}>TU CARRITO</h2>
          <button onClick={() => setCartOpen(false)} style={{
            background: "transparent", border: "none", color: "var(--text-secondary)"
          }}>
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <ShoppingBag size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cartItems.map((item) => (
                <div key={item.itemKey} style={{
                  background: "var(--bg-card)", borderRadius: "var(--radius)",
                  border: "1px solid var(--border)", padding: 14,
                  display: "flex", gap: 12
                }}>
                  <img src={item.imageUrl} alt={item.name} style={{
                    width: 64, height: 64, objectFit: "cover",
                    borderRadius: "var(--radius)", flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</span>
                      <button onClick={() => removeFromCart(item.itemKey)} style={{
                        background: "transparent", border: "none", color: "var(--text-muted)"
                      }}>
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Opciones seleccionadas */}
                    {Object.entries(item.selectedOptions || {}).map(([k, v]) => (
                      <p key={k} style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>
                        {k}: {Array.isArray(v) ? v.join(", ") : v}
                      </p>
                    ))}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={() => updateQty(item.itemKey, item.qty - 1)} style={{
                          background: "var(--bg-hover)", border: "1px solid var(--border)",
                          borderRadius: 4, color: "var(--text-primary)", width: 26, height: 26,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.itemKey, item.qty + 1)} style={{
                          background: "var(--bg-hover)", border: "1px solid var(--border)",
                          borderRadius: 4, color: "var(--text-primary)", width: 26, height: 26,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 15 }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: 20, color: "var(--accent)" }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button className="btn-primary" onClick={handleOrder}
              style={{ width: "100%", padding: "14px", fontSize: 15 }}>
              Ordenar ahora
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;