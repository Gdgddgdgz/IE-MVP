'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { FullPageSkeleton } from '@/components/SkeletonLoader';
import Link from 'next/link';

interface Booking {
  id: number;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  caregiver?: string;
}

const MOCK_CAREGIVERS = [
  { id: 1, name: 'Priya Sharma (GNM Specialist)' },
  { id: 2, name: 'James Okafor (Physiotherapy Aide)' },
  { id: 3, name: 'Dr. Sneha Desai (Clinical Curator)' },
];

export default function FamilyBookingCalendar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [date, setDate] = useState('2024-11-18');
  const [time, setTime] = useState('09:30');
  const [caregiver, setCaregiver] = useState(MOCK_CAREGIVERS[0].name);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(lsUser));
    }
    loadBookings();
  }, [router]);

  const loadBookings = () => {
    const stored = JSON.parse(localStorage.getItem('dgcare_bookings') || '[]');
    setBookings(stored);
  };

  const handleLogout = () => {
    localStorage.removeItem('dgcare_user');
    localStorage.removeItem('dgcare_bookings');
    localStorage.removeItem('caregiver_verified');
    router.push('/login');
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: Date.now(),
      date,
      time,
      notes,
      status: 'pending',
      caregiver,
    };
    const current = JSON.parse(localStorage.getItem('dgcare_bookings') || '[]');
    const updated = [...current, newBooking];
    localStorage.setItem('dgcare_bookings', JSON.stringify(updated));
    setBookings(updated);
    setIsModalOpen(false);
    setDate('2024-11-18');
    setTime('09:30');
    setNotes('');
  };

  if (!user) return <FullPageSkeleton role="family" />;

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="bg-surface font-body text-on-surface flex min-h-screen antialiased">
        
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col p-6 gap-y-4 h-screen w-64 bg-slate-50 sticky top-0 border-r border-outline-variant/30 z-40 transition-transform duration-300">
          <div className="mb-8 px-2 flex justify-between items-center">
            <Link href="/">
              <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto mb-1" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">Family Portal</p>
            </Link>
          </div>
          <nav className="flex-1 space-y-2">
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-transform duration-300 hover:translate-x-1 font-semibold" href="/dashboard/family">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>monitoring</span>
              <span>Monitoring Center</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl shadow-sm transition-transform duration-300 hover:translate-x-1 font-bold" href="/dashboard/family/booking">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
              <span>Bookings</span>
            </Link>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-transform duration-300 hover:translate-x-1 font-semibold" href="#">
              <span className="material-symbols-outlined">person_search</span>
              <span>Caregivers</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl transition-transform duration-300 hover:translate-x-1 relative font-semibold" href="#">
              <span className="material-symbols-outlined">chat</span>
              <span>Messages</span>
              <span className="absolute right-4 w-2 h-2 bg-primary rounded-full"></span>
            </a>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-transform duration-300 hover:translate-x-1 w-full text-left">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-200">
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-full font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              New Booking
            </button>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-2 border-b border-surface-container-high">
            <div>
              <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">Schedule Overview</h2>
              <p className="text-on-surface-variant font-body text-lg">Manage clinical sessions and patient consultations.</p>
            </div>
            <div className="flex items-center bg-surface-container-lowest rounded-full p-1.5 shadow-sm border border-slate-200">
              <button className="px-6 py-2 rounded-full bg-white text-primary font-bold text-sm shadow-sm transition-all">Monthly</button>
              <button className="px-6 py-2 rounded-full text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all">Weekly</button>
            </div>
          </header>

          {/* Calendar Grid Layout (Bento-style Asymmetry) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Calendar Interface */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline text-2xl font-bold tracking-tight">November 2024</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
              </div>

              {/* Calendar Weekdays */}
              <div className="grid grid-cols-7 mb-4 border-b border-slate-100 pb-4">
                <div className="text-center font-bold text-xs uppercase tracking-widest text-slate-400">Mon</div>
                <div className="text-center font-bold text-xs uppercase tracking-widest text-slate-400">Tue</div>
                <div className="text-center font-bold text-xs uppercase tracking-widest text-slate-400">Wed</div>
                <div className="text-center font-bold text-xs uppercase tracking-widest text-slate-400">Thu</div>
                <div className="text-center font-bold text-xs uppercase tracking-widest text-slate-400">Fri</div>
                <div className="text-center font-bold text-xs uppercase tracking-widest text-primary">Sat</div>
                <div className="text-center font-bold text-xs uppercase tracking-widest text-primary">Sun</div>
              </div>

              {/* Days Grid (Mocked elegantly for MVP) */}
              <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {/* Week 1 */}
                <div className="h-28 md:h-32 p-2 md:p-3 bg-slate-50 opacity-40 text-sm font-semibold">28</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-slate-50 opacity-40 text-sm font-semibold">29</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-slate-50 opacity-40 text-sm font-semibold">30</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-slate-50 opacity-40 text-sm font-semibold">31</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
                  <span>1</span>
                  <div className="mt-2 p-1.5 bg-primary/10 border border-primary/20 text-[10px] text-primary rounded-lg font-bold truncate">Confirmed S.</div>
                </div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-teal-50/50 text-sm font-bold text-primary">2</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-teal-50/50 text-sm font-bold text-primary">3</div>
                
                {/* Week 2 */}
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">4</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
                  <span>5</span>
                  <div className="mt-2 p-1.5 bg-amber-50 border border-amber-200 text-[10px] text-amber-700 rounded-lg font-bold truncate">Check-up</div>
                </div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-primary-container/10 border-2 border-primary/40 rounded-xl relative text-sm font-black shadow-inner">
                  <span className="text-primary">6</span>
                  <div className="mt-2 p-1.5 bg-primary text-[10px] text-white rounded-lg font-bold shadow-md shadow-primary/30 uppercase tracking-widest text-center truncate">Today</div>
                </div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">7</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
                  <span>8</span>
                  <div className="mt-2 p-1.5 bg-slate-100 text-slate-600 text-[10px] rounded-lg font-bold truncate">Pending (3)</div>
                </div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-teal-50/50 text-sm font-bold text-primary">9</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-teal-50/50 text-sm font-bold text-primary">10</div>

                {/* Week 3 */}
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">11</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">12</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">13</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">14</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-white text-sm font-semibold hover:bg-slate-50 cursor-pointer transition-colors">15</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-teal-50/50 text-sm font-bold text-primary">16</div>
                <div className="h-28 md:h-32 p-2 md:p-3 bg-teal-50/50 text-sm font-bold text-primary">17</div>
              </div>
            </div>

            {/* Side Interaction Rail */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Quick Booking Card */}
              <div className="bg-primary text-white rounded-[2rem] p-8 shadow-2xl shadow-primary/30 relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="font-headline text-2xl font-extrabold mb-2 tracking-tight">Book Appointment</h4>
                  <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed">Instantly schedule a secure clinical session with available verified specialists.</p>
                  <button onClick={() => setIsModalOpen(true)} className="w-full bg-white text-primary py-4 rounded-xl font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-center uppercase tracking-widest">
                    Open Schedule Form
                  </button>
                </div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>

              {/* Status Indicators / Upcoming */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex-1">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <h4 className="font-headline text-xl font-bold tracking-tight">Upcoming Active</h4>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest cursor-pointer hover:underline">View History</span>
                </div>
                
                <div className="space-y-6">
                  {/* Dynamic Bookings Array */}
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-start gap-4">
                      <div className={`w-1.5 h-16 rounded-full self-stretch ${booking.status === 'confirmed' ? 'bg-primary' : 'bg-amber-400'}`}></div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">{booking.caregiver || 'Session Request'}</p>
                        <p className="text-xs text-slate-500 font-medium my-1">{booking.date} • {booking.time}</p>
                        <div className="flex justify-between items-center mt-2">
                           <span className={`px-2 py-1 text-[10px] rounded-md font-bold uppercase tracking-widest
                             ${booking.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-primary/10 text-primary border border-primary/20'}
                           `}>
                             {booking.status}
                           </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <p className="text-sm text-slate-400 italic">No dynamic bookings created yet.</p>
                  )}

                  {/* Mock Confirmed Item (From HTML design) */}
                  <div className="flex items-start gap-4 opacity-70">
                    <div className="w-1.5 h-16 bg-primary rounded-full self-stretch"></div>
                    <div>
                      <p className="font-bold text-slate-800">Post-Op Clinical Review</p>
                      <p className="text-xs text-slate-500 font-medium my-1">Nov 15 • 02:30 PM</p>
                      <span className="px-2 py-1 mt-2 inline-block bg-primary/10 text-primary text-[10px] rounded-md font-bold uppercase tracking-widest border border-primary/20">Confirmed</span>
                    </div>
                  </div>

                  {/* Avatar Stack for Specialists */}
                  <div className="pt-8 mt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Available Specialists Online</p>
                    <div className="flex -space-x-3">
                      <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpLwJRjLXKXILhZT3sUtYkMLmtSetBIGqD6Zj0QEUCkQHaBbJGzF6Ud4DIa_fGs-LRJd7xlYUT0HkIcFp8isj5FLm9LFUGqN7OQLrULPp79pTld0wItSnRvOCtE3IyajsVB_AT7X_gTnc9QAi4neLuFYUqm9XSRqMQ_Ey_ATE2KvFfembv8HXXAiiUFgN5-IAcLZNstflEJuwnnPFET3gtZhySGLjDSmgMLvmGILN-bhtQwaeFM_xfI6tV1eLcuw55LhKdJi65Ttc" alt="Caregiver" />
                      <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPUq6yC9hc3chANxSgBKKi2RsD1fmay4DfYWgF5jMOFljc_VvuQ9W5Ay_t-Jt66ZDRac4sV-Vbfs64aCxPHDgb8TF8WSF7FSPaBB-IZ0UjSx-IjXdA7OahdtUiXr9hvigQOjGOhjoQlyZajdxln550FP2_syjxmQre3GaD_YwuignPGPJ5Q4o7CeXG-MNceapp9QoiLOnfsrNsN9LcgGe0-GM3Rv60zBsnaJNi4fggguNy7nY65mP5glxHyO43z9ab_9-iZdXkLD0" alt="Caregiver" />
                      <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">+12</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Booking Modal (State Controlled) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={(e) => { if(e.target === e.currentTarget) setIsModalOpen(false)}}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="p-8 lg:p-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-headline text-3xl font-extrabold tracking-tight text-slate-900">Schedule Session</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">Select time and clinical parameters</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Preferred Date</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="material-symbols-outlined text-primary">calendar_month</span>
                      <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="bg-transparent border-none p-0 focus:ring-0 w-full font-bold text-sm text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Time Slot</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="material-symbols-outlined text-primary">schedule</span>
                      <input type="time" required value={time} onChange={e => setTime(e.target.value)} className="bg-transparent border-none p-0 focus:ring-0 w-full font-bold text-sm text-slate-800" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Caregiver Specialist</label>
                  <select required value={caregiver} onChange={e => setCaregiver(e.target.value)} className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none">
                    {MOCK_CAREGIVERS.map(cg => (
                      <option key={cg.id} value={cg.name}>{cg.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Clinical Notes</label>
                  <textarea 
                    value={notes} onChange={e => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none text-slate-800" 
                    placeholder="Enter session objectives or patient history for the caregiver..."
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 text-slate-600 font-bold text-sm bg-slate-100 rounded-full hover:bg-slate-200 transition-colors uppercase tracking-widest" type="button">
                    Cancel
                  </button>
                  <button className="flex-[2] px-8 py-4 bg-primary text-white font-bold text-sm rounded-full shadow-lg shadow-primary/30 hover:bg-primary-container hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest" type="submit">
                    Confirm Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl px-6 py-4 flex justify-between items-center z-50 border-t border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <Link className="flex flex-col items-center gap-1.5 text-slate-400" href="/dashboard/family">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 0" }}>monitoring</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </Link>
        <Link className="flex flex-col items-center gap-1.5 text-primary" href="/dashboard/family/booking">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Schedule</span>
        </Link>
        <button onClick={() => setIsModalOpen(true)} className="w-14 h-14 bg-primary rounded-full flex items-center justify-center -mt-8 shadow-xl shadow-teal-900/30 text-white transform hover:scale-105 active:scale-95 transition-all border-4 border-white">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
        <a className="flex flex-col items-center gap-1.5 text-slate-400" href="#">
          <span className="material-symbols-outlined text-[28px]">chat</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Chat</span>
        </a>
      </nav>
    </>
  );
}
