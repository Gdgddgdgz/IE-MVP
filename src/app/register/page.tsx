'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('family');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      localStorage.setItem('dgcare_user', JSON.stringify({ email, role, name }));
      router.push(role === 'family' ? '/dashboard/family' : '/dashboard/caregiver');
    } catch {
      setError('Unable to save account. Please allow local storage and try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-primary/5">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl -mr-48 -mb-48"></div>
        
        <div className="z-10 text-white max-w-lg">
          <h1 className="text-6xl font-black mb-8 leading-tight tracking-tighter">Join the Elite <br/>Care Network.</h1>
          <p className="text-xl text-primary-fixed opacity-90 leading-relaxed font-medium">
            Whether you are seeking care for a loved one or providing professional expertise, DGCare is your platform for clinical excellence.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <span className="text-2xl font-black text-primary tracking-tighter">DGCare</span>
          </div>

          <div className="premium-card p-10 border border-slate-100">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
              <p className="text-slate-500 font-medium">Experience peace of mind with curated care.</p>
            </div>
            
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                    placeholder="Alex Smith" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  placeholder="name@company.com" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  placeholder="••••••••" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">I am a...</label>
                <select 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary transition-all outline-none"
                >
                  <option value="family">Family Member</option>
                  <option value="caregiver">Professional Provider</option>
                </select>
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}
              <button 
                type="submit" 
                className="w-full py-4 mt-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-container shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-slate-100">
              <p className="text-slate-500 text-sm font-medium">
                Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors uppercase tracking-widest">
              ← Return to DGCare Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
