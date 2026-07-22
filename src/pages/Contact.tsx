import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import MarketingPageShell from '../components/marketing/MarketingPageShell';
import PageHero from '../components/marketing/PageHero';
import ConsultationForm from '../components/forms/ConsultationForm';
import { contact } from '../content/siteContent';
import { useSettings } from '../hooks/useSettings';
import { formatWhatsAppDisplay } from '../constants/contact';

export default function ContactPage() {
  const { settings } = useSettings();
  const email = settings?.email || contact.email;
  const address = settings?.studioAddress || contact.address;
  const whatsappDisplay = formatWhatsAppDisplay(settings?.whatsappNumber);

  return (
    <MarketingPageShell id="contact-page">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <PageHero title={contact.title} subtitle={contact.subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="flex flex-col gap-6">
            <p className="font-serif text-sm sm:text-base text-gray-600 leading-relaxed">
              {contact.description}
            </p>

            <ul className="flex flex-col gap-4 font-sans text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-espresso uppercase text-xs tracking-wider">WhatsApp</p>
                  <p>{whatsappDisplay}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-espresso uppercase text-xs tracking-wider">Email</p>
                  <a href={`mailto:${email}`} className="hover:text-maroon transition-colors">
                    {email}
                  </a>
                </div>
              </li>
              {address ? (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-espresso uppercase text-xs tracking-wider">Address</p>
                    <p className="whitespace-pre-line">{address}</p>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>

          <ConsultationForm />
        </div>
      </div>
    </MarketingPageShell>
  );
}
