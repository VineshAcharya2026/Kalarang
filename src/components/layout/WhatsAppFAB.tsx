import React from 'react';
import { MessageSquare, Instagram } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export default function WhatsAppFAB() {
  const { settings } = useSettings();

  const handleWhatsAppRedirect = () => {
    if (!settings?.whatsappNumber) return;
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent("Hi KALARANG! I'd love to enquire about your collections.");
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div
      id="social-fab-rail"
      className="fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
    >
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 w-10 rounded-full bg-espresso text-white flex items-center justify-center shadow-md hover:bg-tan transition-colors"
        aria-label="Instagram"
      >
        <Instagram className="h-4 w-4" />
      </a>
      <button
        id="whatsapp-fab"
        type="button"
        onClick={handleWhatsAppRedirect}
        className="h-10 w-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity border-0 cursor-pointer"
        title="Enquire on WhatsApp"
      >
        <MessageSquare className="h-4 w-4" />
      </button>
    </div>
  );
}
