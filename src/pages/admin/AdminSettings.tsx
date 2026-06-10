import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Settings } from '../../types';
import { Save, Loader2, Check, AlertCircle } from 'lucide-react';

export default function AdminSettings() {
  const { settings, saveSettings, loading } = useSettings();

  // Settings State Form
  const [logoText, setLogoText] = useState('KALARANG');
  const [announcementText, setAnnouncementText] = useState('✨ Handcrafted pure Banarasi silk sarees on display at our Studio Lobby. Buy now! ✨');
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98765 43210');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000);

  // Status indicators
  const [submitting, setSubmitting] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState(false);

  // Sync settings when loaded from Firestore
  useEffect(() => {
    if (settings) {
      setLogoText(settings.storeName || 'KALARANG');
      setAnnouncementText(settings.announcementBar?.text || '');
      setShowAnnouncement(settings.announcementBar?.enabled ?? true);
      setWhatsappNumber(settings.whatsappNumber || '+91 98765 43210');
      setFreeShippingThreshold(settings.freeShippingThreshold || 5000);
    }
  }, [settings]);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessFeedback(false);

    try {
      const payload: Settings = {
        storeName: logoText,
        whatsappNumber,
        announcementBar: {
          enabled: showAnnouncement,
          text: announcementText,
        },
        freeShippingThreshold,
      };

      await saveSettings(payload);
      setSuccessFeedback(true);
      setTimeout(() => setSuccessFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to change configurations:', err);
      alert('Failed to save settings. Confirm internet configs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="admin-studio-settings" className="flex flex-col gap-6 font-sans text-xs sm:text-sm">
      
      {/* Header bar area */}
      <div className="border-b border-[#B8860B]/15 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008] uppercase">
          Studio Store Settings
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Configure global metrics, toggle homepage promotional headers, and change buyer coordinate hotlines.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          <div className="w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="font-serif italic text-[#1C1008]">Fetching settings metrics configuration...</p>
        </div>
      ) : (
        /* Settings Main Form Container */
        <div className="bg-[#FDF8F2] border-2 border-[#B8860B]/15 rounded-md p-5 sm:p-6 shadow-sm max-w-2xl">
          
          <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-5">
            
            {/* Logo brand custom styling details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                Store Logo Brand Text Header
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KALARANG"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm focus:border-[#7A1C2E] focus:outline-none font-bold tracking-wider text-[#1C1008]"
              />
            </div>

            {/* Announcement text block */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                Top Announcement Bar Message
              </label>
              <textarea
                rows={3}
                placeholder="Enter alert message to scroll on top of homepage."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm focus:border-[#7A1C2E] focus:outline-none resize-none text-[#1C1008]"
              />
            </div>

            {/* Checkbox show/hide alert */}
            <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700 text-xs leading-none">
              <input
                type="checkbox"
                checked={showAnnouncement}
                onChange={(e) => setShowAnnouncement(e.target.checked)}
                className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E] h-4 w-4"
              />
              Publish public Announcement Bar Alert on top header
            </label>

            <hr className="border-[#B8860B]/10 my-1" />

            {/* Owner WhatsApp contact phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                Active Client WhatsApp Hot-number (include ISD code without +)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 919876543210 (India standard)"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm focus:border-[#7A1C2E] focus:outline-none font-mono text-[#1C1008]"
              />
              <span className="text-[10px] text-gray-500 leading-normal">
                This phone receives automatic purchase alerts and enquiry triggers. Format as numbers ONLY, e.g. `919876543210`.
              </span>
            </div>

            {/* Free Shipping parameters */}
            <div className="flex flex-col gap-1.5 bg-[#E8D5B0]/15 p-4 rounded border border-[#B8860B]/10">
              <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                Free Loom Shipping Threshold Amount (₹)
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 5000"
                value={freeShippingThreshold || ''}
                onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value) || 0)}
                className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm focus:border-[#7A1C2E] focus:outline-none font-mono text-[#1C1008] max-w-xs"
              />
              <span className="text-[10px] text-gray-500 mt-1">
                Purchases above this value bypass shipping calculations during customer checkout.
              </span>
            </div>

            {/* Success alert message */}
            {successFeedback && (
              <div className="bg-green-700/10 border border-green-700/20 text-green-800 p-3 rounded flex items-center gap-2 text-xs">
                <Check className="h-4 w-4 shrink-0" />
                <span>Global settings configurations saved and updated successfully!</span>
              </div>
            )}

            {/* Save Button */}
            <div className="border-t border-[#B8860B]/10 pt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2.5 px-6 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow hover:shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    Preserving System Settings...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 shrink-0" /> Save Configurations
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
