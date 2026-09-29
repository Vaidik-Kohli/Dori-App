import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace('bg-bgLight', 'bg-background')
    content = content.replace('bg-bgDark', 'bg-background')
    content = content.replace('bg-surfaceLight', 'bg-surface')
    content = content.replace('bg-surfaceDark', 'bg-surface')
    
    # Remove empty "dark: " or "dark:" at end of class string
    content = re.sub(r'\bdark:\s+', '', content)
    content = re.sub(r'\bdark:"', '"', content)
    content = re.sub(r'\bdark:\'', '\'', content)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Fixed HTML backgrounds!")
