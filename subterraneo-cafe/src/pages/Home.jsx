import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mockProducts, categories } from "../data/mockProducts";
import ProductCard from "../components/ProductCard";
import AuthModal from "../components/AuthModal";

const Home = () => {
  const { userRole } = useAuth();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showAuth, setShowAuth] = useState(false);

  const filtered = activeCategory === "Todos"
    ? mockProducts
    : mockProducts.filter((p) => p.category === activeCategory);

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

        {/* Grid productos */}
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
      </main>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Home;