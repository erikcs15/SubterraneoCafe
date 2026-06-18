import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast.error("Completa todos los campos");
    if (mode === "register" && !form.name) return toast.error("Ingresa tu nombre");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("¡Bienvenido de vuelta!");
      } else {
        await register(form.name, form.email, form.password);
        toast.success("¡Cuenta creada!");
      }
      onClose();
    } catch (e) {
      toast.error(e.code === "auth/invalid-credential" ? "Correo o contraseña incorrectos" : "Error al procesar");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "var(--bg-primary)", border: "1px solid var(--border-light)",
    borderRadius: "var(--radius)", color: "var(--text-primary)",
    fontSize: 14, outline: "none"
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(0,0,0,0.7)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, padding: 32, position: "relative" }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "transparent", border: "none", color: "var(--text-secondary)"
        }}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: 32, marginBottom: 6 }}>
          {mode === "login" ? "BIENVENIDO" : "CREAR CUENTA"}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
          {mode === "login" ? "Ingresa para hacer tu pedido" : "Regístrate para ordenar"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
          )}
          <input
            placeholder="Correo electrónico"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={inputStyle}
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", marginTop: 24, padding: "12px", fontSize: 15 }}
        >
          {loading ? "Procesando..." : mode === "login" ? "Ingresar" : "Crear cuenta"}
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-secondary)" }}>
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <span
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;