// FIXED
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Check, X, CalendarX } from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { FullPageSkeleton } from '@/components/SkeletonLoader';

export default function Schedule() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<{ email: string, role: string, name?: string } | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  
  useEffect(() => {
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) router.push('/login');
    else setUser(JSON.parse(lsUser));
    
    setBookings(JSON.parse(localStorage.getItem('dgcare_bookings') || '[]'));
    if(localStorage.getItem('caregiver_verified') === 'true') setIsVerified(true);
  }, [router]);

  const handleAction = (id: number, status: string) => {
      const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
      setBookings(updated);
      localStorage.setItem('dgcare_bookings', JSON.stringify(updated));
  };
  
  if (!user) return <FullPageSkeleton role="caregiver" />;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar role="caregiver" userName={user.name || ''} isVerified={isVerified} />
      
      {/* Content */}
      <div className="main-content">
          <header className="mb-10 animate-fade-in-up">
             <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Booking Inbox</h1>
             <p className="text-slate-500 font-medium md:text-lg">Review and Accept shift requests from Families confidently.</p>
          </header>
          
          <div className="flex flex-col gap-5 max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {bookings.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-200 p-16 rounded-2xl text-center text-slate-400 flex flex-col items-center justify-center min-h-[350px]">
                      <div className="w-20 h-20 rounded-full bg-slate-50 flex flex-col items-center justify-center mb-6">
                         <CalendarX size={44} className="opacity-50 text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No Pending Requests</h3>
                      <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">You don't have any booking requests at the moment. Families will see you on their dashboard once you've successfully verified your ID.</p>
                      <Link href="/dashboard/caregiver" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all shadow-md hover:shadow-lg active:scale-95">
                          Return to Shift Control
                      </Link>
                  </div>
              ) : (
                  bookings.map((booking: any) => (
                      <div 
                        key={booking.id} 
                        className={`premium-card flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-100 ${
                            booking.status === 'accepted' ? 'border-l-[6px] border-l-green-500' :
                            booking.status === 'declined' ? 'border-l-[6px] border-l-red-500 opacity-60 shadow-none' :
                            'border-l-[6px] border-l-amber-500'
                        }`}
                      >
                          <div className="flex-1">
                              <div className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                  <span>Date requested: {booking.date}</span>
                                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                      booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                      booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                      'bg-red-100 text-red-800'
                                  }`}>
                                      {booking.status.toUpperCase()}
                                  </span>
                              </div>
                              <div className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                                  <Clock size={16} className="text-slate-400" /> Time Range: {booking.time}
                              </div>
                              {booking.notes && (
                                  <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 text-slate-600 font-medium text-sm italic border-l-[3px] border-l-blue-400">
                                      "{booking.notes}"
                                  </div>
                              )}
                          </div>
                          {booking.status === 'pending' && (
                              <div className="flex gap-4 shrink-0 mt-4 md:mt-0 pt-4 border-t border-slate-100 md:border-transparent md:pt-0">
                                  <button onClick={() => {
                                      if(!isVerified) { 
                                          // Note: production app would use toast
                                          alert("Only Verified providers can accept shifts. Please verify your ID on the Shift Control dashboard."); 
                                          return; 
                                      }
                                      handleAction(booking.id, 'accepted');
                                  }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white border-2 border-green-500 hover:bg-green-600 hover:border-green-600 rounded-xl font-bold transition-all shadow-md shadow-green-500/20 active:scale-95 group">
                                      <Check size={20} className="transition-transform group-hover:scale-110" /> Accept
                                  </button>
                                  <button onClick={() => handleAction(booking.id, 'declined')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 rounded-xl font-bold transition-all active:scale-95 group">
                                      <X size={20} className="transition-transform group-hover:rotate-90" /> Decline
                                  </button>
                              </div>
                          )}
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
}
