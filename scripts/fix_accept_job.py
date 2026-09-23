import re

with open('public/helper-app.html', 'r', encoding='utf-8') as f:
    helper = f.read()

helper = helper.replace("""    function acceptJob() {
      showState(2);
    }""", """    function acceptJob() {
      updateJobStatus('en_route');
    }""")

with open('public/helper-app.html', 'w', encoding='utf-8') as f:
    f.write(helper)
