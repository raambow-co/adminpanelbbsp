import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export function Topbar({ setSidebarOpen }: TopbarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const pathName = location.pathname.split('/')[1];
  const pageTitle = pathName 
    ? pathName.charAt(0).toUpperCase() + pathName.slice(1) 
    : 'Executive Overview';

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-[#10367D]/12 z-30 sticky top-0 shadow-[0_2px_12px_rgba(16,54,125,0.03)]">
      <div className="flex items-center gap-3">
        <button 
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#10367D] hover:bg-[#FAF9F6] transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-sora font-bold text-base sm:text-lg text-[#10367D] tracking-tight">
              {pageTitle}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Ecosystem
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search input with BBSP styling */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 bg-[#FAF9F6] rounded-xl border border-[#10367D]/15 text-[#10367D] focus-within:border-[#10367D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#10367D]/10 transition-all">
          <Search className="w-4 h-4 text-[#1A4594]/70" />
          <input 
            type="text" 
            placeholder="Search partners, proposals, CRM..." 
            className="bg-transparent border-none outline-none text-xs font-medium placeholder:text-[#1A4594]/50 w-48 text-[#10367D]"
          />
          <kbd className="text-[10px] bg-white border border-[#10367D]/15 rounded px-1.5 py-0.5 text-[#1A4594]/60 font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Global network status */}
        <button 
          title="Network Status"
          className="p-2 rounded-xl text-[#1A4594] hover:text-[#10367D] hover:bg-[#FAF9F6] border border-transparent hover:border-[#10367D]/10 transition-all relative"
        >
          <Globe className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button 
          title="Notifications"
          className="p-2 rounded-xl text-[#1A4594] hover:text-[#10367D] hover:bg-[#FAF9F6] border border-transparent hover:border-[#10367D]/10 transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10367D] rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-[1px] bg-[#10367D]/12 hidden sm:block" />

        {/* Admin User Chip - Sudheer Reddy Anna */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-[#10367D] text-[#A5CEE0] font-sora font-extrabold text-xs flex items-center justify-center border-2 border-[#A5CEE0]/50 group-hover:border-[#10367D] transition-colors shadow-sm">
            SR
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-extrabold text-[#10367D] leading-tight group-hover:text-[#1A4594] transition-colors">
              {user.name}
            </p>
            <p className="text-[10px] text-[#1A4594]/80 font-bold">Managing Director & Admin</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1 rounded-lg text-[#1A4594]/70 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
