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
    router.push('/login');
  };

  const bgColor = role === 'family' ? 'var(--primary-green)' : '#093a31';
  const roleInitial = role === 'family' ? 'F' : 'C';
  const roleName = role === 'family' ? 'Family Member' : 'Professional';
  const title = role === 'family' ? 'DGCare Family' : 'DGCare Provider';

  return (
    <div className="sidebar" style={{ backgroundColor: bgColor }}>
      <div className="sidebar-header">
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.jpg" alt="Logo" style={{ height: '32px', width: 'auto' }} />
          {title}
        </h2>
        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <nav className={`sidebar-nav ${isOpen ? 'open' : ''}`}>
        {role === 'family' ? (
          <>
            <Link
              href="/dashboard/family"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: isActive('/dashboard/family'),
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => { if (pathname !== '/dashboard/family') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { if (pathname !== '/dashboard/family') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <HeartPulse size={20} /> Monitoring Center
            </Link>
            <Link
              href="/dashboard/family/booking"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: isActive('/dashboard/family/booking'),
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => { if (pathname !== '/dashboard/family/booking') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { if (pathname !== '/dashboard/family/booking') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <Calendar size={20} /> Bookings
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard/caregiver"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: isActive('/dashboard/caregiver'),
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => { if (pathname !== '/dashboard/caregiver') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { if (pathname !== '/dashboard/caregiver') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <ShieldCheck size={20} /> Shift Control
            </Link>
            <Link
              href="/dashboard/caregiver/schedule"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: isActive('/dashboard/caregiver/schedule'),
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => { if (pathname !== '/dashboard/caregiver/schedule') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { if (pathname !== '/dashboard/caregiver/schedule') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <Clock size={20} /> Booking Schedule
            </Link>
          </>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            <LogOut size={20} /> Logout
          </button>
          
          <div
            style={{
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                color: bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              {roleInitial}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {userName || (role === 'family' ? 'Family' : 'Pro Caregiver')}
                {role === 'caregiver' && isVerified && <span title="Verified">✅</span>}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{roleName}</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
