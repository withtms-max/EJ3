import os

target_file = r'c:\THE3studio\css\style.css'

new_content = """/* ==========================================================================
   THEME ARCHITECTURE (Strict Isolation)
   ========================================================================== */

:root {
  /* [PART 0] COMMON STRUCTURAL TOKENS (Shape, Timing, etc.) */
  --border-radius-lg: 38px;
  --border-radius-md: 24px;
  --border-radius-sm: 16px;
  --transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);       
  --primary: #E63946; 
}

/* --------------------------------------------------------------------------
   [PART 1] DARK THEME - THE3 NAVY/RED (Default Isle)
   -------------------------------------------------------------------------- */
body:not(.light-mode) {
  /* [Source Variables for Dark Mode] */
  --dark-bg-main: #0B1939;
  --dark-bg-soft: #12224A;
  --dark-bg-card: #182C5E;
  --dark-text-primary: #FFFFFF;
  --dark-text-secondary: rgba(255, 255, 255, 0.85);
  --dark-text-dimmed: rgba(255, 255, 255, 0.5);
  --dark-border: rgba(255, 255, 255, 0.08);
  --dark-border-strong: rgba(255, 255, 255, 0.15);
  --dark-shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.3);
  --dark-shadow-md: 0 10px 40px rgba(0, 0, 0, 0.6);
  --dark-shadow-hover: 0 20px 60px rgba(230, 57, 70, 0.25);

  /* [Functional Mappings] */
  --bg-main: var(--dark-bg-main);
  --bg-soft: var(--dark-bg-soft);
  --bg-card: var(--dark-bg-card);
  --text-primary: var(--dark-text-primary);
  --text-secondary: var(--dark-text-secondary);
  --text-dimmed: var(--dark-text-dimmed);
  --border: var(--dark-border);
  --border-strong: var(--dark-border-strong);
  --shadow-sm: var(--dark-shadow-sm);
  --shadow-md: var(--dark-shadow-md);
  --shadow-hover: var(--dark-shadow-hover);
  --accent-glow: rgba(0, 102, 255, 0.25);
}

/* --------------------------------------------------------------------------
   [PART 2] LIGHT THEME - THE3 WHITE/RED (Isolated Island) 
   -------------------------------------------------------------------------- */
body.light-mode {
  /* [Source Variables for Light Mode] */
  --light-bg-main: #F8F9FA;
  --light-bg-soft: #FFFFFF;
  --light-bg-card: #FFFFFF;
  --light-text-primary: #111111;
  --light-text-secondary: #495057;
  --light-text-dimmed: #ADB5BD;
  --light-border: rgba(0, 0, 0, 0.08);
  --light-border-strong: rgba(0, 0, 0, 0.15);
  --light-shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.05);
  --light-shadow-md: 0 10px 30px rgba(0, 0, 0, 0.08);
  --light-shadow-hover: 0 15px 45px rgba(230, 57, 70, 0.12);   

  /* [Functional Mappings] */
  --bg-main: var(--light-bg-main);
  --bg-soft: var(--light-bg-soft);
  --bg-card: var(--light-bg-card);
  --text-primary: var(--light-text-primary);
  --text-secondary: var(--light-text-secondary);
  --text-dimmed: var(--light-text-dimmed);
  --border: var(--light-border);
  --border-strong: var(--light-border-strong);
  --shadow-sm: var(--light-shadow-sm);
  --shadow-md: var(--light-shadow-md);
  --shadow-hover: var(--light-shadow-hover);
  --accent-glow: rgba(230, 57, 70, 0.1);
}
"""

try:
    with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    # Find the end of the previous scrambled Part 2 headers
    # We'll skip approximately first 100 lines or until the first main global style
    skip_until = 0
    for i, line in enumerate(lines):
        if 'body.light-mode .pkg-item span' in line or '*' in line and '{' in line and i > 50:
            skip_until = i
            break
            
    final_content = new_content + "".join(lines[skip_until:])
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("Success: Theme architecture isolated symmetrically.")
except Exception as e:
    print(f"Error: {e}")
