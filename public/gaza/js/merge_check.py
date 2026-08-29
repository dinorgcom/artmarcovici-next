import re, json, sys, os

os.chdir(r'C:/Users/mike/Documents/kimi/workspace/gaza-stats/site/js')

def extract_keys(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = f.read()
    # Find all keys: "key": {
    keys = re.findall(r'^[ ]*"([^"]+)"[ ]*:[ ]*\{', data, re.MULTILINE)
    return keys

keys_original = extract_keys('famnotes.js')
keys_additions = extract_keys('famnotes_additions.js')

print(f"Keys in famnotes.js: {len(keys_original)}")
print(f"Keys in famnotes_additions.js: {len(keys_additions)}")

# Find duplicates
duplicates = set(keys_original) & set(keys_additions)
print(f"\nDUPLICATES ({len(duplicates)}):")
for k in sorted(duplicates):
    print(f"  - {k}")

# Keys only in additions
only_in_additions = set(keys_additions) - set(keys_original)
print(f"\nONLY IN ADDITIONS ({len(only_in_additions)}):")
for k in sorted(only_in_additions):
    print(f"  - {k}")
