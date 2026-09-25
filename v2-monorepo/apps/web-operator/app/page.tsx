'use client';
import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { PhoneCall, ShieldAlert, CheckCircle2, UserPlus, MapPin, BrainCircuit, Activity } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function OperatorApp() {
  const [activeJob, setActiveJob] = useState<any>(null);
  const [callQueue, setCallQueue] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('new_sos', (data) => {
      setCallQueue((prev) => [...prev, data]);
      if (!activeJob) setActiveJob(data);
    });

    socketRef.current.on('job_dispatched', (data) => {
      setCallQueue((prev) => prev.map(job => job.jobId === data.jobId ? { ...job, status: 'dispatched' } : job));
      if (activeJob && activeJob.jobId === data.jobId) {
        setActiveJob({ ...activeJob, status: 'dispatched', helperName: data.helperName });
      }
    });

    return () => socketRef.current?.disconnect();
  }, [activeJob]);

  useGSAP(() => {
    if (activeJob) {
      gsap.fromTo('.triage-card', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', overwrite: true }
      );
    }
  }, [activeJob?.jobId]);

  const dispatchHelper = () => {
    if (activeJob && socketRef.current) {
      const names = ['Sunil Verma', 'Rajesh Kumar', 'Amit Singh', 'Priya Sharma'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      
      socketRef.current.emit('dispatch_helper', {
        jobId: activeJob.jobId,
        helperName: randomName
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F4F5] text-zinc-900 flex flex-col font-sans p-6 md:p-8 antialiased selection:bg-indigo-500 selection:text-white">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            <Activity size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Command Center</h1>
            <p className="text-zinc-500 font-medium text-sm">Triage & Dispatch</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-bold text-zinc-700">System Online</span>
        </div>
      </header>
      
      <div ref={containerRef} className="flex gap-6 h-[calc(100vh-130px)]">
        {/* Sidebar / Queue */}
        <div className="w-[380px] bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-zinc-100 p-6 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-lg font-bold text-zinc-800">Incoming Queue</h2>
            <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-sm font-bold">{callQueue.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {callQueue.map((job) => (
              <div 
                key={job.jobId} 
                onClick={() => setActiveJob(job)}
                className={`p-5 rounded-[24px] cursor-pointer transition-all duration-300 border-2 ${activeJob?.jobId === job.jobId ? 'bg-white border-indigo-500 shadow-[0_10px_20px_rgba(99,102,241,0.1)] scale-[1.02]' : 'bg-zinc-50 border-transparent hover:bg-zinc-100'}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg text-zinc-900">{job.parentId}</span>
                  {job.status === 'dispatched' ? (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5"><CheckCircle2 size={14}/> Dispatched</span>
                  ) : (
                    <span className="text-xs bg-rose-100 text-rose-600 px-3 py-1.5 rounded-full font-bold animate-pulse flex items-center gap-1.5"><PhoneCall size={14}/> LIVE SOS</span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 font-medium flex items-center gap-2"><MapPin size={14}/> {job.location}</p>
              </div>
            ))}
            {callQueue.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                <ShieldAlert size={48} className="mb-4 opacity-30" strokeWidth={1.5} />
                <p className="font-semibold">Queue is empty.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Triage View - Bento Grid Style */}
        <div className="flex-1 bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-zinc-100 p-8 lg:p-12 flex flex-col overflow-y-auto">
          {activeJob ? (
            <div className="flex flex-col h-full gap-8 max-w-4xl mx-auto w-full">
              {/* Header Card */}
              <div className="triage-card flex justify-between items-start pb-8 border-b border-zinc-100">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black mb-3 text-zinc-900 tracking-tight">{activeJob.parentId}</h2>
                  <p className="text-zinc-500 font-medium text-lg flex items-center gap-2"><MapPin size={18}/> {activeJob.location}</p>
                </div>
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-3 rounded-2xl font-bold tracking-wide flex items-center gap-3 shadow-sm">
                  <div className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping"></div>
                  LIVE AUDIO STREAM
                </div>
              </div>

              {/* Bento Grid */}
              <div className="triage-card flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 rounded-[32px] p-8 md:col-span-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-6 flex items-center gap-2"><BrainCircuit size={16}/> Copilot Live Triage</h3>
                  
                  {process.env.NEXT_PUBLIC_GEMINI_API_KEY ? (
                    <>
                      <p className="font-black text-3xl text-zinc-900 mb-4 tracking-tight">{activeJob.category || 'Listening...'}</p>
                      <p className="text-zinc-600 font-medium text-lg leading-relaxed">{activeJob.summary || 'Processing audio stream to determine the emergency type...'}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-black text-3xl text-zinc-900 mb-4 tracking-tight">Plumbing Emergency</p>
                      <p className="text-zinc-600 font-medium text-lg leading-relaxed">The caller states there is a burst pipe in the kitchen. Water is flooding rapidly. Requires immediate plumber dispatch.</p>
                      <div className="mt-6 inline-flex items-center gap-2 bg-amber-100/80 text-amber-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-200">
                        Simulated Triage Data
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Area */}
              <div className="triage-card mt-auto pt-8">
                {activeJob.status === 'dispatched' ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-5 shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 size={32} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-emerald-900 font-black text-2xl mb-2 tracking-tight">Response Team Deployed</h3>
                    <p className="text-emerald-700 font-medium text-lg">{activeJob.helperName} is navigating to the location.</p>
                  </div>
                ) : (
                  <button 
                    onClick={dispatchHelper}
                    className="w-full bg-black text-white font-black tracking-widest text-xl py-8 rounded-[32px] hover:bg-zinc-800 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-4 group"
                  >
                    <UserPlus size={28} className="group-hover:translate-x-1 transition-transform" />
                    DISPATCH HELPER
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-300">
              <PhoneCall size={80} className="mb-6 opacity-20" strokeWidth={1} />
              <p className="font-bold text-xl text-zinc-400">Select an incoming call.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
