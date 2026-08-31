import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserPlus, 
  BookOpenCheck,
  Settings,
  LogOut,
  X,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Executive Overview', href: '/', icon: LayoutDashboard },
  { name: 'Applications & Proposals', href: '/applications', icon: FileText, section: 'PROPOSALS & DEALS' },
  { name: 'All Website Members', href: '/members', icon: Users, section: 'MEMBERS NETWORK' },
  { name: 'Manual Onboarding', href: '/manual-members', icon: UserPlus },
  { name: 'Accounts Book', href: '/accounts', icon: BookOpenCheck, section: 'FINANCIALS & LEDGER' },
  { name: 'Portal Settings', href: '/settings', icon: Settings, section: 'SYSTEM' },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { logout, user } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#10367D]/12 text-[#10367D] w-64 shadow-[4px_0_24px_rgba(16,54,125,0.04)]">
      {/* Top Left Logo Header */}
      <div className="p-4 border-b border-[#10367D]/10 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-[#10367D]/15 shadow-sm flex items-center justify-center flex-shrink-0">
            <img 
              src="/build-bharat-logo.png" 
              alt="Build Bharat Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-sora font-extrabold text-base text-[#10367D] tracking-tight leading-tight">
              BUILD BHARAT
            </h1>
            <p className="text-[10px] font-bold tracking-wider text-[#1A4594]/85 uppercase leading-tight mt-0.5">
              Members Admin
            </p>
          </div>
        </div>
        <button 
          className="lg:hidden p-1.5 rounded-lg text-[#1A4594] hover:bg-[#FAF9F6] hover:text-[#10367D]"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navigation.map((item, index) => {
          const showSection = item.section && (index === 0 || navigation[index - 1].section !== item.section);
          
          return (
            <React.Fragment key={item.name}>
              {showSection && (
                <div className="px-3 mt-4 mb-1.5 text-[10px] font-bold text-[#1A4594]/70 tracking-wider uppercase font-sora">
                  {item.section}
                </div>
              )}
              <NavLink
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold",
                  isActive 
                    ? "bg-[#10367D] text-white shadow-md shadow-[#10367D]/25" 
                    : "text-[#10367D]/80 hover:bg-[#FAF9F6] hover:text-[#10367D] hover:translate-x-0.5"
                )}
                onClick={() => setIsOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn(
                      "w-4 h-4 flex-shrink-0 transition-colors",
                      isActive ? "text-[#A5CEE0]" : "text-[#1A4594]"
                    )} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Admin Profile Footer - Sudheer Reddy Anna */}
      <div className="p-3 border-t border-[#10367D]/12 bg-[#FAF9F6]/60">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-[#10367D]/10 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#10367D] text-[#A5CEE0] flex items-center justify-center font-sora font-extrabold text-xs flex-shrink-0 shadow-inner">
              SR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#10367D] truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <p className="text-[10px] text-[#1A4594]/80 font-bold truncate">SuperAdmin</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-[#1A4594] hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#10367D]/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 h-full">
        {sidebarContent}
      </div>
    </>
  );
}
