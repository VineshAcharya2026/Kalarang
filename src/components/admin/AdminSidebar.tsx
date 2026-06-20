import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderHeart, 
  Image, 
  Settings as SettingsIcon, 
  LogOut,
  Sparkles,
  Clapperboard
} from 'lucide-react';
import { logoutAdmin } from '../../auth';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out from KALARANG Studio Admin?')) {
      await logoutAdmin();
      navigate('/admin/login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Products', path: '/admin/products', icon: Sparkles },
    { name: 'Manage Collections', path: '/admin/collections', icon: FolderHeart },
    { name: 'Home Banners', path: '/admin/banners', icon: Image },
    { name: 'Hero Videos', path: '/admin/videos', icon: Clapperboard },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Store Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  return (
    <aside 
      id="admin-sidebar"
      className="w-64 bg-[#1C1008] text-[#FDF8F2] flex flex-col justify-between border-r-2 border-[#B8860B] min-h-screen shrink-0 h-sticky top-0"
    >
      <div className="flex flex-col">
        {/* Sidebar Header Brand Signature */}
        <div className="p-6 border-b border-[#B8860B]/25 flex flex-col items-start leading-none gap-1 bg-[#150a04]">
          <span className="font-serif text-xl font-bold tracking-[0.1em] text-[#FDF8F2]">
            KALARANG
          </span>
          <span className="font-sans text-[9px] tracking-[0.15em] text-[#B8860B] uppercase font-bold">
            Studio Controller
          </span>
        </div>

        {/* Navigation items list */}
        <nav className="p-4 flex flex-col gap-1.5 mt-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded text-sm font-sans font-medium transition-all ${
                    isActive
                      ? 'bg-[#B8860B] text-[#1C1008] shadow-md font-semibold'
                      : 'text-[#FDF8F2]/70 hover:text-white hover:bg-[#B8860B]/10'
                  }`
                }
              >
                <IconComponent className="h-4.5 w-4.5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-[#B8860B]/15 bg-[#150a04]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded text-xs tracking-wider uppercase font-sans font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          Logout Admin
        </button>
      </div>
    </aside>
  );
}
