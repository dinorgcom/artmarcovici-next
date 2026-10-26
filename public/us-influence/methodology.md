# BIEST · Geld, Netzwerke, Amerika / Money, networks, America

Datenstand / retrieval: 2026-10-26. Untersuchungsfenster / target: 2006–2025.

Diese Ausgabe ist ein Quellenatlas mit belegten Ausschnitten und einer globalen Kontrollliste. Sie ist **keine vollständige Bilanz ausländischer Zahlungen oder politischen Einflusses**. Die Zahl der Datenzeilen ist kein Ausgabenmaß. Fehlende Beträge sind unbekannt, nicht null Dollar.

## Umfang und Quellenhierarchie

- 193 UN-Mitglieder und zwei UN-Beobachter bilden die Standardansicht. Weitere ISO-Gebiete, Kosovo, historische Herkunftsbezeichnungen, internationale Organisationen und BEA-Aggregate bleiben als gesonderte Profile verfügbar. Die Einordnung entscheidet keine Souveränitätsfrage. US-Vergleichsorganisationen bleiben im US-Profil.
- DOJ FARA: 40 amtliche Halbjahresberichte 2006–2025, automatisierte Extraktion mit PDF-Fundstellen und Stichproben. Dies ist kein vollständiger Abgleich aller ursprünglichen Registrierungen, Supplemente, Änderungsmeldungen oder Unterauftragnehmer.
- Section 117: ein festgehaltener amtlicher XLSX-Stand bis 28.02.2025. 2025 ist unvollständig; spätere Nachmeldungen können frühere Jahre ändern. Neuere Portal-Daten waren im Arbeitszugang nicht abrufbar. Die gesetzliche Meldegrenze und institutionelle Selbstmeldung begrenzen die Erfassung.
- Thinktanks: ausgewählte Original-Spenderlisten von Atlantic Council (2019, 2024) und Brookings (Geschäftsjahre 2021, 2025). Keine Vollerhebung aller Thinktanks oder Länder. Die 2019–2024-Aggregate des Think Tank Funding Tracker sind zusätzliche, standardmäßig ausgeblendete Sekundärhinweise. Sie werden nicht zu primärgeprüften Zahlungen erklärt.
- BEA: US-Direktinvestitionsbestände und Nettoflüsse nach unmittelbarem ausländischem Eigentümer (2006–2025), Bestände nach letztlichem Eigentümer (2008–2025). Historische Kosten, nominale USD. Firmen, einzelne Empfänger und staatliche/private Eigentümer sind in diesen Tabellen nicht getrennt offengelegt.
- IRS: AIPAC-Formulare 990 für Geschäftsjahre 2014–2025, Originalerklärungen in der öffentlichen ProPublica-Wiedergabe. Die Wiedergabe ist kein IRS-Download. Part I, line 18 bezeichnet Organisationsaufwand, nicht ausschließlich Lobbyaufwand.
- FEC: amtliche PAC-/Parteizusammenfassungen für Zweijahreszyklen bis 2024; ausgewählt sind AIPAC PAC, United Democracy Project, JStreetPAC und U.S.-Cuba Democracy PAC. Transfers können sich überschneiden. Der Zyklus 2006 enthält 2005; 2025 ist nicht separat eingelesen. Keine vollständige Liste aller US-Interessenorganisationen.
- LDA: beim Abruf nicht zugänglich und nicht eingelesen. Alle Länder bleiben hier unbekannt. Keine Ersetzung durch geschätzte Werte.

## Dateien

`evidence.jsonl`: eine Belegzeile pro JSON-Objekt, UTF-8.
`countries.json`: Herkunftskatalog, Aliasbezeichnungen, Quellenzählungen und vorgerechnete Diagrammwerte.
`sources.json`: Quelldateien mit URL, Abrufdatum, Originaldateiname, Abdeckung und SHA-256.
`meta.json`: Umfang und bekannte Grenzen der Ausgabe.
`coverage-country-category.csv`: jede Herkunft und jede Kategorie mit Anzahl erschlossener Quellenzeilen, bezifferter Zeilen, verfügbaren Jahren und Status. Keine Zeilenanzahl ist eine Zahlungssumme.
`coverage-country-category-year.csv`: dieselbe Kontrollliste pro Jahr. Nicht jahreszuordenbare Zeilen sind in einer separaten Zeile mit leerem Jahr enthalten. FARA-Berichtsjahr und Zeitraum der Einnahmen sind verschieden.
`audit.json`: technische Datenprüfungen; belegt keine wirtschaftliche Wahrheit der Meldungen.

