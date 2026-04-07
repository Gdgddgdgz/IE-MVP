'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'family' | 'caregiver'>('family');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${firstName} ${lastName}`.trim();
    localStorage.setItem('dgcare_user', JSON.stringify({ email, role, name }));
    
    // Direct them to their respective onboarding / dash
    if (role === 'caregiver') {
      router.push('/register-caregiver');
    } else {
      router.push('/dashboard/family');
    }
  };

  return (
    <>
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
        }
      `}</style>
      <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed antialiased min-h-screen">
        <main className="min-h-screen flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
          
          {/* Background Decor (Asymmetric Tonal Shapes) */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl opacity-50 z-0"></div>
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-tertiary-fixed/20 rounded-full blur-3xl opacity-40 z-0"></div>
          
          {/* Main Auth Container */}
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200 border border-slate-100 relative z-10 min-h-[700px]">
            
            {/* Side A: Content & Visual */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-white relative overflow-hidden">
              <div className="relative z-10">
                <Link href="/" className="block mb-12">
                  <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} />
                </Link>
                <h1 className="text-5xl font-extrabold font-headline leading-[1.1] mb-6 tracking-tight">
                  The Sanctuary for <br/><span className="text-primary-fixed">Professional Care.</span>
                </h1>
                <p className="text-lg opacity-90 max-w-md font-medium leading-relaxed">
                  Experience a clinical curator platform designed with editorial precision for families and medical professionals.
                </p>
              </div>
              
              <div className="relative z-10 mt-12 grid grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all cursor-default">
                  <span className="material-symbols-outlined mb-3 text-primary-fixed text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <p className="text-sm font-bold mb-1">Clinical Standard</p>
                  <p className="text-xs opacity-70 font-medium">Rigorous vetting for every caregiver in our elite network.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all cursor-default">
                  <span className="material-symbols-outlined mb-3 text-primary-fixed text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                  <p className="text-sm font-bold mb-1">Live Monitoring</p>
                  <p className="text-xs opacity-70 font-medium">Real-time health updates and transparent communication.</p>
                </div>
              </div>
              
              {/* Abstract Aesthetic Image Overlay */}
              <div className="absolute bottom-0 right-0 w-full h-full opacity-30 pointer-events-none mix-blend-overlay">
                <img alt="Abstract Healthcare" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzEYkFQw6iLKfxkIUxEQ5baY8Uu--_rNOgYb3c8sgNvfox9KuHz9JztUXzEIocBKAUk6koq3F0RmAnPm11JkZAZjFpG1LTbQ8DHftEh-aPs4FUKHWk4e-yFHMvEDeUvH3XDv25cG9qDpvQCit1gs0Is5lL0JlM79UewfEUH_78rq_0bfRSd64A36BKYQUQxhJOpL1-RDnN-mMRzshctzmxbVY4xIdY6zlfG_qxOcb_93LQpkihr_E5zSXvMtXV9aM2ttIGQp5C77Q" />
              </div>
            </div>
            
            {/* Side B: Interaction Forms */}
            <div className="p-8 lg:p-16 flex flex-col justify-center bg-white relative z-20">
              
              {/* Branding for Mobile */}
              <div className="lg:hidden mb-8">
                <Link href="/">
                  <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto" />
                </Link>
              </div>
              
              {/* Role Selection Header (Signup View) */}
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-slate-900 tracking-tight mb-2">Create your account</h2>
                <p className="text-slate-500 text-sm font-medium">Select your role to begin your curated journey.</p>
              </div>
              
              {/* Role Selection (Asymmetric Bento-ish Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                
                <button 
                  type="button" 
                  onClick={() => setRole('family')}
                  className={`group relative flex flex-col p-6 text-left rounded-2xl transition-all duration-300 ${role === 'family' ? 'bg-primary/5 border-2 border-primary/40 shadow-sm ring-4 ring-primary/5' : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${role === 'family' ? 'bg-primary text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                    <span className="material-symbols-outlined text-[24px]">family_restroom</span>
                  </div>
                  <h3 className={`font-bold ${role === 'family' ? 'text-primary' : 'text-slate-800'}`}>For Families</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Seeking premium caregivers for loved ones.</p>
                  
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all ${role === 'family' ? 'bg-primary opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'}`}>
                    <span className="material-symbols-outlined text-[14px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setRole('caregiver')}
                  className={`group relative flex flex-col p-6 text-left rounded-2xl transition-all duration-300 ${role === 'caregiver' ? 'bg-teal-50 border-2 border-teal-500 shadow-sm ring-4 ring-teal-50' : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${role === 'caregiver' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                    <span className="material-symbols-outlined text-[24px]">medical_services</span>
                  </div>
                  <h3 className={`font-bold ${role === 'caregiver' ? 'text-teal-700' : 'text-slate-800'}`}>For Caregivers</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Certified professionals offering clinical care.</p>
                  
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all ${role === 'caregiver' ? 'bg-teal-600 opacity-100 scale-100' : 'bg-transparent opacity-0 scale-50'}`}>
                    <span className="material-symbols-outlined text-[14px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                </button>
                
              </div>
              
              {/* Form Section */}
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">First Name</label>
                    <input 
                      required 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium" 
                      placeholder="Jane" 
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Last Name</label>
                    <input 
                      required 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium" 
                      placeholder="Doe" 
                      type="text"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Professional Email</label>
                  <input 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium" 
                    placeholder="jane.doe@clinical.com" 
                    type="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Create Password</label>
                  <div className="relative">
                    <input 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-800 font-extrabold placeholder:text-slate-300 placeholder:font-black tracking-widest" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 px-1 font-medium">Minimum 8 characters with at least one special character.</p>
                </div>
                
                <div className="pt-6">
                  <button type="submit" className="w-full bg-primary text-white font-black text-sm uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] hover:bg-primary-container active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group">
                    Initialize Account
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1.5 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </form>
              
              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500 font-medium">Already an established member?</p>
                <Link href="/login" className="text-primary font-black text-sm hover:underline decoration-2 underline-offset-4 uppercase tracking-widest">Log in to Console</Link>
              </div>
            </div>
            
          </div>
          
          {/* Secondary Login Toggle Section (Floating/Editorial Detail) */}
          <div className="fixed bottom-8 right-8 hidden xl:block z-50">
            <div className="p-4 rounded-3xl glass-panel shadow-2xl shadow-slate-900/10 border border-white/60 flex items-center gap-4 bg-white/80">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-inner border border-slate-100">
                <img alt="Health Specialist" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_izXMFCNwO5Evv8HJC4IFNuftHPcro0fS0MR3yI_eQRABsNUELaeqJUHjfCDxcYcUGmBRFotLqd04Ebm7VHFatPRQlUeXOJKrCKrRMAJIdzZnTOFAoC89pi0-v0qzlWy9EXOYgOFwvIYZziq1zEwqwhXu17-ijsrBD21WT06DmccElSDO58cUVThuL8UAu1M__MMup6PJv0iYahhWw5UX12KKjRYZ3iGPDHVidMj6Ls7xAuAI7eVp97c7iIrAI0MvFGjdtbN0Tjs" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800">Need assistance?</p>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide">Talk to a Clinical Curator</p>
              </div>
              <button className="ml-2 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </button>
            </div>
          </div>
          
        </main>
        
        {/* Footer suppression for focused Auth journey */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center w-full z-0 pointer-events-none">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-80">© 2024 DGCare Platform. Editorial Healthcare Excellence.</p>
        </div>
      </div>
    </>
  );
}
