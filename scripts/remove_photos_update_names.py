import os

files = {
    'public/dashboard.html': 'dashboard',
    'public/operator-console.html': 'operator',
    'public/helper-app.html': 'helper',
    'public/nri-app.html': 'nri'
}

def replace_in_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Names
    content = content.replace("Kaur Aunty", "Gurleen Kaur")
    content = content.replace("Sharma Uncle", "Rajesh Sharma")
    content = content.replace("Mehra Aunty", "Anita Mehra")
    content = content.replace("Gupta Aunty", "Sunita Gupta")
    
    # 2. Photos - Dashboard
    # <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Rajesh Kumar" class="w-16 h-16 rounded-full object-cover border-2 border-primary">
    content = content.replace(
        '<img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Rajesh Kumar" class="w-16 h-16 rounded-full object-cover border-2 border-primary">',
        '<div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-primary flex items-center justify-center text-xl font-black text-slate-500">RK</div>'
    )
    
    # 3. Photos - NRI App
    # <img src="https://i.pravatar.cc/150?img=5" alt="Mom" class="w-full h-full object-cover">
    content = content.replace(
        '<img src="https://i.pravatar.cc/150?img=5" alt="Mom" class="w-full h-full object-cover">',
        '<div class="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-black text-slate-500">GK</div>'
    )
    
    # Replace Mom's Status with Gurleen's Status or keep Mom's Status? User said "Change the names from Proper Nouns. Dont make it Kau Autny, Do Gurleen Kaur etc." 
    # I'll change "Mom's Status" to "Gurleen's Status"
    content = content.replace("Mom's Status", "Gurleen's Status")
    content = content.replace("Operator spoke to Mom", "Operator spoke to Gurleen")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filepath in files.keys():
    replace_in_file(filepath)
    
print("Replaced names and removed photos.")
