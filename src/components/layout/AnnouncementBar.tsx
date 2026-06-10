import React from 'react';
import { useSettings } from '../../hooks/useSettings';

export default function AnnouncementBar() {
  const { settings, loading } = useSettings();

  if (loading || !settings?.announcementBar?.enabled) {
    return null;
  }

  return (
    <div 
      id="announcement-bar"
      className="bg-[#1C1008] text-[#E8D5B0] text-center py-2 px-4 text-xs font-sans tracking-wider font-medium border-b border-[#B8860B]/20"
    >
      {settings.announcementBar.text}
    </div>
  );
}
