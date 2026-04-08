'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Search, Filter, ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react';
import { FullPageSkeleton } from '@/components/SkeletonLoader';
import Link from 'next/link';

interface CaregiverCard {
  id: number;
  name: string;
  type: 'Clinical Specialist' | 'Care Assistant';
  rating: number;
  experience: string;
  reliability: string;
  tasks: string[];
  price: string;
  verified: boolean;
  certified?: boolean;
  avatar: string;
  bio: string;
}

const MOCK_CAREGIVERS: CaregiverCard[] = [
  {
    id: 1,
    name: 'Priya Sharma (GNM Specialist)',
    type: 'Clinical Specialist',
    rating: 4.9,
    experience: '8 Years',
    reliability: '99%',
    tasks: ['Injections', 'Wound Care', 'Medication Management', 'Post-Op Care'],
    price: '₹850/session',
    verified: true,
    certified: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTkMrv7QS-ppv-2iRpd12X9fQoUFesLjW-diZ58EzsLlTB2QYGBXdZlhJl8eZjJQnaouEB_h3wjJ0VghKlym0JNEZ7uzu-7LRhjplHtz5HnS89gCPuo2qG_oHiXd3Qb-uUkMAwSqmQ4FqkPr9slMf_V2fihi4lZDRM3q6XhugNO1IHg76g24GH_uzCsMb1ZTUGpBIxBk4tqdgbNwF4WkGhiBLLjbF_cWQkHnSRQekUAP4ZIGGxFLBbQx7p47Tq-QRZhien8N3Jb4k',
    bio: 'Experienced nurse specializing in geriatric clinical care and recovery management.'
  },
  {
    id: 2,
    name: 'Rahul Varma',
    type: 'Care Assistant',
    rating: 4.8,
    experience: '2 Years (Gig)',
    reliability: '95%',
    tasks: ['Meal Prep', 'Medication Reminders', 'Grocery Errands'],
    price: '₹350/session',
    verified: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPUq6yC9hc3chANxSgBKKi2RsD1fmay4DfYWgF5jMOFljc_VvuQ9W5Ay_t-Jt66ZDRac4sV-Vbfs64aCxPHDgb8TF8WSF7FSPaBB-IZ0UjSx-IjXdA7OahdtUiXr9hvigQOjGOhjoQlyZajdxln550FP2_syjxmQre3GaD_YwuignPGPJ5Q4o7CeXG-MNceapp9QoiLOnfsrNsN9LcgGe0-GM3Rv60zBsnaJNi4fggguNy7nY65mP5glxHyO43z9ab_9-iZdXkLD0',
    bio: 'University student offering dedicated daily support. Punctual and compassionate companion for your loved ones.'
  },
  {
    id: 3,
    name: 'Anjali Menon',
    type: 'Care Assistant',
    rating: 5.0,
    experience: '3 Years',
    reliability: '100%',
    tasks: ['Housekeeping', 'Lunch Support', 'Medication Tracking'],
    price: '₹400/session',
    verified: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl6PXtbqqE7_e3SxtNg0ddANx_d38Hr6-iC1DEoiaOMVhllS--yulIGKKkpz2odWj9sZTnxGiaz3vlOYWMxEbIB90s-Bq_URWyFdz8YpRUm2O8PuVF0EW-5kAzWFDirNDEk_2P3-KZN-7qKUAM3joq7BcUs-9AuUdRAk5C3zJr4G_AaTiJ-1hnCafoo0MRj2D0dJDRu6Uup8-OL7r52FczbXr2PTBUiSBKOiL_E5V3x5FywuPdbnwIT0zUSIrLWTQIqHf8ZOnBQ18',
    bio: 'Highly reliable care assistant focused on daily living task management and elderly companionship.'
  },
  {
    id: 4,
    name: 'Dr. Sneha Desai',
    type: 'Clinical Specialist',
    rating: 4.9,
    experience: '12 Years',
    reliability: '98%',
    tasks: ['Physiotherapy', 'BP Monitoring', 'Blood Test Home Collection'],
    price: '₹1200/session',
    verified: true,
    certified: true,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_izXMFCNwO5Evv8HJC4IFNuftHPcro0fS0MR3yI_eQRABsNUELaeqJUHjfCDxcYcUGmBRFotLqd04Ebm7VHFatPRQlUeXOJKrCKrRMAJIdzZnTOFAoC89pi0-v0qzlWy9EXOYgOFwvIYZziq1zEwqwhXu17-ijsrBD21WT06DmccElSDO58cUVThuL8UAu1M__MMup6PJv0iYahhWw5UX12KKjRYZ3iGPDHVidMj6Ls7xAuAI7eVp97c7iIrAI0MvFGjdtbN0Tjs',
    bio: 'Senior Clinical Curator specializing in physical rehabilitation and chronic condition monitoring.'
  }
];

