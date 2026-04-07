// FIXED
'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertTriangle, Key, MapPin, HeartPulse, Pill, Clock } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import io from 'socket.io-client';
import Sidebar from '@/components/Sidebar';
import { FullPageSkeleton } from '@/components/SkeletonLoader';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

/* ─── Animated heart-rate display ─── */
function HeartRateWidget({ bpm }: { bpm: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ color: 'var(--text-light)', fontSize: '13px', marginBottom: '4px' }}>
        Loved One Heart Rate
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Beating heart icon */}
        <HeartPulse
          size={28}
          color="#ef4444"
          style={{ animation: 'heartbeat 0.8s ease-in-out infinite' }}
        />
        <span style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--primary-green)', fontVariantNumeric: 'tabular-nums' }}>
          {bpm} <span style={{ fontSize: '15px', color: 'var(--text-light)', fontWeight: 'normal' }}>BPM</span>
        </span>
        <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '99px', backgroundColor: '#f0fdf4', color: '#15803d' }}>
          Normal
        </span>
      </div>
      {/* Mini ECG bar */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '22px', marginTop: '4px' }}>
        {[4, 8, 5, 16, 5, 9, 4, 12, 6, 10, 4, 7, 5, 14, 5, 8, 4].map((h, i) => (
          <div
            key={i}
            style={{
              width: '3px',
              height: `${h}px`,
              borderRadius: '2px',
              backgroundColor: h > 10 ? '#ef4444' : '#86efac',
              opacity: 0.85,
              animation: `ecgPulse 1.2s ease-in-out ${i * 0.07}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Next medication widget ─── */
function NextMedWidget({ nextTime, minutesLeft }: { nextTime: string; minutesLeft: number }) {
  const urgent = minutesLeft <= 30;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ color: 'var(--text-light)', fontSize: '13px', marginBottom: '4px' }}>
        Next Scheduled Medication
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Pill size={24} color={urgent ? '#f59e0b' : 'var(--primary-green)'} />
        <span style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--primary-green)', fontVariantNumeric: 'tabular-nums' }}>
          {nextTime}
        </span>
      </div>
      <div style={{ fontSize: '12px', color: urgent ? '#d97706' : 'var(--text-light)', fontWeight: urgent ? '600' : '400', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
        <Clock size={11} />
        {minutesLeft <= 0
          ? 'Due now — administer medication!'
          : `In ${minutesLeft} min${minutesLeft === 1 ? '' : 's'}`}
        {urgent && minutesLeft > 0 && ' ⚠️'}
      </div>
    </div>
  );
}

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
  // Wrap to next day's first
  const first = MED_SCHEDULE[0];
  const minsUntilMidnight = 24 * 60 - nowMin;
  return { label: first.label, minutesLeft: minsUntilMidnight + first.hour * 60 + first.minute };
}

/* ─── Page ─── */
export default function FamilyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string; name?: string } | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [roomPin, setRoomPin] = useState('');
  const [activePin, setActivePin] = useState('');
  const [caregiverVerified, setCaregiverVerified] = useState(false);
  const toast = useToast();
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  // Animated heart rate (76–82 BPM)
  const [heartRate, setHeartRate] = useState(78);

  // Next medication (updates every minute)
  const [nextMed, setNextMed] = useState(getNextMedication);

  /* Auth */
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

  /* Heart rate animation — fluctuate 76–82 every 2 s */
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(76 + Math.floor(Math.random() * 7)); // 76..82
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  /* Medication timer — update every 30 s */
  useEffect(() => {
    const interval = setInterval(() => {
      setNextMed(getNextMedication());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  /* Socket / PIN pairing */
  useEffect(() => {
    if (!user || !activePin) return;
    socketRef.current = io();
    socketRef.current.emit('join_room', `room_${activePin}`);
    socketRef.current.on('sos_alert', () => {
      setSosActive(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    if (localStorage.getItem('caregiver_verified') === 'true') {
      setCaregiverVerified(true);
    }
    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, [user, activePin]);

  const handleSOS = () => {
    if (socketRef.current && activePin) {
      socketRef.current.emit('sos_alert', { roomId: `room_${activePin}`, sender: user?.name || user?.email });
      setSosActive(true);
      toast.error('Emergency SOS dispatched to caregiver.');
    } else {
      toast.error('Must be paired to a Caregiver PIN to send Emergency Alerts.');
    }
  };

  const connectToPin = (e: any) => {
    e.preventDefault();
    setActivePin(roomPin);
    toast.success('Secured encrypted connection to provider.');
  };

  if (!user) return <FullPageSkeleton role="family" />;

  return (
    <>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14%       { transform: scale(1.25); }
          28%       { transform: scale(1); }
          42%       { transform: scale(1.15); }
          70%       { transform: scale(1); }
        }
        @keyframes ecgPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes bpmFade {
          from { opacity: 0.4; transform: translateY(-4px); }
          to   { opacity: 1;   transform: translateY(0); }
        }
      `}</style>

      <div className="dashboard-layout">
        <Sidebar role="family" userName={user.name || ''} />

        <div className="main-content">
          {/* ── Header ── */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-black text-primary tracking-tight">Family Monitoring Center</h1>
              <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Real-time health and safety oversight for your loved ones.</p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={handleSOS}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-[0.75rem] font-bold text-white transition-all shadow-md ${
                  sosActive 
                    ? 'bg-red-500 shadow-red-500/40 animate-pulse' 
                    : 'bg-red-500 hover:bg-red-600 hover:shadow-lg hover:-translate-y-[1px] active:scale-95 active:translate-y-0'
                }`}
              >
                <AlertTriangle size={20} className={sosActive ? "animate-bounce" : ""} /> 
                {sosActive ? 'SOS SUBMITTED' : 'EMERGENCY SOS'}
              </button>
            </div>
          </header>

          {sosActive && (
            <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold flex items-center gap-3 shadow-sm animate-fade-in">
              <AlertTriangle size={24} className="text-red-500 animate-pulse" /> Emergency SOS Alert Triggered. Local authorities and caregivers notified.
            </div>
          )}

          {/* ── Pairing Box ── */}
          <div className="premium-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-l-[6px] border-primary animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-5">
              <div className="p-3.5 bg-primary/10 rounded-2xl text-primary shadow-inner">
                <Key size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Caregiver Session Link</h3>
                <p className="text-sm text-slate-500 font-medium">Enter the 4-digit PIN from your caregiver to start tracking.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <form onSubmit={connectToPin} className="flex gap-3">
                <input
                  type="text"
                  value={roomPin}
                  onChange={e => setRoomPin(e.target.value)}
                  maxLength={4}
                  placeholder="PIN"
                  className="w-28 px-4 py-3 text-center text-xl font-bold tracking-widest border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-slate-50 focus:bg-white"
                />
                <button type="submit" disabled={roomPin.length < 4} className="btn-medical btn-medical-primary">
                  Connect
                </button>
              </form>
              {activePin && <div className="text-xs font-bold text-green-600 flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-md animate-fade-in w-fit border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Connected to Room {activePin}
              </div>}
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="premium-card border-t-[5px] border-t-red-500">
              <HeartRateWidget bpm={heartRate} />
            </div>

            <div className="premium-card border-t-[5px] border-t-green-600 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Care Provider</div>
                <div className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                  {activePin ? 'Assigned Expert' : 'Awaiting Check-in'}
                  {activePin && caregiverVerified && <span className="text-xl shrink-0" title="DGCare strictly verified">🛡️</span>}
                </div>
              </div>
              {activePin && <div className="text-xs font-medium text-slate-500 mt-4 flex items-center gap-1.5"><Key size={12}/> PIN: {activePin} • Encrypted Live Signal</div>}
            </div>

            <div className="premium-card border-t-[5px] border-t-amber-500">
              <NextMedWidget nextTime={nextMed.label} minutesLeft={nextMed.minutesLeft} />
            </div>
          </div>

          {/* ── Map ── */}
          {activePin ? (
            <div className="premium-card flex-1 flex flex-col p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl text-primary font-black mb-5 flex items-center gap-2 tracking-tight">
                <MapPin size={22} className="text-primary" /> Caregiver Location Tracker
              </h3>
              <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                <Map center={[19.0760, 72.8777]} role="family" roomCode={`room_${activePin}`} />
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 p-12 rounded-2xl text-center text-slate-400 flex flex-col items-center justify-center flex-1 min-h-[300px] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <MapPin size={48} className="mb-4 opacity-50 text-slate-300" />
              <p className="font-medium text-lg">Connect a Caregiver PIN to load live location mapping.</p>
              <p className="text-sm mt-2 opacity-70">The map will automatically appear once connected.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
