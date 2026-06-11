import React from 'react';
import { Award, ShieldCheck, Truck } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export default function TrustBadges() {
  const { settings } = useSettings();
  const threshold = settings?.freeShippingThreshold;

  return (
    <section
      id="trust-badges"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 border-y border-gold/15"
    >
      <div className="flex items-center gap-3 justify-center sm:justify-start">
        <div className="p-2.5 rounded-full bg-gold/10 text-gold">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <p className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">
            Authentic Handloom
          </p>
          <p className="font-sans text-[11px] text-gray-500">Direct from master weavers</p>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-center">
        <div className="p-2.5 rounded-full bg-gold/10 text-gold">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">
            {threshold ? `Free Shipping ₹${threshold.toLocaleString('en-IN')}+` : 'Pan-India Delivery'}
          </p>
          <p className="font-sans text-[11px] text-gray-500">Carefully packed & shipped</p>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-center sm:justify-end">
        <div className="p-2.5 rounded-full bg-gold/10 text-gold">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">
            Quality Assured
          </p>
          <p className="font-sans text-[11px] text-gray-500">Pure silk & heritage fabrics</p>
        </div>
      </div>
    </section>
  );
}
