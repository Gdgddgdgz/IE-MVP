'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Bell, MapPin, Calendar, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import io from 'socket.io-client';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function CaregiverDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string, role: string, name?: string } | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [myPin, setMyPin] = useState('1234');
  const [broadcasting, setBroadcasting] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) {
      router.push('/login');
    } else {
      const parsed = JSON.parse(lsUser);
      if (parsed.role !== 'caregiver') router.push('/dashboard');
      else setUser(parsed);
    }
    setMyPin(Math.floor(1000 + Math.random() * 9000).toString());
  }, [router]);

  useEffect(() => {
    if (!user || !broadcasting) {
        if (socketRef.current) socketRef.current.disconnect();
        return;
    }
    socketRef.current = io();
    socketRef.current.emit('join_room', `room_${myPin}`);
    socketRef.current.on('sos_alert', (data: any) => {
      setSosActive(true);
      alert(`URGENT: SOS Alert Received from Family in room ${myPin}!`);
    });
    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, [user, myPin, broadcasting]);

  const handleSOS = () => {
    if (socketRef.current && broadcasting) {
      socketRef.current.emit('sos_alert', { roomId: `room_${myPin}`, sender: user?.name || user?.email });
      setSosActive(true);
    } else {
        alert("Must be broadcasting to send an SOS to the paired family member.");
    }
  };

  if (!user) return <div style={{ padding: '40px', color: 'var(--primary-green)' }}>Loading Dashboard...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-offwhite)' }}>
      <div style={{ width: '250px', backgroundColor: '#093a31', color: 'white', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>DGCare Provider</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          <Link href="/dashboard/caregiver" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--accent-green)', borderRadius: '8px' }}>
             <ShieldCheck size={20} /> Shift Control
          </Link>
          <Link href="/dashboard/caregiver/schedule" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', opacity: 0.8 }}>
             <Clock size={20} /> My Schedule
          </Link>
        </nav>
        <div style={{ marginTop: 'auto', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', color: '#093a31', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || 'Pro Caregiver'}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Professional</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: '#093a31', fontWeight: 'bold' }}>Shift Control Center</h1>
            <p style={{ color: 'var(--text-light)' }}>Manage your shifts, broadcast location, and keep families updated.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={handleSOS} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: sosActive ? '0 0 20px rgba(239, 68, 68, 0.6)' : 'none' }}>
              <AlertTriangle size={20} /> {sosActive ? 'SOS SENT' : 'SEND EMERGENCY'}
            </button>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
               <Bell size={20} color="#093a31" />
            </div>
          </div>
        </header>

        {sosActive && (
          <div style={{ padding: '20px', backgroundColor: '#fef2f2', border: '2px solid #ef4444', borderRadius: '8px', color: '#b91c1c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} /> Emergency SOS Alert Triggered.
          </div>
        )}

        <div style={{ backgroundColor: broadcasting ? 'var(--primary-green)' : 'white', color: broadcasting ? 'white' : 'var(--text-dark)', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.3s all' }}>
           <div>
               <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{broadcasting ? '🟢 Live Broadcasting Active' : '🔴 Off-Duty'}</h3>
               <p style={{ fontSize: '14px', opacity: 0.9 }}>Provide this PIN to your assigned family member so they can track your arrival and status.</p>
               <div style={{ fontSize: '32px', letterSpacing: '8px', fontWeight: 'bold', marginTop: '16px', color: broadcasting ? 'var(--secondary-mint)' : 'var(--primary-green)' }}>{myPin}</div>
           </div>
           <button onClick={() => setBroadcasting(!broadcasting)} style={{ padding: '16px 32px', backgroundColor: broadcasting ? '#ef4444' : 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
               {broadcasting ? 'End Shift & Stop Tracking' : 'Start Shift & Broadcast GPS'}
           </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--accent-green)' }}>
            <div style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px' }}>Upcoming Booking</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-green)' }}>Elise Thorne (2:00 PM)</div>
            <div style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '8px' }}>123 Mockingbird Lane, Suite B</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--primary-green)' }}>
            <div style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px' }}>Daily Earnings Est.</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-green)' }}>$145.00</div>
          </div>
        </div>

        {broadcasting ? (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--primary-green)', marginBottom: '20px', fontWeight: 'bold' }}>Your Emitted Location</h3>
                <div style={{ flex: 1 }}>
                   <Map center={[51.505, -0.09]} role="caregiver" roomCode={`room_${myPin}`} />
                </div>
            </div>
        ) : (
            <div style={{ backgroundColor: 'white', border: '2px dashed var(--border-light)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <p>Start your shift to begin broadcasting location.</p>
            </div>
        )}
      </div>
    </div>
  );
}
