import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Clock, CheckCircle, Coffee, Package } from "lucide-react";

const statusConfig = {
  received:    { label: "Recibido",           color: "var(--text-secondary)", icon: <Clock size={16} /> },
  accepted:    { label: "Aceptado",           color: "var(--info)",           icon: <CheckCircle size={16} /> },
  in_progress: { label: "En proceso",         color: "var(--warning)",        icon: <Coffee size={16} /> },
  ready:       { label: "Listo para recoger", color: "var(--success)",        icon: <Package size={16} /> },
  delivered:   { label: "Entregado",          color: "var(--text-muted)",     icon: <CheckCircle size={16} /> },
};

const stages = ["received", "accepted", "in_progress", "ready", "delivered"];

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/"); return; }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
      Cargando pedidos...
    </div>
  );

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <ClipboardList size={28} color="var(--accent)" />
        <h1 style={{ fontSize: 36 }}>MIS PEDIDOS</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <ClipboardList size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p>Aún no tienes pedidos</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => {
            const st = statusConfig[order.status] || statusConfig.received;
            const currentStage = stages.indexOf(order.status);

            return (
              <div key={order.id} className="card" style={{ padding: 24 }}>
                {/* Header del pedido */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                      #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      {order.createdAt?.toDate().toLocaleDateString("es-MX", {
                        day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    color: st.color, fontWeight: 600, fontSize: 14
                  }}>
                    {st.icon} {st.label}
                  </div>
                </div>

                {/* Barra de progreso estilo Pega lifecycle */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    {stages.map((stage, i) => {
                      const done = i <= currentStage;
                      const isLast = i === stages.length - 1;
                      return (
                        <div key={stage} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: done ? "var(--accent)" : "var(--bg-hover)",
                            border: done ? "2px solid var(--accent)" : "2px solid var(--border-light)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, transition: "all 0.3s"
                          }}>
                            {done && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "white" }} />}
                          </div>
                          {!isLast && (
                            <div style={{
                              flex: 1, height: 2,
                              background: i < currentStage ? "var(--accent)" : "var(--border)",
                              transition: "background 0.3s"
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {stages.map((stage, i) => (
                      <span key={stage} style={{
                        fontSize: 10, color: i <= currentStage ? "var(--accent)" : "var(--text-muted)",
                        fontWeight: i === currentStage ? 700 : 400,
                        textAlign: "center", flex: 1
                      }}>
                        {statusConfig[stage].label.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: 14, marginBottom: 6
                    }}>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {item.qty}x {item.name}
                        {Object.keys(item.selectedOptions || {}).length > 0 && (
                          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                            {" "}({Object.values(item.selectedOptions).flat().join(", ")})
                          </span>
                        )}
                      </span>
                      <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)"
                  }}>
                    <span style={{ fontWeight: 600 }}>Total</span>
                    <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 16 }}>
                      ${order.total?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Mensaje especial si está listo */}
                {order.status === "ready" && (
                  <div style={{
                    marginTop: 16, padding: "12px 16px",
                    background: "rgba(39, 174, 96, 0.1)", border: "1px solid var(--success)",
                    borderRadius: "var(--radius)", color: "var(--success)",
                    fontWeight: 600, fontSize: 14, textAlign: "center"
                  }}>
                    ☕ ¡Tu pedido está listo! Pasa a recogerlo.
                  </div>
                )}

                {order.status === "delivered" && (
                  <div style={{
                    marginTop: 16, padding: "12px 16px",
                    background: "var(--bg-hover)", borderRadius: "var(--radius)",
                    color: "var(--text-muted)", fontSize: 14, textAlign: "center"
                  }}>
                    ✓ Pedido completado
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MyOrders;