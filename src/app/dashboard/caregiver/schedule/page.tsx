'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Clock, Check, X } from 'lucide-react';

export default function Schedule() {
  const pathname = usePathname();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  
  useEffect(() => {
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) router.push('/login');
    else setUser(JSON.parse(lsUser));
    
    setBookings(JSON.parse(localStorage.getItem('dgcare_bookings') || '[]'));
    if(localStorage.getItem('caregiver_verified') === 'true') setIsVerified(true);
  }, [router]);

  const handleAction = (id: number, status: string) => {
      const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
      setBookings(updated);
      localStorage.setItem('dgcare_bookings', JSON.stringify(updated));
  };
  
  const isActive = (path: string) => pathname === path ? 'var(--accent-green)' : 'transparent';

  if (!user) return <div style={{ padding: '40px', color: 'var(--primary-green)' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-offwhite)' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#093a31', color: 'white', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>DGCare Provider</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          <Link href="/dashboard/caregiver" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: isActive('/dashboard/caregiver'), borderRadius: '8px' }}>
             <ShieldCheck size={20} /> Shift Control
          </Link>
          <Link href="/dashboard/caregiver/schedule" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: isActive('/dashboard/caregiver/schedule'), borderRadius: '8px' }}>
             <Clock size={20} /> Booking Schedule
          </Link>
        </nav>
        <div style={{ marginTop: 'auto', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', color: '#093a31', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {user.name || 'Pro Caregiver'} {isVerified && <span title="Verified">✅</span>}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Professional</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <header>
             <h1 style={{ fontSize: '32px', color: '#093a31', fontWeight: 'bold' }}>Booking Inbox</h1>
             <p style={{ color: 'var(--text-light)' }}>Review and Accept shift requests from Families.</p>
          </header>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bookings.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)', border: '2px dashed var(--border-light)', borderRadius: '12px' }}>
                      <Clock size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <p>No booking requests found.</p>
                  </div>
              ) : (
                  bookings.map((booking: any) => (
                      <div key={booking.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `6px solid ${booking.status === 'accepted' ? 'var(--secondary-mint)' : booking.status === 'declined' ? '#ef4444' : '#eab308'}` }}>
                          <div>
                              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#093a31' }}>Date requested: {booking.date}</div>
                              <div style={{ color: 'var(--text-light)', marginTop: '4px' }}>Time Range: {booking.time}</div>
                              {booking.notes && <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg-offwhite)', borderRadius: '6px', fontStyle: 'italic', fontSize: '14px' }}>"{booking.notes}"</div>}
                              <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: booking.status === 'pending' ? '#b45309' : booking.status === 'accepted' ? 'var(--primary-green)' : '#b91c1c' }}>
                                  STATUS: {booking.status.toUpperCase()}
                              </div>
                          </div>
                          {booking.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '10px' }}>
                                  <button onClick={() => {
                                      if(!isVerified) { alert("Only Verified providers can accept shifts. Please verify your ID on the Shift Control dashboard."); return; }
                                      handleAction(booking.id, 'accepted');
                                  }} style={{ padding: '12px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Accept Booking">
                                      <Check size={20} />
                                  </button>
                                  <button onClick={() => handleAction(booking.id, 'declined')} style={{ padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Decline">
                                      <X size={20} />
                                  </button>
                              </div>
                          )}
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
}
