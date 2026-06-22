import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Eye, EyeOff, Zap } from "lucide-react";
import { loginAdmin } from "./store";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    await new Promise(r => setTimeout(r, 600));
    if (loginAdmin(password)) {
      onLogin();
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-5">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(37,99,235,0.05))",
              border: "1px solid rgba(37,99,235,0.3)",
              boxShadow: "0 0 30px rgba(37,99,235,0.2)",
            }}
          >
            <Lock className="w-7 h-7 text-blue-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Panel Admin</h1>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Zap className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">Thepoint</span>
          </div>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(24,24,27,0.9)",
            border: "1px solid rgba(63,63,70,0.5)",
            backdropFilter: "blur(16px)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                placeholder="Contraseña"
                autoFocus
                className="w-full px-4 py-3.5 pr-12 rounded-xl text-white placeholder-[#52525B] outline-none transition-all duration-200 text-sm"
                style={{
                  background: "rgba(9,9,11,0.8)",
                  border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(63,63,70,0.6)",
                  boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
                }}
                onFocus={e => {
                  if (!error) {
                    e.target.style.border = "1px solid rgba(37,99,235,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
                  }
                }}
                onBlur={e => {
                  if (!error) {
                    e.target.style.border = "1px solid rgba(63,63,70,0.6)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA] transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs text-center"
                >
                  Contraseña incorrecta
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!password.trim() || loading}
              className="py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                boxShadow: "0 0 20px rgba(37,99,235,0.3)",
              }}
            >
              {loading ? "Verificando..." : "Entrar al panel"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
