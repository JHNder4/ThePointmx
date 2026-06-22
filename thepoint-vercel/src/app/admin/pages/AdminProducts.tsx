import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package2, Edit3, Check, X, Tag, Sparkles } from "lucide-react";
import { AdminProduct } from "../types";
import { saveAdminProducts } from "../store";

interface Props {
  products: AdminProduct[];
  onProductsChange: (products: AdminProduct[]) => void;
}

interface EditState {
  id: string;
  name: string;
  price: string;
  promoPrice: string;
}

function Toggle({ checked, onChange, accent = "blue" }: { checked: boolean; onChange: (v: boolean) => void; accent?: "blue" | "yellow" }) {
  const bg = checked
    ? accent === "yellow"
      ? "linear-gradient(135deg, #FACC15, #EAB308)"
      : "linear-gradient(135deg, #2563EB, #1D4ED8)"
    : "rgba(63,63,70,0.8)";
  const shadow = checked
    ? accent === "yellow"
      ? "0 0 12px rgba(250,204,21,0.4)"
      : "0 0 12px rgba(37,99,235,0.4)"
    : "none";
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: bg, boxShadow: shadow }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

export function AdminProducts({ products, onProductsChange }: Props) {
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const update = async (updated: AdminProduct[]) => {
    setSaving(true);
    try {
      await saveAdminProducts(updated);
      onProductsChange(updated);
    } catch (err) {
      console.error("Error guardando productos:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailable = (id: string, val: boolean) => {
    update(products.map(p => p.id === id ? { ...p, available: val } : p));
  };

  const togglePromo = (id: string, val: boolean) => {
    update(products.map(p => p.id === id ? { ...p, isPromo: val } : p));
  };

  const startEdit = (p: AdminProduct) => {
    setEditing({ id: p.id, name: p.name, price: String(p.price), promoPrice: String(p.promoPrice || 0) });
  };

  const saveEdit = () => {
    if (!editing) return;
    update(products.map(p =>
      p.id === editing.id
        ? {
            ...p,
            name: editing.name.trim() || p.name,
            price: Number(editing.price) || p.price,
            promoPrice: Number(editing.promoPrice) || 0,
          }
        : p
    ));
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  // Group products for display
  const mainProducts = products.filter(p => !p.isCategory && !p.categoryKey);
  const categoryButtons = products.filter(p => p.isCategory);
  const categoryItems = products.filter(p => p.categoryKey && !p.isCategory);

  const renderProduct = (product: AdminProduct, idx: number) => {
    const isEditing = editing?.id === product.id;

    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.04 }}
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: "rgba(24,24,27,0.85)",
          border: product.isPromo
            ? "1px solid rgba(250,204,21,0.3)"
            : product.available
              ? "1px solid rgba(63,63,70,0.5)"
              : "1px solid rgba(63,63,70,0.25)",
          opacity: product.available ? 1 : 0.65,
        }}
      >
        <div className="p-4 flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center mt-0.5"
            style={{ background: "rgba(39,39,42,0.8)" }}
          >
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : product.isCategory ? (
              <Tag className="w-5 h-5 text-blue-400" />
            ) : (
              <Package2 className="w-5 h-5 text-[#52525B]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                  value={editing.name}
                  onChange={e => setEditing(ed => ed ? { ...ed, name: e.target.value } : ed)}
                  placeholder="Nombre"
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ background: "rgba(9,9,11,0.9)", border: "1px solid rgba(37,99,235,0.4)" }}
                />
                {!product.isCategory && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-[#71717A] text-sm flex-shrink-0">Precio $</span>
                      <input
                        type="number"
                        value={editing.price}
                        onChange={e => setEditing(ed => ed ? { ...ed, price: e.target.value } : ed)}
                        placeholder="Precio"
                        className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                        style={{ background: "rgba(9,9,11,0.9)", border: "1px solid rgba(37,99,235,0.4)" }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-sm flex-shrink-0">Promo $</span>
                      <input
                        type="number"
                        value={editing.promoPrice}
                        onChange={e => setEditing(ed => ed ? { ...ed, promoPrice: e.target.value } : ed)}
                        placeholder="Precio promocional"
                        className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                        style={{ background: "rgba(9,9,11,0.9)", border: "1px solid rgba(250,204,21,0.3)" }}
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.isCategory && (
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded text-blue-400"
                      style={{ background: "rgba(37,99,235,0.1)" }}
                    >
                      <Tag className="w-2.5 h-2.5 inline mr-0.5" />Cat
                    </span>
                  )}
                  {product.categoryKey && !product.isCategory && (
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded text-[#71717A]"
                      style={{ background: "rgba(63,63,70,0.3)" }}
                    >
                      {product.categoryKey}
                    </span>
                  )}
                  {product.isPromo && (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded text-yellow-400"
                      style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }}
                    >
                      <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />PROMO
                    </span>
                  )}
                  <p className="text-white font-semibold text-sm">{product.name}</p>
                </div>
                {!product.isCategory && (
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-blue-400 font-bold text-base">${product.price}</p>
                    {product.isPromo && product.promoPrice > 0 && (
                      <p className="text-yellow-400 font-bold text-sm">
                        Promo: ${product.promoPrice}
                      </p>
                    )}
                  </div>
                )}
                <p className={`text-xs mt-0.5 ${product.available ? "text-green-400" : "text-[#52525B]"}`}>
                  {product.available ? "Disponible" : "No disponible"}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={saveEdit}
                  disabled={saving}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-green-400 disabled:opacity-60"
                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}
                >
                  <Check className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={cancelEdit}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A]"
                  style={{ background: "rgba(39,39,42,0.8)", border: "1px solid rgba(63,63,70,0.5)" }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startEdit(product)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71717A] hover:text-white transition-colors"
                  style={{ background: "rgba(39,39,42,0.8)" }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </motion.button>
                <Toggle
                  checked={product.available}
                  onChange={val => toggleAvailable(product.id, val)}
                />
              </div>
            )}
            {!isEditing && !product.isCategory && (
              <div className="flex items-center gap-2">
                <span className="text-[#52525B] text-[10px] font-medium">Promo</span>
                <Toggle
                  checked={product.isPromo}
                  onChange={val => togglePromo(product.id, val)}
                  accent="yellow"
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const sections = [
    { label: "Productos principales", items: mainProducts },
    { label: "Categorías", items: categoryButtons },
    { label: "Ítems de categoría", items: categoryItems },
  ].filter(s => s.items.length > 0);

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-xl font-bold text-white tracking-tight">Productos</h2>
        <p className="text-[#71717A] text-sm mt-0.5">
          Gestiona disponibilidad, precios y promociones
        </p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {sections.map(section => (
          <div key={section.label}>
            <p className="text-[#52525B] text-xs font-semibold uppercase tracking-widest mb-3 px-1">
              {section.label}
            </p>
            <div className="flex flex-col gap-3">
              {section.items.map((p, i) => renderProduct(p, i))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {products.some(p => !p.available) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 px-4 py-3 rounded-xl text-xs text-amber-400"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
          >
            Los productos desactivados se ocultan automáticamente del catálogo de clientes.
          </motion.div>
        )}
        {products.some(p => p.isPromo) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 px-4 py-3 rounded-xl text-xs text-yellow-400"
            style={{ background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.2)" }}
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            Los productos con Promo activado aparecen en la sección de Promociones de la tienda.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
