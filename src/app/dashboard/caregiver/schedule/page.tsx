// FIXED
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Check, X, CalendarX } from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { FullPageSkeleton } from '@/components/SkeletonLoader';

export default function Schedule() {
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
  
  if (!user) return <FullPageSkeleton role="caregiver" />;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar role="caregiver" userName={user.name || ''} isVerified={isVerified} />
      
      {/* Content */}
      <div className="main-content">
          <header>
             <h1 style={{ fontSize: '32px', color: '#093a31', fontWeight: 'bold' }}>Booking Inbox</h1>
             <p style={{ color: 'var(--text-light)' }}>Review and Accept shift requests from Families.</p>
          </header>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bookings.length === 0 ? (
                  <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-light)', border: '2px dashed var(--border-light)', borderRadius: '12px', backgroundColor: 'white' }}>
                      <CalendarX size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '8px' }}>No Pending Requests</h3>
                      <p style={{ marginBottom: '24px' }}>You don't have any booking requests at the moment. Families will see you on their dashboard once you've successfully verified your ID.</p>
                      <Link href="/dashboard/caregiver" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
                          Go to Dashboard
                      </Link>
                  </div>
              ) : (
                  bookings.map((booking: any) => (
                      <div className="card-flex" key={booking.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', justifyContent: 'space-between', borderLeft: `6px solid ${booking.status === 'accepted' ? 'var(--secondary-mint)' : booking.status === 'declined' ? '#ef4444' : '#eab308'}` }}>
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
