import os

def insert_home_btn(filepath, insertion_point, button_html):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'portal-home-btn' in content: return
    content = content.replace(insertion_point, button_html + '\n' + insertion_point)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

home_btn = '''<a href="index.html" class="w-11 h-11 rounded-full flex items-center justify-center border-2 border-borderLight dark:border-borderDark hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none mr-2 portal-home-btn" title="Back to Portal"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></a>'''

operator_logout = '''<button onclick="localStorage.removeItem('operatorAuth'); window.location.href='index.html';" class="cursor-pointer text-[10px] font-black uppercase tracking-widest bg-alert/10 text-alert border-2 border-alert/20 px-4 py-2 rounded-[12px] hover:bg-alert/20 transition-colors mr-2 flex items-center">Logout</button>'''

insert_home_btn(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\operator-console.html', '        <button id="themeToggle"', home_btn + '\n' + operator_logout)
insert_home_btn(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\dashboard.html', '      <!-- Theme Toggle -->', home_btn)
insert_home_btn(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\helper-app.html', '<button id="themeToggle"', home_btn + '\n        <button id="themeToggle"')
insert_home_btn(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\nri-app.html', '        <button id="themeToggle"', home_btn)

# index.html logic
filepath = r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
if 'operatorAuth' not in content:
    js_update = '''
    (function init() {
      const savedTheme = localStorage.getItem('bharatcare-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (savedTheme === 'dark') toggleTheme();
      
      const opLink = document.querySelector('a[href="login.html"]');
      if (opLink && localStorage.getItem('operatorAuth') === 'true') {
        opLink.href = 'operator-console.html';
      }
    })();
'''
    content = content.replace("    (function init() {\n      const savedTheme = localStorage.getItem('bharatcare-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');\n      if (savedTheme === 'dark') toggleTheme(); // it starts light by default in HTML\n    })();", js_update)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# login.html logic
filepath = r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\login.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
if 'localStorage.setItem' not in content:
    content = content.replace("window.location.href = 'operator-console.html';", "localStorage.setItem('operatorAuth', 'true');\n      window.location.href = 'operator-console.html';")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

