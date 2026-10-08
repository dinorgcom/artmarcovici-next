/* Femizide in Österreich – englisches Wörterbuch: Oberfläche, Regeln, Absätze.
 * Wird von i18n/translate.js verwendet (nur bei Englisch aktiv). Schlüssel = deutscher Text mit
 * normalisiertem Leerraum, genau so, wie er auf der Seite steht. Falltexte stehen in en-cases-*.js.
 *   dict     – exakte Texte (Textknoten und Attribute)
 *   keep     – Texte, die bewusst unverändert bleiben (Eigennamen u. Ä.)
 *   patterns – Regeln für zur Laufzeit zusammengesetzte Texte: [RegExp, Ersatz | function (m, h)]
 *              h.t(x) übersetzt einen Teil (sonst Original), h.r(x) übersetzt oder liefert null,
 *              h.n(x) Zahl de→en ("0,51" → "0.51"), h.p(x) Prozent ("41,4 %" → "41.4%"),
 *              h.d(x) Datum ("08.01.2019" → "08/01/2019"), h.pl(n, eins, mehrere) Plural.
 *              Eine Regel, die null liefert, gilt als nicht zutreffend.
 *   blocks   – ganze Absätze mit eingebettetem Markup: normalisierter textContent → englisches HTML
 */
(function (w) {
  "use strict";
  if (w.BIEST_LANG !== "en") return;
  var I = (w.FEMIZIDE_I18N = w.FEMIZIDE_I18N || { dict: {}, keep: [], patterns: [], blocks: {} });
  function add(o) { for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) I.dict[k] = o[k]; }

  /* ---------- Seitentitel, Kopf, Navigation ---------- */
  add({
    "Femizide in Österreich 2019–2026 · Falldatenbank": "Femicides in Austria 2019–2026 · Case database",
    "Dokumentation der Femizide in Österreich 2019–2026 auf Basis öffentlicher Medienberichte und der AÖF-Zählung, mit historischem Rückblick 1970–2025.":
      "Documentation of femicides in Austria 2019–2026 based on public media reports and the AÖF count, with a historical review 1970–2025.",
    "biest.com – Startseite": "biest.com – home page",
    "Falldatenbank · Gedenken & Dokumentation": "Case database · Remembrance & documentation",
    "Femizide in Österreich 2019–2026": "Femicides in Austria 2019–2026",
    "Dokumentation auf Basis öffentlicher Medienberichte & AÖF-Zählung · mit historischem Rückblick 1970–2025":
      "Documentation based on public media reports & the AÖF count · with a historical review 1970–2025",
    "Inhaltsverzeichnis": "Contents",
    "Statistiken": "Statistics",
    "Ursachen & Kontext": "Causes & context",
    "Historie 1970–2025": "History 1970–2025",
    "Männer & Frauen": "Men & women",
    "Karte": "Map",
    "Fallarchiv": "Case archive",
    "Kennzahlen": "Key figures"
  });

  /* ---------- Kennzahlen ---------- */
  add({
    "Fälle pro Jahr": "Cases per year",
    "Altersmedian der Opfer": "Median age of victims"
  });

  /* ---------- Statistiken nach Jahr ---------- */
  add({
    "Statistiken nach Jahr": "Statistics by year",
    "Verteilungen nach Tatjahr (2019–2026), jeweils gestapelt nach Kategorien. Die Balkenlänge entspricht der absoluten Fallzahl des Jahres; die Segmente zeigen Anzahl und Anteil (per Tooltip). „Unbekannt/keine Angabe\" ist bewusst als eigene Kategorie sichtbar — sie markiert Berichtslücken in der öffentlichen Berichterstattung.":
      "Distributions by year of the crime (2019–2026), each stacked by category. The length of a bar corresponds to the absolute number of cases in that year; the segments show count and share (via tooltip). ‘Unknown/not stated’ is deliberately shown as a category of its own — it marks gaps in public reporting.",
    "Tatwaffe": "Weapon",
    "aus Freitext-Angaben abgeleitet": "derived from free-text entries",
    "Bundesland": "Federal state",
    "Herkunftsland der Täter": "Perpetrators’ country of origin",
    "normalisiert zu Ländergruppen": "normalised into country groups",
    "Religion der Täter": "Perpetrators’ religion",
    "berichtet / statistische Annahme": "reported / statistical assumption",
    "„Statistische Annahme\" basiert ausschließlich auf den Mehrheitsverhältnissen des Herkunftslandes und ist keine Aussage über die tatsächliche Religionszugehörigkeit einer Person.":
      "‘Statistical assumption’ is based solely on the majority composition of the country of origin and is not a statement about any individual’s actual religious affiliation.",
    // Tatwaffe (Diagramm)
    "Schusswaffe": "Firearm",
    "Stichwaffe/Messer": "Stabbing weapon/knife",
    "Stumpfe Gewalt/Schlag": "Blunt force/blows",
    "Ersticken/Strangulation": "Suffocation/strangulation",
    "Vergiftung/Medikamente": "Poisoning/medication",
    "Brand": "Fire",
    "Sonstige": "Other",
    "Unbekannt": "Unknown",
    "unbekannt": "unknown",
    // Länder(gruppen)
    "Österreich": "Austria",
    "Syrien": "Syria",
    "Türkei": "Turkey",
    "Ex-Jugoslawien": "Former Yugoslavia",
    "Sonstiges Ausland": "Other foreign countries",
    // Religion (Diagramm)
    "In Berichten erwähnt": "Mentioned in reports",
    "Stat. Annahme: muslimisch": "Stat. assumption: Muslim",
    "Stat. Annahme: christlich": "Stat. assumption: Christian",
    "Keine Angabe": "Not stated",
    // Bundesländer
    "Wien": "Vienna",
    "Niederösterreich": "Lower Austria",
    "Oberösterreich": "Upper Austria",
    "Steiermark": "Styria",
    "Kärnten": "Carinthia",
    "Tirol": "Tyrol"
  });

  /* ---------- Bevölkerungsbezug ---------- */
  add({
    "Bevölkerungsbezug": "Relative to population",
    "Über-/Unterrepräsentation der Tätergruppen gegenüber der Wohnbevölkerung":
      "Over-/under-representation of perpetrator groups relative to the resident population",
    "Zeitraum": "Period",
    "Gruppe (Staatsangehörigkeit)": "Group (citizenship)",
    "Bevölkerungs­anteil": "Population share",
    "Täteranteil": "Perpetrator share",
    "Vergleich": "Comparison",
    "grau = Bevölkerung · gold = Täter": "grey = population · gold = perpetrators",
    "Täter pro 100k/Jahr": "Perpetrators per 100k/year",
    "keine Bevölkerungsbasis": "no population base",
    "k. A.": "n/a",
    "Repräsentationsindex: 1,0 = proportional zum Bevölkerungsanteil":
      "Representation index: 1.0 = proportional to the population share"
  });

  /* ---------- Tätersuizid ---------- */
  add({
    "Tätersuizid nach der Tat": "Perpetrator suicide after the crime",
    "aufgeschlüsselt nach Religion des Täters": "broken down by the perpetrator’s religion",
    "Jahr": "Year",
    "alle": "all",
    "Keine Fälle im gewählten Zeitraum.": "No cases in the selected period.",
    "keine Täter-Suizide im gewählten Zeitraum": "no perpetrator suicides in the selected period"
  });

  /* ---------- Ursachen & Kontext ---------- */
  add({
    "Ursachen und Kontext": "Causes and context",
    "Datenbasis: Medienberichte und Gerichtsberichte. „Unbekannt\" ist selbst ein Befund — es markiert Berichtslücken in der öffentlichen Berichterstattung. Alle Angaben beziehen sich auf alle dokumentierten Fälle (ungefiltert).":
      "Data basis: media reports and court reports. ‘Unknown’ is itself a finding — it marks gaps in public reporting. All figures refer to all documented cases (unfiltered).",
    "Motiv-Verteilung": "Motive distribution",
    "nach Beleglage": "by evidence base",
    "Urteil": "Verdict",
    "Ermittlungen": "Investigation",
    "Medienbericht": "Media report",
    "Transparenz: Religion der Täter": "Transparency: perpetrators’ religion",
    "Religion in Berichten erwähnt": "Religion mentioned in reports",
    "Faktisch berichtet (Medien/Gericht)": "Actually reported (media/court)",
    "Statistische Annahme aus Herkunftsland": "Statistical assumption from country of origin",
    "Annahme — keine Aussage über die tatsächliche Religionszugehörigkeit":
      "Assumption — not a statement about actual religious affiliation",
    "Weder berichtet noch statistische Annahme möglich": "Neither reported nor a statistical assumption possible",
    "Aufenthaltsstatus der Täter": "Perpetrators’ residence status",
    "Psychiatrische Evaluation": "Psychiatric evaluation",
    // Motiv-Kategorien
    "Trennung / Eifersucht": "Separation / jealousy",
    "Beziehungskonflikt": "Relationship conflict",
    "Erweiterter Suizid / Krankheit": "Murder-suicide / illness",
    "Psychische Erkrankung": "Mental illness",
    "Finanziell": "Financial",
    "Familien- / Ehre-Konflikt": "Family / honour conflict",
    "Sexualdelikt": "Sexual offence",
    "Sonstiger Konflikt": "Other conflict",
    // Aufenthaltsstatus
    "Staatsbürger:in": "Citizen",
    "Asylwerber:in": "Asylum seeker",
    "Asyl abgelehnt": "Asylum rejected",
    "Aufenthaltstitel": "Residence permit",
    // Psychiatrische Evaluation
    "Zurechnungsfähig": "Criminally responsible",
    "Vermindert zurechnungsfähig": "Diminished responsibility",
    "Zurechnungsunfähig (Einweisung)": "Not criminally responsible (committed)",
    "Keine Begutachtung berichtet": "No assessment reported"
  });

  /* ---------- Historischer Rückblick ---------- */
  add({
    "Historischer Rückblick 1970 bis 2025": "Historical review 1970 to 2025",
    "Historischer Rückblick 1970–2025": "Historical review 1970–2025",
    "Ermordete Frauen pro Jahr": "Women murdered per year",
    "Todesursachenstatistik, mit Tötungsdelikten gesamt als Referenz":
      "Cause-of-death statistics, with total homicides as reference",
    "Darstellung des Diagramms umschalten": "Switch chart view",
    "Absolute Zahlen": "Absolute numbers",
    "Pro 100.000 Einwohner": "Per 100,000 inhabitants",
    "Weibliche Opfer (Todesursachenstatistik)": "Female victims (cause-of-death statistics)",
    "Tötungsdelikte gesamt (Referenz)": "Total homicides (reference)",
    "Weibliche Opfer (Eurostat/PKS, 2008–2024)": "Female victims (Eurostat/PKS, 2008–2024)",
    "Ausgewählte Befunde der IKF-Studie „Untersuchung Frauenmorde\" (2010–2020)":
      "Selected findings of the IKF study (Institut für Konfliktforschung – Institute for Conflict Research) ‘Untersuchung Frauenmorde’ (2010–2020)",
    "familiärer Kontext": "family context",
    "der weiblichen Mordopfer (PKS § 75, 2010–2020) standen in familiärer Beziehung zum Tatverdächtigen — davon 75 % in Hausgemeinschaft.":
      "of female murder victims (PKS – Austrian police crime statistics – §\u00a075, 2010–2020) were related to the suspect by family ties — 75% of them living in the same household.",
    "Quelle: IKF-Studie Haller 2023": "Source: IKF study, Haller 2023",
    "jeder vierte Femizid per Schusswaffe": "one in four femicides committed with a firearm",
    "25 von 100 Femiziden (Justizakten 2016–2020); das Messer war inkl. Alltagsgegenstände das häufigste Mordinstrument (36-mal).":
      "25 of 100 femicides (court files 2016–2020); the knife, including everyday objects, was the most common murder weapon (36 times).",
    "psychische Erkrankung der Täter": "mental illness among perpetrators",
    "aller Femizid-Täter (n = 93); in 24 % der Fälle tatauslösend. Bei 93,5 % der Täter lagen Hochrisikoindikatoren vor.":
      "of all femicide perpetrators (n = 93); it triggered the crime in 24% of cases. High-risk indicators were present for 93.5% of perpetrators.",
    "Partnerschaftsmorde": "intimate-partner murders",
    "unter den Femiziden 2016–2020 (Beziehung/Ehe oder Ex-Beziehung); bei rund 30 % der Partnerschaftsfemizide war eine Trennung der Anlass.":
      "among femicides 2016–2020 (relationship/marriage or former relationship); in around 30% of intimate-partner femicides a separation was the trigger."
  });

  /* ---------- Vergleich Männer/Frauen ---------- */
  add({
    "Vergleich männliche und weibliche Opfer": "Comparison of male and female victims",
    "Vergleich: männliche und weibliche Opfer": "Comparison: male and female victims",
    "Ermordete Männer und Frauen pro Jahr": "Men and women murdered per year",
    "Todesursachenstatistik 1970–2025": "Cause-of-death statistics 1970–2025",
    "Pro 100.000 (geschlechtsspezifisch)": "Per 100,000 (sex-specific)",
    "Weibliche Opfer": "Female victims",
    "Männliche Opfer": "Male victims",
    "Gestorbene 1970–2025 (Männer : Frauen)": "Deaths 1970–2025 (men : women)",
    "Todesursache „Mord, tätlicher Angriff“ (WHO 1970–2001, Statistik Austria/FH-Joanneum 2002–2025).":
      "Cause of death ‘murder, assault’ (WHO 1970–2001, Statistik Austria/FH Joanneum 2002–2025).",
    "Frauenanteil 1970–2025 gesamt": "Share of women 1970–2025 overall",
    "an allen Gestorbenen des Zeitraums — trotz jahrzehntelanger Mehrheit männlicher Opfer in den 1970er- bis 1990er-Jahren.":
      "of all deaths in the period — despite male victims being in the majority for decades, from the 1970s to the 1990s.",
    "2016–2025 (Frauen : Männer)": "2016–2025 (women : men)",
    "männliche Opfer 2021": "male victims in 2021",
    "historisches Minimum der Zeitreihe (Frauen-Minimum: 17 im Jahr 2014; Maxima: 75 Männer 1984, 60 Frauen 1983).":
      "historical low of the time series (low for women: 17 in 2014; highs: 75 men in 1984, 60 women in 1983).",
    "Befunde zum Geschlechtervergleich (IKF-Studie 2023 und FH-Joanneum-Studie 2025)":
      "Findings on the comparison between the sexes (IKF study 2023 and FH Joanneum study 2025)",
    "durchgehend mehr weibliche Opfer": "consistently more female victims",
    "In Österreich war die Kriminalitätsbelastung durch Tötungsdelikte (pro 100.000, ICCS0101) für Frauen und Mädchen fünf Jahre in Folge höher als für Männer und Buben — auch absolut wurden mehr Frauen getötet. EU-weit ist das Verhältnis umgekehrt (2015–2020: Frauen 0,69 / Männer 1,22).":
      "In Austria the homicide victimisation rate (per 100,000, ICCS0101) was higher for women and girls than for men and boys for five years in a row — more women were also killed in absolute terms. Across the EU the ratio is reversed (2015–2020: women 0.69 / men 1.22).",
    "Quelle: IKF-Studie Haller 2023, Tab. A 54, S. 55 (Eurostat CRIM_HOM_SOFF)":
      "Source: IKF study, Haller 2023, table A 54, p. 55 (Eurostat CRIM_HOM_SOFF)",
    "männliche Tatverdächtige": "male suspects",
    "Bei den PKS-Mord(versuchs)fällen mit weiblichen Opfern 2010–2020 (668 von 767; 9,0 % weiblich). Bei Familientaten an Frauen sind es sogar 96,3 % männliche Tatverdächtige.":
      "In PKS cases of (attempted) murder with female victims 2010–2020 (668 of 767; 9.0% female). In killings of women within the family, as many as 96.3% of suspects are male.",
    "Quelle: IKF-Studie Haller 2023, Tab. A 10, S. 21; Abb. A 30, S. 29–30":
      "Source: IKF study, Haller 2023, table A 10, p. 21; fig. A 30, pp. 29–30",
    "Tatort Zuhause": "Crime scene: home",
    "Zwei Drittel der ermordeten Frauen, aber nur ein Drittel der ermordeten Männer sterben zu Hause (2002–2024). Männliche Opfer werden deutlich häufiger an sonstigen oder nicht näher bezeichneten Orten getötet.":
      "Two thirds of murdered women, but only one third of murdered men, die at home (2002–2024). Male victims are killed considerably more often at other or unspecified locations.",
    "Quelle: FH-Joanneum-Studie Loidl 2025, S. 98": "Source: FH Joanneum study, Loidl 2025, p. 98",
    "Strangulierung zu Hause": "Strangulation at home",
    "Erhängen, Strangulieren oder Ersticken am Tatort Zuhause 2002–2024: 77 weibliche vs. 19 männliche Gestorbene. Strangulierung betrifft 18,2 % der ermordeten Frauen, aber nur 7,1 % der Männer.":
      "Hanging, strangulation or suffocation with the home as crime scene, 2002–2024: 77 female vs. 19 male deaths. Strangulation accounts for 18.2% of murdered women but only 7.1% of murdered men.",
    "Quelle: FH-Joanneum-Studie Loidl 2025, Abb. 23–25, S. 93–98":
      "Source: FH Joanneum study, Loidl 2025, figs. 23–25, pp. 93–98",
    "9 von 10": "9 in 10",
    "Femizid-Täter sind Männer": "femicide perpetrators are men",
    "Justizakten 2016–2020: 137 ermordete Frauen und Mädchen durch 124 Täter:innen — 113 Männer (91,2 %), 9 Frauen, 2 unbekannt. Bei den 100 Femiziden (EIGE-Definition): 93 männliche Täter.":
      "Court files 2016–2020: 137 women and girls murdered by 124 perpetrators — 113 men (91.2%), 9 women, 2 unknown. Among the 100 femicides (EIGE definition): 93 male perpetrators.",
    "Quelle: IKF-Studie Haller 2023, S. 68, 77, 118–119": "Source: IKF study, Haller 2023, pp. 68, 77, 118–119",
    "Ausnahme Mädchenmorde": "Exception: murders of girls",
    "Einzige Opfergruppe mit knapper Mehrheit weiblicher Tatverdächtiger: Bei (versuchten) Morden an Mädchen unter 14 Jahren waren 16 von 31 Tatverdächtigen weiblich (vornehmlich familiärer Kontext).":
      "The only victim group with a narrow majority of female suspects: in (attempted) murders of girls under 14, 16 of 31 suspects were female (mainly in a family context).",
    "Quelle: IKF-Studie Haller 2023, Tab. A 7, S. 18": "Source: IKF study, Haller 2023, table A 7, p. 18"
  });

  /* ---------- Karte ---------- */
  add({
    "Karte der Bundesländer": "Map of the federal states",
    "Verteilung der dokumentierten Fälle auf die Bundesländer (Tatort). Klick auf ein Bundesland filtert die Fallliste im Fallarchiv; erneuter Klick hebt die Filterung wieder auf.":
      "Distribution of the documented cases across the federal states (crime scene). Clicking a federal state filters the case list in the case archive; clicking it again removes the filter.",
    "Zeigen Sie auf ein Bundesland oder wählen Sie es aus.": "Point at a federal state or select it.",
    "Geometrie: GADM 4.1, Verwaltungsebene 1 (vereinfachte SVG-Pfade, lokal eingebettet; keine externe Kartenbibliothek). Fallzahlen aus dieser Datenbank (Medienberichte/AÖF-Zählung).":
      "Geometry: GADM 4.1, administrative level 1 (simplified SVG paths, embedded locally; no external map library). Case numbers from this database (media reports/AÖF count)."
  });

  /* ---------- Fallarchiv: Suche und Filter ---------- */
  add({
    "Fallfinder": "Case finder",
    "Fall suchen: Ort, Name, Stichwort …": "Search: place, name, keyword …",
    "Durchsucht Ort, Bezirk, Bundesland, Namen, Notizen, Motiv, Methode, Gericht, Urteil und Quellen.":
      "Searches place, district, federal state, names, notes, motive, method, court, verdict and sources – in the original German case data, so German search terms work best.",
    "Filter": "Filters",
    "Alle Jahre": "All years",
    "Alle Bundesländer": "All federal states",
    "Beziehung Täter–Opfer": "Relationship to victim",
    "Alle": "All",
    "Partner (Ehe/Lebensgefährte)": "Partner (spouse/live-in partner)",
    "Ex-Partner / in Trennung": "Ex-partner / separating",
    "Familienangehöriger": "Family member",
    "Bekannter / Nachbar / Kollege": "Acquaintance / neighbour / colleague",
    "Sonstiges / keine Beziehung": "Other / no relationship",
    "Tatmittel": "Weapon/method",
    "Stich-/Schnittwaffe": "Stabbing/cutting weapon",
    "Würgen / Ersticken": "Strangling / suffocation",
    "Schläge / stumpfe Gewalt": "Beating / blunt force",
    "Brand / Explosion": "Fire / explosion",
    "Fahrzeug / Zug": "Vehicle / train",
    "Gift / Substanzen": "Poison / substances",
    "Sonstiges / unbekannt": "Other / unknown",
    "Täter-Ausgang": "Perpetrator outcome",
    "Suizid nach der Tat": "Suicide after the crime",
    "Urteil / Verfahren abgeschlossen": "Verdict / proceedings concluded",
    "Laufend / ungeklärt": "Ongoing / unresolved",
    "Motiv-Kategorie": "Motive category",
    "Religion (Täter)": "Religion (perpetrator)",
    "Statistische Annahme: mutmaßlich muslimisch": "Statistical assumption: presumed Muslim",
    "Statistische Annahme: mutmaßlich christlich": "Statistical assumption: presumed Christian",
    "Keine Angabe / keine Annahme": "Not stated / no assumption",
    "Filter zurücksetzen": "Reset filters",
    "Fallliste": "Case list",
    "Keine Fälle entsprechen den gewählten Filtern.": "No cases match the selected filters."
  });

  /* ---------- Fallarchiv: Fallkarten ---------- */
  add({
    // Monatsband links
    "JÄN": "JAN", "MÄR": "MAR", "MAI": "MAY", "OKT": "OCT", "DEZ": "DEC",
    "laufendes Verfahren": "ongoing proceedings",
    "Ort nicht berichtet": "Location not reported",
    "nicht öffentlich berichtet": "not publicly reported",
    // Beziehungskategorien (Kurzform)
    "Ex-Partner / Trennung": "Ex-partner / separation",
    "Familie": "Family",
    "Bekannter/Nachbar": "Acquaintance/neighbour",
    "Sonstiges/keine Beziehung": "Other/no relationship",
    // Tatmittel (Kurzform)
    "Würgen/Ersticken": "Strangling/suffocation",
    "Schläge/stumpfe Gewalt": "Beating/blunt force",
    "Brand/Explosion": "Fire/explosion",
    "Fahrzeug/Zug": "Vehicle/train",
    "Gift/Substanzen": "Poison/substances",
    "Sonstiges/unbekannt": "Other/unknown",
    // Ausgang
    "Urteil/Verfahren": "Verdict/proceedings",
    "Laufend/ungeklärt": "Ongoing/unresolved",
    // Detailblöcke
    "Opfer": "Victim",
    "Mutmaßlicher Täter": "Alleged perpetrator",
    "Mutmaßliche Täter": "Alleged perpetrators",
    "Tat": "Crime",
    "Verfahren": "Proceedings",
    "Analyse & Kontext": "Analysis & context",
    "Anmerkungen": "Notes",
    "Quellen": "Sources",
    "Alter": "Age",
    "Wohnort": "Place of residence",
    "Geburtsort": "Place of birth",
    "Staatsbürgerschaft": "Citizenship",
    "Herkunft": "Origin",
    "Beziehung": "Relationship",
    "Ausgang": "Outcome",
    "Datum": "Date",
    "Ort": "Place",
    "Tatmittel/-art": "Weapon/method",
    "Motiv": "Motive",
    "Betroffene Kinder": "Children affected",
    "Gericht": "Court",
    "Verfahrensdatum": "Date of proceedings",
    "Entscheid": "Decision",
    "Aufenthaltsstatus Täter": "Perpetrator’s residence status",
    "Religion Täter": "Perpetrator’s religion",
    "(aus Herkunftsland abgeleitet, keine Individualaussage)":
      "(derived from the country of origin; not a statement about the individual)",
    "⚠ Ungeprüfte Angaben (aus alternativen Medien / sozialen Netzwerken)":
      "⚠ Unverified claims (from alternative media / social networks)",
    "Die folgenden Angaben stammen aus Quellen ohne redaktionelle Prüfung (alternative Medien, soziale Netzwerke). Sie sind nicht verifiziert und werden hier nur der Transparenz halber dokumentiert.":
      "The following claims come from sources without editorial checks (alternative media, social networks). They are not verified and are documented here for the sake of transparency only.",
    "Quelle:": "Source:",
    "Fotos aus der Berichterstattung": "Photos from press coverage",
    "Pressematerial aus den verlinkten Artikeln, lokal zur Dokumentation vorgehalten; Urheber- und Persönlichkeitsrechte verbleiben bei den Medien bzw. abgebildeten Personen. Klick auf ein Bild öffnet die Originaldatei in einem neuen Tab.":
      "Press material from the linked articles, kept locally for documentation; copyright and personality rights remain with the media outlets and the persons depicted. Clicking an image opens the original file in a new tab.",
    "verpixelt (Pressebild)": "pixelated (press image)",
    "Bild in Originalgröße öffnen (neuer Tab)": "Open image at full size (new tab)",
    "Mehrfachtat": "Multiple killing"
  });

  /* ---------- Statistik der angezeigten Fälle, Fußzeile ---------- */
  add({
    "Statistik der angezeigten Fälle": "Statistics for the cases shown",
    "Aus den angezeigten (gefilterten) Fällen berechnet. Kategorisierung von Beziehung, Tatmittel und Ausgang erfolgt heuristisch anhand der dokumentierten Freitext-Angaben.":
      "Calculated from the cases shown (filtered). Relationship, weapon/method and outcome are categorised heuristically from the documented free-text entries.",
    "Fälle pro Bundesland": "Cases per federal state",
    "Altersverteilung der Opfer": "Age distribution of victims",
    "unbekannt Jahre": "unknown",
    "keine Daten": "no data",
    "Wenn Sie oder jemand in Ihrem Umfeld von Gewalt betroffen ist: Frauenhelpline 0800 222 555 (kostenlos, rund um die Uhr) · Notruf 112.":
      "If you or someone close to you is affected by violence: Frauenhelpline (women’s helpline) 0800 222 555 (free of charge, 24/7) · emergency number 112."
  });

  /* ---------- bewusst unverändert ---------- */
  I.keep.push(
    "BIEST.COM", "Dossier", "RI", "Name", "Religion", "Detail", "Afghanistan", "Salzburg", "Vorarlberg",
    "Burgenland", "FEB", "APR", "JUN", "JUL", "AUG", "SEP", "NOV", "¼", "⅔ vs. ⅓", "2016–2020", "–", "?"
  );

  /* ---------- Regeln für zusammengesetzte Texte ---------- */
  var NUM = "\\d+(?: \\d{3})*(?:,\\d+)?"; // de-AT-Zahl; Tausender-Leerzeichen ist bereits normalisiert
  function caseWord(n) { return Number(n) === 1 ? "case" : "cases"; }
  // "Fall 2019-18 (12.03.2019, Wien), Fall 2019-19 (…) und Fall …" → englische Aufzählung
  function caseList(s, h) {
    var items = [], re = /Fall (\S+) \((\d{2}\.\d{2}\.\d{4}|nicht öffentlich berichtet), (.+?)\)(?=$|, Fall | und Fall )/g, m;
    while ((m = re.exec(s))) items.push("case " + m[1] + " (" + (m[2].charAt(0) === "n" ? h.t(m[2]) : h.d(m[2])) + ", " + h.t(m[3]) + ")");
    if (!items.length) return null;
    return items.length > 1 ? items.slice(0, -1).join(", ") + " and " + items[items.length - 1] : items[0];
  }

  I.patterns.push(
    // Datum und Zahlen
    [/^(\d{2})\.(\d{2})\.(\d{4})$/, "$1/$2/$3"],
    [new RegExp("^(" + NUM + ")$"), function (m, h) { return h.n(m[1]); }],
    [new RegExp("^(" + NUM + ") : (" + NUM + ")$"), function (m, h) { return h.n(m[1]) + " : " + h.n(m[2]); }],
    [/^(\d+(?:,\d+)?) %$/, function (m, h) { return h.n(m[1]) + "%"; }],
    [/^(\d+(?:,\d+)?)×$/, function (m, h) { return h.n(m[1]) + "×"; }],
    [/^(\d+(?:–\d+|\+)?) Jahre$/, "$1 years"],

    // Kennzahlen
    [/^(\d{4}): (\d+) Fälle$/, function (m) { return m[1] + ": " + m[2] + " " + caseWord(m[2]); }],
    [/^Dokumentierte Fälle (\d{4})–(\d{4})$/, "Documented cases $1–$2"],
    [/^Täter-Suizid nach der Tat \((\d+) Fälle?\)$/, function (m) { return "Perpetrator suicide after the crime (" + m[1] + " " + caseWord(m[1]) + ")"; }],
    [/^Partner oder Ex-Partner \((\d+) Fälle?\)$/, function (m) { return "Partner or ex-partner (" + m[1] + " " + caseWord(m[1]) + ")"; }],

    // Fallkarten
    [/^Opfer (\d+|\?)$/, "Victim $1"],
    [/^Täter (\d+|\?)$/, "Perpetrator $1"],
    [/^(\d+) Fotos? aus der Berichterstattung vorhanden$/, function (m, h) { return m[1] + " " + h.pl(m[1], "photo", "photos") + " from press coverage available"; }],
    [/^(\d+) weibliche Opfer desselben Tathergangs in dieser Datenbank dokumentiert$/, "$1 female victims of the same attack documented in this database"],
    [/^Mehrfachtat \((\d+) Opfer\)$/, "Multiple killing ($1 victims)"],
    [/^Beleglage: (.+)$/, function (m, h) { return "Evidence base: " + h.t(m[1]); }],
    [/^In Berichten erwähnt — ([\s\S]+)$/, function (m, h) { return "Mentioned in reports — " + h.t(m[1]); }],
    [/^Quelle: (.+) ·$/, "Source: $1 ·"],
    [/^Gehört zum selben Tathergang wie (.+)\.$/, function (m, h) { var l = caseList(m[1], h); return l && "Part of the same attack as " + l + "."; }],
    [/^(.+) ·$/, function (m, h) { var r = h.r(m[1]); return r == null ? null : r + " ·"; }],

    // Ergebniszähler
    [/^(\d+) von (\d+) Fällen angezeigt$/, "Showing $1 of $2 cases"],
    [/^(\d+) (?:Fall|Fälle) gefunden$/, function (m) { return m[1] + " " + caseWord(m[1]) + " found"; }],

    // Bevölkerungsbezug
    [/^Gesamtzeitraum (\S+) \(Personenjahre\)$/, "Total $1 (person-years)"],
    [/^(\d+) (?:Fall|Fälle) (\d{4})–(\d{4}); Bevölkerung als Personenjahre \(Summe der Jahresanfangswerte\)\.$/,
      function (m) { return m[1] + " " + caseWord(m[1]) + " " + m[2] + "–" + m[3] + "; population as person-years (sum of the figures at the start of each year)."; }],
    [/^(\d+) (?:Fall|Fälle) (\d{4}); Bevölkerung Stichtag 1\.1\.(\d{4})(?: \(vorläufig; Staatengruppen = Proxy 1\.1\.(\d{4})\))?\.$/,
      function (m) { return m[1] + " " + caseWord(m[1]) + " in " + m[2] + "; population as of 1 January " + m[3] + (m[4] ? " (provisional; country groups = proxy 1 January " + m[4] + ")" : "") + "."; }],
    [/^Bevölkerungsanteil (.+)$/, function (m, h) { return "Population share " + h.p(m[1]); }],
    [/^Täteranteil (.+)$/, function (m, h) { return "Perpetrator share " + h.p(m[1]); }],

    // Tätersuizid
    [/^Gesamt (\d{4})–(\d{4})$/, "Total $1–$2"],
    [/^(\d+) von (\d+) Fällen \((\d+) %\) endeten mit Suizid des Täters\.$/, "$1 of $2 cases ($3%) ended with the perpetrator’s suicide."],

    // Ursachen & Kontext
    [/^davon mutmaßlich muslimisch: (\d+) · mutmaßlich christlich: (\d+)$/, "of which presumed Muslim: $1 · presumed Christian: $2"],
    [/^Die Gruppen können sich überschneiden: Bei (\d+) Fällen wurde Religion berichtet; für (\d+) Fälle liegt zusätzlich bzw\. ausschließlich eine statistische Annahme aus dem Herkunftsland vor \(Mehrheitsverhältnisse, keine Individualaussage\)\.$/,
      "The groups can overlap: religion was reported in $1 cases; for $2 cases there is, additionally or exclusively, a statistical assumption derived from the country of origin (majority composition, not a statement about the individual)."],

    // Historischer Rückblick (SVG-Tooltips und Beschriftung)
    [/^(\d{4}): ([\d,]+)( pro 100\.000 Einwohner)? weibliche Opfer \(Eurostat\/PKS\)$/,
      function (m, h) { return m[1] + ": " + h.n(m[2]) + " female victims" + (m[3] ? " per 100,000 inhabitants" : "") + " (Eurostat/PKS)"; }],
    [/^(\d{4}): ([\d,]+)( pro 100\.000 Einwohner)? weibliche Opfer, ([\d,]+)(?: pro 100\.000 Einwohner)? Tötungsdelikte gesamt \(Todesursachenstatistik\)$/,
      function (m, h) { var u = m[3] ? " per 100,000 inhabitants" : ""; return m[1] + ": " + h.n(m[2]) + " female victims" + u + ", " + h.n(m[4]) + " homicides in total" + u + " (cause-of-death statistics)"; }],
    [/^Liniendiagramm: ermordete Frauen pro Jahr (\d{4}) bis (\d{4})(, pro 100\.000 Einwohner)?$/,
      function (m) { return "Line chart: women murdered per year, " + m[1] + " to " + m[2] + (m[3] ? ", per 100,000 inhabitants" : ""); }],

    // Vergleich Männer/Frauen
    [/^(\d{4}): ([\d,]+)( pro 100\.000)? weibliche Opfer, ([\d,]+)(?: pro 100\.000)? männliche Opfer \(Frauenanteil ([\d,]+) %\)$/,
      function (m, h) { var u = m[3] ? " per 100,000" : ""; return m[1] + ": " + h.n(m[2]) + " female victims" + u + ", " + h.n(m[4]) + " male victims" + u + " (share of women " + h.n(m[5]) + "%)"; }],
    [/^(\d{4}): ([\d,]+)( pro 100\.000)? männliche Opfer, ([\d,]+)(?: pro 100\.000)? weibliche Opfer$/,
      function (m, h) { var u = m[3] ? " per 100,000" : ""; return m[1] + ": " + h.n(m[2]) + " male victims" + u + ", " + h.n(m[4]) + " female victims" + u; }],
    [/^Liniendiagramm: männliche und weibliche Tötungsopfer pro Jahr (\d{4}) bis (\d{4})(, pro 100\.000 der jeweiligen Geschlechterbevölkerung)?$/,
      function (m) { return "Line chart: male and female homicide victims per year, " + m[1] + " to " + m[2] + (m[3] ? ", per 100,000 of the respective sex-specific population" : ""); }],
    [/^([\d,]+) % Frauenanteil im aktuellen Jahrzehnt — die männlichen Zahlen sind deutlich stärker gesunken\.$/,
      function (m, h) { return h.n(m[1]) + "% share of women in the current decade — the numbers for men have fallen much more sharply."; }],

    // Karte
    [/^Alle Jahre \((\d{4})–(\d{4})\)$/, "All years ($1–$2)"],
    [/^Choropleth-Karte Österreich: dokumentierte Fälle nach Bundesland(?:, Jahr (\d{4}))?$/,
      function (m) { return "Choropleth map of Austria: documented cases by federal state" + (m[1] ? ", year " + m[1] : ""); }],
    [/^(.+): (\d+) (?:Fall|Fälle) \(([\d,]+) Prozent\), aktivieren zum Filtern$/,
      function (m, h) { return h.t(m[1]) + ": " + m[2] + " " + caseWord(m[2]) + " (" + h.n(m[3]) + " per cent), activate to filter"; }],
    [/^(.+): (\d+) (?:Fall|Fälle) \(([\d,]+) %(?:, Jahr (\d{4}))?\) — Klick filtert die Fallliste$/,
      function (m, h) { return h.t(m[1]) + ": " + m[2] + " " + caseWord(m[2]) + " (" + h.n(m[3]) + "%" + (m[4] ? ", year " + m[4] : "") + ") — click to filter the case list"; }],
    [/^(.+): (\d+) (?:Fall|Fälle) \(([\d,]+) %\)$/,
      function (m, h) { return h.t(m[1]) + ": " + m[2] + " " + caseWord(m[2]) + " (" + h.n(m[3]) + "%)"; }],
    [/^(\d+(?:–\d+| \+)?) Fälle$/, "$1 cases"],
    [/^ohne Bundesland-Angabe: (\d+)$/, "no federal state given: $1"],

    // Allgemein: "Bezeichnung (12)", "Bezeichnung: 5 (19 %)", "Bezeichnung: 5"
    [/^(.+) \((\d+)\)$/, function (m, h) { var r = h.r(m[1]); return r == null ? null : r + " (" + m[2] + ")"; }],
    [/^(.+): (\d+) \((\d+) %\)$/, function (m, h) { var r = h.r(m[1]); return r == null ? null : r + ": " + m[2] + " (" + m[3] + "%)"; }],
    [/^(.+): (\d+)$/, function (m, h) { var r = h.r(m[1]); return r == null ? null : r + ": " + m[2]; }]
  );

  /* ---------- Absätze mit eingebettetem Markup (Schlüssel = textContent, Wert = HTML) ---------- */
  var B = I.blocks;
  B["Hinweis: Alle Angaben zur Fallliste stammen aus öffentlich zugänglichen Medienberichten und der AÖF-Medienzählung. Namen werden nur genannt, wenn sie öffentlich berichtet wurden. Es gilt die Unschuldsvermutung; laufende Verfahren sind als solche gekennzeichnet. Daten ohne Gewähr auf Vollständigkeit. Die Kategorie „statistische Annahme\" zur Religion basiert ausschließlich auf Mehrheitsverhältnissen des Herkunftslandes und ist keine Aussage über die tatsächliche Religionszugehörigkeit einer Person. Ungeprüfte Angaben sind gesondert gekennzeichnet. Der historische Rückblick 1970–2025 beruht auf einer anderen Datenbasis (Todesursachenstatistik) und ist mit der Fallliste nicht gleichzusetzen."] =
    "<strong>Note:</strong> All information in the case list comes from publicly available media reports and the AÖF media count " +
    "(AÖF: Autonome Österreichische Frauenhäuser – Association of Autonomous Austrian Women’s Shelters). Names are given only " +
    "where they have been publicly reported. The presumption of innocence applies; ongoing proceedings are marked as such. " +
    "No guarantee of completeness. The ‘statistical assumption’ category for religion is based solely on the majority " +
    "composition of the country of origin and is not a statement about any individual’s actual religious affiliation. " +
    "Unverified claims are marked separately. The historical review 1970–2025 is based on a different data source " +
    "(cause-of-death statistics) and is not equivalent to the case list.";

  B["RI = Repräsentationsindex (Täteranteil ÷ Bevölkerungsanteil): 1,0 = proportional · > 1 überrepräsentiert < 1 unterrepräsentiert. „Unbekannt\" hat keine Bevölkerungsbasis und daher keinen RI."] =
    "<strong>RI</strong> = representation index (perpetrator share ÷ population share): 1.0 = proportional · " +
    "<span class=\"ri-badge ri-over\">&gt; 1 over-represented</span>\n        " +
    "<span class=\"ri-badge ri-under\">&lt; 1 under-represented</span>. ‘Unknown’ has no population base and therefore no RI.";

  B["Methodik & Vorsicht bei der Interpretation: Kleine Fallzahlen — bei Gruppen mit einstelligen Fallzahlen über 8 Jahre (z. B. Syrien 5, Türkei 4) verändert ein einziger Fall den RI massiv; die Werte schwanken stark und sind keine stabilen Risikomaße. Staatsangehörigkeit ist nicht gleich Migrationshintergrund — Eingebürgerte zählen als „Österreich\", in den Ausländergruppen sind auch in Österreich Geborene enthalten. 65 von 203 Fällen (32,0 %) ohne bekannte Täterherkunft verzerren alle Anteile, falls sie nicht zufällig verteilt sind. Femizide sind Extremereignisse (~25/Jahr bei ~9 Mio. Einwohnern); Raten pro 100.000 beruhen auf einstelligen Jahresfallzahlen. Herkunftsangaben stammen aus Medienberichten/AÖF-Listen, nicht aus amtlichen Registern; es gilt die Unschuldsvermutung — die Tabelle beschreibt mutmaßliche bzw. verurteilte Täter laut Quellenlage. Quellen: Eurostat, Tabelle migr_pop1ctz (Bevölkerung am 1. Jänner nach Staatsangehörigkeit, 2019–2025; Werte von Statistik Austria geliefert) · Statistik Austria, Bevölkerungsstand 1.1.2026 (vorläufig). Details: data/population_methodik.md."] =
    "<strong>Methodology &amp; caution in interpretation:</strong> Small numbers — for groups with single-digit case numbers over " +
    "8 years (e.g. Syria 5, Turkey 4), a single case changes the RI massively; the values fluctuate strongly and are not stable " +
    "measures of risk. <strong>Citizenship is not the same as migration background</strong> — naturalised citizens count as " +
    "‘Austria’, and the foreign groups also include people born in Austria. <strong>65 of 203 cases (32.0%) without a known " +
    "perpetrator origin</strong> distort all shares if they are not randomly distributed. Femicides are extreme events " +
    "(~25 a year in a population of ~9 million); rates per 100,000 rest on single-digit annual case numbers. Information on " +
    "origin comes from media reports/AÖF lists, not from official registers; <strong>the presumption of innocence " +
    "applies</strong> — the table describes alleged or convicted perpetrators as reported in the sources. " +
    "<span class=\"pop-src\">Sources: Eurostat, table <code>migr_pop1ctz</code> (population on 1 January by citizenship, " +
    "2019–2025; figures supplied by Statistik Austria) · Statistik Austria, population on 1 January 2026 (provisional). " +
    "Details: <code>data/population_methodik.md</code>.</span>";

  B["Methodik: Die Religionsangabe folgt der Annahme-Ebene dieser Datenbank — „statistische Annahme\" beruht ausschließlich auf den Mehrheitsverhältnissen des Herkunftslandes und ist keine Aussage über die tatsächliche Religionszugehörigkeit einer Person. Täter, die nach der Tat Suizid begehen, durchlaufen kein Strafverfahren; die Angaben beruhen daher auf Ermittlungs- und Medienberichten und nicht auf gerichtlichen Feststellungen."] =
    "<strong>Methodology:</strong> Religion follows this database’s assumption layer — ‘statistical assumption’ is based " +
    "solely on the majority composition of the country of origin and is not a statement about any individual’s actual " +
    "religious affiliation. Perpetrators who take their own lives after the crime do not go through criminal proceedings; " +
    "the information is therefore based on investigation and media reports, not on findings of a court.";

  B["Andere Datenbasis — nicht gleichzusetzen: Diese Zeitreihe stammt aus der Todesursachenstatistik (WHO Mortality Database 1970–2001 auf Basis amtlicher Meldungen der Statistik Austria; ab 2002 Statistik Austria nach ICD-10, aufbereitet in der FH-Joanneum-Studie „Morde in Österreich 1970–2024\", Loidl 2025). Sie zählt Gestorbene mit der Todesursache „Mord, tätlicher Angriff\" — sterbefallbasiert, ohne Täter-Opfer-Beziehung und ohne strafrechtliche Wertung, also keine Femizid-Statistik. Sie ist mit der Fallliste 2019–2026 (medienbasierte AÖF-Zählung) nicht gleichzusetzen. Die zusätzlich eingeblendete Eurostat-Reihe (polizeiliche Registerdaten, ICCS0101) liegt regelmäßig über der Todesursachenstatistik (z. B. 2010: 33 vs. 28 weibliche Opfer) — Grund sind unterschiedliche Deliktsbegriffe und Meldewege (Anzeigestand statt Sterbefall). Das Berichtsjahr 2025 ist ergänzt (23 weibliche von 38 Gestorbenen laut aktualisierter FH-Joanneum-Analyse, präsentiert am 25.8.2026; Detailmatrizen für 2025 noch nicht veröffentlicht). 2026 ist in der Todesursachenstatistik noch nicht verfügbar und wird nachgetragen, sobald Statistik Austria die Daten veröffentlicht."] =
    "<strong>Different data source — not equivalent:</strong> This time series comes from the <em>cause-of-death statistics</em> " +
    "(WHO Mortality Database 1970–2001, based on official reports by Statistik Austria; from 2002 Statistik Austria according " +
    "to ICD-10, compiled in the FH Joanneum study ‘Morde in Österreich 1970–2024’, Loidl 2025). It counts <em>deaths</em> with " +
    "the cause of death ‘murder, assault’ — based on deaths, without the perpetrator–victim relationship and without any " +
    "assessment under criminal law, and is therefore <strong>not</strong> a femicide statistic. It is <strong>not " +
    "equivalent</strong> to the 2019–2026 case list (media-based AÖF count). The additionally shown Eurostat series (police " +
    "records, ICCS0101) is regularly higher than the cause-of-death statistics (e.g. 2010: 33 vs. 28 female victims) — " +
    "because of differing offence definitions and reporting channels (offences recorded rather than deaths). " +
    "<strong>Reporting year 2025 has been added</strong> (23 female out of 38 deaths according to the updated FH Joanneum " +
    "analysis presented on 25 August 2026; detailed matrices for 2025 not yet published). <strong>2026 is not yet available " +
    "in the cause-of-death statistics</strong> and will be added as soon as Statistik Austria publishes the data.";

  B["Die Ansicht „pro 100.000 Einwohner\" bereinigt die Zeitreihe um das Bevölkerungswachstum (7,5 Mio. 1970 → 9,2 Mio. 2025; Bevölkerungsstand jeweils am 1. Jänner, Eurostat demo_pjan / Statistik Austria). Die Rate bezieht sich auf die Gesamtbevölkerung; Raten pro 100.000 weiblicher Bevölkerung liegen in data/history_aggregates.json vor."] =
    "The ‘per 100,000 inhabitants’ view adjusts the time series for population growth (7.5 million in 1970 → 9.2 million in " +
    "2025; population on 1 January of each year, Eurostat <code>demo_pjan</code> / Statistik Austria). The rate refers to the " +
    "total population; rates per 100,000 <em>female</em> population are available in <code>data/history_aggregates.json</code>.";

  B["Keine Falldokumentation für männliche Opfer: Für männliche Tötungsopfer existiert — anders als für Femizide — keine fallweise öffentliche Dokumentation. Der Vergleich ist daher nur aggregiert möglich: aus der Todesursachenstatistik (Gestorbene mit der Todesursache „Mord, tätlicher Angriff\"; WHO Mortality Database 1970–2001, Statistik Austria/FH-Joanneum-Studie Loidl 2025 ab 2002), aus der PKS (Eurostat ICCS0101) und aus der IKF-Studie (Haller 2023). Die männliche Jahresreihe wurde aus der Sterbetafel-Matrix Abb. 24 der FH-Joanneum-Studie extrahiert (Spaltensumme 2002–2024: exakt 504, wie in der Studie genannt) und für 1970–2001 aus derselben WHO-Quelle wie die weibliche Reihe übernommen. Wie die Historie-Reihe handelt es sich nicht um eine Femizid-Statistik."] =
    "<strong>No case documentation for male victims:</strong> Unlike femicides, male homicide victims have " +
    "<strong>no case-by-case public documentation</strong>. The comparison is therefore only possible <em>in aggregate</em>: " +
    "from the cause-of-death statistics (deaths with the cause of death ‘murder, assault’; WHO Mortality Database 1970–2001, " +
    "Statistik Austria/FH Joanneum study, Loidl 2025, from 2002), from the PKS (Austrian police crime statistics; Eurostat " +
    "ICCS0101) and from the IKF study (Haller 2023). The annual series for men was extracted from the mortality-table matrix in " +
    "fig. 24 of the FH Joanneum study (column total 2002–2024: exactly 504, as stated in the study) and, for 1970–2001, taken " +
    "from the same WHO source as the series for women. As with the historical series, this is <strong>not</strong> a femicide " +
    "statistic.";

  B["Die Ansicht „pro 100.000\" bezieht jede Reihe auf die jeweilige Geschlechterbevölkerung (männliche Opfer pro 100.000 Männer, weibliche Opfer pro 100.000 Frauen; Bevölkerungsstand jeweils am 1. Jänner, Eurostat demo_pjan). Die Trendumkehr ist sichtbar: Bis Mitte der 1990er-Jahre wurden meist mehr Männer getötet, seit Ende der 1990er-Jahre überwiegend mehr Frauen — weil die männlichen Zahlen stärker gesunken sind (FH-Joanneum-Studie, S. 77–78)."] =
    "The ‘per 100,000’ view relates each series to the respective sex-specific population (male victims per 100,000 men, " +
    "female victims per 100,000 women; population on 1 January of each year, Eurostat <code>demo_pjan</code>). The reversal of " +
    "the trend is visible: until the mid-1990s mostly more men were killed, since the late 1990s predominantly more women — " +
    "because the numbers for men have fallen more sharply (FH Joanneum study, pp. 77–78).";

  B["Datenbasis Fallliste 2019–2026: öffentlich zugängliche Medienberichte und Jahreslisten der AÖF (Autonome Österreichische Frauenhäuser). Die maschinenlesbare Gesamtdatei liegt unter data/cases.json. Historischer Rückblick 1970–2025: Todesursachenstatistik (WHO Mortality Database / Statistik Austria, aufbereitet in FH-Joanneum/Loidl 2025; Berichtsjahr 2025 laut aktualisierter Analyse, APA 25.8.2026) sowie Eurostat (ICCS0101) und IKF-Studie Haller 2023 — abweichende Zählweisen, nicht mit der Fallliste gleichzusetzen. Vergleich männliche/weibliche Opfer: data/male_comparison.json (männliche Reihe aus FH-Joanneum-Matrix Abb. 24 extrahiert, Summe 2002–2024 = 504 verifiziert; 1970–2001 WHO Mortality Database) — keine fallweise Dokumentation männlicher Opfer vorhanden."] =
    "Data source for the 2019–2026 case list: publicly available media reports and the annual lists of the AÖF (Autonome " +
    "Österreichische Frauenhäuser – Association of Autonomous Austrian Women’s Shelters). The complete machine-readable file is " +
    "at <code>data/cases.json</code>.\n      Historical review 1970–2025: cause-of-death statistics (WHO Mortality Database / " +
    "Statistik Austria, compiled in FH Joanneum/Loidl 2025; reporting year 2025 according to the updated analysis, APA " +
    "25 August 2026) as well as Eurostat (ICCS0101) and the IKF study, Haller 2023 — different counting methods, not " +
    "equivalent to the case list.\n      Comparison of male/female victims: <code>data/male_comparison.json</code> (male series " +
    "extracted from the FH Joanneum matrix, fig. 24, total 2002–2024 = 504 verified; 1970–2001 WHO Mortality Database) — no " +
    "case-by-case documentation of male victims exists.";
})(window);
