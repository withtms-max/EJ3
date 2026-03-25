import os
moved_files = [
    'db_init.php', 'db_init_sqlite.php', 'db_patch.php', 'fix_db.php', 
    'get_schema.php', 'insert_dummy.php', 'read_settings.php', 'test_lead.php', 
    'tmp_check_db.php', 'update_db_card_size.php', 'update_hero.php', 'update_pos.php'
]
api_dir = r'c:\Users\chs91\Desktop\THE3WEP-main\THE3WEP-main\api'
for filename in moved_files:
    filepath = os.path.join(api_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace different variations of path
        new_content = content.replace("'/includes/config.php'", "'/../includes/config.php'")
        new_content = new_content.replace("\"/includes/config.php\"", "\"/../includes/config.php\"")
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {filename}")
