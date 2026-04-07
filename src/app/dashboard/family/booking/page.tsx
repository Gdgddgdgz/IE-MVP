'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Star, ShieldCheck, Clock, CalendarDays, StickyNote, Trash2, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import Sidebar from '@/components/Sidebar';
import { FullPageSkeleton } from '@/components/SkeletonLoader';

interface Booking {
  id: number;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  caregiver?: string;
}

interface Caregiver {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  available: boolean;
  initials: string;
  color: string;
}

const MOCK_CAREGIVERS: Caregiver[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    specialty: 'Elder Care & Dementia Support',
    rating: 4.9,
    available: true,
    initials: 'PS',
    color: '#0b4f42',
  },
  {
    id: 2,
    name: 'James Okafor',
    specialty: 'Post-Surgery & Mobility Assist',
    rating: 4.7,
    available: true,
    initials: 'JO',
    color: '#1a7b66',
  },
  {
    id: 3,
    name: 'Maria Santos',
    specialty: 'Pediatric & Chronic Illness Care',
    rating: 5.0,
    available: false,
    initials: 'MS',
    color: '#6b7280',
  },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#fff7ed', color: '#c2410c', label: 'Pending' },
  confirmed: { bg: '#f0fdf4', color: '#15803d', label: 'Confirmed' },
  cancelled: { bg: '#fef2f2', color: '#b91c1c', label: 'Cancelled' },
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <Star key={i} size={14} fill="#f59e0b" stroke="#f59e0b" />;
        if (i === full && partial >= 0.5) return <Star key={i} size={14} fill="#f59e0b" stroke="#f59e0b" style={{ opacity: 0.6 }} />;
        return <Star key={i} size={14} stroke="#d1d5db" fill="none" />;
      })}
      <span style={{ marginLeft: '4px', fontWeight: 'bold', color: '#f59e0b', fontSize: '13px' }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function FamilyBooking() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('Morning Shift (8 AM – 12 PM)');
  const [notes, setNotes] = useState('');
  const [prefillCaregiver, setPrefillCaregiver] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string; name?: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) router.push('/login');
    else setUser(JSON.parse(lsUser));
    loadBookings();
  }, [router]);

  const loadBookings = () => {
    const stored = JSON.parse(localStorage.getItem('dgcare_bookings') || '[]');
    setBookings(stored);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate real network request
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newBooking: Booking = {
      id: Date.now(),
      date,
      time,
      notes,
      status: 'pending',
      caregiver: prefillCaregiver || undefined,
    };
    const current = JSON.parse(localStorage.getItem('dgcare_bookings') || '[]');
    const updated = [...current, newBooking];
    localStorage.setItem('dgcare_bookings', JSON.stringify(updated));
    setBookings(updated);
    
    setIsSubmitting(false);
    toast.success('Your care session has been successfully booked!');
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDate('');
      setTime('Morning Shift (8 AM – 12 PM)');
      setNotes('');
      setPrefillCaregiver('');
    }, 3000);
  };

  const handleCancel = (id: number) => {
    const updated: Booking[] = bookings.map((b) => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    localStorage.setItem('dgcare_bookings', JSON.stringify(updated));
    setBookings(updated);
    toast.error('Booking session cancelled.');
  };

  const handleRequestCaregiver = (cg: Caregiver) => {
    setPrefillCaregiver(cg.name);
    setNotes(`Requesting ${cg.name} – ${cg.specialty}.`);
    document.getElementById('booking-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');

  if (!user) return <FullPageSkeleton role="family" />;

  return (
    <div className="dashboard-layout">
      <Sidebar role="family" userName={user.name || ''} />

      <div className="main-content">
        {/* ── Header ── */}
        <header className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-black text-primary tracking-tight mb-2">
            Caregiver Bookings
          </h1>
          <p className="text-slate-500 font-medium md:text-lg">
            Browse verified providers, request care, and manage your schedule.
          </p>
        </header>

        {/* ── Browse Caregivers ── */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2.5 tracking-tight">
            <Users size={24} className="text-primary" /> Browse Verified Caregivers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_CAREGIVERS.map((cg) => (
              <div
                key={cg.id}
                className={`premium-card flex flex-col gap-5 border border-slate-100 ${cg.available ? 'hover:border-primary/20 hover:ring-4 hover:ring-primary/5 cursor-pointer' : 'opacity-70 grayscale-[30%]'}`}
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full text-white flex items-center justify-center font-black text-lg shadow-inner shrink-0" style={{ backgroundColor: cg.color }}>
                    {cg.initials}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-bold text-lg text-slate-900 truncate">{cg.name}</div>
                    <div className="text-sm font-medium text-slate-500 truncate mt-0.5">{cg.specialty}</div>
                  </div>
                </div>

                {/* Rating + Badge */}
                <div className="flex items-center justify-between">
                  <StarRating rating={cg.rating} />
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${cg.available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {cg.available ? <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400"/>}
                    {cg.available ? 'Available' : 'Busy'}
                  </span>
                </div>

                {/* Verified badge */}
                <div className="flex items-center gap-2 text-sm text-green-700 font-bold bg-green-50/50 p-2.5 rounded-lg border border-green-100/50">
                  <ShieldCheck size={16} /> DGCare Background Verified
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleRequestCaregiver(cg)}
                  disabled={!cg.available}
                  className={`mt-1 py-3 px-4 font-bold rounded-xl transition-all shadow-sm w-full outline-none focus:ring-4 ${
                    cg.available 
                      ? 'bg-primary text-white hover:bg-primary-container hover:shadow-md focus:ring-primary/20 active:scale-[0.98]' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200'
                  }`}
                >
                  {cg.available ? 'Request This Caregiver' : 'Currently Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── New Booking Form ── */}
        <section id="booking-form-section" className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2.5 tracking-tight">
            <CalendarDays size={24} className="text-primary" /> Schedule a Caregiver
          </h2>
          <div className="premium-card max-w-2xl border-t-[6px] border-t-primary">
            {submitted ? (
              <div className="text-center py-12 flex flex-col items-center justify-center gap-4 animate-fade-in">
                <div className="text-green-500 bg-green-50 p-4 rounded-full">
                  <CheckCircle size={56} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Booking Request Sent!</h3>
                  <p className="text-slate-500 font-medium">The caregiver will be notified immediately. They will confirm the shift shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {prefillCaregiver && (
                  <div className="px-5 py-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-green-800 font-bold shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className="text-green-600" />
                      Requesting specifically: <span className="text-green-900 text-lg">{prefillCaregiver}</span>
                    </div>
                    <button type="button" onClick={() => { setPrefillCaregiver(''); setNotes(''); }} className="text-green-600 hover:text-green-900 hover:bg-green-200/50 p-2 rounded-lg transition-colors cursor-pointer">
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <CalendarDays size={16} className="text-slate-400" /> Requested Date
                    </label>
                    <input 
                      required type="date" min={new Date().toISOString().split('T')[0]} value={date} onChange={e => setDate(e.target.value)} 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <Clock size={16} className="text-slate-400" /> Preferred Shift Timing
                    </label>
                    <select
                      required value={time} onChange={e => setTime(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer"
                    >
                      <option value="Morning Shift (8 AM – 12 PM)">🌅 Morning Shift (8 AM – 12 PM)</option>
                      <option value="Afternoon Shift (12 PM – 4 PM)">☀️ Afternoon Shift (12 PM – 4 PM)</option>
                      <option value="Evening Shift (4 PM – 8 PM)">🌆 Evening Shift (4 PM – 8 PM)</option>
                      <option value="Night Shift (8 PM – 8 AM)">🌙 Night Shift (8 PM – 8 AM)</option>
                      <option value="Full Day (8 AM – 8 PM)">📅 Full Day (8 AM – 8 PM)</option>
                      <option value="24-Hour Care">🏥 24-Hour Care</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <StickyNote size={16} className="text-slate-400" /> Special Care Instructions <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <textarea 
                    value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g. Please ensure 2pm medication is given after lunch..." 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-y min-h-[100px]" 
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full btn-medical btn-medical-primary flex items-center justify-center gap-2 mt-2">
                  {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Processing Secure Payload...</> : 'Submit Booking Request'}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── My Bookings ── */}
        <section className="pb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2.5 tracking-tight">
            <Clock size={24} className="text-primary" /> My Requested Bookings
            {bookings.length > 0 && (
              <span className="text-xs ml-2 bg-primary/10 text-primary px-3 py-1 rounded-full font-bold shadow-sm">
                {activeBookings.length} Active Sessions
              </span>
            )}
          </h2>

          {bookings.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 p-16 rounded-2xl text-center text-slate-400 flex flex-col items-center justify-center min-h-[250px]">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex flex-col items-center justify-center mb-4">
                 <CalendarDays size={40} className="opacity-50 text-slate-400" />
              </div>
              <p className="font-medium text-lg text-slate-600 tracking-tight">No active care requests found.</p>
              <p className="text-sm mt-1 opacity-80">Submit a form above to schedule a DGCare professional.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-4xl">
              {[...bookings].reverse().map((booking) => {
                const s = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
                return (
                  <div
                    key={booking.id}
                    className={`premium-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-100 ${booking.status === 'cancelled' ? 'opacity-60 bg-slate-50 shadow-none hover:shadow-none' : ''}`}
                  >
                    <div className="flex flex-col gap-2.5 flex-1 w-full">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-black text-lg text-slate-900 tracking-tight">
                          {booking.caregiver || 'Any Available Caregiver'}
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full border shadow-sm" style={{ backgroundColor: s.bg, color: s.color, borderColor: `${s.color}30` }}>
                          {s.label.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-1 font-medium text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        <span className="flex items-center gap-2"><CalendarDays size={16} className="text-primary" /> {booking.date}</span>
                        <span className="flex items-center gap-2"><Clock size={16} className="text-amber-500" /> {booking.time}</span>
                      </div>
                      
                      {booking.notes && (
                        <div className="text-sm font-medium text-slate-500 flex items-start gap-2 mt-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 italic">
                          <StickyNote size={16} className="text-blue-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">"{booking.notes}"</span>
                        </div>
                      )}
                    </div>

                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        title="Cancel booking session"
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-red-600 hover:text-white border border-red-200 hover:bg-red-500 hover:border-red-500 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md shrink-0 w-full sm:w-auto mt-2 sm:mt-0 active:scale-95 group"
                      >
                        <Trash2 size={16} className="mt-[-1px] transition-colors group-hover:text-white" /> Cancel Booking
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
