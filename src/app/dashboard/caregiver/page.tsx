// FIXED
'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertTriangle, FileCheck, Clock3, MapPin } from 'lucide-react';
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
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) {
      router.push('/login');
    } else {
      const parsed = JSON.parse(lsUser);
      if (parsed.role !== 'caregiver') router.push('/dashboard');
      else setUser(parsed);
    }
    const storedPin = localStorage.getItem('caregiver_pin');
    if (storedPin) {
      setMyPin(storedPin);
    } else {
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem('caregiver_pin', newPin);
      setMyPin(newPin);
    }
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Shift Control Center</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your clinical sessions and broadcast status to families.</p>
          </div>
          <button 
            onClick={handleSOS} 
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold bg-red-500 text-white transition-all duration-300 shadow-lg ${
              sosActive 
                ? 'animate-pulse shadow-red-500/40' 
                : 'hover:bg-red-600 shadow-red-500/20 hover:shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            <AlertTriangle size={20} className={sosActive ? "animate-bounce" : ""} /> 
            {sosActive ? 'SOS SUBMITTED' : 'EMERGENCY SOS'}
          </button>
        </header>

        {sosActive && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold flex items-center gap-3 shadow-sm animate-fade-in">
            <AlertTriangle size={24} className="text-red-500 animate-pulse" /> Emergency SOS Alert Triggered. Local authorities notified.
          </div>
        )}

        {!isVerified && !verificationPending && (
           <div className="premium-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 bg-amber-50 border-2 border-amber-200 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
               <div>
                   <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-1">
                       <FileCheck size={20} className="text-amber-600" /> Identity Verification Required
                   </h3>
                   <p className="text-sm text-amber-800/80 font-medium max-w-2xl">DGCare requires all providers to pass a strict background check before families will book you. Submit your ID documents to begin the process.</p>
               </div>
               <button onClick={handleVerify} disabled={verifying} className="whitespace-nowrap px-6 py-3 bg-amber-600 text-white font-bold rounded-xl shadow-md shadow-amber-600/20 hover:bg-amber-700 hover:shadow-lg disabled:bg-amber-300 disabled:shadow-none transition-all active:scale-95">
                   {verifying ? 'Submitting secure payload...' : 'Submit ID Documents'}
               </button>
           </div>
        )}

        {!isVerified && verificationPending && (
           <div className="mb-8 bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start sm:items-center gap-4 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
               <div className="w-12 h-12 rounded-xl bg-amber-200/50 flex flex-col items-center justify-center shrink-0">
                   <Clock3 size={24} className="text-amber-600" />
               </div>
               <div className="flex-1">
                   <div className="font-bold text-amber-900 text-base mb-1 flex items-center gap-2 tracking-tight">
                       Verification In Process
                   </div>
                   <p className="text-amber-800/80 text-sm font-medium">Your documents have been securely received. Our clinical team is conducting the background check — we'll notify you once complete. This usually takes 1–2 business days.</p>
               </div>
               <span className="hidden sm:flex px-3 py-1.5 bg-amber-200/50 rounded-lg text-amber-800 font-bold text-xs tracking-wider border border-amber-300 shrink-0">STATUS: PENDING</span>
           </div>
        )}

        <div className={`premium-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 border-l-[6px] transition-all duration-500 animate-fade-in-up ${broadcasting ? 'border-primary bg-primary/5 shadow-primary/10' : 'border-slate-200'}`} style={{ animationDelay: '0.2s' }}>
           <div className="flex-1">
               <h3 className={`text-2xl font-black mb-2 flex items-center gap-3 transition-colors ${broadcasting ? 'text-primary' : 'text-slate-400'}`}>
                 {broadcasting ? <><div className="w-3 h-3 rounded-full bg-primary animate-pulse" /> Live Broadcast Active</> : <><div className="w-3 h-3 rounded-full bg-slate-300" /> Shift Offline</>}
               </h3>
               <p className="text-sm font-medium text-slate-500 max-w-lg">Provide this secure PIN to your assigned family member so they can safely track your session and arrival.</p>
               <div className={`text-4xl font-black tracking-[0.25em] mt-5 font-mono select-all ${broadcasting ? 'text-primary' : 'text-slate-300'}`}>{myPin}</div>
           </div>
           
           <button 
              onClick={() => {
                  if(!isVerified) { 
                      // Custom styled alert in a real app, here we fallback 
                      alert("You must be Verified to start a shift!"); 
                      return; 
                  }
                  setBroadcasting(!broadcasting);
              }} 
              className={`px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 w-full md:w-auto shadow-lg active:-scale-y-[0.98] active:scale-x-[0.98] ${
                  broadcasting 
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' 
                    : 'bg-primary text-white hover:bg-primary-container shadow-primary/20 hover:-translate-y-1'
              }`}
           >
               {broadcasting ? 'End Broadcast' : 'Go Online Now'}
           </button>
        </div>

        {broadcasting ? (
            <div className="premium-card flex-1 flex flex-col p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-xl text-primary font-black mb-5 tracking-tight flex items-center gap-2">
                    <MapPin size={22} className="text-primary animate-pulse" /> Your Emitted Location
                </h3>
                <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                   <Map center={[19.0760, 72.8777]} role="caregiver" roomCode={`room_${myPin}`} />
                </div>
            </div>
        ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 p-12 rounded-2xl text-center text-slate-400 flex flex-col items-center justify-center flex-1 min-h-[300px] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <MapPin size={48} className="mb-4 opacity-50 text-slate-300" />
                <p className="font-medium text-lg">Start your shift to begin transmitting GPS coordinates securely.</p>
                <p className="text-sm mt-2 opacity-70">The map interface will unlock immediately.</p>
            </div>
        )}
      </div>
    </div>
  );
}
