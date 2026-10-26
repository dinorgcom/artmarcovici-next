# Reproduce the US financing atlas

The deployed dataset is a fixed research snapshot dated 2026-10-26, not a live feed.
No credentials are required. Install requirements.txt in a Python virtual environment.

Run from this directory in order:

1. python download_corpus.py
2. python parse_fara.py
3. python curate_thinktanks.py
4. python build_dataset.py
5. python verify_data.py

6. Download the three additional industry workbooks listed in ranking-sources.json into raw/ (or pass their directory with --raw).
7. python build_rankings.py --raw raw
8. python verify_extensions.py --raw raw

The additional output is public/us-influence/statistics. This adds separately labelled gross FARA receipt rankings, university gift/contract rankings, BEA stocks/flows, nine industry rankings and domestic/thinktank comparison panels. It does not consolidate FARA subcontracts or claim political influence scores. The website's shared source search loads the three additional sources from statistics/sources.json.

The downloader checks SHA-256 before accepting each original. A changed upstream document requires editorial review, not silently accepting a new hash. Some source hosts may block requests; do not bypass access controls. The preserved dataset and corpus-manifest remain usable for review.

The public output is ../../public/us-influence/data. These scripts overwrite only generated dossier data, never other dossiers. Raw files and parsed intermediates are ignored by Git. Original acquisition manifests include failed and unused exploratory sources for transparency; corpus-manifest identifies the required files.

parse_fara.py performs structured extraction, not exhaustive manual verification. curate_thinktanks.py contains explicitly selected donor mappings and bands; it is not a complete global donor census. verify_data.py checks schemas, source hashes, every adopted university row against the XLSX, every numerical FARA entry against its referenced PDF page, and chart recomputation. A passing audit does not establish the economic truth of self-reported transactions.

See ../../public/us-influence/methodology.md for units, date assignment, unknown values, exclusions, coverage, duplicate sensitivity and publication limits. Do not merge or promote this research preview as a complete 2006–2025 payment balance.
