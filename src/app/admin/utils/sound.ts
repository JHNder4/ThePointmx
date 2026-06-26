/**
 * Sonido de notificación para el admin
 * Tono triple ascendente + vibración en móvil
 */
export function playOrderNotificationSound() {
  try {
    const ctx = new AudioContext();

    const playTone = (freq: number, startTime: number, duration: number, vol = 0.3) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const t = ctx.currentTime;
    // Acorde ascendente más notorio
    playTone(523, t,        0.15, 0.25); // Do
    playTone(659, t + 0.16, 0.15, 0.28); // Mi
    playTone(784, t + 0.32, 0.22, 0.35); // Sol
    playTone(1046,t + 0.52, 0.30, 0.32); // Do alto

    setTimeout(() => ctx.close(), 1500);

    // Vibración en móvil
    if ("vibrate" in navigator) {
      navigator.vibrate([120, 60, 120, 60, 200]);
    }
  } catch {
    // Browser puede bloquear AudioContext sin gesto previo — ignorar silenciosamente
  }
}

/**
 * Solicita permiso para notificaciones push del navegador
 * Llama esto una vez cuando el admin hace login
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

/**
 * Muestra notificación push del navegador para nuevo pedido
 */
export function showPushNotification(orderId: string, total: number, itemCount: number) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  try {
    const notif = new Notification("🛍️ Nuevo pedido — ThePoint", {
      body: `#${orderId} · ${itemCount} producto${itemCount !== 1 ? "s" : ""} · $${total}`,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      tag: `order-${orderId}`,
      requireInteraction: true,  // no desaparece solo en desktop
      silent: false,
    });

    // Al hacer click en la notificación, enfocar la ventana del admin
    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    // Auto-cerrar después de 12s
    setTimeout(() => notif.close(), 12000);
  } catch {
    // Silenciar errores de permisos
  }
}
