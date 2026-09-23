import re

with open('public/operator-console.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix 1: Remove mb-3 from queue card to fix spacing
html = html.replace('transition-all relative mb-3"', 'transition-all relative"')

# Fix 2: Display the raw transcript instead of JSON
json_display = """      document.getElementById('card-transcript').innerHTML = `
        <p class="text-sm italic text-slate-500 mb-4">Extracted Data:</p>
        <pre class="text-[10px] whitespace-pre-wrap">${JSON.stringify(data, null, 2)}</pre>
      `;"""

transcript_display = """      document.getElementById('card-transcript').innerHTML = `
        <p class="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">${data.raw_transcript || data.summary}</p>
      `;"""

html = html.replace(json_display, transcript_display)

# Fix 3: Make sidebar buttons work with a polished Coming Soon toast instead of an ugly alert
toast_html = """
  <!-- Toast Notification -->
  <div id="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold text-sm opacity-0 pointer-events-none transition-opacity duration-300 z-[9999]">
    View not implemented
  </div>

  <script>
    function showToast(msg) {
        const toast = document.getElementById('toast');
        if(toast) {
            toast.innerText = msg;
            toast.classList.remove('opacity-0');
            toast.classList.add('opacity-100');
            setTimeout(() => {
                toast.classList.remove('opacity-100');
                toast.classList.add('opacity-0');
            }, 2500);
        } else {
            alert(msg);
        }
    }
  </script>
"""

# Add toast html right before closing body
if 'id="toast"' not in html:
    html = html.replace('</body>', toast_html + '\n</body>')

# Update the buttons to trigger showToast
html = re.sub(
    r'(<!-- Helpers -->\s*<button )class=',
    r'\1onclick="showToast(\'Helpers Directory view is coming soon.\')" class=',
    html
)

html = re.sub(
    r'(<!-- History -->\s*<button )class=',
    r'\1onclick="showToast(\'Call History view is coming soon.\')" class=',
    html
)

with open('public/operator-console.html', 'w', encoding='utf-8') as f:
    f.write(html)
