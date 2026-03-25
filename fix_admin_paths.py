import os

def fix_paths():
    admin_path = r'c:\Users\chs91\Desktop\THE3WEP-main\THE3WEP-main\api\admin'
    
    # Files directly in api/admin/
    for filename in os.listdir(admin_path):
        if filename.endswith('.php'):
            filepath = os.path.join(admin_path, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content.replace("require_once __DIR__ . '/../includes/config.php';", "require_once __DIR__ . '/../../includes/config.php';")
            
            if content != new_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed paths in {filepath}")

    # Files in api/admin/api/
    admin_api_dir = os.path.join(admin_path, 'api')
    if os.path.exists(admin_api_dir):
        for filename in os.listdir(admin_api_dir):
            if filename.endswith('.php'):
                filepath = os.path.join(admin_api_dir, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content.replace("require_once __DIR__ . '/../../includes/config.php';", "require_once __DIR__ . '/../../../includes/config.php';")
                
                if content != new_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed paths in {filepath}")

if __name__ == '__main__':
    fix_paths()
