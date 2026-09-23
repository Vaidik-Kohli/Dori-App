import os

overlay_html = """
  <!-- MOBILE BLOCKER -->
  <div id="mobileBlocker" class="fixed inset-0 z-[9999] bg-bgDark text-white hidden flex-col items-center justify-center p-6 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-alert mb-6"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
    <h1 class="text-3xl font-black mb-4">Not Permitted</h1>
    <p class="text-lg text-slate-400 font-medium max-w-sm mb-8">The Operator Console requires a desktop landscape environment. Please access this portal from a computer.</p>
    <a href="index.html" class="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">Return Home</a>
  </div>
  <style>
    @media (max-width: 768px) {
      body > *:not(#mobileBlocker) { display: none !important; }
      #mobileBlocker { display: flex !important; }
    }
  </style>
"""

def block_mobile(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'mobileBlocker' not in content:
        content = content.replace('</body>', overlay_html + '\n</body>')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

block_mobile(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\operator-console.html')
block_mobile(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\login.html')
