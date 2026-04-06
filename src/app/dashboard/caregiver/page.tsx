// FIXED
'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertTriangle, FileCheck } from 'lucide-react';
import io from 'socket.io-client';
import Sidebar from '@/components/Sidebar';
import { FullPageSkeleton } from '@/components/SkeletonLoader';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function CaregiverDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string, role: string, name?: string } | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [myPin, setMyPin] = useState('1234');
  const [broadcasting, setBroadcasting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
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
    if(localStorage.getItem('caregiver_verified') === 'true') setIsVerified(true);
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
        alert("Must be broadcasting your shift to send an SOS to the paired family member.");
    }
  };

  const handleVerify = () => {
     setVerifying(true);
     setTimeout(() => {
         setIsVerified(true);
         localStorage.setItem('caregiver_verified', 'true');
         setVerifying(false);
         alert("Background check complete! You are now a Verified Provider.");
     }, 2000);
  };

  if (!user) return <FullPageSkeleton role="caregiver" />;

  return (
    <div className="dashboard-layout">
      <Sidebar role="caregiver" userName={user.name || ''} isVerified={isVerified} />

      <div className="main-content">
        <header className="header-flex">
          <div>
            <h1 style={{ fontSize: '32px', color: '#093a31', fontWeight: 'bold' }}>Shift Control Center</h1>
            <p style={{ color: 'var(--text-light)' }}>Manage your shifts, broadcast location, and keep families updated.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={handleSOS} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: sosActive ? '0 0 20px rgba(239, 68, 68, 0.6)' : 'none' }}>
              <AlertTriangle size={20} /> {sosActive ? 'SOS SENT' : 'SEND EMERGENCY'}
            </button>
          </div>
        </header>

        {sosActive && (
          <div style={{ padding: '20px', backgroundColor: '#fef2f2', border: '2px solid #ef4444', borderRadius: '8px', color: '#b91c1c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} /> Emergency SOS Alert Triggered.
          </div>
        )}

        {!isVerified && (
           <div className="card-flex" style={{ backgroundColor: '#fffbe1', border: '2px solid #fde047', padding: '24px', borderRadius: '12px', justifyContent: 'space-between' }}>
               <div>
                   <h3 style={{ fontSize: '18px', color: '#854d0e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <FileCheck size={20} /> Identity Verification Required
                   </h3>
                   <p style={{ color: '#a16207', fontSize: '14px' }}>DGCare requires all providers to pass a strict background check before families will book you. Upload a mock ID to simulate this.</p>
               </div>
               <button onClick={handleVerify} disabled={verifying} style={{ padding: '12px 24px', backgroundColor: '#eab308', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: verifying ? 'not-allowed' : 'pointer' }}>
                   {verifying ? 'Scanning Databases...' : 'Upload ID & Verify'}
               </button>
           </div>
        )}

        <div className="card-flex" style={{ backgroundColor: broadcasting ? 'var(--primary-green)' : 'white', color: broadcasting ? 'white' : 'var(--text-dark)', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', justifyContent: 'space-between', transition: '0.3s all' }}>
           <div>
               <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{broadcasting ? '🟢 Live Broadcasting Active' : '🔴 Off-Duty'}</h3>
               <p style={{ fontSize: '14px', opacity: 0.9 }}>Provide this PIN to your assigned family member so they can track your arrival and status.</p>
               <div style={{ fontSize: '32px', letterSpacing: '8px', fontWeight: 'bold', marginTop: '16px', color: broadcasting ? 'var(--secondary-mint)' : 'var(--primary-green)' }}>{myPin}</div>
           </div>
           <button onClick={() => {
                if(!isVerified) { alert("You must be Verified to start a shift!"); return; }
                setBroadcasting(!broadcasting);
            }} style={{ padding: '16px 32px', backgroundColor: broadcasting ? '#ef4444' : 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', opacity: isVerified ? 1 : 0.5 }}>
               {broadcasting ? 'End Shift & Stop Tracking' : 'Start Shift & Broadcast GPS'}
           </button>
        </div>

        {broadcasting ? (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--primary-green)', margin: '0 0 20px', fontWeight: 'bold' }}>Your Emitted Location</h3>
                <div className="map-container">
                   <Map center={[51.505, -0.09]} role="caregiver" roomCode={`room_${myPin}`} />
                </div>
            </div>
        ) : (
            <div style={{ backgroundColor: 'white', border: '2px dashed var(--border-light)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <p>Start your shift to begin device location tracking.</p>
            </div>
        )}
      </div>
    </div>
  );
}
