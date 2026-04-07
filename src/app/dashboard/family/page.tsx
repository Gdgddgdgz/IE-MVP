// FIXED
'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertTriangle, Key, MapPin, HeartPulse, Pill, Clock } from 'lucide-react';
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
  const socketRef = useRef<any>(null);

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
      alert(`URGENT: SOS Alert from Caregiver in room ${activePin}!`);
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
    } else {
      alert('Must be paired to a Caregiver PIN to send Emergency Alerts to them.');
    }
  };

  const connectToPin = (e: any) => {
    e.preventDefault();
    setActivePin(roomPin);
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
          <header className="header-flex">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-primary tracking-tight">Family Monitoring Center</h1>
              <p className="text-secondary font-medium">Real-time health and safety oversight for your loved ones.</p>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={handleSOS}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: sosActive ? '0 0 20px rgba(239,68,68,0.6)' : 'none',
                  animation: sosActive ? 'heartbeat 0.8s ease-in-out infinite' : 'none',
                }}
              >
                <AlertTriangle size={20} /> {sosActive ? 'SOS SENT' : 'SEND EMERGENCY'}
              </button>
            </div>
          </header>

          {/* ── SOS Banner ── */}
          {sosActive && (
            <div style={{ padding: '20px', backgroundColor: '#fef2f2', border: '2px solid #ef4444', borderRadius: '8px', color: '#b91c1c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={24} /> Emergency SOS Alert Triggered.
            </div>
          )}

          {/* ── Pairing Box ── */}
          <div className="premium-card flex items-center justify-between gap-6 mb-8 border-l-4 border-primary">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Key size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Caregiver Session Link</h3>
                <p className="text-sm text-slate-500">Enter the 4-digit PIN from your caregiver to start tracking.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <form onSubmit={connectToPin} className="flex gap-3">
                <input
                  type="text"
                  value={roomPin}
                  onChange={e => setRoomPin(e.target.value)}
                  maxLength={4}
                  placeholder="PIN"
                  className="w-24 px-4 py-2 text-center text-xl font-bold tracking-widest border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                />
                <button type="submit" disabled={roomPin.length < 4} className="px-6 py-2 bg-primary text-white font-bold rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-primary-container transition-all">
                  Connect
                </button>
              </form>
              {activePin && <div className="text-xs font-bold text-accent-green flex items-center gap-1">🟢 Connected to Room {activePin}</div>}
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="premium-card border-t-4 border-error">
              <HeartRateWidget bpm={heartRate} />
            </div>

            <div className="premium-card border-t-4 border-accent-green">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Active Care Provider</div>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                {activePin ? 'Assigned Expert' : 'Awaiting Check-in'}
                {activePin && caregiverVerified && <span className="text-lg" title="DGCare strictly verified">🛡️</span>}
              </div>
              {activePin && <div className="text-xs font-medium text-slate-500 mt-2">PIN: {activePin} • Encrypted live signal</div>}
            </div>

            <div className="premium-card border-t-4 border-secondary">
              <NextMedWidget nextTime={nextMed.label} minutesLeft={nextMed.minutesLeft} />
            </div>
          </div>

          {/* ── Map ── */}
          {activePin ? (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--primary-green)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                <MapPin size={24} /> Caregiver Location Tracker
              </h3>
              <div className="map-container">
                <Map center={[19.0760, 72.8777]} role="family" roomCode={`room_${activePin}`} />
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', border: '2px dashed var(--border-light)', padding: '40px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <p>Connect a Caregiver PIN to load location mapping.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
