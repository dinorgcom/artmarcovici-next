import re, os

os.chdir(r'C:/Users/mike/Documents/kimi/workspace/gaza-stats/site/js')

def extract_entries(filepath):
    """Extract all key -> entry blocks from a famnotes-style JS file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()
    
    # Remove C-style comments first (simplistic)
    # But we want to preserve the actual content, so let's use regex on the raw text
    
    # Find all blocks: "key": { ... } (non-greedy, but handles nesting via counting braces)
    pattern = r'^[ ]*"([^"]+)"[ ]*:[ ]*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}[ ]*,?'
    
    # Better: use a simple state machine
    lines = data.splitlines()
    entries = {}
    current_key = None
    current_lines = []
    in_entry = False
    brace_depth = 0
    
    for line in lines:
        stripped = line.strip()
        
        # Skip comment-only lines and header lines
        if not in_entry:
            m = re.match(r'^[ ]*"([^"]+)"[ ]*:[ ]*\{[ ]*$', stripped)
            if m:
                current_key = m.group(1)
                current_lines = [line]
                in_entry = True
                brace_depth = 1
            continue
        
        # We're inside an entry
        current_lines.append(line)
        
        # Count braces
        for ch in stripped:
            if ch == '{':
                brace_depth += 1
            elif ch == '}':
                brace_depth -= 1
        
        # If brace_depth is back to 0, the entry is complete
        if brace_depth == 0:
            # Check if next non-empty line starts a new entry or closes the object
            entries[current_key] = current_lines
            in_entry = False
            current_key = None
            current_lines = []
    
    return entries

# Read both files
orig_entries = extract_entries('famnotes.js')
add_entries = extract_entries('famnotes_additions.js')

print(f"Original entries: {len(orig_entries)}")
print(f"Addition entries: {len(add_entries)}")

# Find duplicates
duplicates = set(orig_entries.keys()) & set(add_entries.keys())
print(f"Duplicates: {len(duplicates)}")
for d in sorted(duplicates):
    print(f"  - {d}")

# Build merged content
# Read original file to preserve header and structure
with open('famnotes.js', 'r', encoding='utf-8') as f:
    orig_lines = f.readlines()

# Find the closing `};` of window.FAM_NOTES
# We'll reconstruct the file: header + all original entries + new entries + closing

# Get header (everything before first entry)
header_lines = []
for i, line in enumerate(orig_lines):
    if re.match(r'^[ ]*"[^"]+"[ ]*:[ ]*\{', line.strip()):
        header_lines = orig_lines[:i]
        break

# Find the last original entry line (before closing })
# The original file ends with something like:
#   }
# };
# We need to add a comma after the last original entry if we're adding new ones

# Get the new entries that are NOT duplicates
new_keys = [k for k in add_entries.keys() if k not in orig_entries]
print(f"\nNew entries to add: {len(new_keys)}")

# Reconstruct the file
output_lines = list(header_lines)

# Add all original entries
for i, (key, lines) in enumerate(orig_entries.items()):
    # Add comma after last original entry since we'll add more
    last_line = lines[-1].rstrip()
    if last_line.endswith(','):
        output_lines.extend(lines)
    else:
        # Add comma to the last line
        lines[-1] = lines[-1].rstrip() + ',\n'
        output_lines.extend(lines)

# Add new entries
for i, key in enumerate(new_keys):
    lines = add_entries[key]
    # Remove trailing comma from the last line if present, we'll handle it
    last_line = lines[-1].rstrip()
    if last_line.endswith(','):
        lines[-1] = lines[-1].rstrip().rstrip(',') + '\n'
    
    # Add comma after this entry unless it's the very last one
    if i < len(new_keys) - 1:
        lines[-1] = lines[-1].rstrip() + ',\n'
    
    output_lines.extend(lines)

# Add closing
output_lines.append('};\n')

# Write merged file
with open('famnotes_merged.js', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print(f"\nMerged file written: famnotes_merged.js")
print(f"Total entries: {len(orig_entries) + len(new_keys)}")

# Verify by extracting keys from merged file
merged_entries = extract_entries('famnotes_merged.js')
print(f"Verification: {len(merged_entries)} entries in merged file")
