'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertTriangle, LogOut, Phone } from 'lucide-react';
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

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(76 + Math.floor(Math.random() * 7));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
    socketRef.current.on('sos_alert', () => {
      setSosActive(true);
      alert(`URGENT: Emergency Tracker Triggered from Room ${activePin}!`);
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
      
      <div className="bg-surface font-body text-on-surface antialiased flex overflow-hidden h-screen">
        
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex h-screen w-64 bg-slate-50 flex-col p-6 gap-y-4 shrink-0 overflow-y-auto border-r border-outline-variant/10 z-40">
          <div className="mb-8 px-2 flex justify-between items-center">
            <Link href="/">
              <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto mb-1" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">Family Portal</p>
            </Link>
          </div>
          <nav className="flex-1 space-y-2">
            <Link className="flex items-center gap-3 px-4 py-3 bg-white text-teal-700 shadow-sm rounded-xl font-bold transition-all duration-300 text-sm" href="/dashboard/family">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              <span>Monitoring Core</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 hover:translate-x-1 rounded-xl font-semibold transition-all duration-300 text-sm" href="/dashboard/family/booking">
              <span className="material-symbols-outlined">event_available</span>
              <span>Bookings / Schedule</span>
            </Link>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 hover:translate-x-1 rounded-xl font-semibold transition-all duration-300 text-sm" href="#">
              <span className="material-symbols-outlined">family_restroom</span>
              <span>Profiles</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 hover:translate-x-1 rounded-xl font-semibold transition-all duration-300 text-sm" href="#">
              <span className="material-symbols-outlined">person_search</span>
              <span>Care Network</span>
            </a>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 hover:translate-x-1 rounded-xl font-bold transition-all duration-300 w-full text-left text-sm">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-slate-200">
            <Link href="/dashboard/family/booking" className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">add</span> New Booking
            </Link>
            <div className="mt-6 flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {user.name ? user.name[0] : 'S'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold truncate max-w-[120px]">{user.name || 'Saraswati Family'}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-tight">Admin Role</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 px-4 md:px-8 xl:px-10 pt-8 pb-12 relative w-full">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Monitoring Dashboard</h2>
              <p className="text-slate-500 font-medium mt-1 text-lg">Real-time health telemetry & safety tracking for <span className="text-primary font-bold">Narayan Joshi</span></p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex items-center bg-white border border-slate-200 shadow-sm px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 uppercase tracking-widest">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]"></span>
                {activePin ? 'Live Sync Active' : 'Disconnected'}
              </div>
            </div>
          </header>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Smart Alert Cards (Column Left) */}
            <section className="lg:col-span-4 space-y-6">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 ml-2 mb-4">Live Alert Stream</h3>
              
              {/* Emergency SOS injected dynamically */}
              {sosActive && (
                <div className="bg-red-50 border-l-[6px] border-red-500 p-6 rounded-2xl flex gap-4 items-start shadow-md animate-in slide-in-from-left">
                  <div className="bg-red-500 text-white p-2.5 rounded-full shrink-0 flex items-center justify-center shadow-lg shadow-red-500/40">
                    <AlertTriangle size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-red-900 leading-tight">EMERGENCY SOS</h4>
                    <p className="text-sm text-red-800 font-medium mt-1">Caregiver has triggered the panic button. Establish contact immediately.</p>
                    <span className="text-[10px] font-black text-red-600 uppercase mt-3 block tracking-widest">Sent from Active Device</span>
                  </div>
                </div>
              )}

              {/* Dynamic Meds Warning */}
              {urgentMed ? (
                <div className="bg-amber-50 border-l-[4px] border-amber-500 p-6 rounded-2xl flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-amber-500 text-white p-2.5 rounded-full shrink-0">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>medication</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-900 uppercase tracking-widest">Medication Imminent</h4>
                    <p className="text-xs text-amber-800 font-medium mt-1">{nextMed.label} Dosage required in {nextMed.minutesLeft} minutes.</p>
                    <div className="flex gap-2 mt-4">
                      <button className="bg-white px-4 py-1.5 rounded-full text-[10px] font-bold text-amber-700 shadow-sm hover:bg-slate-50 transition-colors uppercase tracking-widest border border-amber-200">Acknowledge</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 border-l-[4px] border-slate-300 p-5 rounded-2xl flex gap-4 items-start shadow-sm">
                  <div className="bg-slate-300 text-white p-2.5 rounded-full shrink-0">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>medication</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 uppercase tracking-widest">Next Scheduled Med</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">{nextMed.label} Dosage securely queued up in {nextMed.minutesLeft} mins.</p>
                  </div>
                </div>
              )}

              {/* Normal Status mock log */}
              <div className="bg-teal-50 border-l-[4px] border-primary p-5 rounded-2xl flex gap-4 items-start shadow-sm">
                <div className="bg-primary text-white p-2.5 rounded-full shrink-0">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-teal-900 uppercase tracking-widest">Morning Check-in</h4>
                  <p className="text-xs text-teal-800 font-medium mt-1">Caregiver Priya Sharma confirmed breakfast & hydration at 08:30 AM.</p>
                </div>
              </div>
            </section>

            {/* Health Graphs (Center/Main) */}
            <section className="lg:col-span-8 grid grid-cols-2 gap-8">
              
              {/* Heart Rate Card */}
              <div className="col-span-2 md:col-span-1 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dynamic Heart Rate</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-5xl font-headline font-black text-slate-800 tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>{heartRate}</span>
                      <span className="text-sm font-bold text-slate-400">BPM</span>
                    </div>
                  </div>
                  <div className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Optimal</div>
                </div>
                
                {/* Simulated ECG using dynamic height maps mapped to Tailwind */}
                <div className="h-32 w-full flex items-end justify-between gap-1 px-1 border-b-2 border-slate-100 pb-2">
                   {[4, 8, 5, 16, 5, 9, 4, 12, 6, 10, 4, 7, 5, 14, 5, 8, 4].map((h, i) => (
                      <div
                        key={i}
                        className={`w-full rounded-sm ${h > 10 ? 'bg-error' : 'bg-primary'} opacity-80`}
                        style={{
                          height: `${(h/16)*100}%`,
                          animation: `ecgPulse 1.2s ease-in-out ${i * 0.07}s infinite`
                        }}
                      />
                   ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>08:00</span>
                  <span>10:00</span>
                  <span className="text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>Live</span>
                </div>
              </div>

              {/* BP Card (Static Mock) */}
              <div className="col-span-2 md:col-span-1 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blood Pressure</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-5xl font-headline font-black text-slate-800 tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>124/82</span>
                      <span className="text-sm font-bold text-slate-400">mmHg</span>
                    </div>
                  </div>
                  <div className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Stable</div>
                </div>
                <div className="relative h-32 w-full flex items-center justify-center border-b-2 border-slate-100 pb-2">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 100">
                    <path className="text-slate-200" d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,30" fill="none" stroke="currentColor" strokeWidth="2"></path>
                    <path className="text-teal-500" d="M0,70 Q25,60 50,80 T100,70 T150,90 T200,60" fill="none" stroke="currentColor" strokeWidth="4" style={{ strokeLinecap: 'round' }}></path>
                  </svg>
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Live</span>
                </div>
              </div>

              {/* Secure Handshake & Live Map Interface */}
              <div className="col-span-2 relative h-[450px] rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 border border-primary/20 bg-slate-900 group">
                
                {!activePin ? (
                  /* Form UI Overlay when disconnected */
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-slate-900/80 backdrop-blur-sm">
                    <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
                       <span className="material-symbols-outlined text-[40px]">security</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 font-headline tracking-tight">Establish Encrypted Link</h3>
                    <p className="text-slate-400 text-sm font-medium mb-8 max-w-sm">Enter the secure 4-digit PIN transmitted by your Care Provider to load live GPS telemetry.</p>
                    <form onSubmit={connectToPin} className="flex gap-4">
                      <input
                        type="text"
                        value={roomPin}
                        onChange={e => setRoomPin(e.target.value)}
                        maxLength={4}
                        placeholder="PIN"
                        className="w-32 px-4 py-4 text-center text-3xl font-black font-mono tracking-[0.2em] bg-white border-none rounded-2xl focus:ring-4 focus:ring-primary/50 text-slate-900 shadow-xl"
                      />
                      <button type="submit" disabled={roomPin.length < 4} className="px-10 py-4 bg-primary text-white font-bold rounded-2xl disabled:bg-slate-700 disabled:text-slate-400 hover:bg-primary-container hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest shadow-xl shadow-primary/30">
                        Connect
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Live Map when Connected */
                  <>
                    <Map center={[19.0760, 72.8777]} role="family" roomCode={`room_${activePin}`} />
                    
                    {/* UI Floating Cards mimicking the layout design exactly */}
                    <div className="absolute inset-0 flex flex-col pointer-events-none p-6 z-10 justify-between">
                      <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/50 w-72 pointer-events-auto transform transition-all hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 bg-primary text-white font-bold text-xl rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                               P
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <h5 className="text-base font-black text-slate-800">Priya Sharma</h5>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">GNM Specialist</p>
                          </div>
                        </div>
                        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Room {activePin} Secure Tracking</span>
                          <span className="flex gap-1">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pointer-events-auto">
                        <button className="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-full text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/40 flex items-center gap-3 transform hover:scale-105 active:scale-95 transition-all">
                            <Phone size={18} />
                            Emergency Dial
                        </button>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </section>
          </div>

          {/* Care Logs: Horizontal Strip */}
          <section className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 ml-2 mb-6">Encrypted Care Logs & History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              
              <div className="bg-white shadow-sm p-6 rounded-2xl border border-slate-100 hover:border-teal-500 hover:shadow-lg transition-all group cursor-pointer">
                <span className="text-[10px] font-bold text-slate-400 block mb-3 uppercase tracking-widest">07:30 AM</span>
                <h6 className="font-extrabold text-base text-slate-800 group-hover:text-primary transition-colors">Vitals Logged</h6>
                <div className="flex items-center gap-2 mt-3 bg-slate-50 w-max px-3 py-1.5 rounded-lg border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">All nominal</span>
                </div>
              </div>

              <div className="bg-white shadow-sm p-6 rounded-2xl border border-slate-100 hover:border-teal-500 hover:shadow-lg transition-all group cursor-pointer">
                <span className="text-[10px] font-bold text-slate-400 block mb-3 uppercase tracking-widest">08:15 AM</span>
                <h6 className="font-extrabold text-base text-slate-800 group-hover:text-primary transition-colors">Meal Interaction</h6>
                <div className="flex items-center gap-2 mt-3 bg-slate-50 w-max px-3 py-1.5 rounded-lg border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">High protein</span>
                </div>
              </div>

              <div className="bg-white shadow-sm p-6 rounded-2xl border border-red-200 hover:border-red-500 hover:shadow-lg transition-all group cursor-pointer bg-red-50/30">
                <span className="text-[10px] font-bold text-red-400 block mb-3 uppercase tracking-widest">09:45 AM</span>
                <h6 className="font-extrabold text-base text-red-900 group-hover:text-red-700 transition-colors">Safety Alert</h6>
                <div className="flex items-center gap-2 mt-3 bg-red-50 w-max px-3 py-1.5 rounded-lg border border-red-100">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest">BP Warning Sent</span>
                </div>
              </div>

              <div className="bg-white shadow-sm p-6 rounded-2xl border border-slate-100 hover:border-teal-500 hover:shadow-lg transition-all group cursor-pointer">
                <span className="text-[10px] font-bold text-slate-400 block mb-3 uppercase tracking-widest">10:30 AM</span>
                <h6 className="font-extrabold text-base text-slate-800 group-hover:text-primary transition-colors">Physical Therapy</h6>
                <div className="flex items-center gap-2 mt-3 bg-amber-50 w-max px-3 py-1.5 rounded-lg border border-amber-100">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">In Progress</span>
                </div>
              </div>

            </div>
          </section>

          {/* Editorial Footer */}
          <footer className="mt-20 pt-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <span className="font-headline font-black text-slate-900 text-2xl tracking-tighter">DGCare</span>
              <p className="text-[10px] font-bold text-slate-400 mt-2 max-w-xs leading-relaxed uppercase tracking-widest">
                  Editorial Healthcare Excellence. Precision monitoring for peace of mind.
              </p>
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-200 pb-2">Platform Legal</h5>
              <ul className="space-y-3">
                <li><a className="text-[10px] font-bold text-slate-500 hover:text-teal-600 transition-colors uppercase tracking-widest" href="#">Privacy Policy</a></li>
                <li><a className="text-[10px] font-bold text-slate-500 hover:text-teal-600 transition-colors uppercase tracking-widest" href="#">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-200 pb-2">Support</h5>
              <ul className="space-y-3">
                <li><a className="text-[10px] font-bold text-slate-500 hover:text-teal-600 transition-colors uppercase tracking-widest" href="#">Help Center</a></li>
                <li><a className="text-[10px] font-bold text-slate-500 hover:text-teal-600 transition-colors uppercase tracking-widest" href="#">Contact Form</a></li>
              </ul>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
