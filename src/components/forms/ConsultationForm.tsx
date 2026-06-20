import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { consultationServices } from '../../content/siteContent';
import { useSettings } from '../../hooks/useSettings';

interface FormErrors {
  name?: string;
  phone?: string;
}

const VALID_SERVICE_VALUES = consultationServices.map((s) => s.value);

export default function ConsultationForm() {
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('general');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && VALID_SERVICE_VALUES.includes(serviceParam)) {
      setService(serviceParam);
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Name is required';
    }

    const cleanPhone = phone.replace(/\s/g, '');
    if (!cleanPhone) {
      nextErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d-]{10,15}$/.test(cleanPhone)) {
      nextErrors.phone = 'Enter a valid phone number';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!settings?.whatsappNumber) {
      alert('WhatsApp contact is not configured. Please try again later.');
      return;
    }

    const serviceLabel =
      consultationServices.find((s) => s.value === service)?.label ?? 'General Inquiry';

    const whatsappMessage = [
      "Hi KalaRang! I'd like to book a consultation.",
      '',
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Service: ${serviceLabel}`,
      message.trim() ? `Message: ${message.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`,
      '_blank'
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white p-6 sm:p-8 rounded-md border border-gold/10 shadow-sm">
      <div>
        <label htmlFor="consult-name" className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1.5">
          Name *
        </label>
        <input
          id="consult-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 text-sm rounded border border-gold/25 bg-cream text-espresso focus:outline-none focus:ring-1 focus:ring-gold"
          placeholder="Your full name"
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="consult-phone" className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1.5">
          Phone *
        </label>
        <input
          id="consult-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2.5 text-sm rounded border border-gold/25 bg-cream text-espresso focus:outline-none focus:ring-1 focus:ring-gold"
          placeholder="+91 98765 43210"
        />
        {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="consult-service" className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1.5">
          Service Interest
        </label>
        <select
          id="consult-service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full px-4 py-2.5 text-sm rounded border border-gold/25 bg-cream text-espresso focus:outline-none focus:ring-1 focus:ring-gold"
        >
          {consultationServices.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="consult-message" className="block text-xs font-bold text-espresso uppercase tracking-wider mb-1.5">
          Message
        </label>
        <textarea
          id="consult-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 text-sm rounded border border-gold/25 bg-cream text-espresso focus:outline-none focus:ring-1 focus:ring-gold resize-none"
          placeholder="Tell us about your vision, occasion, or requirements..."
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-maroon hover:bg-gold text-white px-6 py-3 rounded text-xs font-sans tracking-widest font-bold uppercase transition-colors cursor-pointer"
      >
        <MessageSquare className="h-4 w-4" />
        Continue on WhatsApp
      </button>

      <p className="text-xs text-gray-500 text-center">
        Submitting will open WhatsApp with your details pre-filled so we can respond quickly.
      </p>
    </form>
  );
}
