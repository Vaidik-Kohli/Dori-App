import re

with open('tailwind.config.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add background and surface colors that use the CSS vars directly
content = content.replace("colors: {", "colors: {\n        background: 'rgb(var(--bg) / <alpha-value>)',\n        surface: 'rgb(var(--surface) / <alpha-value>)',")

with open('tailwind.config.js', 'w', encoding='utf-8') as f:
    f.write(content)
