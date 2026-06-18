import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import AuthModal from "../components/AuthModal";

const Home = () => {
  const { userRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Todos"]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const prods = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.available);

      // Extraer categorías únicas
      const cats = ["Todos", ...new Set(prods.map((p) => p.category).filter(Boolean))];
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = activeCategory === "Todos"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        {/* Hero */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1 style={{ fontSize: 56, lineHeight: 1, marginBottom: 10 }}>
            EL CAFÉ DE <span style={{ color: "var(--accent)" }}>LA GENTE</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
            Ordena y recoge en Vidrio 1857, Col. Americana, Guadalajara
          </p>
        </div>

        {/* Categorías */}
        {!loading && categories.length > 1 && (
          <div style={{
            display: "flex", gap: 8, marginBottom: 32,
            overflowX: "auto", paddingBottom: 8
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 18px", borderRadius: 20, fontSize: 14,
                  whiteSpace: "nowrap", fontWeight: 500,
                  border: activeCategory === cat ? "1px solid var(--accent)" : "1px solid var(--border-light)",
                  background: activeCategory === cat ? "var(--accent-light)" : "transparent",
                  color: activeCategory === cat ? "var(--accent)" : "var(--text-secondary)",
                  transition: "all 0.15s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Estados */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <div style={{
              width: 40, height: 40, border: "3px solid var(--border)",
              borderTop: "3px solid var(--accent)", borderRadius: "50%",
              margin: "0 auto 16px", animation: "spin 0.8s linear infinite"
            }} />
            <p>Cargando menú...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <p style={{ fontSize: 18, marginBottom: 8 }}>☕</p>
            <p>No hay productos disponibles por el momento</p>
          </div>
        ) : (
          /* Grid productos */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20
          }}>
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onLoginRequired={() => setShowAuth(true)}
              />
            ))}
          </div>
        )}
      </main>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Home;