import os

with open('scripts/temp_js.txt', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Fix the JS applyTheme logic to just add/remove 'dark' on html element
# and toggle icons, same as we have it.
html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bharat Care – Operator Console</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;800;900&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {{
      darkMode: 'class',
      theme: {{
        extend: {{
          fontFamily: {{
            sans: ['Figtree', 'system-ui', 'sans-serif'],
          }},
          colors: {{
            bgLight: '#FAF9F6',
            bgDark: '#0A0A0A',
            surfaceLight: '#FFFFFF',
            surfaceDark: '#171717',
            borderLight: '#E5E5E5',
            borderDark: '#262626',
            primary: '#059669',
            primaryDark: '#047857',
            alert: '#DC2626',
            alertDark: '#B91C1C',
            warning: '#F59E0B',
            blueUI: '#2563EB',
          }},
          boxShadow: {{
            'btn-3d': '0 4px 0 #047857, 0 10px 15px rgba(0,0,0,0.1)',
            'btn-3d-active': '0 0px 0 #047857, 0 2px 5px rgba(0,0,0,0.1)',
          }}
        }},
      }},
    }};
  </script>
  <style>
    body {{
      background-color: theme('colors.bgLight');
      color: #171717;
    }}
    .dark body {{
      background-color: theme('colors.bgDark');
      color: #F5F5F5;
    }}
    .btn-tactile {{
      transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    }}
    .btn-tactile:active {{
      transform: translateY(4px);
      box-shadow: theme('boxShadow.btn-3d-active');
    }}
    
    @keyframes subtle-pulse {{
      0%, 100% {{ opacity: 1; transform: scale(1); }}
      50% {{ opacity: 0.8; transform: scale(0.98); }}
    }}
    .animate-subtle-pulse {{
      animation: subtle-pulse 2s ease-in-out infinite;
    }}

    .queue-scroll::-webkit-scrollbar {{ width: 6px; }}
    .queue-scroll::-webkit-scrollbar-track {{ background: transparent; }}
    .queue-scroll::-webkit-scrollbar-thumb {{ background: #D4D4D8; border-radius: 3px; }}
    .dark .queue-scroll::-webkit-scrollbar-thumb {{ background: #3F3F46; }}
  </style>
</head>

<body class="bg-bgLight dark:bg-bgDark text-[#171717] dark:text-[#F5F5F5] antialiased h-screen flex overflow-hidden transition-colors duration-300">

  <!-- LEFT NAV RAIL -->
  <nav class="w-[80px] bg-surfaceLight dark:bg-surfaceDark border-r-2 border-borderLight dark:border-borderDark flex flex-col items-center py-6 shrink-0 transition-colors duration-300 z-10"
       role="navigation">
    <!-- Logo -->
    <div class="w-12 h-12 rounded-[14px] bg-primary flex items-center justify-center mb-8 shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
           stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    </div>

    <!-- Nav items -->
    <div class="flex flex-col items-center gap-4 flex-1 w-full px-3">
      <!-- Dashboard (active) -->
      <button class="w-full aspect-square rounded-[14px] bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
          <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
        </svg>
      </button>

      <!-- Helpers -->
      <button class="w-full aspect-square rounded-[14px] text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </button>

      <!-- History -->
      <button class="w-full aspect-square rounded-[14px] text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </button>
    </div>

    <!-- Bottom: Operator avatar -->
    <div class="mt-auto">
      <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#262626] border-2 border-borderLight dark:border-borderDark flex items-center justify-center text-sm font-black text-slate-700 dark:text-slate-200">
        RI
      </div>
    </div>
  </nav>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 flex flex-col min-w-0 bg-bgLight dark:bg-bgDark transition-colors duration-300">
    
    <!-- HEADER -->
    <header class="h-[80px] px-8 flex items-center justify-between border-b-2 border-borderLight dark:border-borderDark bg-surfaceLight dark:bg-surfaceDark shrink-0 transition-colors duration-300 z-10">
      <div class="flex items-center gap-5">
        <h1 class="text-2xl font-black tracking-tight">Live Triage Queue</h1>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-bgDark">
          <span class="w-2.5 h-2.5 rounded-full bg-primary animate-subtle-pulse shrink-0"></span>
          <span class="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">System Online</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Theme toggle -->
        <button id="themeToggle" onclick="toggleTheme()" class="w-11 h-11 rounded-full flex items-center justify-center border-2 border-borderLight dark:border-borderDark hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
          <svg id="iconSun" class="hidden w-5 h-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
          <svg id="iconMoon" class="w-5 h-5 text-slate-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
          </svg>
        </button>

        <div class="h-8 w-px bg-borderLight dark:bg-borderDark mx-2"></div>

        <div class="flex items-center gap-3">
          <span class="text-sm font-bold">Riya (Operator)</span>
        </div>
      </div>
    </header>

    <!-- GRID LAYOUT -->
    <main class="flex-1 overflow-hidden p-8">
      <div class="grid grid-cols-12 gap-8 h-full max-w-[1800px] mx-auto">

        <!-- QUEUE COLUMN -->
        <aside class="col-span-3 flex flex-col h-full">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-sm font-black uppercase tracking-widest text-slate-500">Incoming Queue</h2>
            <span class="px-2 py-1 bg-surfaceLight dark:bg-surfaceDark border-2 border-borderLight dark:border-borderDark rounded-md text-xs font-bold">4</span>
          </div>

          <div class="flex-1 space-y-3 queue-scroll overflow-y-auto pr-2">
            <!-- Queue items will be structured in JS, but we need the HTML for them -->
            
            <!-- Item 1 -->
            <button onclick="selectCall(0)" id="q-0" class="queue-card w-full text-left p-4 rounded-[16px] border-2 border-primary bg-surfaceLight dark:bg-surfaceDark transition-all relative overflow-hidden" aria-current="true">
              <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-400">Now</span>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blueUI/10 text-blueUI border border-blueUI/20">Routine</span>
              </div>
              <p class="text-base font-bold truncate">Kaur Aunty</p>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-1">Video call screen is black</p>
            </button>

            <!-- Item 2 -->
            <button onclick="selectCall(1)" id="q-1" class="queue-card w-full text-left p-4 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-surfaceLight dark:bg-surfaceDark hover:border-slate-400 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-400">2 min ago</span>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-warning/10 text-warning border border-warning/20">Urgent</span>
              </div>
              <p class="text-base font-bold truncate">Sharma Uncle</p>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-1">BP medicine refill needed</p>
            </button>

            <!-- Item 3 -->
            <button onclick="selectCall(2)" id="q-2" class="queue-card w-full text-left p-4 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-surfaceLight dark:bg-surfaceDark hover:border-slate-400 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-400">5 min ago</span>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-alert/10 text-alert border border-alert/20">Emergency</span>
              </div>
              <p class="text-base font-bold truncate">Mehra Aunty</p>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-1">Chest pain, alone at home</p>
            </button>
            
            <!-- Item 4 -->
            <button onclick="selectCall(3)" id="q-3" class="queue-card w-full text-left p-4 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-bgDark opacity-60 hover:opacity-100 transition-all">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-400">12 min ago</span>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">Done</span>
              </div>
              <p class="text-base font-bold truncate">Gupta Aunty</p>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-1">Geyser repair</p>
            </button>
          </div>
        </aside>

        <!-- CENTER COLUMN (ACTIVE CARD) -->
        <section class="col-span-6 flex flex-col h-full">
          <div class="bg-surfaceLight dark:bg-surfaceDark border-2 border-borderLight dark:border-borderDark rounded-[24px] flex flex-col h-full overflow-hidden shadow-sm">
            
            <!-- Card Header -->
            <div class="px-8 py-5 border-b-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-[#1A1A1A] flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blueUI/10 border border-blueUI/20 flex items-center justify-center text-blueUI">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
                  </svg>
                </div>
                <div>
                  <span class="text-sm font-black tracking-wide text-blueUI">AI Triage Copilot</span>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Extracted 12s ago</span>
                </div>
              </div>
              <span class="text-xs font-bold text-slate-400 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-md">Call #1047</span>
            </div>

            <!-- Card Body (Scrollable if needed) -->
            <div class="flex-1 overflow-y-auto p-8 queue-scroll">
              
              <!-- Title Row -->
              <div class="flex items-start justify-between mb-8">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-full bg-borderLight dark:bg-borderDark flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <h3 id="card-name" class="text-2xl font-black">Kaur Aunty</h3>
                    <p id="card-location" class="text-sm font-semibold text-slate-500 mt-1">Amritsar, Punjab</p>
                  </div>
                </div>
                <div id="urgencyBadge">
                  <span class="px-4 py-1.5 rounded-full text-xs font-black bg-blueUI/10 text-blueUI uppercase tracking-widest border border-blueUI/20">Routine</span>
                </div>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-2 gap-4 mb-8">
                <div class="col-span-2 p-5 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-[#1A1A1A]">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Issue Reported</p>
                  <p id="card-issue" class="text-base font-bold leading-relaxed">Video call screen is black. Audio works but camera shows nothing. Phone was dropped last week.</p>
                </div>
                
                <div class="p-5 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-[#1A1A1A]">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</p>
                  <p id="card-category" class="text-sm font-bold">Tech Help</p>
                </div>

                <div class="p-5 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-[#1A1A1A]">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Helper Skill</p>
                  <p id="card-skill" class="text-sm font-bold text-primary">Tech-savvy helper</p>
                </div>

                <div class="p-5 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-[#1A1A1A]">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Time</p>
                  <p id="card-time" class="text-sm font-bold">Tomorrow after 3:00 PM</p>
                </div>

                <div class="p-5 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-[#1A1A1A]">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Follow-up</p>
                  <p id="card-followup" class="text-sm font-bold">Yes — Inform son</p>
                </div>
              </div>

              <!-- Transcript -->
              <details class="group cursor-pointer">
                <summary class="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest select-none">
                  <svg class="w-4 h-4 transition-transform group-open:rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                  View Raw Transcript
                </summary>
                <div id="card-transcript" class="mt-4 p-5 rounded-[16px] border-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-bgDark text-sm font-medium leading-relaxed space-y-3 font-mono opacity-80">
                  <!-- Transcript injected via JS -->
                </div>
              </details>

            </div>

            <!-- Card Footer: Dispatch Action -->
            <div class="p-6 border-t-2 border-borderLight dark:border-borderDark bg-bgLight dark:bg-[#1A1A1A]">
              
              <!-- PENDING -->
              <div id="state-pending" class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-black uppercase tracking-widest text-warning">Pending Dispatch</p>
                  <p class="text-sm font-bold text-slate-500 mt-1">Ready to assign verified helper.</p>
                </div>
                <button onclick="startDispatch()" class="btn-tactile px-8 py-3.5 rounded-xl bg-primary text-white text-sm font-black shadow-btn-3d flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2">
                  Dispatch Helper
                </button>
              </div>

              <!-- SEARCHING -->
              <div id="state-searching" class="hidden flex flex-col justify-center h-[52px]">
                <div class="flex items-center gap-3">
                  <div class="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  <p id="searching-text" class="text-sm font-black text-primary">Searching for available helpers near Amritsar...</p>
                </div>
              </div>

              <!-- DISPATCHED -->
              <div id="state-dispatched" class="hidden flex items-center justify-between p-4 rounded-[16px] border-2 border-primary bg-primary/10">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-white dark:bg-black border-2 border-primary flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 00-4.8 5.766L4.743 12h-2.25a.75.75 0 000 1.5h1.993l1.83 4.271a11.21 11.21 0 004.8 5.765.75.75 0 001.032 0 11.209 11.209 0 004.8-5.766L18.784 13.5h1.966a.75.75 0 000-1.5h-2.22l-1.94-4.064a11.209 11.209 0 00-4.074-5.766zM6.5 12l1.63-3.804A9.715 9.715 0 0112 3.618a9.715 9.715 0 013.87 4.578L17.5 12h-11z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p id="matched-helper-name" class="text-base font-black text-primaryDark dark:text-primary">Matched: Rajesh Kumar</p>
                    <p class="text-xs font-bold text-primary/80 mt-0.5">OTP sent to parent.</p>
                  </div>
                </div>
                <span class="px-4 py-1.5 rounded-md bg-primary text-white text-xs font-black uppercase tracking-widest shadow-sm">Dispatched</span>
              </div>

            </div>
          </div>
        </section>

        <!-- RIGHT COLUMN (STATS) -->
        <aside class="col-span-3 flex flex-col gap-6">
          
          <div class="bg-surfaceLight dark:bg-surfaceDark border-2 border-borderLight dark:border-borderDark rounded-[24px] p-6 shadow-sm">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-5">Today's Activity</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-[16px] bg-bgLight dark:bg-[#1A1A1A] border-2 border-borderLight dark:border-borderDark text-center">
                <p class="text-3xl font-black">12</p>
                <p class="text-[10px] font-bold text-slate-500 uppercase mt-1">Total</p>
              </div>
              <div class="p-4 rounded-[16px] bg-bgLight dark:bg-[#1A1A1A] border-2 border-primary/30 text-center">
                <p class="text-3xl font-black text-primary">9</p>
                <p class="text-[10px] font-bold text-slate-500 uppercase mt-1">Done</p>
              </div>
            </div>
          </div>

          <div class="bg-surfaceLight dark:bg-surfaceDark border-2 border-borderLight dark:border-borderDark rounded-[24px] p-6 shadow-sm">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-5">Available Nearby</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-borderLight dark:bg-borderDark flex items-center justify-center font-black text-sm">RK</div>
                <div class="flex-1">
                  <p class="text-sm font-bold">Rajesh Kumar</p>
                  <p class="text-[10px] font-bold text-slate-500 uppercase">Tech, Errands</p>
                </div>
                <div class="w-3 h-3 rounded-full bg-primary border-2 border-surfaceLight dark:border-surfaceDark shadow-sm"></div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-borderLight dark:bg-borderDark flex items-center justify-center font-black text-sm">PS</div>
                <div class="flex-1">
                  <p class="text-sm font-bold">Priya Singh</p>
                  <p class="text-[10px] font-bold text-slate-500 uppercase">Medical</p>
                </div>
                <div class="w-3 h-3 rounded-full bg-primary border-2 border-surfaceLight dark:border-surfaceDark shadow-sm"></div>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </main>
  </div>
"""

with open('public/operator-console.html', 'w', encoding='utf-8') as f:
    f.write(html_content)
    f.write(js_content)

print("Redesign complete.")
