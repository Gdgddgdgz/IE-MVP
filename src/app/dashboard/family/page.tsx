'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertTriangle, LogOut, Phone, Camera, Utensils, CheckCircle2, Clock, Zap, Activity } from 'lucide-react';
import io from 'socket.io-client';
import { FullPageSkeleton } from '@/components/SkeletonLoader';
import Link from 'next/link';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

/* ─── Medication schedule ─── */
const MED_SCHEDULE: { label: string; hour: number; minute: number }[] = [
  { label: '8:00 AM',  hour: 8,  minute: 0  },
  { label: '1:00 PM',  hour: 13, minute: 0  },
  { label: '4:00 PM',  hour: 16, minute: 0  },
  { label: '9:00 PM',  hour: 21, minute: 0  },
];

function getNextMedication() {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const med of MED_SCHEDULE) {
    const medMin = med.hour * 60 + med.minute;
    if (medMin > nowMin) {
      return { label: med.label, minutesLeft: medMin - nowMin };
    }
  }
  const first = MED_SCHEDULE[0];
  const minsUntilMidnight = 24 * 60 - nowMin;
  return { label: first.label, minutesLeft: minsUntilMidnight + first.hour * 60 + first.minute };
}

export default function FamilyMonitoringDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string; name?: string } | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [roomPin, setRoomPin] = useState('');
  const [activePin, setActivePin] = useState('');
  const [caregiverVerified, setCaregiverVerified] = useState(false);
  const [careLogs, setCareLogs] = useState<any[]>([
    { id: 1, type: 'meal', message: 'Breakfast: Oats & Fruits provided', time: '08:30 AM' },
    { id: 2, type: 'meds', message: 'AM Dosage (BP & Heart) adminstered', time: '08:15 AM' }
  ]);
  const [aiAlert, setAiAlert] = useState<{ active: boolean; message: string } | null>(null);
  
  const socketRef = useRef<any>(null);
  const [heartRate, setHeartRate] = useState(78);
  const [nextMed, setNextMed] = useState(getNextMedication);

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

  // AI Heart Rate Simulation & Logic
  useEffect(() => {
    let highCount = 0;
    const interval = setInterval(() => {
      const newHr = 76 + Math.floor(Math.random() * 10);
      setHeartRate(newHr);
      
      // AI Logic: Detect anomaly if HR > 84 for 3 consecutive cycles
      if (newHr > 84) {
        highCount++;
        if (highCount >= 3) {
           setAiAlert({ active: true, message: 'Unusual spike detected: HR +12% above 3-day baseline. Monitoring closely.' });
        }
      } else {
        highCount = 0;
        if (aiAlert) setAiAlert(null);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [aiAlert]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextMed(getNextMedication());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user || !activePin) return;
    socketRef.current = io();
    socketRef.current.emit('join_room', `room_${activePin}`);
    
    // Listen for Emergency SOS
    socketRef.current.on('sos_alert', () => {
      setSosActive(true);
    });

    // Listen for Live Proof-of-Work Logs
    socketRef.current.on('care_log', (data: any) => {
      setCareLogs(prev => [data.log, ...prev]);
    });

    if (localStorage.getItem('caregiver_verified') === 'true') {
      setCaregiverVerified(true);
    }
    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, [user, activePin]);

  const connectToPin = (e: any) => {
    e.preventDefault();
    setActivePin(roomPin);
  };

  const handleLogout = () => {
    localStorage.removeItem('dgcare_user');
    localStorage.removeItem('dgcare_bookings');
    localStorage.removeItem('caregiver_verified');
    router.push('/login');
  };

  const urgentMed = nextMed.minutesLeft <= 30;

  if (!user) return <FullPageSkeleton role="family" />;

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00665d33; border-radius: 10px; }
        @keyframes ecgPulse {
          0%, 100% { transform: scaleY(0.7); opacity: 0.8; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
      
      <div className="bg-surface font-body text-on-surface antialiased flex overflow-hidden h-screen bg-slate-50">
        
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex h-screen w-72 bg-white flex-col p-8 gap-y-6 shrink-0 overflow-y-auto border-r border-slate-100 z-40">
          <div className="mb-10 px-2">
            <Link href="/">
              <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto mb-1" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mt-1 leading-none">Family Guardian</p>
            </Link>
          </div>
          <nav className="flex-1 space-y-2">
            <Link className="flex items-center gap-3 px-5 py-3.5 bg-primary/5 text-primary rounded-[1.25rem] font-black transition-all text-sm shadow-sm" href="/dashboard/family">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              <span>Monitoring Core</span>
            </Link>
            <Link className="flex items-center gap-3 px-5 py-3.5 text-slate-500 hover:bg-slate-50 hover:translate-x-1 rounded-[1.25rem] font-bold transition-all text-sm" href="/dashboard/family/marketplace">
              <span className="material-symbols-outlined">person_search</span>
              <span>Find Caregivers</span>
            </Link>
            <Link className="flex items-center gap-3 px-5 py-3.5 text-slate-500 hover:bg-slate-50 hover:translate-x-1 rounded-[1.25rem] font-bold transition-all text-sm" href="/dashboard/family/booking">
              <span className="material-symbols-outlined">event_available</span>
              <span>My Bookings</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-3.5 mt-6 text-red-500 hover:bg-red-50 rounded-[1.25rem] font-black transition-all w-full text-left text-sm">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </nav>
          
          <div className="mt-auto flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
            <div className="w-12 h-12 rounded-[1rem] bg-slate-900 text-white flex items-center justify-center font-black text-xl shrink-0">
               {user.name ? user.name[0] : 'S'}
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-black truncate text-slate-800">{user.name || 'Family Hub'}</span>
               <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-tight">Admin Level</span>
            </div>
          </div>
        </aside>

        {/* Main Content Layout */}
        <main className="flex-1 overflow-hidden flex flex-col h-full relative">
          
          {/* Top Bar Section */}
          <header className="px-8 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white/50 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
            <div>
              <h2 className="font-headline text-3xl font-black tracking-tighter text-slate-900">Guardian Dashboard</h2>
              <p className="text-slate-500 font-bold mt-1 text-sm">Telemetry monitoring for <span className="text-primary">Narayan Joshi</span></p>
            </div>
            <div className="flex gap-4 items-center mt-4 md:mt-0">
               <div className="px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activePin ? 'bg-primary animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activePin ? `Linked: Room ${activePin}` : 'Offline Mode'}</span>
               </div>
               <button className="p-3 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-primary transition-all shadow-sm">
                  <Phone size={18} />
               </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 lg:p-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Health & Map */}
              <div className="lg:col-span-8 flex flex-col gap-10">
                
                {/* Priority Alert Zone */}
                {(sosActive || aiAlert || urgentMed) && (
                  <div className="flex flex-col gap-4 animate-in slide-in-from-top duration-500">
                    {sosActive && (
                       <div className="p-8 bg-red-600 rounded-[2.5rem] text-white shadow-2xl shadow-red-500/30 flex items-center gap-8 border-4 border-white/20">
                          <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center animate-pulse shrink-0">
                             <AlertTriangle size={48} />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black font-headline tracking-tighter mb-1">EMERGENCY SOS ACTIVE</h3>
                            <p className="text-white/80 font-bold text-sm leading-relaxed max-w-xl">Panic tracker triggered by remote curator. Dispatch protocol initiated. Establish contact immediately via secondary channel.</p>
                          </div>
                       </div>
                    )}

                    {aiAlert && (
                      <div className="p-8 bg-amber-500 rounded-[2.5rem] text-white shadow-2xl shadow-amber-500/20 flex items-center gap-8 border-4 border-white/20">
                         <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center shrink-0">
                            <Zap size={36} fill="white" />
                         </div>
                         <div>
                           <h3 className="text-2xl font-black font-headline tracking-tighter mb-1">AI ANOMALY DETECTED</h3>
                           <p className="text-white/90 font-bold text-sm leading-relaxed max-w-xl">{aiAlert.message}</p>
                         </div>
                      </div>
                    )}

                    {urgentMed && !sosActive && (
                      <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl flex items-center justify-between border border-white/10">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                               <span className="material-symbols-outlined">medication</span>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Medical Deadline</p>
                               <p className="text-base font-black tracking-tight">{nextMed.label} Dosage required in {nextMed.minutesLeft}m</p>
                            </div>
                         </div>
                         <button className="px-6 py-2.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest">Remind Curator</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Health Telemetry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Heart Rate */}
                   <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Heart Telemetry</span>
                          <div className="flex items-baseline gap-2 mt-2">
                             <span className="text-6xl font-black text-slate-900 font-headline tabular-nums leading-none tracking-tighter">{heartRate}</span>
                             <span className="text-sm font-black text-slate-400 uppercase tracking-widest italic">bpm</span>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${heartRate > 84 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-primary/5 text-primary border-primary/20'}`}>
                           {heartRate > 84 ? 'Elevated' : 'Optimal'}
                        </div>
                      </div>
                      
                      <div className="h-28 w-full flex items-end justify-between gap-1 border-b border-slate-100 pb-2 relative z-10">
                         {[4, 10, 6, 16, 5, 8, 12, 6, 10, 5, 14, 7, 5, 16, 4].map((h, i) => (
                           <div key={i} className={`w-full rounded-full transition-all duration-500 ${h > 12 ? 'bg-red-500' : 'bg-primary'}`} style={{ height: `${(h/16)*100}%`, opacity: 0.6 + (h/40), animation: `ecgPulse 1.2s ease-in-out ${i*0.05}s infinite` }}></div>
                         ))}
                      </div>
                      <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-700">
                         <Activity size={180} />
                      </div>
                   </div>

                   {/* Blood Pressure */}
                   <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Pressure (Static)</span>
                          <div className="flex items-baseline gap-2 mt-2">
                             <span className="text-6xl font-black text-slate-900 font-headline tabular-nums leading-none tracking-tighter">124/82</span>
                             <span className="text-sm font-black text-slate-400 uppercase tracking-widest italic">mmHg</span>
                          </div>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-[9px] font-black uppercase tracking-widest">
                           Stable 09:00 AM
                        </div>
                      </div>
                      
                      <div className="h-24 flex items-center justify-center relative z-10">
                        <svg className="w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 200 100">
                          <path d="M0,50 C50,20 100,80 200,50" fill="none" stroke="#2dd4bf" strokeWidth="8" strokeLinecap="round" />
                          <circle cx="200" cy="50" r="6" fill="#2dd4bf" />
                        </svg>
                      </div>
                   </div>
                </div>

                {/* Map Handshake Area */}
                <div className="h-[500px] rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 relative bg-slate-900 group">
                   {!activePin ? (
                     <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center bg-slate-900/90 backdrop-blur-md">
                        <div className="w-24 h-24 bg-primary/20 text-primary rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                           <span className="material-symbols-outlined text-[50px]">hub</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-3 font-headline tracking-tight">Sync Tracking Hub</h3>
                        <p className="text-white/40 text-sm font-medium mb-12 max-w-sm">Enter the encrypted 4-digit PIN provided by your active caregiver to unlock live GPS data.</p>
                        <form onSubmit={connectToPin} className="flex gap-4">
                           <input maxLength={4} value={roomPin} onChange={e => setRoomPin(e.target.value)} placeholder="0000" className="w-40 bg-white/10 border-2 border-white/20 rounded-3xl text-center text-4xl font-black font-mono tracking-[0.3em] text-white focus:border-primary transition-all p-4 outline-none" />
                           <button className="bg-primary text-white px-10 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 active:scale-95 transition-all">Link Session</button>
                        </form>
                     </div>
                   ) : (
                     <>
                        <Map center={[19.0760, 72.8777]} role="family" roomCode={`room_${activePin}`} />
                        <div className="absolute top-8 left-8 z-10 w-80 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/50 pointer-events-none group-hover:scale-105 transition-transform duration-500">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg">P</div>
                              <div>
                                 <h5 className="text-base font-black text-slate-800">Priya Sharma</h5>
                                 <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Live in Session</span>
                                 </div>
                              </div>
                           </div>
                           <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">ETA: Close Proximity</span>
                              <div className="flex gap-1.5">
                                 <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                                 <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                 <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                              </div>
                           </div>
                        </div>
                     </>
                   )}
                </div>
              </div>

              {/* Right Column: Live Care Feed (STRATEGIC KILLER FEATURE) */}
              <div className="lg:col-span-4 flex flex-col gap-10">
                 
                 <div className="bg-white rounded-[3rem] flex-1 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden">
                    <header className="p-8 border-b border-slate-50 flex justify-between items-center shrink-0">
                       <div>
                          <h4 className="text-xl font-black tracking-tighter text-slate-900 font-headline">Live Care Feed</h4>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Session Proof-of-Work</p>
                       </div>
                       <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    </header>
                    
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                       {careLogs.map((log, idx) => (
                         <div key={log.id} className="flex gap-6 animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="flex flex-col items-center">
                               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${log.type === 'meds' ? 'bg-primary/10 text-primary border-primary/20' : log.type === 'meal' ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                  {log.type === 'meds' ? <CheckCircle2 size={18} /> : log.type === 'meal' ? <Utensils size={18} /> : <Camera size={18} />}
                               </div>
                               <div className="flex-1 w-0.5 bg-slate-50 my-3"></div>
                            </div>
                            <div className="pt-1">
                               <div className="flex items-center gap-3 mb-1.5">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                                  <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-md leading-none">Verified</span>
                               </div>
                               <p className="text-sm font-bold text-slate-800 leading-snug">{log.message}</p>
                               {log.type === 'photo' && (
                                 <div className="mt-4 w-full h-32 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 font-black italic text-xs border-2 border-dashed border-slate-200">
                                     [Photo Evidence Placeholder]
                                 </div>
                               )}
                            </div>
                         </div>
                       ))}
                       
                       {careLogs.length === 0 && (
                         <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20 grayscale">
                            <span className="material-symbols-outlined text-6xl">history_edu</span>
                            <p className="text-xs font-black uppercase tracking-widest mt-6 leading-tight">No live updates yet.<br/>Ensure shift is active.</p>
                         </div>
                       )}
                    </div>
                    
                    <footer className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                       <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Download Session Report</button>
                    </footer>
                 </div>

                 {/* Subscription / Loyalty Status */}
                 <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                       <div className="mb-10">
                          <span className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-6"><CheckCircle2 size={24} className="text-primary" /></span>
                          <h4 className="text-2xl font-black font-headline tracking-tighter mb-2 leading-none">Priority Guardianship</h4>
                          <p className="text-xs font-bold opacity-50 leading-relaxed uppercase tracking-widest">Active Subscription • Level 12</p>
                       </div>
                       <div>
                          <p className="text-sm font-bold opacity-60 leading-relaxed mb-6 italic">"Premium security & real-time human oversight for your most precious links."</p>
                          <button className="w-full bg-white text-slate-900 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-primary transition-all active:scale-95">Upgrade Tier</button>
                       </div>
                    </div>
                    <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] opacity-10 rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-1000">health_and_safety</span>
                 </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
