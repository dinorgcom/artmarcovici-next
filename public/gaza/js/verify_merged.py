import re
with open('famnotes_merged.js', 'r', encoding='utf-8') as f:
    data = f.read()

# Count keys
keys = re.findall(r'^[ ]*"([^"]+)"[ ]*:', data, re.MULTILINE)
print(f'Found {len(keys)} keys in merged file')
if keys:
    print('First 10:', keys[:10])
    print('Last 10:', keys[-10:])

# Check if file ends properly
print(f'File ends with: {data.strip()[-20:]!r}')

# Check for syntax issues: count braces
open_braces = data.count('{')
close_braces = data.count('}')
print(f'Open braces: {open_braces}, Close braces: {close_braces}')