export default function FamilyMarketplace() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'Daily Support' | 'Clinical Care'>('Daily Support');
  const [isManagedMode, setIsManagedMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const lsUser = localStorage.getItem('dgcare_user');
    if (!lsUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(lsUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dgcare_user');
    localStorage.removeItem('dgcare_bookings');
    localStorage.removeItem('caregiver_verified');
    router.push('/login');
  };

  const filteredCaregivers = MOCK_CAREGIVERS.filter(cg => {
    const matchesSearch = cg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cg.tasks.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeTab === 'Daily Support') {
      return matchesSearch && cg.type === 'Care Assistant';
    }
    return matchesSearch && cg.type === 'Clinical Specialist';
  });

  if (!user) return <FullPageSkeleton role="family" />;

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00665d33; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      
      <div className="bg-surface font-body text-on-surface antialiased flex flex-col md:flex-row h-screen overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex h-screen w-64 bg-slate-50 flex-col p-6 gap-y-4 shrink-0 overflow-y-auto border-r border-outline-variant/10">
          <div className="mb-8 px-2 flex justify-between items-center">
            <Link href="/">
              <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto mb-1" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">Discovery Portal</p>
            </Link>
          </div>
          <nav className="flex-1 space-y-2">
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 hover:translate-x-1 transition-all rounded-xl font-bold text-sm" href="/dashboard/family">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>monitoring</span>
              <span>Monitoring Core</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl shadow-sm font-black transition-all text-sm" href="/dashboard/family/marketplace">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
              <span>Find Caregivers</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 hover:translate-x-1 transition-all rounded-xl font-bold text-sm" href="/dashboard/family/booking">
              <span className="material-symbols-outlined">event_available</span>
              <span>Bookings</span>
            </Link>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 hover:translate-x-1 transition-all rounded-xl font-bold text-sm" href="#">
              <span className="material-symbols-outlined">chat</span>
              <span>Messages</span>
            </a>
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 mt-4 text-red-500 hover:bg-red-50 hover:translate-x-1 rounded-xl font-bold transition-all w-full text-left text-sm">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 px-4 md:px-8 xl:px-12 pt-8 pb-12 relative">
          
          {/* Header Section with Managed Mode Toggle */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
            <div className="max-w-xl">
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Caregiver Marketplace</h2>
              <p className="text-slate-500 font-medium mt-1">Discover, vet, and book elite specialists or task-based aid for your loved ones.</p>
            </div>
            
            {/* Managed Mode Toggle (Strategic Differentiator) */}
            <div className={`p-1.5 rounded-full border transition-all flex items-center gap-2 ${isManagedMode ? 'bg-primary border-primary' : 'bg-white border-slate-200'}`}>
              <button 
                onClick={() => setIsManagedMode(false)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isManagedMode ? 'bg-slate-900 text-white shadow-md' : 'text-primary-container'}`}
              >
                Marketplace (Self)
              </button>
              <button 
                onClick={() => setIsManagedMode(true)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isManagedMode ? 'bg-white text-primary shadow-md' : 'text-slate-400'}`}
              >
                <Zap size={10} fill={isManagedMode ? 'currentColor' : 'none'} />
                Managed Mode
              </button>
            </div>
          </header>

          {/* Managed Mode Banner */}
          {isManagedMode && (
            <div className="bg-gradient-to-r from-primary to-primary-container p-8 rounded-[2rem] text-white mb-10 shadow-xl shadow-primary/20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden animate-in zoom-in-95">
              <div className="flex-1 relative z-10">
                <div className="bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] w-max px-3 py-1 rounded-md mb-4 border border-white/20">Concierge Active</div>
                <h3 className="text-3xl font-black font-headline mb-3 tracking-tight">Let us find the perfect match.</h3>
                <p className="opacity-80 font-medium max-w-lg mb-6 leading-relaxed">Describe your specific needs and our Clinical Curators will assign a verified specialist within 4 hours. No scrolling required.</p>
                <button className="bg-white text-primary px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                  Request Assignment
                </button>
              </div>
              <div className="w-32 h-32 md:w-56 md:h-56 bg-white/10 rounded-full flex items-center justify-center relative translate-x-4 translate-y-4">
                 <span className="material-symbols-outlined text-[100px] opacity-40">clinical_notes</span>
              </div>
            </div>
          )}

          {/* Search and Navigation */}
          <div className="flex flex-col md:flex-row gap-6 mb-10 sticky top-0 z-30 pt-2 pb-4 bg-slate-50/90 backdrop-blur-xl">
             <div className="flex-1 relative group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
               <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, task (e.g. meal prep), or specialization..." 
                className="w-full bg-white border border-slate-200 rounded-3xl pl-14 pr-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
               />
             </div>
             <div className="flex items-center bg-white p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <button 
                  onClick={() => setActiveTab('Daily Support')}
                  className={`px-6 py-3 rounded-[1rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Daily Support' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Daily Support Aid
                </button>
                <button 
                  onClick={() => setActiveTab('Clinical Care')}
                  className={`px-6 py-3 rounded-[1rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Clinical Care' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Clinical Specialists
                </button>
             </div>
             <button className="bg-white p-4 rounded-[1.5rem] border border-slate-200 shadow-sm text-slate-400 hover:text-primary transition-all">
               <Filter size={20} />
             </button>
          </div>

          {/* Marketplace Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCaregivers.map(cg => (
              <div key={cg.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden transition-all hover:translate-y-[-8px] hover:shadow-2xl">
                
                {/* Image & Header Overlay */}
                <div className="h-64 relative overflow-hidden">
                  <img src={cg.avatar} alt={cg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  
                  {/* Status Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {cg.certified && (
                      <div className="bg-primary text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.15em] shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                        <ShieldCheck size={12} fill="white" strokeWidth={3} /> Certified
                      </div>
                    )}
                    <div className="bg-white/95 text-slate-900 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.15em] shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                      <Zap size={12} fill="currentColor" /> {cg.type}
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h4 className="text-xl font-black text-white font-headline leading-tight">{cg.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-amber-400">
                             {[...Array(5)].map((_, i) => (
                               <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: `'FILL' ${i < Math.floor(cg.rating) ? 1 : 0}` }}>star</span>
                             ))}
                          </div>
                          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{cg.rating} ({Math.floor(Math.random()*100)+20} Reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">{cg.bio}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-slate-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</span>
                        <span className="text-sm font-black text-slate-800">{cg.experience}</span>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reliability</span>
                        <span className="text-sm font-black text-primary">{cg.reliability}</span>
                     </div>
                  </div>

                  <div className="mb-8">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Key Focus Tasks</span>
                    <div className="flex flex-wrap gap-2">
                       {cg.tasks.slice(0, 3).map(task => (
                         <span key={task} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase border border-slate-100">
                           {task}
                         </span>
                       ))}
                       {cg.tasks.length > 3 && <span className="text-[10px] font-bold text-slate-400 self-center">+{cg.tasks.length - 3}</span>}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800">{cg.price}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inclusive Rate</span>
                     </div>
                     <Link href="/dashboard/family/caregiver-profile" className="flex items-center gap-2 py-3 px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/10">
                        View Bio <ArrowRight size={12} />
                     </Link>
                  </div>
                </div>

              </div>
            ))}

            {filteredCaregivers.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
                    <Search size={40} />
                 </div>
                 <h4 className="text-xl font-black text-slate-900 mb-2">No caregivers found.</h4>
                 <p className="text-slate-500 font-medium max-w-sm">Try adjusting your filters or switching to {activeTab === 'Daily Support' ? 'Clinical Care' : 'Daily Support Aid'}.</p>
              </div>
            )}
          </div>

          {/* Feature Highlight Footer Strip */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
             <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h5 className="font-black text-slate-800 text-sm uppercase tracking-tight">Verified Trust</h5>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Police records, identity, and clinical certifications are strictly hand-verified.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-12 h-12 bg-teal-500/10 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <h5 className="font-black text-slate-800 text-sm uppercase tracking-tight">Rapid matching</h5>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Need help now? Managed mode matches you with curated aid in under 4 hours.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <Info size={24} />
                </div>
                <div>
                  <h5 className="font-black text-slate-800 text-sm uppercase tracking-tight">Gig Inclusivity</h5>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Empowering reliable students and part-timers to provide essential daily support.</p>
                </div>
             </div>
          </div>
        </main>
      </div>
    </>
  );
}
