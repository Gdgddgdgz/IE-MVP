// FIXED
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HeartPulse, Calendar, ShieldCheck, Clock, Menu, X, LogOut } from 'lucide-react';

interface SidebarProps {
  role: 'family' | 'caregiver';
  userName: string;
  isVerified?: boolean;
}

export default function Sidebar({ role, userName, isVerified }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => (pathname === path ? 'var(--accent-green)' : 'transparent');

  const handleLogout = () => {
    localStorage.removeItem('dgcare_user');
    localStorage.removeItem('dgcare_bookings');
    localStorage.removeItem('caregiver_verified');
    localStorage.removeItem('caregiver_verification_pending');
    localStorage.removeItem('caregiver_pin');
    router.push('/login');
  };

  const bgClass = 'bg-primary';
  const roleInitial = role === 'family' ? 'F' : 'C';
  const roleName = role === 'family' ? 'Family Guardian' : 'Clinical Provider';

  return (
    <div className={`w-[300px] h-screen sticky top-0 flex flex-col pt-8 pb-6 text-white shadow-medical-float z-40 transition-all duration-300 ease-in-out hidden lg:flex ${bgClass}`}>
      <div className="flex justify-between items-center mb-10 px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-400/30 flex items-center justify-center text-green-300 shrink-0 shadow-inner">
            <HeartPulse size={24} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter">DGCare<span className="text-green-300">.</span></h2>
        </div>
        <button
          className="lg:hidden bg-transparent border-none text-white cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <div className="text-xs font-bold text-green-300/60 uppercase tracking-widest mb-3 px-8">Menu</div>
        {role === 'family' ? (
          <>
            <Link
              href="/dashboard/family"
              className={`flex items-center gap-4 px-8 py-4 font-bold transition-all duration-200 group border-l-4 ${pathname === '/dashboard/family' ? 'bg-black/15 text-white border-green-400 shadow-inner' : 'text-white/60 hover:bg-black/5 hover:text-white border-transparent'}`}
            >
              <HeartPulse size={22} className={`transition-transform duration-300 group-hover:scale-110 ${pathname === '/dashboard/family' ? 'text-green-300' : 'text-white/40'}`} />
              Monitoring Center
            </Link>
            <Link
              href="/dashboard/family/booking"
              className={`flex items-center gap-4 px-8 py-4 font-bold transition-all duration-200 group border-l-4 ${pathname === '/dashboard/family/booking' ? 'bg-black/15 text-white border-green-400 shadow-inner' : 'text-white/60 hover:bg-black/5 hover:text-white border-transparent'}`}
            >
              <Calendar size={22} className={`transition-transform duration-300 group-hover:scale-110 ${pathname === '/dashboard/family/booking' ? 'text-green-300' : 'text-white/40'}`} />
              Care Bookings
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard/caregiver"
              className={`flex items-center gap-4 px-8 py-4 font-bold transition-all duration-200 group border-l-4 ${pathname === '/dashboard/caregiver' ? 'bg-black/15 text-white border-green-400 shadow-inner' : 'text-white/60 hover:bg-black/5 hover:text-white border-transparent'}`}
            >
              <ShieldCheck size={22} className={`transition-transform duration-300 group-hover:scale-110 ${pathname === '/dashboard/caregiver' ? 'text-green-300' : 'text-white/40'}`} />
              Shift Control
            </Link>
            <Link
              href="/dashboard/caregiver/schedule"
              className={`flex items-center gap-4 px-8 py-4 font-bold transition-all duration-200 group border-l-4 ${pathname === '/dashboard/caregiver/schedule' ? 'bg-black/15 text-white border-green-400 shadow-inner' : 'text-white/60 hover:bg-black/5 hover:text-white border-transparent'}`}
            >
              <Clock size={22} className={`transition-transform duration-300 group-hover:scale-110 ${pathname === '/dashboard/caregiver/schedule' ? 'text-green-300' : 'text-white/40'}`} />
              Booking Inbox
            </Link>
          </>
        )}

        <div className="mt-auto px-6 flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-red-500/10 hover:bg-red-500 text-red-200 hover:text-white rounded-xl font-bold transition-all duration-300 group cursor-pointer border border-red-500/20 hover:border-red-500 shadow-sm"
          >
            <LogOut size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Secure Sign Out
          </button>
          
          <div className="p-4 bg-black/20 rounded-xl flex items-center gap-3 border border-white/10 shadow-inner mt-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none"></div>
            <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-lg shadow-sm shrink-0 ${role === 'family' ? 'text-primary' : 'text-primary'}`}>
              {roleInitial}
            </div>
            <div className="overflow-hidden z-10">
              <div className="font-bold text-sm flex items-center gap-1.5 truncate text-white">
                <span className="truncate">{userName || (role === 'family' ? 'Family' : 'Pro Caregiver')}</span>
                {role === 'caregiver' && isVerified && <span title="Verified DGCare Provider" className="shrink-0 flex"><ShieldCheck size={14} className="text-green-400" /></span>}
              </div>
              <div className="text-xs text-white/50 font-bold tracking-wider uppercase mt-0.5">{roleName}</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
