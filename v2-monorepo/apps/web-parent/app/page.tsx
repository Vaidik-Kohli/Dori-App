'use client';
import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PhoneCall, Mic, ShieldCheck, XCircle } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export default function ParentApp() {
  const [appState, setAppState] = useState<'idle' | 'connecting' | 'helper_assigned'>('idle');
  const [helperName, setHelperName] = useState('');
  const [otpCode, setOtpCode] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('job_dispatched', (data) => {
      setAppState('helper_assigned');
      setHelperName(data.helperName);
      setOtpCode(data.otpCode);
    });

    return () => socketRef.current?.disconnect();
  }, []);

  useGSAP(() => {
    if (appState === 'idle') {
      gsap.fromTo('.idle-view', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
      );
    } else if (appState === 'connecting') {
      gsap.fromTo('.connecting-view', 
        { scale: 0.95, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }
      );
    } else if (appState === 'helper_assigned') {
      gsap.fromTo('.assigned-view', 
        { y: 50, opacity: 0, filter: 'blur(10px)' }, 
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out', stagger: 0.1 }
      );
    }
  }, [appState]);

  const triggerSOS = async () => {
    // Button press animation
    gsap.to(buttonRef.current, { 
      scale: 0.85, 
      duration: 0.1, 
      yoyo: true, 
      repeat: 1,
      onComplete: () => setAppState('connecting')
    });

    try {
      const res = await fetch('http://localhost:3001/api/jobs/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: 'demo-parent-1', location: 'Amritsar, Punjab' })
      });
      const data = await res.json();
      
      if (data.jobId && socketRef.current) {
        socketRef.current.emit('join_job_room', data.jobId);
        startAudioStream(data.jobId);
      }
    } catch (err) {
      console.error('SOS Failed:', err);
      setAppState('idle');
    }
  };

  const startAudioStream = async (jobId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socketRef.current) {
          socketRef.current.emit('audio_chunk', { jobId, audioData: event.data });
        }
      };
      mediaRecorder.start(1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopSOS = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setAppState('idle');
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden antialiased">
      {/* Impeccable background: Deep, subtle, cinematic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-[#09090b] to-[#09090b] pointer-events-none"></div>
      
      {/* 3D Orbs / Ambient Light */}
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen"></div>

      <div ref={containerRef} className="w-full max-w-[420px] bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-[48px] p-10 flex flex-col items-center shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] relative z-10">
        
        {appState === 'idle' && (
          <div className="idle-view flex flex-col items-center w-full">
            <h1 className="text-[2.5rem] leading-none font-bold tracking-tighter mb-3 text-white">Bharat Care</h1>
            <p className="text-zinc-400 font-medium mb-16 tracking-wide uppercase text-sm">Emergency Assistance</p>
            
            <button 
              ref={buttonRef}
              onClick={triggerSOS}
              className="group relative w-72 h-72 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex flex-col items-center justify-center gap-4 transition-all focus:outline-none focus:ring-4 focus:ring-rose-500/50"
              style={{
                boxShadow: '0 20px 50px -10px rgba(225,29,72,0.6), inset 0 2px 0 rgba(255,255,255,0.3)'
              }}
            >
              <div className="absolute inset-0 rounded-full bg-rose-600 opacity-0 group-hover:animate-ping transition-opacity group-hover:opacity-30"></div>
              <PhoneCall size={64} className="text-white drop-shadow-md" strokeWidth={2} />
              <span className="text-3xl font-black uppercase tracking-widest text-white drop-shadow-sm">Call Help</span>
            </button>
            <p className="mt-12 text-zinc-500 text-sm font-medium text-center max-w-[200px]">Press to instantly connect with our care team.</p>
          </div>
        )}

        {appState === 'connecting' && (
          <div className="connecting-view flex flex-col items-center w-full">
            <div className="relative w-40 h-40 rounded-full bg-amber-500/10 flex flex-col items-center justify-center mb-10 border border-amber-500/20 shadow-[0_0_60px_rgba(245,158,11,0.15)]">
              <div className="absolute inset-0 rounded-full border-[3px] border-amber-500/30 border-t-amber-500 animate-spin"></div>
              <Mic size={40} className="text-amber-500 animate-pulse" strokeWidth={2} />
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Connecting...</h2>
            <p className="text-zinc-400 text-center mb-12 text-lg font-medium">Please wait while we route your call.</p>
            
            <button 
              onClick={stopSOS} 
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-300 font-semibold hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500 flex items-center gap-3"
            >
              <XCircle size={20} /> Cancel Request
            </button>
          </div>
        )}

        {appState === 'helper_assigned' && (
          <div className="assigned-view flex flex-col items-center w-full">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <ShieldCheck size={44} className="text-emerald-400" strokeWidth={2} />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2">Help is arriving</p>
            <h2 className="text-4xl font-black mb-10 text-white tracking-tight">{helperName}</h2>
            
            <div className="w-full bg-black/60 rounded-[32px] p-8 border border-white/5 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]">
              <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-6 text-center">Your Security OTP</p>
              <div className="flex justify-center gap-3">
                {otpCode?.split('').map((digit, i) => (
                  <span key={i} className="w-14 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl font-black border border-white/10 text-white shadow-sm">
                    {digit}
                  </span>
                )) || <span className="text-zinc-500 font-bold">Waiting...</span>}
              </div>
            </div>
            
            <button 
              onClick={stopSOS} 
              className="mt-10 px-6 py-4 bg-transparent border border-rose-500/30 text-rose-400 font-semibold rounded-2xl w-full hover:bg-rose-500/10 transition-all focus:outline-none flex justify-center items-center gap-2"
            >
              Cancel Emergency
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
