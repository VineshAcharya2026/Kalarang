export const KALARANG_WHATSAPP = '919108955445';
export const KALARANG_WHATSAPP_DISPLAY = '+91 91089 55445';

export function normalizeWhatsAppNumber(value?: string | null): string {
  const digits = (value || KALARANG_WHATSAPP).replace(/[^0-9]/g, '');
  return digits || KALARANG_WHATSAPP;
}

export function formatWhatsAppDisplay(value?: string | null): string {
  const digits = normalizeWhatsAppNumber(value);
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return `+${digits}`;
}

export function whatsAppUrl(message?: string, number?: string | null): string {
  const base = `https://wa.me/${normalizeWhatsAppNumber(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
