'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AlertTriangle, FileCheck, Clock3, LogOut } from 'lucide-react';
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
    socketRef.current.on('sos_alert', (data: any) => {
      setSosActive(true);
      alert(`URGENT: SOS Alert Received from Family in room ${myPin}!`);
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

  const handleLogout = () => {
    localStorage.removeItem('dgcare_user');
    localStorage.removeItem('dgcare_bookings');
    localStorage.removeItem('caregiver_verified');
    router.push('/login');
  };

  if (!user) return <FullPageSkeleton role="caregiver" />;

  return (
    <div className="flex min-h-screen bg-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed antialiased text-on-surface">
      
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col p-6 gap-y-4 bg-slate-50 border-r border-outline-variant/30 h-screen w-64 fixed left-0 top-0 z-40 transition-transform duration-300">
        <div className="mb-8">
          <Link href="/">
            <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto mb-1" />
            <p className="font-['Inter'] text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Provider Portal</p>
          </Link>
        </div>
        <nav className="flex flex-col gap-y-2">
          <a className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl shadow-sm font-['Inter'] text-sm font-bold transition-transform duration-300" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span>Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl font-['Inter'] text-sm font-semibold transition-transform duration-300 hover:translate-x-1" href="#shift">
            <span className="material-symbols-outlined">satellite_alt</span>
            <span>Active Shift</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl font-['Inter'] text-sm font-semibold transition-transform duration-300 hover:translate-x-1" href="#">
            <span className="material-symbols-outlined">event_available</span>
            <span>Schedule</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-xl font-['Inter'] text-sm font-semibold transition-transform duration-300 hover:translate-x-1" href="#">
            <span className="material-symbols-outlined">chat</span>
            <span>Messages</span>
          </a>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 rounded-xl font-['Inter'] text-sm font-semibold transition-transform duration-300 hover:translate-x-1 w-full text-left">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
        <div className="mt-auto pt-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0">
              {user.name ? user.name[0] : 'P'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-900">{user.name || 'Priya Sharma'}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">{isVerified ? "Verified Provider" : "Pending Verification"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-8 xl:p-12 min-h-screen bg-surface">
        
        {/* Header Section */}
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tighter">Shift Control Center</h2>
            <p className="text-on-surface-variant font-body mt-2 text-lg">Welcome back, {user.name || 'Priya'}. You have 2 pending requests today.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* SOS Button */}
            <button onClick={handleSOS} title="Emergency Broadcast" className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold bg-error text-white transition-all shadow-lg ${sosActive ? 'animate-pulse shadow-error/50 scale-105' : 'shadow-error/20 hover:scale-105'}`}>
              <AlertTriangle size={18} /> {sosActive ? 'SOS SUBMITTED' : 'SEND ALERT'}
            </button>
            {/* Verification Badge */}
            {isVerified && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-3 bg-tertiary-container text-on-tertiary-container rounded-full shadow-sm">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-xs font-bold uppercase tracking-widest">Verified!</span>
              </div>
            )}
            {/* Notification Bell */}
            <button className="p-3 bg-surface-container-lowest rounded-full shadow-xl shadow-slate-200/50 relative hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
          </div>
        </header>

        {sosActive && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-700 font-bold flex items-center gap-3 shadow-md">
            <AlertTriangle size={24} /> Emergency SOS Alert Triggered. Family notified and authorities on standby.
          </div>
        )}

        {/* Identity Verification Workflows */}
        {!isVerified && !verificationPending && (
           <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 bg-yellow-50 border border-yellow-200 p-8 rounded-[1.5rem] shadow-sm transform transition-all hover:shadow-md">
               <div>
                   <h3 className="text-xl font-bold text-yellow-900 flex items-center gap-2 font-headline mb-2">
                       <FileCheck size={24} /> Identity Verification Required
                   </h3>
                   <p className="text-sm text-yellow-800">DGCare strictly requires all providers in India to pass complete KYC and background checks before your profile goes live or families can book you.</p>
               </div>
               <button onClick={handleVerify} disabled={verifying} className="whitespace-nowrap px-8 py-4 bg-yellow-600 text-white font-bold rounded-full hover:bg-yellow-700 disabled:bg-yellow-300 transition-all shadow-md active:scale-95">
                   {verifying ? 'Submitting secure payload...' : 'Submit ID Documents'}
               </button>
           </div>
        )}

        {!isVerified && verificationPending && (
           <div className="mb-10 bg-[#fffbeb] border-2 border-[#f59e0b] p-6 lg:p-8 rounded-[1.5rem] flex items-center gap-6 shadow-sm">
               <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0">
                   <Clock3 size={24} color="#f59e0b" />
               </div>
               <div className="flex-1">
                   <div className="font-bold text-[#92400e] text-lg mb-1 flex items-center gap-2 font-headline">
                       ⚠️ Verification In Process
                   </div>
                   <p className="text-[#b45309] text-sm">Your documents have been securely received. Our clinical panel in Mumbai is reviewing your credentials. You will be notified within 24 hours.</p>
               </div>
               <span className="hidden sm:inline-block px-4 py-1.5 bg-[#fef3c7] rounded-full text-[#92400e] font-bold text-xs border border-[#f59e0b] uppercase tracking-widest shrink-0 shadow-sm">PENDING</span>
           </div>
        )}

        {/* Core Shift Broadcasting Feature (Map) */}
        <section className="mb-10" id="shift">
          <div className={`p-8 lg:p-10 rounded-[2rem] flex items-start justify-between gap-8 transition-all duration-700 shadow-xl border-t-8 ${broadcasting ? 'border-primary bg-white shadow-primary/10' : 'border-slate-300 bg-surface-container-lowest shadow-slate-200/50'}`}>
            <div className="w-full flex flex-col gap-6">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <h3 className={`font-headline text-3xl font-extrabold mb-2 tracking-tight flex items-center gap-3 ${broadcasting ? 'text-primary' : 'text-slate-400'}`}>
                    {broadcasting ? '🟢 Broadcasting Live Location' : '⚪ Shift Offline'}
                  </h3>
                  <p className="text-on-surface-variant max-w-xl text-lg">
                    When starting a shift, provide this unique 4-digit PIN to the paired family member. They will use it to access your live geolocation map.
                  </p>
                  <div className={`text-6xl font-black tracking-[0.25em] mt-6 font-mono ${broadcasting ? 'text-teal-900 drop-shadow-sm' : 'text-slate-200'}`}>
                    {myPin}
                  </div>
                </div>
                
                <button onClick={() => {
                      if(!isVerified && localStorage.getItem('caregiver_verified') !== 'true') { 
                          alert("You must be Verified to start a live shift! Please complete the KYC process."); 
                          return; 
                      }
                      setBroadcasting(!broadcasting);
                  }} 
                  className={`shrink-0 px-12 py-6 rounded-full font-black text-xl transition-all shadow-2xl active:scale-95 whitespace-nowrap ${broadcasting ? 'bg-error text-white hover:bg-error/90 shadow-error/30' : 'bg-primary text-white hover:bg-primary-container shadow-primary/30'}`}
                >
                    {broadcasting ? 'End Duty Shift' : 'Go Online Now'}
                </button>
              </div>

              {/* Dynamic Map Integration */}
              <div className={`w-full mt-6 rounded-[1.5rem] overflow-hidden border-4 transition-all duration-700 ${broadcasting ? 'border-primary-fixed/50 h-[450px]' : 'border-slate-100 h-24'}`}>
                {broadcasting ? (
                  <Map center={[19.0760, 72.8777]} role="caregiver" roomCode={`room_${myPin}`} />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                    Map visualization will activate upon going online
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Bento Grid Layout (Stitch specific integration) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Earnings Chart (Large Span) */}
          <section className="lg:col-span-8 bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-xl shadow-slate-200/50 overflow-hidden relative group border border-outline-variant/10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-headline text-2xl font-bold">Earnings Performance</h3>
                <p className="text-sm text-on-surface-variant mt-1">Monthly revenue overview</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-primary tracking-tight">₹1,24,800</span>
                <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest mt-1">+12% from last month</p>
              </div>
            </div>
            
            {/* Visual Representation of a Chart */}
            <div className="h-56 w-full flex items-end gap-3 px-2">
              <div className="flex-1 bg-primary/10 rounded-t-xl transition-all duration-500 hover:bg-primary/30" style={{ height: "40%" }}></div>
              <div className="flex-1 bg-primary/10 rounded-t-xl transition-all duration-500 hover:bg-primary/30" style={{ height: "60%" }}></div>
              <div className="flex-1 bg-primary/10 rounded-t-xl transition-all duration-500 hover:bg-primary/30" style={{ height: "45%" }}></div>
              <div className="flex-1 bg-primary/10 rounded-t-xl transition-all duration-500 hover:bg-primary/30" style={{ height: "80%" }}></div>
              <div className="flex-1 bg-primary/10 rounded-t-xl transition-all duration-500 hover:bg-primary/30" style={{ height: "65%" }}></div>
              <div className="flex-1 bg-primary/20 rounded-t-xl transition-all duration-500 hover:bg-primary/40" style={{ height: "90%" }}></div>
              <div className="flex-1 bg-primary/10 rounded-t-xl transition-all duration-500 hover:bg-primary/30" style={{ height: "55%" }}></div>
              <div className="flex-1 bg-primary-container rounded-t-xl shadow-lg border-2 border-primary" style={{ height: "100%" }}></div>
            </div>
            <div className="flex justify-between mt-4 px-3 text-[11px] font-bold text-outline uppercase tracking-widest">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            </div>
          </section>

          {/* Profile Quick View (Small Span) */}
          <section className="lg:col-span-4 bg-surface-container-low rounded-[1.5rem] p-8 flex flex-col items-center text-center justify-center border border-outline-variant/15">
            <div className="relative mb-6">
              <img alt="Caregiver Profile" className="w-28 h-28 rounded-full object-cover shadow-2xl shadow-primary/20 ring-4 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHhv6L1c6FWZmDDQqcRoH2NMBgqyTZ3iIiDG6xcHzz5QT8Qq5ow4WF-iArPp7M5cipxFdwhM7dpPnthqspLG8CMtQ8wZpll742VfbX-p4Qx2SWp4WnrFBnvcC9YR4iZew8XQlI8Q9CMrEUbPhwPFPm6CaVqzspAZypSqi0dkzjmyEVRSKoOFlLHWjm3yspRDwqSdOwxWEkWuCkp6tPq_3r4L1RbXuHb6xGig1zpnGF92jInCQwSI2H-SIoXgse71K-Ulj6hlWO5js" />
              {isVerified && (
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-tertiary rounded-full border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
              )}
            </div>
            <h3 className="font-headline text-2xl font-bold">{user.name || 'Priya Sharma'}</h3>
            <p className="text-sm font-medium text-on-surface-variant mb-8 mt-1">General Nursing & Midwifery (GNM) • 8 Years Exp.</p>
            
            <div className="flex gap-4 w-full">
              <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <span className="block text-2xl font-black text-primary mb-1">4.9</span>
                <span className="text-[10px] text-outline uppercase font-extrabold tracking-widest">Rating</span>
              </div>
              <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <span className="block text-2xl font-black text-primary mb-1">124</span>
                <span className="text-[10px] text-outline uppercase font-extrabold tracking-widest">Bookings</span>
              </div>
            </div>
          </section>

          {/* Booking Requests (Medium Span) */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-headline text-2xl font-bold tracking-tight">Family Booking Requests</h3>
              <button className="text-sm font-bold text-primary hover:underline">View All</button>
            </div>
            
            {/* Request Card 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-xl transition-shadow duration-300 border border-slate-100">
              <img alt="Client" className="w-16 h-16 rounded-2xl object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKoE7bAg1Kuf-EjGD6DOdS1dsMNphW_k63niQijmHfyOjh5FfgHvWnnbk7FwlVFf5_ymwctBs9kUtqx_aqE8dpRhYeuBWUgT9Yy9BItmb7NTRcdtGsJat6lS2-X2kfStd2fRi9E8mqgohKfVryDVhCIQcv_tvbyaH-TkoAXnEwX2U7bEVbYBjz1jITINjYNiQz8GjW4Y4B4w7pw4cq3rY_eUWtYOlv0vtxq2aut6fcG0eXuZy0aHuLkgjBarmNWCnr3q5j4UhrY7w" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-on-surface text-lg">Kavita Rao</h4>
                  <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-widest">New Priority</span>
                </div>
                <p className="text-sm text-on-surface-variant font-medium">Post-op monitoring for elderly parent. Requires evening vitals checks.</p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-outline">
                    <span className="material-symbols-outlined text-sm">calendar_today</span> Oct 12 - Oct 15
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <span className="material-symbols-outlined text-sm">payments</span> ₹2400 / day
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 rounded-full text-error hover:bg-error-container/50 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
                <button className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Accept
                </button>
              </div>
            </div>

            {/* Request Card 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-xl transition-shadow duration-300 border border-slate-100">
              <img alt="Client" className="w-16 h-16 rounded-2xl object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChdOk5hML4TtCKPTb-3eXwQgInkyLQekaEqgoSJwiZ9o4AxH0FinSbNqsu1ZYJKbZcX6lOiHbNlNxGtkKNPsr9DTXFqwG-LHhxq8NJZEQ5wbA9Q_zOZtnzEKbeozXtm9KHVBCL5tlgIpZFwYaLLEp80bEvaEo8sA8KB72Osfpj7BLJ24E49oPhGspGNLvoYiu0lIGzKlOlZc1LQplpsGCxICny41H1xzmJ3_GEOYNEBrUM-oq-Djk2HmljrRgg2mJVb2GwOwy_Z6E" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-on-surface text-lg">Rajesh Gupta</h4>
                  <span className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-widest">Recurring</span>
                </div>
                <p className="text-sm text-on-surface-variant font-medium">Companionship assistance. Weekly medication management & physiotherapy.</p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-outline">
                    <span className="material-symbols-outlined text-sm">calendar_today</span> Every Tuesday
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <span className="material-symbols-outlined text-sm">payments</span> ₹2000 / visit
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 rounded-full text-error hover:bg-error-container/50 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
                <button className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Accept
                </button>
              </div>
            </div>
          </section>

          {/* Calendar Availability (Narrow Span) */}
          <section className="lg:col-span-5 bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-2xl font-bold">Schedule Availability</h3>
              <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">edit_calendar</span>
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-8">
              {['M','T','W','T','F'].map((d,i) => <div key={i} className="text-[11px] font-bold text-outline text-center uppercase">{d}</div>)}
              <div className="text-[11px] font-bold text-primary text-center uppercase">S</div>
              <div className="text-[11px] font-bold text-primary text-center uppercase">S</div>
              
              {/* Mini Calendar Visual */}
              {[10, 11].map(d => <div key={d} className="aspect-square flex items-center justify-center text-sm font-semibold text-slate-400">{d}</div>)}
              <div className="aspect-square flex items-center justify-center text-sm font-bold bg-primary text-white rounded-full shadow-lg shadow-primary/30">12</div>
              <div className="aspect-square flex items-center justify-center text-sm font-bold border-2 border-primary text-primary rounded-full">13</div>
              {[14, 15, 16].map(d => <div key={d} className="aspect-square flex items-center justify-center text-sm font-semibold text-slate-400">{d}</div>)}
            </div>

            <div className="space-y-6 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center gap-4 group">
                <div className="w-1.5 h-14 bg-tertiary rounded-full group-hover:scale-y-110 transition-transform"></div>
                <div>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Current Active Shift</p>
                  <p className="text-base font-bold text-slate-800">Home Visit: Shinde Family</p>
                  <p className="text-xs font-semibold text-primary mt-0.5">09:00 AM - 12:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-1.5 h-14 bg-slate-300 rounded-full group-hover:bg-primary-fixed-dim transition-colors"></div>
                <div>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Upcoming Booking</p>
                  <p className="text-base font-bold text-slate-800">Post-Op Wound Dressing</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">02:00 PM - 03:00 PM</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Mobile Navigation Bar (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-200 px-6 py-4 flex justify-between items-center z-50">
        <a className="flex flex-col items-center gap-1 text-primary" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#shift">
          <span className="material-symbols-outlined">satellite_alt</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Shift</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
          <span className="material-symbols-outlined">event_available</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Schedule</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </a>
      </nav>
    </div>
  );
}
