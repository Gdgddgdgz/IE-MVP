// FIXED
'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertTriangle, FileCheck, Clock3 } from 'lucide-react';
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
  const [verificationPending, setVerificationPending] = useState(false);
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
    if(localStorage.getItem('caregiver_verification_pending') === 'true') setVerificationPending(true);
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
         setVerificationPending(true);
         localStorage.setItem('caregiver_verification_pending', 'true');
         setVerifying(false);
     }, 1500);
  };

  if (!user) return <FullPageSkeleton role="caregiver" />;

  return (
    <div className="dashboard-layout">
      <Sidebar role="caregiver" userName={user.name || ''} isVerified={isVerified} />

      <div className="main-content">
        <header className="mb-8 flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Shift Control Center</h1>
            <p className="text-secondary font-medium">Manage your clinical sessions and broadcast status to families.</p>
          </div>
          <button onClick={handleSOS} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-error text-white transition-all ${sosActive ? 'animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]' : ''}`}>
            <AlertTriangle size={20} /> {sosActive ? 'SOS SENT' : 'SEND EMERGENCY'}
          </button>
        </header>

        {sosActive && (
          <div style={{ padding: '20px', backgroundColor: '#fef2f2', border: '2px solid #ef4444', borderRadius: '8px', color: '#b91c1c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} /> Emergency SOS Alert Triggered.
          </div>
        )}

        {!isVerified && !verificationPending && (
           <div className="premium-card flex items-center justify-between gap-6 mb-8 bg-yellow-50 border-2 border-yellow-200">
               <div>
                   <h3 className="text-lg font-bold text-yellow-900 flex items-center gap-2">
                       <FileCheck size={20} /> Identity Verification Required
                   </h3>
                   <p className="text-sm text-yellow-800">DGCare requires all providers to pass a strict background check before families will book you. Submit your ID documents to begin the process.</p>
               </div>
               <button onClick={handleVerify} disabled={verifying} className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-xl hover:bg-yellow-700 disabled:bg-yellow-300 transition-all">
                   {verifying ? 'Submitting...' : 'Submit ID Documents'}
               </button>
           </div>
        )}

        {!isVerified && verificationPending && (
           <div style={{ backgroundColor: '#fffbeb', border: '2px solid #f59e0b', padding: '20px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                   <Clock3 size={22} color="#f59e0b" />
               </div>
               <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: 'bold', color: '#92400e', fontSize: '15px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       ⚠️ Verification In Process
                   </div>
                   <p style={{ color: '#b45309', fontSize: '13px' }}>Your documents have been received. Our team is conducting the background check — we&apos;ll notify you once complete. This usually takes 1–2 business days.</p>
               </div>
               <span style={{ padding: '4px 14px', backgroundColor: '#fef3c7', borderRadius: '99px', color: '#92400e', fontWeight: 'bold', fontSize: '12px', border: '1px solid #f59e0b', flexShrink: 0 }}>PENDING</span>
           </div>
        )}

        <div className={`premium-card flex items-center justify-between gap-8 mb-8 border-l-8 transition-all duration-500 ${broadcasting ? 'border-primary bg-primary/5' : 'border-slate-300'}`}>
           <div className="flex-1">
               <h3 className={`text-2xl font-black mb-1 flex items-center gap-3 ${broadcasting ? 'text-primary' : 'text-slate-400'}`}>
                 {broadcasting ? '🟢 Broadcasting Live' : '⚪ Shift Offline'}
               </h3>
               <p className="text-sm text-slate-500 max-w-md">Provide this unique PIN to your assigned family member so they can safely track your session and arrival.</p>
               <div className={`text-4xl font-extrabold tracking-[0.25em] mt-4 font-mono ${broadcasting ? 'text-primary' : 'text-slate-300'}`}>{myPin}</div>
           </div>
           <button onClick={() => {
                if(!isVerified) { alert("You must be Verified to start a shift!"); return; }
                setBroadcasting(!broadcasting);
            }} className={`px-10 py-5 rounded-[1.25rem] font-black text-lg transition-all shadow-xl active:scale-95 ${broadcasting ? 'bg-error text-white hover:bg-error/90 shadow-error/20' : 'bg-primary text-white hover:bg-primary-container shadow-primary/20'}`}>
               {broadcasting ? 'End Shift' : 'Go Online'}
           </button>
        </div>

        {broadcasting ? (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--primary-green)', margin: '0 0 20px', fontWeight: 'bold' }}>Your Emitted Location</h3>
                <div className="map-container">
                   <Map center={[19.0760, 72.8777]} role="caregiver" roomCode={`room_${myPin}`} />
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
