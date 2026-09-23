import re

def fix_polling(filepath, correct_func):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace switchState with the correct function name
    content = content.replace("typeof switchState === 'function'", f"typeof {correct_func} === 'function'")
    content = content.replace("switchState(1)", f"{correct_func}(1)")
    content = content.replace("switchState(2)", f"{correct_func}(2)")
    content = content.replace("switchState(3)", f"{correct_func}(3)")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_polling(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\helper-app.html', 'showState')
fix_polling(r'c:\Users\vaidik\Downloads\Projects\Bharat Innovation LPU\App\public\nri-app.html', 'setState')
