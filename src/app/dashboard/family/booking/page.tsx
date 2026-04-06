'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HeartPulse, Calendar, CheckCircle } from 'lucide-react';

export default function FamilyBooking() {
  const pathname = usePathname();
  const router = useRouter();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) router.push('/login');
    else setUser(JSON.parse(lsUser));
  }, [router]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newBooking = { id: Date.now(), date, time, notes, status: 'pending' };
    const current = JSON.parse(localStorage.getItem('dgcare_bookings') || '[]');
    localStorage.setItem('dgcare_bookings', JSON.stringify([...current, newBooking]));
    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setDate(''); setTime(''); setNotes('');
    }, 3000);
  };

  const isActive = (path: string) => pathname === path ? 'var(--accent-green)' : 'transparent';

  if(!user) return <div style={{ padding: '40px', color: 'var(--primary-green)' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-offwhite)' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: 'var(--primary-green)', color: 'white', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>DGCare Family</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          <Link href="/dashboard/family" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: isActive('/dashboard/family'), borderRadius: '8px' }}>
             <HeartPulse size={20} /> Monitoring Center
          </Link>
          <Link href="/dashboard/family/booking" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: isActive('/dashboard/family/booking'), borderRadius: '8px' }}>
             <Calendar size={20} /> Bookings
          </Link>
        </nav>
        <div style={{ marginTop: 'auto', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>F</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || 'Family'}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Family Member</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <header>
             <h1 style={{ fontSize: '32px', color: 'var(--primary-green)', fontWeight: 'bold' }}>Schedule a Caregiver</h1>
             <p style={{ color: 'var(--text-light)' }}>Submit a booking request. Only Background-Checked Verified 🛡️ providers can accept.</p>
          </header>
          
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
             {submitted ? (
                 <div style={{ color: 'var(--primary-green)', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                     <CheckCircle size={48} style={{ margin: '0 auto 16px' }} />
                     Booking Request Sent Successfully!
                 </div>
             ) : (
                 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div>
                         <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dark)', fontWeight: 'bold' }}>Requested Date</label>
                         <input required type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                     </div>
                     <div>
                         <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dark)', fontWeight: 'bold' }}>Requested Time Range</label>
                         <input required type="text" placeholder="e.g. 10:00 AM - 2:00 PM" value={time} onChange={e=>setTime(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                     </div>
                     <div>
                         <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dark)', fontWeight: 'bold' }}>Special Instructions for Provider</label>
                         <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4} placeholder="e.g. Please ensure 2pm medication is given..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}></textarea>
                     </div>
                     <button type="submit" style={{ padding: '16px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Submit Request</button>
                 </form>
             )}
          </div>
      </div>
    </div>
  );
}
