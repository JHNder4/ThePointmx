# ThePoint — Rastreo de Pedidos

App de delivery con panel admin y rastreo en tiempo real.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui
- Supabase (base de datos + realtime)
- PWA (instalable en móvil)

## Rutas
- `/` → Tienda / catálogo
- `/admin` → Panel de administración
- `/track/:orderId` → Rastreo de pedido

---

## 🚀 Deploy en Vercel (una sola vez)

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/TU_USUARIO/thepoint.git
git push -u origin main
```

### 2. Importar en Vercel
1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Conecta tu repo de GitHub
3. Vercel detecta Vite automáticamente

### 3. Variables de entorno (obligatorio)
En Vercel → tu proyecto → **Settings → Environment Variables**, agrega:

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | Tu URL de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Tu clave anon de Supabase |

> Encuéntralas en: [supabase.com](https://supabase.com) → tu proyecto → **Settings → API**

### 4. Deploy
Haz click en **Deploy** — listo. Cada `git push` redespliega automáticamente.

---

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # ← llena con tus keys de Supabase
npm run dev
```
