'use client';
import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Activity, ShieldAlert, Navigation, CheckCircle2, MapPin, Clock } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function NriApp() {
  const [activeJob, setActiveJob] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('new_sos', (data) => {
      setActiveJob(data);
    });

    socketRef.current.on('job_dispatched', (data) => {
      if (activeJob?.jobId === data.jobId) {
        setActiveJob({ ...activeJob, status: 'dispatched', helperName: data.helperName });
      }
    });

    socketRef.current.on('job_arrived', (data) => {
      if (activeJob?.jobId === data.jobId) {
        setActiveJob({ ...activeJob, status: 'en_route' });
      }
    });

    socketRef.current.on('job_completed', (data) => {
      if (activeJob?.jobId === data.jobId) {
        setActiveJob({ ...activeJob, status: 'completed' });
      }
    });

    return () => socketRef.current?.disconnect();
  }, [activeJob]);

  useGSAP(() => {
    if (activeJob) {
      const tl = gsap.timeline();
      tl.fromTo('.dashboard-card', 
        { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power4.out' }
      );
      tl.fromTo('.timeline-item',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
        "-=0.4"
      );
    } else {
      gsap.fromTo('.normal-card', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [activeJob ? activeJob.jobId : null]);

  // Handle stage animations when status changes
  useGSAP(() => {
    if (activeJob?.status) {
      gsap.fromTo(`.stage-${activeJob.status}`, 
        { scale: 0.9, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }
  }, [activeJob?.status]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col items-center p-6 md:p-16 font-sans overflow-x-hidden antialiased selection:bg-indigo-500 selection:text-white">
      
      <header className="mb-16 w-full max-w-3xl flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-zinc-900 mb-2">Family Hub</h1>
          <p className="text-zinc-500 font-medium text-lg">Real-time telemetry and oversight.</p>
        </div>
        <div className="w-12 h-12 bg-white shadow-sm border border-zinc-200 rounded-full flex items-center justify-center">
          <Activity className="text-indigo-600" size={24} strokeWidth={2.5} />
        </div>
      </header>

      {!activeJob ? (
        <div className="normal-card bg-white rounded-[40px] p-12 border border-zinc-200 flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] w-full max-w-3xl">
          <div className="w-20 h-20 bg-emerald-50 rounded-[24px] flex items-center justify-center border border-emerald-100 shrink-0">
            <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">All Systems Normal</h2>
            <p className="text-zinc-500 font-medium text-lg">No active emergencies across your monitored locations.</p>
          </div>
        </div>
      ) : (
        <div className="dashboard-card bg-white rounded-[40px] p-10 md:p-14 border border-zinc-200 shadow-[0_30px_80px_rgba(0,0,0,0.06)] w-full max-w-3xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-50 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 relative z-10 gap-6">
            <div>
              <h2 className="text-4xl font-black text-zinc-900 flex items-center gap-4 mb-3 tracking-tight">
                <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                  <ShieldAlert className="text-rose-600 animate-pulse" size={24} strokeWidth={2.5} />
                </div>
                Active Incident
              </h2>
              <p className="text-zinc-500 font-medium text-lg flex items-center gap-2"><MapPin size={18}/> {activeJob.location}</p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 px-6 py-4 rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-1.5"><Clock size={14}/> Time Elapsed</p>
              <p className="font-black text-2xl text-zinc-800">{new Date(activeJob.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>

          <div className="relative pl-10 space-y-16 mt-8 relative z-10" ref={timelineRef}>
            {/* Minimalist Vertical Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-zinc-100 rounded-full"></div>

            {/* Stage 0 */}
            <div className="timeline-item relative flex items-start gap-8">
              <div className="w-8 h-8 rounded-full bg-rose-500 shrink-0 mt-1 ring-[10px] ring-white shadow-[0_0_0_1px_rgba(225,29,72,0.2)] z-10 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <div className="pt-1">
                <h3 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">SOS Triggered</h3>
                <p className="text-zinc-500 font-medium text-lg leading-relaxed">Assistance requested at the registered location.</p>
              </div>
            </div>

            {/* Stage 1 */}
            <div className={`timeline-item stage-dispatched relative flex items-start gap-8 transition-all duration-700 ${activeJob.status ? 'opacity-100' : 'opacity-40 grayscale'}`}>
              <div className={`w-8 h-8 rounded-full ${activeJob.status === 'dispatched' || activeJob.status === 'en_route' || activeJob.status === 'completed' ? 'bg-indigo-500 shadow-[0_0_0_1px_rgba(99,102,241,0.2)]' : 'bg-zinc-200'} shrink-0 mt-1 ring-[10px] ring-white z-10 flex items-center justify-center`}>
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <div className="pt-1">
                <h3 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">Response Dispatched</h3>
                <p className="text-zinc-500 font-medium text-lg leading-relaxed">
                  {activeJob.helperName ? <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">{activeJob.helperName}</span> : 'A verified professional'} is en route.
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className={`timeline-item stage-en_route relative flex items-start gap-8 transition-all duration-700 ${activeJob.status === 'en_route' || activeJob.status === 'completed' ? 'opacity-100' : 'opacity-40 grayscale'}`}>
              <div className={`w-8 h-8 rounded-full ${activeJob.status === 'en_route' || activeJob.status === 'completed' ? 'bg-amber-500 shadow-[0_0_0_1px_rgba(245,158,11,0.2)]' : 'bg-zinc-200'} shrink-0 mt-1 ring-[10px] ring-white z-10 flex items-center justify-center`}>
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <div className="pt-1">
                <h3 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">Arrived on Site</h3>
                <p className="text-zinc-500 font-medium text-lg leading-relaxed">Waiting for OTP security verification.</p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className={`timeline-item stage-completed relative flex items-start gap-8 transition-all duration-700 ${activeJob.status === 'completed' ? 'opacity-100' : 'opacity-40 grayscale'}`}>
              <div className={`w-8 h-8 rounded-full ${activeJob.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]' : 'bg-zinc-200'} shrink-0 mt-1 ring-[10px] ring-white z-10 flex items-center justify-center`}>
                <CheckCircle2 size={18} className="text-white" strokeWidth={3} />
              </div>
              <div className="pt-1">
                <h3 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">Incident Resolved</h3>
                <p className="text-zinc-500 font-medium text-lg leading-relaxed">The task was completed successfully and securely.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
