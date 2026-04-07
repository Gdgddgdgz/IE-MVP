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

  const bgClass = role === 'family' ? 'bg-primary' : 'bg-[#093a31]';
  const roleInitial = role === 'family' ? 'F' : 'C';
  const roleName = role === 'family' ? 'Family Member' : 'Professional';
  const title = role === 'family' ? 'DGCare Family' : 'DGCare Provider';

  return (
    <div className={`w-72 h-screen sticky top-0 flex flex-col p-6 text-white shadow-[4px_0_24px_rgba(0,0,0,0.04)] z-40 transition-all duration-300 ease-in-out hidden lg:flex ${bgClass}`}>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
        <button
          className="lg:hidden bg-transparent border-none text-white cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {role === 'family' ? (
          <>
            <Link
              href="/dashboard/family"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 group ${pathname === '/dashboard/family' ? 'bg-white/10 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <HeartPulse size={20} className={`transition-transform duration-300 group-hover:scale-110 ${pathname === '/dashboard/family' ? 'text-white' : 'text-white/50'}`} />
              Monitoring Center
            </Link>
            <Link
              href="/dashboard/family/booking"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 group ${pathname === '/dashboard/family/booking' ? 'bg-white/10 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <Calendar size={20} className={`transition-transform duration-300 group-hover:scale-110 ${pathname === '/dashboard/family/booking' ? 'text-white' : 'text-white/50'}`} />
              Care Bookings
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard/caregiver"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 group ${pathname === '/dashboard/caregiver' ? 'bg-white/10 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <ShieldCheck size={20} className={`transition-transform duration-300 group-hover:scale-110 ${pathname === '/dashboard/caregiver' ? 'text-white' : 'text-white/50'}`} />
              Shift Control
            </Link>
            <Link
              href="/dashboard/caregiver/schedule"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 group ${pathname === '/dashboard/caregiver/schedule' ? 'bg-white/10 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <Clock size={20} className={`transition-transform duration-300 group-hover:scale-110 ${pathname === '/dashboard/caregiver/schedule' ? 'text-white' : 'text-white/50'}`} />
              Booking Schedule
            </Link>
          </>
        )}

        <div className="mt-auto flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-200 rounded-xl font-bold transition-all duration-200 group cursor-pointer border border-transparent hover:border-red-500/30"
          >
            <LogOut size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Sign Out
          </button>
          
          <div className="p-4 bg-black/10 rounded-xl flex items-center gap-3 backdrop-blur-sm border border-white/5 shadow-inner">
            <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-lg shadow-sm shrink-0 ${role === 'family' ? 'text-primary' : 'text-[#093a31]'}`}>
              {roleInitial}
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-sm flex items-center gap-1.5 truncate">
                <span className="truncate">{userName || (role === 'family' ? 'Family' : 'Pro Caregiver')}</span>
                {role === 'caregiver' && isVerified && <span title="Verified DGCare Provider" className="shrink-0 text-[#4edea3]">✅</span>}
              </div>
              <div className="text-xs text-white/60 font-medium tracking-wide uppercase">{roleName}</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
