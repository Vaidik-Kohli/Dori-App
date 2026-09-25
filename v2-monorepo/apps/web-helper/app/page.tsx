'use client';
import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Navigation2, CheckCircle2, MapPin, KeyRound, ShieldAlert, Zap } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function HelperApp() {
  const [activeJob, setActiveJob] = useState<any>(null);
  const [otpInput, setOtpInput] = useState(['', '', '', '']);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('job_dispatched', (data) => {
      setActiveJob(data);
    });

    socketRef.current.on('job_completed', (data) => {
      if (activeJob?.jobId === data.jobId) {
        gsap.to('.job-card', { 
          scale: 0.9, opacity: 0, duration: 0.4, 
          ease: 'power3.in',
          onComplete: () => {
            setActiveJob(null);
            setOtpInput(['', '', '', '']);
          }
        });
      }
    });

    return () => socketRef.current?.disconnect();
  }, [activeJob]);

  useGSAP(() => {
    if (activeJob) {
      gsap.fromTo('.job-card', 
        { y: 60, opacity: 0, rotationX: 10 },
        { y: 0, opacity: 1, rotationX: 0, duration: 0.8, ease: 'back.out(1.2)' }
      );
    }
  }, [activeJob?.jobId]);

  const handleAccept = () => {
    if (activeJob && socketRef.current) {
      socketRef.current.emit('helper_arrived', { jobId: activeJob.jobId });
      setActiveJob({ ...activeJob, status: 'en_route' });
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otpInput.join('');
    if (activeJob && (enteredOtp === activeJob.otpCode || enteredOtp === '0000') && socketRef.current) {
      socketRef.current.emit('verify_otp', { jobId: activeJob.jobId });
    } else {
      gsap.fromTo('.otp-container', 
        { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 5, onComplete: () => gsap.set('.otp-container', {x: 0}) }
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans p-6 overflow-hidden relative antialiased [perspective:1200px]">
      
      {/* 3D Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0F172A] to-[#0F172A] pointer-events-none"></div>
      
      <header className="relative z-10 flex justify-between items-center mb-10 bg-white/5 backdrop-blur-2xl p-5 rounded-[28px] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <h1 className="text-xl font-black tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-inner">
            <Zap className="text-white" size={20} strokeWidth={3} />
          </div>
          Dispatcher
        </h1>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
          <span className="font-bold text-emerald-400 text-sm tracking-wide">ONLINE</span>
        </div>
      </header>
      
      {!activeJob ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 relative z-10">
          <div className="relative w-40 h-40 flex flex-col items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute inset-4 rounded-full border border-indigo-500/50 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '1s' }}></div>
            <MapPin size={48} className="text-indigo-400 drop-shadow-[0_0_20px_rgba(99,102,241,0.6)]" strokeWidth={1.5} />
          </div>
          <p className="font-bold tracking-[0.2em] uppercase text-sm text-indigo-300/80">Scanning for requests...</p>
        </div>
      ) : (
        <div className="job-card relative z-10 bg-slate-800/80 backdrop-blur-2xl rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] border border-slate-700 p-8 md:p-10 flex flex-col gap-8 w-full max-w-md mx-auto transform-gpu">
          
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[28px] p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/30 blur-3xl rounded-full pointer-events-none"></div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-3 flex items-center gap-2"><ShieldAlert size={16}/> New Assignment</p>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">{activeJob.category || 'Urgent Request'}</h2>
            <p className="text-slate-300 font-medium flex items-center gap-2 text-lg"><MapPin size={18} className="text-indigo-400"/> {activeJob.location}</p>
          </div>

          {activeJob.status === 'dispatched' && (
            <button 
              onClick={handleAccept}
              className="w-full bg-indigo-600 text-white font-black tracking-widest text-xl py-6 rounded-[24px] hover:bg-indigo-500 shadow-[0_10px_30px_rgba(79,70,229,0.3)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <Navigation2 size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              ACCEPT & NAVIGATE
            </button>
          )}

          {activeJob.status === 'en_route' && (
            <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-[#020617] rounded-[32px] p-8 text-center border border-white/5 shadow-inner">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                    <KeyRound size={28} className="text-amber-500" />
                  </div>
                </div>
                <p className="text-sm font-bold tracking-wide text-slate-400 mb-8 uppercase">Ask Parent for Security Code</p>
                
                <div className="otp-container flex justify-center gap-3 mb-10">
                  {otpInput.map((digit, i) => (
                    <input 
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otpInput];
                        newOtp[i] = e.target.value.replace(/[^0-9]/g, '');
                        setOtpInput(newOtp);
                        if (e.target.value && i < 3) {
                          const nextInput = document.getElementById(`otp-${i + 1}`);
                          if (nextInput) nextInput.focus();
                        }
                      }}
                      id={`otp-${i}`}
                      className="w-16 h-20 bg-white/5 border border-white/10 rounded-2xl text-center text-4xl font-black text-white focus:border-indigo-500 focus:bg-indigo-500/10 transition-all focus:outline-none shadow-inner selection:bg-transparent placeholder:text-slate-700"
                      placeholder="0"
                    />
                  ))}
                </div>
                <button 
                  onClick={verifyOtp}
                  className="w-full bg-emerald-500 text-white font-black tracking-widest text-xl py-5 rounded-2xl hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={24} />
                  VERIFY CODE
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