Die Website lädt Daten pro Land. Die CSV-Schaltfläche exportiert die aktuell gefilterten Belege. Leere CSV-Zellen stehen für fehlende Angaben; Texte, die Tabellenprogramme als Formeln lesen könnten, werden beim Webexport entschärft. JSON enthält die unveränderten Textwerte.

## Datenwörterbuch

| Feld | Bedeutung |
|---|---|
| id | Stabile Kennung innerhalb dieser festen Quelldatei; keine behördliche Transaktions-ID |
| country | Zugeordnete Herkunfts-ID, ISO alpha-2 oder `extra-…` |
| origin | Originale Herkunftsbezeichnung der Quelle |
| category | lobby, media, representation, university, thinktank, investment, domestic; LDA fehlt |
| measure | Konkrete Messgröße, siehe unten |
| amount | Nominaler USD-Quellenwert oder null. Kein automatischer Nachweis einer Zahlung |
| amountMin / amountMax | Veröffentlichte Spendenklasse; null als Obergrenze bedeutet offen |
| year | Zuordnungsjahr für Filter und Diagramme, nicht zwingend Zahlungsjahr |
| date / dateBasis | Eingang oder Vertragsbeginn bei Hochschulen; unbekannt bleibt null |
| periodStart / periodEnd | Originale oder ausdrücklich bezeichnete Periode. Nicht immer vollständig verfügbar |
| periodMonths | 6 nur bei explizit erfasster FARA-Sechsmonatsperiode |
| reportYear / reportHalf | Ausgabe des FARA-Berichts; nicht ersatzweise als Zahlungsjahr verwendet |
| recipient / principal | Empfänger und Auftraggeber/Geber laut Quelle; null, wenn unbekannt. Bei FEC/IRS bezeichnet recipient den Bezug der Gesamtausgabe, keinen Einzelzahlungsempfänger |
| governmentSource | Yes/No nur soweit ausdrücklich im Hochschulfeld gemeldet; sonst unbekannt. Eine Herkunft ist kein Beweis staatlicher Finanzierung |
| source / locator | Schlüssel ins Quellenregister plus PDF-Seite, Tabellenzelle oder Zeilenfundstelle |
| review | Extraktions-/Quellenstatus, keine Bewertung des Auftraggebers |
| cashVerified | Stets false: keine unabhängige Kontoprüfung durchgeführt |
| cashReported | Bei ausgewählten Thinktank-Listen: Empfänger bezeichnet Unterstützung als erhaltenes Geld; Bandbreite bleibt Bandbreite |
| possibleDuplicate | Spätere Section-117-Zeile hat identische Felder wie eine frühere Zeile. Echte Wiederholung möglich |
| duplicateOf | Gleichlautende FARA-Kombination aus Herkunft, Registrierung, Auftraggeber, Betrag und Periodenende |
| boundaryOverlap | Einnahmen-/Wahlzyklus enthält Teile von 2005 |
| sourceValue | Unveränderter BEA-Wert einschließlich Geheimhaltungs-/Rundungscodes; numerische Quelldaten in Millionen USD |
| useLocation | Campus lediglich textlich erwähnt oder Verwendungsort nicht trennbar. Keine Aufteilung der Betragshöhe |
| description / services | Quellentext bzw. extrahierter Auszug; keine redaktionelle Feststellung |

### Messgrößen und Regeln

