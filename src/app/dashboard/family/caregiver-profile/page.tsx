'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Award, Clock, ArrowLeft, Star, Heart, Share2, Play, CheckCircle2, Zap, Briefcase } from 'lucide-react';

/* ─── Mock Data for Profile Logic ─── */
const PROFILE_DATA = {
  clinical: {
    name: 'Priya Sharma',
    type: 'Clinical Specialist',
    title: 'Senior Clinical Curator (GNM, HHA)',
    experience: '12 Years',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX7hInPuXEiA6olEpM2g4fj2oEWgZeHSB2tDlRMnpzAeuoYf_QVLXCgBIc20fsBTre4WUvoLEUL5V-oBWfDq3_LwGigEnhpMxZiHBGGGFfHuPkgg6ddRoNMvYFiqgfzESTF0L57N0THfuMjVByFgQcF1kEqzTSC85KR__9XIm8PjoCGlvSzLtxEvZq8Jt4LPG3Dxkj3SNEjhVdQRNnnWgMlKDgltJJTOJpHqSNCT9BhSzrH1hPvurJuL1XaatYo6grfhlLQKTZpy9F',
    bio: 'Certified Nurse specializing in geriatric clinical care and recovery management. Fluent in English, Hindi, and Marathi.',
    skills: [
      { label: 'Medication Administration', icon: 'medical_services' },
      { label: 'Wound Care & Dressings', icon: 'healing' },
      { label: 'Post-Op Monitoring', icon: 'vital_signs' },
      { label: 'Catheter Management', icon: 'fluid_med' }
    ],
    badges: ['Police Verified', 'Identity Secured', 'Clinical Certified']
  },
  assistant: {
    name: 'Rahul Varma',
    type: 'Care Assistant',
    title: 'Dedicated Daily Living Assistant',
    experience: '2 Years (Gig)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPUq6yC9hc3chANxSgBKKi2RsD1fmay4DfYWgF5jMOFljc_VvuQ9W5Ay_t-Jt66ZDRac4sV-Vbfs64aCxPHDgb8TF8WSF7FSPaBB-IZ0UjSx-IjXdA7OahdtUiXr9hvigQOjGOhjoQlyZajdxln550FP2_syjxmQre3GaD_YwuignPGPJ5Q4o7CeXG-MNceapp9QoiLOnfsrNsN9LcgGe0-GM3Rv60zBsnaJNi4fggguNy7nY65mP5glxHyO43z9ab_9-iZdXkLD0',
    bio: 'Task-focused assistant ensuring your loved ones eat well, take their meds on time, and have a companion for daily tasks. Reliable and punctual student helping families for side-money.',
    skills: [
      { label: 'Medication Reminders', icon: 'alarm' },
      { label: 'Meal Preparation', icon: 'restaurant' },
      { label: 'Household Errands', icon: 'shopping_basket' },
      { label: 'Companionship', icon: 'sentiment_satisfied' }
    ],
    badges: ['Police Verified', 'Identity Secured']
  }
};

