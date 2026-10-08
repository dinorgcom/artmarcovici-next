/* Femizide in Österreich – englisches Wörterbuch: Falltexte 2025–2026.
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
    // 2025-01
    "Mit einer Axt im Schlaf erschlagen":
      "Beaten to death with an axe while asleep",
    "Leichen am 2.1.2025 auf Anwesen gefunden; Tat mutmaßlich in der Nacht zuvor (moment.at führt 3.1.2025). Motiv laut Polizei völlig unklar.":
      "Bodies found on the property on 2 January 2025; crime presumably during the previous night (moment.at gives 3 January 2025). According to the police, the motive is completely unclear.",
    "Bruder tötete Schwester; Motiv laut Polizei völlig unklar.":
      "Brother killed his sister; according to the police, the motive is completely unclear.",
    // 2025-02
    "Bekannter":
      "Acquaintance",
    "Festnahme Mitte März 2025; rechtskräftig verurteilt (lebenslang)":
      "Arrested in mid-March 2025; convicted, final (life imprisonment)",
    "Mit einem Hammer erschlagen (mindestens 17 wuchtige Schläge, massive Schädelverletzungen)":
      "Beaten to death with a hammer (at least 17 forceful blows, massive skull injuries)",
    "Landesgericht Wiener Neustadt":
      "Wiener Neustadt Regional Court",
    "Lebenslange Freiheitsstrafe wegen Mordes (Geschworenenprozess, Beginn 18.11.2025; Angeklagter nicht geständig)":
      "Life imprisonment for murder (jury trial, began on 18 November 2025; the defendant did not confess)",
    "Opfer galt als 'Leihoma' des Täters; in ihrer Wohnung getötet, nach Angehörigen-Alarm gefunden.":
      "The victim was regarded as the perpetrator's 'surrogate grandmother' (Leihoma); killed in her flat, found after relatives raised the alarm.",
    "'Leihoma'-Verhältnis; Täter nicht geständig, Motiv nicht öffentlich geklärt.":
      "'Surrogate grandmother' relationship; the perpetrator did not confess, motive not publicly established.",
    // 2025-03
    "Mutmaßlich schwere Erkrankung; Ermittlungen liefen Richtung 'Tötung auf Verlangen' mit anschließendem Suizid":
      "Presumably serious illness; the investigation pointed towards 'killing on request' followed by suicide",
    "Paar am 16.2.2025 (Sonntag) tot im Wohnhaus gefunden; moment.at führt 17.2.2025.":
      "Couple found dead in their house on 16 February 2025 (Sunday); moment.at gives 17 February 2025.",
    "Mutmaßlich schwere Erkrankung; Ermittlungen Richtung Tötung auf Verlangen mit anschließendem Suizid.":
      "Presumably serious illness; investigation pointing towards killing on request followed by suicide.",
    // 2025-04
    "Leopoldstadt (2. Bezirk)":
      "Leopoldstadt (2nd district)",
    "Bekannter / Geliebter":
      "Acquaintance / lover",
    "Festnahme am Tatabend; verurteilt zu 15 Jahren Haft":
      "Arrested on the evening of the crime; sentenced to 15 years' imprisonment",
    "Erschlagen (nach Streit in Wohnung)":
      "Beaten to death (after an argument in the flat)",
    "Streit":
      "Argument",
    "15 Jahre Freiheitsstrafe wegen Mordes (Angeklagter zum Prozesszeitpunkt 21)":
      "15 years' imprisonment for murder (defendant aged 21 at the time of the trial)",
    "Augenzeuge sah, wie der Mann die Frau zu Boden schlug und in die Wohnung zog; Täter laut Krone als psychisch krank beschrieben.":
      "An eyewitness saw the man knock the woman to the ground and drag her into the flat; according to Krone, the perpetrator was described as mentally ill.",
    "Streit in der Wohnung eskaliert; Boulevard beschrieb den Täter als psychisch krank (nicht gutachterlich belegt).":
      "Argument in the flat escalated; tabloids described the perpetrator as mentally ill (not substantiated by an expert report).",
    // 2025-09
    "Steiermark (Winzer)":
      "Styria (winegrower)",
    "U-Haft seit Juli 2025; am 11.5.2026 vom Mordvorwurf freigesprochen (nicht rechtskräftig), wegen schweren Betrugs zu 2 Jahren (16 Monate bedingt) verurteilt":
      "In pre-trial detention since July 2025; acquitted of the murder charge on 11 May 2026 (not final), sentenced to 2 years (16 months suspended) for aggravated fraud",
    "Tödliche Gabe eines Schlafmittels (Pentobarbital-Natrium) unter dem Vorwand der Sterbehilfe; Opfer laut Anklage zum Einnahmezeitpunkt nicht sterbewillig":
      "Fatal dose of a sleeping drug (sodium pentobarbital) under the pretext of assisted dying; according to the indictment, the victim did not wish to die at the time she took it",
    "Landesgericht St. Pölten":
      "St. Pölten Regional Court",
    "Freispruch vom Mordvorwurf (nicht rechtskräftig); Verurteilung wegen schweren Betrugs (2 Jahre, 16 Monate bedingt)":
      "Acquitted of the murder charge (not final); convicted of aggravated fraud (2 years, 16 months suspended)",
    "Fall erst am 6.8.2025 öffentlich bekannt geworden. Opfer war eine vermögende Witwe; Tochter und Pfleger belasteten den Angeklagten. Täter zum Prozesszeitpunkt 58.":
      "The case only became public on 6 August 2025. The victim was a wealthy widow; her daughter and a carer incriminated the defendant. Perpetrator aged 58 at the time of the trial.",
    "Anklage: finanzielles Motiv (vermögende Witwe); Mordvorwurf endete mit Freispruch (nicht rechtskräftig), Verurteilung wegen schweren Betrugs.":
      "Indictment: financial motive (wealthy widow); the murder charge ended in an acquittal (not final), conviction for aggravated fraud.",
    // 2025-05
    "Geständig, Suizidversuch nach der Tat, U-Haft; verurteilt zu lebenslanger Haft":
      "Confessed, suicide attempt after the crime, pre-trial detention; sentenced to life imprisonment",
    "Zahlreiche Messerstiche in den Oberkörper (verblutet); Teile der Tat von Überwachungskamera im Wohnzimmer aufgezeichnet":
      "Numerous knife stabs to the upper body (bled to death); parts of the crime were recorded by a surveillance camera in the living room",
    "Eifersucht (Tat nach Feier und Streit)":
      "Jealousy (crime after a party and an argument)",
    "20-jährige Tochter fand die tote Mutter":
      "The 20-year-old daughter found her dead mother",
    "Landesgericht Ried im Innkreis":
      "Ried im Innkreis Regional Court",
    "Lebenslange Freiheitsstrafe wegen Mordes (Angeklagter zum Prozesszeitpunkt 36)":
      "Life imprisonment for murder (defendant aged 36 at the time of the trial)",
    "Tat Samstagfrüh 22.3.2025; moment.at führt 23.3.2025 (Bekanntwerden).":
      "Crime on Saturday morning, 22 March 2025; moment.at gives 23 March 2025 (when it became known).",
    "Eifersucht; Tat nach Feier und Streit.":
      "Jealousy; crime after a party and an argument.",
    // 2025-06
    "Flucht in die Niederlande, dort festgenommen, August 2025 nach Österreich ausgeliefert; verurteilt zu lebenslanger Haft":
      "Fled to the Netherlands, arrested there, extradited to Austria in August 2025; sentenced to life imprisonment",
    "Auf einem Supermarkt-Parkplatz aus nächster Nähe erschossen (Schuss gegen den Kopf/die Stirn)":
      "Shot dead at point-blank range in a supermarket car park (shot to the head/forehead)",
    "Beziehungstat (Trennung); genaues Motiv nicht öffentlich abschließend geklärt":
      "Intimate-partner killing (separation); exact motive not conclusively established in public",
    "Lebenslange Freiheitsstrafe wegen Mordes (Angeklagter zum Prozesszeitpunkt 33)":
      "Life imprisonment for murder (defendant aged 33 at the time of the trial)",
    "Tat um 0:40 Uhr; Opfer war mit einer Freundin zum Treffpunkt gefahren.":
      "Crime at 0:40; the victim had driven to the meeting point with a friend.",
    "Beziehungstat nach Trennung; Ex-Lebensgefährte erschoss das Opfer auf einem Parkplatz.":
      "Intimate-partner killing after separation; her former live-in partner shot the victim dead in a car park.",
    "Der 33-jährige Angeklagte (sitzend, von hinten, verpixelt) beim Mordprozess am Salzburger Landesgericht":
      "The 33-year-old defendant (seated, seen from behind, pixelated) at the murder trial at Salzburg Regional Court",
    "Der Angeklagte verdeckt beim Prozessauftakt am Salzburger Landesgericht sein Gesicht mit einem Blatt Papier":
      "The defendant covers his face with a sheet of paper at the opening of the trial at Salzburg Regional Court",
    // 2025-07
    "U-Haft; verurteilt zu lebenslanger Haft":
      "Pre-trial detention; sentenced to life imprisonment",
    "Mit Fäusten und einem Spaten erschlagen (schwere Verletzungen an Gesicht und Hals) im Vorgarten/Innenhof eines Mehrparteienhauses":
      "Beaten to death with fists and a spade (severe injuries to the face and neck) in the front garden/courtyard of an apartment building",
    "Langjähriger Nachbarschaftsstreit (u. a. wegen einer Ameisenstraße)":
      "Long-running dispute between neighbours (among other things over a trail of ants)",
    "Landesgericht Graz":
      "Graz Regional Court",
    "Opfer in Einzelberichten auch als 73-jährig bezeichnet.":
      "Some reports also describe the victim as 73 years old.",
    "Langjähriger Nachbarschaftsstreit (u. a. wegen einer Ameisenstraße).":
      "Long-running dispute between neighbours (among other things over a trail of ants).",
    // 2025-08
    "Mit Schusswaffe erschossen":
      "Shot dead with a firearm",
    "Mutmaßlich schwere Erkrankung":
      "Presumably serious illness",
    "Neffe des Ehepaars alarmierte die Polizei. moment.at nennt die Altersangaben umgekehrt (81-jährige Frau/79-jähriger Mann); Mehrheit der Berichte: 79-jährige Ehefrau, 81-jähriger Täter.":
      "The couple's nephew alerted the police. moment.at gives the ages the other way round (81-year-old woman/79-year-old man); most reports: 79-year-old wife, 81-year-old perpetrator.",
    "Mutmaßlich schwere Erkrankung.":
      "Presumably serious illness.",
    // 2025-10
    "Am Tatort festgenommen, U-Haft; im Februar 2026 in eine Anstalt geistig abnormer Rechtsbrecher eingewiesen":
      "Arrested at the scene, pre-trial detention; committed to an institution for mentally abnormal offenders in February 2026",
    "34–35 Messerstiche":
      "34–35 knife stabs",
    "Einweisung in ein forensisch-therapeutisches Zentrum (Tat gestanden; zum Prozesszeitpunkt 65)":
      "Committal to a forensic therapeutic centre (crime confessed; aged 65 at the time of the trial)",
    "Opfer in Einfamilienhaus gefunden; Prozessbeginn 9.2.2026.":
      "Victim found in a detached house; trial began on 9 February 2026.",
    "Einweisung in forensisch-therapeutisches Zentrum nach gestandener Tat; Motiv nicht öffentlich geklärt.":
      "Committal to a forensic therapeutic centre after a confessed crime; motive not publicly established.",
    // 2025-11
    "Wien (Vorgartenstraße)":
      "Vienna (Vorgartenstraße)",
    "(Noch-)Ehemann, getrennt lebend / in Scheidung":
      "Husband (still married), separated / divorcing",
    "Nach Schusswechsel mit der Polizei tot aufgefunden (Schussverletzung)":
      "Found dead after an exchange of fire with the police (gunshot wound)",
    "Mit Schusswaffe erschossen (Gemeindebau Vorgartenstraße/Wehlistraße)":
      "Shot dead with a firearm (council housing block on Vorgartenstraße/Wehlistraße)",
    "Eifersucht / Scheidungssituation; Täter war polizeibekannt":
      "Jealousy / divorce situation; the perpetrator was known to the police",
    "24-jährige Tochter schwer verletzt (verstarb am 19.9.2025, siehe 2025-12); Freund der Tochter ebenfalls verletzt":
      "24-year-old daughter seriously injured (died on 19 September 2025, see 2025-12); the daughter's boyfriend was also injured",
    "Großeinsatz der Polizei; Namen aus Krone-Berichten (öffentlich berichtet).":
      "Major police operation; names from Krone reports (publicly reported).",
    "Eifersucht/Scheidungssituation; Täter war polizeibekannt.":
      "Jealousy/divorce situation; the perpetrator was known to the police.",
    "Die 44-jährige Zlatica M. und ihr gleichaltriger Noch-Ehemann Nenad M. (Gesichter unkenntlich gemacht)":
      "The 44-year-old Zlatica M. and her husband of the same age, Nenad M., from whom she was separating (faces made unrecognisable)",
    "Nenad M. (rechts, Gesicht unkenntlich gemacht) mit seiner Noch-Ehefrau Zlatica M.":
      "Nenad M. (right, face made unrecognisable) with his wife Zlatica M., from whom he was separating",
    "Das (Noch)-Ehepaar Zlatica und Nenad M. vor dem Mercedes, in dem sich der Schütze schließlich selbst erschossen haben soll (Gesichter unkenntlich gemacht)":
      "The separating couple Zlatica and Nenad M. in front of the Mercedes in which the gunman is said to have finally shot himself (faces made unrecognisable)",
    "Nenad M. (links, Gesicht unkenntlich gemacht) vor dem Mercedes, in dem er sich nach der Tat erschossen haben soll":
      "Nenad M. (left, face made unrecognisable) in front of the Mercedes in which he is said to have shot himself after the crime",
    // 2025-12
    "Nach der Tat tot (siehe 2025-11)":
      "Dead after the crime (see 2025-11)",
    "Schussverletzungen (bei der Tat vom 16.9.2025 erlitten, drei Tage später im Spital verstorben)":
      "Gunshot wounds (sustained during the crime on 16 September 2025, died in hospital three days later)",
    "Familientat im Zuge der Scheidungssituation (siehe 2025-11)":
      "Crime within the family in the context of the divorce situation (see 2025-11)",
    "Opfer war selbst die Tochter des Täters":
      "The victim was herself the perpetrator's daughter",
    "Zweites Todesopfer der Bluttat vom 16.9.2025.":
      "Second fatality of the killing on 16 September 2025.",
    "Familientat im Zuge der Scheidungssituation (Tochter des Täters).":
      "Crime within the family in the context of the divorce situation (the perpetrator's daughter).",
    "Nenad M. (rechts, Gesicht unkenntlich gemacht), der mutmaßliche Schütze von Wien-Leopoldstadt, mit seiner Noch-Ehefrau Zlatica M.":
      "Nenad M. (right, face made unrecognisable), the alleged gunman of Vienna-Leopoldstadt, with his wife Zlatica M., from whom he was separating",
    // 2025-13
    "Leicht verletzt in U-Haft genommen, geständig; rechtskräftig zu lebenslanger Haft verurteilt":
      "Taken into pre-trial detention slightly injured, confessed; finally sentenced to life imprisonment",
    "Opfer zunächst niedergeschlagen und gewürgt, dann mit mehreren Messerstichen getötet":
      "The victim was first knocked down and strangled, then killed with several knife stabs",
    "41-jähriger Sohn des Paares ebenfalls getötet":
      "The couple's 41-year-old son was also killed",
    "Lebenslange Freiheitsstrafe wegen Doppelmordes (rechtskräftig)":
      "Life imprisonment for double murder (final)",
    "moment.at/AÖF führen nur die 70-jährige Ehefrau als Femizid-Opfer; der getötete Sohn ist als 'direkt betroffenes' Familienmitglied vermerkt.":
      "moment.at/AÖF list only the 70-year-old wife as a femicide victim; the son who was killed is recorded as a 'directly affected' family member.",
    "Streit; Doppelmord an Ehefrau und Sohn.":
      "Argument; double murder of his wife and son.",
    // 2025-14
    "Mutmaßlich schwere Erkrankung der Frau":
      "Presumably serious illness of the woman",
    "Rettungskräfte entdeckten die Leichen am Freitagmorgen im Haus des Paares.":
      "Paramedics discovered the bodies in the couple's house on Friday morning.",
    "Mutmaßlich schwere Erkrankung der Frau.":
      "Presumably serious illness of the woman.",
    // 2025-15
    "In U-Haft; nach anfänglichem Geständnis gibt er die Tötung laut StA Graz bisher nicht zu (räumt Transport und Vergraben der Leiche ein); Mordanklage (samt Störung der Totenruhe) am 21.9.2026 eingebracht, Verhandlungstermin offen":
      "In pre-trial detention; after an initial confession, according to the Graz public prosecutor's office he has so far not admitted the killing (admits transporting and burying the body); murder charge (including disturbing the peace of the dead) filed on 21 September 2026, trial date open",
    "Laut Anklage intensiv gewürgt sowie Stich- und Schnittwunden am Hals zugefügt (in der Wohnung des Opfers); Leiche in einem Reisekoffer nach Slowenien gebracht und in einem Wald nahe Majšperk vergraben":
      "According to the indictment, strangled intensively and stab and cut wounds inflicted on the neck (in the victim's flat); body taken to Slovenia in a suitcase and buried in a forest near Majšperk",
    "Beziehungstat nach Trennung (Täter gab an, er habe sie 'geliebt')":
      "Intimate-partner killing after separation (the perpetrator stated that he had 'loved' her)",
    "Opfer seit 23.11.2025 vermisst, Leichnam am 29.11.2025 in Slowenien gefunden; moment.at führt 29.11.2025 (Funddatum). Opfer war als Influencerin bekannt; Täter wurde an einer Tankstelle in Slowenien gefasst. Mordanklage der StA Graz am 21.9.2026 (nicht rechtskräftig); Ermittlungen gegen Bruder und Stiefvater des Angeklagten wegen Beitrags zum Leichentransport eingestellt.":
      "Victim missing since 23 November 2025, body found in Slovenia on 29 November 2025; moment.at gives 29 November 2025 (date found). The victim was known as an influencer; the perpetrator was caught at a petrol station in Slovenia. Murder charge filed by the Graz public prosecutor's office on 21 September 2026 (not final); investigations against the defendant's brother and stepfather for contributing to transporting the body were discontinued.",
    "Beziehungstat nach Trennung; Täter zunächst geständig (gab an, er habe sie 'geliebt'), bestreitet laut Anklagebehörde inzwischen die Tötung.":
      "Intimate-partner killing after separation; the perpetrator initially confessed (stated that he had 'loved' her) but, according to the prosecuting authority, now denies the killing.",
    "Stefanie P. und der mutmaßliche Täter im Frühjahr 2025 bei einer Party in einem Grazer Club (Gesichter unkenntlich gemacht)":
      "Stefanie P. and the alleged perpetrator in spring 2025 at a party in a Graz club (faces made unrecognisable)",
    "Polizisten und Justizwache bewachen den 31-jährigen Ex-Freund von Stefi P. beim Lokalaugenschein am Tatort (Gesichter verpixelt)":
      "Police officers and prison officers guard the 31-year-old ex-boyfriend of Stefi P. during the on-site reconstruction at the crime scene (faces pixelated)",
    "Der mutmaßliche Täter und das Opfer Stefanie P. im Frühjahr 2025 bei einer Party in einem Grazer Club (Gesichter unkenntlich gemacht)":
      "The alleged perpetrator and the victim Stefanie P. in spring 2025 at a party in a Graz club (faces made unrecognisable)",
    // 2025-16
    "Wels (Stadtteil Wimpassing)":
      "Wels (Wimpassing district)",
    "Suizid nach der Tat (Strangulation in seiner nahe gelegenen Wohnung; laut Staatsanwaltschaft vermutlich Suizid)":
      "Suicide after the crime (strangulation in his nearby flat; according to the public prosecutor's office, presumably suicide)",
    "Erstickt (laut vorläufigem Obduktionsergebnis 'fremdhändiger Angriff gegen den Hals'); Leiche erst Wochen später in ihrer Wohnung gefunden":
      "Suffocated (according to the preliminary post-mortem result, an 'attack on the neck by another person'); body found in her flat only weeks later",
    "Unklar; laut 'Krone' möglicher Zusammenhang mit der Beeinträchtigung der Tochter – laut Staatsanwaltschaft Wels wird sich das Motiv vermutlich nicht mehr klären lassen":
      "Unclear; according to 'Krone', possibly connected to the daughter's disability – according to the Wels public prosecutor's office, the motive will probably never be established",
    "AÖF-Liste 2025 Nr. 16 ('Tat vermutlich 12/2025', Medienbericht vom 9.2.2026). Tatzeitpunkt unklar: Laut StA Wels kamen Vater und Tochter am 25.12.2025 gemeinsam aus Ungarn zurück; die stark verwesten Leichen wurden am 26.1.2026 nach einer Vermisstenanzeige des Arbeitgebers der Frau gefunden. Das Datum 25.12.2025 ist daher nur der frühestmögliche Tatzeitpunkt (Näherungswert). Die Tochter war laut StA beeinträchtigt und auf Betreuung angewiesen. Gegen den Vater gab es 2024 und 2025 zwei Anzeigen wegen Misshandlung, beide ohne Ergebnis. Kein Strafverfahren wegen Tod des Täters; toxikologische Ergebnisse standen bei Bekanntwerden noch aus.":
      "AÖF list 2025 no. 16 ('crime presumably 12/2025', media report of 9 February 2026). Time of the crime unclear: according to the Wels public prosecutor's office, father and daughter returned together from Hungary on 25 December 2025; the heavily decomposed bodies were found on 26 January 2026 after the woman's employer reported her missing. The date of 25 December 2025 is therefore only the earliest possible time of the crime (approximation). According to the public prosecutor's office, the daughter had a disability and was dependent on care. There were two complaints of abuse against the father in 2024 and 2025, both without result. No criminal proceedings because of the perpetrator's death; toxicology results were still pending when the case became known.",
    "Laut 'Krone' möglicher Zusammenhang mit der Beeinträchtigung der Tochter; StA bestätigte die Beeinträchtigung, Motiv werde sich vermutlich nicht klären lassen; Täter beging danach mutmaßlich Suizid.":
      "According to 'Krone', possibly connected to the daughter's disability; the public prosecutor's office confirmed the disability and said the motive will probably never be established; the perpetrator presumably then took his own life.",
    // 2026-01
    "Geständig (telefonisch gegenüber Bekanntem und bei Polizei), in U-Haft; Mordanklage der StA Korneuburg (Juli 2026, noch ohne Rechtskraft), Prozesstermin offen":
      "Confessed (by telephone to an acquaintance and to the police), in pre-trial detention; murder charge by the Korneuburg public prosecutor's office (July 2026, not yet final), trial date open",
    "Erdrosselt/erwürgt; Leiche im Erdkeller des Täters verscharrt":
      "Strangled; body buried in the perpetrator's earth cellar",
    "Fall am 14.1.2026 öffentlich bekannt geworden. Mordanklage am 16.7.2026 bekannt geworden (noch nicht rechtskräftig); laut ORF gab es an der Adresse schon früher polizeiliche Interventionen. Opfer war deutsche Staatsbürgerin.":
      "The case became public on 14 January 2026. The murder charge became known on 16 July 2026 (not yet final); according to ORF, the police had already intervened at the address in the past. The victim was a German citizen.",
    "Geständiger Lebensgefährte; Motiv nicht öffentlich berichtet.":
      "Live-in partner confessed; motive not publicly reported.",
    // 2026-02
    "Tillmitsch (Bezirk Leibnitz)":
      "Tillmitsch (Leibnitz district)",
    "Ex-Partner / Affäre":
      "Ex-partner / affair",
    "Festnahme, Teilgeständnis, U-Haft; suspendierter Polizist (Cobra-Beamter); Mordanklage (samt Störung der Totenruhe) am 24.9.2026 eingebracht, bestreitet Mord (Unfall-Version), Verhandlungstermin offen":
      "Arrest, partial confession, pre-trial detention; suspended police officer (member of the Cobra special unit); murder charge (including disturbing the peace of the dead) filed on 24 September 2026, denies murder (accident version), trial date open",
    "Laut Anklage mit einem Gürtel erdrosselt; Leiche in einem Waldstück vergraben":
      "According to the indictment, strangled with a belt; body buried in a wooded area",
    "Opfer seit 9.1.2026 vermisst; hatte in ihrem Umfeld von einer Schwangerschaft erzählt. Besondere öffentliche Aufmerksamkeit wegen des Berufs des Verdächtigen. Mordanklage der StA Graz am 24.9.2026 (Angeklagter inzwischen 31, gerichtlich unbescholten); ein zweites Ermittlungsverfahren (Diebstahl einer Dienstwaffe, unbefugter Waffenbesitz) vorerst eingestellt.":
      "Victim missing since 9 January 2026; had told people around her about a pregnancy. Particular public attention because of the suspect's profession. Murder charge filed by the Graz public prosecutor's office on 24 September 2026 (defendant now 31, no previous convictions); a second investigation (theft of a service weapon, unauthorised possession of a weapon) has been discontinued for the time being.",
    "Affäre; Opfer hatte von einer Schwangerschaft erzählt; Täter (suspendierter Cobra-Beamter) stellt die Tat als Unfall dar (Teilgeständnis).":
      "Affair; the victim had spoken of a pregnancy; the perpetrator (suspended Cobra officer) presents the crime as an accident (partial confession).",
    "Johanna G. (links, Gesicht verpixelt) – Bildcollage mit der Wohnungstür und dem Cobra-Beamten Manuel M. (rechts)":
      "Johanna G. (left, face pixelated) – photo collage with the door of the flat and the Cobra officer Manuel M. (right)",
    "Cobra-Beamter Manuel M., der ein Geständnis abgelegt hat (Porträt mit schwarzem Balken)":
      "Cobra officer Manuel M., who has made a confession (portrait with black bar)",
    "Cobra-Beamter Manuel M. (rechts im Bild, Gesicht unkenntlich gemacht) – Collage mit Johanna G. und der Wohnungstür":
      "Cobra officer Manuel M. (right of picture, face made unrecognisable) – collage with Johanna G. and the door of the flat",
    // 2026-03
    "Mutmaßlich längere Krankheit; Ehepaar wollte laut Polizei nicht weiterleben":
      "Presumably prolonged illness; according to the police, the couple did not want to go on living",
    "AÖF: 'beide ca. 60 Jahre alt'; Ehepaar am Mittwoch tot aufgefunden.":
      "AÖF: 'both approx. 60 years old'; couple found dead on Wednesday.",
    "Mutmaßlich längere Krankheit; Ehepaar wollte laut Polizei nicht weiterleben.":
      "Presumably prolonged illness; according to the police, the couple did not want to go on living.",
    // 2026-04
    "Suizid (starb kurz nach der Tat im Krankenhaus)":
      "Suicide (died in hospital shortly after the crime)",
    "Angeschossen (Schusswaffe); Opfer erlag in der Nacht auf 11.3.2026 im Spital den Verletzungen":
      "Shot (firearm); the victim died of her injuries in hospital during the night to 11 March 2026",
    "Tat am Montag, 9.3.2026; beide wurden noch lebend gefunden und per Notarzthubschrauber nach Wien bzw. Graz geflogen. AÖF führt 11.3.2026 (Todestag der Frau).":
      "Crime on Monday, 9 March 2026; both were found still alive and flown by emergency helicopter to Vienna and Graz respectively. AÖF gives 11 March 2026 (the woman's date of death).",
    "87-jähriger Täter, Suizid kurz nach der Tat; Motiv nicht berichtet.":
      "87-year-old perpetrator, suicide shortly after the crime; motive not reported.",
    // 2026-05
    "Mit einem Küchenmesser erstochen (Stiegenhaus eines Mehrparteienhauses)":
      "Stabbed to death with a kitchen knife (stairwell of an apartment building)",
    "Trennungssituation; am Vortag war eine Wegweisung gegen den Mann ausgesprochen worden":
      "Separation situation; a barring order had been issued against the man the day before",
    "Leichen am Sonntagvormittag im Stiegenhaus gefunden; Opfer laut Krone 'einheimisch'.":
      "Bodies found in the stairwell on Sunday morning; according to Krone, the victim was 'local'.",
    "Trennungssituation; am Vortag war eine Wegweisung gegen den Täter ausgesprochen worden.":
      "Separation situation; a barring order had been issued against the perpetrator the day before.",
    // 2026-06
    "Geständig, in Untersuchungshaft; Mordanklage der StA Wiener Neustadt (August 2026), laut Gutachten zurechnungsfähig; mutmaßlicher Waffenlieferant (45) als Beitragstäter mitangeklagt (bestreitet); Prozesstermin offen":
      "Confessed, in pre-trial detention; murder charge by the Wiener Neustadt public prosecutor's office (August 2026), criminally responsible according to an expert report; the suspected supplier of the weapon (45) charged as an accessory (denies it); trial date open",
    "Stich- und Schussverletzungen; Leiche im Garten des Wohnhauses gefunden":
      "Stab and gunshot wounds; body found in the garden of the house",
    "Beziehungsmotiv (Täter bei Geständnis: 'Ich hasse sie'); laut Anklage Trennung nicht akzeptiert, zudem Überzeugung, die Frau praktiziere 'schwarze Magie'":
      "Relationship motive (perpetrator when confessing: 'I hate her'); according to the indictment, he did not accept the separation and was also convinced that the woman practised 'black magic'",
    "Opfer war vierfache Mutter (Kinder zwischen 8 und 17 Jahren); ein Sohn traf den Beschuldigten nach der Tat im Haus an":
      "The victim was a mother of four (children aged between 8 and 17); a son encountered the accused in the house after the crime",
    "Tat am Ostersonntag; Tatwaffen sichergestellt. Laut Anklage (APA, 18.8.2026): drei nicht tödliche Schüsse mit einer illegal besessenen Pistole, danach tödliche Stiche mit einem Schraubendreher; Leiche im Garten abgelegt. Gutachten: schizotype Persönlichkeitsstörung, aber keine Zurechnungsunfähigkeit.":
      "Crime on Easter Sunday; weapons seized. According to the indictment (APA, 18 August 2026): three non-fatal shots from an illegally held pistol, followed by fatal stabs with a screwdriver; body left in the garden. Expert report: schizotypal personality disorder, but no lack of criminal responsibility.",
    "Laut Anklage hatte der Täter die Trennung nicht akzeptiert und glaubte, die Frau praktiziere 'schwarze Magie'; Geständnis ('Ich hasse sie').":
      "According to the indictment, the perpetrator had not accepted the separation and believed the woman practised 'black magic'; confession ('I hate her').",
    // 2026-07
    "Mit legal besessener Faustfeuerwaffe erschossen":
      "Shot dead with a legally owned handgun",
    "Beide über 80 Jahre alt und pflegebedürftig; genaue Altersangaben nicht öffentlich (80 = Platzhalter 'über 80').":
      "Both over 80 years old and in need of care; exact ages not public (80 = placeholder for 'over 80').",
    "Beide Partner über 80 Jahre alt und pflegebedürftig.":
      "Both partners over 80 years old and in need of care.",
    // 2026-08
    "Pflegeheim im Bezirk Ried":
      "Care home in the Ried district",
    "Suizidversuch misslang; Ermittlungen wegen Mordes":
      "Suicide attempt failed; investigation for murder",
    "Mutmaßlich Pflegesituation/Krankheit (Opfer schwer pflegebedürftig); Täter hinterließ Testament und Abschiedszettel im Postkasten der Nachbarn":
      "Presumably the care situation/illness (the victim needed intensive care); the perpetrator left a will and a farewell note in the neighbours' letterbox",
    "Täter holte die Frau am Vorabend aus dem Pflegeheim nach Hause; Tat in den Morgenstunden des 18.4.2026.":
      "The perpetrator brought the woman home from the care home the evening before; crime in the early morning of 18 April 2026.",
    "Pflegesituation/Krankheit (Opfer schwer pflegebedürftig); Testament und Abschiedszettel hinterlegt.":
      "Care situation/illness (the victim needed intensive care); will and farewell note left.",
    // 2026-09
    "Bezirk Leibnitz":
      "Leibnitz district",
    "Nach einem Streit erschossen":
      "Shot dead after an argument",
    "Ehedrama / Scheidungssituation":
      "Marital drama / divorce situation",
    "Zwei Kinder (Opfer war Zweifach-Mutter)":
      "Two children (the victim was a mother of two)",
    "Zweiter Femizid binnen weniger Monate im Bezirk Leibnitz 2026.":
      "Second femicide in the Leibnitz district within a few months in 2026.",
    "Ehedrama/Scheidungssituation (Motiv laut Polizei).":
      "Marital drama/divorce situation (motive according to the police).",
    // 2026-10
    "Linz (Stadt)":
      "Linz (city)",
    "Mit einer illegal besessenen Wehrmachtspistole erschossen (Parkplatz neben einem Gasthaus)":
      "Shot dead with an illegally held Wehrmacht pistol (car park next to an inn)",
    "61-jährige Tochter ebenfalls erschossen (siehe 2026-11)":
      "61-year-old daughter also shot dead (see 2026-11)",
    "Doppelfemizid mit anschließendem Suizid gegen 13:30 Uhr.":
      "Double femicide followed by suicide at around 13:30.",
    "Doppelfemizid mit Suizid; Motiv nicht berichtet.":
      "Double femicide with suicide; motive not reported.",
    // 2026-11
    "Deutschland (zu Besuch in Linz)":
      "Germany (visiting Linz)",
    "Mit einer illegal besessenen Wehrmachtspistole erschossen":
      "Shot dead with an illegally held Wehrmacht pistol",
    "Zweites Opfer der Tat vom 7.5.2026 (siehe 2026-10); AÖF zählt beide Frauen getrennt.":
      "Second victim of the crime of 7 May 2026 (see 2026-10); AÖF counts both women separately.",
    "Zweites Opfer (Tochter des Täters); Motiv nicht berichtet.":
      "Second victim (the perpetrator's daughter); motive not reported.",
    // 2026-12
    "Bekannter (Verhältnis)":
      "Acquaintance (affair)",
    "Festnahme am 21.5.2026, umfassend geständig, Überstellung in JA Wiener Neustadt / U-Haft beantragt; nannte später mutmaßlichen Komplizen; mutmaßlicher Komplize (Deutscher, Verdacht der Beitragstäterschaft) am 11.8.2026 in Deutschland festgenommen, Auslieferung nach Österreich angekündigt":
      "Arrested on 21 May 2026, made a full confession, transferred to Wiener Neustadt prison / pre-trial detention requested; later named a suspected accomplice; the suspected accomplice (a German, suspected of being an accessory) was arrested in Germany on 11 August 2026, extradition to Austria announced",
    "Drei Kopfschüsse":
      "Three shots to the head",
    "Kränkung durch das Opfer; Berichte über Stalking und Wahnwelt des Verdächtigen (KI-generierte Bilder)":
      "Feeling slighted by the victim; reports of stalking and of the suspect's delusional world (AI-generated images)",
    "Opfer von den Eltern leblos in der Wohnung entdeckt; zunächst auch Sturz als Todesursache in Betracht gezogen. Opfer in Einzelberichten als 28-jährig bezeichnet.":
      "The victim was found lifeless in her flat by her parents; a fall was initially also considered as the cause of death. Some reports describe the victim as 28 years old.",
    "Laut Verteidiger Kränkung durch das Opfer; Berichte über Wahnwelt, KI-generierte Bilder und Stalking (Boulevard).":
      "According to the defence lawyer, feeling slighted by the victim; reports of a delusional world, AI-generated images and stalking (tabloids).",
    // 2026-13
    "Bezirk Weiz":
      "Weiz district",
    "Oststeiermark":
      "Eastern Styria",
    "Geständig, in U-Haft (StA Graz)":
      "Confessed, in pre-trial detention (Graz public prosecutor's office)",
    "Mit illegal besessenem Kleinkalibergewehr erschossen (abgelegenes Gehöft im Wald)":
      "Shot dead with an illegally held small-calibre rifle (remote farmstead in the forest)",
    "Tat mutmaßlich am Sonntag, 17.5.2026; Fall am 20.5.2026 bekannt geworden. Motiv laut Polizei völlig unklar.":
      "Crime presumably on Sunday, 17 May 2026; the case became known on 20 May 2026. According to the police, the motive is completely unclear.",
    "Motiv laut Polizei völlig unklar.":
      "According to the police, the motive is completely unclear.",
    // 2026-14
    "Ex-Partner und Arbeitskollege (beide Lehrkräfte)":
      "Ex-partner and work colleague (both teachers)",
    "Mit Schuss- und Stichwaffe getötet (in der Mittelschule; Schusswaffe legal besessen)":
      "Killed with a firearm and a stabbing weapon (at the lower secondary school; firearm legally owned)",
    "Eifersucht / Beziehungstat":
      "Jealousy / intimate-partner killing",
    "Tat am frühen Freitagabend in der Mittelschule Taufkirchen an der Pram.":
      "Crime on Friday early evening at the lower secondary school in Taufkirchen an der Pram.",
    "Eifersucht/Beziehungstat; Ex-Partner und Arbeitskollege.":
      "Jealousy/intimate-partner killing; ex-partner and work colleague.",
    // 2026-15
    "Festgenommen, in U-Haft, schweigt zu den Vorwürfen; Ermittlungen wegen Missbrauchs einer wehrlosen oder beeinträchtigten Person mit Todesfolge (StA Wels), Mordanklage offen; zweiter Verdächtiger (Bekannter, geständig) ebenfalls in U-Haft":
      "Arrested, in pre-trial detention, remains silent on the allegations; investigation for abuse of a defenceless or impaired person resulting in death (Wels public prosecutor's office), murder charge open; a second suspect (acquaintance, confessed) also in pre-trial detention",
    "Schwerste Verletzungen (bei mutmaßlich sexuellen Handlungen); Opfer blutüberströmt aufgefunden und später verstorben":
      "Most severe injuries (during suspected sexual acts); the victim was found covered in blood and later died",
    "Mutmaßlich sexualbezogene Tat; Täter spricht von einem Unfall":
      "Suspected sexually motivated crime; the perpetrator speaks of an accident",
    "Gemeinsame Tochter von Opfer und Beschuldigtem (Alter nicht berichtet)":
      "Daughter of the victim and the accused (age not reported)",
    "AÖF führt 26.6.2026; Medienberichte ('Ende Juni gestorben') erschienen Mitte Juli 2026. Laut StA Wels (9./10.9.2026) war die Frau 'schwerst alkoholisiert und daher wehrlos'; der Ehemann und ein gleichaltriger Bekannter sollen gemeinsam sexuelle Handlungen an ihr vorgenommen haben, die tödlichen Handlungen werden dem Ehemann zugeschrieben. Ein dritter Mann soll an der Tat teilnehmen haben wollen, erschien aber nicht. Medienberichte über ein 'Vergewaltigungsnetzwerk' gegen Geld konnte die StA vorerst nicht bestätigen; psychiatrische Gutachten in Auftrag. Ehemann in Berichten vom September 2026 als 51-Jähriger bezeichnet (AÖF: 50).":
      "AÖF gives 26 June 2026; media reports ('died at the end of June') appeared in mid-July 2026. According to the Wels public prosecutor's office (9/10 September 2026), the woman was 'extremely drunk and therefore defenceless'; her husband and an acquaintance of the same age are alleged to have jointly performed sexual acts on her, and the fatal acts are attributed to the husband. A third man is said to have wanted to take part in the crime but did not turn up. The public prosecutor's office was so far unable to confirm media reports of a 'rape network' for money; psychiatric expert reports have been commissioned. Reports from September 2026 give the husband's age as 51 (AÖF: 50).",
    "Ermittlungen wegen Missbrauchs einer wehrlosen Person mit Todesfolge; Ehemann schweigt (sprach zuvor von einem Unfall), zweiter Tatverdächtiger geständig.":
      "Investigation for abuse of a defenceless person resulting in death; the husband remains silent (previously spoke of an accident), the second suspect has confessed.",
    // 2026-16
    "Festgenommen, umfassend geständig; U-Haft am 21.8.2026 wegen Tatbegehungsgefahr verhängt (StA Graz)":
      "Arrested, made a full confession; pre-trial detention ordered on 21 August 2026 because of the risk of further offences (Graz public prosecutor's office)",
    "Mit einem Küchenmesser attackiert; Mädchen erlag im Krankenhaus seinen Verletzungen":
      "Attacked with a kitchen knife; the girl died of her injuries in hospital",
    "Nach Streit mit seiner Lebensgefährtin; Täter wollte die Tochter 'mitnehmen'":
      "After an argument with his partner; the perpetrator wanted to 'take' his daughter 'with him'",
    "Opfer war selbst ein Kind (8 Jahre)":
      "The victim was herself a child (8 years old)",
    "Jüngstes Opfer der AÖF-Zählung 2026; Tat am Montag, 17.8.2026. Laut Polizei hatte der Vater nach einem Streit mit seiner Lebensgefährtin Suizid begehen wollen, tötete zuvor die Tochter und verletzte sich danach selbst (überlebte nach medizinischer Versorgung).":
      "Youngest victim in the AÖF count for 2026; crime on Monday, 17 August 2026. According to the police, after an argument with his partner the father had wanted to take his own life, first killed his daughter and then injured himself (survived after medical treatment).",
    "Nach Streit mit seiner Lebensgefährtin; Täter wollte die Tochter 'mitnehmen'.":
      "After an argument with his partner; the perpetrator wanted to 'take' his daughter 'with him'.",
    // 2026-17
    "Villach (unter der Stadtbrücke)":
      "Villach (under the Stadtbrücke bridge)",
    "Am 28.8.2026 auf Anordnung der StA Klagenfurt festgenommen, U-Haft (verlängert, vorerst bis 12.10.2026); bestreitet Tötungsabsicht und spricht von einem Unfall; Ermittlungen wegen Mordverdachts laufend":
      "Arrested on 28 August 2026 on the order of the Klagenfurt public prosecutor's office, pre-trial detention (extended, for the time being until 12 October 2026); denies any intent to kill and speaks of an accident; investigation on suspicion of murder ongoing",
    "Tritt oder Schlag; Opfer starb an inneren Blutungen (Gewalttat erst durch Obduktion festgestellt)":
      "Kick or blow; the victim died of internal bleeding (violent crime established only by the post-mortem)",
    "Streit zwischen dem Paar während einer Feier unter der Villacher Stadtbrücke":
      "Argument between the couple during a party under the Stadtbrücke bridge in Villach",
    "Rettung am 21.8.2026 gegen 20.43 Uhr alarmiert; die Frau starb im LKH Villach. Das Tötungsdelikt wurde erst durch die von der StA Klagenfurt angeordnete Obduktion bekannt (Medienberichte ab 31.8.2026). Beschuldigter laut ORF aus dem Bezirk Villach-Land. AÖF-Zählung 2026 Nr. 17. Es gilt die Unschuldsvermutung.":
      "Paramedics were alerted on 21 August 2026 at around 20:43; the woman died at Villach regional hospital (LKH). The homicide only became known through the post-mortem ordered by the Klagenfurt public prosecutor's office (media reports from 31 August 2026). According to ORF, the accused is from the Villach-Land district. AÖF count 2026 no. 17. The presumption of innocence applies.",
    "Laut Polizei Streit zwischen dem Paar im Laufe des Abends; Beschuldigter bestreitet Tötungsabsicht (Unfall-Version).":
      "According to the police, an argument between the couple in the course of the evening; the accused denies any intent to kill (accident version).",
    // 2026-18
    "Graz (Innenstadt)":
      "Graz (city centre)",
    "Schwager (Bruder des Lebensgefährten)":
      "Brother-in-law (brother of her live-in partner)",
    "Kurz nach der Tat im Stiegenhaus festgenommen; zunächst Aussageverweigerung, laut StA Graz seit 5.9.2026 'voll geständig'; U-Haft verhängt (JA Graz-Jakomini); Ermittlungen wegen Mordverdachts":
      "Arrested in the stairwell shortly after the crime; initially refused to testify, according to the Graz public prosecutor's office 'fully confessed' since 5 September 2026; pre-trial detention ordered (Graz-Jakomini prison); investigation on suspicion of murder",
    "Massive Gewalt gegen den Kopf (laut Obduktion); Tatwaffe behördlich nicht genannt":
      "Massive force to the head (according to the post-mortem); weapon not named by the authorities",
    "Laut StA Graz bereits zuvor Streitigkeiten ('länger schwelender Konflikt') zwischen Opfer und Beschuldigtem; konkreter Hintergrund behördlich nicht bekanntgegeben":
      "According to the Graz public prosecutor's office, there had already been disputes ('a long-simmering conflict') between the victim and the accused; specific background not disclosed by the authorities",
    "Notruf am 3.9.2026 gegen 12.40 Uhr; das Opfer war allein in der Wohnung, der Beschuldigte soll sich gewaltsam Zutritt verschafft haben; der Lebensgefährte des Opfers war nicht zu Hause. Das Opfer studierte an der TU Graz. Laut 'Kronen Zeitung' (behördlich nicht bestätigt) soll die Frau mit einem Hammer erschlagen worden sein und der Konflikt damit zusammenhängen, dass sie ihre 14-jährige Schwester vor dem Beschuldigten schützen wollte. AÖF-Zählung 2026 Nr. 18 (Beziehung: 'familiäres Verhältnis'). Es gilt die Unschuldsvermutung.":
      "Emergency call on 3 September 2026 at around 12:40; the victim was alone in the flat, and the accused is alleged to have forced his way in; the victim's live-in partner was not at home. The victim was a student at Graz University of Technology (TU Graz). According to the 'Kronen Zeitung' (not confirmed by the authorities), the woman is said to have been beaten to death with a hammer, and the conflict is said to have been connected with her wanting to protect her 14-year-old sister from the accused. AÖF count 2026 no. 18 (relationship: 'family relationship'). The presumption of innocence applies.",
    "Laut StA Graz länger schwelender Konflikt zwischen Opfer und Beschuldigtem (keine Affekthandlung angenommen); konkreter Hintergrund offiziell nicht bekannt.":
      "According to the Graz public prosecutor's office, a long-simmering conflict between the victim and the accused (no heat-of-passion act assumed); specific background not officially known."
  };
  for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k)) I.dict[k] = d[k];
  I.keep.push(
    "Pischelsdorf am Kulm",
    "Baden bei Wien",
    "Alberndorf im Pulkautal",
    "Hollabrunn",
    "Böheimkirchen",
    "Neukirchen an der Enknach",
    "Braunau am Inn",
    "Maria Alm",
    "Jenny Z.",
    "Graz (Jakomini/St. Peter)",
    "Leoben-Donawitz",
    "Leoben",
    "Zlatica M.",
    "Nenad M.",
    "Kronen Zeitung",
    "Enns",
    "Stefanie P.",
    "Patrick M.",
    "Wilfersdorf",
    "Johanna G.",
    "Bernstein",
    "Oberwart",
    "Sooß",
    "Sieghartskirchen",
    "Eberschwang",
    "Ried im Innkreis",
    "Linz-Urfahr",
    "Gersdorf an der Feistritz",
    "Taufkirchen an der Pram",
    "Schärding",
    "Marchtrenk",
    "Wels-Land",
    "Kumberg"
  );
})(window);
