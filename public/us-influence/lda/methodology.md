# BIEST · LDA-Erweiterung / LDA supplement

Abruf / retrieval: 26 October 2026. Zeitraum / reporting years: 2006–2025.

## Primärquelle und Abdeckung

Originale: https://disclosurespreview.house.gov/ . Das Repräsentantenhaus hat die Suche auf LDA.gov verlegt, hält die XML-ZIP-Archive aber ausdrücklich zum Download vor. Die Dateinamen und Veröffentlichungsstände stammen aus `data/LD/LdSearchPastFilings.json` und `data/LC/LcSearchPastFilings.json`, nicht aus geratenen Downloadpfaden. `sources.json` dokumentiert jedes Paket, Abrufdatum, Größe und SHA-256.

Alle im Index angebotenen LD-Pakete für 2006–2025 werden eingelesen; verfügbare Registrierungen 2002–2005 dienen nur als mögliche Zuordnungsbelege. Im House-Archiv ist die Zeit vor dem vierten Quartal 2012 sehr dünn besetzt. **Das ist keine Vollerhebung 2006–2025.** Vor 2013 werden keine vergleichbaren Geldrangfolgen dargestellt. Auch der größere spätere Bestand beweist weder vollständige Meldungen noch die vollständige Rekonstruktion älterer Registrierungen.

Das Registrierungs-ZIP für 2021 fehlt im veröffentlichten Index; die vier Quartalspakete 2021 sind vorhanden. 20 LD-Dateien enthielten ungültige XML-Zeichenreferenzen: Nur diese Referenzen wurden beim Lesen durch U+FFFD ersetzt; die Original-ZIPs bleiben unverändert. Eine LD-203-Datei im zweiten Halbjahr 2014 besteht ausschließlich aus Nullbytes und ist nicht auswertbar. Diese Fälle sind in den Prüfprotokollen aufgeführt.

Die ältere Senate-Downloadadresse `soprweb.senate.gov` war am Abrufdatum aus dieser Umgebung nicht auflösbar; die moderne LDA.gov-Schnittstelle lieferte beim direkten Abruf HTTP 403. Diese Zugriffsbeschränkungen betreffen unseren Abruf, nicht die Existenz der öffentlich angebotenen Daten. Der House-Archivdownload funktionierte ohne Anmeldung.

## Versionen und Beträge

LD-1 sind Registrierungen, LD-2 periodische Tätigkeitsmeldungen. Alle Originalversionen bleiben im lokalen SQLite-Prüfbestand erhalten. Für jede House-ID des Registranten-Auftraggeber-Paars, Jahr und Quartal beziehungsweise Halbjahr zählt die zuletzt unterzeichnete LD-2-Version. Bei fehlender House-ID wird ein exakter normalisierter Namensschlüssel genutzt. Bei gleichem Unterschriftszeitpunkt entscheidet die numerische Dokument-ID; dieser technische Gleichstand ist kein Nachweis einer wirtschaftlich korrekten Erklärung.

Leere Betragsfelder bleiben `null`. Ein ausdrücklich bezifferter Nullbetrag bleibt 0. Wenn zugleich `income` und `expenses` ausgefüllt sind, wird kein gemeinsamer Betrag erzeugt. Die Rohfelder bleiben lesbar. Geldbeträge sind nominale USD, selbst gemeldete Werte beziehungsweise Schätzungen und keine bankgeprüften Auszahlungen. Untergrenzen oder nicht bezifferte Beträge werden nicht als Null eingesetzt.

**Eigenmeldungen und Agenturmeldungen werden niemals addiert.** Eigenmeldungen können externe Agenturkosten bereits enthalten. Eine Eigenmeldung wird anhand der Selbstkennzeichnung oder exakt normalisierter gleicher Namen von Registrant und Auftraggeber erkannt. Manche Originalexporte, darunter AIPAC-Meldungen, führen solche Beträge im Feld `income`; die Oberfläche dokumentiert diese Abweichung ausdrücklich. Der Rohwert wird nicht als zusätzliche Agenturzahlung behandelt.

Die Rechenmethoden A (LDA), B (IRC 6033(b)(8)) und C (IRC 162(e)) bleiben getrennt filterbar. Fehlende Methodenangaben bleiben unbekannt. Die ungefilterte Ansicht ist eine Rangfolge veröffentlichter Meldewerte mit eingeschränkter Vergleichbarkeit, keine vollständig harmonisierte Kostenrechnung.

## Herkunft und ausländische Beteiligte

Die Länderansicht führt gesondert gemeldete US-Gebiete wie Puerto Rico ausdrücklich als US-Gebiet, nicht als ausländischen Staat. Die US-Hauptkategorie steht im eigenen Organisationsvergleich.

Die Länderansicht verwendet den angegebenen Hauptgeschäftssitz des Auftraggebers, ersatzweise die angegebene Anschrift. Bei Eigenmeldungen wird der Sitz des Registranten verwendet. **Diese Zuordnung sagt nichts über staatliche Finanzierung, Staatsangehörigkeit des Kapitals oder politischen Erfolg aus.**

64 historische Codevarianten wurden redaktionell anhand der Ortsangaben in Originalmeldungen abgeglichen. `country-code-map.json` enthält Beispiele und Fundstellen; dies ist keine amtlich gelieferte Codeliste. Sechs widersprüchliche Codes (IRI, ISV, MRI, MTN, SUD, COD) bleiben ohne automatische Zuordnung. Auch erkennbare Fehler des Melders werden nicht stillschweigend in bewiesene Herkunft umgedeutet.