export default function CaregiverProfile() {
  const router = useRouter();
  const [profileType, setProfileType] = useState<'clinical' | 'assistant'>('clinical');
  const data = PROFILE_DATA[profileType];

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00665d33; border-radius: 10px; }
      `}</style>
      
      <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased font-body relative">
        
        {/* Toggle Overlay for MVP Demo Logic */}
        <div className="fixed bottom-6 left-6 z-50 p-2 bg-white rounded-full shadow-2xl border border-slate-200 flex gap-1">
          <button 
            onClick={() => setProfileType('clinical')} 
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${profileType === 'clinical' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Clinical UI
          </button>
          <button 
            onClick={() => setProfileType('assistant')} 
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${profileType === 'assistant' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Assistant UI
          </button>
        </div>

        {/* Sidebar Navigation (Stitched) */}
        <aside className="hidden md:flex flex-col p-8 gap-y-6 h-screen w-72 fixed left-0 bg-white border-r border-slate-100 z-40">
          <div className="mb-6">
            <Link href="/">
              <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto mb-2" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Profile Insight</p>
            </Link>
          </div>
          <nav className="flex-1 space-y-1">
            <Link className="flex items-center gap-3 p-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all" href="/dashboard/family">
              <span className="material-symbols-outlined">monitoring</span>
              <span>Dashboard</span>
            </Link>
            <Link className="flex items-center gap-3 p-3 text-sm font-black bg-primary/5 text-primary rounded-xl transition-all" href="/dashboard/family/marketplace">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
              <span>Find Caregivers</span>
            </Link>
            <Link className="flex items-center gap-3 p-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all" href="/dashboard/family/booking">
              <span className="material-symbols-outlined">event_available</span>
              <span>My Bookings</span>
            </Link>
          </nav>
          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95">
             Direct Message
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-72 p-4 md:p-8 lg:p-12 max-w-[1500px] overflow-y-auto custom-scrollbar h-screen">
          
          {/* Header Action Bar */}
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-6">
              <button onClick={() => router.back()} className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all active:scale-90 group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">Caregiver bio</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{data.name}</h2>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all text-slate-400"><Share2 size={18} /></button>
              <button className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-all text-slate-400"><Heart size={18} /></button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Visuals & Main Info */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Profile Card (Glassmorphism & Bento) */}
              <div className="bg-white rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
                <div className="w-full md:w-80 h-[400px] rounded-[2rem] overflow-hidden shadow-2xl shrink-0 group">
                  <img src={data.avatar} alt={data.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2 pointer-events-none">
                    {data.badges.map(badge => (
                      <span key={badge} className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-white/50">
                        {badge.includes('Certified') ? <Award size={12} className="text-primary" /> : <ShieldCheck size={12} className="text-teal-500" />}
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${profileType === 'clinical' ? 'bg-primary/5 text-primary border-primary/20' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                         {data.type}
                       </span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4 font-headline">{data.name}</h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg mb-8">{data.bio}</p>
                    
                    {/* Expertise Grid (Conditional on Type) */}
                    <div className="grid grid-cols-2 gap-4">
                        {data.skills.map(skill => (
                           <div key={skill.label} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/30 transition-all cursor-default">
                              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">{skill.icon}</span>
                              <span className="text-xs font-bold text-slate-700">{skill.label}</span>
                           </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-10 pt-8 border-t border-slate-100">
                    <div className="text-center md:text-left">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Rating</p>
                       <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-slate-900">4.9</span>
                          <Star size={18} fill="#f59e0b" className="text-amber-500" />
                       </div>
                    </div>
                    <div className="text-center md:text-left">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Response Time</p>
                       <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-slate-900">~15</span>
                          <span className="text-sm font-bold text-slate-400 uppercase">Mins</span>
                       </div>
                    </div>
                    <div className="text-center md:text-left">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tenure</p>
                       <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-slate-900">{data.experience.split(' ')[0]}</span>
                          <span className="text-sm font-bold text-slate-400 uppercase">Years</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Bio / Proof of Work Section */}
              <div className="relative group aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9-BcVtp1T7KAyyWAKXpPz8bjw9OHhZukVm4uIZ6ty6VTfdKEJok5QZZ_Xw0kEpWz5b0bSSqIx_zkN3pRfvIA6vy3rKDDV3mw8uoEKy_Jq2Rj2pD_SbrRApQa6gWRKHPOO8tfkl8G-s9Np5HU70gKXsgdhQPjSo-7Z3d3YfeMNyK07ISjHAP2J6c82TBrCY862ngnsjO792jvaDrv9HK-xlwEOoZG0KcKjM_nH3mUiGNYNG4CSLDLZO5ovcgXGZ7AjXq-E_PmkK7Bh" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 z-20">
                   <button className="w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group">
                      <Play size={40} fill="white" className="ml-1 group-hover:scale-110 transition-transform" />
                   </button>
                   <div className="mt-8 text-center">
                     <h3 className="text-white text-3xl font-black font-headline tracking-tighter mb-2">Introduction & Care Philosophy</h3>
                     <p className="text-white/60 font-bold text-sm uppercase tracking-[0.3em]">Watch {data.name.split(' ')[0]}'s personal greeting</p>
                   </div>
                </div>
              </div>

              {/* Reviews / Testimonials Strip */}
              <div className="space-y-8">
                 <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 font-headline">Verified Client Experiences</h3>
                    <button className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline decoration-2 underline-offset-4 transition-all">
                       View All 142 Reviews <CheckCircle2 size={14} />
                    </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30">
                       <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">SJ</div>
                         <div>
                            <p className="font-black text-sm text-slate-900 leading-tight">Shruti Joshi</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Daughter</p>
                         </div>
                       </div>
                       <p className="text-slate-500 font-medium leading-relaxed italic">"Priya provided such reliable support for dad. She never missed a medication dose and her updates always put my mind at ease."</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30">
                       <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">AM</div>
                         <div>
                            <p className="font-black text-sm text-slate-900 leading-tight">Anil Mehta</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</p>
                         </div>
                       </div>
                       <p className="text-slate-500 font-medium leading-relaxed italic">"Excellent help with my daily recovery tasks and meal prep. Very polite and consistently on-time."</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Column: Booking Side-Rail */}
            <div className="lg:col-span-4 space-y-10">
              
              {/* Dynamic Booking Card */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 sticky top-12">
                 <h3 className="text-2xl font-black mb-8 tracking-tighter text-slate-900 font-headline">Secure Booking</h3>
                 
                 <div className="space-y-6 mb-8">
                    <div className="p-5 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100 transition-all hover:border-primary/30">
                       <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle2 size={24} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
                          <p className="text-sm font-black text-slate-800">Immediately Available</p>
                       </div>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100 transition-all hover:border-primary/30">
                       <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                          <Zap size={24} fill="currentColor" />
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rate (Inclusive)</p>
                          <p className="text-sm font-black text-slate-800">₹{profileType === 'clinical' ? '1,800' : '650'} / Session</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">Typical Care Model</p>
                   <ul className="space-y-3 mb-10">
                      <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                         <Clock size={16} className="text-primary" /> Daily Task Updates
                      </li>
                      <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                         <Briefcase size={16} className="text-primary" /> Verified Certifications
                      </li>
                      <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                         <ShieldCheck size={16} className="text-primary" /> Refund Protection
                      </li>
                   </ul>

                   <Link href="/dashboard/family/booking" className="w-full py-5 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                      Initialize Booking <ArrowLeft size={16} className="rotate-180" />
                   </Link>
                   
                   <div className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Secure Transaction via UPI • 24/7 Support
                   </div>
                 </div>
              </div>

              {/* Identity & Records Modal Detail */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10">
                    <h4 className="text-xl font-black mb-2 tracking-tight">Identity Verified</h4>
                    <p className="text-xs text-white/60 leading-relaxed font-bold mb-6">Background history, police records, and Aadhar identity have been hand-verified by our specialists.</p>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2">
                       Review Verification Policy <ArrowLeft size={10} className="rotate-180" />
                    </button>
                 </div>
                 <ShieldCheck size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform duration-700" />
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
