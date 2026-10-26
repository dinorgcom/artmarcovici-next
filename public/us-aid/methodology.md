# BIEST · US-Auslandshilfe · Erste Datenausgabe

Untersuchung: US-Haushaltsjahre 2006–2025. Abruf: 26.10.2026. Veröffentlichungsstand des Portals: 30.09.2026. Nominale USD.

## Quelle und Reproduktion

Originale: [ForeignAssistance.gov](https://foreignassistance.gov/data). Der vollständige Originaldatensatz enthält 3.997.757 logische CSV-Datenzeilen. Davon liegen 3.674.201 Zeilen innerhalb 2006–2025 und betreffen Obligations oder Disbursements. Negative Korrekturen: 386.096; fehlende Beträge im ausgewählten Ausschnitt: 0. Das bedeutet nicht, dass für jedes Land und jede Kategorie Meldungen vorliegen.

`scripts/us-aid/build_aid.py --raw <Verzeichnis der vier Original-CSV-Dateien>` erzeugt die Auswertungsdaten. Abhängigkeit: pandas. Die Quelldateien sind in `source-manifest.json` mit Abrufdatum, Bytezahl und SHA-256 dokumentiert. Der Server kann automatisierte Abrufe zurückweisen; die öffentlich angebotenen Downloads wurden über den normalen Browser bezogen. Das 3,76-GB-Original wird nicht als Teil der Website dupliziert.

## Definitionen

- **Obligations / Verpflichtungen:** rechtlich gebundene Mittel. Nicht automatisch im selben Jahr ausgezahlt.
- **Disbursements / Auszahlungen:** von der Behörde gemeldete Mittelabflüsse. Keine unabhängige Prüfung der Bankkonten.
- **Foreign Assistance Objective:** originale Unterscheidung Economic / Military. Keine eigene politische Klassifikation. USG-Sektoren sind eine separate Dimension; Peace and Security ist nicht gleichbedeutend mit Military.
- **Country:** begünstigtes Land bzw. geografische Quellenzuordnung, nicht zwingend Sitz oder Identität des Zahlungsempfängers.
- **Fiscal Year:** 1. Oktober des Vorjahres bis 30. September des benannten Jahres.
- **Current Dollar Amount:** nominale US-Dollar. Die ebenfalls vorhandenen constant-dollar-Felder werden nicht verwendet.

Primärdefinitionen: [amtliches Datenwörterbuch](https://foreignassistance.gov/static/DataDictionary_ForeignAssistancegov.pdf), [CBO: Budget Authority, Obligations and Outlays](https://www.cbo.gov/publication/57660), [DSCA: Begriffe und FMF](https://samm.dsca.mil/rcg/rcg-definitions).

## Rechenregeln

1. Auswahl der originalen Haushaltsjahre 2006 bis 2025 und der Transaktionstypen Obligations bzw. Disbursements. Kein Ersatz des Haushaltsjahres durch Transaktionsdatum.
2. Summierung pro Land, Jahr, Transaktionstyp und originalem Objective. Negative Werte bleiben enthalten. Keine eigenmächtige Entfernung ähnlich aussehender Transaktionszeilen; dafür fehlt ein sicherer eindeutiger Transaktionsschlüssel.
3. Obligations und Disbursements werden nie zusammenaddiert. Die zusammengehörigen Kategorien Economic und Military dürfen innerhalb desselben Transaktionstyps und Zeitfensters zu „gesamter erfasster Hilfe“ zusammengeführt werden. Eine nicht gemeldete Kategorie erhält dadurch keinen fiktiven Nullwert im Länderprofil.
4. Rangfolgen absteigend nach gemeldeter Summe, unter Ländern und separat geführten Gebieten. Gleichstände teilen den Wettbewerbsrang. Suchfilter verändern den Rang nicht. Ohne Daten kein Rang.
5. Historische, regionale und globale Kategorien bleiben separat. Kosovo (Quellcode CS-KM) wird als gesondert geführtes Gebiet aufgenommen; China (Tibet), ehemalige Staaten und regionale Kategorien werden nicht stillschweigend heutigen Staaten zugeteilt. Die ursprünglichen Bezeichnungen bleiben in den Dateien erhalten.
6. „World“ ist eine Quellenzuordnung für nicht geografisch enger zugeteilte Aktivitäten. Es ist kein in den Dateien wiederholtes Welt-Gesamttotal. Übergreifende Summen addieren die eindeutigen Quellenzuordnungen genau einmal.
7. Sektor- und Haushaltstiteltabellen sind alternative Aufschlüsselungen derselben Mittel. Sie dürfen nicht miteinander oder erneut mit den Ländersummen addiert werden.
8. Originalbeispiele: pro Land/Jahr/Objective/Transaktion wird die größte einzelne bezifferte CSV-Zeile ausgewählt. Das Profil zeigt bis zu vier davon aus der aktuellen Auswahl. Die Beispiele bilden kein vollständiges Projektbudget oder vollständiges Transaktionsverzeichnis ab.

## Kontrollrechnung

8.689 Länder-Jahres-Transaktionssummen wurden gegen die separat veröffentlichte `us_foreign_aid_country.csv` geprüft. Keine Differenz über die Toleranz von 1,01 USD. Der Vergleich erfolgt gegen eine unabhängig veröffentlichte Tabelle, nicht gegen dieselbe intern erzeugte Aggregation. Rundungen sind möglich. Das Prüfprotokoll dokumentiert diese Toleranz.

Die vollständige Quelldatei liefert die Zahlen der Website. USG-Sektor- und Funding-Summary wurden zusätzlich heruntergeladen und mit Hash dokumentiert; die Website addiert diese parallelen Veröffentlichungen nicht. Die Kontrollrechnung beweist Konsistenz der Veröffentlichungen, keine Vollständigkeit aller Hilfsmaßnahmen.

## Felder der Auswertung

| Feld | Bedeutung |
|---|---|
| country | Originaler Country Code |
| year | Originales Haushaltsjahr |
| transaction | Obligations oder Disbursements |
| objective | Economic oder Military; nicht selbst geschätzt |
| amount | Nominale USD, negative Werte möglich; null bei fehlender Zahl |
| count / unknown | Anzahl zugrunde liegender Originalzeilen / davon ohne Zahl |
| sector / category | Originale USG-Sektor- und Kategorienbezeichnungen |
| account / accountId | Originaler Finanzierungstitel / Treasury Account Symbol |
| agency | Verwaltende US-Behörde des Originalbeispiels |
| implementer | Gemeldeter Umsetzungspartner; kann unbenannt oder nicht der Endbegünstigte sein |
| locator | Logische CSV-Satznummer inklusive Kopfzeile als Satz 1; nicht physische Textzeile bei mehrzeiligen Feldern |

## Grenzen und weiterer Ausbau

Dies ist eine erste Datenausgabe, keine vollständige Bilanz sämtlicher Ausgaben der USA zugunsten anderer Staaten. Die Portalquelle hat ihre eigene Abgrenzung und Meldeverzögerungen. 2025 und andere jüngere Jahre können revidiert werden. Frühere Jahre können ebenfalls Korrekturen enthalten.

Nicht vollständig aufgelöst: Zuschüsse versus Darlehen/Garantien, Sachlieferungen versus liquide Zahlungen, einzelne Bewilligungen und ihre späteren Verpflichtungen/Auszahlungen, sämtliche US-Militäroperationen, Geheimprogramme, Waffenlieferungen außerhalb der erfassten Hilfsstatistik und kommerzielle Waffenverkäufe. Eine pauschale Addition öffentlich genannter „Hilfspakete“ wäre irreführend. Der weiterführende Abgleich der konkreten Israel-, Ukraine-, Ägypten- und Afghanistan-Programme mit CRS-, State- und DoD-Berichten ist noch offen.

Das Dossier behauptet keine Kausalität zwischen Hilfszahlungen und politischer Kontrolle. Es verrechnet ausgehende US-Hilfe nicht mit eingehenden Investitionen, Lobbyrechnungen oder US-Privatspendenorganisationen.

## English note

This is a first data edition based on the complete published ForeignAssistance.gov file, not a complete account of every US expenditure benefiting another country. Nominal dollars; fiscal years; obligations and disbursements kept separate. Military/economic follows the source field. Negative adjustments retained, missing values unknown. Country identifies the beneficiary, not necessarily the direct payee. Country totals reconcile against the separately published summary; this does not verify every underlying payment. Grants, loans, guarantees, in-kind aid and all defense spending are not comprehensively separated.
