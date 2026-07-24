import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Link } from 'react-router-dom';

const ANNOUNCEMENT_TEXT = '✨ Every first order 10% off ✨';

export default function AnnouncementBar() {
  const { settings, loading } = useSettings();

  if (loading || !settings?.announcementBar?.enabled) {
    return null;
  }

  const stored = settings.announcementBar.text || '';
  const text =
    !stored || stored.includes('Free Shipping above')
      ? ANNOUNCEMENT_TEXT
      : stored;

  return (
    <div
      id="announcement-bar"
      className="bg-maroon text-cream text-center py-2 px-4 text-xs font-medium"
    >
      {text}{' '}
      <Link to="/collections/all" className="underline underline-offset-2 text-gold hover:text-white ml-1">
        Shop now
      </Link>
    </div>
  );
}
