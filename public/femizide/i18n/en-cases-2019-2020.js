/* Femizide in Österreich – englisches Wörterbuch: Falltexte 2019–2020.
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
    // 2019-01
    "Österreich (Tirol)":
      "Austria (Tyrol)",
    "Ehemann":
      "Husband",
    "Festnahme, U-Haft; zurechnungsunfähig, Einweisung in Anstalt für geistig abnorme Rechtsbrecher (August 2019)":
      "Arrest, pre-trial detention; not criminally responsible, committed to an institution for mentally abnormal offenders (August 2019)",
    "Messer (38 Stiche vor dem Wohnhaus)":
      "Knife (38 stab wounds in front of the residential building)",
    "Streit um das islamische Segensgebet; Täter mit Wahnvorstellungen, wollte Mitmenschen wiederholt zum Islam konvertieren; Verfassungsschutz hatte ihn zuvor im Visier":
      "Dispute over the Islamic blessing prayer; perpetrator with delusions, repeatedly tried to convert people around him to Islam; the domestic intelligence service had previously had him in its sights",
    "Landesgericht St. Pölten (Geschworene)":
      "St. Pölten Regional Court (jury)",
    "Zurechnungsunfähig (geistige Abnormität); Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher":
      "Not criminally responsible (mental abnormality); committal to an institution for mentally abnormal offenders",
    "Opfer laut ORF vierfache Mutter; die Kinder bekamen den Angriff mit. Der Standard berichtete, dass der Verfassungsschutz den Ehemann zuvor im Visier hatte; die Opferrolle als Konvertitin wurde in Medienberichten erwähnt. Laut oe24-Jahresrückblick wurde der Täter im August 2019 wegen Zurechnungsunfähigkeit (geistige Abnormität) in eine Anstalt für geistig abnorme Rechtsbrecher eingewiesen; zuständiges Geschworenengericht (LG St. Pölten) nicht abschließend verifiziert.":
      "According to ORF, the victim was a mother of four; the children witnessed the attack. Der Standard reported that the domestic intelligence service had previously had the husband in its sights; the victim's status as a convert was mentioned in media reports. According to the oe24 review of the year, the perpetrator was committed to an institution for mentally abnormal offenders in August 2019 on grounds of lack of criminal responsibility (mental abnormality); the competent jury court (St. Pölten Regional Court) has not been conclusively verified.",
    "Tat im Zustand geistiger Abnormität (Wahnvorstellungen, Konversionszwang); Auslöser laut oe24 Streit um das islamische Segensgebet; Einweisung.":
      "Crime committed in a state of mental abnormality (delusions, compulsion to convert others); trigger according to oe24 a dispute over the Islamic blessing prayer; committal.",
    "Medien/AÖF: Täter 'muslimisch-fundamental' mit Wahnvorstellungen, wollte Mitmenschen zum Islam konvertieren; Opfer Konvertitin; Verfassungsschutz hatte Ehemann im Visier.":
      "Media/AÖF: perpetrator 'Muslim fundamentalist' with delusions, wanted to convert people around him to Islam; victim a convert; the domestic intelligence service had the husband in its sights.",
    // 2019-02
    "Ex-Partner":
      "Ex-partner",
    "Festnahme; verurteilt zu lebenslanger Haft und Einweisung (Juni 2019), nicht rechtskräftig (Stand Ende 2019)":
      "Arrest; sentenced to life imprisonment and committal (June 2019), not final (as of end of 2019)",
    "Messer (vor der Garage erstochen)":
      "Knife (stabbed to death in front of the garage)",
    "Beziehungstat nach Trennung 2017; Täter lauerte der Frau seit der Trennung auf (Stalking), laut AÖF 'Waffennarr', zuvor Morddrohungen":
      "Intimate-partner killing after a separation in 2017; the perpetrator had been lying in wait for the woman since the separation (stalking), according to AÖF a 'gun fanatic', previous death threats",
    "Landesgericht Wiener Neustadt (Geschworene)":
      "Wiener Neustadt Regional Court (jury)",
    "Lebenslange Haft wegen Mordes und Stalkings sowie Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher":
      "Life imprisonment for murder and stalking, plus committal to an institution for mentally abnormal offenders",
    "AÖF bezeichnet die Beziehung als 'Ex-Partner', der Standard titelte zunächst 'Ehefrau'; laut oe24 war es der Ex-Lebensgefährte, der der Frau seit der Trennung 2017 auflauerte. Der Täter stammte laut ORF aus dem Burgenland (Neufeld an der Leitha). Gerichtsort (LG Wr. Neustadt) plausibel, nicht abschließend verifiziert. Laut ORF-NÖ-Jahresrückblick wurde die Bluttat von einer Videokamera aufgezeichnet, die das Opfer aus Angst vor dem Ex-Partner vor dem Wohnhaus installiert hatte; Täter im Jahresrückblick als 43-jährig bezeichnet (AÖF: 42).":
      "AÖF describes the relationship as 'ex-partner'; Der Standard initially headlined 'wife'; according to oe24 it was the former live-in partner, who had been lying in wait for the woman since the separation in 2017. According to ORF, the perpetrator came from Burgenland (Neufeld an der Leitha). Place of trial (Wiener Neustadt Regional Court) plausible, not conclusively verified. According to the ORF Lower Austria review of the year, the killing was recorded by a video camera that the victim had installed outside the building out of fear of her ex-partner; the review of the year gives the perpetrator's age as 43 (AÖF: 42).",
    "Trennung 2017, danach Stalking und Morddrohungen; Verurteilung wegen Mordes und Stalkings zu lebenslanger Haft mit Einweisung.":
      "Separation in 2017, followed by stalking and death threats; convicted of murder and stalking and sentenced to life imprisonment with committal.",
    // 2019-03
    "Wiener Neustadt (Statutarstadt)":
      "Wiener Neustadt (statutory city)",
    "Ex-Freund":
      "Ex-boyfriend",
    "Syrien (Fluchthintergrund)":
      "Syria (refugee background)",
    "Festnahme; verurteilt zu 15 Jahren Haft und Einweisung":
      "Arrest; sentenced to 15 years' imprisonment and committal",
    "Erdrosselt mit einem Stoffgürtel":
      "Strangled with a fabric belt",
    "Eifersucht/Zurückweisung nach Trennung; Täter war vorbestraft":
      "Jealousy/rejection after separation; the perpetrator had previous convictions",
    "15 Jahre Haft (Höchststrafe nach Jugendstrafrecht) und Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher":
      "15 years' imprisonment (maximum sentence under juvenile criminal law) and committal to an institution for mentally abnormal offenders",
    "Leiche des 16-jährigen Opfers am 13.1.2019 im Anton-Wodica-Park gefunden. Der Täter war zum Tatzeitpunkt 19, im Prozess 20 Jahre alt; Verurteilung nach Jugendstrafrecht (Höchstmaß 15 Jahre) mit Einweisung nach § 21 Abs. 2 StGB. Der Angeklagte sprach im Prozess von einem Unfall. Laut oe24-Prozessbericht schändete der Täter das tote Mädchen anschließend. Das Urteil von 2019 war nicht rechtskräftig; nach Aufhebung fand im September 2021 eine neuerliche Verhandlung statt, die laut heute.at erneut mit der Höchststrafe endete. Im ORF-NÖ-Jahresrückblick 2019 wurde irrtümlich 'lebenslange Haft' genannt; dokumentiert ist das Jugendstrafrecht-Höchstmaß von 15 Jahren.":
      "The body of the 16-year-old victim was found in Anton-Wodica-Park on 13 January 2019. The perpetrator was 19 at the time of the crime and 20 at the trial; sentenced under juvenile criminal law (maximum 15 years) with committal under § 21(2) of the Austrian Criminal Code (StGB). In court, the defendant spoke of an accident. According to the oe24 trial report, the perpetrator then desecrated the dead girl's body. The 2019 verdict was not final; after it was quashed, a new trial took place in September 2021 which, according to heute.at, again ended with the maximum sentence. The ORF Lower Austria review of 2019 mistakenly stated 'life imprisonment'; what is documented is the maximum of 15 years under juvenile criminal law.",
    "Tötung der 16-jährigen Ex-Freundin nach Trennung; Täter vorbestraft.":
      "Killing of his 16-year-old ex-girlfriend after a separation; perpetrator had previous convictions.",
    "Manuela K. (16, Gesicht verpixelt) und Yazan A. (links, schwarzer Balken) – Privatfoto, im Prozessbericht veröffentlicht":
      "Manuela K. (16, face pixelated) and Yazan A. (left, black bar) – private photo, published in the trial report",
    "Der Angeklagte Yazan A. (schwarzer Balken) neben einem Justizwachebeamten im Gerichtssaal (Foto: APA/Barbara Buchegger)":
      "The defendant Yazan A. (black bar) next to a prison officer in the courtroom (photo: APA/Barbara Buchegger)",
    "Yazan A. (schwarzer Balken) wird von Justizwachebeamten in den Verhandlungssaal geführt":
      "Yazan A. (black bar) being led into the courtroom by prison officers",
    // 2019-04
    "Wien, Hauptbahnhof":
      "Vienna, Hauptbahnhof (main railway station)",
    "Spanien (afrikanische Herkunft, laut AÖF)":
      "Spain (African origin, according to AÖF)",
    "Bruder":
      "Brother",
    "Festnahme; November 2019 Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher":
      "Arrest; November 2019 committal to an institution for mentally abnormal offenders",
    "Messer":
      "Knife",
    "Auseinandersetzung; laut AÖF Drogen- und psychische Probleme des Täters":
      "Altercation; according to AÖF, the perpetrator had drug and mental-health problems",
    "Landesgericht Wien (plausibel, nicht abschließend verifiziert)":
      "Vienna Regional Court (plausible, not conclusively verified)",
    "Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher":
      "Committal to an institution for mentally abnormal offenders",
    "Tat am Wiener Hauptbahnhof im Zuge einer Auseinandersetzung zwischen Bruder und Schwester. Laut ORF-Wien-Jahresrückblick 2019 waren die junge Frau und ihre Adoptivschwester nach Wien gereist, um den Bruder im Obdachlosenmilieu zu suchen; im November 2019 wurde der 21-jährige Spanier in eine Anstalt für geistig abnorme Rechtsbrecher eingewiesen.":
      "Crime at Vienna's main railway station during an altercation between brother and sister. According to the ORF Vienna review of 2019, the young woman and her adoptive sister had travelled to Vienna to look for their brother in the homeless scene; in November 2019 the 21-year-old Spaniard was committed to an institution for mentally abnormal offenders.",
    "Streit zwischen Bruder und Schwester; Täter mit Drogen- und psychischen Problemen.":
      "Dispute between brother and sister; perpetrator with drug and mental-health problems.",
    // 2019-05
    "Wien-Hietzing (13. Bezirk)":
      "Vienna-Hietzing (13th district)",
    "Österreich (Kontext, laut AÖF)":
      "Austria (context, according to AÖF)",
    "Unklar; Prozessausgang nicht recherchiert":
      "Unclear; outcome of the trial not researched",
    "Leiche in einer Wohnung gefunden; der Ex-Partner lebte in der Nachbarwohnung. Laut AÖF Kontext: Alkoholprobleme. Der Standard berichtete zwischenzeitlich 'ohne Fremdverschulden' — die AÖF führte den Fall dennoch als mutmaßlichen Femizid. Laut ORF Wien (6.2.2019) war die 39-Jährige 'offenbar ermordet' worden: Sie wurde am 3.2.2019 in verwestem Zustand in ihrer Wohnung in einem Gemeindebau in der Veitingergasse (Hietzing) gefunden; das mutmaßliche Todesdatum (16.1.) folgt der AÖF-Liste.":
      "Body found in a flat; the ex-partner lived in the neighbouring flat. According to AÖF, context: alcohol problems. Der Standard reported in the meantime 'no third-party involvement' — AÖF nevertheless listed the case as a suspected femicide. According to ORF Vienna (6 February 2019), the 39-year-old had 'apparently been murdered': she was found in a decomposed state on 3 February 2019 in her flat in a council housing block on Veitingergasse (Hietzing); the presumed date of death (16 January) follows the AÖF list.",
    "Umstände ungeklärt; zeitweise Berichte über natürliche Todesursache, AÖF listet den Fall dennoch.":
      "Circumstances unclear; at times there were reports of a natural cause of death, but AÖF lists the case nevertheless.",
    // 2019-06
    "Tulln (zuletzt Frauenhaus)":
      "Tulln (most recently a women's shelter)",
    "Nordmazedonien":
      "North Macedonia",
    "Festnahme; verurteilt zu lebenslanger Haft, nicht rechtskräftig (Stand Ende 2019)":
      "Arrest; sentenced to life imprisonment, not final (as of end of 2019)",
    "Messer (Stiche in den Halsbereich vor einem Supermarkt)":
      "Knife (stabs to the neck area in front of a supermarket)",
    "Langjährige Partnergewalt; Opfer war ins Frauenhaus geflüchtet":
      "Long-standing intimate-partner violence; the victim had fled to a women's shelter",
    "Landesgericht St. Pölten (plausibel, nicht abschließend verifiziert)":
      "St. Pölten Regional Court (plausible, not conclusively verified)",
    "Lebenslange Haft wegen Mordes, nicht rechtskräftig (Stand Ende 2019)":
      "Life imprisonment for murder, not final (as of end of 2019)",
    "Laut vienna.at misshandelte der Mann das Opfer jahrelang; die Frau war zum Tatzeitpunkt im Frauenhaus untergebracht und wurde vor einem Supermarkt attackiert. Laut ORF-NÖ-Jahresrückblick 2019 war der Täter einschlägig vorbestraft, es bestand ein Betretungsverbot, und er wurde (nicht rechtskräftig, Stand Ende 2019) zu lebenslanger Haft verurteilt; Tatwaffe laut Jahresrückblick ein Dolch.":
      "According to vienna.at, the man had abused the victim for years; at the time of the crime the woman was staying in a women's shelter and was attacked in front of a supermarket. According to the ORF Lower Austria review of 2019, the perpetrator had previous convictions for similar offences, a barring order was in place, and he was sentenced to life imprisonment (not final, as of end of 2019); according to the review of the year, the weapon was a dagger.",
    "Jahrelange Partnergewalt, Opfer im Frauenhaus; Tat als Kontroll-/Racheakt nach Auszug.":
      "Years of intimate-partner violence, victim in a women's shelter; crime as an act of control/revenge after she moved out.",
    // 2019-07
    "Bekannte (weibliche Täterin)":
      "Acquaintance (female perpetrator)",
    "Festnahme; wegen Raubmordes zu lebenslanger Haft verurteilt, nicht rechtskräftig (Stand Ende 2019)":
      "Arrest; sentenced to life imprisonment for robbery-murder, not final (as of end of 2019)",
    "Mit schwerem Gegenstand erschlagen":
      "Beaten to death with a heavy object",
    "Raub (laut Gericht Raubmord); AÖF vermerkte zunächst 'Überfall'":
      "Robbery (robbery-murder according to the court); AÖF initially noted 'robbery attack'",
    "Landesgericht Eisenstadt oder St. Pölten (nicht abschließend verifiziert)":
      "Eisenstadt or St. Pölten Regional Court (not conclusively verified)",
    "Lebenslange Haft wegen Raubmordes, nicht rechtskräftig (Stand Ende 2019)":
      "Life imprisonment for robbery-murder, not final (as of end of 2019)",
    "Pensionistin tot in ihrer Wohnung aufgefunden; AÖF vermerkte zunächst 'Überfall', Täter und Beziehung zum Opfer waren zunächst unbekannt. Laut ORF-NÖ-Jahresrückblick 2019 führten DNA-Spuren zu einer 44-jährigen vorbestraften Bekannten des Opfers, die wegen Raubmordes (nicht rechtskräftig) zu lebenslanger Haft verurteilt wurde. Es handelt sich damit um einen Mord an einer Frau durch eine Täterin; der Fall ist in der AÖF-Liste 2019 enthalten (Nr. 7). Gerichtsort nicht abschließend verifiziert.":
      "Pensioner found dead in her flat; AÖF initially noted 'robbery attack'; the perpetrator and her relationship to the victim were initially unknown. According to the ORF Lower Austria review of 2019, DNA traces led to a 44-year-old acquaintance of the victim with previous convictions, who was sentenced to life imprisonment for robbery-murder (not final). This is therefore the murder of a woman by a female perpetrator; the case is included in the AÖF list for 2019 (no. 7). Place of trial not conclusively verified.",
    "Raubmord durch eine vorbestrafte Bekannte des Opfers; DNA-Spuren führten zur Überführung.":
      "Robbery-murder by an acquaintance of the victim with previous convictions; DNA traces led to her conviction.",
    // 2019-08
    "Wien-Meidling (12. Bezirk)":
      "Vienna-Meidling (12th district)",
    "Bosnien und Herzegowina":
      "Bosnia and Herzegovina",
    "(Ex-)Freund":
      "(Ex-)boyfriend",
    "Suizid nach der Tat; kein Strafverfahren":
      "Suicide after the crime; no criminal proceedings",
    "Schusswaffe (Schüsse auf offener Straße)":
      "Firearm (shots fired in the open street)",
    "Partnergewalt":
      "Intimate-partner violence",
    "Die 48-Jährige wurde vor einem Lokal in Meidling angeschossen (Kopfschuss) und starb später an ihren Verletzungen; laut AÖF Partnergewalt im Beziehungskontext. Laut ORF-Wien-Jahresrückblick 2019 beging der 53-jährige Täter nach der Tat Suizid; das Motiv dürfte Eifersucht gewesen sein. Diskrepanz bei der Herkunft: AÖF nennt für Opfer und Täter Bosnien, ORF beschreibt den Täter als Bosnier und das Opfer als Serbin.":
      "The 48-year-old was shot (shot to the head) outside a bar in Meidling and later died of her injuries; according to AÖF, intimate-partner violence in the context of a relationship. According to the ORF Vienna review of 2019, the 53-year-old perpetrator took his own life after the crime; the motive was probably jealousy. Discrepancy regarding origin: AÖF gives Bosnia for victim and perpetrator, ORF describes the perpetrator as Bosnian and the victim as Serbian.",
    "Beziehungstat mit Vorgeschichte von Partnergewalt; Schüsse auf offener Straße.":
      "Intimate-partner killing with a history of intimate-partner violence; shots fired in the open street.",
    // 2019-09
    "Enkel":
      "Grandson",
    "Festnahme (Tatverdacht); verurteilt zu 20 Jahren Haft und Einweisung, nicht rechtskräftig (Stand Ende 2019)":
      "Arrest (on suspicion); sentenced to 20 years' imprisonment and committal, not final (as of end of 2019)",
    "Massive Gewalteinwirkung gegen den Kopf und Messerstiche":
      "Massive blunt force to the head and knife stabs",
    "Landesgericht Wiener Neustadt (plausibel, nicht abschließend verifiziert)":
      "Wiener Neustadt Regional Court (plausible, not conclusively verified)",
    "20 Jahre Haft und Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher, nicht rechtskräftig (Stand Ende 2019)":
      "20 years' imprisonment and committal to an institution for mentally abnormal offenders, not final (as of end of 2019)",
    "Tat im Wohnhaus der Pensionistin; der Enkel galt laut AÖF als psychisch auffällig und mit Drogenproblemen. Laut ORF-NÖ-Jahresrückblick 2019 soll der Enkel seine Großmutter mehrmals geschlagen, gewürgt und sechsmal auf sie eingestochen haben; er wurde zu 20 Jahren Haft und einer Einweisung verurteilt (nicht rechtskräftig, Stand Ende 2019). Der Jahresrückblick bezeichnet ihn als 29-jährig (AÖF: 28).":
      "Crime in the pensioner's house; according to AÖF, the grandson was considered mentally disturbed and had drug problems. According to the ORF Lower Austria review of 2019, the grandson is alleged to have hit his grandmother several times, choked her and stabbed her six times; he was sentenced to 20 years' imprisonment and committal (not final, as of end of 2019). The review of the year gives his age as 29 (AÖF: 28).",
    "Enkel unter Tatverdacht; psychische Auffälligkeit und Drogenprobleme berichtet, Motiv nicht öffentlich geklärt.":
      "Grandson under suspicion; mental disturbance and drug problems reported, motive not publicly established.",
    // 2019-10
    "Österreich (Kärnten)":
      "Austria (Carinthia)",
    "Sohn":
      "Son",
    "Festnahme; Prozessausgang nicht recherchiert":
      "Arrest; outcome of the trial not researched",
    "Mit Holzschemel geschlagen (massive Kopfverletzungen)":
      "Beaten with a wooden stool (massive head injuries)",
    "Familiäre Gewalt; Täter war bereits weggewiesen bzw. wegen fortgesetzter Gewaltausübung in Haft gewesen":
      "Domestic violence; the perpetrator had already been subject to a barring order and had been in prison for continued violence",
    "Der 21-jährige Sohn erschlug seine Mutter im Wohnhaus; er war zuvor bereits aus der Wohnung weggewiesen worden und wegen fortgesetzter Gewaltausübung in Haft gewesen.":
      "The 21-year-old son beat his mother to death in the house; he had previously been barred from the flat and had been in prison for continued violence.",
    "Familiäre Gewalt mit Vorgeschichte (Wegweisung, Haft wegen fortgesetzter Gewaltausübung).":
      "Domestic violence with a history (barring order, imprisonment for continued violence).",
    // 2019-23
    "Amstetten (Stadtteil Greinsfurth)":
      "Amstetten (Greinsfurth district)",
    "Österreich (Oberösterreich)":
      "Austria (Upper Austria)",
    "Unbekannt (kein Naheverhältnis berichtet)":
      "Unknown (no close relationship reported)",
    "Deutschland":
      "Germany",
    "Festnahme (31.7.2019); verurteilt zu lebenslanger Haft, nicht rechtskräftig (Stand September 2020)":
      "Arrest (31 July 2019); sentenced to life imprisonment, not final (as of September 2020)",
    "Motiv im Prozess offen geblieben; Anklage wegen Mordes und schweren Raubs; mutmaßliche Geldnot des Täters":
      "Motive remained unclear at trial; charged with murder and aggravated robbery; perpetrator allegedly short of money",
    "Lebenslange Haft wegen Mordes und schweren Raubs (einstimmig), nicht rechtskräftig (Nichtigkeitsbeschwerde und Strafberufung angemeldet)":
      "Life imprisonment for murder and aggravated robbery (unanimous), not final (plea of nullity and appeal against sentence lodged)",
    "Nicht in der AÖF-Medienliste 2019 enthalten (diese umfasst nur Taten durch (Ex-)Partner, Familienmitglieder oder Personen mit Naheverhältnis); ergänzt auf Basis von Medienberichten im Kontext der BKA-Gesamtzahl von 39 Morden an Frauen 2019. Die 52-jährige Supermarktangestellte aus Oberösterreich wurde laut Ermittlern am 28.5.2019 gegen 20:30 Uhr getötet; ihre Leiche wurde am selben Abend in einem Gebüsch neben dem Parkplatz des Einkaufszentrums WestSide City gefunden. Der zuletzt obdachlose deutsche Staatsbürger wurde rund zwei Monate später festgenommen; bei ihm wurde das Handy des Opfers gefunden, DNA-Spuren belasteten ihn. Er bestritt die Tat ('Das ist eine Lüge'). Genaues Tötungsdelikt/Todesursache in den berichteten Quellen nicht genannt; Gericht wertete das Vorgehen als 'besonders heimtückisch' und die Tat als 'bestialisch'. Täter zum Tatzeitpunkt 39, bei Verurteilung 40 Jahre alt.":
      "Not included in the AÖF media list for 2019 (which only covers crimes by (ex-)partners, family members or persons in a close relationship); added on the basis of media reports in the context of the Federal Criminal Police Office (BKA) total of 39 murders of women in 2019. According to investigators, the 52-year-old supermarket employee from Upper Austria was killed on 28 May 2019 at around 20:30; her body was found the same evening in bushes next to the car park of the WestSide City shopping centre. The German citizen, most recently homeless, was arrested about two months later; the victim's mobile phone was found on him and DNA traces incriminated him. He denied the crime ('That is a lie'). The exact type of homicide/cause of death is not given in the reported sources; the court considered the conduct 'particularly treacherous' and the crime 'bestial'. Perpetrator aged 39 at the time of the crime and 40 when sentenced.",
    "Verurteilung wegen Mordes und schweren Raubs; konkretes Motiv blieb auch im Prozess offen, mutmaßlich Geldnot.":
      "Convicted of murder and aggravated robbery; the specific motive remained unclear even at trial, presumably lack of money.",
    // 2019-11
    "Verbaler Streit zuvor; laut AÖF Partnergewalt-Kontext":
      "Verbal argument beforehand; according to AÖF, a context of intimate-partner violence",
    "Der 79-Jährige erschoss seine Ehefrau und danach sich selbst; kein Strafverfahren wegen Tod des Täters.":
      "The 79-year-old shot his wife and then himself; no criminal proceedings because of the perpetrator's death.",
    "Ehekonflikt, Streit vor der Tat; anschließender Suizid des Täters.":
      "Marital conflict, argument before the crime; subsequent suicide of the perpetrator.",
    // 2019-24
    "Suizid (Mord-Suizid); kein Strafverfahren":
      "Suicide (murder-suicide); no criminal proceedings",
    "Pkw auf einem Bahnübergang von einem Güterzug erfasst (vorsätzlich herbeigeführt; Mord-Suizid)":
      "Car hit by a freight train on a level crossing (deliberately caused; murder-suicide)",
    "Häusliche Gewalt mit Vorgeschichte; die Frau hatte zwei Tage vor der Tat Anzeige erstattet und darin extreme Formen häuslicher Gewalt beschrieben":
      "Domestic violence with a history; two days before the crime the woman had filed a complaint with the police describing extreme forms of domestic violence",
    "Nicht in der AÖF-Medienliste 2019 enthalten; ergänzt auf Basis von Medienberichten und der IKF-Studie 'Untersuchung Frauenmorde' (2023). In den Medien zunächst als tragischer Unfall berichtet; die IKF-Aktenanalyse (Fall 69) stuft den Vorfall unter Berücksichtigung der Vorgeschichte als vorsätzlichen Mord mit anschließendem Suizid ein: Zwei Tage vor der Tat hatte die Frau Anzeige gegen ihren Mann erstattet. Das Paar hinterlässt ein Kind. Opfer- und Täternamen wurden von oe24 berichtet (Vorname bzw. abgekürzt).":
      "Not included in the AÖF media list for 2019; added on the basis of media reports and the IKF study 'Untersuchung Frauenmorde' (2023). Initially reported in the media as a tragic accident; taking the history into account, the IKF file analysis (case 69) classifies the incident as deliberate murder followed by suicide: two days before the crime the woman had filed a complaint against her husband. The couple leave behind a child. The names of the victim and the perpetrator were reported by oe24 (first name or abbreviated).",
    "Mord-Suizid nach Anzeige der Ehefrau wegen extremer häuslicher Gewalt (IKF-Aktenanalyse, Fall 69).":
      "Murder-suicide after the wife had reported extreme domestic violence to the police (IKF file analysis, case 69).",
    // 2019-12
    "Armenien":
      "Armenia",
    "Lebensgefährte":
      "Live-in partner",
    "Eifersucht, männliches Anspruchsdenken (laut AÖF); Partnergewalt":
      "Jealousy, male sense of entitlement (according to AÖF); intimate-partner violence",
    "Die 21-Jährige wurde schwer verletzt in der Wohnung gefunden und starb im Krankenhaus. Tatwaffe in den recherchierten Berichten nicht genannt.":
      "The 21-year-old was found seriously injured in the flat and died in hospital. Weapon not named in the reports researched.",
    "Eifersucht und Anspruchsdenken; Partnergewalt-Vorgeschichte.":
      "Jealousy and sense of entitlement; history of intimate-partner violence.",
    // 2019-13
    "Einlieferung; jugendstrafrechtliches Verfahren, Ausgang nicht öffentlich":
      "Taken into custody; juvenile criminal proceedings, outcome not public",
    "Messer (erstochen)":
      "Knife (stabbed to death)",
    "Familiäre Gewalt; Familie war in Betreuung der Jugendfürsorge":
      "Domestic violence; the family was under the care of the youth welfare services",
    "Der 14-jährige Sohn soll seine 55-jährige Mutter erstochen haben; wegen des Jugendalters des Täters wurde nicht öffentlich über ein Verfahren berichtet.":
      "The 14-year-old son is alleged to have stabbed his 55-year-old mother to death; because of the perpetrator's young age, no public reporting on proceedings took place.",
    "Familiäre Gewalt; Familie in Betreuung der Jugendfürsorge; Täter minderjährig (14).":
      "Domestic violence; family under the care of the youth welfare services; perpetrator a minor (14).",
    // 2019-25
    "Kein Naheverhältnis (Opfer dem Täter unbekannt)":
      "No close relationship (victim unknown to the perpetrator)",
    "Rumänien":
      "Romania",
    "Festnahme am Tatort, geständig; verurteilt zu lebenslanger Haft und Einweisung (Juni 2020)":
      "Arrested at the scene, confessed; sentenced to life imprisonment and committal (June 2020)",
    "Messer (zwölf Stich- und Schnittverletzungen im Hals-, Nacken- und Rückenbereich, Angriff von hinten auf offener Straße)":
      "Knife (twelve stab and cut wounds to the throat, neck and back; attacked from behind in the open street)",
    "Rache nach Kündigung: Der Täter hatte Tage zuvor seinen Kurzzeit-Job auf einem Pferdegestüt verloren; der Angriff galt laut seiner Einvernahme bzw. laut IKF-Aktenanalyse der Ehefrau des früheren Vorgesetzten ('stellvertretende Rache'); Täter sprach von Verwechslung":
      "Revenge after dismissal: days earlier the perpetrator had lost his short-term job at a stud farm; according to his police interview and the IKF file analysis, the attack was aimed at the wife of his former supervisor ('vicarious revenge'); the perpetrator spoke of mistaken identity",
    "Lebenslange Haft wegen Mordes und Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher (Prozessbeginn 9.3.2020)":
      "Life imprisonment for murder and committal to an institution for mentally abnormal offenders (trial began on 9 March 2020)",
    "Nicht in der AÖF-Medienliste 2019 enthalten; ergänzt auf Basis von Medienberichten im Kontext der BKA-Gesamtzahl. Die 83-jährige Pensionistin wurde am 16.8.2019 gegen 13 Uhr nahe der Baustelle des Schulzentrums attackiert und starb an ihren Verletzungen; mehrere Zeugen. Der Täter leistete bei der Festnahme keinen Widerstand. Laut IKF-Studie (Fall 84) hatte er zwei Tage in einem Reitstall gearbeitet und plante aus Wut über die Nichtübernahme die Ermordung der Ehefrau seines früheren Vorgesetzten; die IKF wertet den Fall als Femizid ('Ersatzobjekt'). Bei der Verurteilung (23.6.2020) wurde der Täter als 39-jährig bezeichnet.":
      "Not included in the AÖF media list for 2019; added on the basis of media reports in the context of the BKA total. The 83-year-old pensioner was attacked on 16 August 2019 at around 13:00 near the building site of the school centre and died of her injuries; several witnesses. The perpetrator did not resist arrest. According to the IKF study (case 84), he had worked at a riding stable for two days and, angry at not being kept on, planned to murder the wife of his former supervisor; the IKF classifies the case as a femicide ('substitute object'). At sentencing (23 June 2020) the perpetrator's age was given as 39.",
    "Stellvertretende Rache am früheren Arbeitgeber nach Jobverlust; Opfer war dem Täter unbekannt und wurde nach dessen Angaben verwechselt.":
      "Vicarious revenge on his former employer after losing his job; the victim was unknown to the perpetrator and, according to him, was mistaken for someone else.",
    // 2019-14
    "Feffernitz (Gemeinde Paternion)":
      "Feffernitz (municipality of Paternion)",
    "Ex-Geliebter (Vater des ungeborenen Kindes)":
      "Former lover (father of the unborn child)",
    "Verurteilt zu lebenslanger Haft (2020); Wiederaufnahme des Verfahrens 2026 im Gespräch":
      "Sentenced to life imprisonment (2020); reopening of the case under discussion in 2026",
    "Erschlagen und in der Badewanne ertränkt":
      "Beaten to death and drowned in the bathtub",
    "Mutmaßlich ungewollte Schwangerschaft; Opfer war hochschwanger und dreifache Mutter":
      "Presumably an unwanted pregnancy; the victim was heavily pregnant and a mother of three",
    "Landesgericht Klagenfurt (Geschworene)":
      "Klagenfurt Regional Court (jury)",
    "Lebenslange Haft wegen Mordes":
      "Life imprisonment for murder",
    "Die hochschwangere 31-Jährige wurde erschlagen und in der gefüllten Badewanne ertränkt; der Ex-Geliebte bestritt die Tat, eine neue DNA-Spur führte zur Anklage. 2026 berichteten Medien über eine mögliche Wiederaufnahme des Verfahrens.":
      "The heavily pregnant 31-year-old was beaten to death and drowned in the filled bathtub; her former lover denied the crime, and a new DNA trace led to the indictment. In 2026 the media reported on a possible reopening of the case.",
    "Tötung der hochschwangeren Ex-Geliebten; mutmaßliches Motiv war die Schwangerschaft (ungeborenes gemeinsames Kind).":
      "Killing of his heavily pregnant former lover; the presumed motive was the pregnancy (unborn child of both).",
    // 2019-15
    "Naheverhältnis (genauer nicht geklärt)":
      "Close relationship (not further established)",
    "U-Haft; Prozessausgang nicht recherchiert":
      "Pre-trial detention; outcome of the trial not researched",
    "Die 54-Jährige wurde tot in einer Wohnung aufgefunden; laut AÖF bestand ein Naheverhältnis zum 57-jährigen Tatverdächtigen, Kontext 'Alkoholikerszene'.":
      "The 54-year-old was found dead in a flat; according to AÖF, she had a close relationship with the 57-year-old suspect, context: 'alcoholic scene'.",
    "Umstände und Motiv nicht öffentlich geklärt; Naheverhältnis, Alkoholkontext.":
      "Circumstances and motive not publicly established; close relationship, alcohol context.",
    // 2019-26
    "Bankberater/Vermögensberater des Opfers":
      "The victim's bank adviser/financial adviser",
    "Flucht nach der Tat; von Lkw auf der Südautobahn erfasst und schwer verletzt (künstlicher Tiefschlaf); geständig; verurteilt zu 16 Jahren Haft (Juli 2020)":
      "Fled after the crime; hit by a lorry on the Südautobahn (A2) and seriously injured (induced coma); confessed; sentenced to 16 years' imprisonment (July 2020)",
    "Mit Frischhaltefolie (Plastikfolie) erstickt, im Einfamilienhaus des Opfers":
      "Suffocated with cling film (plastic film) in the victim's detached house",
    "Motiv nicht geklärt; Medien berichteten den Verdacht, die Kundin habe bemerkt, dass Geld aus ihrem vom Täter verwalteten Vermögen fehlte, und ihn zur Rede gestellt bzw. mit Anzeige gedroht":
      "Motive not established; the media reported the suspicion that the client had noticed money missing from the assets managed by the perpetrator and had confronted him or threatened to report him to the police",
    "16 Jahre Haft wegen Mordes (Geschworenen-Urteil einstimmig)":
      "16 years' imprisonment for murder (unanimous jury verdict)",
    "Nicht in der AÖF-Medienliste 2019 enthalten; ergänzt auf Basis von Medienberichten im Kontext der BKA-Gesamtzahl. Die frühere Baumeisterin Emma Sch. wurde am 16.9.2019 (Montagabend) getötet; dringend tatverdächtig war ihr Bank- bzw. Vermögensberater, der ihr Vermögen (inkl. mehrerer Immobilien) verwaltete. Alter des Opfers in den Quellen uneinheitlich: 85 (ORF, Krone zur Tatzeit) bzw. 86 (Krone zum Urteil).":
      "Not included in the AÖF media list for 2019; added on the basis of media reports in the context of the BKA total. The former master builder Emma Sch. was killed on 16 September 2019 (Monday evening); the prime suspect was her bank/financial adviser, who managed her assets (including several properties). The victim's age differs between sources: 85 (ORF, Krone at the time of the crime) or 86 (Krone at the verdict).",
    "Verdacht auf Geld-/Veruntreuungsmotiv (Opfer ließ Vermögen vom Täter verwalten); Motiv gerichtlich nicht abschließend geklärt.":
      "Suspected money/embezzlement motive (the victim had the perpetrator manage her assets); motive not conclusively established by the court.",
    "Emma Sch. (85, Gesicht verpixelt) – Bildmontage mit dem abgesperrten Tatort in Edlitz und einer Gedenkkerze":
      "Emma Sch. (85, face pixelated) – photomontage with the cordoned-off crime scene in Edlitz and a memorial candle",
    // 2019-16
    "Wien-Wieden (4. Bezirk)":
      "Vienna-Wieden (4th district)",
    "Mit Holzlatte erschlagen":
      "Beaten to death with a wooden slat",
    "Eifersucht (angegebenes Motiv); laut AÖF vermutlich patriarchales Anspruchsdenken":
      "Jealousy (stated motive); according to AÖF, presumably a patriarchal sense of entitlement",
    "Der Ehemann erschlug seine 32-jährige Frau mit einer Holzlatte; angegebenes Motiv Eifersucht.":
      "The husband beat his 32-year-old wife to death with a wooden slat; stated motive: jealousy.",
    "Angegebenes Motiv Eifersucht; AÖF vermutet patriarchales Anspruchsdenken.":
      "Stated motive jealousy; AÖF suspects a patriarchal sense of entitlement.",
    // 2019-17
    "Österreich (Kitzbühel)":
      "Austria (Kitzbühel)",
    "Stellte sich der Polizei, geständig; verurteilt zu lebenslanger Haft":
      "Turned himself in to the police, confessed; sentenced to life imprisonment",
    "Schusswaffe (9-mm-Pistole des Bruders, zwei Kopfschüsse)":
      "Firearm (his brother's 9 mm pistol, two shots to the head)",
    "Eifersucht/Zurückweisung: Opfer hatte sich Ende Juli 2019 nach fünfjähriger Beziehung getrennt":
      "Jealousy/rejection: the victim had ended a five-year relationship at the end of July 2019",
    "Landesgericht Innsbruck (Geschworene)":
      "Innsbruck Regional Court (jury)",
    "Lebenslange Haft wegen fünffachen Mordes (einstimmig)":
      "Life imprisonment for five murders (unanimous)",
    "Fünffachmord von Kitzbühel: Andreas E. erschoss am 6.10.2019 gegen 5:30 Uhr seine Ex-Freundin Nadine H. (19), deren Vater, Mutter (51, Fall 2019-18) und Bruder (25) sowie deren neuen Freund, den Eishockeytorwart Florian Janny. Die männlichen Opfer sind nicht Teil dieser Datenbank. Tatwaffe gehörte dem Bruder des Täters; insgesamt 13 Schüsse. Täter stellte sich um 6 Uhr selbst.":
      "Kitzbühel quintuple murder: on 6 October 2019 at around 5:30, Andreas E. shot dead his ex-girlfriend Nadine H. (19), her father, her mother (51, case 2019-18) and her brother (25), as well as her new boyfriend, the ice hockey goalkeeper Florian Janny. The male victims are not part of this database. The weapon belonged to the perpetrator's brother; 13 shots in total. The perpetrator turned himself in at 6:00.",
    "Trennung Ende Juli 2019, neue Beziehung des Opfers; Eifersuchtsmotiv gerichtlich festgestellt; zurechnungsfähig (allenfalls alkoholbedingt enthemmt).":
      "Separation at the end of July 2019, new relationship of the victim; jealousy established by the court as the motive; criminally responsible (at most disinhibited by alcohol).",
    // 2019-18
    "Ex-Freund der Tochter":
      "The daughter's ex-boyfriend",
    "Schusswaffe (9-mm-Pistole, Schuss in den Kopf)":
      "Firearm (9 mm pistol, shot to the head)",
    "Zweitopfer: Mutter der Ex-Freundin; Tatmotiv Eifersucht/Zurückweisung (siehe Fall 2019-17)":
      "Second victim: mother of the ex-girlfriend; motive jealousy/rejection (see case 2019-17)",
    "Zweites weibliches Opfer des Fünffachmords von Kitzbühel (siehe Fall 2019-17): die 51-jährige Mutter der Ex-Freundin, im Elternschlafzimmer erschossen.":
      "Second female victim of the Kitzbühel quintuple murder (see case 2019-17): the 51-year-old mother of the ex-girlfriend, shot dead in the parents' bedroom.",
    "Mutter der Ex-Freundin als Zweitopfer der Trennungstat (2019-17).":
      "Mother of the ex-girlfriend as second victim of the separation-related crime (2019-17).",
    // 2019-19
    "Österreich, türkische Herkunft (laut AÖF)":
      "Austria, Turkish origin (according to AÖF)",
    "Festnahme; verurteilt zu lebenslanger Haft, rechtskräftig bestätigt":
      "Arrest; sentenced to life imprisonment, upheld and final",
    "Geplante Trennung und 'rasende Eifersucht' (laut Anklage/Gericht)":
      "Planned separation and 'raging jealousy' (according to the indictment/court)",
    "Lebenslange Haft wegen dreifachen Mordes; Strafberufung zurückgewiesen (rechtskräftig)":
      "Life imprisonment for three murders; appeal against sentence rejected (final)",
    "Dreifachmord von Kottingbrunn: Der 31-Jährige erstach seine 29-jährige Ehefrau und die 2-jährige Tochter (Fall 2019-20); das Baby (Sohn) starb später im Krankenhaus. Das männliche Kleinkind ist nicht Teil dieser Datenbank; die Zählung der AÖF umfasst hier zwei weibliche Opfer.":
      "Kottingbrunn triple murder: the 31-year-old stabbed to death his 29-year-old wife and their 2-year-old daughter (case 2019-20); the baby (a son) later died in hospital. The male infant is not part of this database; the AÖF count here comprises two female victims.",
    "Gericht: geplante Trennung und rasende Eifersucht als Tatmotiv.":
      "Court: planned separation and raging jealousy as the motive.",
    // 2019-20
    "Vater":
      "Father",
    "Zweitopfer der Trennungstat (siehe Fall 2019-19)":
      "Second victim of the separation-related crime (see case 2019-19)",
    "Zweijährige Tochter als zweites weibliches Opfer des Dreifachmords von Kottingbrunn (siehe Fall 2019-19).":
      "Two-year-old daughter as the second female victim of the Kottingbrunn triple murder (see case 2019-19).",
    "Kind als Zweitopfer der Trennungstat des Vaters (2019-19).":
      "Child as second victim of the father's separation-related crime (2019-19).",
    // 2019-21
    "Wien-Favoriten (10. Bezirk)":
      "Vienna-Favoriten (10th district)",
    "Laut AÖF vermutlich patriarchales Anspruchsdenken, genauerer Hintergrund unklar":
      "According to AÖF, presumably a patriarchal sense of entitlement; more detailed background unclear",
    "Der 62-Jährige erstach seine 50-jährige Ehefrau in der gemeinsamen Wohnung; laut heute.at mussten fünf Kinder die Tat mitansehen.":
      "The 62-year-old stabbed his 50-year-old wife to death in their shared flat; according to heute.at, five children had to witness the crime.",
    "Genauerer Hintergrund unklar; AÖF vermutet patriarchales Anspruchsdenken.":
      "More detailed background unclear; AÖF suspects a patriarchal sense of entitlement.",
    // 2019-22
    "Wahrscheinlich Partner (ungeklärt)":
      "Probably partner (not established)",
    "Unklar; laut AÖF vermutlich patriarchales Anspruchsdenken":
      "Unclear; according to AÖF, presumably a patriarchal sense of entitlement",
    "Der 53-Jährige erstach in einer Wohnung in Neudorf bei Staatz (Gemeinde Staatz, Bezirk Mistelbach) eine 48-jährige Frau; das genaue Beziehungsverhältnis blieb öffentlich ungeklärt. Im Nationalrat (6. Sitzung, 11.12.2019) wurde der Fall als 34. Frauenmord des Jahres 2019 bezeichnet; unter Berufung auf BMI-Daten wurde der Täter dort als 'Staatenloser' beschrieben.":
      "The 53-year-old stabbed a 48-year-old woman to death in a flat in Neudorf bei Staatz (municipality of Staatz, Mistelbach district); the exact nature of their relationship remained publicly unclear. In the National Council (6th sitting, 11 December 2019), the case was referred to as the 34th murder of a woman in 2019; citing Interior Ministry (BMI) data, the perpetrator was described there as 'stateless'.",
    "Beziehung und Motiv nicht öffentlich geklärt.":
      "Relationship and motive not publicly established.",
    // 2020-01
    "Österreich (eingebürgert, urspr. Rumänien)":
      "Austria (naturalised, originally Romania)",
    "Festnahme, U-Haft, geständig":
      "Arrest, pre-trial detention, confessed",
    "Messer (mehrere Stiche)":
      "Knife (several stab wounds)",
    "Laut oe24 'schlechte Stimmung'; genaues Motiv nicht öffentlich geklärt":
      "According to oe24, a 'bad atmosphere'; exact motive not publicly established",
    "Tat im gemeinsamen Wohnhaus, laut ORF vor den Augen der zwei gemeinsamen Kinder. AÖF gibt 16.1.2020 als Datum an; NÖN berichtet 'Mittwochabend' (= 15.1.2020). Zum Prozessausgang wurde kein öffentlicher Bericht gefunden.":
      "Crime in the shared house, according to ORF in front of the couple's two children. AÖF gives 16 January 2020 as the date; NÖN reports 'Wednesday evening' (= 15 January 2020). No public report on the outcome of the trial was found.",
    "Motiv nicht öffentlich geklärt; oe24 zitierte 'schlechte Stimmung', Tat im Ehekonflikt vor den gemeinsamen Kindern.":
      "Motive not publicly established; oe24 quoted a 'bad atmosphere', crime in a marital conflict in front of the couple's children.",
    // 2020-02
    "Wien-Floridsdorf (21. Bezirk)":
      "Vienna-Floridsdorf (21st district)",
    "Freund/Partner (Beziehung laut eigenen Angaben seit Ende 2019)":
      "Boyfriend/partner (relationship since the end of 2019, according to his own statement)",
    "Festnahme, U-Haft; verurteilt zu lebenslanger Haft":
      "Arrest, pre-trial detention; sentenced to life imprisonment",
    "Erwürgt/erstickt mit bloßen Händen":
      "Strangled/suffocated with his bare hands",
    "Landesgericht Wien (Geschworene)":
      "Vienna Regional Court (jury)",
    "Lebenslange Freiheitsstrafe wegen Mordes":
      "Life imprisonment for murder",
    "Leiche vom Vater der Frau am 28.1. gefunden; Tat laut Gerichtsmedizin ca. fünf Tage zuvor. Alter des Opfers in Teilen der Berichterstattung (Krone) mit 27 angegeben; Täter zum Prozesszeitpunkt 38. Handy des Opfers in Wohnung des Täters gefunden.":
      "Body found by the woman's father on 28 January; according to forensic medicine, the crime took place about five days earlier. Some reports (Krone) give the victim's age as 27; perpetrator aged 38 at the time of the trial. The victim's mobile phone was found in the perpetrator's flat.",
    "Motiv im Prozess nicht öffentlich berichtet; Beziehungstat (erwürgt), lebenslange Haft.":
      "Motive not publicly reported at trial; intimate-partner killing (strangled), life imprisonment.",
    // 2020-03
    "Afghanistan (Asylwerberin)":
      "Afghanistan (asylum seeker)",
    "Afghanistan (Asylwerber)":
      "Afghanistan (asylum seeker)",
    "Festnahme, geständig; verurteilt zu 20 Jahren Haft":
      "Arrest, confessed; sentenced to 20 years' imprisonment",
    "Eifersucht (laut eigenen Angaben)":
      "Jealousy (according to his own statement)",
    "Landesgericht Leoben (Geschworenensenat)":
      "Leoben Regional Court (jury panel)",
    "20 Jahre Freiheitsstrafe wegen Mordes (zunächst nicht rechtskräftig)":
      "20 years' imprisonment for murder (initially not final)",
    "Tatort Wohnung in Mehrparteienhaus, Tötung im Zuge eines Streits. Täter zum Prozesszeitpunkt 30 Jahre alt. Todesursache/Waffe in den recherchierten Berichten nicht genannt.":
      "Crime scene a flat in an apartment building; killing in the course of an argument. Perpetrator aged 30 at the time of the trial. Cause of death/weapon not named in the reports researched.",
    "Eifersucht laut eigenem Geständnis des Täters im Prozess; 20 Jahre Haft.":
      "Jealousy according to the perpetrator's own confession at trial; 20 years' imprisonment.",
    // 2020-04
    "Graz, Bezirk St. Peter (St. Peter Hauptstraße)":
      "Graz, St. Peter district (St. Peter Hauptstraße)",
    "Graz (Statutarstadt)":
      "Graz (statutory city)",
    "Keine (fremder Zufallsangreifer)":
      "None (random attack by a stranger)",
    "Österreich (Grazer)":
      "Austria (from Graz)",
    "Festnahme, geständig; zurechnungsunfähig, vorläufige Unterbringung in Anstalt für geistig abnorme Rechtsbrecher":
      "Arrest, confessed; not criminally responsible, provisional placement in an institution for mentally abnormal offenders",
    "Messer (Messerattacke auf offener Straße)":
      "Knife (knife attack in the open street)",
    "Kein erkennbares; Täter psychisch krank, am Vortag aus psychiatrischer Klinik entlassen":
      "None discernible; perpetrator mentally ill, discharged from a psychiatric clinic the day before",
    "Zufallsopfer: Die 33-jährige Zahnarztassistentin und zweifache Mutter ging am Gehsteig am Täter vorbei, als dieser ein Messer zückte. Sie starb am 5.2.2020 im Krankenhaus. Passanten überwältigten den Täter. Späteres Unterbringungsverfahren nicht öffentlich berichtet.":
      "Random victim: the 33-year-old dental assistant and mother of two was walking past the perpetrator on the pavement when he pulled out a knife. She died in hospital on 5 February 2020. Passers-by overpowered the perpetrator. Subsequent committal proceedings not publicly reported.",
    "Zufallsangriff ohne Beziehung; Täter psychisch krank, am Vortag aus psychiatrischer Klinik entlassen, zurechnungsunfähig.":
      "Random attack with no relationship; perpetrator mentally ill, discharged from a psychiatric clinic the day before, not criminally responsible.",
    // 2020-05
    "Österreich (vermutl.)":
      "Austria (presumably)",
    "Festnahme, Mordanklage (1.8.2020); verurteilt zu 12 Jahren Haft":
      "Arrest, charged with murder (1 August 2020); sentenced to 12 years' imprisonment",
    "Erdrosselt mit einer Hundeleine":
      "Strangled with a dog lead",
    "Landesgericht Innsbruck":
      "Innsbruck Regional Court",
    "12 Jahre Haft wegen Mordes":
      "12 years' imprisonment for murder",
    "Tatort Reihenhaus/Einfamilienhaus; der Täter lebte nach der Tat fünf Tage im Haus, während die Leiche im Keller lag. Staatsanwaltschaft erhob am 1.8.2020 Mordanklage.":
      "Crime scene a terraced/detached house; after the crime the perpetrator lived in the house for five days while the body lay in the cellar. The public prosecutor's office brought murder charges on 1 August 2020.",
    "Motiv öffentlich nicht geklärt; Ehefrau mit Hundeleine erdrosselt, Täter lebte fünf Tage mit der Leiche im Haus; 12 Jahre.":
      "Motive not publicly established; wife strangled with a dog lead, perpetrator lived in the house with the body for five days; 12 years.",
    // 2020-06
    "Österreich (Steiermark)":
      "Austria (Styria)",
    "Österreich (Oberösterreicher)":
      "Austria (Upper Austrian)",
    "Schusswaffe (Pistole des Täters, drei Schüsse)":
      "Firearm (the perpetrator's pistol, three shots)",
    "Beziehungstat; Opfer hatte sich getrennt und sich gegen den Täter gewehrt (laut Nebenklagevertreter 'Narzissmus', Besitzdenken)":
      "Intimate-partner killing; the victim had separated from the perpetrator and resisted him (according to counsel for the victim's side, 'narcissism', possessiveness)",
    "Landesgericht Graz (Geschworene)":
      "Graz Regional Court (jury)",
    "Lebenslange Haft wegen Mordes und versuchten Mordes am Bruder des Opfers (einstimmig; zunächst nicht rechtskräftig)":
      "Life imprisonment for murder and for the attempted murder of the victim's brother (unanimous; initially not final)",
    "Tat im Einfamilienhaus des Opfers, vor den Augen des Bruders; Täter schoss auch in Richtung des Bruders. Der Täter (Jurist) behauptete im Prozess erstmals nach sieben Monaten U-Haft Notwehr. Alter Täter zum Prozesszeitpunkt 35.":
      "Crime in the victim's detached house, in front of her brother; the perpetrator also fired in the brother's direction. The perpetrator (a lawyer by training) claimed self-defence at trial for the first time after seven months in pre-trial detention. Perpetrator aged 35 at the time of the trial.",
    "Trennungstat; Nebenklagevertreter sprach von 'Narzissmus' und Besitzdenken; Opfer hatte sich getrennt und gewehrt.":
      "Separation-related crime; counsel for the victim's side spoke of 'narcissism' and possessiveness; the victim had separated and resisted.",
    "Der Angeklagte Rene P. (35, Gesicht verpixelt, FFP2-Maske) wird von Justizwachebeamten in den Grazer Schwurgerichtssaal geführt; er wurde wegen Mordes an seiner Ex-Freundin zu lebenslanger Haft verurteilt":
      "The defendant Rene P. (35, face pixelated, FFP2 mask) is led into the Graz jury courtroom by prison officers; he was sentenced to life imprisonment for murdering his ex-girlfriend",
    // 2020-07
    "Festnahme, geständig; schuldunfähig, bedingte Einweisung":
      "Arrest, confessed; not criminally responsible, conditional committal",
    "Schusswaffe (legales Kleinkalibergewehr, zwei Schüsse)":
      "Firearm (legally held small-calibre rifle, two shots)",
    "Laut Ermittlern ständige Vorwürfe der Mutter, der Beschuldigte finde keine Frau und es gebe keinen Hoferben":
      "According to investigators, constant reproaches from his mother that the accused could not find a wife and that there was no heir to the farm",
    "Landesgericht Steyr (Geschworene)":
      "Steyr Regional Court (jury)",
    "Schuldunfähig (Zurechnungsunfähigkeit); bedingte Einweisung mit Facharztkontrollen und Bewährungshelfer":
      "Not criminally responsible (lack of criminal responsibility); conditional committal with specialist medical checks and a probation officer",
    "Der Landwirt rief nach der Tat selbst den Notruf und ließ sich widerstandslos festnehmen. Wenige Stunden vor der Tat war er nach einem auffälligen Vorfall (nackt unterwegs, wollte 'Urlaub in den USA' machen) einem Amtsarzt vorgeführt, aber nicht als Gefahr eingestuft worden.":
      "After the crime the farmer called the emergency number himself and let himself be arrested without resistance. A few hours before the crime, after a conspicuous incident (walking around naked, wanting to go 'on holiday in the USA'), he had been brought before a public health officer but not classified as a danger.",
    "Mutter-Sohn-Konflikt: ständige Vorwürfe der Mutter (keine Frau, kein Hoferbe); Täter schuldunfähig (psychische Erkrankung).":
      "Mother–son conflict: constant reproaches from the mother (no wife, no heir to the farm); perpetrator not criminally responsible (mental illness).",
    "Der Angeklagte (46, von hinten) sitzt im Schwurgerichtssaal des Landesgerichts Steyr dem Senat gegenüber; er wurde als zurechnungsunfähig eingestuft und bedingt eingewiesen":
      "The defendant (46, seen from behind) sits facing the bench in the jury courtroom of Steyr Regional Court; he was found not criminally responsible and conditionally committed",
    // 2020-08
    "Klagenfurt (Statutarstadt)":
      "Klagenfurt (statutory city)",
    "Schusswaffe (Pistole)":
      "Firearm (pistol)",
    "Nicht öffentlich geklärt (erweiterter Suizid; Abschiedsbrief gefunden)":
      "Not publicly established (murder-suicide; farewell letter found)",
    "Der 87-jährige Pensionist erschoss seine 83-jährige Ehefrau und anschließend sich selbst. Polizei fand Abschiedsbrief; Sachlage laut Ermittlern geklärt, keine Obduktion. Kein Strafverfahren wegen Tod des Täters.":
      "The 87-year-old pensioner shot his 83-year-old wife and then himself. Police found a farewell letter; according to investigators the facts were clear, no post-mortem. No criminal proceedings because of the perpetrator's death.",
    "Erweiterter Suizid bei altem Ehepaar (87/81), Abschiedsbrief; Krankheitsmotiv nicht ausdrücklich belegt.":
      "Murder-suicide by an elderly married couple (87/81), farewell letter; illness as a motive not explicitly documented.",
    // 2020-09
    "Suizid nach der Tat (in Tarvis, Italien)":
      "Suicide after the crime (in Tarvisio, Italy)",
    "Schlag gegen den Kopf mit scharfem Gegenstand (laut ORF vermutlich Axt)":
      "Blow to the head with a sharp object (according to ORF, probably an axe)",
    "Nicht endgültig geklärt; Beziehungstat. Täter war mehrfach weggewiesen worden, zuletzt Betretungsverbot am 12.5.2020":
      "Not conclusively established; intimate-partner killing. The perpetrator had been subject to barring orders several times, most recently a barring order on 12 May 2020",
    "Erste von zwei Taten desselben Täters (Doppelmord, siehe Fall 2020-10): Der 63-jährige Pensionist tötete am Vormittag zuerst seine Ehefrau im gemeinsamen Wohnhaus, fuhr dann zum Faaker See und erschoss eine 56-jährige Freundin der Ehefrau, die diese bestärkt haben soll, ihn zu verlassen. Danach flüchtete er nach Tarvis und erschoss sich. Täter war viermal aus dem Haus weggewiesen worden.":
      "First of two crimes by the same perpetrator (double murder, see case 2020-10): in the morning, the 63-year-old pensioner first killed his wife in their shared house, then drove to Lake Faak and shot dead a 56-year-old friend of his wife who is said to have encouraged her to leave him. He then fled to Tarvisio and shot himself. The perpetrator had been barred from the house four times.",
    "Trennungsdynamik: Täter war mehrfach weggewiesen worden, zuletzt Betretungsverbot 12.5.2020; danach erweiterter Suizid.":
      "Separation dynamics: the perpetrator had been subject to barring orders several times, most recently on 12 May 2020; followed by murder-suicide.",
    // 2020-10
    "Drobollach am Faaker See (Gemeinde Finkenstein)":
      "Drobollach am Faaker See (municipality of Finkenstein)",
    "Keine direkte; Opfer war Freundin seiner Ehefrau":
      "None directly; the victim was a friend of his wife",
    "Schusswaffe (auf offener Straße)":
      "Firearm (in the open street)",
    "Opfer soll die Ehefrau des Täters bestärkt haben, ihn zu verlassen":
      "The victim is said to have encouraged the perpetrator's wife to leave him",
    "Zweite Tat des Wernberger Doppelmörders (siehe Fall 2020-09): Die 56-Jährige wurde an ihrem Arbeitsplatz am Faaker See auf offener Straße erschossen; ihre fünfjährige Enkelin musste die Tat mitansehen.":
      "Second crime of the Wernberg double murderer (see case 2020-09): the 56-year-old was shot dead in the open street at her workplace at Lake Faak; her five-year-old granddaughter had to witness the crime.",
    "Zweitopfer desselben Täters (2020-09): Freundin der Ehefrau soll diese zur Trennung bestärkt haben; Rache im Trennungskontext.":
      "Second victim of the same perpetrator (2020-09): the wife's friend is said to have encouraged her to separate; revenge in the context of a separation.",
    // 2020-11
    "Türkei (laut AÖF: 'türkische Community')":
      "Turkey (according to AÖF: 'Turkish community')",
    "Festnahme nach Geständnis; verurteilt zu 20 Jahren Haft":
      "Arrested after confessing; sentenced to 20 years' imprisonment",
    "Gewürgt und mit Polster erstickt; Leiche in den Inn geworfen":
      "Choked and suffocated with a pillow; body thrown into the river Inn",
    "Eskalierender Streit wegen finanzieller Probleme (seit 2018 wiederkehrende heftige Streitigkeiten)":
      "Escalating argument over financial problems (recurring fierce arguments since 2018)",
    "20 Jahre Freiheitsstrafe wegen Mordes (6:2 Stimmen; zunächst nicht rechtskräftig)":
      "20 years' imprisonment for murder (6:2 votes; initially not final)",
    "Täter meldete die Frau zunächst als vermisst und verschickte von ihrem Handy Nachrichten, die einen Suizid vortäuschen sollten; Leiche erst über eine Woche später im Inn gefunden. Täter einschlägig vorbestraft. Todesursächlich war laut Anklage das Ersticken (Polster), nicht das Würgen. Alter Täter zum Prozess 34.":
      "The perpetrator initially reported the woman missing and sent messages from her mobile phone intended to simulate a suicide; the body was found in the Inn only more than a week later. The perpetrator had previous convictions for similar offences. According to the indictment, the cause of death was suffocation (pillow), not the choking. Perpetrator aged 34 at the trial.",
    "Eskalierender Streit wegen finanzieller Probleme (seit 2018 wiederkehrende heftige Auseinandersetzungen).":
      "Escalating argument over financial problems (recurring fierce arguments since 2018).",
    "Der Angeklagte (34, Gesicht verpixelt, FFP2-Maske) wird von Justizwachebeamten in den Innsbrucker Schwurgerichtssaal geführt (Foto: APA/Brigitte Kurzthaler)":
      "The defendant (34, face pixelated, FFP2 mask) is led into the Innsbruck jury courtroom by prison officers (photo: APA/Brigitte Kurzthaler)",
    "Der Angeklagte (von hinten, sitzend) im Schwurgerichtssaal am Landesgericht Innsbruck; er wurde wegen Mordes an seiner Ehefrau zu 20 Jahren Haft verurteilt":
      "The defendant (seen from behind, seated) in the jury courtroom at Innsbruck Regional Court; he was sentenced to 20 years' imprisonment for murdering his wife",
    // 2020-12
    "Österreich (Burgenland)":
      "Austria (Burgenland)",
    "Festnahme nach missglücktem Suizidversuch, geständig, U-Haft; verurteilt zu 17 Jahren Haft":
      "Arrested after a failed suicide attempt, confessed, pre-trial detention; sentenced to 17 years' imprisonment",
    "Küchenmesser (mehrere Schnitte und Stiche)":
      "Kitchen knife (several cuts and stab wounds)",
    "Streit (laut Anklage)":
      "Argument (according to the indictment)",
    "Landesgericht Eisenstadt (Geschworene)":
      "Eisenstadt Regional Court (jury)",
    "17 Jahre Haft wegen Mordes":
      "17 years' imprisonment for murder",
    "Leiche von einer Nachbarin am 15.7.2020 im Haus des Opfers gefunden; Tat laut Berichten bereits am Tag zuvor. Täter wurde verletzt festgenommen (Selbsttötungsversuch). AÖF gibt Alter des Täters mit 'ca. 60' an, Medienberichte mit 56.":
      "Body found by a neighbour in the victim's house on 15 July 2020; according to reports, the crime had taken place the day before. The perpetrator was arrested injured (suicide attempt). AÖF gives the perpetrator's age as 'approx. 60', media reports as 56.",
    "Streit laut Anklage (Mutter-Sohn-Konflikt); Täter verletzt nach missglücktem Suizidversuch festgenommen; 17 Jahre.":
      "Argument according to the indictment (mother–son conflict); perpetrator arrested injured after a failed suicide attempt; 17 years.",
    "Der Angeklagte (56, Gesicht verpixelt und mit schwarzem Balken) mit seiner Verteidigerin Astrid Wagner am Landesgericht Eisenstadt":
      "The defendant (56, face pixelated and with a black bar) with his defence lawyer Astrid Wagner at Eisenstadt Regional Court",
    "Der Angeklagte (verpixelt) mit Justizwachebeamten im Eisenstädter Schwurgerichtssaal; er wurde wegen Mordes an seiner Mutter zu 17 Jahren Haft verurteilt":
      "The defendant (pixelated) with prison officers in the Eisenstadt jury courtroom; he was sentenced to 17 years' imprisonment for murdering his mother",
    // 2020-13
    "Strebersdorf (Gemeinde Lutzmannsburg)":
      "Strebersdorf (municipality of Lutzmannsburg)",
    "Suizid nach der Tat (per Notruf angekündigt)":
      "Suicide after the crime (announced in an emergency call)",
    "Erwürgt":
      "Strangled",
    "Verzweiflung/Überforderung: Frau und Mutter waren Pflegefälle, die er betreute; durch Corona fiel die rumänische Pflegerin aus; laut Familie 'Verzweiflungstat in schwerer depressiver Phase'":
      "Despair/being overwhelmed: his wife and mother needed care, which he provided; because of COVID-19, the Romanian carer was unavailable; according to the family, 'an act of desperation during a severe depressive phase'",
    "Doppelmord: Der 59-Jährige tötete seine Ehefrau (64) und seine Mutter (92) im Haus der Mutter und kündigte danach per Notruf seinen Suizid an. Kein Strafverfahren wegen Tod des Täters.":
      "Double murder: the 59-year-old killed his wife (64) and his mother (92) in his mother's house and then announced his suicide in an emergency call. No criminal proceedings because of the perpetrator's death.",
    "Verzweiflungstat: Ehefrau und Mutter Pflegefälle, Corona-bedingter Ausfall der Pflegerin, laut Familie schwere depressive Phase.":
      "Act of desperation: wife and mother in need of care, carer unavailable because of COVID-19, according to the family a severe depressive phase.",
    // 2020-14
    "Verzweiflung/Überforderung: Mutter und Ehefrau waren Pflegefälle, die er betreute; durch Corona fiel die rumänische Pflegerin aus; laut Familie 'Verzweiflungstat in schwerer depressiver Phase'":
      "Despair/being overwhelmed: his mother and wife needed care, which he provided; because of COVID-19, the Romanian carer was unavailable; according to the family, 'an act of desperation during a severe depressive phase'",
    "Zweites Opfer des Doppelmords von Strebersdorf (siehe Fall 2020-13): die 92-jährige Mutter des Täters; Tatort ihr Haus.":
      "Second victim of the Strebersdorf double murder (see case 2020-13): the perpetrator's 92-year-old mother; the crime scene was her house.",
    "Zweitopfer (92-jährige Mutter) der Verzweiflungstat von Strebersdorf (2020-13); Pflegeüberforderung.":
      "Second victim (92-year-old mother) of the Strebersdorf act of desperation (2020-13); overwhelmed by caring responsibilities.",
    // 2020-15
    "Österreich (vermutl., 'Mühlviertlerin')":
      "Austria (presumably; 'woman from the Mühlviertel')",
    "Österreich (Mühlviertel)":
      "Austria (Mühlviertel)",
    "Lebensgefährte (laut heute.at: Ex-Freund)":
      "Live-in partner (according to heute.at: ex-boyfriend)",
    "Festnahme":
      "Arrest",
    "Gewürgt ('Gewalt gegen den Hals'), Leiche danach mit elektrischer Seilwinde aufgehängt":
      "Choked ('force against the neck'), body then hung up with an electric cable winch",
    "Tatort Hütte in einem Wald. Name des Täters nur abgekürzt (Otto L.) öffentlich berichtet. Zum Prozessausgang wurde kein öffentlicher Bericht gefunden.":
      "Crime scene a hut in a forest. The perpetrator's name was only reported publicly in abbreviated form (Otto L.). No public report on the outcome of the trial was found.",
    "Motiv nicht öffentlich geklärt; Opfer gewürgt und mit Seilwinde aufgehängt; kein Prozessbericht auffindbar.":
      "Motive not publicly established; victim choked and hung up with a cable winch; no trial report found.",
    // 2020-16
    "Österreich (vermutl., 'alteingesessene Familie')":
      "Austria (presumably; 'long-established family')",
    "Österreich (Weinviertel)":
      "Austria (Weinviertel)",
    "Ehemann/Lebensgefährte":
      "Husband/live-in partner",
    "Stellte sich selbst der Polizei, geständig; zurechnungsunfähig, rechtskräftige Einweisung":
      "Turned himself in to the police, confessed; not criminally responsible, committal (final)",
    "Küchenmesser (ca. 15 cm Klinge, zahlreiche Stich- und Schnittwunden im Halsbereich)":
      "Kitchen knife (blade approx. 15 cm, numerous stab and cut wounds to the neck area)",
    "Beziehungstat; Täter laut Gutachten paranoid und dement":
      "Intimate-partner killing; according to an expert report the perpetrator was paranoid and suffering from dementia",
    "Landesgericht Korneuburg (Geschworene)":
      "Korneuburg Regional Court (jury)",
    "Zurechnungsunfähig; Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher (rechtskräftig)":
      "Not criminally responsible; committal to an institution for mentally abnormal offenders (final)",
    "Tat in den frühen Morgenstunden im gemeinsamen Wohnhaus. Täter zum Prozesszeitpunkt 89 Jahre alt. AÖF bezeichnet die Beziehung als 'Lebensgefährtin', ORF/NÖN als Ehefrau.":
      "Crime in the early hours of the morning in the shared house. Perpetrator aged 89 at the time of the trial. AÖF describes the relationship as 'live-in partner', ORF/NÖN as wife.",
    "Beziehungstat im Zustand paranoider Demenz; rechtskräftige Einweisung wegen Zurechnungsunfähigkeit.":
      "Intimate-partner killing in a state of paranoid dementia; final committal on grounds of lack of criminal responsibility.",
    // 2020-17
    "Salzburg (Statutarstadt)":
      "Salzburg (statutory city)",
    "Nachbar":
      "Neighbour",
    "Festnahme im September 2021; verurteilt zu 20 Jahren Haft":
      "Arrested in September 2021; sentenced to 20 years' imprisonment",
    "Messer (28 Stichverletzungen)":
      "Knife (28 stab wounds)",
    "Landesgericht Salzburg (Geschworene)":
      "Salzburg Regional Court (jury)",
    "20 Jahre Haft wegen Mordes":
      "20 years' imprisonment for murder",
    "Die Pensionistin wurde am Sonntag, 30.8.2020, in ihrer Wohnung im Mehrparteienhaus aufgefunden; Tathergang zunächst ungeklärt (AÖF führte den Fall mit 'Täter nicht bekannt'). Der 62-jährige Nachbar wurde erst über ein Jahr später festgenommen und bestritt die Tat (Behauptung 'eingeschleuster DNA').":
      "The pensioner was found in her flat in an apartment building on Sunday, 30 August 2020; how the crime happened was initially unclear (AÖF listed the case with 'perpetrator not known'). The 62-year-old neighbour was arrested only more than a year later and denied the crime (claiming 'planted DNA').",
    "Motiv im Prozess öffentlich nicht geklärt; Nachbar bestritt die Tat ('eingeschleuste DNA'); 20 Jahre.":
      "Motive not publicly established at trial; the neighbour denied the crime ('planted DNA'); 20 years.",
    "Der Angeklagte (62, Gesicht verpixelt) sitzt im Salzburger Schwurgerichtssaal vor dem Senat; er wurde wegen Mordes an seiner 81-jährigen Nachbarin in Maxglan zu 20 Jahren Haft verurteilt":
      "The defendant (62, face pixelated) sits before the bench in the Salzburg jury courtroom; he was sentenced to 20 years' imprisonment for murdering his 81-year-old neighbour in Maxglan",
    // 2020-18
    "Kledering (Gemeinde Schwechat)":
      "Kledering (municipality of Schwechat)",
    "Österreich (Niederösterreich)":
      "Austria (Lower Austria)",
    "Festnahme; zurechnungsunfähig, Einweisung":
      "Arrest; not criminally responsible, committal",
    "Messer (Stichverletzungen)":
      "Knife (stab wounds)",
    "Zurechnungsunfähig; Einweisung in eine Anstalt für geistig abnorme Rechtsbrecher":
      "Not criminally responsible; committal to an institution for mentally abnormal offenders",
    "Tat in der Nacht auf den 23.9.2020 im Einfamilienhaus des Paares; die Frau wurde schwer verletzt in ein Wiener Spital gebracht und erlag dort ihren Verletzungen.":
      "Crime during the night of 22 to 23 September 2020 in the couple's detached house; the woman was taken to a Vienna hospital with serious injuries and died there.",
    "Ehefrau erstochen; Täter zurechnungsunfähig (geistige Abnormität), Einweisung.":
      "Wife stabbed to death; perpetrator not criminally responsible (mental abnormality), committal.",
    // 2020-19
    "Wien-Favoriten (10. Bezirk, Per-Albin-Hansson-Siedlung)":
      "Vienna-Favoriten (10th district, Per-Albin-Hansson-Siedlung)",
    "Freund (genaues Verhältnis polizeilich nicht geklärt)":
      "Friend (exact relationship not established by the police)",
    "Hammer (wuchtige Schläge gegen Kopf und Oberkörper)":
      "Hammer (forceful blows to the head and upper body)",
    "Leichenfund am Abend des 5.10.2020 (AÖF datiert 6.10.); die Wohnungstür stand offenbar seit dem Wochenende offen, Tatzeitpunkt daher unklar. Täter war wegen Gewaltdelikten amtsbekannt (nicht im Zusammenhang mit häuslicher Gewalt). Opfer war in der Tatwohnung nicht gemeldet. Kein Strafverfahren wegen Tod des Täters.":
      "Body found on the evening of 5 October 2020 (AÖF dates it 6 October); the door of the flat had apparently been open since the weekend, so the time of the crime is unclear. The perpetrator was known to the authorities for violent offences (not related to domestic violence). The victim was not registered at the flat where the crime took place. No criminal proceedings because of the perpetrator's death.",
    "Motiv unklar (Täter-Suizid, kein Verfahren); Täter wegen Gewaltdelikten amtsbekannt.":
      "Motive unclear (perpetrator's suicide, no proceedings); perpetrator known to the authorities for violent offences.",
    // 2020-20
    "Wien-Penzing (14. Bezirk)":
      "Vienna-Penzing (14th district)",
    "Wien-Penzing":
      "Vienna-Penzing",
    "Halbbruder ihres Ex-Lebensgefährten":
      "Half-brother of her former live-in partner",
    "Suizid nach der Tat (in seiner Wohnung in Wien-Neubau aufgefunden)":
      "Suicide after the crime (found in his flat in Vienna-Neubau)",
    "Schusswaffe (Schussverletzung im Kopfbereich)":
      "Firearm (gunshot wound to the head)",
    "Die Frau wurde am Sonntag, 1.11.2020 (AÖF datiert 2.11.), von ihrer Mutter und ihrem Ex-Lebensgefährten tot in ihrer Wohnung aufgefunden; am Tatort wurde keine Waffe gefunden. Der mutmaßliche Täter wurde ebenfalls tot aufgefunden. Kein Strafverfahren.":
      "The woman was found dead in her flat by her mother and her former live-in partner on Sunday, 1 November 2020 (AÖF dates it 2 November); no weapon was found at the scene. The suspected perpetrator was also found dead. No criminal proceedings.",
    "Motiv unklar; Täter (Halbbruder des Ex-Lebensgefährten) nach der Tat suizidiert, kein Verfahren.":
      "Motive unclear; perpetrator (half-brother of the former live-in partner) took his own life after the crime, no proceedings.",
    // 2020-21
    "Deutschland (wohnhaft in Dornbirn)":
      "Germany (resident in Dornbirn)",
    "Festnahme, U-Haft; verurteilt zu 20 Jahren Haft":
      "Arrest, pre-trial detention; sentenced to 20 years' imprisonment",
    "Schläge und Tritte gegen Kopf/Gesicht (schwere Kopfverletzungen, irreversible Hirnschädigung)":
      "Blows and kicks to the head/face (severe head injuries, irreversible brain damage)",
    "Eskalierender Streit unter Alkoholeinfluss (Täter 2,1-3,4 Promille); Eifersuchtskonstellation mit anwesender Ex-Freundin":
      "Escalating argument under the influence of alcohol (perpetrator 2.1–3.4 per mille); jealousy constellation with his ex-girlfriend present",
    "Landesgericht Feldkirch (Geschworene)":
      "Feldkirch Regional Court (jury)",
    "20 Jahre Freiheitsstrafe wegen Mordes (5:3 Stimmen; zunächst nicht rechtskräftig); zusätzlich schuldig wegen versuchter schwerer Körperverletzung an seiner Ex-Freundin":
      "20 years' imprisonment for murder (5:3 votes; initially not final); also found guilty of attempted grievous bodily harm against his ex-girlfriend",
    "Tat am 26.11.2020 gegen 22 Uhr im Stiegenhaus eines Hauses in Bregenz; die Frau wurde mit schwersten Verletzungen ins LKH Feldkirch gebracht und starb nach zehn Tagen auf der Intensivstation am 6.12.2020 (AÖF datiert abweichend 16.12.2020). Die ebenfalls verletzte Ex-Freundin des Täters überlebte.":
      "Crime on 26 November 2020 at around 22:00 in the stairwell of a building in Bregenz; the woman was taken to Feldkirch regional hospital (LKH) with the most severe injuries and died in intensive care ten days later, on 6 December 2020 (AÖF gives a different date, 16 December 2020). The perpetrator's ex-girlfriend, who was also injured, survived.",
    "Eskalierender Streit unter schwerem Alkoholeinfluss in Eifersuchtskonstellation mit anwesender Ex-Freundin.":
      "Escalating argument under heavy influence of alcohol in a jealousy constellation with his ex-girlfriend present.",
    "Der gefesselte Angeklagte (37, Kopf nicht im Bild) wird von Justizwachebeamten in den Feldkircher Schwurgerichtssaal geführt; er wurde wegen Mordes an seiner Lebensgefährtin zu 20 Jahren Haft verurteilt":
      "The handcuffed defendant (37, head not in the picture) is led into the Feldkirch jury courtroom by prison officers; he was sentenced to 20 years' imprisonment for murdering his live-in partner",
    // 2020-22
    "Leonding (bei Halbschwester)":
      "Leonding (with her half-sister)",
    "Weitläufiger Verwandter":
      "Distant relative",
    "Spanien":
      "Spain",
    "Festnahme; verurteilt zu lebenslanger Haft":
      "Arrest; sentenced to life imprisonment",
    "Stichverletzungen und Würgemale; zuvor Vergewaltigung":
      "Stab wounds and strangulation marks; raped beforehand",
    "Landesgericht Linz (Geschworene)":
      "Linz Regional Court (jury)",
    "Lebenslange Haft wegen Mordes, Vergewaltigung und zweifachen versuchten Mordes (Verteidigung legte Berufung ein)":
      "Life imprisonment for murder, rape and two counts of attempted murder (the defence appealed)",
    "Das Opfer studierte in Linz und lebte bei ihrer Halbschwester und deren Mann im Haus in Leonding; der Täter versuchte laut Urteil auch, diese beiden Verwandten zu töten. Jede Hilfe kam zu spät.":
      "The victim was studying in Linz and lived with her half-sister and her husband in their house in Leonding; according to the verdict, the perpetrator also tried to kill these two relatives. All help came too late.",
    "Vergewaltigung und Ermordung der Studentin; zudem zweifacher versuchter Mord an deren Verwandten; lebenslang.":
      "Rape and murder of the student; also two counts of attempted murder of her relatives; life imprisonment.",
    "Der Angeklagte (29, von hinten) im Schwurgerichtssaal des Landesgerichts Linz; er wurde wegen Vergewaltigung und Mordes an einer 25-jährigen Studentin zu lebenslanger Haft verurteilt":
      "The defendant (29, seen from behind) in the jury courtroom of Linz Regional Court; he was sentenced to life imprisonment for the rape and murder of a 25-year-old student",
    // 2020-23
    "Längenfeld (Fraktion Burgstein)":
      "Längenfeld (Burgstein hamlet)",
    "Österreich (Ötztal)":
      "Austria (Ötztal)",
    "Festnahme nach drei gescheiterten Suizidversuchen, geständig; verurteilt zu 20 Jahren Haft":
      "Arrested after three failed suicide attempts, confessed; sentenced to 20 years' imprisonment",
    "Erstickt bzw. erwürgt":
      "Suffocated or strangled",
    "Berufliche und private Überforderung, extreme Erschöpfung; geplanter erweiterter Suizid ('wollte die Kinder mit in den Himmel nehmen')":
      "Overwhelmed at work and in private life, extreme exhaustion; planned murder-suicide ('wanted to take the children with him to heaven')",
    "Landesgericht Innsbruck (Schöffensenat)":
      "Innsbruck Regional Court (lay-judge panel)",
    "20 Jahre Haft wegen zweifachen Mordes (eingeschränkte Zurechnungsfähigkeit; zunächst nicht rechtskräftig)":
      "20 years' imprisonment for two murders (diminished responsibility; initially not final)",
    "Der Vater (technischer Zeichner, Rot-Kreuz-Sanitäter) tötete am Vormittag seine beiden Töchter (2 Jahre 9 Monate und 9 Monate), während die Mutter bei der Arbeit war; danach drei gescheiterte Suizidversuche. Laut Gerichtspsychiater Reinhard Haller eingeschränkt zurechnungsfähig. Täter zum Prozesszeitpunkt 29. In der AÖF-Zählung als zwei Fälle (Mädchen) geführt.":
      "In the morning, while the mother was at work, the father (a technical draughtsman and Red Cross paramedic) killed his two daughters (2 years 9 months and 9 months); this was followed by three failed suicide attempts. According to the forensic psychiatrist Reinhard Haller, his criminal responsibility was diminished. Perpetrator aged 29 at the time of the trial. Listed as two cases (girls) in the AÖF count.",
    "Geplanter erweiterter Suizid aus Überforderung/Erschöpfung ('wollte die Kinder mit in den Himmel nehmen'); eingeschränkte Zurechnungsfähigkeit (Gutachten Reinhard Haller).":
      "Planned murder-suicide out of being overwhelmed/exhausted ('wanted to take the children with him to heaven'); diminished responsibility (expert report by Reinhard Haller).",
    "Der Angeklagte (29, mit FFP2-Maske) sitzt neben einem Justizwachebeamten im Innsbrucker Schwurgerichtssaal; er hatte seine beiden Töchter (2 Jahre und 9 Monate) getötet und wurde zu 20 Jahren Haft verurteilt":
      "The defendant (29, wearing an FFP2 mask) sits next to a prison officer in the Innsbruck jury courtroom; he had killed his two daughters (2 years and 9 months) and was sentenced to 20 years' imprisonment",
    "Der Angeklagte (von hinten) im Gerichtssaal am Landesgericht Innsbruck":
      "The defendant (seen from behind) in the courtroom at Innsbruck Regional Court",
    // 2020-24
    "Zweites Opfer des Doppelmords von Längenfeld (siehe Fall 2020-23): die neun Monate alte Tochter (im JSON age=0, da unter 1 Jahr).":
      "Second victim of the Längenfeld double murder (see case 2020-23): the nine-month-old daughter (age=0 in the JSON, as she was under 1 year).",
    "Zweitopfer des erweiterten Suizidversuchs von Längenfeld (2020-23).":
      "Second victim of the attempted murder-suicide in Längenfeld (2020-23).",
    "Der Angeklagte (29, mit FFP2-Maske) im Innsbrucker Schwurgerichtssaal; er hatte seine beiden Töchter getötet (hier: die neun Monate alte Tochter, Fall 2020-24) und wurde zu 20 Jahren Haft verurteilt":
      "The defendant (29, wearing an FFP2 mask) in the Innsbruck jury courtroom; he had killed his two daughters (here: the nine-month-old daughter, case 2020-24) and was sentenced to 20 years' imprisonment"
  };
  for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k)) I.dict[k] = d[k];
  I.keep.push(
    "Amstetten",
    "Krumbach",
    "Neunkirchen",
    "Wiener Neustadt (Anton-Wodica-Park)",
    "Manuela K.",
    "Yazan A.",
    "Wiener Neustadt",
    "oe24.at",
    "heute.at",
    "Tulln an der Donau",
    "Tulln",
    "Ebergassing",
    "Bruck an der Leitha",
    "Grafenbach-Sankt Valentin",
    "Ebenthal",
    "Klagenfurt-Land",
    "Matzen-Raggendorf",
    "Gänserndorf",
    "Neudorf bei Wildon",
    "Nikoleta",
    "Markus L.",
    "Leibnitz",
    "Bludenz",
    "Kirchschlag in der Buckligen Welt",
    "Wiener Neustadt-Land",
    "Gloggnitz",
    "Villach-Land",
    "Feffernitz",
    "St. Veit an der Glan",
    "Edlitz",
    "Emma Sch.",
    "Kosovo",
    "Kitzbühel",
    "Nadine H.",
    "Andreas E.",
    "Kottingbrunn",
    "Baden",
    "Neudorf bei Staatz",
    "Mistelbach",
    "Ybbs an der Donau",
    "Melk",
    "Trieben",
    "Liezen",
    "Graz",
    "Kössen",
    "Großwilfersdorf",
    "Hartberg-Fürstenfeld",
    "Kronstorf",
    "Linz-Land",
    "Salzburger Nachrichten",
    "Klagenfurt-Viktring",
    "Klagenfurt",
    "Wernberg",
    "Imst",
    "NÖN",
    "ORF Tirol",
    "Mühlgraben",
    "Jennersdorf",
    "ORF Burgenland",
    "Oberpullendorf",
    "Strebersdorf",
    "Neustift im Mühlkreis",
    "Otto L.",
    "Rohrbach",
    "Ladendorf",
    "Salzburg-Maxglan",
    "ORF Salzburg",
    "Kledering",
    "Bregenz",
    "Wolfurt",
    "ORF Vorarlberg",
    "Leonding",
    "Honduras",
    "Tips Linz-Land",
    "Längenfeld",
    "BezirksRundSchau"
  );
})(window);
