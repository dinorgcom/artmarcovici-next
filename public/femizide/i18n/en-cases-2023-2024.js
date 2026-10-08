/* Femizide in Österreich – englisches Wörterbuch: Falltexte 2023–2024.
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
    // 2023-01
    "Wien-Floridsdorf":
      "Vienna-Floridsdorf",
    "21. Bezirk (Floridsdorf)":
      "21st district (Floridsdorf)",
    "keine Beziehung (Zufallsopfer)":
      "no relationship (random victim)",
    "obdachloser polnischer Staatsbürger":
      "homeless Polish citizen",
    "Verurteilung: lebenslange Haft und Einweisung (Doppelmord, auch ein Apotheker getötet)":
      "Conviction: life imprisonment and committal (double murder, a pharmacist was also killed)",
    "massive Kopfverletzungen und schwere Stichwunde":
      "massive head injuries and a severe stab wound",
    "mindestens 1 (Opfer war laut Medienberichten junge Mutter)":
      "at least 1 (according to media reports, the victim was a young mother)",
    "lebenslange Haft und Einweisung wegen Doppelmordes":
      "life imprisonment and committal for double murder",
    "Von der AÖF separat gelistet ('Morde an Frauen durch Personen ohne Naheverhältnis'), zählt daher nicht zu den 26 Femiziden 2023. Ehemann des Opfers war zur Tatzeit nicht zu Hause.":
      "Listed separately by AÖF ('murders of women by persons with no close relationship') and therefore not counted among the 26 femicides of 2023. The victim's husband was not at home at the time of the crime.",
    "Zufallsopfer (kein Naheverhältnis); Urteil: lebenslang und Einweisung, Täter laut Gutachten zurechnungsfähig, aber geistig abnorm.":
      "Random victim (no close relationship); verdict: life imprisonment and committal; according to the expert report, the perpetrator was criminally responsible but mentally abnormal.",
    "Details des psychiatrischen Gutachtens (schwere psychische Störung bei Zurechnungsfähigkeit) wurden v. a. über alternative Medien verbreitet.":
      "Details of the psychiatric expert report (severe mental disorder with criminal responsibility) were spread mainly through alternative media.",
    // 2023-02
    "Suizid nach der Tat (Schusswaffe); Ermittlungsverfahren eingestellt":
      "Suicide after the crime (firearm); investigation discontinued",
    "Messerstiche (Stichwaffe)":
      "Knife stabs (stabbing weapon)",
    "Streit um Geld (mit beiden Schwestern)":
      "Dispute over money (with both sisters)",
    "Tatort Einfamilienhaus; die zweite Schwester (58) wurde schwer verletzt.":
      "Crime scene a detached house; the second sister (58) was seriously injured.",
    "Streit um Geld mit beiden Schwestern.":
      "Dispute over money with both sisters.",
    // 2023-03
    "Ex-Mann (geschieden, wohnte aus finanziellen Gründen noch zusammen)":
      "Ex-husband (divorced, still living together for financial reasons)",
    "Verurteilung wegen Totschlags: 7 Jahre Haft":
      "Convicted of manslaughter: 7 years' imprisonment",
    "dutzende Messerstiche (Steakmesser), Opfer verblutet":
      "dozens of knife stabs (steak knife), the victim bled to death",
    "Die Frau wollte sich auch räumlich trennen und sagte ihm das im Keller":
      "The woman also wanted to separate physically by living apart and told him so in the cellar",
    "1 (die 13-jährige Tochter fand die tote Mutter)":
      "1 (the 13-year-old daughter found her dead mother)",
    "Landesgericht Leoben":
      "Leoben Regional Court",
    "Geschworenenurteil: Totschlag (nicht Mord), 7 Jahre Haft":
      "Jury verdict: manslaughter (not murder), 7 years' imprisonment",
    "Tatort: Keller eines Mehrparteienhauses. Zunächst wurde auch ein zweiter Mann aus dem Wohnhaus festgenommen, bestritt aber jede Beteiligung.":
      "Crime scene: the cellar of an apartment building. Initially a second man from the building was also arrested, but he denied any involvement.",
    "Die Frau wollte sich nach der Scheidung auch räumlich trennen und sagte ihm das im Keller.":
      "After the divorce, the woman also wanted to separate physically by living apart and told him so in the cellar.",
    // 2023-04
    "Edling (Gemeinde Eberndorf)":
      "Edling (municipality of Eberndorf)",
    "unbekannt (drei Tatverdächtige aus dem Umfeld, darunter der Sohn)":
      "unknown (three suspects from her circle, including her son)",
    "ungeklärt; Ermittlungen gegen drei Verdächtige 2025 eingestellt (Cold Case)":
      "unsolved; investigation into three suspects discontinued in 2025 (cold case)",
    "stumpfe Gewalteinwirkung (niedergeschlagen) und in der Kälte zum Sterben zurückgelassen (erfroren)":
      "blunt force (knocked down) and left to die in the cold (froze to death)",
    "3 (Opfer war dreifache Mutter)":
      "3 (the victim was a mother of three)",
    "Tat in der Nacht 8./9.2.2023 (minus 15 Grad); Leiche von einem Schulkind vor einer Aufbahrungshalle gefunden, ca. 150 m vom Wohnhaus. Der Sohn wurde im September 2024 vernommen und wieder entlassen; Fall 2025 im TV-Format 'Ungelöst – Cold Case Austria' behandelt.":
      "Crime during the night of 8 to 9 February 2023 (minus 15 degrees); the body was found by a schoolchild in front of a funeral chapel, about 150 m from her house. The son was questioned in September 2024 and released again; the case was covered in 2025 by the TV programme 'Ungelöst – Cold Case Austria'.",
    // 2023-05
    "Schülerin aus Steyr":
      "School student from Steyr",
    "Bekannter/Begleiter":
      "Acquaintance/companion",
    "Bezirk Perg (Mühlviertel)":
      "Perg district (Mühlviertel)",
    "Verurteilung wegen Mordes: 18 Jahre Haft und Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher":
      "Convicted of murder: 18 years' imprisonment and committal to an institution for mentally abnormal offenders",
    "Schläge und Würgen im Auto, dann Stiche mit zwei Schneestangen und Tritte":
      "Blows and strangling in the car, then stabs with two snow poles and kicks",
    "Streit nach Spielcasino-Besuch in Tschechien (Täter hatte Geld verloren und wollte zurückfahren, die Begleiterin wollte nach Hause)":
      "Argument after a visit to a casino in the Czech Republic (the perpetrator had lost money and wanted to drive back, his companion wanted to go home)",
    "Landesgericht Linz":
      "Linz Regional Court",
    "18 Jahre Haft und Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher":
      "18 years' imprisonment and committal to an institution for mentally abnormal offenders",
    "Leiche am Sonntagfrüh auf einem Forstweg nahe den Sternsteinliften von einem Autofahrer gefunden. Täter geständig; laut Gutachten narzisstische Persönlichkeitsstörung. Tätername nur als 'Samuel Z.' (Krone) berichtet.":
      "Body found by a motorist on Sunday morning on a forest track near the Sternstein ski lifts. The perpetrator confessed; according to the expert report, narcissistic personality disorder. The perpetrator's name was reported only as 'Samuel Z.' (Krone).",
    "Streit nach Spielcasino-Besuch; laut Gutachten narzisstische Persönlichkeitsstörung.":
      "Argument after a visit to a casino; according to the expert report, narcissistic personality disorder.",
    // 2023-06
    "Wien-Liesing":
      "Vienna-Liesing",
    "23. Bezirk (Liesing)":
      "23rd district (Liesing)",
    "Verurteilung wegen Mordes: 20 Jahre Haft und Einweisung in ein forensisch-therapeutisches Zentrum":
      "Convicted of murder: 20 years' imprisonment and committal to a forensic therapeutic centre",
    "Messerstiche (Küchenmesser) bei einem Streit; Opfer starb wenig später im Spital":
      "Knife stabs (kitchen knife) during an argument; the victim died in hospital shortly afterwards",
    "Streit (u. a. um eine Essensbestellung)":
      "Argument (among other things about a food order)",
    "20 Jahre Haft und Einweisung in ein forensisch-therapeutisches Zentrum":
      "20 years' imprisonment and committal to a forensic therapeutic centre",
    "Tat laut Anklage am Abend des 28.2.2023 (AÖF-Datum: 1.3.2023). Täter war polizeibekannter Hochrisikofall, dreimal Betretungs-/Annäherungsverbot gegenüber der Mutter, nahm verpflichtende Beratungstermine nicht wahr.":
      "According to the indictment, the crime took place on the evening of 28 February 2023 (AÖF date: 1 March 2023). The perpetrator was a high-risk case known to the police, had been subject to a barring/no-contact order towards his mother three times and did not attend mandatory counselling appointments.",
    "Streit (u. a. um eine Essensbestellung); Täter war polizeibekannter Hochrisikofall mit mehrfachen Betretungsverboten.":
      "Argument (among other things about a food order); the perpetrator was a high-risk case known to the police, with several barring orders.",
    // 2023-07
    "Kärntner, wohnhaft im Bezirk Graz-Umgebung":
      "Carinthian, resident in the Graz-Umgebung district",
    "Verurteilung wegen Mordes: lebenslange Haft (rechtskräftig nach OLG-Entscheid 11.11.2024)":
      "Convicted of murder: life imprisonment (final after the OLG decision of 11 November 2024)",
    "massive Gewalteinwirkung auf den Hals (auf den Hals gekniet), Tod durch Sauerstoffmangel (erstickt)":
      "massive force to the neck (knelt on her neck), death from lack of oxygen (suffocated)",
    "Streit; Beziehung war laut Medienberichten von Gewalt und Alkohol geprägt":
      "Argument; according to media reports, the relationship was marked by violence and alcohol",
    "lebenslange Haft; OLG Graz bestätigte das Urteil am 11.11.2024 (rechtskräftig)":
      "life imprisonment; the Graz Higher Regional Court (OLG) upheld the verdict on 11 November 2024 (final)",
    "Täter rief am Tag nach der Tat selbst die Polizei; zuvor polizeiauffällig (Betretungsverbote, Wegweisungen, häusliche Gewalt). Laut Prozessberichten wurde die Frau zuvor tagelang verprügelt und eingesperrt.":
      "The perpetrator called the police himself the day after the crime; he had previously come to police attention (barring orders, removals from the home, domestic violence). According to trial reports, the woman had previously been beaten and locked up for days.",
    "Streit; Beziehung von Gewalt und Alkohol geprägt, Opfer zuvor tagelang verprügelt und eingesperrt.":
      "Argument; relationship marked by violence and alcohol, victim previously beaten and locked up for days.",
    // 2023-08
    "Wien-Donaustadt":
      "Vienna-Donaustadt",
    "22. Bezirk (Donaustadt)":
      "22nd district (Donaustadt)",
    "Tochter (Täterin)":
      "Daughter (female perpetrator)",
    "Schusswaffe (legal besessen)":
      "Firearm (legally owned)",
    "Von der AÖF separat gelistet ('Morde an Frauen mit Frauen als Täterinnen'), zählt daher nicht zu den 26 Femiziden 2023.":
      "Listed separately by AÖF ('murders of women with women as perpetrators') and therefore not counted among the 26 femicides of 2023.",
    // 2023-09
    "für unzurechnungsfähig erklärt; rechtskräftige Unterbringung in einem forensisch-therapeutischen Zentrum":
      "declared not criminally responsible; final placement in a forensic therapeutic centre",
    "Messerstiche (Küchenmesser)":
      "Knife stabs (kitchen knife)",
    "Unzurechnungsfähigkeit (chronische Drogenpsychose); rechtskräftige Unterbringung in einem forensisch-therapeutischen Zentrum":
      "Lack of criminal responsibility (chronic drug-induced psychosis); final placement in a forensic therapeutic centre",
    "Die Mutter rief um 4.55 Uhr selbst die Polizei ('wird mit Messer bedroht'); der Stiefvater (70) wurde schwer verletzt; der Täter unternahm einen Suizidversuch. Laut Gutachter chronische Drogenpsychose nach jahrelangem Cannabiskonsum.":
      "At 4:55 the mother herself called the police ('being threatened with a knife'); the stepfather (70) was seriously injured; the perpetrator attempted suicide. According to the expert, chronic drug-induced psychosis after years of cannabis use.",
    "Chronische Drogenpsychose nach jahrelangem Cannabiskonsum; für unzurechnungsfähig erklärt.":
      "Chronic drug-induced psychosis after years of cannabis use; declared not criminally responsible.",
    // 2023-10
    "starb selbst bei dem Brand; mutmaßliche Verzweiflungstat; Verfahren eingestellt":
      "died himself in the fire; presumed act of desperation; proceedings discontinued",
    "Brandstiftung (Großbrand des Wohnhauses); Obduktion sollte klären, ob die Mutter durch den Brand oder zuvor starb":
      "Arson (major fire in the house); the post-mortem was to establish whether the mother died in the fire or before it",
    "mutmaßlich Verzweiflungstat (Sohn hatte die kranke Mutter betreut)":
      "presumably an act of desperation (the son had been caring for his sick mother)",
    "Brand in der Nacht auf den 6.4.2023; laut Brandermittlung dürfte der Sohn das Feuer selbst gelegt haben.":
      "Fire during the night to 6 April 2023; according to the fire investigation, the son probably started the fire himself.",
    "Mutmaßliche Verzweiflungstat; der Sohn hatte die kranke Mutter betreut.":
      "Presumed act of desperation; the son had been caring for his sick mother.",
    // 2023-11
    "Verurteilung wegen Mordes und fahrlässiger Tötung: lebenslange Haft und Einweisung in ein forensisch-therapeutisches Zentrum":
      "Convicted of murder and negligent homicide: life imprisonment and committal to a forensic therapeutic centre",
    "mehrfache Messerstiche (Küchenmesser)":
      "multiple knife stabs (kitchen knife)",
    "Die Frau wollte die Beziehung beenden; Streit aus Eifersucht":
      "The woman wanted to end the relationship; argument out of jealousy",
    "lebenslange Haft wegen Mordes an der Freundin und fahrlässiger Tötung (tödlicher Verkehrsunfall auf der Flucht) sowie Einweisung in ein forensisch-therapeutisches Zentrum (zunächst nicht rechtskräftig)":
      "life imprisonment for the murder of his girlfriend and for negligent homicide (fatal road accident while fleeing), plus committal to a forensic therapeutic centre (initially not final)",
    "Auf der Flucht verursachte der Täter einen frontalien Verkehrsunfall, bei dem ein unbeteiligter 31-jähriger Grazer starb; daher ursprünglich als Doppelmord angeklagt. Laut Prozessbericht (5min.at) hatte das Paar sich in einem Laufhaus kennengelernt; beim Täter kombinierte Persönlichkeitsstörung mit Borderline-Anteilen.":
      "While fleeing, the perpetrator caused a head-on collision in which an uninvolved 31-year-old man from Graz died; he was therefore originally charged with double murder. According to a trial report (5min.at), the couple had met in a brothel (Laufhaus); the perpetrator has a combined personality disorder with borderline traits.",
    "Die Frau wollte die Beziehung beenden; Streit aus Eifersucht.":
      "The woman wanted to end the relationship; argument out of jealousy.",
    // 2023-12
    "aus einer Kärntner Familie; Geschäftsführerin eines Gastrobetriebs":
      "from a Carinthian family; manager of a restaurant business",
    "Ex-Lebensgefährte (Trennung im Jänner 2023), bei ihr angestellt":
      "Former live-in partner (separation in January 2023), employed by her",
    "Kärnten (Koch)":
      "Carinthia (chef)",
    "Verurteilung wegen Mordes: 20 Jahre Haft (Urteil angenommen); starb Anfang Juli 2024 in der JA Graz-Karlau (Suizid durch Suchtmittel/Medikamente)":
      "Convicted of murder: 20 years' imprisonment (verdict accepted); died in early July 2024 in Graz-Karlau prison (suicide with drugs/medication)",
    "erwürgt/erstickt":
      "strangled/suffocated",
    "Trennung/Eifersucht":
      "Separation/jealousy",
    "20 Jahre Haft wegen Mordes (Geschworenenurteil einstimmig, vom Angeklagten angenommen)":
      "20 years' imprisonment for murder (unanimous jury verdict, accepted by the defendant)",
    "Täter verursachte nach der Tat in suizidaler Absicht einen Unfall mit dem Auto der Mutter der Frau und lag wochenlang im künstlichen Tiefschlaf. Namen nur in Kurzform berichtet ('Jessica', 'Oliver R.', oe24).":
      "After the crime, in a suicide attempt, the perpetrator caused an accident with the car of the woman's mother and was in an induced coma for weeks. Names reported only in short form ('Jessica', 'Oliver R.', oe24).",
    "Trennung im Jänner 2023; Eifersucht.":
      "Separation in January 2023; jealousy.",
    // 2023-13
    "Schüsse mit Faustfeuerwaffe (legal besessen)":
      "Shots from a handgun (legally owned)",
    "Doppelfemizid mit erweitertem Suizid: Der Mann tötete zuerst seine Ehefrau und eine zweite Frau (Fall 2023-14), dann sich selbst. Obduktion bestätigte den Hergang.":
      "Double femicide with murder-suicide: the man first killed his wife and a second woman (case 2023-14), then himself. The post-mortem confirmed the course of events.",
    "Boulevard berichtete, die zweite Getötete sei die Geliebte des Täters gewesen; offizielles Motiv nicht veröffentlicht.":
      "Tabloids reported that the second woman killed had been the perpetrator's lover; official motive not published.",
    // 2023-14
    "mutmaßlich Freund/Bekannter (Ehemann der zweiten Getöteten)":
      "presumably friend/acquaintance (husband of the second woman killed)",
    "Zweites Opfer desselben Tathergangs wie Fall 2023-13 (Doppelfemizid mit erweitertem Suizid im Wohnhaus des Ehepaares).":
      "Second victim of the same crime as case 2023-13 (double femicide with murder-suicide in the married couple's house).",
    "Zweites Opfer desselben Tathergangs wie 2023-13; Boulevard berichtete von einem Beziehungsverhältnis zum Täter.":
      "Second victim of the same crime as 2023-13; tabloids reported a relationship with the perpetrator.",
    // 2023-15
    "Wien-Ottakring":
      "Vienna-Ottakring",
    "16. Bezirk (Ottakring)":
      "16th district (Ottakring)",
    "Suizidversuch überlebt; Verurteilung wegen Mordes: 20 Jahre Haft":
      "Survived a suicide attempt; convicted of murder: 20 years' imprisonment",
    "19 Messerstiche":
      "19 knife stabs",
    "Trennung (die Frau hatte ihm gesagt, dass sie ihn nicht mehr liebt)":
      "Separation (the woman had told him that she no longer loved him)",
    "Tatort gemeinsame Wohnung; Suizidversuch des Täters im Innenhof des Wohnhauses; geständig.":
      "Crime scene the shared flat; the perpetrator attempted suicide in the courtyard of the building; confessed.",
    "Die Frau hatte ihm gesagt, dass sie ihn nicht mehr liebt (Trennung).":
      "The woman had told him that she no longer loved him (separation).",
    // 2023-16
    "Niederlande":
      "Netherlands",
    "Ex-Mann bzw. Lebensgefährte (Berichte variieren)":
      "Ex-husband or live-in partner (reports vary)",
    "Suizidversuch (Verkehrsunfall) überlebt; Verurteilung wegen Mordes: lebenslange Haft":
      "Survived a suicide attempt (road accident); convicted of murder: life imprisonment",
    "17 Messerstiche":
      "17 knife stabs",
    "Streit in trinkender Runde (die Frau stürzte, was ihn laut Berichten in Rage brachte)":
      "Argument in a drinking session (the woman fell, which, according to reports, enraged him)",
    "mindestens 1 (der Täter gestand der gemeinsamen Tochter per SMS)":
      "at least 1 (the perpetrator confessed to their daughter by text message)",
    "lebenslange Haft wegen Mordes":
      "life imprisonment for murder",
    "Tatort gemeinsame Wohnung. Anklageerhebung Ende Februar 2024 (MeinBezirk).":
      "Crime scene the shared flat. Charges brought at the end of February 2024 (MeinBezirk).",
    "Streit in trinkender Runde eskalierte.":
      "An argument during a drinking session escalated.",
    // 2023-17
    "Schüsse mit Pistole (legal besessen, waffenrechtliches Dokument)":
      "Shots from a pistol (legally owned, firearms permit)",
    "laut Polizei psychische Erkrankung des Täters als Hintergrund":
      "according to the police, the perpetrator's mental illness was the background",
    "Söhne des Paares (erreichten die Mutter telefonisch nicht mehr und veranlassten die Nachschau)":
      "The couple's sons (could no longer reach their mother by phone and arranged for someone to check)",
    "Erweiterter Suizid im Einfamilienhaus des Paares; die Tat dürfte bereits Tage vor dem Auffinden (25.7.) passiert sein.":
      "Murder-suicide in the couple's detached house; the crime probably took place days before they were found (25 July).",
    "Laut Polizei psychische Erkrankung des Täters als Hintergrund.":
      "According to the police, the perpetrator's mental illness was the background.",
    // 2023-18
    "Tötung mit einem stumpfen Gegenstand":
      "Killed with a blunt object",
    "Polizisten, die die Frau über den Suizid ihres Mannes informieren wollten, fanden sie tot in der Wohnung.":
      "Police officers who wanted to inform the woman of her husband's suicide found her dead in the flat.",
    // 2023-19
    "Suizid nach der Tat (mit registrierter Schusswaffe)":
      "Suicide after the crime (with a registered firearm)",
    "Messerstiche (Küchenmesser, laut Obduktion)":
      "Knife stabs (kitchen knife, according to the post-mortem)",
    "Eifersucht (Streit eskalierte)":
      "Jealousy (argument escalated)",
    "Der Täter war vor der Tat bereits polizeilich bekannt.":
      "The perpetrator was already known to the police before the crime.",
    "Eifersucht; Streit eskalierte.":
      "Jealousy; argument escalated.",
    // 2023-20
    "gebürtige Rumänin":
      "Romanian-born",
    "Suizidversuch überlebt; Verurteilung wegen Mordes: lebenslange Haft":
      "Survived a suicide attempt; convicted of murder: life imprisonment",
    "Schnitt- und Stichverletzungen (Messer)":
      "Cut and stab wounds (knife)",
    "lebenslange Haft wegen Mordes (zunächst nicht rechtskräftig)":
      "life imprisonment for murder (initially not final)",
    "Tat laut MeinBezirk am Abend des 5.10.2023 (AÖF-Datum: 6.10.). Tatort Doppelhaushälfte; der unbescholtene Täter lag nach seinem Suizidversuch zunächst auf der Intensivstation. DerStandard porträtierte den Fall als 'Gattinnenmord des narzisstischen Blenders'.":
      "According to MeinBezirk, the crime took place on the evening of 5 October 2023 (AÖF date: 6 October). Crime scene a semi-detached house; after his suicide attempt the perpetrator, who had no previous convictions, was initially in intensive care. Der Standard portrayed the case as the 'wife murder by a narcissistic impostor'.",
    // 2023-21
    "Wien-Leopoldstadt":
      "Vienna-Leopoldstadt",
    "2. Bezirk (Leopoldstadt)":
      "2nd district (Leopoldstadt)",
    "Österreicherin mit türkischen Wurzeln":
      "Austrian with Turkish roots",
    "Österreicher mit türkischen Wurzeln":
      "Austrian with Turkish roots",
    "zahlreiche Stichverletzungen (Messer)":
      "numerous stab wounds (knife)",
    "Tatort Wohnung des Paares; Herkunftsangaben laut AÖF-Medienliste.":
      "Crime scene the couple's flat; information on origin according to the AÖF media list.",
    // 2023-22
    "13. Bezirk (Hietzing)":
      "13th district (Hietzing)",
    "Suizid nach der Tat (mit auf ihn registrierter Faustfeuerwaffe)":
      "Suicide after the crime (with a handgun registered to him)",
    "Schuss mit Faustfeuerwaffe (auf den Täter zugelassen)":
      "Shot with a handgun (registered to the perpetrator)",
    "langjähriger Familienstreit":
      "long-standing family dispute",
    "Erweiterter Suizid.":
      "Murder-suicide.",
    "Langjähriger Familienstreit.":
      "Long-standing family dispute.",
    // 2023-23
    "Ex-Mann (einige Monate geschieden)":
      "Ex-husband (divorced for a few months)",
    "Schuss mit Schrotflinte (registriert)":
      "Shot with a shotgun (registered)",
    "mindestens 1 (die Tochter fand die schwer verletzte Mutter und versuchte Reanimation)":
      "at least 1 (the daughter found her seriously injured mother and attempted resuscitation)",
    "Die Frau starb noch vor Ort trotz Reanimationsversuch der Tochter.":
      "The woman died at the scene despite her daughter's attempt at resuscitation.",
    // 2023-24
    "Strasshof an der Nordbahn (bei ihrer Mutter)":
      "Strasshof an der Nordbahn (staying with her mother)",
    "Ex-Lebensgefährte (15 Jahre Beziehung, Trennung Ende August 2023)":
      "Former live-in partner (15-year relationship, separated at the end of August 2023)",
    "gebürtiger Bosnier":
      "Bosnian-born",
    "stellte sich der Polizei; Verurteilung wegen Mordes: lebenslange Haft":
      "turned himself in to the police; convicted of murder: life imprisonment",
    "Schüsse mit illegaler Schusswaffe (laut oe24 am Wiener Praterstern gekauft) auf offener Straße vor dem Wohnhaus":
      "Shots from an illegal firearm (according to oe24 bought at Vienna's Praterstern) in the open street in front of the building",
    "Trennung; zuvor körperliche Übergriffe in der Beziehung":
      "Separation; previous physical assaults within the relationship",
    "4 (Opfer war laut oe24 vierfache Mutter)":
      "4 (according to oe24, the victim was a mother of four)",
    "Der Täter hatte zuvor ein verpflichtendes sechsstündiges Anti-Gewalt-Training absolviert.":
      "The perpetrator had previously completed a mandatory six-hour anti-violence training course.",
    "Trennung Ende August 2023; zuvor körperliche Übergriffe in der Beziehung.":
      "Separation at the end of August 2023; previous physical assaults within the relationship.",
    // 2023-25
    "Linz (Statutarstadt)":
      "Linz (statutory city)",
    "'erweiterter Suizid' – die Frau war schwer krank; laut Ermittlern Tötung ohne Wissen des Opfers":
      "'murder-suicide' – the woman was seriously ill; according to investigators, killed without her knowledge",
    "Tatort Wohnung des Paares.":
      "Crime scene the couple's flat.",
    "Die Frau war schwer krank; laut Ermittlern Tötung ohne Wissen des Opfers ('erweiterter Suizid').":
      "The woman was seriously ill; according to investigators, killed without her knowledge ('murder-suicide').",
    // 2023-26
    "Raum Langenlois":
      "Langenlois area",
    "Raum Langenlois/Krems":
      "Langenlois/Krems area",
    "Reitstallbesitzerin und Reitlehrerin; verheiratet":
      "Riding-stable owner and riding instructor; married",
    "Ex-Geliebter (Naheverhältnis); FPÖ-Lokalpolitiker (Parteimitgliedschaft von der FPÖ bestätigt)":
      "Former lover (close relationship); FPÖ local politician (party membership confirmed by the FPÖ)",
    "Suizid nach der Tat (in einer Scheune tot aufgefunden)":
      "Suicide after the crime (found dead in a barn)",
    "Kopfschuss (Schusswaffe); Leiche im Kofferraum nach Tschechien auf einen Friedhof verbracht":
      "Shot to the head (firearm); body taken in the boot of a car to a cemetery in the Czech Republic",
    "Die seit 26.10. vermisste Frau wurde am 30.10. von einer Spaziergängerin auf einem Friedhof in Tschechien gefunden; im Fahrzeug des Täters wurde ein Abschiedsbrief gefunden. Namen nur in Kurzform berichtet ('Elisabeth P.', Blick/Krone).":
      "The woman, missing since 26 October, was found by a walker in a cemetery in the Czech Republic on 30 October; a farewell letter was found in the perpetrator's vehicle. Names reported only in short form ('Elisabeth P.', Blick/Krone).",
    // 2023-27
    "in einem Seniorenheim tätig":
      "worked in a care home for the elderly",
    "Ehemann (verheiratet seit 1987, ein gemeinsamer Sohn)":
      "Husband (married since 1987, one son together)",
    "geständig; schuldig, aber unzurechnungsfähig – Einweisung in ein forensisch-therapeutisches Zentrum":
      "confessed; guilty but not criminally responsible – committal to a forensic therapeutic centre",
    "40 Messerstiche (Küchenmesser, Klinge 34 cm) in Kopf, Gesicht, Hals, Schulter, Schlüsselbein und Rücken":
      "40 knife stabs (kitchen knife, 34 cm blade) to the head, face, neck, shoulder, collarbone and back",
    "Eifersucht (vermeintlicher 'Knutschfleck', Verdacht auf Beziehung zu einem Pfleger)":
      "Jealousy (supposed 'love bite', suspected relationship with a carer)",
    "1 gemeinsamer Sohn; ein Enkel erlebte die Tat laut Heute-Bericht mit":
      "1 son together; according to a report in Heute, a grandchild witnessed the crime",
    "schuldig, aber nicht zurechnungsfähig; Einweisung in ein forensisch-therapeutisches Zentrum (Entscheid angenommen)":
      "guilty but not criminally responsible; committal to a forensic therapeutic centre (decision accepted)",
    "Ein Angehöriger rief wegen eines heftigen Streits die Polizei; die Frau lag tot vor dem Mehrparteienhaus. Die Staatsanwaltschaft sprach laut Heute von einem 'außergewöhnlich brutalen Femizid'.":
      "A relative called the police because of a fierce argument; the woman lay dead in front of the apartment building. According to Heute, the public prosecutor's office spoke of an 'exceptionally brutal femicide'.",
    "Eifersuchtswahn (vermeintlicher 'Knutschfleck', Verdacht auf Beziehung zu einem Pfleger).":
      "Delusional jealousy (supposed 'love bite', suspected relationship with a carer).",
    // 2023-28
    "Pinzgauerin":
      "woman from the Pinzgau",
    "stellte sich der Polizei; Verurteilung wegen Mordes: 18 Jahre Haft (erstinstanzlich), Strafmaß vom OLG Linz reduziert":
      "turned himself in to the police; convicted of murder: 18 years' imprisonment (at first instance), sentence reduced by the Linz Higher Regional Court (OLG)",
    "Schuss mit Schrotflinte (Marke 'Baikal') aus kurzer Distanz ins Gesicht":
      "Shot in the face from close range with a shotgun (make 'Baikal')",
    "laut Täter Alkohol-Rückfall – er habe die Mutter damit nicht wieder belasten wollen":
      "according to the perpetrator, a relapse into alcohol – he had not wanted to burden his mother with it again",
    "18 Jahre Haft wegen Mordes (einstimmig, zunächst nicht rechtskräftig); OLG Linz reduzierte das Strafmaß im Juli 2024 (Höhe nicht öffentlich berichtet)":
      "18 years' imprisonment for murder (unanimous, initially not final); the Linz OLG reduced the sentence in July 2024 (length not publicly reported)",
    "Tatort gemeinsames Wohnhaus; die Mutter saß fernsehend auf der Couch. Täter unbescholten, bekannte sich 'zu hundert Prozent schuldig'. Namen in Kurzform von der Krone berichtet.":
      "Crime scene the shared house; the mother was sitting on the sofa watching television. The perpetrator, who had no previous convictions, pleaded '100 per cent guilty'. Names reported in short form by Krone.",
    "Laut Täter Alkohol-Rückfall – er habe die Mutter damit nicht wieder belasten wollen.":
      "According to the perpetrator, a relapse into alcohol – he had not wanted to burden his mother with it again.",
    "Der Angeklagte Markus S. (sitzend, von hinten) mit einem Justizwachebeamten im Schwurgerichtssaal beim Prozess um den Mord an seiner Mutter Sonja S.":
      "The defendant Markus S. (seated, seen from behind) with a prison officer in the jury courtroom at the trial over the murder of his mother Sonja S.",
    // 2024-01
    "Bezirk Schwaz":
      "Schwaz district",
    "Erstickt in der gemeinsamen Wohnung":
      "Suffocated in the shared flat",
    "AÖF-Liste Nr. 1. AÖF gibt als Datum den 26.1.2024 (Funddatum) an; laut Polizei dürfte die Tat bereits am 25.1.2024 erfolgt sein. Die Frau war stark pflegebedürftig. Obduktion wurde angeordnet. Erweiterter Suizid.":
      "AÖF list no. 1. AÖF gives 26 January 2024 (date the body was found) as the date; according to the police, the crime probably took place on 25 January 2024. The woman was in great need of care. A post-mortem was ordered. Murder-suicide.",
    "Erweiterter Suizid; die 72-jährige Frau war stark pflegebedürftig.":
      "Murder-suicide; the 72-year-old woman was in great need of care.",
    // 2024-02
    "Wien (Erdberg)":
      "Vienna (Erdberg)",
    "3. Bezirk, Landstraße":
      "3rd district, Landstraße",
    "Suizid; Leichnam am 24.2.2024 in einem Waldstück in Slowenien gefunden":
      "Suicide; body found in a wooded area in Slovenia on 24 February 2024",
    "Gemeinsame 13-jährige Tochter ebenfalls getötet (Fall 2024-03)":
      "Their 13-year-old daughter was also killed (case 2024-03)",
    "AÖF-Liste Nr. 2. Mutter und Tochter wurden tot in der Wohnung in der Erdbergstraße aufgefunden. Erweiterter Suizid.":
      "AÖF list no. 2. Mother and daughter were found dead in their flat on Erdbergstraße. Murder-suicide.",
    "Erweiterter Suizid; Motiv laut Polizei nicht gesichert (Familie galt als unauffällig, Täter Bilanzbuchhalter).":
      "Murder-suicide; according to the police, the motive is not established (the family was considered unremarkable, the perpetrator was an accountant).",
    "Der 53-jährige mutmaßliche Täter (Porträt mit schwarzem Balken und Verpixelung) – Bildmontage mit dem Wohnhaus in Wien-Erdberg; er beging nach der Tat an Ehefrau und Tochter Suizid":
      "The 53-year-old alleged perpetrator (portrait with black bar and pixelation) – photomontage with the apartment building in Vienna-Erdberg; he took his own life after killing his wife and daughter",
    // 2024-03
    "Opfer war selbst ein Kind; Mutter (51) ebenfalls getötet (Fall 2024-02)":
      "The victim was herself a child; her mother (51) was also killed (case 2024-02)",
    "AÖF-Liste Nr. 3. Gleiche Tat wie Fall 2024-02.":
      "AÖF list no. 3. Same crime as case 2024-02.",
    "Gleicher Tatkomplex wie 2024-02; Motiv nicht gesichert.":
      "Same set of crimes as 2024-02; motive not established.",
    "Der 53-jährige mutmaßliche Täter (Porträt mit schwarzem Balken und Verpixelung), Vater der getöteten 13-Jährigen – Bildmontage mit dem Wohnhaus in Wien-Erdberg":
      "The 53-year-old alleged perpetrator (portrait with black bar and pixelation), father of the 13-year-old who was killed – photomontage with the apartment building in Vienna-Erdberg",
    // 2024-04
    "Wien (Asia Studio 126A, Engerthstraße)":
      "Vienna (Asia Studio 126A, Engerthstraße)",
    "20. Bezirk, Brigittenau":
      "20th district, Brigittenau",
    "Keine (Betreiberin des Bordells)":
      "None (operator of the brothel)",
    "Afghanistan; Asylbewerber mit Wohnsitz in Kärnten":
      "Afghanistan; asylum seeker resident in Carinthia",
    "Festnahme in Tatortnähe; am 25.11.2024 wegen Zurechnungsunfähigkeit (paranoide Schizophrenie) rechtskräftig zur Unterbringung in einem forensisch-therapeutischen Zentrum auf unbestimmte Zeit verurteilt":
      "Arrested near the scene; on 25 November 2024 finally ordered, on grounds of lack of criminal responsibility (paranoid schizophrenia), to be placed in a forensic therapeutic centre for an indefinite period",
    "Mehr als 60 Messerstiche (v. a. Gesicht); insgesamt über 100 Stiche bei drei Opfern":
      "More than 60 knife stabs (mainly to the face); more than 100 stabs in total on three victims",
    "Unklar; Tat im Zustand einer akuten Psychose (laut Gerichtsgutachten)":
      "Unclear; crime committed in a state of acute psychosis (according to the court's expert report)",
    "Landesgericht für Strafsachen Wien (Geschworene)":
      "Vienna Regional Criminal Court (jury)",
    "Zurechnungsunfähigkeit (7:1); Unterbringung in forensisch-therapeutischem Zentrum auf unbestimmte Zeit, rechtskräftig":
      "Lack of criminal responsibility (7:1); placement in a forensic therapeutic centre for an indefinite period, final",
    "AÖF-Liste Nr. 4. Opfer war die Betreiberin des Studios und flüchtete laut Anklage in ein Badezimmer. Der Täter stach mit drei zuvor gekauften Messern zu. Eine vierte Frau und ein Kunde überlebten unentdeckt in einem Nebenraum.":
      "AÖF list no. 4. The victim was the operator of the studio and, according to the indictment, fled into a bathroom. The perpetrator stabbed with three knives he had bought beforehand. A fourth woman and a client survived undiscovered in a side room.",
    "Tat im Zustand einer akuten Psychose bei paranoider Schizophrenie (Gerichtsgutachten); religiös-psychotische Wahninhalte.":
      "Crime committed in a state of acute psychosis with paranoid schizophrenia (court expert report); religious-psychotic delusional content.",
    "Religiös gefärbte Wahninhalte laut Gerichtsgutachten dokumentiert (Dschihad-Vorstellungen aus Koran-Vers herausgelesen); Moscheebesuch am Tattag.":
      "Religiously coloured delusional content documented in the court's expert report (notions of jihad read into a verse of the Koran); visit to a mosque on the day of the crime.",
    "Der Angeklagte Ebadullah A. (von hinten) bei der Verhandlung am Landesgericht für Strafsachen Wien; abgebildete Gesichter verpixelt":
      "The defendant Ebadullah A. (seen from behind) at the hearing at Vienna Regional Criminal Court; faces shown are pixelated",
    // 2024-05
    "Keine (als Prostituierte im Studio tätig)":
      "None (working as a prostitute in the studio)",
    "Festnahme; am 25.11.2024 wegen Zurechnungsunfähigkeit rechtskräftig zur Unterbringung in einem forensisch-therapeutischen Zentrum verurteilt":
      "Arrest; on 25 November 2024 finally ordered, on grounds of lack of criminal responsibility, to be placed in a forensic therapeutic centre",
    "30 Messerstiche, gezielt Kopf- und Halsregion":
      "30 knife stabs, aimed at the head and neck",
    "AÖF-Liste Nr. 5. Altersangabe uneinheitlich: AÖF-Liste nennt 57, die gerichtliche Berichterstattung (Anklageschrift) 47 Jahre.":
      "AÖF list no. 5. Age information inconsistent: the AÖF list gives 57, court reporting (indictment) 47.",
    "Gleicher Fallkomplex wie 2024-04 (akute Psychose, paranoide Schizophrenie).":
      "Same set of cases as 2024-04 (acute psychosis, paranoid schizophrenia).",
    // 2024-06
    "16 Messerstiche; Messerspitze brach laut Anklage ab":
      "16 knife stabs; according to the indictment, the tip of the knife broke off",
    "AÖF-Liste Nr. 6. AÖF-Liste gibt das Alter des Opfers mit '?' an; laut gerichtlicher Berichterstattung 47 Jahre.":
      "AÖF list no. 6. The AÖF list gives the victim's age as '?'; according to court reporting, 47.",
    // 2024-07
    "Bezirk Lilienfeld":
      "Lilienfeld district",
    "Ehemann bzw. Lebensgefährte (Berichte uneinheitlich)":
      "Husband or live-in partner (reports inconsistent)",
    "Suizidversuch nach der Tat; verstarb am 28.2.2024":
      "Suicide attempt after the crime; died on 28 February 2024",
    "Schussverletzungen (legal besessene Schusswaffe)":
      "Gunshot wounds (legally owned firearm)",
    "AÖF-Liste Nr. 7. Tat Montagfrüh in einem Wohnhaus in Eschenau. Erweiterter Suizid.":
      "AÖF list no. 7. Crime on a Monday morning in a house in Eschenau. Murder-suicide.",
    "Erweiterter Suizid (93-jähriger Täter); Motiv nicht berichtet.":
      "Murder-suicide (93-year-old perpetrator); motive not reported.",
    // 2024-08
    "Bezirk St. Pölten-Land":
      "St. Pölten-Land district",
    "Schuss aus einer Faustfeuerwaffe (legal besessen)":
      "Shot from a handgun (legally owned)",
    "Mutmaßlich Tötung auf Verlangen; beide litten unter Krankheiten, die Frau dürfte schwer erkrankt gewesen sein; Abschiedsbrief gefunden":
      "Presumably killing on request; both suffered from illnesses, the woman was probably seriously ill; farewell letter found",
    "AÖF-Liste Nr. 8. AÖF gibt 9.4.2024 an; die Leichen wurden am 8.4.2024 gegen 14:20 Uhr gefunden. Ermittlungen ergaben Hinweise auf Tötung auf Verlangen.":
      "AÖF list no. 8. AÖF gives 9 April 2024; the bodies were found on 8 April 2024 at around 14:20. Investigations revealed indications of killing on request.",
    "Mutmaßlich Tötung auf Verlangen; beide Partner erkrankt, Abschiedsbrief gefunden.":
      "Presumably killing on request; both partners ill, farewell letter found.",
    // 2024-09
    "Bezirk Leoben":
      "Leoben district",
    "Bezirk Graz-Umgebung":
      "Graz-Umgebung district",
    "Suizid nach der Tat (erschoss sich selbst)":
      "Suicide after the crime (shot himself)",
    "Schüsse aus registrierter Faustfeuerwaffe; die Frau war laut Zeugen vor ihm aus dem Haus geflohen und wurde verfolgt":
      "Shots from a registered handgun; according to witnesses, the woman had fled the house to escape him and was pursued",
    "Mutmaßlich unbegründete Eifersucht (laut Ermittlungen)":
      "Presumably unfounded jealousy (according to the investigation)",
    "14-jähriger Sohn hinterblieben":
      "14-year-old son left behind",
    "AÖF-Liste Nr. 9. Erweiterter Suizid.":
      "AÖF list no. 9. Murder-suicide.",
    "Mutmaßlich unbegründete Eifersucht laut Ermittlungen.":
      "Presumably unfounded jealousy according to the investigation.",
    // 2024-10
    "Innsbruck (Statutarstadt)":
      "Innsbruck (statutory city)",
    "Festnahme; am 8.10.2025 wegen Mordes zu lebenslanger Haft verurteilt (geständig)":
      "Arrest; on 8 October 2025 sentenced to life imprisonment for murder (confessed)",
    "Stumpfe Gewalteinwirkung auf den Schädel bzw. Gewalt gegen den Hals (laut Obduktion)":
      "Blunt force to the skull and force to the neck (according to the post-mortem)",
    "AÖF-Liste Nr. 10. Die pflegebedürftige Mutter lebte mit dem Sohn in der gemeinsamen Wohnung. Zum Prozesszeitpunkt war der Täter 43 Jahre alt.":
      "AÖF list no. 10. The mother, who needed care, lived with her son in their shared flat. The perpetrator was 43 at the time of the trial.",
    "Sohn tötete pflegebedürftige Mutter; Motiv auch im Prozess nicht öffentlich geklärt.":
      "Son killed his mother, who needed care; motive not publicly established even at trial.",
    // 2024-11
    "21. Bezirk, Floridsdorf":
      "21st district, Floridsdorf",
    "Mitbewohner":
      "Flatmate",
    "Von der Polizei in Notwehr erschossen, nachdem er mit der Axt Beamte attackiert hatte":
      "Shot dead by the police in self-defence after he had attacked officers with the axe",
    "Mit Axt/Hacke erschlagen (schwere Kopfverletzungen)":
      "Beaten to death with an axe/hatchet (severe head injuries)",
    "Unklar; lag mutmaßlich in der psychischen Erkrankung des Täters (seit 2020 polizeibekannt, mehrfache Unterbringungen)":
      "Unclear; presumably rooted in the perpetrator's mental illness (known to the police since 2020, several compulsory placements)",
    "AÖF-Liste Nr. 11. Das Opfer hatte Arbeitskollegen Minuten vor der Tat per Videoanruf um Hilfe gebeten. Der Täter schlug mit der Axt auf das Polizeiauto ein und wurde von einem Beamten erschossen.":
      "AÖF list no. 11. Minutes before the crime the victim had asked work colleagues for help in a video call. The perpetrator hit the police car with the axe and was shot dead by an officer.",
    "Tat lag mutmaßlich in der psychischen Erkrankung des Täters (seit 2020 polizeibekannt, mehrfache Unterbringungen).":
      "The crime was presumably rooted in the perpetrator's mental illness (known to the police since 2020, several compulsory placements).",
    // 2024-12
    "Italien (Opfer wohnhaft in Innsbruck, Österreich)":
      "Italy (victim resident in Innsbruck, Austria)",
    "Italien":
      "Italy",
    "Italienerin russischer Abstammung":
      "Italian of Russian descent",
    "Ehemann, getrennt lebend":
      "Husband, separated",
    "Festnahme; geständig":
      "Arrest; confessed",
    "Erdrosselt (laut ersten Indizien)":
      "Strangled (according to initial evidence)",
    "Streit um das Fürsorgerecht für die gemeinsamen Kinder; der Frau war das Sorgerecht gerichtlich zugesprochen worden, erst am Tag vor der Tat hatte es eine Einigung gegeben":
      "Dispute over custody of their children; custody had been awarded to the woman by a court, and an agreement had been reached only the day before the crime",
    "2 minderjährige Kinder":
      "2 minor children",
    "AÖF-Liste Nr. 12. Tatort in Italien; Ausgang des italienischen Verfahrens nicht öffentlich berichtet (Stand Recherche).":
      "AÖF list no. 12. Crime scene in Italy; outcome of the Italian proceedings not publicly reported (as of the time of research).",
    "Sorgerechtsstreit nach Trennung; Einigung erst am Tag vor der Tat.":
      "Custody dispute after separation; agreement reached only the day before the crime.",
    // 2024-13
    "Arbeitskollege mit privatem Naheverhältnis (Hauptbeschuldigter); dessen Bruder (53) Mitbeschuldigter":
      "Work colleague with a close private relationship (principal suspect); his brother (53) a co-accused",
    "Festnahmen bereits im Juni 2025; Untersuchungshaft (JA Innsbruck bzw. Salzburg); Mordvorwurf nicht geständig (55-Jähriger spricht von Unfall, räumt Verstecken der Leichen ein)":
      "Arrests as early as June 2025; pre-trial detention (Innsbruck and Salzburg prisons); no confession to the murder charge (the 55-year-old speaks of an accident and admits hiding the bodies)",
    "Todesursache unklar (Leichen in Tiefkühltruhen hinter einer Rigipswand versteckt; fortgeschrittener Verwesungszustand)":
      "Cause of death unclear (bodies hidden in chest freezers behind a plasterboard wall; advanced state of decomposition)",
    "Unklar; Ermittlungen wegen Doppelmordverdachts laufen (StA Innsbruck); Indizien (vorab angeschaffte Kühltruhe, verkaufter Schmuck des Opfers) deuten auf geplante Tat hin":
      "Unclear; investigation on suspicion of double murder ongoing (Innsbruck public prosecutor's office); circumstantial evidence (chest freezer acquired in advance, the victim's jewellery sold) points to a planned crime",
    "10-jährige Tochter ebenfalls getötet (Fall 2024-14)":
      "10-year-old daughter also killed (case 2024-14)",
    "AÖF-Liste Nr. 28 (nachträglich ergänzt, Stand 18.11.2025). Mutter und Tochter galten seit 21.6.2024 (AÖF) bzw. seit Juli 2024 (Polizei) als vermisst; die Leichen wurden erst am 14.11.2025 gefunden.":
      "AÖF list no. 28 (added subsequently, as of 18 November 2025). Mother and daughter had been missing since 21 June 2024 (AÖF) or since July 2024 (police); the bodies were found only on 14 November 2025.",
    "Ermittlungen laufen; StA nennt kein Motiv, Indizien deuten auf geplante Tat (vorab angeschaffte Kühltruhe, verkaufter Schmuck des Opfers).":
      "Investigation ongoing; the public prosecutor's office names no motive, circumstantial evidence points to a planned crime (chest freezer acquired in advance, the victim's jewellery sold).",
    // 2024-14
    "Arbeitskollege der Mutter mit privatem Naheverhältnis (Hauptbeschuldigter); dessen Bruder (53) Mitbeschuldigter":
      "Work colleague of the mother with a close private relationship (principal suspect); his brother (53) a co-accused",
    "Festnahmen im Juni 2025; Untersuchungshaft; Mordvorwurf nicht geständig":
      "Arrests in June 2025; pre-trial detention; no confession to the murder charge",
    "Todesursache unklar (Leiche in Tiefkühltruhe versteckt)":
      "Cause of death unclear (body hidden in a chest freezer)",
    "Unklar; Ermittlungen laufen":
      "Unclear; investigation ongoing",
    "Opfer war selbst ein Kind; Mutter (34) ebenfalls getötet (Fall 2024-13)":
      "The victim was herself a child; her mother (34) was also killed (case 2024-13)",
    "AÖF-Liste Nr. 29 (nachträglich ergänzt). Gleicher Fallkomplex wie 2024-13.":
      "AÖF list no. 29 (added subsequently). Same set of cases as 2024-13.",
    "Gleicher Fallkomplex wie 2024-13; Motiv unbekannt.":
      "Same set of cases as 2024-13; motive unknown.",
    // 2024-15
    "Schwere Verletzungen durch ein Schnittwerkzeug (laut Medienberichten eine Säge)":
      "Severe injuries from a cutting tool (according to media reports, a saw)",
    "AÖF-Liste Nr. 13. Leichen am Samstag, 29.6.2024, im Süden von Linz gefunden. Erweiterter Suizid.":
      "AÖF list no. 13. Bodies found in the south of Linz on Saturday, 29 June 2024. Murder-suicide.",
    "Erweiterter Suizid (84-jähriger Täter); Motiv nicht berichtet.":
      "Murder-suicide (84-year-old perpetrator); motive not reported.",
    // 2024-16
    "Graz (Anwaltskanzlei, Innenstadt)":
      "Graz (law firm, city centre)",
    "Ehemaliger Arbeitskollege (genaue Beziehung laut AÖF unklar)":
      "Former work colleague (exact relationship unclear according to AÖF)",
    "Mehrere Schüsse aus einer Langwaffe (Gewehr)":
      "Several shots from a long gun (rifle)",
    "AÖF-Liste Nr. 14. Das Opfer war allein im Büro der Kanzlei, in der es arbeitete; der Täter soll dort früher ebenfalls gearbeitet haben. Alter des Täters: AÖF 30, Medien 29. Erweiterter Suizid.":
      "AÖF list no. 14. The victim was alone in the office of the law firm where she worked; the perpetrator is said to have worked there previously too. Age of the perpetrator: AÖF 30, media 29. Murder-suicide.",
    "Ehemaliger Arbeitskollege; Motiv nicht öffentlich geklärt.":
      "Former work colleague; motive not publicly established.",
    // 2024-17
    "12. Bezirk, Meidling":
      "12th district, Meidling",
    "Ehemann bzw. Partner":
      "Husband or partner",
    "Festnahme am 2.8.2024 am Flughafen Berlin":
      "Arrested at Berlin airport on 2 August 2024",
    "Mehrere Stichverletzungen":
      "Several stab wounds",
    "AÖF-Liste Nr. 15. Das Opfer wurde nach Hinweisen besorgter Angehöriger tot in der Wohnung gefunden. Der Verdächtige war zunächst untergetaucht und wurde in Berlin gefasst.":
      "AÖF list no. 15. The victim was found dead in the flat after concerned relatives raised the alarm. The suspect had initially gone into hiding and was caught in Berlin.",
    "Motiv nicht öffentlich berichtet.":
      "Motive not publicly reported.",
    // 2024-18
    "Wien (Klinik Favoriten)":
      "Vienna (Klinik Favoriten hospital)",
    "10. Bezirk, Favoriten":
      "10th district, Favoriten",
    "Suizid am Tatort (fügte sich selbst tödliche Schusswunde zu)":
      "Suicide at the scene (inflicted a fatal gunshot wound on himself)",
    "Schusswaffe; Patientin im Bett im Patientenzimmer (Neurologie) erschossen":
      "Firearm; patient shot dead in her bed in a hospital room (neurology)",
    "AÖF-Liste Nr. 16. Die Frau befand sich seit Juli 2024 in stationärer Behandlung. Erweiterter Suizid.":
      "AÖF list no. 16. The woman had been an inpatient since July 2024. Murder-suicide.",
    "Patientin in stationärer Behandlung (Neurologie); Täter erschoss Ehefrau im Krankenbett und sich selbst.":
      "Patient receiving inpatient treatment (neurology); the perpetrator shot his wife dead in her hospital bed and then himself.",
    // 2024-19
    "Wels (Tat 2018); Tod in Pflegeheim":
      "Wels (crime in 2018); died in a care home",
    "Wels (Statutarstadt)":
      "Wels (statutory city)",
    "Ehemann (mittlerweile geschieden)":
      "Husband (since divorced)",
    "Am 22.1.2019 wegen Mordversuchs in eine Anstalt für geistig abnorme Rechtsbrecher eingewiesen (LG Wels, Geschworene)":
      "Committed to an institution for mentally abnormal offenders for attempted murder on 22 January 2019 (Wels Regional Court, jury)",
    "Fußtritte (Mai 2018, am Arbeitsplatz des Opfers); Opfer lag seither im Wachkoma und verstarb Anfang August 2024 in einem Pflegeheim":
      "Kicks (May 2018, at the victim's workplace); the victim had been in a vegetative state ever since and died in a care home in early August 2024",
    "Laut Anklage 2019 war die Beziehung von Gewalt geprägt":
      "According to the 2019 indictment, the relationship was marked by violence",
    "Gemeinsame Tochter (zum Tatzeitpunkt 8 Jahre alt)":
      "Their daughter (8 years old at the time of the crime)",
    "Landesgericht Wels (Geschworenengericht)":
      "Wels Regional Court (jury court)",
    "Mordversuch; Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher":
      "Attempted murder; committal to an institution for mentally abnormal offenders",
    "AÖF-Liste Nr. 17. Sonderfall: Tat Mai 2018 (Opfer damals 32, Täter 30), Tod erst 2024 infolge der Tatverletzungen. Das Opfer war Floristin. Ob nach dem Tod 2024 ein neues Verfahren folgte, ist nicht berichtet.":
      "AÖF list no. 17. Special case: crime in May 2018 (victim then 32, perpetrator 30), death only in 2024 as a result of the injuries from the crime. The victim was a florist. Whether new proceedings followed after her death in 2024 has not been reported.",
    "Laut Anklage 2019 von Gewalt geprägte Beziehung; Tat am Arbeitsplatz der Ex-Frau.":
      "According to the 2019 indictment, a relationship marked by violence; crime at his ex-wife's workplace.",
    // 2024-20
    "Wien-Favoriten":
      "Vienna-Favoriten",
    "Langjähriger Lebensgefährte":
      "Long-term live-in partner",
    "Festnahme; am 25.2.2025 wegen Mordes zu lebenslanger Haft verurteilt (nicht rechtskräftig), umfassend geständig":
      "Arrest; sentenced to life imprisonment for murder on 25 February 2025 (not final), made a full confession",
    "Erwürgt (Verletzungen im Halsbereich)":
      "Strangled (injuries to the neck area)",
    "Eifersucht (laut Gericht)":
      "Jealousy (according to the court)",
    "Lebenslange Haft wegen Mordes (nicht rechtskräftig)":
      "Life imprisonment for murder (not final)",
    "AÖF-Liste Nr. 18.":
      "AÖF list no. 18.",
    "Eifersucht laut Gericht.":
      "Jealousy according to the court.",
    // 2024-21
    "Wien (Kleingartenanlage am Bahndammweg)":
      "Vienna (allotment garden site on Bahndammweg)",
    "Wienerin":
      "Viennese woman",
    "Keine (unbekannt; Einbruch ins Gartenhaus)":
      "None (unknown; break-in at the garden house)",
    "Slowakei":
      "Slovakia",
    "Festnahme am 21.9.2024 in der Slowakei (Europäischer Haftbefehl), Auslieferung im Oktober 2024; am 5.6.2025 rechtskräftig zu lebenslanger Haft plus Unterbringung in forensisch-therapeutischem Zentrum verurteilt":
      "Arrested in Slovakia on 21 September 2024 (European arrest warrant), extradited in October 2024; on 5 June 2025 finally sentenced to life imprisonment plus placement in a forensic therapeutic centre",
    "Schläge mit einer Rohrzange, anschließend Erstickt (Polster); zuvor Missbrauchshandlungen/Vergewaltigung":
      "Blows with a pipe wrench, then suffocated (pillow); previously acts of abuse/rape",
    "Raub und sexualisierte Gewalt; Täter suchte gezielt nach weiblichen Opfern in Kleingartensiedlungen; dissoziale Persönlichkeitsstörung (laut Gutachten), massiv vorbestraft (u. a. Tötungsdelikt in der Slowakei, schwere Gewalt gegen Frauen in Wien 2008)":
      "Robbery and sexualised violence; the perpetrator specifically searched for female victims in allotment garden settlements; dissocial personality disorder (according to an expert report), numerous serious previous convictions (including a homicide in Slovakia and serious violence against women in Vienna in 2008)",
    "Lebenslange Haft wegen Mordes plus Unterbringung in forensisch-therapeutischem Zentrum (§ 21 Abs. 2 StGB), rechtskräftig":
      "Life imprisonment for murder plus placement in a forensic therapeutic centre (§ 21(2) StGB), final",
    "AÖF-Liste Nr. 19. Tat in der Nacht zum 4.9.2024; Leiche von Angehörigen gefunden. DNA- und Fingerabdruckspuren überführten den Täter.":
      "AÖF list no. 19. Crime during the night to 4 September 2024; body found by relatives. DNA and fingerprint traces led to the perpetrator's conviction.",
    "Raub und sexualisierte Gewalt (Vergewaltigung); Täter suchte gezielt weibliche Opfer in Kleingartensiedlungen.":
      "Robbery and sexualised violence (rape); the perpetrator specifically searched for female victims in allotment garden settlements.",
    // 2024-22
    "Kennelbach (Auwald der Bregenzer Ache)":
      "Kennelbach (riverside woodland of the Bregenzer Ache)",
    "Bezirk Bregenz":
      "Bregenz district",
    "Vorarlberg (seit ca. 2 Jahren)":
      "Vorarlberg (for about 2 years)",
    "Früheres Beziehungsverhältnis (laut Polizei); Beziehungstat":
      "Former relationship (according to the police); intimate-partner killing",
    "Spanien; wohnhaft in Vorarlberg":
      "Spain; resident in Vorarlberg",
    "Festnahme am 12.9.2024 als dringend tatverdächtig; Einlieferung in die Justizanstalt Feldkirch; bestreitet die Tat":
      "Arrested on 12 September 2024 as prime suspect; taken to Feldkirch prison; denies the crime",
    "AÖF-Liste Nr. 20. AÖF gibt 8./13.9.2024 an: Leiche am Sonntag, 8.9.2024, im Auwald gefunden; Festnahme am 12.9.2024. Todesursache in den abrufbaren Berichten nicht genannt.":
      "AÖF list no. 20. AÖF gives 8/13 September 2024: body found in the riverside woodland on Sunday, 8 September 2024; arrest on 12 September 2024. Cause of death not given in the available reports.",
    "Früheres Beziehungsverhältnis; laut Polizei Beziehungstat.":
      "Former relationship; according to the police, an intimate-partner killing.",
    // 2024-23
    "Bezirk Perg":
      "Perg district",
    "Mit einer Langwaffe (Gewehr) erschossen":
      "Shot dead with a long gun (rifle)",
    "57-jährige geistig beeinträchtigte Tochter tot im Keller aufgefunden; laut Medienberichten verhungerte und verdurstete sie allein im Haus (amtliche Todesursache nicht mehr ermittelbar)":
      "57-year-old daughter with an intellectual disability found dead in the cellar; according to media reports, she starved and died of thirst alone in the house (official cause of death could no longer be determined)",
    "AÖF-Liste Nr. 21. Tat dürfte Ende August 2024 erfolgt sein; die drei Leichen wurden am 13.9.2024 nach Hinweis einer Bekannten gefunden. Erweiterter Suizid.":
      "AÖF list no. 21. The crime probably took place at the end of August 2024; the three bodies were found on 13 September 2024 after a tip-off from an acquaintance. Murder-suicide.",
    "Erweiterter Suizid; Motiv nicht berichtet. Tochter verhungerte/verdurstete mutmaßlich allein im Haus.":
      "Murder-suicide; motive not reported. The daughter presumably starved/died of thirst alone in the house.",
    // 2024-24
    "Grazer":
      "man from Graz",
    "Verstarb später an den Folgen des vorsätzlich herbeigeführten Unfalls (Suizidabsicht)":
      "Later died of the consequences of the deliberately caused accident (suicidal intent)",
    "Vorsätzlich herbeigeführter Autounfall (Opfer auf dem Beifahrersitz)":
      "Deliberately caused car accident (victim in the passenger seat)",
    "Verzweiflungstat wegen der Demenzerkrankung der Frau; Abschiedsbrief in der Wohnung gefunden":
      "Act of desperation because of the woman's dementia; farewell letter found in the flat",
    "AÖF-Liste Nr. 25. Der Unfall am 28.9.2024 wurde zunächst als Verkehrsunfall gewertet; erst ein Abschiedsbrief enthüllte die Vorsatztat (Mord-Suizid). AÖF führt den Fall unter 9.11.2024 (Todesmeldung des Mannes).":
      "AÖF list no. 25. The accident on 28 September 2024 was initially treated as a road accident; only a farewell letter revealed the deliberate act (murder-suicide). AÖF lists the case under 9 November 2024 (notification of the man's death).",
    "Verzweiflungstat wegen der Demenzerkrankung der Frau; Abschiedsbrief gefunden.":
      "Act of desperation because of the woman's dementia; farewell letter found.",
    // 2024-25
    "Wien (Balderichgasse)":
      "Vienna (Balderichgasse)",
    "17. Bezirk, Hernals":
      "17th district, Hernals",
    "Wien-Hernals":
      "Vienna-Hernals",
    "Festnahme am Tatort (widerstandslos); verweigerte die Aussage; Untersuchungshaft":
      "Arrested at the scene (without resistance); refused to testify; pre-trial detention",
    "Mit einem Holzstock/Ast auf dem Balkon totgeprügelt":
      "Beaten to death on the balcony with a wooden stick/branch",
    "AÖF-Liste Nr. 22. Mehrere Anrainer hörten Hilferufe und alarmierten die Polizei. Kein Betretungs- oder Annäherungsverbot im Vorfeld; Täter war wegen Gewalt gegen die Frau nicht aufgefallen.":
      "AÖF list no. 22. Several neighbours heard cries for help and alerted the police. No barring or no-contact order beforehand; the perpetrator had not come to attention for violence against the woman.",
    "Täter schweigt; Motiv nicht ermittelt.":
      "Perpetrator remains silent; motive not established.",
    // 2024-26
    "Zistersdorf (Weingarten)":
      "Zistersdorf (vineyard)",
    "Bezirk Gänserndorf":
      "Gänserndorf district",
    "Bekanntschaftsverhältnis":
      "Acquaintance",
    "Suizid mittels Sprengsatz, nachdem er sich stundenlang in einem Kellerstollen verschanzt hatte":
      "Suicide with an explosive device after barricading himself in a cellar tunnel for hours",
    "Stichverletzungen; Opfer in einem Weingarten gefunden, verblutet":
      "Stab wounds; victim found in a vineyard, bled to death",
    "AÖF-Liste Nr. 23. Der Täter war zuvor in mehreren europäischen Ländern wegen unbefugten Besitzes von Waffen und Sprengstoff aufgefallen. Die Leiche des Täters wurde mit einem Roboter aus dem Stollen geborgen.":
      "AÖF list no. 23. The perpetrator had previously come to the attention of the authorities in several European countries for unauthorised possession of weapons and explosives. The perpetrator's body was recovered from the tunnel by a robot.",
    "Bekanntschaftsverhältnis; Motiv nicht geklärt.":
      "Acquaintance; motive not established.",
    // 2024-27
    "Bezirk Hallein (Tennengau)":
      "Hallein district (Tennengau)",
    "Bayern (Berchtesgadener Land); zu Besuch beim Sohn in Adnet":
      "Bavaria (Berchtesgadener Land); visiting her son in Adnet",
    "Bayern":
      "Bavaria",
    "evangelisch (laut Medienberichten)":
      "Protestant (according to media reports)",
    "Aus Bayern stammend; lebte in Adnet":
      "Originally from Bavaria; lived in Adnet",
    "katholisch (Taufe Anfang 2024, laut Medienberichten)":
      "Catholic (baptised in early 2024, according to media reports)",
    "Festnahme am 24.10.2024; am 21.5.2025 von Geschworenen im Sinne des Mordes schuldig befunden, wegen Zurechnungsunfähigkeit (paranoide Schizophrenie) unbefristet in forensisch-therapeutischem Zentrum untergebracht":
      "Arrested on 24 October 2024; on 21 May 2025 found guilty by the jury of the facts constituting murder; placed indefinitely in a forensic therapeutic centre on grounds of lack of criminal responsibility (paranoid schizophrenia)",
    "Massive Stich- und Schnittverletzungen im Halsbereich mit einem Küchenmesser (21 cm Klinge); Opfer fast vollständig geköpft, verblutet":
      "Massive stab and cut wounds to the neck area with a kitchen knife (21 cm blade); the victim was almost completely decapitated and bled to death",
    "Tat im Wahn (paranoide Schizophrenie, mutmaßlich auch durch Steroid-/Anabolikakonsum begünstigt); Täter behauptete Überfall durch Unbekannte – von der Spurenlage widerlegt":
      "Crime committed in a delusional state (paranoid schizophrenia, presumably also favoured by steroid/anabolic use); the perpetrator claimed an attack by unknown persons – refuted by the forensic evidence",
    "Schuldig im Sinne des Mordes; wegen Zurechnungsunfähigkeit keine Strafe, sondern unbefristete Unterbringung in einem forensisch-therapeutischen Zentrum":
      "Guilty of the facts constituting murder; because of lack of criminal responsibility no sentence, but indefinite placement in a forensic therapeutic centre",
    "AÖF-Liste Nr. 24. Altersangaben: AÖF/erste Berichte 31, Prozessberichte 32. Der Täter rief selbst den Notruf und erfand eine Raubüberfall-Geschichte.":
      "AÖF list no. 24. Age information: AÖF/first reports 31, trial reports 32. The perpetrator himself called the emergency number and invented a story about a robbery.",
    "Tat im Wahn (paranoide Schizophrenie, mutmaßlich durch Steroidkonsum begünstigt); religiös gefärbte Wahninhalte laut Prozessberichten.":
      "Crime committed in a delusional state (paranoid schizophrenia, presumably favoured by steroid use); religiously coloured delusional content according to trial reports.",
    "Taufe (katholisch) Anfang 2024; weggeworfenes Taufbuch von Ermittlern gefunden; mied zeitweise evangelische Verwandte inkl. der Mutter; plante hohe Spende an die katholische Kirche (APA/Prozessberichte).":
      "Baptised (Catholic) in early 2024; a discarded baptismal book was found by investigators; at times avoided Protestant relatives including his mother; planned a large donation to the Catholic Church (APA/trial reports).",
    "Felix S. (schwarzer Balken) posiert mit Muskeln vor einer Fatima-Figur – Foto aus seinen Social-Media-Kanälen, im Bericht über den Unterbringungsantrag der Staatsanwaltschaft Salzburg veröffentlicht (© Privat)":
      "Felix S. (black bar) posing with his muscles in front of a figure of Our Lady of Fátima – photo from his social media channels, published in the report on the Salzburg public prosecutor's application for placement (© private)",
    // 2024-28
    "Ljubljana (Flughafen, Parkplatz)":
      "Ljubljana (airport, car park)",
    "Slowenien":
      "Slovenia",
    "Slowenien (beide wohnhaft in Klagenfurt, Österreich)":
      "Slovenia (both resident in Klagenfurt, Austria)",
    "Ex-Ehemann (in Iran 2008 geheiratet, in Österreich 2023 geschieden)":
      "Ex-husband (married in Iran in 2008, divorced in Austria in 2023)",
    "Iran; 2017 nach Österreich gekommen, Aufenthaltsrecht in Klagenfurt":
      "Iran; came to Austria in 2017, right of residence in Klagenfurt",
    "Festnahme am 9.11.2024 in Klagenfurt (Europäischer Haftbefehl, Einsatzkommando Cobra, am Arbeitsplatz in einem Supermarkt); geständig; Anklage wegen Mordes am LG Klagenfurt (April 2025); Urteil nicht berichtet":
      "Arrested in Klagenfurt on 9 November 2024 (European arrest warrant, Cobra special unit, at his workplace in a supermarket); confessed; charged with murder at Klagenfurt Regional Court (April 2025); verdict not reported",
    "Mehr als zehn Messerstiche; lauerte der Frau am Flughafen-Parkplatz auf, als sie von Istanbul kommend zu ihrem Auto ging":
      "More than ten knife stabs; lay in wait for the woman in the airport car park as she walked to her car after arriving from Istanbul",
    "Laut slowenischer Polizei 'teils Rache, teils Eifersucht' – Rache mutmaßlich wegen der Scheidung; von der Polizei als klassischer Femizid eingestuft":
      "According to the Slovenian police, 'partly revenge, partly jealousy' – revenge presumably because of the divorce; classified by the police as a classic femicide",
    "3 minderjährige gemeinsame Kinder (5, 7 und 14 Jahre); nach der Tat in behördlicher Obhut":
      "3 minor children together (aged 5, 7 and 14); placed in the care of the authorities after the crime",
    "Anklage wegen grausamen Mordes erhoben (StA Klagenfurt); Ausgang nicht berichtet (Stand Recherche)":
      "Charged with cruel murder (Klagenfurt public prosecutor's office); outcome not reported (as of the time of research)",
    "AÖF-Liste Nr. 26. AÖF-Datum 9.11.2024 (Festnahme); die Tat erfolgte laut slowenischer Polizei am Donnerstag, 7.11.2024. Mutmaßliche Tatwaffe (Küchenmesser) bei Hausdurchsuchung gefunden.":
      "AÖF list no. 26. AÖF date 9 November 2024 (arrest); according to the Slovenian police, the crime took place on Thursday, 7 November 2024. The suspected weapon (kitchen knife) was found during a house search.",
    "Slowenische Polizei: 'teils Rache, teils Eifersucht' nach der Scheidung; von der Polizei als klassischer Femizid eingestuft.":
      "Slovenian police: 'partly revenge, partly jealousy' after the divorce; classified by the police as a classic femicide.",
    // 2024-29
    "Bezirk Wiener Neustadt-Land":
      "Wiener Neustadt-Land district",
    "Suizid am Tatort":
      "Suicide at the scene",
    "Schüsse aus einem Kleinkalibergewehr; die Frau erlag später im Krankenhaus ihren Verletzungen":
      "Shots from a small-calibre rifle; the woman later died of her injuries in hospital",
    "Mögliches Motiv laut Ermittlern: Erkrankung beider Partner":
      "Possible motive according to investigators: illness of both partners",
    "AÖF-Liste Nr. 27. Erweiterter Suizid.":
      "AÖF list no. 27. Murder-suicide.",
    "Mögliches Motiv laut Ermittlern: Erkrankung beider Partner.":
      "Possible motive according to investigators: illness of both partners."
  };
  for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k)) I.dict[k] = d[k];
  I.keep.push(
    "Berndorf",
    "Mürzzuschlag",
    "Bruck-Mürzzuschlag",
    "Gertrude K.",
    "Völkermarkt",
    "Edling",
    "Bad Leonfelden",
    "Samuel Z.",
    "Urfahr-Umgebung",
    "Steyr",
    "Raaba",
    "Graz-Umgebung",
    "Strasshof an der Nordbahn",
    "Kleinstübing",
    "Graz-Wetzelsdorf",
    "Hohentauern",
    "Jessica",
    "Oliver R.",
    "Murtal",
    "St. Peter am Kammersberg",
    "Murau",
    "Eberndorf",
    "Birkfeld",
    "Lamprechtshausen",
    "Altenmarkt bei Fürstenfeld",
    "Südoststeiermark",
    "Wolfsberg im Schwarzautal",
    "Linz",
    "Elisabeth P.",
    "Krems-Land",
    "Pöls-Oberkurzheim",
    "Lofer",
    "Sonja S.",
    "Markus S.",
    "Salzburg24",
    "Zell am Ziller",
    "Ebadullah A.",
    "China",
    "Eschenau",
    "Ober-Grafendorf",
    "Sankt Stefan ob Leoben",
    "Chile",
    "Modena",
    "Provinz Modena",
    "Wels",
    "Perg",
    "Sankt Radegund bei Graz",
    "Adnet",
    "Felix S.",
    "Matzendorf-Hölles"
  );
})(window);
