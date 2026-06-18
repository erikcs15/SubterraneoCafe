import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Clock, User, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

const stages = [
  { key: "received",    label: "Recibido",           color: "var(--text-secondary)" },
  { key: "accepted",    label: "Aceptado",            color: "var(--info)" },
  { key: "in_progress", label: "En proceso",          color: "var(--warning)" },
  { key: "ready",       label: "Listo para recoger",  color: "var(--success)" },
  { key: "delivered",   label: "Entregado",           color: "var(--text-muted)" },
];

const nextAction = {
  received:    { label: "Aceptar pedido",      next: "accepted" },
  accepted:    { label: "Marcar en proceso",   next: "in_progress" },
  in_progress: { label: "Marcar como listo",   next: "ready" },
  ready:       { label: "Marcar como entregado", next: "delivered" },
};

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "orders", orderId), (snap) => {
      if (snap.exists()) setOrder({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [orderId]);

  const handleAdvance = async () => {
    if (!nextAction[order.status]) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: nextAction[order.status].next,
        updatedAt: serverTimestamp(),
      });
      toast.success(`Pedido actualizado a: ${stages.find(s => s.key === nextAction[order.status].next)?.label}`);
    } catch {
      toast.error("Error al actualizar el pedido");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return (
    <div style={{ textAlign: "center", padding: 80, color: "var(--text-muted)" }}>
      Cargando pedido...
    </div>
  );

  const currentStageIndex = stages.findIndex(s => s.key === order.status);
  const currentStage = stages[currentStageIndex];
  const action = nextAction[order.status];

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>

      {/* Breadcrumb estilo Pega */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <button onClick={() => navigate("/admin")} style={{
          background: "transparent", border: "none",
          color: "var(--accent)", display: "flex", alignItems: "center",
          gap: 4, fontSize: 14, cursor: "pointer"
        }}>
          <ArrowLeft size={16} /> Pedidos
        </button>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          #{order.id.slice(-6).toUpperCase()}
        </span>
      </div>

      {/* Case Header estilo Pega */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 32, marginBottom: 4 }}>
              PEDIDO <span style={{ color: "var(--accent)" }}>#{order.id.slice(-6).toUpperCase()}</span>
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, color: "var(--text-muted)", fontSize: 13 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <User size={13} /> {order.userEmail}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={13} />
                {order.createdAt?.toDate().toLocaleDateString("es-MX", {
                  day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
                })}
              </span>
            </div>
          </div>

          {/* Action button estilo Pega — solo si hay siguiente acción */}
          {action && (
            <button
              className="btn-primary"
              onClick={handleAdvance}
              disabled={loading}
              style={{ padding: "12px 24px", fontSize: 15, whiteSpace: "nowrap" }}
            >
              {loading ? "Actualizando..." : action.label}
            </button>
          )}
        </div>

        {/* Stage lifecycle estilo Pega */}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            {stages.map((stage, i) => {
              const done = i <= currentStageIndex;
              const isLast = i === stages.length - 1;
              return (
                <div key={stage.key} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: done ? "var(--accent)" : "var(--bg-hover)",
                    border: `2px solid ${done ? "var(--accent)" : "var(--border-light)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s"
                  }}>
                    {done && <div style={{ width: 12, height: 12, borderRadius: "50%", background: "white" }} />}
                  </div>
                  {!isLast && (
                    <div style={{
                      flex: 1, height: 3,
                      background: i < currentStageIndex ? "var(--accent)" : "var(--border)",
                      transition: "background 0.3s"
                    }} />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {stages.map((stage, i) => (
              <span key={stage.key} style={{
                fontSize: 11, textAlign: "center", flex: 1,
                color: i === currentStageIndex ? currentStage.color : i < currentStageIndex ? "var(--accent)" : "var(--text-muted)",
                fontWeight: i === currentStageIndex ? 700 : 400
              }}>
                {stage.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Items del pedido */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <ShoppingBag size={18} color="var(--accent)" />
          <h2 style={{ fontSize: 22 }}>DETALLE DEL PEDIDO</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {order.items?.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: "1px solid var(--border)"
            }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>
                  {item.qty}x {item.name}
                </p>
                {Object.entries(item.selectedOptions || {}).map(([k, v]) => (
                  <p key={k} style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {k}: {Array.isArray(v) ? v.join(", ") : v}
                  </p>
                ))}
              </div>
              <span style={{ fontWeight: 700, color: "var(--accent)" }}>
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-light)"
        }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
          <span style={{ fontWeight: 700, fontSize: 20, color: "var(--accent)" }}>
            ${order.total?.toFixed(2)}
          </span>
        </div>
      </div>
    </main>
  );
};

export default AdminOrderDetail;