LD-2 enthält oft nur Änderungen der Auftraggeberanschrift. Deshalb werden verfügbare frühere LD-1-Registrierungen und ausdrückliche Änderungen für dasselbe Registranten-Auftraggeber-Paar zeitlich fortgeschrieben. Registrierungen gelten ab dem angegebenen Wirksamkeitsdatum, ersatzweise dem Unterzeichnungsdatum. LD-2-Änderungen werden zum Ende ihres Berichtszeitraums berücksichtigt. Eine erst später wirksame Registrierung wird nicht zurückdatiert. Unbekannte Ausgangsdaten werden nicht aus einem Firmennamen oder einer späteren Erklärung erraten. Quellenbeleg, Originalfeld und Zuordnungsdatum stehen im Detail.

Ausländische Beteiligte werden anhand gemeldeter Namen und ausdrücklicher Hinzufügungen/Abmeldungen geführt. Eine unvollständige Vorgeschichte kann diese Rekonstruktion einschränken. Die Netzwerkansicht zählt unterschiedliche Registranten-Auftraggeber-Paare, nicht Geld. Ein Mandat kann mehrere Herkunftsländer berühren. Weder der ganze Lobbybetrag noch ein durch Eigentumsquoten berechneter Anteil wird als Zahlung dieser Länder ausgegeben. Das Beitragsfeld einer Registrierung wird nicht in jedem Folgequartal nochmals als Zahlung gezählt. Ein expliziter Nullbeitrag im Beleg bleibt von unbekannten Beiträgen unterscheidbar.

AIPAC und andere US-Organisationen bleiben im US-Vergleich. Politische Positionen sind keine ausländische Geldquelle. Ihre LDA-Meldungen werden nicht zu IRS-Gesamtbudgets oder FEC-Auszahlungen addiert. Lobbythemen, Gesetze und Behörden werden vollständig aus den ausgewerteten Belegen angezeigt; der Geldbetrag wird nicht auf einzelne Themen aufgeteilt. Die Nennung eines Gesetzes belegt allein weder die Position dazu noch einen politischen Erfolg.

## LD-203

Die gesonderten Beitragsarchive decken 2008–2025 ab. Eine eigene Verarbeitung behält pro House-Registrantennummer, Meldertyp, exakt normalisiertem vollständigem Lobbyisten-/Organisationsnamen, Jahr und Halbjahr die zuletzt unterzeichnete Version. Namensvarianten können dabei getrennt bleiben. `ld203-contributions.zip` enthält die einzelnen angegebenen Beiträge, Empfänger, Datum, Originalbetrag und die ZIP-/XML-Fundstelle. `contributions-audit.json` dokumentiert den Umfang. `contributions-verification.json` hält die vollständige Zeilenzählung und 200 Vergleiche mit Originalbeiträgen fest.

**Keine Addition zu FEC oder LD-2 und keine Ländersumme.** Dieselben Beiträge können in FEC-Daten oder Meldungen anderer Beteiligter wiederkehren. Es erfolgt keine personenübergreifende Konsolidierung. Die Empfängerfelder werden nicht als staatliche Auslandszahlungen interpretiert.

## Dateien

- `summary.json.gz`: Jahresgruppen, Rechenmethoden, Organisationsverzeichnis, Länderbeziehungen, Quellen und Abdeckung.
- `years/YYYY.json.gz`: kompakte Belegliste des jeweiligen Jahres für alle verwendeten Länder-/Organisationswerte und Netzwerkbeziehungen.
- `details/XX.json.gz`: vollständige normalisierte Details dieser Belege. XX sind die ersten zwei Hex-Zeichen des SHA-256 der Dokument-ID.
- `country-annual.csv`, `organization-annual.csv`: Jahreswerte; Teilgruppen nach Rechenmethode bleiben getrennte Zeilen.
- `audit.json`, `verification.json`: Erfassungsumfang, Fehler, unbekannte Länderbezeichnungen und Prüfungen.
- `sources.json`: Originalpakete, Veröffentlichungshinweise und Prüfsummen.

## English summary

Official House XML archives were downloaded on 26 October 2026. Pre-2013 coverage is sparse and cannot support comparable rankings. Later coverage is broader but not certified complete. The latest signed LD-2 version per registrant–client pair and period is selected; original versions remain in the local ledger. Missing amounts and country attributions remain unknown. Self-reports and agency reports overlap and must not be added. Accounting methods A/B/C remain filterable. Foreign-country comparisons use explicitly disclosed client locations reconstructed from available earlier registrations and updates, never a presumed nationality or political position. Foreign-entity relationships are counts, not allocated monetary amounts. US organizations stay domestic. LD-203 contributions are separately indexed and exported, with no addition to FEC or LD-2.

Official guidance: https://lobbyingdisclosure.house.gov/ldaguidance.pdf . For any data subsequently obtained via the Senate API, its attribution condition applies: “Senate Office of Public Records cannot vouch for the data or analyses derived from these data after the data have been retrieved from LDA.gov.” This edition's bulk files were obtained from the House archive.

Die großen JSON-Dateien sind verlustfrei gzip-komprimiert. Die Website entpackt sie beim Laden; heruntergeladene Dateien lassen sich mit üblichen Archivprogrammen öffnen.
