import { useState } from "react";
import { motion } from "motion/react";
import { Check, Image, Eye, EyeOff, Zap } from "lucide-react";
import { BannerSettings } from "../types";
import { saveBanner } from "../store";

interface Props {
  banner: BannerSettings;
  onBannerChange: (banner: BannerSettings) => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{
        background: checked ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "rgba(63,63,70,0.8)",
        boxShadow: checked ? "0 0 12px rgba(37,99,235,0.4)" : "none",
      }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", hint }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none placeholder-[#52525B] transition-all"
        style={{ background: "rgba(9,9,11,0.9)", border: "1px solid rgba(63,63,70,0.5)" }}
        onFocus={e => { e.target.style.border = "1px solid rgba(37,99,235,0.4)"; }}
        onBlur={e => { e.target.style.border = "1px solid rgba(63,63,70,0.5)"; }}
      />
      {hint && <p className="text-[#52525B] text-xs mt-1">{hint}</p>}
    </div>
  );
}

export function AdminBanner({ banner, onBannerChange }: Props) {
  const [draft, setDraft] = useState<BannerSettings>(banner);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (partial: Partial<BannerSettings>) => {
    setDraft(prev => ({ ...prev, ...partial }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBanner(draft);
      onBannerChange(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error guardando banner:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-xl font-bold text-white tracking-tight">Banner</h2>
        <p className="text-[#71717A] text-sm mt-0.5">Configura el banner principal de la tienda</p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {/* Estado del banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-2xl p-5"
          style={{
            background: draft.isActive ? "rgba(37,99,235,0.08)" : "rgba(24,24,27,0.85)",
            border: draft.isActive ? "1px solid rgba(37,99,235,0.3)" : "1px solid rgba(63,63,70,0.5)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {draft.isActive
                ? <Eye className="w-5 h-5 text-blue-400" />
                : <EyeOff className="w-5 h-5 text-[#52525B]" />
              }
              <div>
                <p className="text-white font-semibold text-sm">Banner activo</p>
                <p className="text-[#71717A] text-xs mt-0.5">
                  {draft.isActive ? "Visible en la tienda" : "Oculto para clientes"}
                </p>
              </div>
            </div>
            <Toggle checked={draft.isActive} onChange={v => update({ isActive: v })} />
          </div>
        </motion.div>

        {/* Campos del banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: "rgba(24,24,27,0.85)", border: "1px solid rgba(63,63,70,0.5)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-blue-400" />
            <p className="text-white font-semibold text-sm">Texto del badge</p>
          </div>
          <Field
            label="Badge"
            value={draft.badgeText}
            onChange={v => update({ badgeText: v })}
            placeholder="Entrega Premium"
            hint="Texto que aparece en la etiqueta superior de la tienda"
          />
          <Field
            label="Botón"
            value={draft.buttonText}
            onChange={v => update({ buttonText: v })}
            placeholder="Hacer pedido"
            hint="Texto del botón principal de la tienda"
          />
        </motion.div>

        {/* Banner promocional */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: "rgba(24,24,27,0.85)", border: "1px solid rgba(63,63,70,0.5)" }}
        >
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Banner promocional</p>
            <p className="text-[#52525B] text-xs">Aparece cuando el banner está activo</p>
          </div>
          <Field
            label="Título"
            value={draft.title}
            onChange={v => update({ title: v })}
            placeholder="Ej: Oferta especial de fin de semana"
          />
          <Field
            label="Subtítulo"
            value={draft.subtitle}
            onChange={v => update({ subtitle: v })}
            placeholder="Ej: 20% descuento en todos los pre-rolls"
          />
          <Field
            label="URL de imagen"
            value={draft.imageUrl}
            onChange={v => update({ imageUrl: v })}
            placeholder="https://..."
            hint="Imagen del banner (opcional)"
          />
          <Field
            label="Enlace del botón"
            value={draft.buttonLink}
            onChange={v => update({ buttonLink: v })}
            placeholder="https://... o /ruta"
            hint="Deja vacío para que el banner solo muestre información"
          />
        </motion.div>

        {/* Vista previa */}
        {draft.isActive && (draft.title || draft.subtitle) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(37,99,235,0.3)" }}
          >
            <div className="px-3 py-2 flex items-center gap-2" style={{ background: "rgba(37,99,235,0.15)", borderBottom: "1px solid rgba(37,99,235,0.2)" }}>
              <Eye className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Vista previa</span>
            </div>
            <div
              className="p-5 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(9,9,11,0.98) 100%)" }}
            >
              {draft.imageUrl && (
                <div className="absolute inset-0 opacity-20">
                  <img src={draft.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative">
                {draft.title && (
                  <p className="text-white font-bold text-base leading-tight">{draft.title}</p>
                )}
                {draft.subtitle && (
                  <p className="text-[#A1A1AA] text-sm mt-1">{draft.subtitle}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Botón guardar */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          style={{
            background: saved
              ? "linear-gradient(135deg, #16A34A, #15803D)"
              : "linear-gradient(135deg, #2563EB, #1D4ED8)",
            boxShadow: saved
              ? "0 0 20px rgba(22,163,74,0.3)"
              : "0 0 20px rgba(37,99,235,0.3)",
          }}
        >
          <Check className={`w-4 h-4 transition-transform ${saved ? "scale-110" : "scale-100"}`} />
          {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
        </motion.button>

        {/* Instrucción SQL */}
        <div
          className="rounded-xl px-4 py-3 text-xs text-[#71717A]"
          style={{ background: "rgba(39,39,42,0.4)", border: "1px solid rgba(63,63,70,0.3)" }}
        >
          <Image className="w-3 h-3 inline mr-1.5 text-[#52525B]" />
          Asegúrate de haber ejecutado el SQL de migración en Supabase para que el banner funcione.
        </div>
      </div>
    </div>
  );
}
