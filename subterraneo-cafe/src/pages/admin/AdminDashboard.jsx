import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronRight, Coffee } from "lucide-react";

const statusConfig = {
  received:    { label: "Recibido",           color: "var(--text-secondary)", bg: "var(--bg-hover)" },
  accepted:    { label: "Aceptado",           color: "var(--info)",           bg: "rgba(41,128,185,0.12)" },
  in_progress: { label: "En proceso",         color: "var(--warning)",        bg: "rgba(243,156,18,0.12)" },
  ready:       { label: "Listo para recoger", color: "var(--success)",        bg: "rgba(39,174,96,0.12)" },
  delivered:   { label: "Entregado",          color: "var(--text-muted)",     bg: "var(--bg-hover)" },
};

const filterTabs = ["Todos", "Recibido", "Aceptado", "En proceso", "Listo", "Entregado"];

const statusByTab = {
  "Todos": null,
  "Recibido": "received",
  "Aceptado": "accepted",
  "En proceso": "in_progress",
  "Listo": "ready",
  "Entregado": "delivered",
};

const getElapsed = (createdAt) => {
  if (!createdAt) return "";
  const diff = Math.floor((Date.now() - createdAt.toDate()) / 60000);
  if (diff < 1) return "Justo ahora";
  if (diff === 1) return "Hace 1 min";
  return `Hace ${diff} mins`;
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = statusByTab[activeTab]
    ? orders.filter((o) => o.status === statusByTab[activeTab])
    : orders;

  const countByStatus = (tab) => {
    const st = statusByTab[tab];
    if (!st) return orders.length;
    return orders.filter((o) => o.status === st).length;
  };

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header estilo Pega */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Coffee size={24} color="var(--accent)" />
          <h1 style={{ fontSize: 36 }}>PEDIDOS</h1>
          <span style={{
            background: "var(--accent)", color: "white",
            borderRadius: 12, padding: "2px 10px", fontSize: 13, fontWeight: 700
          }}>
            {orders.filter(o => o.status !== "delivered").length} activos
          </span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          Actualización en tiempo real
        </p>
      </div>

      {/* Filter tabs estilo Pega */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 24,
        borderBottom: "1px solid var(--border)", paddingBottom: 0,
        overflowX: "auto"
      }}>
        {filterTabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 16px", background: "transparent",
            border: "none", borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
            color: activeTab === tab ? "var(--accent)" : "var(--text-secondary)",
            fontWeight: activeTab === tab ? 700 : 400,
            fontSize: 14, whiteSpace: "nowrap", transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 6
          }}>
            {tab}
            <span style={{
              background: activeTab === tab ? "var(--accent)" : "var(--border-light)",
              color: activeTab === tab ? "white" : "var(--text-muted)",
              borderRadius: 10, padding: "1px 7px", fontSize: 11
            }}>
              {countByStatus(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Lista de pedidos estilo Pega work list */}
      {loading ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 40 }}>Cargando...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <Coffee size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p>No hay pedidos en esta categoría</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Header de columnas */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 40px",
            padding: "8px 16px", fontSize: 11, fontWeight: 700,
            color: "var(--text-muted)", letterSpacing: 1,
            borderBottom: "1px solid var(--border)", marginBottom: 4
          }}>
            <span>PEDIDO</span>
            <span>CLIENTE / ITEMS</span>
            <span>TOTAL</span>
            <span>ESTATUS</span>
            <span></span>
          </div>

          {filtered.map((order) => {
            const st = statusConfig[order.status] || statusConfig.received;
            return (
              <div
                key={order.id}
                onClick={() => navigate(`/admin/pedido/${order.id}`)}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 40px",
                  alignItems: "center", padding: "14px 16px",
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius)", cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.background = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--bg-card)";
                }}
              >
                {/* ID + tiempo */}
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>
                    #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Clock size={10} /> {getElapsed(order.createdAt)}
                  </p>
                </div>

                {/* Cliente e items */}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                    {order.userEmail?.split("@")[0]}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {order.items?.map(i => `${i.qty}x ${i.name}`).join(", ")}
                  </p>
                </div>

                {/* Total */}
                <span style={{ fontWeight: 700, color: "var(--accent)" }}>
                  ${order.total?.toFixed(2)}
                </span>

                {/* Badge de estatus */}
                <div>
                  <span style={{
                    padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                    color: st.color, background: st.bg
                  }}>
                    {st.label}
                  </span>
                </div>

                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;