'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Star, ShieldCheck, Clock, CalendarDays, StickyNote, Trash2, Users } from 'lucide-react';
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
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [prefillCaregiver, setPrefillCaregiver] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

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

  const handleSubmit = (e: any) => {
    e.preventDefault();
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
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDate('');
      setTime('');
      setNotes('');
      setPrefillCaregiver('');
    }, 3000);
  };

  const handleCancel = (id: number) => {
    const updated: Booking[] = bookings.filter((b) => b.id !== id);
    localStorage.setItem('dgcare_bookings', JSON.stringify(updated));
    setBookings(updated);
  };

  const handleRequestCaregiver = (cg: Caregiver) => {
    setPrefillCaregiver(cg.name);
    setNotes(`Requesting ${cg.name} – ${cg.specialty}.`);
    document.getElementById('booking-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeBookings = bookings;
  const cancelledBookings = [];

  if (!user) return <FullPageSkeleton role="family" />;

  return (
    <div className="dashboard-layout">
      <Sidebar role="family" userName={user.name || ''} />

      <div className="main-content">
        {/* ── Header ── */}
        <header>
          <h1 style={{ fontSize: '32px', color: 'var(--primary-green)', fontWeight: 'bold' }}>
            Caregiver Bookings
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            Browse verified providers, request care, and manage your schedule.
          </p>
        </header>

        {/* ── Browse Caregivers ── */}
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={22} color="var(--primary-green)" /> Browse Verified Caregivers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {MOCK_CAREGIVERS.map((cg) => (
              <div
                key={cg.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: cg.available ? 1 : 0.75,
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { if (cg.available) (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(11,79,66,0.15)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
              >
                {/* Avatar + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: cg.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 }}>
                    {cg.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-dark)' }}>{cg.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>{cg.specialty}</div>
                  </div>
                </div>

                {/* Rating + Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <StarRating rating={cg.rating} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '3px 10px',
                    borderRadius: '99px',
                    backgroundColor: cg.available ? '#f0fdf4' : '#f3f4f6',
                    color: cg.available ? '#15803d' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    {cg.available ? '● Available' : '○ Unavailable'}
                  </span>
                </div>

                {/* Verified badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-green)', fontWeight: '600' }}>
                  <ShieldCheck size={14} /> DGCare Background Verified
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleRequestCaregiver(cg)}
                  disabled={!cg.available}
                  style={{
                    marginTop: '4px',
                    padding: '10px',
                    backgroundColor: cg.available ? 'var(--primary-green)' : 'var(--border-light)',
                    color: cg.available ? 'white' : 'var(--text-light)',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: cg.available ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    transition: 'background 0.2s',
                  }}
                >
                  {cg.available ? 'Request This Caregiver' : 'Currently Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── New Booking Form ── */}
        <section id="booking-form-section">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarDays size={22} color="var(--primary-green)" /> Schedule a Caregiver
          </h2>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: '600px', border: '1px solid var(--border-light)' }}>
            {submitted ? (
              <div style={{ color: 'var(--primary-green)', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', padding: '20px 0' }}>
                <CheckCircle size={52} style={{ margin: '0 auto 16px', display: 'block' }} />
                Booking Request Sent Successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {prefillCaregiver && (
                  <div style={{ padding: '12px 16px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', fontSize: '14px', color: '#166534', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} /> Requesting: {prefillCaregiver}
                    <button type="button" onClick={() => { setPrefillCaregiver(''); setNotes(''); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px' }}>×</button>
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dark)', fontWeight: '600', fontSize: '14px' }}>
                    <CalendarDays size={14} style={{ display: 'inline', marginRight: '6px' }} />Requested Date
                  </label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid var(--border-light)', fontSize: '15px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dark)', fontWeight: '600', fontSize: '14px' }}>
                    <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />Requested Time Range
                  </label>
                  <input required type="text" placeholder="e.g. 10:00 AM – 2:00 PM" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid var(--border-light)', fontSize: '15px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dark)', fontWeight: '600', fontSize: '14px' }}>
                    <StickyNote size={14} style={{ display: 'inline', marginRight: '6px' }} />Special Instructions
                  </label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g. Please ensure 2pm medication is given..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid var(--border-light)', fontSize: '15px', resize: 'vertical', outline: 'none' }} />
                </div>
                <button type="submit" style={{ padding: '14px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  Submit Booking Request
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── My Bookings ── */}
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={22} color="var(--primary-green)" /> My Bookings
            {bookings.length > 0 && (
              <span style={{ fontSize: '13px', backgroundColor: 'var(--secondary-mint)', color: 'var(--primary-green)', padding: '2px 10px', borderRadius: '99px', fontWeight: '600' }}>
                {activeBookings.length} active
              </span>
            )}
          </h2>

          {bookings.length === 0 ? (
            <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '14px', border: '2px dashed var(--border-light)', textAlign: 'center', color: 'var(--text-light)' }}>
              <CalendarDays size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>No bookings yet. Submit a request above to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[...bookings].reverse().map((booking) => {
                const s = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
                return (
                  <div
                    key={booking.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '16px',
                      opacity: booking.status === 'cancelled' ? 0.6 : 1,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-dark)', fontSize: '16px' }}>
                          {booking.caregiver || 'Any Available Caregiver'}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '99px', backgroundColor: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-light)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CalendarDays size={13} /> {booking.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> {booking.time}
                        </span>
                      </div>
                      {booking.notes && (
                        <div style={{ fontSize: '13px', color: 'var(--text-light)', display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '2px' }}>
                          <StickyNote size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{booking.notes}</span>
                        </div>
                      )}
                    </div>

                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        title="Cancel booking"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', flexShrink: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                      >
                        <Trash2 size={14} /> Cancel
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
