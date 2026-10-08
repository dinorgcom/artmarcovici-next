/* Femizide in Österreich – englisches Wörterbuch: Falltexte 2021–2022.
 * Schlüssel = deutscher Text aus den Falldaten im Bundle (Leerraum normalisiert), Wert = Englisch.
 * Gruppiert nach der Fall-ID, in der der Text zuerst vorkommt (gleiche Texte gelten für alle Fälle).
 * keep = Texte, die unverändert bleiben (Orts- und Personennamen, Medien).
 * Neue/geänderte Falltexte finden:  node scripts/femizide-i18n.mjs extract
 * Übersetzungsstandard: britisches Englisch, nüchtern und genau; Abschwächungen wie "laut", "mutmaßlich"
 * bleiben gleich stark ("according to", "alleged"). Datumsangaben im Fließtext ausgeschrieben (13 January 2019). */
(function (w) {
  "use strict";
  if (w.BIEST_LANG !== "en") return;
  var I = (w.FEMIZIDE_I18N = w.FEMIZIDE_I18N || { dict: {}, keep: [], patterns: [], blocks: {} });
  var d = {
    // 2021-01
    "Verurteilt: lebenslange Haft (Juni 2021, Landesgericht Steyr), Urteil angenommen/rechtskräftig":
      "Convicted: life imprisonment (June 2021, Steyr Regional Court), verdict accepted/final",
    "Mit Hammer erschlagen und mit zwei Messern mehrfach zugestochen":
      "Beaten to death with a hammer and stabbed repeatedly with two knives",
    "Laut eigener Angabe 'Hass auf Ehefrau' ('Aus Liebe ist Hass geworden'); langjährige häusliche Gewalt, Gerichtspsychiaterin attestierte 'profunden Narzissmus' bei voller Zurechnungsfähigkeit":
      "According to his own statement, 'hatred of his wife' ('Love turned into hatred'); long-standing domestic violence, the forensic psychiatrist diagnosed 'profound narcissism' with full criminal responsibility",
    "Landesgericht Steyr (Geschworenengericht)":
      "Steyr Regional Court (jury court)",
    "Mord, lebenslange Freiheitsstrafe; Tat im 'besonderen Ausmaß bestialisch'":
      "Murder, life imprisonment; crime 'bestial to a particular degree'",
    "Täter bei Prozess 75 Jahre alt. Im Prozess auch als 'Franz Josef H.' bezeichnet.":
      "Perpetrator aged 75 at the trial. Also referred to as 'Franz Josef H.' at the trial.",
    "'Aus Liebe ist Hass geworden': langjährige häusliche Gewalt, Gerichtspsychiaterin attestierte 'profunden Narzissmus' bei voller Zurechnungsfähigkeit.":
      "'Love turned into hatred': long-standing domestic violence, the forensic psychiatrist diagnosed 'profound narcissism' with full criminal responsibility.",
    // 2021-02
    "vermutlich Österreich":
      "presumably Austria",
    "Mit Faustfeuerwaffe erschossen":
      "Shot dead with a handgun",
    "Erweiterter Suizid im gemeinsamen Wohnhaus.":
      "Murder-suicide in the shared house.",
    "Erweiterter Suizid im gemeinsamen Wohnhaus (Ehepaar 61/64); nähere Hintergründe nicht öffentlich.":
      "Murder-suicide in the shared house (married couple aged 61/64); further background not public.",
    // 2021-03
    "Wien (Asylunterkunft)":
      "Vienna (asylum accommodation)",
    "Verurteilt: lebenslange Haft (August 2021, Landesgericht Wien)":
      "Convicted: life imprisonment (August 2021, Vienna Regional Court)",
    "Mit fünf Messerstichen erstochen (in Asylunterkunft)":
      "Stabbed to death with five knife stabs (in asylum accommodation)",
    "Laut Gericht 'besonders brutaler' Mord; Täter sah die Schuld 'zu 90 Prozent' beim Opfer":
      "According to the court, a 'particularly brutal' murder; the perpetrator saw the blame '90 per cent' with the victim",
    "Landesgericht für Strafsachen Wien":
      "Vienna Regional Criminal Court",
    "Mord, lebenslange Freiheitsstrafe":
      "Murder, life imprisonment",
    "'Besonders brutaler' Mord an der Ehefrau in der Asylunterkunft; Täter sah die Schuld 'zu 90 Prozent' beim Opfer (Täter-Opfer-Umkehr).":
      "'Particularly brutal' murder of his wife in the asylum accommodation; the perpetrator saw the blame '90 per cent' with the victim (victim-blaming reversal).",
    // 2021-04
    "Polen":
      "Poland",
    "Österreich mit nordafrikanischen Wurzeln":
      "Austria, with North African roots",
    "Verurteilt: lebenslange Haft und Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher (24.8.2021, Landesgericht Wien)":
      "Convicted: life imprisonment and committal to an institution for mentally abnormal offenders (24 August 2021, Vienna Regional Court)",
    "Erwürgt (zunächst als Messerstich gemeldet, Obduktion ergab Strangulation)":
      "Strangled (initially reported as a knife stab; the post-mortem showed strangulation)",
    "Täter hatte die Frau Stunden zuvor geschlagen (Polizeieinsatz), kehrte zurück und tötete sie; Opferschutzversagen von Polizei und Spital thematisiert":
      "Hours earlier the perpetrator had beaten the woman (police called out), returned and killed her; failures of victim protection by the police and the hospital were raised",
    "Landesgericht für Strafsachen Wien (Schwurgericht)":
      "Vienna Regional Criminal Court (jury court)",
    "Mord, lebenslange Freiheitsstrafe plus Einweisung":
      "Murder, life imprisonment plus committal",
    "Täter war wegen des vorangegangenen Gewaltübergriffs bereits polizeilich gesucht worden (amtsbekannt).":
      "Because of the preceding violent assault, the police were already looking for the perpetrator (known to the authorities).",
    "Eskalation häuslicher Gewalt: Täter hatte das Opfer Stunden zuvor geschlagen (Polizeieinsatz), kehrte zurück und erwürgte sie; Opferschutzversagen thematisiert.":
      "Escalation of domestic violence: hours earlier the perpetrator had beaten the victim (police called out), returned and strangled her; failures of victim protection were raised.",
    // 2021-06
    "Ex-Lebensgefährte":
      "Former live-in partner",
    "Österreich/Ägypten (Austro-Ägypter)":
      "Austria/Egypt (Austrian-Egyptian)",
    "Ägypten":
      "Egypt",
    "Verurteilt: lebenslange Haft (1.10.2021, Landesgericht Wien), rechtskräftig":
      "Convicted: life imprisonment (1 October 2021, Vienna Regional Court), final",
    "Brandanschlag: Opfer in ihrer Trafik mit Benzin übergossen und angezündet; starb rund einen Monat später (Anfang April 2021) im Krankenhaus":
      "Arson attack: the victim was doused with petrol and set on fire in her tobacconist's shop (Trafik); she died in hospital about a month later (early April 2021)",
    "Trennungsmotiv/Rache an Ex-Partnerin; im Prozess keine Reue, Täter-Opfer-Umkehr bis zuletzt":
      "Separation motive/revenge on his ex-partner; no remorse at trial, blamed the victim to the very end",
    "Mord, lebenslange Freiheitsstrafe (rechtskräftig, Urteil akzeptiert)":
      "Murder, life imprisonment (final, verdict accepted)",
    "Datum = Tag des Anschlags (5.3.2021); Opfer verstarb erst rund einen Monat später, danach wurde wegen Mordes ermittelt. Opfer war Trafikantin.":
      "Date = day of the attack (5 March 2021); the victim died only about a month later, after which a murder investigation was opened. The victim ran a tobacconist's shop.",
    "Trennungsrache: Brandanschlag auf die Ex-Partnerin in ihrer Trafik; im Prozess keine Reue, Täter-Opfer-Umkehr bis zuletzt.":
      "Revenge for the separation: arson attack on his ex-partner in her tobacconist's shop; no remorse at trial, blamed the victim to the very end.",
    // 2021-05
    "Ex-Lebensgefährte, Vater der zwei gemeinsamen Kinder":
      "Former live-in partner, father of their two children",
    "Serbien":
      "Serbia",
    "Verurteilt: lebenslange Haft (27.9.2021, Landesgericht Salzburg, Geschworenengericht)":
      "Convicted: life imprisonment (27 September 2021, Salzburg Regional Court, jury court)",
    "Mit Küchenmesser erstochen":
      "Stabbed to death with a kitchen knife",
    "Streit im Zuge der Scheidung/Trennung; Tat in Gegenwart der zwei kleinen gemeinsamen Töchter":
      "Argument in the course of the divorce/separation; crime in the presence of the couple's two young daughters",
    "Zwei kleine gemeinsame Kinder (Mädchen) waren bei der Tat in der Wohnung":
      "The couple's two young children (girls) were in the flat during the crime",
    "Landesgericht Salzburg":
      "Salzburg Regional Court",
    "Streit im Zuge von Scheidung/Trennung; Tat vor den zwei kleinen gemeinsamen Töchtern.":
      "Argument in the course of divorce/separation; crime in front of the couple's two young daughters.",
    // 2021-07
    "Stellte sich der Polizei; verurteilt: lebenslange Haft (17.1.2022, Landesgericht Graz)":
      "Turned himself in to the police; convicted: life imprisonment (17 January 2022, Graz Regional Court)",
    "Mutmaßlich mit Messer getötet":
      "Presumably killed with a knife",
    "Opfer war vierfache Mutter":
      "The victim was a mother of four",
    "Landesgericht für Strafsachen Graz":
      "Graz Regional Criminal Court",
    "Täter gestand und stellte sich selbst bei der Polizeiinspektion.":
      "The perpetrator confessed and turned himself in at the police station.",
    "Motiv öffentlich nicht geklärt; Ehemann gestand und stellte sich; lebenslang.":
      "Motive not publicly established; the husband confessed and turned himself in; life imprisonment.",
    // 2021-08
    "Verurteilt: lebenslange Haft (17.9.2021, Landesgericht St. Pölten), rechtskräftig":
      "Convicted: life imprisonment (17 September 2021, St. Pölten Regional Court), final",
    "Schläge mit Maurerfäustel gegen den Schädel, anschließend tiefe Schnittverletzungen am Hals mit Messer (Angriff im Schlaf)":
      "Blows to the skull with a mason's hammer, followed by deep knife cuts to the throat (attacked while asleep)",
    "Laut Täter nach nächtlichem Aufgewecktwerden 'explodiert'; Staatsanwalt sprach von 'Beziehungsmord' ohne unmittelbar vorangegangenen Streit":
      "According to the perpetrator, he 'exploded' after being woken up at night; the prosecutor spoke of a 'relationship murder' without any immediately preceding argument",
    "Landesgericht St. Pölten (Geschworenengericht)":
      "St. Pölten Regional Court (jury court)",
    "Mord, lebenslange Freiheitsstrafe (rechtskräftig)":
      "Murder, life imprisonment (final)",
    "Täter unbescholten, geständig; fügte sich nach der Tat selbst Verletzungen zu.":
      "Perpetrator had no previous convictions, confessed; injured himself after the crime.",
    "Staatsanwalt sprach von 'Beziehungsmord' ohne unmittelbar vorangegangenen Streit; Täter nach nächtlichem Aufgewecktwerden 'explodiert'.":
      "The prosecutor spoke of a 'relationship murder' without any immediately preceding argument; the perpetrator 'exploded' after being woken up at night.",
    // 2021-09
    "Verurteilt: lebenslange Haft und Einweisung in Anstalt für geistig abnorme Rechtsbrecher (22.12.2021, Straflandesgericht Wien)":
      "Convicted: life imprisonment and committal to an institution for mentally abnormal offenders (22 December 2021, Vienna Regional Criminal Court)",
    "Mit Pistole gezielt erschossen (u.a. Kopfschuss) in der Wohnung des Opfers":
      "Deliberately shot dead with a pistol (including a shot to the head) in the victim's flat",
    "Opfer (Krankenschwester) hatte die 15-jährige Beziehung wenige Tage zuvor endgültig beendet; Täter gab Erinnerungslücke wegen Alkohol-/Drogenkonsum an":
      "The victim (a nurse) had definitively ended the 15-year relationship a few days earlier; the perpetrator claimed a memory gap due to alcohol/drug use",
    "Opfer war zweifache Mutter; ihr 13-jähriges Kind war zum Tatzeitpunkt im Haushalt/Umfeld":
      "The victim was a mother of two; her 13-year-old child was in the household/vicinity at the time of the crime",
    "Mord, schwere Nötigung, Verstoß gegen Waffengesetz: lebenslange Haft und Einweisung":
      "Murder, aggravated coercion, violation of the Weapons Act: life imprisonment and committal",
    "Täter ist der als 'Bierwirt' bekannt gewordene Wirt aus dem Sigi-Maurer-Verfahren. Opfername 'Nadine W.' wurde vom Standard öffentlich berichtet.":
      "The perpetrator is the publican who became known as the 'Bierwirt' (beer-bar landlord) in the Sigi Maurer case. The victim's name 'Nadine W.' was reported publicly by Der Standard.",
    "Opfer hatte die 15-jährige Beziehung wenige Tage zuvor endgültig beendet; gezielter Kopfschuss; Täter ('Bierwirt') gab Erinnerungslücke an.":
      "The victim had definitively ended the 15-year relationship a few days earlier; targeted shot to the head; the perpetrator ('Bierwirt') claimed a memory gap.",
    "Der Angeklagte (\"Bierwirt\", Gesicht verpixelt) im Mordprozess am Wiener Landesgericht für Strafsachen":
      "The defendant (the 'Bierwirt', face pixelated) at the murder trial at Vienna Regional Criminal Court",
    // 2021-10
    "Erschossen":
      "Shot dead",
    "Unklar, ob gemeinsam geplanter Suizid oder erweiterter Suizid":
      "Unclear whether a jointly planned suicide or a murder-suicide",
    "Ehepaar tot in gemeinsamer Wohnung aufgefunden; Tathergang laut Berichten nicht restlos geklärt.":
      "Married couple found dead in their shared flat; according to reports, the course of events has not been fully established.",
    "Ehepaar (72/73) tot in Wohnung; unklar, ob gemeinsam geplanter oder erweiterter Suizid.":
      "Married couple (72/73) dead in their flat; unclear whether a jointly planned suicide or a murder-suicide.",
    // 2021-11
    "Österreich (Walserin)":
      "Austria (from Wals)",
    "Salzburg/Österreich":
      "Salzburg/Austria",
    "Verurteilt: lebenslange Haft und Einweisung (28.7.2022, Landesgericht Salzburg)":
      "Convicted: life imprisonment and committal (28 July 2022, Salzburg Regional Court)",
    "Erschossen (legal besessene Waffe)":
      "Shot dead (legally owned weapon)",
    "Trennungsmotiv; Täter gestand im Prozess die Tat":
      "Separation motive; the perpetrator confessed to the crime at trial",
    "Landesgericht Salzburg (Geschworenengericht)":
      "Salzburg Regional Court (jury court)",
    "Doppelmord, lebenslange Freiheitsstrafe und Einweisung in Anstalt für geistig abnorme Rechtsbrecher":
      "Double murder, life imprisonment and committal to an institution for mentally abnormal offenders",
    "Doppelmord: Täter (früherer Berufsdetektiv/Privatdetektiv, Waffenbesitzer) erschoss Ex-Freundin und deren Mutter (siehe Fall 2021-12).":
      "Double murder: the perpetrator (a former professional/private detective and gun owner) shot dead his ex-girlfriend and her mother (see case 2021-12).",
    "Trennungsmotiv; Täter (Ex-Detektiv, Waffenbesitzer) erschoss Ex-Freundin und deren Mutter; im Prozess geständig.":
      "Separation motive; the perpetrator (former detective, gun owner) shot dead his ex-girlfriend and her mother; confessed at trial.",
    // 2021-12
    "Ex-Lebensgefährte der Tochter des Opfers":
      "Former live-in partner of the victim's daughter",
    "Täter wollte offenbar die Ex-Freundin töten und erschoss auch deren Mutter im selben Haus":
      "The perpetrator apparently wanted to kill his ex-girlfriend and also shot dead her mother in the same house",
    "Zweites Opfer des Doppelmords von Wals-Siezenheim (Mutter des Opfers aus Fall 2021-11). In Frühberichten teils als 74-Jährige bezeichnet.":
      "Second victim of the Wals-Siezenheim double murder (mother of the victim in case 2021-11). Some early reports described her as 74 years old.",
    "Zweitopfer des Trennungsmords von Wals-Siezenheim (Mutter der Ex-Freundin).":
      "Second victim of the separation-related murder in Wals-Siezenheim (mother of the ex-girlfriend).",
    // 2021-13
    "Erschossen (auf dem Parkplatz eines Friedhofs)":
      "Shot dead (in the car park of a cemetery)",
    "Ehepaar (78/79) auf Friedhofsparkplatz erschossen; unklar, ob gemeinsam geplanter oder erweiterter Suizid.":
      "Married couple (78/79) shot dead in a cemetery car park; unclear whether a jointly planned suicide or a murder-suicide.",
    // 2021-14
    "Ehemann (tatverdächtig)":
      "Husband (suspect)",
    "Festnahme, später enthaftet; Fremdverschulden weder bestätigt noch ausgeschlossen":
      "Arrested, later released from custody; third-party involvement neither confirmed nor ruled out",
    "Frau mit Halsverletzungen tot in Wohnung gefunden":
      "Woman found dead in a flat with neck injuries",
    "AÖF führt den Fall als mutmaßlichen Femizid; die Todesumstände blieben laut Berichten ungeklärt, der Verdächtige wurde aus der U-Haft entlassen.":
      "AÖF lists the case as a suspected femicide; according to reports, the circumstances of death remained unclear and the suspect was released from pre-trial detention.",
    "Todesumstände ungeklärt; tatverdächtiger Ehemann aus U-Haft entlassen, Fremdverschulden weder bestätigt noch ausgeschlossen.":
      "Circumstances of death unclear; the husband under suspicion was released from pre-trial detention, third-party involvement neither confirmed nor ruled out.",
    // 2021-15
    "Rasuili Z. (Haupttäter); Mittäter Ibraulhaq A. und Ali H.":
      "Rasuili Z. (principal offender); accomplices Ibraulhaq A. and Ali H.",
    "Tulln (Niederösterreich)":
      "Tulln (Lower Austria)",
    "Keine Nahebeziehung; Mädchen wurde in Wohnung gelockt":
      "No close relationship; the girl was lured into a flat",
    "Verurteilt (2.12.2022, LG Wien): Haupttäter lebenslange Haft wegen Mordes und Vergewaltigung; zwei Mittäter 20 bzw. 19 Jahre wegen Mordes durch Unterlassen und Vergewaltigung (JGG); OGH bestätigte Urteile am 31.5.2023 (rechtskräftig)":
      "Convicted (2 December 2022, Vienna Regional Court): principal offender life imprisonment for murder and rape; two accomplices 20 and 19 years respectively for murder by omission and rape (Juvenile Court Act, JGG); the Supreme Court (OGH) upheld the verdicts on 31 May 2023 (final)",
    "Mit Ecstasy unter Drogen gesetzt, vergewaltigt und erstickt; Leiche zwischen Bahngleisen abgelegt":
      "Drugged with ecstasy, raped and suffocated; body left between railway tracks",
    "Sexuelle Missbrauchsabsicht; laut Gericht 'auffällige Gleichgültigkeit' gegenüber dem Opfer, Opfer 'wie ein Objekt benutzt'":
      "Intent to sexually abuse; according to the court, 'striking indifference' towards the victim, the victim was 'used like an object'",
    "Opfer war selbst ein Kind (13)":
      "The victim was herself a child (13)",
    "Landesgericht für Strafsachen Wien (Geschworenengericht); OGH":
      "Vienna Regional Criminal Court (jury court); Supreme Court (OGH)",
    "Haupttäter: lebenslang (Mord, Vergewaltigung); Mittäter: 20 und 19 Jahre (Mord durch Unterlassen, Vergewaltigung); Schmerzensgeld 140.000 Euro an die Familie; rechtskräftig seit 31.5.2023":
      "Principal offender: life (murder, rape); accomplices: 20 and 19 years (murder by omission, rape); damages for pain and suffering of €140,000 to the family; final since 31 May 2023",
    "Tatort (Wohnung in Wien-Donaustadt) und Fundort (Grünfläche bei Bahngleisen) nicht ident. Ein vierter Verdächtiger (23, Drogenlieferant) schied als unmittelbarer Mittäter aus. Fall löste bundesweite Debatte über Asyl/Abschiebung aus. ERGAENZUNG (Tiefenrecherche Prozess/OGH): Haupttäter Rasuili Z. kam 2015 als unbegleiteter minderjähriger Flüchtling; Asylantrag im Oktober 2017 negativ beschieden, Rückkehrentscheidung erlassen; Juni 2018 Verlust des Aufenthaltsrechts wegen Straffälligkeit per Verfahrensanordnung (BVwG-Beschwerde, Ausgang unbekannt); dreimal verurteilt, Haft bis Mai 2021, danach Einzug in die Tatwohnung. Flucht per Flüchtlingsboot nach Großbritannien, dort Asylantrag unter falschem Namen; Festnahme 29.7.2021 (europäischer Haftbefehl), Auslieferung an Österreich am 23.3.2022. Mittäter Ibraulhaq A. (Wohnungsmieter): 2016 subsidiärer Schutz, Oktober 2019 wegen Straffälligkeit/Gemeingefahr aberkannt, Rückkehrentscheidung mit sechsjährigem Einreiseverbot; Berufung beim BVwG zum Tatzeitpunkt anhängig (als Minderjähriger EMRK-bedingt nicht abschiebbar). Mittäter Ali H.: erst April 2021 eingereist, Asylantrag anhängig, unbescholten; forensische Altersdiagnostik ergab Volljährigkeit (18,95–20,55 Jahre), Verurteilung dennoch nach JGG (unter 21). Ein vierter Afghane (Sahel S., mutmaßlicher Drogenlieferant) schied als unmittelbarer Mittäter aus. Im Prozess (7 Verhandlungstage, 27.9.–2.12.2022, Vorsitz Richterin Anna Marchart) wurden Videos des Todeskampfs unter Ausschluss der Öffentlichkeit vorgespielt. OGH (Senatspräsident Rudolf Lässig) wies Nichtigkeitsbeschwerde und Berufungen am 31.5.2023 ab: Urteile rechtskräftig. Anklage 14.7.2022: Vergewaltigung mit Todesfolge und schwerer sexueller Missbrauch von Unmündigen mit Todesfolge; StA sah Anhaltspunkte für Mordvorsatz. Privatbeteiligtenvertreter: Johannes Öhlböck und Florian Höllwarth.":
      "Crime scene (flat in Vienna-Donaustadt) and place where the body was found (green area next to railway tracks) are not the same. A fourth suspect (23, drug supplier) was ruled out as a direct accomplice. The case triggered a nationwide debate on asylum/deportation. ADDENDUM (in-depth research on the trial/OGH): the principal offender Rasuili Z. arrived in 2015 as an unaccompanied minor refugee; his asylum application was rejected in October 2017 and a return decision was issued; in June 2018 he lost his right of residence because of criminal offences by procedural order (appeal to the Federal Administrative Court, BVwG, outcome unknown); convicted three times, in prison until May 2021, after which he moved into the flat where the crime took place. Fled by refugee boat to the United Kingdom, where he applied for asylum under a false name; arrested on 29 July 2021 (European arrest warrant), extradited to Austria on 23 March 2022. Accomplice Ibraulhaq A. (tenant of the flat): subsidiary protection in 2016, revoked in October 2019 because of criminal offences/danger to the public, return decision with a six-year entry ban; appeal pending before the BVwG at the time of the crime (could not be deported as a minor because of the ECHR). Accomplice Ali H.: entered the country only in April 2021, asylum application pending, no previous convictions; forensic age assessment showed he was an adult (18.95–20.55 years), but he was nevertheless sentenced under the JGG (under 21). A fourth Afghan (Sahel S., suspected drug supplier) was ruled out as a direct accomplice. At the trial (7 days of hearings, 27 September – 2 December 2022, presiding judge Anna Marchart), videos of the victim's death struggle were shown in camera. The OGH (presiding judge Rudolf Lässig) dismissed the plea of nullity and the appeals on 31 May 2023: verdicts final. Indictment of 14 July 2022: rape resulting in death and aggravated sexual abuse of a child resulting in death; the public prosecutor saw indications of intent to murder. Counsel for the private parties: Johannes Öhlböck and Florian Höllwarth.",
    "Motiv laut Anklage/Urteil: gemeinschaftliche Vergewaltigung in Missbrauchsabsicht. Das 13-jährige Opfer wurde mit mindestens sechs Ecstasy-Tabletten (MDA) unter Drogen gesetzt – laut toxikologischem Gutachter Günter Gmeiner eine dreifach letale Dosis – und von allen drei Angeklagten vergewaltigt; Todesursache laut Gerichtsmediziner Nikolaus Klupp: Suchtmittelvergiftung (Hyponatriämie/Hyperthermie) und Ersticken. Richterin Anna Marchart: Opfer 'wie ein Objekt benutzt', 'auffällige Gleichgültigkeit'. OGH-Senatspräsident Rudolf Lässig (31.5.2023): Opfer zur 'Sache' degradiert, 'so hoher Grad an Schuld' den Richtern kaum je untergekommen. Gutachten: Toxikologie (Gmeiner), Gerichtsmedizin (Klupp), Gynäkologie (Sigrid Schmidl-Amann), forensische Altersdiagnostik (Ali H. zum Tatzeitpunkt 18,95–20,55 Jahre alt, dennoch nach JGG verurteilt, da unter 21). Kein psychiatrisches Gutachten zur Zurechnungsunfähigkeit öffentlich bekannt; Verurteilung zu Haftstrafen ohne Einweisung. THC/Drogen: Haaranalyse des Opfers zeigte wiederholten MDA-Konsum; das Mädchen soll wenige Stunden vor der Tat Cannabis geraucht haben (kaum Alkohol, dafür Koffein/Nikotin). Die Verteidigung des Drittangeklagten behauptete, Leonie habe Interesse nur vorgetäuscht, 'um an Drogen zu kommen' – vom Gericht verworfen.":
      "Motive according to the indictment/verdict: gang rape with intent to abuse. The 13-year-old victim was drugged with at least six ecstasy tablets (MDA) – according to the toxicology expert Günter Gmeiner three times a lethal dose – and raped by all three defendants; cause of death according to the forensic pathologist Nikolaus Klupp: drug poisoning (hyponatraemia/hyperthermia) and suffocation. Judge Anna Marchart: the victim was 'used like an object', 'striking indifference'. OGH presiding judge Rudolf Lässig (31 May 2023): the victim was degraded to a 'thing'; the judges had hardly ever encountered 'such a high degree of guilt'. Expert reports: toxicology (Gmeiner), forensic medicine (Klupp), gynaecology (Sigrid Schmidl-Amann), forensic age assessment (Ali H. aged 18.95–20.55 at the time of the crime, nevertheless sentenced under the JGG because under 21). No psychiatric report on criminal responsibility publicly known; prison sentences without committal. THC/drugs: hair analysis of the victim showed repeated MDA use; the girl is said to have smoked cannabis a few hours before the crime (hardly any alcohol, but caffeine/nicotine). The defence of the third defendant claimed that Leonie had only pretended to be interested 'in order to get drugs' – rejected by the court.",
    "Religion wurde im Prozess am Rand thematisiert: Der Verteidiger des Zweitangeklagten sprach im Schlussplädoyer von einem 'Missverständnis der Religionen' (berichtet von heute.at, 2.12.2022). In Anklage und Urteil spielte Religion keine Rolle; die Täter waren afghanische Staatsbürger, mehrheitlich muslimischer Herkunftskontext (Annahme, keine Tatsachenbehauptung).":
      "Religion was touched on at the margins of the trial: in his closing speech, counsel for the second defendant spoke of a 'misunderstanding of religions' (reported by heute.at, 2 December 2022). Religion played no role in the indictment or the verdict; the perpetrators were Afghan citizens, from a predominantly Muslim context of origin (assumption, not a statement of fact).",
    "Der Fall wird als Systemversagen von Asyl- und Abschiebepolitik gerahmt ('Paukenschlag: zwei afghanische Jugendliche wegen Mord an Leonie festgenommen'); Fokus auf unterbliebene Abschiebungen.":
      "The case is framed as a systemic failure of asylum and deportation policy ('Paukenschlag: zwei afghanische Jugendliche wegen Mord an Leonie festgenommen' [Bombshell: two Afghan youths arrested for Leonie's murder]); focus on deportations that did not take place.",
    "'Offener Brief: Die Verhöhnung eines toten 13-jährigen österreichischen Mädchens' – Behauptung, die Politik (v.a. Grüne/Justizministerin Zadić) verhöhne das Opfer und verschleppe Abschiebungen.":
      "'Offener Brief: Die Verhöhnung eines toten 13-jährigen österreichischen Mädchens' [Open letter: the mockery of a dead 13-year-old Austrian girl] – claim that politicians (above all the Greens/Justice Minister Zadić) mock the victim and delay deportations.",
    "Ideologische Rahmung des Falls als angeblicher 'Krieg gegen Ungläubige', in dem europäische Mädchen 'Beute' muslimischer Männer seien – ungeprüfte Verallgemeinerung von Einzeltätern auf eine Religionsgemeinschaft.":
      "Ideological framing of the case as an alleged 'war against unbelievers' in which European girls are the 'prey' of Muslim men – unverified generalisation from individual perpetrators to a religious community.",
    "True-Crime-Podcasts/YouTube-Formate (z.B. 'Mordfall Leonie (13): Von Täter-Trio vergiftet, vergewaltigt...') verbreiten teils spekulative Tathergang-Rekonstruktionen ohne Quellenprüfung.":
      "True-crime podcasts/YouTube formats (e.g. 'Mordfall Leonie (13): Von Täter-Trio vergiftet, vergewaltigt...' [The Leonie (13) murder case: poisoned, raped by a trio of perpetrators...]) spread partly speculative reconstructions of the crime without checking sources.",
    "Leonie W. auf einem Schiff am Mondsee (Foto von der Mutter ausgesucht und freigegeben; als Collage mit Gedenkkerzen am Fundort veröffentlicht)":
      "Leonie W. on a boat on Lake Mondsee (photo chosen and released by her mother; published as a collage with memorial candles at the place where she was found)",
    "Die drei Angeklagten (Gesichter verdeckt bzw. verpixelt) werden am finalen Prozesstag zur Urteilsverkündung im Fall Leonie geführt":
      "The three defendants (faces covered or pixelated) are led in for the verdict on the final day of the Leonie trial",
    // 2021-16
    "Bekannter (Beziehung zum Opfer unklar)":
      "Acquaintance (relationship to the victim unclear)",
    "Ermittlungen; weiterer Ausgang öffentlich nicht berichtet":
      "Investigation; further outcome not publicly reported",
    "Unklar; Frau bewusstlos mit schweren Verletzungen in Wohnung des Mannes gefunden, starb im Spital; Verletzungsmuster ließ Fremdverschulden vermuten":
      "Unclear; the woman was found unconscious with serious injuries in the man's flat and died in hospital; the pattern of injuries suggested third-party involvement",
    "Frau wurde am 11.7.2021 verletzt in die Klinik gebracht und starb am 16.7.; ein weiterer Mann hielt sich in der Wohnung auf. Öffentlich kein Prozess-/Verfahrensausgang auffindbar.":
      "The woman was taken to hospital injured on 11 July 2021 and died on 16 July; another man was staying in the flat. No public outcome of a trial/proceedings could be found.",
    "Umstände ungeklärt; Frau mit schweren Verletzungen in Wohnung eines Bekannten gefunden, Verletzungsmuster ließ Fremdverschulden vermuten; kein Verfahrensausgang berichtet.":
      "Circumstances unclear; woman found with serious injuries in an acquaintance's flat, the pattern of injuries suggested third-party involvement; no outcome of proceedings reported.",
    // 2021-17
    "Bekannter/Ex-Freund, mutmaßlicher Vater des ungeborenen Kindes":
      "Acquaintance/ex-boyfriend, presumed father of the unborn child",
    "Verurteilt: 15 Jahre Haft wegen Mordes (5.4.2022, Landesgericht Graz)":
      "Convicted: 15 years' imprisonment for murder (5 April 2022, Graz Regional Court)",
    "Stich- und Schnittverletzungen am Hals":
      "Stab and cut wounds to the throat",
    "Konflikt um die Schwangerschaft (Opfer war schwanger); Täter wusch nach der Tat seine blutigen Hände und fuhr heim":
      "Conflict over the pregnancy (the victim was pregnant); after the crime the perpetrator washed his bloody hands and drove home",
    "Opfer war schwanger; ungeborenes Kind starb mit":
      "The victim was pregnant; the unborn child also died",
    "Landesgericht für Strafsachen Graz (Geschworenengericht)":
      "Graz Regional Criminal Court (jury court)",
    "Mord, 15 Jahre Freiheitsstrafe":
      "Murder, 15 years' imprisonment",
    "Konflikt um die Schwangerschaft des 17-jährigen Opfers (Täter mutmaßlicher Vater des ungeborenen Kindes); 15 Jahre.":
      "Conflict over the pregnancy of the 17-year-old victim (perpetrator the presumed father of the unborn child); 15 years.",
    // 2021-18
    "zwischen Fürstenbrunn (Grödig) und Großgmain":
      "between Fürstenbrunn (Grödig) and Großgmain",
    "Ex-Ehemann (tatverdächtig)":
      "Ex-husband (suspect)",
    "Nach Fahndung am 7.9.2021 tot in Zederhaus gefunden (mutmaßlich Suizid)":
      "After a manhunt, found dead in Zederhaus on 7 September 2021 (presumed suicide)",
    "Leiche mit Verletzungen in Waldgebiet neben Forststraße gefunden; Tötungsdelikt laut Ermittlern":
      "Body with injuries found in a wooded area next to a forest road; homicide according to investigators",
    "Ex-Ehepaar war zuvor gemeinsam als vermisst gemeldet; Haftbefehl gegen den Ex-Mann ergangen, bevor er tot aufgefunden wurde.":
      "The former couple had previously been reported missing together; an arrest warrant had been issued against the ex-husband before he was found dead.",
    "Motiv unklar; Ex-Ehemann tatverdächtig, nach Fahndung tot aufgefunden (mutmaßlich Suizid); kein Verfahren.":
      "Motive unclear; ex-husband the suspect, found dead after a manhunt (presumed suicide); no proceedings.",
    // 2021-19
    "Österreich (Pinzgau)":
      "Austria (Pinzgau)",
    "Starb ebenfalls (mutmaßlich Suizid nach der Tat)":
      "Also died (presumed suicide after the crime)",
    "Erschossen; auch der 51-jährige Sohn erlitt Schussverletzungen (überlebte)":
      "Shot dead; the 51-year-old son also suffered gunshot wounds (survived)",
    "Familienstreit, laut Berichten Hinweise auf Erbstreit":
      "Family argument; according to reports, indications of a dispute over an inheritance",
    "Sohn (51) wurde bei der Tat angeschossen und überlebte verletzt":
      "Son (51) was shot during the crime and survived with injuries",
    "Laut Polizei (via MeinBezirk) Streit am Abend des 29.8.2021 zwischen 81-jährigem Pinzgauer, 71-jähriger Frau und deren 51-jährigem Sohn; die Frau starb, beide Männer wurden verletzt. Krone meldete später 'Eltern tot, Sohn im Spital'. AÖF zählt die 71-Jährige als Femizid-Opfer.":
      "According to the police (via MeinBezirk), there was an argument on the evening of 29 August 2021 between an 81-year-old man from the Pinzgau, a 71-year-old woman and her 51-year-old son; the woman died, both men were injured. Krone later reported 'parents dead, son in hospital'. AÖF counts the 71-year-old as a femicide victim.",
    "Familienstreit mit Hinweisen auf Erbstreit (Medienberichte); Frau erschossen, Sohn verletzt, Täter suizidiert.":
      "Family argument with indications of a dispute over an inheritance (media reports); woman shot dead, son injured, perpetrator took his own life.",
    // 2021-20
    "Ex-Ehemann":
      "Ex-husband",
    "Verurteilt: lebenslange Haft (4.7.2022, Landesgericht Wien)":
      "Convicted: life imprisonment (4 July 2022, Vienna Regional Court)",
    "Erstochen bzw. mit Nudelholz (Nudelwalker) erschlagen":
      "Stabbed to death or beaten to death with a rolling pin",
    "Beziehungsmotiv; laut AÖF war Täter zuvor auffällig, Verdacht einer Psychose; in Frühberichten als unbescholten beschrieben":
      "Relationship motive; according to AÖF the perpetrator had previously attracted attention, suspected psychosis; early reports described him as having no previous convictions",
    "Ein vierjähriges Kind blieb zurück":
      "A four-year-old child was left behind",
    "Mord (Doppelmord), lebenslange Freiheitsstrafe":
      "Murder (double murder), life imprisonment",
    "Doppelmord: Ex-Frau (35) und deren Freundin (37, Fall 2021-21) in derselben Wohnung getötet.":
      "Double murder: ex-wife (35) and her friend (37, case 2021-21) killed in the same flat.",
    "Beziehungsmotiv gegenüber der Ex-Frau; zudem geplanter Mord an vermeintlichem Nebenbuhler (an Alkoholisierung gescheitert). AÖF erwähnte Psychose-Verdacht; Urteil: lebenslang ohne öffentlich berichtete Einweisung.":
      "Relationship motive towards his ex-wife; also a planned murder of a supposed rival (which failed because he was drunk). AÖF mentioned suspected psychosis; verdict: life imprisonment without any publicly reported committal.",
    // 2021-21
    "Ex-Ehemann der Freundin des Opfers":
      "Ex-husband of the victim's friend",
    "Beziehungsmotiv des Täters gegenüber seiner Ex-Frau; Opfer hielt sich in der Wohnung auf":
      "The perpetrator's relationship motive towards his ex-wife; the victim was staying in the flat",
    "Zweites Opfer des Doppelmords von Wien-Favoriten (Freundin der Ex-Frau des Täters).":
      "Second victim of the Vienna-Favoriten double murder (friend of the perpetrator's ex-wife).",
    "Zweitopfer des Doppelmords von Wien-Favoriten: Freundin der Ex-Frau des Täters, hielt sich in der Wohnung auf.":
      "Second victim of the Vienna-Favoriten double murder: friend of the perpetrator's ex-wife, who was staying in the flat.",
    // 2021-22
    "Deutsch-Brodersdorf (Marktgemeinde Seibersdorf)":
      "Deutsch-Brodersdorf (market town of Seibersdorf)",
    "Österreich (Bezirk Baden)":
      "Austria (Baden district)",
    "Flucht; am 27.10.2021 tot in Moosbrunn (Bz. Bruck/Leitha) gefunden – Suizid durch Kopfschuss mit der Dienstwaffe":
      "Fled; found dead in Moosbrunn (Bruck an der Leitha district) on 27 October 2021 – suicide by a shot to the head with his service weapon",
    "Erstickt; Obduktion ergab zudem stumpfes Trauma an Brust, Kopf und Hals":
      "Suffocated; the post-mortem also showed blunt trauma to the chest, head and neck",
    "Unbekannt; laut Staatsanwaltschaft stand das Motiv nicht fest":
      "Unknown; according to the public prosecutor's office the motive had not been established",
    "Tatverdächtiger war in Wien tätiger Polizist; mehrtägige Großfahndung u.a. mit Cobra. AÖF gibt Opferalter mit 42 an, ORF/APA mit 43.":
      "The suspect was a police officer working in Vienna; manhunt lasting several days, involving among others the Cobra special unit. AÖF gives the victim's age as 42, ORF/APA as 43.",
    "Laut Staatsanwaltschaft stand das Motiv nicht fest; tatverdächtiger Polizist flüchtete und suizidierte sich mit der Dienstwaffe.":
      "According to the public prosecutor's office, the motive had not been established; the police officer under suspicion fled and took his own life with his service weapon.",
    // 2021-23
    "Österreich (ursprünglich aus Graz)":
      "Austria (originally from Graz)",
    "Verurteilt: 11 Jahre Haft wegen Mordes (4.7.2022, Landesgericht Feldkirch)":
      "Convicted: 11 years' imprisonment for murder (4 July 2022, Feldkirch Regional Court)",
    "Gewürgt; Opfer starb drei Tage später (29.10.2021) im Spital an den Verletzungen":
      "Strangled; the victim died of her injuries in hospital three days later (29 October 2021)",
    "Streit in der Beziehung; Täter gestand die Würgeattacke":
      "Argument within the relationship; the perpetrator confessed to the strangling attack",
    "Landesgericht Feldkirch":
      "Feldkirch Regional Court",
    "Mord, 11 Jahre Freiheitsstrafe":
      "Murder, 11 years' imprisonment",
    "Attacke am Nationalfeiertag (26.10.); Todesdatum 29.10.2021. Täter bei Urteil 60 Jahre alt.":
      "Attack on the national holiday (26 October); date of death 29 October 2021. Perpetrator aged 60 at the verdict.",
    "Streit in der Beziehung; Würgeattacke geständig; Opfer starb drei Tage später im Spital; 11 Jahre.":
      "Argument within the relationship; confessed to the strangling attack; the victim died in hospital three days later; 11 years.",
    // 2021-24
    "Mutmaßlich Suizid nach der Tat":
      "Presumed suicide after the crime",
    "Älteres Ehepaar (86/83) erschossen; unklar, ob gemeinsam geplanter oder erweiterter Suizid.":
      "Elderly married couple (86/83) shot dead; unclear whether a jointly planned suicide or a murder-suicide.",
    // 2021-25
    "Wien (Einrichtung für betreutes Wohnen)":
      "Vienna (assisted-living facility)",
    "Nachbar, laut Prozess On-Off-Beziehung zum Opfer":
      "Neighbour; according to the trial, in an on-off relationship with the victim",
    "Verurteilt: lebenslange Haft und Einweisung in Anstalt für geistig abnorme Rechtsbrecher (3.5.2022, Landesgericht Wien), rechtskräftig":
      "Convicted: life imprisonment and committal to an institution for mentally abnormal offenders (3 May 2022, Vienna Regional Court), final",
    "13 Messerstiche in Gesicht, Hals, Brust und Bauch; zudem ein 42-jähriger Mann lebensgefährlich verletzt":
      "13 knife stabs to the face, neck, chest and abdomen; a 42-year-old man was also critically injured",
    "Streit um Drogenersatzpräparate (Substitution); Täter behauptete, Opfer habe seine Wochenration gestohlen":
      "Dispute over opioid substitution medication; the perpetrator claimed the victim had stolen his weekly ration",
    "Mord und versuchter Mord: lebenslange Freiheitsstrafe plus Einweisung (rechtskräftig)":
      "Murder and attempted murder: life imprisonment plus committal (final)",
    "Polizei war am Tattag dreimal in der Einrichtung, bevor die Frau getötet wurde; Wiener Interventionsstelle forderte danach eine Mordfall-Analyse. Täter bei Urteil 46 Jahre alt.":
      "The police had been to the facility three times on the day of the crime before the woman was killed; the Vienna Intervention Centre against domestic violence subsequently called for a murder case review. Perpetrator aged 46 at the verdict.",
    "Streit um Drogenersatzpräparate (Substitution); Täter behauptete, das Opfer habe seine Wochenration gestohlen; Polizei war am Tattag dreimal vor Ort.":
      "Dispute over opioid substitution medication; the perpetrator claimed the victim had stolen his weekly ration; the police had been on site three times on the day of the crime.",
    // 2021-26
    "Villach (Stadt)":
      "Villach (city)",
    "Bezirk Villach-Land":
      "Villach-Land district",
    "Verlobter/Lebensgefährte":
      "Fiancé/live-in partner",
    "Verurteilt: 19 Jahre Haft und 15.000 Euro Schadenersatz (30.11.2022, Landesgericht Klagenfurt, Geschworenengericht)":
      "Convicted: 19 years' imprisonment and €15,000 in damages (30 November 2022, Klagenfurt Regional Court, jury court)",
    "Durch heftige Gewalteinwirkung am gesamten Körper getötet (erschlagen); Leiche in der Villacher Innenstadt (vor der Bezirkshauptmannschaft) abgelegt":
      "Killed by severe force to the whole body (beaten to death); body left in Villach city centre (in front of the district administration office)",
    "Beziehungskonflikt; Opfer arbeitete laut Prozessberichten als Prostituierte":
      "Relationship conflict; according to trial reports, the victim worked as a prostitute",
    "Landesgericht Klagenfurt (Geschworenengericht)":
      "Klagenfurt Regional Court (jury court)",
    "Mord, 19 Jahre Freiheitsstrafe plus 15.000 Euro Schadenersatz":
      "Murder, 19 years' imprisonment plus €15,000 in damages",
    "Täter gestand die Tat.":
      "The perpetrator confessed to the crime.",
    "Beziehungskonflikt; Opfer arbeitete laut Prozessberichten als Prostituierte; Täter (Verlobter) geständig; 19 Jahre.":
      "Relationship conflict; according to trial reports, the victim worked as a prostitute; the perpetrator (her fiancé) confessed; 19 years.",
    // 2021-27
    "Innsbruck (Stadt)":
      "Innsbruck (city)",
    "Albanien":
      "Albania",
    "Verurteilt: lebenslange Haft wegen Mordes (14.9.2022, Landesgericht Innsbruck)":
      "Convicted: life imprisonment for murder (14 September 2022, Innsbruck Regional Court)",
    "Mit Küchenmesser attackiert; Stichverletzungen im Rücken, Abwehrverletzungen an den Armen":
      "Attacked with a kitchen knife; stab wounds to the back, defensive wounds on the arms",
    "Streit in der Wohnung; Täter gab an, sich provoziert gefühlt zu haben":
      "Argument in the flat; the perpetrator stated that he had felt provoked",
    "Mord, lebenslange Freiheitsstrafe (Täter geständig)":
      "Murder, life imprisonment (perpetrator confessed)",
    "Täter am Tatort festgenommen, geständig; bei Urteil 60 Jahre alt.":
      "Perpetrator arrested at the scene, confessed; aged 60 at the verdict.",
    "Streit in der Wohnung; Täter gab an, sich provoziert gefühlt zu haben; geständig; lebenslang.":
      "Argument in the flat; the perpetrator stated that he had felt provoked; confessed; life imprisonment.",
    // 2021-28
    "Eibesbrunn (Gemeinde Großebersdorf)":
      "Eibesbrunn (municipality of Großebersdorf)",
    "Wien/Österreich":
      "Vienna/Austria",
    "Verurteilt wegen grob fahrlässiger Tötung: 15 Monate Haft, davon 10 bedingt (9.9.2022, Landesgericht Korneuburg), rechtskräftig":
      "Convicted of grossly negligent homicide: 15 months' imprisonment, 10 of them suspended (9 September 2022, Korneuburg Regional Court), final",
    "Mit Pkw (Dodge Ram) im Bereich einer Tankstelle erfasst; Frau starb kurz darauf in der Klinik Donaustadt an massiven Oberkörperverletzungen":
      "Hit by a car (Dodge Ram) near a petrol station; the woman died shortly afterwards at the Klinik Donaustadt hospital of massive injuries to the upper body",
    "Anfangs Mordverdacht; gerichtlich letztlich grobe Fahrlässigkeit – beide stark alkoholisiert, Täter fuhr nach dem Anfahren davon (unterlassene Hilfeleistung als 'Kurzschlussreaktion')":
      "Initially suspected murder; ultimately gross negligence according to the court – both heavily intoxicated, the perpetrator drove off after hitting her (failure to render assistance as a 'knee-jerk reaction')",
    "Landesgericht Korneuburg":
      "Korneuburg Regional Court",
    "Grob fahrlässige Tötung: 15 Monate, 10 Monate bedingt (rechtskräftig)":
      "Grossly negligent homicide: 15 months, 10 months suspended (final)",
    "AÖF zählt den Fall als mutmaßlichen Femizid; das Gericht verurteilte nur wegen grob fahrlässiger Tötung, nicht wegen Mordes.":
      "AÖF counts the case as a suspected femicide; the court convicted only of grossly negligent homicide, not of murder.",
    "Kein Tötungsmotiv festgestellt: Gericht verurteilte wegen grob fahrlässiger Tötung (Anfahren mit Pkw, beide alkoholisiert, unterlassene Hilfeleistung), nicht wegen Mordes.":
      "No motive to kill established: the court convicted of grossly negligent homicide (hit by a car, both intoxicated, failure to render assistance), not of murder.",
    // 2021-29
    "Verurteilt: 13 Jahre Haft (14.7.2022, Landesgericht Innsbruck)":
      "Convicted: 13 years' imprisonment (14 July 2022, Innsbruck Regional Court)",
    "Schwere körperliche Misshandlung; Opfer starb an einer Einblutung":
      "Severe physical abuse; the victim died of internal bleeding",
    "Täter (amtsbekannt) behauptete, die Frau sei gestürzt; Rettung fand sie mit schwersten Verletzungen":
      "The perpetrator (known to the authorities) claimed the woman had fallen; paramedics found her with the most severe injuries",
    "13 Jahre Freiheitsstrafe":
      "13 years' imprisonment",
    "Frau wurde am 24.11. verletzt aufgefunden und starb am 25.11.2021 in der Klinik; AÖF-Datum 24.11.2021.":
      "The woman was found injured on 24 November and died in hospital on 25 November 2021; AÖF date 24 November 2021.",
    "Schwere Misshandlung durch den (amtsbekannten) Lebensgefährten; Täter behauptete Sturz des Opfers; 13 Jahre.":
      "Severe abuse by her live-in partner (known to the authorities); the perpetrator claimed the victim had fallen; 13 years.",
    // 2021-30
    "Österreich (Wienerin)":
      "Austria (Viennese)",
    "Lebensgefährte (tatverdächtig)":
      "Live-in partner (suspect)",
    "Kanada und Iran":
      "Canada and Iran",
    "Flüchtig, mutmaßlich in den Iran abgesetzt; Fahndung eingeleitet":
      "At large, presumably fled to Iran; manhunt launched",
    "Erstickt; Leiche unter Gerümpel im Kellerabteil versteckt":
      "Suffocated; body hidden under junk in the cellar compartment",
    "Tochter des Opfers hatte die Mutter am 21.11.2021 als abgängig gemeldet":
      "The victim's daughter had reported her mother missing on 21 November 2021",
    "Angehörige warfen der Polizei schwere Ermittlungsfehler und zögerliche Fahndung vor. Kein Prozess öffentlich berichtet.":
      "Relatives accused the police of serious investigative errors and a hesitant manhunt. No trial publicly reported.",
    "Motiv unklar; Täter flüchtig – laut Polizei Flugticket in den Iran gekauft und Reise mutmaßlich angetreten (Auto am Flughafen Schwechat); Fahndung läuft.":
      "Motive unclear; perpetrator at large – according to the police, he bought a plane ticket to Iran and presumably left (car at Schwechat airport); manhunt ongoing.",
    // 2021-31
    "Schwere Schnitt- und Stichverletzungen":
      "Severe cut and stab wounds",
    "Beide wurden tot im Mehrparteienhaus aufgefunden; laut Ermittlern tatverdächtig, dass der Mann die Frau attackierte und sich anschließend selbst tötete.":
      "Both were found dead in the apartment building; according to investigators, the man is suspected of having attacked the woman and then killed himself.",
    "Motiv unklar; laut Ermittlern attackierte der Lebensgefährte die Frau und tötete sich anschließend selbst; kein Verfahren.":
      "Motive unclear; according to investigators, the live-in partner attacked the woman and then killed himself; no proceedings.",
    // 2022-01
    "gebürtiger Deutscher":
      "German-born",
    "Festnahme, U-Haft; verurteilt":
      "Arrest, pre-trial detention; convicted",
    "Schuss in den Hinterkopf mit legal besessener Schusswaffe":
      "Shot in the back of the head with a legally owned firearm",
    "Beziehungsstreit":
      "Relationship argument",
    "Landesgericht Wels":
      "Wels Regional Court",
    "Tatort: gemeinsames Wohnhaus.":
      "Crime scene: the shared house.",
    "Beziehungsstreit; laut Urteil Mord durch Schuss in den Hinterkopf.":
      "Relationship argument; according to the verdict, murder by a shot to the back of the head.",
    // 2022-02
    "Bezirk Neunkirchen":
      "Neunkirchen district",
    "Suizid bei der Tat (erweiterter Suizid)":
      "Suicide during the crime (murder-suicide)",
    "Stellte sich mit Tochter auf Bahngleise; beide von Zug erfasst":
      "Stood on the railway tracks with his daughter; both were hit by a train",
    "Opfer war ein 6-jähriges Mädchen":
      "The victim was a 6-year-old girl",
    "Der Vater hatte die Tat angekündigt; er war im November 2021 wegen schwerer Nötigung und gefährlicher Drohung zu bedingter Haft und Geldstrafe verurteilt worden. AÖF zählt das Mädchen als einziges Kind unter den 29 Opfern 2022.":
      "The father had announced the crime; in November 2021 he had been given a suspended prison sentence and a fine for aggravated coercion and dangerous threats. AÖF counts the girl as the only child among the 29 victims in 2022.",
    // 2022-30
    "gebürtige Rumänin aus Villach":
      "Romanian-born woman from Villach",
    "Ehemann des Opfers war früher mit der Täterin verheiratet":
      "The victim's husband had previously been married to the perpetrator",
    "gebürtige Rumänin aus Vorarlberg":
      "Romanian-born woman from Vorarlberg",
    "Geständnis der Mordabsicht; verurteilt":
      "Confessed to the intent to murder; convicted",
    "Mutter und ihren 5-jährigen Sohn mit dem Auto angefahren und tödlich verletzt":
      "Ran over the mother and her 5-year-old son with her car, fatally injuring them",
    "Eifersucht und Rache; geplante Tat laut Staatsanwaltschaft (belastende Internetrecherchen, Überwachung der Wohnumgebung)":
      "Jealousy and revenge; a planned crime according to the public prosecutor's office (incriminating internet searches, surveillance of the residential area)",
    "Der 5-jährige Sohn des Opfers wurde ebenfalls getötet":
      "The victim's 5-year-old son was also killed",
    "Landesgericht Klagenfurt":
      "Klagenfurt Regional Court",
    "Lebenslange Haft und Einweisung wegen Doppelmordes; nicht rechtskräftig":
      "Life imprisonment and committal for double murder; not final",
    "Nicht in der AÖF-Femizid-Gesamtzahl (29) enthalten: AÖF listet Morde an Frauen mit weiblichen Täterinnen separat, da sie nicht der Femizid-Definition entsprechen. Täterin zur Prozesszeit 38.":
      "Not included in the AÖF total of femicides (29): AÖF lists murders of women by female perpetrators separately, as they do not meet the definition of femicide. The perpetrator was 38 at the time of the trial.",
    "Eifersucht und Rache der Täterin gegen die neue Partnerin ihres Ex-Mannes; geplante Tat.":
      "Jealousy and revenge of the female perpetrator against her ex-husband's new partner; a planned crime.",
    // 2022-03
    "Graz (Stadt)":
      "Graz (city)",
    "Erschossen mit legal besessener Schusswaffe":
      "Shot dead with a legally owned firearm",
    "Der 60-jährige Sohn erschoss zuerst seine Mutter und seinen jüngeren Bruder, dann sich selbst. Tatort: gemeinsame Wohnung. Er besaß mehrere Waffen legal.":
      "The 60-year-old son first shot his mother and his younger brother, then himself. Crime scene: the shared flat. He legally owned several weapons.",
    // 2022-04
    "Bekannter (wenige Stunden vor der Tat kennengelernt)":
      "Acquaintance (met a few hours before the crime)",
    "Festnahme, Geständnis; verurteilt":
      "Arrest, confession; convicted",
    "136 Stiche mit einer Schere; anschließend Brandstiftung in der Wohnung des Opfers":
      "136 stabs with a pair of scissors; then arson in the victim's flat",
    "Landesgericht Graz (Straflandesgericht)":
      "Graz Regional Court (criminal division)",
    "Lebenslange Haft wegen Mordes und Brandstiftung":
      "Life imprisonment for murder and arson",
    "Die Leiche wurde nach einem Wohnungsbrand nahe dem Grazer Hauptbahnhof gefunden. Laut Tages-Anzeiger hatte der Täter (zum Prozesszeitpunkt 24) wenige Wochen zuvor im Jänner 2022 in Zürich bereits eine weitere Frau erstochen.":
      "The body was found after a fire in a flat near Graz main railway station. According to the Tages-Anzeiger, the perpetrator (24 at the time of the trial) had already stabbed another woman to death in Zurich a few weeks earlier, in January 2022.",
    "Täter fühlte sich nach einvernehmlichem Sex 'ausgenutzt'; Ermittlungsmotiv laut ORF 'Hass auf Frauen'; Gutachten: ausgeprägte Persönlichkeitsstörung, Zurechnungsfähigkeit gegeben.":
      "The perpetrator felt 'used' after consensual sex; motive according to the investigation, as reported by ORF, 'hatred of women'; expert report: pronounced personality disorder, criminally responsible.",
    // 2022-05
    "Meidling (12. Bezirk)":
      "Meidling (12th district)",
    "Wien-Meidling":
      "Vienna-Meidling",
    "Schläge mit einer Gewichtshantel auf den Kopf; Opfer starb Tage später im Krankenhaus":
      "Blows to the head with a dumbbell; the victim died in hospital days later",
    "Landesgericht Wien":
      "Vienna Regional Court",
    "Einweisung (Prozess um Einweisung öffentlich berichtet)":
      "Committal (committal proceedings publicly reported)",
    "Tatort: gemeinsame Wohnung von Mutter und Sohn.":
      "Crime scene: the flat shared by mother and son.",
    "Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher nach Tötung der Mutter mit Gewichtshantel.":
      "Committal to an institution for mentally abnormal offenders after killing his mother with a dumbbell.",
    // 2022-06
    "Hietzing (13. Bezirk)":
      "Hietzing (13th district)",
    "Wien-Hietzing":
      "Vienna-Hietzing",
    "Verdächtig; nach versuchtem Suizid in kritischem Zustand, weiterer Verfahrensausgang nicht öffentlich bekannt":
      "Suspect; in a critical condition after attempting suicide, further outcome of proceedings not publicly known",
    "Würgemale am Hals (Ersticken/Strangulieren), Verdacht auf Mord mit anschließendem Suizidversuch":
      "Strangulation marks on the neck (suffocation/strangulation), suspected murder followed by attempted suicide",
    "Die Tochter des Paares verständigte die Polizei; diese fand die Frau tot und den Mann bewusstlos vor.":
      "The couple's daughter alerted the police, who found the woman dead and the man unconscious.",
    // 2022-07
    "Bekannter (gemeinsam gefeiert); zweiter Beschuldigter (19) ebenfalls tatverdächtig":
      "Acquaintance (had been partying together); a second accused (19) also a suspect",
    "österreichisch":
      "Austrian",
    "Festnahme; Haupttäter verurteilt":
      "Arrest; principal offender convicted",
    "Gewalt an Kopf und Hals (Schläge und Würgen); Leiche später in einem Riedgraben abgelegt":
      "Force to the head and neck (blows and strangling); body later left in a drainage ditch",
    "Lebenslange Haft für einen 28-Jährigen; Urteil im Mai 2025 rechtskräftig":
      "Life imprisonment for a 28-year-old; verdict final in May 2025",
    "Name des Opfers ('Janine G.') von vol.at öffentlich berichtet. AÖF listete zwei tatverdächtige Bekannte (19 und 25 Jahre); im Prozess beschuldigten sich die beiden Angeklagten gegenseitig, verurteilt wurde der Ältere. Angaben zu Alter der Verdächtigen weichen in späteren Prozessberichten leicht ab (Verurteilter zur Tatzeit 25/26, zur Urteilszeit 28).":
      "The victim's name ('Janine G.') was reported publicly by vol.at. AÖF listed two acquaintances as suspects (aged 19 and 25); at trial the two defendants blamed each other, and the older one was convicted. Information on the suspects' ages differs slightly in later trial reports (the convicted man was 25/26 at the time of the crime and 28 at the time of the verdict).",
    "Laut Anklage tötete der vorbestrafte Täter die Bekannte wegen seiner Geldschulden (Erwürgen).":
      "According to the indictment, the perpetrator, who had previous convictions, killed the acquaintance because of his debts (strangling).",
    // 2022-08
    "Beschuldigt; nach Suizidversuch zunächst im Krankenhaus, weiterer Ausgang nicht öffentlich bekannt":
      "Accused; initially in hospital after attempting suicide, further outcome not publicly known",
    "Mehrere Messerstiche in den Oberkörper":
      "Several knife stabs to the upper body",
    "Verdacht auf Mord und versuchten Suizid. Tatort: Wohnung des Paares.":
      "Suspected murder and attempted suicide. Crime scene: the couple's flat.",
    // 2022-31
    "mutmaßlich bekannt oder befreundet":
      "presumably acquainted or friends",
    "Ermittlungen wegen Mordverdachts, weiterer Ausgang nicht öffentlich bekannt":
      "Investigation on suspicion of murder, further outcome not publicly known",
    "Bis zur Bewusstlosigkeit gewürgt; Opfer starb eine Woche später im Spital":
      "Strangled until unconscious; the victim died in hospital a week later",
    "Streit zwischen den beiden alkoholisierten Frauen":
      "Argument between the two intoxicated women",
    "Nicht in der AÖF-Femizid-Gesamtzahl (29) enthalten: weibliche Täterin, von AÖF separat gelistet.":
      "Not included in the AÖF total of femicides (29): female perpetrator, listed separately by AÖF.",
    "Streit zwischen den beiden alkoholisierten Frauen.":
      "Argument between the two intoxicated women.",
    // 2022-09
    "Suizid nach der Tat (erweiterter Suizid)":
      "Suicide after the crime (murder-suicide)",
    "Erdrosselt":
      "Strangled",
    "Der Tat soll eine Auseinandersetzung des Paares vorangegangen sein":
      "The crime is said to have been preceded by an altercation between the couple",
    "Tatort: Wohnhaus des Paares.":
      "Crime scene: the couple's house.",
    "Der Tat soll eine Auseinandersetzung des Paares vorangegangen sein.":
      "The crime is said to have been preceded by an altercation between the couple.",
    // 2022-10
    "Landstraße (3. Bezirk)":
      "Landstraße (3rd district)",
    "Wien-Landstraße":
      "Vienna-Landstraße",
    "Tatort: Wohnung in der Nähe des Stadtparks.":
      "Crime scene: a flat near the Stadtpark.",
    // 2022-11
    "Ehemann / Ex-Mann (in Trennung lebend)":
      "Husband / ex-husband (separated)",
    "Stellte sich nach eintägiger Flucht, Tatsachengeständnis; verurteilt":
      "Turned himself in after one day on the run, confessed to the facts; convicted",
    "Drei Messerstiche mit einem Küchenmesser; Opfer verblutet":
      "Three knife stabs with a kitchen knife; the victim bled to death",
    "Verteidigung behauptete Affekt nach angeblicher Untreue; Staatsanwaltschaft Mord":
      "The defence claimed a heat-of-passion act after alleged infidelity; the public prosecutor's office: murder",
    "Lebenslange Haft und Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher; nicht rechtskräftig (Berufung/Nichtigkeitsbeschwerde angekündigt); je 50.000 Euro Trauerschmerzensgeld an vier Angehörige":
      "Life imprisonment and committal to an institution for mentally abnormal offenders; not final (appeal/plea of nullity announced); bereavement damages of €50,000 each to four relatives",
    "Tatort: Gasthaus; gegen den Täter bestand ein Betretungsverbot. Name 'Christian L.' von Krone öffentlich berichtet.":
      "Crime scene: an inn; a barring order was in force against the perpetrator. The name 'Christian L.' was reported publicly by Krone.",
    "Paar in Trennung, Betretungsverbot; Verteidigung behauptete Affekt nach angeblicher Untreue, Staatsanwaltschaft Mord.":
      "Couple separating, barring order; the defence claimed a heat-of-passion act after alleged infidelity, the public prosecutor's office murder.",
    "Der Angeklagte Christian L. (Mitte, von hinten) mit seinem Verteidiger Franz Essl (links) und einem Justizwachebeamten im Salzburger Schwurgerichtssaal":
      "The defendant Christian L. (centre, seen from behind) with his defence lawyer Franz Essl (left) and a prison officer in the Salzburg jury courtroom",
    // 2022-12
    "Freund (Beziehungspartner)":
      "Boyfriend (partner in a relationship)",
    "Mehrere Stichverletzungen im Brustbereich (erstochen)":
      "Several stab wounds to the chest (stabbed to death)",
    "Tatort: ein Parkplatz.":
      "Crime scene: a car park.",
    // 2022-13
    "Erschossen im Schlaf":
      "Shot dead while asleep",
    "Ehepaar wurde mit schweren Schussverletzungen im Schlafzimmer aufgefunden.":
      "The married couple were found in the bedroom with serious gunshot wounds.",
    "Laut Polizei gesundheitliche Probleme des 87-jährigen Täters als möglicher Grund; mehrfach krankheitsbedingt in Behandlung.":
      "According to the police, health problems of the 87-year-old perpetrator are a possible reason; he had been treated several times for illness.",
    // 2022-14
    "Rudolfsheim-Fünfhaus (15. Bezirk)":
      "Rudolfsheim-Fünfhaus (15th district)",
    "Wien-Rudolfsheim-Fünfhaus":
      "Vienna-Rudolfsheim-Fünfhaus",
    "Schusswaffe (Waffe am Tatort gefunden)":
      "Firearm (weapon found at the scene)",
    "Tatort: Wohnung des Paares.":
      "Crime scene: the couple's flat.",
    // 2022-15
    "Der Mann rief selbst den Notruf und kündigte die Tat und seinen Suizid an; die Polizei fand beide tot auf.":
      "The man himself called the emergency number and announced the crime and his suicide; the police found both dead.",
    // 2022-16
    "Fabian W. und Manuel H.":
      "Fabian W. and Manuel H.",
    "Floridsdorf (21. Bezirk)":
      "Floridsdorf (21st district)",
    "Bekannter und dessen Mitbewohner":
      "Acquaintance and his flatmate",
    "Festnahme; beide verurteilt":
      "Arrest; both convicted",
    "Stumpfe Gewalteinwirkung am gesamten Körper; qualvolle Vergewaltigung, Opfer verblutete ('zu Tode vergewaltigt')":
      "Blunt force to the whole body; agonising rape, the victim bled to death ('raped to death')",
    "Landesgericht Wien (Straflandesgericht)":
      "Vienna Regional Court (criminal division)",
    "Lebenslange Haft für beide Angeklagte wegen Mordes; OLG bestätigte im Juni 2023 (rechtskräftig)":
      "Life imprisonment for both defendants for murder; upheld by the Higher Regional Court (OLG) in June 2023 (final)",
    "Prozessbeginn 20.3.2023. Namen (Samantha F., Fabian W. 26, Manuel H. 31) öffentlich berichtet. Alter der Täter zur Tatzeit laut AÖF 25 und 30.":
      "Trial began on 20 March 2023. Names (Samantha F., Fabian W. 26, Manuel H. 31) reported publicly. According to AÖF, the perpetrators were 25 and 30 at the time of the crime.",
    "Qualvolle Vergewaltigung mit Todesfolge; Mordurteil (lebenslang) für beide Täter, OLG bestätigt.":
      "Agonising rape resulting in death; murder verdict (life imprisonment) for both perpetrators, upheld by the OLG.",
    "Der Erstangeklagte Fabian W. (Gesicht verpixelt) zeigt im Gerichtssaal seinen handgeschriebenen Brief an die getötete Samantha F.":
      "The first defendant Fabian W. (face pixelated) shows his handwritten letter to the murdered Samantha F. in the courtroom",
    // 2022-17
    "Mit Revolver erschossen":
      "Shot dead with a revolver",
    // 2022-18
    "Simmering (11. Bezirk)":
      "Simmering (11th district)",
    "Wien-Simmering":
      "Vienna-Simmering",
    "Der Mann erschoss mutmaßlich zuerst den Hund, dann die Frau, dann sich selbst; er hatte zuvor den Notruf gerufen.":
      "The man presumably first shot the dog, then the woman, then himself; he had called the emergency number beforehand.",
    // 2022-19
    "syrisch":
      "Syrian",
    "Ermittlungen (Stand der Berichterstattung), weiterer Ausgang nicht öffentlich bekannt":
      "Investigation (as of the time of reporting), further outcome not publicly known",
    "Erstickt (laut Obduktion)":
      "Suffocated (according to the post-mortem)",
    "Der Mann fuhr die Frau mit dem Auto ins Spital, wo ihr Tod festgestellt wurde.":
      "The man drove the woman to hospital in his car, where she was pronounced dead.",
    // 2022-20
    "Flüchtig, mit Haftbefehl gesucht; Festnahme nicht öffentlich berichtet":
      "At large, wanted on an arrest warrant; arrest not publicly reported",
    "Vermutlich erstickt (Gewaltverbrechen laut Obduktion)":
      "Presumably suffocated (violent crime according to the post-mortem)",
    "Name des tatverdächtigen Sohnes wurde von Krone/oe24 im Zuge der Fahndung öffentlich genannt; er galt als polizeibekannt und 'gewaltbereit'.":
      "The name of the son under suspicion was made public by Krone/oe24 during the manhunt; he was known to the police and considered 'prone to violence'.",
    "Amtliches Fahndungsfoto von Mohammad Chamseddin (24), veröffentlicht von der Polizei im Zuge der Öffentlichkeitsfahndung nach dem tatverdächtigen Sohn der getöteten 41-Jährigen":
      "Official wanted photo of Mohammad Chamseddin (24), published by the police during the public manhunt for the son of the murdered 41-year-old, who is under suspicion",
    // 2022-21
    "Mariahilf (6. Bezirk)":
      "Mariahilf (6th district)",
    "Wien-Mariahilf":
      "Vienna-Mariahilf",
    "ungarisch":
      "Hungarian",
    "Ungarn":
      "Hungary",
    "tunesisch":
      "Tunisian",
    "Tunesien":
      "Tunisia",
    "Nach 39-tägiger Fahndung am 14.9.2022 in Frankreich (bei Brest) festgenommen; verurteilt":
      "Arrested in France (near Brest) on 14 September 2022 after a 39-day manhunt; convicted",
    "Ermordet (Mutter und Tochter, Details laut Obduktion)":
      "Murdered (mother and daughter, details according to the post-mortem)",
    "Opfer war dreifache Mutter; ihre 15-jährige Tochter wurde ebenfalls getötet (siehe 2022-22)":
      "The victim was a mother of three; her 15-year-old daughter was also killed (see 2022-22)",
    "Lebenslange Haft wegen Doppelmordes":
      "Life imprisonment for double murder",
    "Doppelmord: Mutter (32) und Tochter (15). Der Täter wurde in einem Asylwerberheim in Westfrankreich gefasst.":
      "Double murder: mother (32) and daughter (15). The perpetrator was caught in an asylum seekers' hostel in western France.",
    "Tathergang laut Anklage nicht restlos geklärt; Opfer über Dating-Plattform kennengelernt.":
      "According to the indictment, the course of events has not been fully established; the victim had met him on a dating platform.",
    "Täter nach der Tat nach Frankreich geflohen und in einem Asylheim gefasst; sein Aufenthaltsstatus in Österreich wurde nie öffentlich geklärt (alternative Berichterstattung mit Asyl-Framing).":
      "Perpetrator fled to France after the crime and was caught in an asylum hostel; his residence status in Austria was never publicly clarified (alternative reporting with an asylum framing).",
    "Der 49-jährige Angeklagte (Gesicht verpixelt) am 15. Februar 2023 vor dem Schwurgericht am Landesgericht für Strafsachen Wien im Prozess um den Doppelmord von Wien-Mariahilf":
      "The 49-year-old defendant (face pixelated) on 15 February 2023 before the jury court at Vienna Regional Criminal Court at the trial over the Vienna-Mariahilf double murder",
    // 2022-22
    "Tochter einer Ungarin":
      "Daughter of a Hungarian woman",
    "Lebensgefährte der Mutter":
      "Her mother's live-in partner",
    "Festnahme in Frankreich; verurteilt":
      "Arrested in France; convicted",
    "Ermordet (gemeinsam mit ihrer Mutter)":
      "Murdered (together with her mother)",
    "Opfer war selbst 15 Jahre alt; ihre Mutter (2022-21) wurde ebenfalls getötet":
      "The victim was herself 15 years old; her mother (2022-21) was also killed",
    "Lebenslange Haft wegen Doppelmordes (gleiches Verfahren wie 2022-21)":
      "Life imprisonment for double murder (same proceedings as 2022-21)",
    "Zweites Opfer des Doppelmordes von Wien-Mariahilf.":
      "Second victim of the Vienna-Mariahilf double murder.",
    "Zweites Opfer desselben Tathergangs wie 2022-21; Motiv nicht restlos geklärt.":
      "Second victim of the same crime as 2022-21; motive not fully established.",
    "Der 49-jährige Angeklagte (Gesicht verpixelt) im Doppelmord-Prozess – neben seiner Lebensgefährtin hatte er auch deren 15-jährige Tochter erwürgt":
      "The 49-year-old defendant (face pixelated) at the double-murder trial – besides his live-in partner, he had also strangled her 15-year-old daughter",
    // 2022-23
    "Ehemann (dringend tatverdächtig)":
      "Husband (prime suspect)",
    "Dringend tatverdächtig (Stand der Berichterstattung), weiterer Ausgang nicht öffentlich bekannt":
      "Prime suspect (as of the time of reporting), further outcome not publicly known",
    "Der Ehemann fand die Frau tot im Einfamilienhaus und alarmierte die Einsatzkräfte; da keine Einbruchsspuren festgestellt wurden, gilt er als tatverdächtig.":
      "The husband found the woman dead in their detached house and alerted the emergency services; since no signs of a break-in were found, he is considered a suspect.",
    // 2022-24
    "Moldau":
      "Moldova",
    "Erstochen":
      "Stabbed to death",
    "Tatort: Wohnung eines Bekannten, der die beiden Toten fand.":
      "Crime scene: the flat of an acquaintance, who found the two bodies.",
    // 2022-25
    "ursprünglich aus Rumänien":
      "originally from Romania",
    "Ehemann (getrennt lebend)":
      "Husband (separated)",
    "türkischer Abstammung":
      "of Turkish descent",
    "Mehr als 30 Messerstiche an der Wohnungstür / vor dem Wohnhaus; Opfer starb am Tatort":
      "More than 30 knife stabs at the door of the flat / in front of the building; the victim died at the scene",
    "Eifersucht (behauptete Untreue); zehnjährige gewaltgeprägte Beziehung, mehrere Betretungs- und Annäherungsverbote seit 2015, Waffenverbot, elf Vorstrafen":
      "Jealousy (alleged infidelity); ten-year relationship marked by violence, several barring and no-contact orders since 2015, weapons ban, eleven previous convictions",
    "Drei gemeinsame Kinder; Tat in Gegenwart eines gemeinsamen Kindes bzw. beim Zurückbringen der jüngsten Tochter":
      "Three children together; crime in the presence of one of their children, when the youngest daughter was being brought back",
    "Lebenslange Haft wegen Mordes (einstimmig); nicht rechtskräftig (Nichtigkeitsbeschwerde angekündigt); 60.000 Euro Trauerschmerzensgeld an die drei Kinder, 5.000 Euro an den Bruder des Opfers":
      "Life imprisonment for murder (unanimous); not final (plea of nullity announced); bereavement damages of €60,000 to the three children and €5,000 to the victim's brother",
    "Der Täter (zur Urteilszeit 37) hatte der Frau zuletzt aus dem Gefängnis per SMS mit dem Tod gedroht.":
      "The perpetrator (37 at the time of the verdict) had most recently threatened the woman with death by text message from prison.",
    "Eifersucht (behauptete Untreue); zehnjährige gewaltgeprägte Beziehung, mehrere Betretungsverbote, Todesdrohungen per SMS.":
      "Jealousy (alleged infidelity); ten-year relationship marked by violence, several barring orders, death threats by text message.",
    // 2022-26
    "Mit Pistole erschossen":
      "Shot dead with a pistol",
    "Tatort: Zentralfriedhof Graz; ein Abschiedsbrief wurde gefunden.":
      "Crime scene: Graz central cemetery; a farewell letter was found.",
    // 2022-27
    "Kunde (Opfer als 'Begleitdame'/Escort gebucht)":
      "Client (had booked the victim as a 'companion'/escort)",
    "Festnahme; verurteilt":
      "Arrest; convicted",
    "Massive Gewalteinwirkung ('bestialische Vorgehensweise' laut Gericht)":
      "Massive force ('bestial approach' according to the court)",
    "Laut psychiatrischem Gutachten 'generalisierte[r] Frauenhass'":
      "According to the psychiatric expert report, 'generalised hatred of women'",
    "Landesgericht Steyr":
      "Steyr Regional Court",
    "Lebenslange Haft wegen Mordes (7:1 Geschworenenstimmen); vom OLG Linz im Oktober 2023 bestätigt (rechtskräftig)":
      "Life imprisonment for murder (7:1 jury votes); upheld by the Linz Higher Regional Court (OLG) in October 2023 (final)",
    "Alter des Opfers in der AÖF-Liste nicht angegeben ('?'); laut Prozessberichten junge Frau. Täter zur Prozesszeit 36.":
      "Age of the victim not given in the AÖF list ('?'); according to trial reports, a young woman. Perpetrator aged 36 at the time of the trial.",
    "Laut psychiatrischem Gutachten 'generalisierte[r] Frauenhass'; Opfer als Escort gebucht.":
      "According to the psychiatric expert report, 'generalised hatred of women'; the victim had been booked as an escort.",
    // 2022-28
    "Zunächst in U-Haft (Justizanstalt Krems); Mordermittlungen im Dezember 2022 eingestellt":
      "Initially in pre-trial detention (Krems prison); murder investigation discontinued in December 2022",
    "Von Pkw überrollt und eingeklemmt":
      "Run over by a car and trapped underneath",
    "Landesgericht Krems":
      "Krems Regional Court",
    "Der Ehemann (Zulassungsbesitzer, ehemaliger Berufssoldat, bei Einvernahme alkoholisiert) bestritt die Tötungsabsicht. Die Staatsanwaltschaft Krems stellte die Mordermittlungen ein; für Jänner 2023 wurde ein Prozess in Krems angekündigt (Anklageinhalt und Ausgang nicht abschließend öffentlich dokumentiert).":
      "The husband (registered keeper of the car, a former professional soldier, intoxicated when questioned) denied any intent to kill. The Krems public prosecutor's office discontinued the murder investigation; a trial in Krems was announced for January 2023 (charges and outcome not conclusively documented in public).",
    // 2022-29
    "Döbling (19. Bezirk)":
      "Döbling (19th district)",
    "Partybekanntschaft":
      "Acquaintance from a party",
    "Angeklagt; freigesprochen":
      "Charged; acquitted",
    "Tod infolge von Alkohol und Drogen nach mutmaßlichem sexuellem Missbrauch; die leblose Frau wurde im Stiegenhaus abgelegt":
      "Death as a result of alcohol and drugs after suspected sexual abuse; the lifeless woman was left in the stairwell",
    "Freispruch vom Vorwurf des sexuellen Missbrauchs einer wehrlosen Person und Imstichlassens einer Verletzten mit Todesfolge":
      "Acquitted of the charges of sexual abuse of a defenceless person and of abandoning an injured person resulting in death",
    "Tatzeitpunkt Nacht 4./5.12.2022. AÖF zählte den Fall als mutmaßlichen Femizid; der Prozess endete mit Freispruch.":
      "Time of the crime: the night of 4 to 5 December 2022. AÖF counted the case as a suspected femicide; the trial ended in an acquittal.",
    "Mutmaßlicher sexueller Missbrauch einer wehrlosen Person mit Todesfolge; Prozess endete mit Freispruch.":
      "Suspected sexual abuse of a defenceless person resulting in death; the trial ended in an acquittal."
  };
  for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k)) I.dict[k] = d[k];
  I.keep.push(
    "Aschach an der Steyr",
    "Rosina H.",
    "Josef H.",
    "Steyr-Land",
    "Anger bei Weiz",
    "Weiz",
    "Favoriten",
    "Alsergrund",
    "Schallmoos",
    "Gries (Idlhofgasse)",
    "Neulengbach",
    "St. Pölten-Land",
    "Nadine W.",
    "Brigittenau",
    "vienna.at",
    "Ottakring",
    "Wals-Siezenheim",
    "Helga B.",
    "Salzburg-Umgebung (Flachgau)",
    "Ingrid B.",
    "Vöcklabruck",
    "Simmering",
    "Leonie W.",
    "Donaustadt",
    "unzensuriert.at",
    "report24.news",
    "Apple Podcasts (True Crime)",
    "Brigittenau (Vorgartenstraße)",
    "Geidorf",
    "Maishofen",
    "Zell am See (Pinzgau)",
    "Somalia",
    "Markus J.",
    "Deutsch-Brodersdorf",
    "Bürs",
    "Weerberg",
    "Schwaz",
    "Floridsdorf",
    "Villach",
    "Innsbruck",
    "Iran",
    "Hohenems",
    "Dornbirn",
    "Weißenkirchen im Attergau",
    "Sollenau",
    "Lustenau",
    "Janine G.",
    "Stockerau",
    "Korneuburg",
    "Kufstein",
    "Schwendt",
    "Piesendorf",
    "Christian L.",
    "Pinzgau",
    "Reutte",
    "Schladming",
    "Groß-Enzersdorf",
    "Samantha F.",
    "Wagna",
    "Mohammad Chamseddin",
    "Exxpress",
    "ORF Wien",
    "Oberwaltersdorf",
    "Ternberg",
    "Litschau",
    "Gmünd"
  );
})(window);
