import React from 'react';
import { Award, ShieldCheck, Truck } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export default function TrustBadges() {
  const { settings } = useSettings();
  const threshold = settings?.freeShippingThreshold;

  const items = [
    {
      icon: Award,
      title: 'Authentic Craft',
      desc: 'Curated silk & heritage fabrics',
    },
    {
      icon: Truck,
      title: threshold ? `Free ship ₹${threshold.toLocaleString('en-IN')}+` : 'Pan-India Delivery',
      desc: 'Carefully packed & shipped',
    },
    {
      icon: ShieldCheck,
      title: 'Personalized Service',
      desc: 'Custom design & tailoring',
    },
  ];

  return (
    <section id="trust-badges" className="border-y border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center justify-center sm:justify-start gap-3 px-4 py-3 sm:py-0 first:sm:pl-0 last:sm:pr-0">
              <div className="h-10 w-10 rounded-full bg-maroon/8 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-maroon" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-espresso">{title}</p>
                <p className="text-xs text-muted mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
