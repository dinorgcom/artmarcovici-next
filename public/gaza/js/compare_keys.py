import re

with open('famnotes.js', 'r', encoding='utf-8') as f:
    orig = f.read()
with open('famnotes_merged.js', 'r', encoding='utf-8') as f:
    merged = f.read()

orig_keys = set(re.findall(r'^[ ]*"([^"]+)"[ ]*:', orig, re.MULTILINE))
merged_keys = set(re.findall(r'^[ ]*"([^"]+)"[ ]*:', merged, re.MULTILINE))

print(f'Original keys: {len(orig_keys)}')
print(f'Merged keys: {len(merged_keys)}')

missing = orig_keys - merged_keys
if missing:
    print(f'\nMISSING from merged ({len(missing)}):')
    for k in sorted(missing):
        print(f'  - {k}')
else:
    print('\nAll original keys preserved!')

new_only = merged_keys - orig_keys
print(f'\nNew keys added: {len(new_only)}')
