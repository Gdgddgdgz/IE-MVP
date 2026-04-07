'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Wallet, Heart, ArrowRight, Upload, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export default function CaregiverRegistration() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('pending');
    setTimeout(() => {
      setStatus('success');
      window.scrollTo({ top: document.getElementById('register')?.offsetTop || 0, behavior: 'smooth' });
    }, 2500);
  };

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-8 h-20 bg-white/70 backdrop-blur-2xl z-50 shadow-sm shadow-teal-900/5 glass-nav">
        <div className="text-2xl font-black text-teal-800 tracking-tighter font-headline">
          <Link href="/"><img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto" /></Link>
        </div>
        <div className="hidden md:flex items-center gap-x-8">
          <Link className="text-slate-500 hover:text-teal-600 transition-colors font-headline font-semibold text-sm tracking-tight" href="/dashboard/family/booking">Find Caregiver</Link>
          <Link className="text-teal-700 border-b-2 border-teal-600 pb-1 font-headline font-semibold text-sm tracking-tight" href="#">Become Caregiver</Link>
          <Link className="text-slate-500 hover:text-teal-600 transition-colors font-headline font-semibold text-sm tracking-tight" href="#">Resources</Link>
        </div>
        <div className="flex items-center gap-x-4">
          <Link href="/login" className="px-6 py-2.5 text-sm font-semibold text-teal-600 hover:bg-teal-50/50 rounded-full transition-all">Login</Link>
          <Link href="#register" className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:opacity-90 rounded-full transition-all soft-shadow">Apply Now</Link>
        </div>
      </nav>

      <main className="pt-20">
        {/* Section 1: Hero/Intro */}
        <section className="relative overflow-hidden bg-surface py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-tertiary-container text-on-tertiary-container rounded-full">
                Community & Career
              </span>
              <h1 className="font-headline text-5xl lg:text-7xl font-extrabold text-on-surface tracking-tight mb-6 leading-[1.1]">
                Make a Difference, <span className="text-primary italic">Your Way.</span>
              </h1>
              <p className="text-on-surface-variant text-lg lg:text-xl mb-10 max-w-xl leading-relaxed">
                Whether you're a seasoned clinical professional passing through Mumbai or a verified local seeking flexible work, DGCare connects your skills with families who need you most.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                  <CalendarDays className="text-primary mb-2" size={28} />
                  <p className="text-sm font-bold text-on-surface block">Total Flexibility</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                  <Wallet className="text-primary mb-2" size={28} />
                  <p className="text-sm font-bold text-on-surface block">Reliable Earnings (INR)</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                  <Heart className="text-primary mb-2" size={28} />
                  <p className="text-sm font-bold text-on-surface block">Local Impact</p>
                </div>
              </div>

              <a className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-full transition-transform hover:scale-105 soft-shadow" href="#register">
                Join the Network
                <ArrowRight className="ml-2" size={20} />
              </a>
            </div>
            
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-primary-fixed-dim/20 rounded-[3rem] rotate-3 -z-10"></div>
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden soft-shadow">
                <img 
                  alt="Professional Indian Caregiver" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5iI0MqLOz23x4SEbCWohiVMfWFGL77tqPxhVl_V8tKycRj5DtP6HjsjB5ROVbgvnQLVICxt8W0ElCJ8BOp_NA7a7Yl9atPRr0zTJwiw_R4rYQrrWLP-fQn8kICG83jctjDThTu3pnP2z1mkjMwZGplVv9D0CdqagxTcAyGTps30lttQhiXL4nFMcj9rzYTBA0oSv9K7ip393sJpsphMXl_DFjWr0IwW2YjJUk89JeQrO-8x0Lvoll2OkWik46YwuBxTycEL-_MAbz"
                />
                <div className="absolute bottom-8 left-8 right-8 glass-nav p-6 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-on-surface">Verified Professionals</p>
                      <p className="text-on-surface-variant">Over 1,200 active members in India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Registration Form */}
        <section className="py-24 bg-surface-container-low" id="register">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl font-bold text-on-surface mb-4">Create Your Profile</h2>
              <p className="text-on-surface-variant">Tell us about your experience and how you'd like to help your community.</p>
            </div>
            
            <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 soft-shadow border border-white/40">
              
              {status === 'success' ? (
                <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-headline font-bold text-teal-900 mb-4">Application Submitted!</h3>
                  <p className="text-on-surface-variant max-w-lg mx-auto mb-8 leading-relaxed">
                    Thank you for applying. Our verification team will review your Aadhar / PAN credentials shortly. We'll contact you within 24 hours to proceed with the background check.
                  </p>
                  <button onClick={() => setStatus('idle')} className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-container transition-all shadow-md">
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form className="space-y-12" onSubmit={handleSubmit}>
                  {/* Step 1: Basic Information */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
                      <h3 className="text-xl font-bold text-on-surface">Personal Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-on-surface-variant">Full Name (As per Aadhar)</label>
                        <input required className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary-fixed focus:border-transparent transition-all outline-none" placeholder="Priya Sharma" type="text"/>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-on-surface-variant">Email Address</label>
                        <input required className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary-fixed focus:border-transparent transition-all outline-none" placeholder="priya.sharma@example.com" type="email"/>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-on-surface-variant">Phone Number (WhatsApp Active)</label>
                        <input required className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary-fixed focus:border-transparent transition-all outline-none" placeholder="+91 98765 43210" type="tel"/>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-on-surface-variant">Work Preference</label>
                        <select className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary-fixed focus:border-transparent transition-all outline-none text-on-surface">
                          <option value="professional">Full-time / Professional</option>
                          <option value="flexible">Part-time / Flexible Schedule</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Care Experience & Skills */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
                      <h3 className="text-xl font-bold text-on-surface">Experience & Skills</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-on-surface-variant">Primary Expertise</label>
                        <select className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary-fixed focus:border-transparent transition-all outline-none text-on-surface">
                          <optgroup label="Clinical Specialties">
                            <option>Elderly Care (Dementia/Alzheimer's)</option>
                            <option>Post-Surgical Support</option>
                            <option>Special Needs (Clinical)</option>
                            <option>Palliative Care</option>
                          </optgroup>
                          <optgroup label="General Care Tasks">
                            <option>Companionship</option>
                            <option>Meal Preparation (Indian Diet)</option>
                            <option>Errands & Shopping</option>
                            <option>Mobility Assistance</option>
                          </optgroup>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-on-surface-variant">Experience Level</label>
                        <select className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary-fixed focus:border-transparent transition-all outline-none text-on-surface">
                          <option>Beginner (0-1 year)</option>
                          <option>1-3 years</option>
                          <option>3-5 years</option>
                          <option>5-10 years</option>
                          <option>10+ years</option>
                        </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-on-surface-variant">Aadhar/KYC or Nursing License (Optional but recommended)</label>
                        <div className="border-2 border-dashed border-outline-variant rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer group">
                          <Upload className="text-outline mb-2 mx-auto group-hover:text-primary transition-colors" size={32} />
                          <p className="text-sm font-medium text-on-surface">Click to upload or drag and drop</p>
                          <p className="text-xs text-on-surface-variant mt-1">GNM, B.Sc Nursing, HHA, First Aid, or Aadhar Front/Back</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Availability & Interests */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</span>
                      <h3 className="text-xl font-bold text-on-surface">Availability & Interests</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-4">When are you available to help?</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['weekdays', 'weekends', 'mornings', 'afternoons', 'evenings', 'overnight'].map((time) => (
                            <label key={time} className="relative flex items-center justify-center gap-3 p-4 rounded-xl bg-surface-container-low border border-transparent cursor-pointer hover:border-primary-fixed transition-all has-[:checked]:bg-primary-container has-[:checked]:text-white select-none">
                              <input className="hidden peer" name="availability" type="checkbox" value={time}/>
                              <span className="text-sm font-semibold capitalize">{time}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-4">Interests & Specialized Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {['Pet Care', 'Gardening', 'Music / Singing', 'Storytelling / Mythological Tales', 'Regional Cooking', 'Errands', 'Physiotherapy Assist'].map((interest) => (
                            <label key={interest} className="cursor-pointer group select-none">
                              <input className="hidden peer" name="interests" type="checkbox" value={interest.toLowerCase().replace(/ /g, '-')}/>
                              <span className="inline-block px-4 py-2 rounded-full border border-outline-variant text-sm font-medium text-on-surface-variant peer-checked:bg-primary-fixed peer-checked:text-on-primary-fixed peer-checked:border-primary-fixed hover:border-primary transition-all">
                                {interest}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Biography */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">4</span>
                      <h3 className="text-xl font-bold text-on-surface">Introduction</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-on-surface-variant">Why do you want to help? (Mention languages spoken)</label>
                      <textarea required className="w-full px-4 py-3 rounded-xl bg-surface-container-low border-transparent focus:bg-white focus:ring-2 focus:ring-primary-fixed focus:border-transparent transition-all outline-none" placeholder="Namaste! I am fluent in English, Hindi, and Marathi. Sharing my clinical experience..." rows={4}></textarea>
                    </div>
                  </div>

                  {/* Legitimacy Section */}
                  <div className="p-8 rounded-2xl bg-[#e5fffa] border border-[#89f5e7]/50">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                        <ShieldCheck className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-teal-900 mb-2">Safety & Trust for All</h4>
                        <p className="text-sm text-teal-800/80 mb-4 leading-relaxed">
                          DGCare maintains elite standards for both professional and community roles. To ensure the safety of our network across India, every profile undergoes a rigorous vetting process:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-2 text-sm text-teal-900 font-medium">
                            <CheckCircle2 className="text-primary" size={16} /> Aadhar KYC & Permanent Address Verification
                          </li>
                          <li className="flex items-center gap-2 text-sm text-teal-900 font-medium">
                            <CheckCircle2 className="text-primary" size={16} /> Police Clearance Certificate (PCC) Check
                          </li>
                          <li className="flex items-center gap-2 text-sm text-teal-900 font-medium">
                            <CheckCircle2 className="text-primary" size={16} /> Medical/Nursing License Audit (For Clinical roles)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button 
                      disabled={status === 'pending'}
                      className="w-full py-5 bg-primary text-white font-bold rounded-full hover:scale-[1.01] transition-all soft-shadow text-lg flex justify-center items-center gap-3 disabled:opacity-75 disabled:hover:scale-100" 
                      type="submit"
                    >
                      {status === 'pending' ? (
                        <><Loader2 className="animate-spin" size={24} /> Processing KYC Details...</>
                      ) : (
                        "Submit My Application"
                      )}
                    </button>
                    <p className="text-center text-xs text-on-surface-variant mt-6">
                      By clicking, you agree to DGCare's <a className="underline" href="#">Network Terms of Service</a> and <a className="underline" href="#">Privacy Policy</a>.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="space-y-4">
            <img src="/logo.jpg" alt="DGCare" className="h-12 w-auto grayscale opacity-80" />
            <p className="font-body text-xs uppercase tracking-widest text-slate-400">Connecting Hearts and Homes across India.</p>
          </div>
          <div className="flex flex-col gap-y-4">
            <h5 className="text-on-surface font-bold text-sm">Community</h5>
            <a className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-teal-500 transition-colors" href="#">Local Stories</a>
            <a className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-teal-500 transition-colors" href="#">Volunteer</a>
          </div>
          <div className="flex flex-col gap-y-4">
            <h5 className="text-on-surface font-bold text-sm">Legal</h5>
            <a className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-teal-500 transition-colors" href="#">Privacy</a>
            <a className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-teal-500 transition-colors" href="#">Terms</a>
          </div>
          <div className="flex flex-col gap-y-4">
            <h5 className="text-on-surface font-bold text-sm">Help</h5>
            <a className="font-body text-xs uppercase tracking-widest text-slate-500 hover:text-teal-500 transition-colors" href="#">Support</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200">
          <p className="font-body text-xs uppercase tracking-widest text-slate-400">© 2024 DGCare Platform. Quality Care Excellence.</p>
        </div>
      </footer>
    </div>
  );
}
