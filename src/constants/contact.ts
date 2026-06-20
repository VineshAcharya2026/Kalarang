export const KALARANG_WHATSAPP = '919886943080';
export const KALARANG_WHATSAPP_DISPLAY = '+91 98869 43080';

export function whatsAppUrl(message?: string): string {
  const base = `https://wa.me/${KALARANG_WHATSAPP}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
