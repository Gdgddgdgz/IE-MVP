'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Bell, HeartPulse, MapPin, Calendar, AlertTriangle, Key } from 'lucide-react';
import io from 'socket.io-client';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function FamilyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string, role: string, name?: string } | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [roomPin, setRoomPin] = useState('1234');
  const [activePin, setActivePin] = useState('1234');
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) {
      router.push('/login');
    } else {
      const parsed = JSON.parse(lsUser);
      if (parsed.role !== 'family') router.push('/dashboard');
      else setUser(parsed);
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    socketRef.current = io();
    socketRef.current.emit('join_room', `room_${activePin}`);
    socketRef.current.on('sos_alert', (data: any) => {
      setSosActive(true);
      alert(`URGENT: SOS Alert from Caregiver in room ${activePin}!`);
    });
    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, [user, activePin]);

  const handleSOS = () => {
    if (socketRef.current) {
      socketRef.current.emit('sos_alert', { roomId: `room_${activePin}`, sender: user?.name || user?.email });
      setSosActive(true);
    }
  };

  const connectToPin = (e: any) => {
    e.preventDefault();
    setActivePin(roomPin);
  };

  if (!user) return <div style={{ padding: '40px', color: 'var(--primary-green)' }}>Loading Dashboard...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-offwhite)' }}>
      <div style={{ width: '250px', backgroundColor: 'var(--primary-green)', color: 'white', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>DGCare Family</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          <Link href="/dashboard/family" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--accent-green)', borderRadius: '8px' }}>
             <HeartPulse size={20} /> Monitoring Center
          </Link>
          <Link href="/dashboard/family/booking" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', opacity: 0.8 }}>
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

      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: 'var(--primary-green)', fontWeight: 'bold' }}>Family Monitoring Center</h1>
            <p style={{ color: 'var(--text-light)' }}>Track your loved ones and caregivers efficiently.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={handleSOS} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: sosActive ? '0 0 20px rgba(239, 68, 68, 0.6)' : 'none' }}>
              <AlertTriangle size={20} /> {sosActive ? 'SOS SENT' : 'SEND EMERGENCY'}
            </button>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
               <Bell size={20} color="var(--primary-green)" />
            </div>
          </div>
        </header>

        {sosActive && (
          <div style={{ padding: '20px', backgroundColor: '#fef2f2', border: '2px solid #ef4444', borderRadius: '8px', color: '#b91c1c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} /> Emergency SOS Alert Triggered.
          </div>
        )}

        {/* Pairing Box */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
           <Key size={24} color="var(--primary-green)" />
           <div style={{ flex: 1 }}>
               <h3 style={{ fontSize: '18px', color: 'var(--primary-green)' }}>Link to Caregiver</h3>
               <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Enter the 4-digit PIN provided by your caregiver to track their session.</p>
           </div>
           <form onSubmit={connectToPin} style={{ display: 'flex', gap: '10px' }}>
               <input type="text" value={roomPin} onChange={e=>setRoomPin(e.target.value)} maxLength={4} style={{ padding: '10px', width: '100px', fontSize: '18px', letterSpacing: '4px', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
               <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Connect</button>
           </form>
           {activePin && <div style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>✓ Tracking PIN: {activePin}</div>}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderTop: '4px solid var(--primary-green)' }}>
            <div style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px' }}>Loved One Heart Rate</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-green)' }}>78 BPM <span style={{fontSize:'14px', color:'green'}}>Normal</span></div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderTop: '4px solid var(--accent-green)' }}>
            <div style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px' }}>Active Caregiver</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-green)' }}>{activePin ? 'Dr. Thorne' : 'Awaiting Check-in'}</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderTop: '4px solid #6b7280' }}>
             <div style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px' }}>Next Scheduled Medication</div>
             <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-green)' }}>4:00 PM</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--primary-green)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
            <MapPin size={24} /> Caregiver Location Tracker
          </h3>
          <div style={{ flex: 1 }}>
             <Map center={[51.505, -0.09]} role="family" roomCode={`room_${activePin}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
