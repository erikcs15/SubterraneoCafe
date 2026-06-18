import { useState } from "react";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const OptionsModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selected, setSelected] = useState({});

  const handleSelect = (label, choice, isMulti) => {
    if (isMulti) {
      const current = selected[label] || [];
      const exists = current.includes(choice);
      setSelected({
        ...selected,
        [label]: exists ? current.filter((c) => c !== choice) : [...current, choice],
      });
    } else {
      setSelected({ ...selected, [label]: choice });
    }
  };

  const handleConfirm = () => {
    for (const opt of product.options) {
      if (opt.required && !selected[opt.label]) {
        return toast.error(`Selecciona: ${opt.label}`);
      }
    }
    addToCart(product, selected);
    toast.success(`${product.name} agregado al carrito`);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 600,
      background: "rgba(0,0,0,0.75)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 440, padding: 28, position: "relative" }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "transparent", border: "none", color: "var(--text-secondary)"
        }}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: 26, marginBottom: 4 }}>{product.name}</h2>
        <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
          ${product.price}
        </p>

        {product.options.map((opt) => (
          <div key={opt.label} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>
              {opt.label.toUpperCase()}
              {opt.required && <span style={{ color: "var(--accent)", marginLeft: 4 }}>*</span>}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {opt.choices.map((choice) => {
                const isMulti = opt.multi || false;
                const isSelected = isMulti
                  ? (selected[opt.label] || []).includes(choice)
                  : selected[opt.label] === choice;

                return (
                  <button
                    key={choice}
                    onClick={() => handleSelect(opt.label, choice, isMulti)}
                    style={{
                      padding: "7px 14px", borderRadius: 20, fontSize: 13,
                      border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border-light)",
                      background: isSelected ? "var(--accent-light)" : "transparent",
                      color: isSelected ? "var(--accent)" : "var(--text-primary)",
                      fontWeight: isSelected ? 600 : 400, transition: "all 0.15s"
                    }}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button className="btn-primary" onClick={handleConfirm}
          style={{ width: "100%", padding: "12px", marginTop: 8, fontSize: 15 }}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default OptionsModal;