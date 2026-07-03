export const KALARANG_WHATSAPP = '919108955445';
export const KALARANG_WHATSAPP_DISPLAY = '+91 91089 55445';

export function whatsAppUrl(message?: string): string {
  const base = `https://wa.me/${KALARANG_WHATSAPP}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
