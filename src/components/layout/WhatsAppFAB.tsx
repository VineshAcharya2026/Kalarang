import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../../hooks/useSettings';

export default function WhatsAppFAB() {
  const { settings } = useSettings();

  const handleWhatsAppRedirect = () => {
    if (!settings?.whatsappNumber) return;
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent("Hi KALARANG! I am browsing your online e-commerce studio and would love to enquire about available collection designs. 🙏");
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <motion.button
      id="whatsapp-fab"
      onClick={handleWhatsAppRedirect}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-40 bg-[#7A1C2E] text-[#FDF8F2] p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#B8860B] transition-colors focus:outline-none border-2 border-[#E8D5B0] cursor-pointer"
      title="Enquire on WhatsApp"
    >
      <MessageSquare className="h-6 w-6" />
    </motion.button>
  );
}
