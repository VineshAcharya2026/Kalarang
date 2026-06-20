import React from 'react';
import AnnouncementBar from '../layout/AnnouncementBar';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import WhatsAppFAB from '../layout/WhatsAppFAB';

interface MarketingPageShellProps {
  children: React.ReactNode;
  id?: string;
}

export default function MarketingPageShell({ children, id }: MarketingPageShellProps) {
  return (
    <div id={id} className="min-h-screen flex flex-col bg-cream">
      <AnnouncementBar />
      <Navbar />
      <div className="flex-grow">{children}</div>
      <WhatsAppFAB />
      <Footer />
    </div>
  );
}
