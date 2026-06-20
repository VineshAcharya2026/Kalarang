import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
  const { settings, loading } = useSettings();

  if (loading || !settings?.announcementBar?.enabled) {
    return null;
  }

  return (
    <div
      id="announcement-bar"
      className="bg-maroon text-cream text-center py-2 px-4 text-xs font-medium"
    >
      {settings.announcementBar.text}{' '}
      <Link to="/collections/all" className="underline underline-offset-2 text-gold hover:text-white ml-1">
        Shop now
      </Link>
    </div>
  );
}