1. `fara-receipts`: gemeldete Einnahmen, explizite Sechsmonatsperiode. Unklare OCR, andere Perioden oder „None Reported“ erhalten keinen Zahlenwert. Ein Nullbetrag ist nur dann 0, wenn die Quelle ausdrücklich 0 meldet. Es gibt **keine konsolidierten FARA-Ländersummen**. `fara-records` zählt vorhandene Betragsbelege nach Periodenende und berücksichtigt markierte Wiederholungen einmal. Die Leistungskategorie folgt dem Feld „Nature of Services“: Lobby/political/policy zuerst, dann media/PR/publicity/information, übrige Leistungen separat. Gemischte Kategorien werden markiert, der Geldbetrag wird nicht in geschätzte Anteile zerlegt. Mehrzeilige und fehlerhaft erkannte Leistungsbezeichnungen können die Kategorie begrenzen.
2. `university-gift`: gemeldeter Betrag nach Eingangsdatum. `university-contract`: vollständig gemeldetes Vertragsvolumen nach Beginn, ersatzweise Eingang. Mehrjährige Verträge werden **nicht** anteilig verteilt. Keine Berechnung „politischer Anteil“ oder „Auslandscampus-Anteil“. Negative Korrekturen bleiben erhalten. Feldgleiche Zeilen können in der Sensitivitätsansicht einmal gezählt werden; dies ist keine bewiesene Dublettenbereinigung.
3. `disclosed-band`: min/max einer Original-Spenderliste. Kein Mittelpunkt, keine Jahresschätzung und keine Addition über Klassen. `tracker-minimum`: Sekundärhinweis über 2019–2024; nur nach ausdrücklichem Einschalten sichtbar.
4. `fdi-parent-stock` und `fdi-ubo-stock`: alternative Herkunftsperspektiven auf Kapitalbestände, nicht addierbar. `fdi-net-flows`: jährliche Nettoflüsse, auch negativ. Keine Addition von Beständen über Jahre oder mit Zahlungs-/Lobbydaten. Geheimgehaltene `(D)` und gerundete `(*)` oder Bereichswerte bleiben unbekannt; ihre Originalcodes sind gespeichert. Als 0 veröffentlichte Tabellenzellen sind gerundete Quellenwerte, kein Beweis ökonomisch exakter Abwesenheit.
5. `organization-expenses`: IRS-Organisationsaufwand nach Geschäftsjahresende. `committee-disbursements`: FEC-Komitee-Auszahlungen im Zweijahreszyklus. Einnahmen, unabhängige Ausgaben und verbundene Transfers sind zusätzliche Originalfelder, keine hinzuzuaddierenden unabhängigen Budgets. Keine Zuordnung zum Staat Israel, Kuba oder einem anderen Land allein wegen politischer Interessen.

## Länder und zeitliche Grenzen

Schreibvarianten werden explizit im Erzeugungsskript abgebildet. England, Schottland, Wales und Nordirland sind beim Vereinigten Königreich zusammengeführt, die Originalbezeichnung bleibt erhalten. Hongkong, Macau und Taiwan sind getrennt. Die historischen Niederländischen Antillen werden nicht rückwirkend auf heutige Gebiete verteilt. Regionale BEA-Summen und internationale Organisationen bleiben eigene Kategorien und werden aus dem Länder-Rangdiagramm ausgeschlossen. Staatenlisten werden für die Navigation auf den heutigen Katalog bezogen; das bedeutet nicht, dass ein heutiger Staat in jedem Jahr 2006–2025 in identischer Form existierte.

Kein einheitliches Berichtsjahr wird aus verschiedenartigen Quellen künstlich erzeugt. Ein FARA-Bericht 2025 kann ein anderes Ende der Einnahmenperiode enthalten; Section-117-Verträge können nach 2025 enden. Unplausible oder außerhalb 2006–2025 liegende Zuordnungsjahre werden ausgeschlossen und in meta.json gezählt, nicht stillschweigend korrigiert. Zehn Hochschulzeilen ohne zuordenbares Datum bleiben als undatiert sichtbar.

## Was zur verlangten Vollständigkeit fehlt

Ein Quellenregister kann weder nicht meldepflichtige noch verdeckte Aktivitäten vollständig erfassen. Für eine globale 20-Jahres-Bilanz fehlen insbesondere: LDA-Einzelmeldungen und ausländische Muttergesellschaften, durchgehender Abgleich sämtlicher FARA-Supplemente und Korrekturen, Section-117-Stand nach Februar 2025, genaue Campus-Vertragsanlagen, alle Thinktank-Jahresberichte und gegebenenfalls Grants-Listen, IRS-Schedules und Transfers aller relevanten Organisationen, FEC-Einzeltransaktionen für 2025, Medienfinanzierung außerhalb FARA, einzelne Staatsfonds- und Unternehmensnetzwerke. Kein Land wird deshalb als vollständig erforscht bezeichnet.

Der frühere Entwurf wurde methodisch ersetzt: dessen zehn FARA-Länder und historische Hochschulaggregate sind keine geprüfte Bilanz 2006–2025. Diese Ausgabe behauptet keine Rechtsverletzung, keine Kausalwirkung auf politische Entscheidungen und enthält keinen politischen Score.

## English summary

This is an evidence atlas, not an exhaustive foreign-influence account. Missing amounts remain null/unknown. All amounts are nominal USD. FARA receipts, university gift/contract disclosures, donor bands, FDI stocks/flows, organizational expenses and PAC disbursements are separate measures. They are never added into an overall total. Source files carry retrieval dates and hashes; each row has a locator and review status. Automated PDF extraction is not manual verification of every payment. Secondary tracker leads are off by default. Every country/category is listed, including gaps. AIPAC and the selected PACs stay in the domestic US comparator, without foreign-government attribution.
