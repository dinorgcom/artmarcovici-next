# Reproduce the US assistance dossier

1. Download the four original CSV files linked by https://foreignassistance.gov/data. The full file is about 3.76 GB. `source-manifest.json` records the exact edition used here.
2. Install pandas in a Python environment.
3. Run `python scripts/us-aid/build_aid.py --raw PATH_TO_DOWNLOADS` from the project directory.
4. Inspect `public/us-aid/data/audit.json`. A nonempty `differences` list requires review before publication. File hashes record the edition; a later download may have different values and must be described as a new edition.

The build streams the file, retains negative records and keeps each transaction type separate. Country/year totals are compared with the independently published country summary. See `/us-aid/methodology.md` for definitions, limits and the example selection rule. Original downloaded files are not committed.
