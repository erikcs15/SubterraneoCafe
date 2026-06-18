import { useState } from "react";
import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import OptionsModal from "./OptionsModal";
import toast from "react-hot-toast";

const ProductCard = ({ product, onLoginRequired }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showOptions, setShowOptions] = useState(false);

  const handleAdd = () => {
    if (!user) return onLoginRequired();
    if (product.options && product.options.length > 0) {
      setShowOptions(true);
    } else {
      addToCart(product);
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  return (
    <>
      <div className="card" style={{
        overflow: "hidden", transition: "transform 0.2s, border-color 0.2s",
        cursor: "default"
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = "var(--border-light)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        {/* Imagen */}
        <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {!product.available && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.6)", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}>
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>No disponible</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <h3 style={{ fontSize: 18, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>
              {product.name}
            </h3>
            <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", marginLeft: 8 }}>
              ${product.price}
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
            {product.description}
          </p>

          {product.options?.length > 0 && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
              Personalizable
            </p>
          )}

          <button
            className="btn-primary"
            onClick={handleAdd}
            disabled={!product.available}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <Plus size={16} /> Agregar
          </button>
        </div>
      </div>

      {showOptions && (
        <OptionsModal
          product={product}
          onClose={() => setShowOptions(false)}
        />
      )}
    </>
  );
};

export default ProductCard;