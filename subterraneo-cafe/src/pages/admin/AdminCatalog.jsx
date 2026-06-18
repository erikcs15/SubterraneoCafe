import { useState, useEffect } from "react";
import { db, storage } from "../../firebase/config";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Plus, Pencil, Trash2, X, Upload, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

const emptyProduct = {
  name: "", description: "", price: "",
  category: "", imageUrl: "", available: true, options: []
};

const categories = ["Café Caliente", "Café Frío", "Comida", "Panadería", "Otros"];

const emptyOption = { label: "", choices: "", required: false, multi: false };

const AdminCatalog = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [options, setOptions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyProduct);
    setOptions([]);
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product.id);
    setForm({ ...product });
    setOptions(product.options?.map(o => ({ ...o, choices: o.choices.join(", ") })) || []);
    setImagePreview(product.imageUrl || "");
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      return toast.error("Nombre, precio y categoría son obligatorios");
    }
    setLoading(true);
    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const parsedOptions = options
        .filter(o => o.label && o.choices)
        .map(o => ({
          label: o.label,
          choices: o.choices.split(",").map(c => c.trim()).filter(Boolean),
          required: o.required,
          multi: o.multi,
        }));

      const data = {
        ...form,
        price: parseFloat(form.price),
        imageUrl,
        options: parsedOptions,
        updatedAt: serverTimestamp(),
      };

      if (editing) {
        await updateDoc(doc(db, "products", editing), data);
        toast.success("Producto actualizado");
      } else {
        await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
        toast.success("Producto creado");
      }
      setShowModal(false);
    } catch (e) {
      toast.error("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    await deleteDoc(doc(db, "products", id));
    toast.success("Producto eliminado");
  };

  const toggleAvailable = async (product) => {
    await updateDoc(doc(db, "products", product.id), { available: !product.available });
  };

  const addOption = () => setOptions([...options, { ...emptyOption }]);
  const removeOption = (i) => setOptions(options.filter((_, idx) => idx !== i));
  const updateOption = (i, field, value) => {
    setOptions(options.map((o, idx) => idx === i ? { ...o, [field]: value } : o));
  };

  const filtered = activeCategory === "Todos"
    ? products
    : products.filter(p => p.category === activeCategory);

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    background: "var(--bg-primary)", border: "1px solid var(--border-light)",
    borderRadius: "var(--radius)", color: "var(--text-primary)", fontSize: 14
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 36, marginBottom: 4 }}>CATÁLOGO</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{products.length} productos registrados</p>
        </div>
        <button className="btn-primary" onClick={openNew}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}>
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      {/* Filtro por categoría */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
        {["Todos", ...categories].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 13, whiteSpace: "nowrap",
            border: activeCategory === cat ? "1px solid var(--accent)" : "1px solid var(--border-light)",
            background: activeCategory === cat ? "var(--accent-light)" : "transparent",
            color: activeCategory === cat ? "var(--accent)" : "var(--text-secondary)",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16
      }}>
        {filtered.map(product => (
          <div key={product.id} className="card" style={{
            overflow: "hidden", opacity: product.available ? 1 : 0.6
          }}>
            <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
              <img src={product.imageUrl || "https://via.placeholder.com/400x160?text=Sin+imagen"}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {!product.available && (
                <div style={{
                  position: "absolute", top: 8, left: 8,
                  background: "rgba(0,0,0,0.7)", padding: "3px 10px",
                  borderRadius: 10, fontSize: 11, color: "var(--text-muted)"
                }}>
                  No disponible
                </div>
              )}
            </div>

            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <h3 style={{ fontSize: 17, fontFamily: "'Bebas Neue', sans-serif" }}>{product.name}</h3>
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>${product.price}</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{product.category}</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.4 }}>
                {product.description}
              </p>

              {/* Acciones */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleAvailable(product)} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "7px", borderRadius: "var(--radius)", fontSize: 12,
                  border: "1px solid var(--border-light)", background: "transparent",
                  color: product.available ? "var(--success)" : "var(--text-muted)"
                }}>
                  {product.available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {product.available ? "Activo" : "Inactivo"}
                </button>
                <button onClick={() => openEdit(product)} style={{
                  padding: "7px 12px", borderRadius: "var(--radius)",
                  border: "1px solid var(--border-light)", background: "transparent",
                  color: "var(--text-primary)"
                }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(product.id)} style={{
                  padding: "7px 12px", borderRadius: "var(--radius)",
                  border: "1px solid var(--border-light)", background: "transparent",
                  color: "var(--accent)"
                }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal crear/editar */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 500,
          background: "rgba(0,0,0,0.75)", display: "flex",
          alignItems: "flex-start", justifyContent: "center",
          padding: "20px", overflowY: "auto"
        }}>
          <div className="card" style={{ width: "100%", maxWidth: 560, padding: 28, position: "relative", margin: "auto" }}>
            <button onClick={() => setShowModal(false)} style={{
              position: "absolute", top: 16, right: 16,
              background: "transparent", border: "none", color: "var(--text-secondary)"
            }}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: 26, marginBottom: 24 }}>
              {editing ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input placeholder="Nombre del producto *" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />

              <textarea placeholder="Descripción" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <input placeholder="Precio *" type="number" value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
                <select value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ ...inputStyle, color: form.category ? "var(--text-primary)" : "var(--text-muted)" }}>
                  <option value="">Categoría *</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Imagen */}
              <div>
                <label style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", border: "1px dashed var(--border-light)",
                  borderRadius: "var(--radius)", cursor: "pointer", fontSize: 14,
                  color: "var(--text-secondary)"
                }}>
                  <Upload size={16} /> Subir imagen
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="preview" style={{
                    width: "100%", height: 140, objectFit: "cover",
                    borderRadius: "var(--radius)", marginTop: 10
                  }} />
                )}
              </div>

              {/* Opciones de personalización */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                    OPCIONES DE PERSONALIZACIÓN
                  </p>
                  <button onClick={addOption} style={{
                    background: "transparent", border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius)", padding: "5px 10px",
                    color: "var(--accent)", fontSize: 12, display: "flex", alignItems: "center", gap: 4
                  }}>
                    <Plus size={13} /> Agregar
                  </button>
                </div>

                {options.map((opt, i) => (
                  <div key={i} style={{
                    background: "var(--bg-primary)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius)", padding: 12, marginBottom: 10
                  }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input placeholder="Nombre (ej: Tamaño)" value={opt.label}
                        onChange={e => updateOption(i, "label", e.target.value)}
                        style={{ ...inputStyle, flex: 1 }} />
                      <button onClick={() => removeOption(i)} style={{
                        background: "transparent", border: "none", color: "var(--accent)"
                      }}>
                        <X size={16} />
                      </button>
                    </div>
                    <input placeholder="Opciones separadas por coma (ej: Chico, Mediano, Grande)"
                      value={opt.choices}
                      onChange={e => updateOption(i, "choices", e.target.value)}
                      style={{ ...inputStyle, marginBottom: 8 }} />
                    <div style={{ display: "flex", gap: 16 }}>
                      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <input type="checkbox" checked={opt.required}
                          onChange={e => updateOption(i, "required", e.target.checked)} />
                        Obligatorio
                      </label>
                      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <input type="checkbox" checked={opt.multi}
                          onChange={e => updateOption(i, "multi", e.target.checked)} />
                        Selección múltiple
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12 }}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ flex: 2, padding: 12 }}>
                {loading ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminCatalog;