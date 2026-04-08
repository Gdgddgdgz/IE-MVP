'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertTriangle, FileCheck, Clock3, LogOut, Camera, Utensils, CheckCircle2, Mic, FileText, ShieldCheck } from 'lucide-react';
import io from 'socket.io-client';
import { FullPageSkeleton } from '@/components/SkeletonLoader';
import Link from 'next/link';

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
  const [logs, setLogs] = useState<any[]>([]);

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
    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, [user, myPin, broadcasting]);

  const handleSOS = () => {
    if (socketRef.current && broadcasting) {
      socketRef.current.emit('sos_alert', { roomId: `room_${myPin}` });
      setSosActive(true);
    } else {
      alert("Must be broadcasting your shift to send an SOS.");
    }
  };

  const logActivity = (type: string, message: string) => {
    if (!broadcasting) {
      alert("Start your shift to log proof-of-work.");
      return;
    }
    const log = { type, message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), id: Date.now() };
    setLogs([log, ...logs]);
    
    // Emit to family via Room
    if (socketRef.current) {
      socketRef.current.emit('care_log', { roomId: `room_${myPin}`, log });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dgcare_user');
    localStorage.removeItem('dgcare_bookings');
    localStorage.removeItem('caregiver_verified');
    router.push('/login');
  };

  if (!user) return <FullPageSkeleton role="caregiver" />;

  return (
    <div className="flex min-h-screen bg-slate-50 font-body antialiased text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col p-6 gap-y-4 bg-white border-r border-slate-100 h-screen w-72 fixed left-0 top-0 z-40">
        <div className="mb-8">
          <Link href="/">
            <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto mb-1" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Care Assistant Portal</p>
          </Link>
        </div>
        <nav className="flex flex-col gap-y-2">
          <a className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-2xl shadow-sm text-sm font-black transition-all" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span>Live Control</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl text-sm font-bold transition-all hover:translate-x-1" href="#logs">
            <span className="material-symbols-outlined">history_edu</span>
            <span>Performance Logs</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl text-sm font-bold transition-all hover:translate-x-1" href="#">
            <span className="material-symbols-outlined">payments</span>
            <span>Earnings</span>
          </a>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 rounded-2xl text-sm font-black transition-all hover:translate-x-1 w-full text-left">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </nav>

        <div className="mt-auto px-2">
           <div className={`p-5 rounded-3xl border ${isVerified ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Status</span>
                 {isVerified && <CheckCircle2 size={14} className="text-primary" />}
              </div>
              <p className="text-xs font-bold text-slate-700 leading-relaxed mb-4">
                {isVerified ? 'Your credentials are fully hand-vetted by DGCare Specialists.' : verificationPending ? 'Verification is underway. Expect status update in 4h.' : 'Verification required to access premium Clinical bookings.'}
              </p>
              {!isVerified && !verificationPending && (
                <button onClick={() => { setVerificationPending(true); localStorage.setItem('caregiver_verification_pending', 'true'); }} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Verify ID</button>
              )}
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 lg:p-12 overflow-y-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="font-headline text-3xl md:text-5xl font-black tracking-tight text-slate-900">Shift Center</h2>
            <p className="text-slate-500 font-medium text-lg mt-1">Hello, <span className="text-primary font-black">{user.name || 'Provider'}</span>. Manage your patient logs and live telemetry.</p>
          </div>
          <div className="flex items-center gap-4">
            {broadcasting && (
               <div className="bg-red-50 px-4 py-2 rounded-full flex items-center gap-2 border border-red-200">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                  <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">Broadcasting Live</span>
               </div>
            )}
            <div className="p-1 px-5 border border-slate-200 bg-white rounded-full flex items-center gap-4 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pin</span>
                <span className="text-2xl font-black font-mono text-primary tracking-widest">{myPin}</span>
            </div>
          </div>
        </header>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Shift Controls & Map */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-black text-slate-900 font-headline tracking-tighter mb-4">Shift Connectivity</h3>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-sm">Start your broadcast to share GPS telemetry and log daily care tasks for the family dashboard.</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setBroadcasting(!broadcasting)}
                    className={`flex-1 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${broadcasting ? 'bg-red-50 text-red-600 border-2 border-red-200' : 'bg-primary text-white shadow-primary/30'}`}
                  >
                    {broadcasting ? 'End Shift' : 'Initiate Broadcast'}
                  </button>
                  <button 
                    onClick={handleSOS}
                    className="flex-1 bg-slate-900 text-white rounded-[1.5rem] py-5 font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <AlertTriangle size={20} /> Panic SOS
                  </button>
                </div>
              </div>
              <div className="w-56 h-56 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-inner shrink-0 group">
                 <span className={`material-symbols-outlined text-[100px] transition-all duration-700 ${broadcasting ? 'text-primary scale-110 drop-shadow-2xl' : 'text-slate-200'}`} style={{ fontVariationSettings: `'FILL' ${broadcasting ? 1 : 0}` }}>wifi_tethering</span>
              </div>
            </div>

            {/* Proof of Work Interaction Panel */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/20">
               <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight font-headline">Care Task Logs</h3>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">One-tap transparency for families</p>
                  </div>
                  <div className="flex -space-x-4">
                     <div className="w-10 h-10 rounded-full border-4 border-slate-900 bg-primary/20 flex items-center justify-center"><CheckCircle2 size={16} className="text-primary" /></div>
                     <div className="w-10 h-10 rounded-full border-4 border-slate-900 bg-teal-500/20 flex items-center justify-center"><Utensils size={16} className="text-teal-400" /></div>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <button onClick={() => logActivity('meal', 'Lunch served: High protein veg thali')} className="flex flex-col items-center gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all group active:scale-95">
                     <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Utensils size={24} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Log Meal</span>
                  </button>
                  <button onClick={() => logActivity('meds', 'Medication Dose Administered')} className="flex flex-col items-center gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all group active:scale-95">
                     <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={24} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Log Meds</span>
                  </button>
                  <button onClick={() => logActivity('photo', 'Photo Check-in Sent')} className="flex flex-col items-center gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all group active:scale-95">
                     <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera size={24} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Photo Tip</span>
                  </button>
                  <button onClick={() => logActivity('note', 'Manual Activity Note logged')} className="flex flex-col items-center gap-4 p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 transition-all group active:scale-95">
                     <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Write Note</span>
                  </button>
               </div>
            </div>
          </div>

          {/* Right Rail: Session Monitor & Feed */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Live Feed Container */}
            <div id="logs" className="bg-white rounded-[2.5rem] flex-1 border border-slate-100 shadow-xl overflow-hidden flex flex-col">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center shrink-0">
                  <h4 className="text-xl font-black tracking-tight text-slate-800">Session History</h4>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
               </div>
               
               <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-4 animate-in slide-in-from-bottom-2">
                       <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${log.type === 'meds' ? 'bg-primary/10 text-primary' : log.type === 'meal' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                             {log.type === 'meds' ? <CheckCircle2 size={14} /> : log.type === 'meal' ? <Utensils size={14} /> : <FileText size={14} />}
                          </div>
                          <div className="flex-1 w-px bg-slate-100 my-2"></div>
                       </div>
                       <div className="pb-4">
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{log.time}</span>
                             <span className="text-[9px] font-black text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-full tracking-widest">Synced</span>
                          </div>
                          <p className="text-xs font-bold text-slate-700 leading-relaxed">{log.message}</p>
                       </div>
                    </div>
                  ))}

                  {logs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 grayscale opacity-40">
                       <FileCheck size={40} className="mb-4" />
                       <p className="text-xs font-black uppercase tracking-widest">No activities logged yet.</p>
                       <p className="text-[10px] font-medium mt-1">Activities will appear here once shift starts.</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Performance Card */}
            <div className="bg-primary text-white rounded-[2.5rem] p-10 shadow-2xl shadow-primary/20 relative overflow-hidden group">
               <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4 block">Platform Level</span>
                  <h4 className="text-3xl font-black font-headline tracking-tighter mb-4 leading-none">Marketplace Elite</h4>
                  <p className="text-sm font-bold opacity-80 leading-relaxed">You've maintained a <span className="text-primary-fixed font-black">99% reliability</span> rating. High demand in your zone.</p>
               </div>
               <ShieldCheck size={120} className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
