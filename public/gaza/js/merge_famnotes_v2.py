import re, os

os.chdir(r'C:/Users/mike/Documents/kimi/workspace/gaza-stats/site/js')

# Step 1: Extract all keys from original file
with open('famnotes.js', 'r', encoding='utf-8') as f:
    orig_data = f.read()

orig_keys = set(re.findall(r'^[ ]*"([^"]+)"[ ]*:', orig_data, re.MULTILINE))
print(f"Original keys: {len(orig_keys)}")

# Step 2: Extract keys and entries from additions file
with open('famnotes_additions.js', 'r', encoding='utf-8') as f:
    add_data = f.read()

add_keys = set(re.findall(r'^[ ]*"([^"]+)"[ ]*:', add_data, re.MULTILINE))
print(f"Addition keys: {len(add_keys)}")

# Step 3: Find duplicates
duplicates = orig_keys & add_keys
print(f"Duplicates: {len(duplicates)}")
for d in sorted(duplicates):
    print(f"  - {d}")

# Step 4: Extract entries from additions file (only non-duplicates)
new_keys = [k for k in add_keys if k not in orig_keys]
print(f"\nNew entries to add: {len(new_keys)}")

# Parse additions file to extract full entry blocks
def extract_entries(data):
    entries = {}
    lines = data.splitlines()
    current_key = None
    current_lines = []
    in_entry = False
    brace_depth = 0
    
    for line in lines:
        stripped = line.strip()
        
        if not in_entry:
            m = re.match(r'^[ ]*"([^"]+)"[ ]*:[ ]*\{[ ]*$', stripped)
            if m:
                current_key = m.group(1)
                current_lines = [line]
                in_entry = True
                brace_depth = 1
            continue
        
        current_lines.append(line)
        
        for ch in stripped:
            if ch == '{':
                brace_depth += 1
            elif ch == '}':
                brace_depth -= 1
        
        if brace_depth == 0:
            entries[current_key] = current_lines
            in_entry = False
            current_key = None
            current_lines = []
    
    return entries

add_entries = extract_entries(add_data)
print(f"Parsed entries from additions: {len(add_entries)}")

# Step 5: Build merged file
# Read original lines
orig_lines = orig_data.splitlines()

# Find the last non-empty, non-comment line before the closing `};`
# The original file ends with:
#   "key": "value" or "key": { ... }
# };

# Remove trailing empty lines and the closing `};`
# Find where the closing `};` is
closing_line_idx = None
for i in range(len(orig_lines) - 1, -1, -1):
    stripped = orig_lines[i].strip()
    if stripped == '};':
        closing_line_idx = i
        break

if closing_line_idx is None:
    print("ERROR: Could not find closing }; in original file")
    exit(1)

# Keep everything before the closing };
output_lines = orig_lines[:closing_line_idx]

# Ensure the last line ends with a comma
last_content_line = output_lines[-1].rstrip()
if not last_content_line.endswith(','):
    output_lines[-1] = last_content_line + ','

# Add a blank line for separation
output_lines.append('')

# Add new entries from additions
for i, key in enumerate(sorted(new_keys)):
    if key not in add_entries:
        print(f"Warning: {key} not found in parsed additions, skipping")
        continue
    
    lines = add_entries[key]
    # Remove trailing comma from last line if present
    last_line = lines[-1].rstrip()
    if last_line.endswith(','):
        lines[-1] = last_line[:-1]
    
    # Add comma after this entry unless it's the last one
    if i < len(new_keys) - 1:
        lines[-1] = lines[-1].rstrip() + ','
    
    output_lines.extend(lines)
    output_lines.append('')  # blank line between entries

# Add closing
output_lines.append('};')

# Write merged file
with open('famnotes_merged.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines) + '\n')

print(f"\nMerged file written: famnotes_merged.js")

# Verify
with open('famnotes_merged.js', 'r', encoding='utf-8') as f:
    merged_data = f.read()
merged_keys = set(re.findall(r'^[ ]*"([^"]+)"[ ]*:', merged_data, re.MULTILINE))
print(f"Total keys in merged file: {len(merged_keys)}")

missing = orig_keys - merged_keys
if missing:
    print(f"MISSING original keys: {len(missing)}")
    for k in sorted(missing)[:10]:
        print(f"  - {k}")
else:
    print("All original keys preserved!")

# Check brace balance
open_b = merged_data.count('{')
close_b = merged_data.count('}')
print(f"Brace balance: {open_b} open, {close_b} close")
