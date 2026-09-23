import re

with open('public/operator-console.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update queue item 1 name
content = content.replace("Vaidik's Mom", "Kaur Aunty")

# 2. Add IDs to card elements
content = content.replace(
    '<h3 class="text-base font-bold text-slate-900 dark:text-white">Kaur Aunty</h3>',
    '<h3 id="card-name" class="text-base font-bold text-slate-900 dark:text-white">Kaur Aunty</h3>'
)
content = content.replace(
    '<span class="text-xs text-slate-500 dark:text-slate-400">Amritsar, Punjab</span>',
    '<span id="card-location" class="text-xs text-slate-500 dark:text-slate-400">Amritsar, Punjab</span>'
)
content = content.replace(
    '<p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Video call screen is black. Audio works but camera shows nothing. Phone was dropped last week.</p>',
    '<p id="card-issue" class="text-sm font-semibold text-slate-800 dark:text-slate-100">Video call screen is black. Audio works but camera shows nothing. Phone was dropped last week.</p>'
)
content = content.replace(
    '<span class="text-sm font-semibold text-slate-800 dark:text-slate-100">Tech Help</span>',
    '<span id="card-category" class="text-sm font-semibold text-slate-800 dark:text-slate-100">Tech Help</span>'
)
content = content.replace(
    '<span class="text-sm font-semibold text-slate-800 dark:text-slate-100">Tech-savvy helper</span>',
    '<span id="card-skill" class="text-sm font-semibold text-slate-800 dark:text-slate-100">Tech-savvy helper</span>'
)
content = content.replace(
    '<span class="text-sm font-semibold text-slate-800 dark:text-slate-100">Tomorrow after 3:00 PM</span>',
    '<span id="card-time" class="text-sm font-semibold text-slate-800 dark:text-slate-100">Tomorrow after 3:00 PM</span>'
)
content = content.replace(
    '<span class="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Yes — Inform son</span>',
    '<span id="card-followup" class="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Yes — Inform son</span>'
)
content = content.replace(
    '<div class="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 text-xs leading-relaxed space-y-2 font-mono">',
    '<div id="card-transcript" class="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 text-xs leading-relaxed space-y-2 font-mono">'
)
content = content.replace(
    '<p class="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-3 animate-pulse">Searching for available helpers near Amritsar...</p>',
    '<p id="searching-text" class="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-3 animate-pulse">Searching for available helpers near Amritsar...</p>'
)
content = content.replace(
    '<p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Matching skill: tech-savvy helper, available tomorrow afternoon</p>',
    '<p id="matching-text" class="text-xs text-slate-400 dark:text-slate-500 mt-1">Matching skill: tech-savvy helper, available tomorrow afternoon</p>'
)

with open('public/operator-console.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Replacements done.')
