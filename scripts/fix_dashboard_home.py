import os

filepath = r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\dashboard.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

home_btn = '''<a href="index.html" class="w-11 h-11 rounded-full flex items-center justify-center border-2 border-borderLight dark:border-borderDark hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none mr-2 portal-home-btn" title="Back to Portal"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></a>'''

if 'portal-home-btn' not in content:
    content = content.replace('        <button id="themeToggle"', home_btn + '\n        <button id="themeToggle"')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
