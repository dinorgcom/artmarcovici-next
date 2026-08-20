// Recherchierte Anmerkungen zu Familiennamen: Herkunft/Bedeutung, bekannte Mitglieder (verlinkt), Abzeichen.
//
// WICHTIG: Das Abzeichen haengt an der PERSON, nicht an der Familie — jeder notable-Eintrag traegt
// sein badge-Feld, und die Familien-Abzeichen werden daraus abgeleitet (app.js: famBadges).
// So kann das Detail-Panel immer sagen, WER das Zeichen traegt.
//   badge: "fighter"   ★ dokumentierte(r) Kaempfer/Kommandeur(in)
//          "medic"     ✚ Sanitaeter-/Medizin-Fall
//          "prisoner"  ⛓ Austausch-Haeftling
//          "official"  ◆ Hamas-Funktionaer
//          "victims"   ● international bekannter Zivilopfer-Fall
//   (mehrere moeglich: badge: ["fighter", "official"])
// Das Journalisten-Abzeichen ✎ kommt automatisch aus dem TfP-Presse-Datensatz
// (Felder p + pn in families.json) und braucht hier keinen Eintrag.
window.FAM_NOTES = {
  "al-najjar": {
    origin: "Berufsname: „der Zimmermann“. Einer der größten Clans im Raum Khan Younis (u. a. Khuza'a).",
    notable: [
      { badge: "medic", name: "Rouzan al-Najjar (21)", info: "freiwillige Sanitäterin, am 1.6.2018 am Grenzzaun erschossen — B'Tselem: gezielt, IDF: Abpraller; weltweites Medienecho",
        url: "https://en.wikipedia.org/wiki/Killing_of_Rouzan_al-Najjar" }
    ]
  },
  "al-masri": {
    origin: "Herkunftsname: „der Ägypter“ — klassischer Orts-/Herkunftsname, stark in Beit Hanoun/Nordgaza.",
    notable: [
      { badge: "fighter", name: "Mohammed Deif (bürgerlich Muhammad Diab Ibrahim al-Masri)", info: "Chef der Qassam-Brigaden und Planer des 7. Oktober; getötet am 13.7.2024 in Khan Younis (der Schlag traf eine humanitäre Zone, ~90 Tote)",
        url: "https://www.washingtonpost.com/world/2024/08/01/hamas-commander-mohammed-deif-killed/" }
    ]
  },
  "al-astal": {
    origin: "Groß-Clan von Khan Younis, teils beduinische Wurzeln.",
    notable: [
      { badge: "official", name: "Yunis al-Astal", info: "Hamas-Abgeordneter und Prediger, berüchtigt für antisemitische Hetzpredigten (MEMRI-Dokumentation)",
        url: "https://en.wikipedia.org/wiki/Yunis_Al_Astal" }
    ]
  },
  "daghmash": {
    origin: "= Doghmush-Clan, Sabra/Tel al-Hawa in Gaza-Stadt — „die Sopranos von Gaza“: Waffenschmuggel, Schutzgeld, Entführungen; traditionell quer zu allen Fraktionen.",
    notable: [
      { badge: "fighter", name: "Mumtaz Dughmush", info: "Gründer der salafistischen „Army of Islam“; beteiligt an der Entführung von Gilad Shalit (2006), Entführung des BBC-Journalisten Alan Johnston (2007)",
        url: "https://en.wikipedia.org/wiki/Mumtaz_Dughmush" },
      { name: "Clan-Führung", info: "Nov 2025: blutiger Machtkampf mit Hamas nach dem israelischen Teilrückzug; Hamas exekutierte einen Clan-Anführer",
        url: "https://en.wikipedia.org/wiki/2025_Hamas%E2%80%93Doghmush_conflict" }
    ]
  },
  "bakr": {
    origin: "Alteingesessener Fischer-Clan am Strand von Gaza-Stadt („Bakr Land“, ~3.000 Mitglieder) — keine 48er-Flüchtlinge, seit Jahrhunderten in Gaza.",
    notable: [
      { badge: "victims", name: "Die vier Bakr-Jungen (9–11)", info: "Ahed, Zakaria, Mohammed und Ismail Bakr, am 16.7.2014 beim Spielen am Strand von der israelischen Marine getötet — vor den Augen der Weltpresse; Verfahren eingestellt",
        url: "https://www.hrw.org/news/2014/07/17/dispatches-explaining-four-dead-boys-gaza-beach" }
    ]
  },
  "al-sinwar": {
    origin: "Familie aus Khan Younis (Flüchtlingsfamilie, Wurzeln in al-Majdal/Aschkelon).",
    notable: [
      { badge: ["fighter", "official"], name: "Jahia Sinwar", info: "Hamas-Chef und Architekt des 7. Oktober, getötet am 16.10.2024 in Rafah",
        url: "https://en.wikipedia.org/wiki/Killing_of_Yahya_Sinwar" },
      { badge: "fighter", name: "Mohammed Sinwar", info: "sein Bruder, militärischer Führer; laut Israel im Mai 2025 in Khan Younis getötet",
        url: "https://www.newsonair.gov.in/hamas-gaza-chief-mohammed-sinwar-killed-in-israeli-air-strike-in-khan-younis" }
    ]
  },
  "issa": {
    origin: "Issa = Jesus/Isa, verbreiteter Eigen- und Familienname.",
    notable: [
      { badge: "fighter", name: "Marwan Issa", info: "Vize-Chef der Qassam-Brigaden („Schattenmann“), im März 2024 durch Luftschlag getötet — ranghöchster Hamas-Militär bis dahin",
        url: "https://www.aljazeera.com/news/2024/3/26/israel-claims-senior-hamas-commander-marwan-issa-killed-in-gaza-strike" },
      { badge: "fighter", name: "Hakam al-Issa", info: "Mitgründer der Qassam-Brigaden, im Krieg getötet",
        url: "https://www.foxnews.com/world/hamas-confirms-five-leaders-killed-including-masked-spokesperson-major-blow-terror-group" },
      { badge: "prisoner", name: "Mahmoud Issa", info: "Hamas-Kommandeur, seit 1993 lebenslang inhaftiert; im Oktober 2025 im Geisel-Austausch freigelassen",
        url: "https://www.timesofisrael.com/israel-frees-nearly-2000-palestinian-prisoners-including-hundreds-of-terror-convicts/" }
    ]
  },
  "al-kahlout": {
    origin: "Großfamilie im Norden Gazas (Jabalia/Beit Lahia).",
    notable: [
      { badge: "fighter", name: "Abu Obeida (bürgerlich Hudhayfa Samir Abdullah al-Kahlout)", info: "der maskierte Sprecher der Qassam-Brigaden; 2025 von Israel getötet, von Hamas bestätigt",
        url: "https://www.foxnews.com/world/hamas-confirms-five-leaders-killed-including-masked-spokesperson-major-blow-terror-group" }
    ]
  },
  "nawfal": {
    origin: "Alter arabischer Stammesname.",
    notable: [
      { badge: "fighter", name: "Ayman Nofal", info: "Mitglied des Obersten Militärrats der Qassam-Brigaden, Kommandeur Zentral-Gaza; getötet am 17.10.2023",
        url: "https://news.yahoo.com/israeli-air-strike-kills-senior-133307899.html" }
    ]
  },
  "ghandour": {
    notable: [
      { badge: "fighter", name: "Ahmed Ghandour", info: "Brigadekommandeur Nord-Gaza der Qassam-Brigaden, getötet im November 2023",
        url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },
  "salama": {
    notable: [
      { badge: "fighter", name: "Rafa'a Salameh", info: "Brigadekommandeur Khan Younis; zusammen mit Mohammed Deif am 13.7.2024 getötet",
        url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },
  "al-hawajri": {
    origin: "Großfamilie im Raum Nuseirat.",
    notable: [
      { badge: "fighter", name: "Haitham al-Hawajri", info: "Kommandeur des Schati-Bataillons der Qassam-Brigaden; im Dez 2023 für tot erklärt, später als lebend bestätigt — Beispiel für die Unsicherheit auch israelischer Angaben",
        url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },
  "saad": {
    notable: [
      { badge: "fighter", name: "Raed Saad", info: "ranghoher Qassam-Kommandeur (Produktion/Generalstab), durch gezielten Schlag getötet",
        url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },
  "shabana": {
    notable: [
      { badge: "fighter", name: "Mohammed Shabanah", info: "Brigadekommandeur Rafah der Qassam-Brigaden",
        url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },
  "al-madhoun": {
    origin: "Großfamilie in Nord-Gaza (Jabalia, Beit Lahia).",
    notable: [
      { badge: "medic", name: "Ahmed al-Madhoun", info: "Sanitäter des Palästinensischen Roten Halbmonds; fuhr am 29.1.2024 mit Yusuf Zeino den Krankenwagen zur eingeschlossenen Hind Rajab — trotz vorheriger Abstimmung wurde der Wagen beschossen, beide starben",
        url: "https://www.washingtonpost.com/world/interactive/2024/hind-rajab-israel-gaza-killing-timeline/" }
    ]
  },
  "rajab": {
    origin: "Vom Monatsnamen Radschab — verbreiteter Ahnenname, keine Ortsherkunft.",
    notable: [
      { badge: "victims", name: "Hind Rajab (5–6 J., Altersangaben variieren)", info: "am 29.1.2024 in Tel al-Hawa im beschossenen Auto ihrer Familie eingeschlossen; ihr über drei Stunden mitgeschnittener Notruf an den Roten Halbmond ging um die Welt. Sechs Angehörige starben sofort, die Bergung fand ihren Leichnam erst zwölf Tage später",
        url: "https://en.wikipedia.org/wiki/Killing_of_Hind_Rajab" }
    ]
  },
  "al-batsh": {
    origin: "Großfamilie im Stadtteil at-Tuffah, Gaza-Stadt.",
    notable: [
      { badge: "victims", name: "18 Angehörige der Familie al-Batsh", info: "am 12.7.2014 traf ein Luftangriff das Haus in at-Tuffah: 18 Tote, darunter sechs Kinder und vier Frauen. Ziel war der Gaza-Polizeichef Tayseer al-Batsh, der als Besucher schwer verletzt überlebte — einer der meistdiskutierten Fälle zur Verhältnismäßigkeit im Krieg 2014",
        url: "https://mezan.org/en/post/42405" }
    ]
  },
  "hijazi": { origin: "Herkunftsname: „aus dem Hedschas“ (Westarabien) — Beispiel für Mikes These der Orts-Familiennamen." },
  "shaheen": { origin: "Persisch-arabisch „Falke“ — verbreiteter Levante-Name, kein Ortsname." },
  "awad":    { origin: "Vom Vornamen 'Awad („Gabe/Ersatz“) — kein Orts-, sondern Ahnenname." },
  "ashour":  { origin: "Vom Vornamen 'Aschur — Ahnenname, kein Ortsname." }
};

// --- Hamas-Funktionaere/Politiker (recherchiert 29.7.2026, alle verlinkt) ---
Object.assign(window.FAM_NOTES, {
  "al-dalis": {
    notable: [
      { badge: "official", name: "Issam al-Da'alis", info: "De-facto-Regierungschef des Gazastreifens (Leiter des Verwaltungskomitees 2021–2025); getötet bei den Angriffen vom 18.3.2025 (Bruch der Waffenruhe)",
        url: "https://en.wikipedia.org/wiki/Issam_al-Da%27alis" }
    ]
  },
  "mushtaha": {
    origin: "Alteingesessene Familie in Gaza-Stadt (Shuja'iyya).",
    notable: [
      { badge: "official", name: "Rawhi Mushtaha", info: "Kopf des Hamas-Regierungsapparats und engster Sinwar-Vertrauter; Tod durch Luftschlag, von der IDF am 3.10.2024 bestätigt",
        url: "https://www.haaretz.com/israel-news/2024-10-03/ty-article/top-hamas-official-rawhi-mushtaha-killed-in-israeli-airstrike-three-months-ago-idf-says/00000192-51b8-d2cc-a5d7-f1bdabf20000" }
    ]
  },
  "al-shanti": {
    notable: [
      { badge: "official", name: "Jamila al-Shanti", info: "erste Frau im Hamas-Politbüro, Witwe von Mitgründer Abdel Aziz al-Rantisi; getötet am 19.10.2023",
        url: "https://en.wikipedia.org/wiki/Jamila_al-Shanti" }
    ]
  },
  "abu shamala": {
    notable: [
      { badge: "official", name: "Jawad Abu Shammala", info: "Hamas-Wirtschaftsminister und Politbüro-Mitglied; getötet im Oktober 2023",
        url: "https://iranprimer.usip.org/blog/2024/aug/01/israeli-assassinations-hamas-leaders" }
    ]
  },
  "muammar": {
    notable: [
      { badge: "official", name: "Zakaria Muammar", info: "hochrangiger Hamas-Politiker (Wirtschaftsressort); getötet im Oktober 2023",
        url: "https://iranprimer.usip.org/blog/2024/aug/01/israeli-assassinations-hamas-leaders" }
    ]
  },
  "siyam": {
    origin: "Großer Gaza-Clan; der Name kommt von „Fasten“ (siyām).",
    notable: [
      { badge: "official", name: "Said Siyam", info: "Hamas-Innenminister und Chef der Sicherheitskräfte; getötet im Januar 2009 (Krieg 2008/09)",
        url: "https://en.wikipedia.org/wiki/Said_Siyam" }
    ]
  },
  "al-siraj": {
    notable: [
      { badge: "official", name: "Sameh al-Siraj", info: "Politbüro-Mitglied (Sicherheitsressort); getötet im selben Schlag wie Rawhi Mushtaha, bestätigt Okt 2024",
        url: "https://www.jpost.com/breaking-news/article-823077" }
    ]
  }
});

// --- Weitere Kommandeure/Funktionaere (Wilson Center Assassinations-Liste + ynet-Uebersicht, 29.7.2026) ---
Object.assign(window.FAM_NOTES, {
  "haniya": {
    origin: "Alteingesessene Flüchtlingsfamilie im Shati-Camp (Wurzeln in al-Jura bei Aschkelon).",
    notable: [
      { badge: "official", name: "Ismail Haniyeh", info: "Chef des Hamas-Politbüros; getötet am 31.7.2024 durch Sprengsatz in Teheran. Drei seiner Söhne und vier Enkel starben bereits am 10.4.2024 bei einem Luftschlag in Gaza",
        url: "https://www.wilsoncenter.org/article/israeli-assassinations-top-hamas-and-hezbollah-officials" }
    ]
  },
  "al-biari": {
    notable: [
      { badge: "fighter", name: "Ibrahim Biari", info: "Kommandeur des Jabaliya-Bataillons und einer der Planer des 7. Oktober; getötet am 31.10.2023 beim Großangriff auf Jabaliya",
        url: "https://www.wilsoncenter.org/article/israeli-assassinations-top-hamas-and-hezbollah-officials" }
    ]
  },
  "aziz": {
    notable: [
      { badge: "fighter", name: "Jaber Aziz", info: "Kommandeur des al-Furqan-Bataillons; getötet am 4.8.2024 beim Schlag auf eine Schule in Gaza-Stadt",
        url: "https://www.wilsoncenter.org/article/israeli-assassinations-top-hamas-and-hezbollah-officials" }
    ]
  },
  "abu daqqa": {
    notable: [
      { badge: "fighter", name: "Samer Ismail Khadr Abu Daqqa", info: "laut IDF Leiter der Hamas-Drohnen-/Lufteinheit und an den Drohnen- und Gleitschirmangriffen des 7. Oktober beteiligt; beim Angriff auf al-Mawasi am 10.9.2024 getötet",
        url: "https://www.idf.il/en/mini-sites/israel-hamas-war-gaza/articles-israel-hamas-war-gaza/distributions-swords-of-iron-war-gaza/southern-gaza/100924-senior-hamas-terrorists-who-were-operating-within-a-command-and-control-center-embedded-inside-the-humanitarian-area-in-khan-yunis/" }
    ]
  },
  "al-haddad": {
    notable: [
      { badge: "fighter", name: "Izz al-Din Haddad", info: "aktueller Chef der Qassam-Brigaden („der Geist von Gaza“) — einziger überlebender Brigadekommandeur des Kriegsbeginns, überstand 6+ Tötungsversuche; lebt",
        url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },
  "al-hayya": {
    notable: [
      { badge: "official", name: "Khalil al-Hayya", info: "Hamas-Chefunterhändler und Politbüro-Leiter für Gaza; lebt im Exil (Doha)",
        url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },
  "baroud": {
    notable: [
      { badge: "fighter", name: "Faez Baroud", info: "ranghoher Militärkommandeur der Qassam-Brigaden; gilt als lebend",
        url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },
  "abu naim": {
    notable: [
      { badge: "official", name: "Tawfiq Abu Naim", info: "Chef des internen Sicherheitsapparats in Gaza (Ex-Häftling, im Shalit-Deal 2011 freigekommen); gilt als lebend",
        url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  }
});
window.FAM_NOTES["al-kahlout"].notable.push(
  { badge: "official", name: "Youssef al-Kahlout", info: "Mitglied der zentralen Hamas-Führung; getötet am 10.8.2024 beim Schlag auf eine Schule in Gaza-Stadt",
    url: "https://www.wilsoncenter.org/article/israeli-assassinations-top-hamas-and-hezbollah-officials" });

// --- Ergaenzungen aus der Mail „Hamas“ (geprueft 20.8.2026) ---
// Nur Namen mit belastbarer Familienzuordnung zur TfP-Liste. Wo die Einstufung
// ausschliesslich auf israelischen Angaben beruht, wird das im Text kenntlich gemacht.
window.FAM_NOTES["al-masri"].notable.push(
  { badge: "fighter", name: "Muhammad Hamdi Ahmad al-Masri", info: "laut IDF Nukhba-Kompaniekommandeur im Beit-Lahia-Bataillon; am 18.8.2026 bei einem Luftangriff im Gebiet al-Shati getötet",
    url: "https://www.israelnationalnews.com/news/431947" });
window.FAM_NOTES["mushtaha"].notable.push(
  { badge: "fighter", name: "Muhammad Bassam Muhammad Mushtaha", info: "laut IDF Kompaniekommandeur im Schati-Bataillon, am 7. Oktober 2023 beteiligt und an der Bewachung mehrerer Geiseln; nach einem Luftangriff vom 30.7.2026 gestorben",
    url: "https://vinnews.com/2026/08/14/idf-eliminates-hamas-company-commander-who-held-multiple-hostages/" });

Object.assign(window.FAM_NOTES, {
  "abu kmeil": {
    notable: [
      { badge: "fighter", name: "Jamal Mahmoud Abu Kamil (auch Abu Kmeil)", info: "laut IDF Hamas-Kommandeur und Teilnehmer des 7. Oktober; am 13.8.2026 in Gaza-Stadt getötet. Die Hamas-geführte Polizei bezeichnete ihn als Polizeichef und bestritt eine weitere Zugehörigkeit",
        url: "https://www.corriere.it/esteri/diretta-live/26_agosto_14/guerra-usa-iran-le-notizie-in-diretta-emirati-arabi-attaccate-due-nostri-navi-nello-stretto-di-hormuz.shtml" }
    ]
  },
  "al-attar": {
    notable: [
      { badge: "fighter", name: "Muhammad Attar", info: "laut IDF Nukhba-Zugführer, beteiligt an Angriffen auf israelische Soldaten; am 18.8.2026 bei einem Luftangriff im Gebiet al-Shati getötet",
        url: "https://www.israelnationalnews.com/news/431947" }
    ]
  },
  "al-shambari": {
    notable: [
      { badge: "fighter", name: "Iyad Ahmed Abd al-Rahman Shambari", info: "laut IDF und Shin Bet Leiter der Operationsabteilung im militärischen Hamas-Geheimdienst und an der Planung des 7. Oktober beteiligt; am 28.4.2026 in Nord-Gaza getötet",
        url: "https://www.timesofisrael.com/idf-says-senior-hamas-intel-operative-who-helped-plan-oct-7-killed-in-gaza-strike/" }
    ]
  },
  "washh": {
    notable: [
      { badge: "fighter", name: "Muhammad Samir Muhammad Washah", info: "laut IDF Funktionär im Hamas-Hauptquartier für Raketen- und Waffenproduktion; arbeitete zugleich für Al Jazeera, das seine Tötung verurteilte; am 8.4.2026 getötet",
        url: "https://www.terrorism-info.org.il/en/spotlight-on-terrorism-april-2026/" }
    ]
  },
  "abu rukba": {
    notable: [
      { badge: "fighter", name: "Muhammad Salah al-Din Khaled Abu Rukba", info: "laut IDF Hamas-Mitglied und Teilnehmer des 7. Oktober; am 5.2.2026 westlich von Beit Lahia getötet. Der vollständige Name steht auch in der MoH-Opferliste",
        url: "https://www.terrorism-info.org.il/en/spotlight-on-terrorism-february-2026/" }
    ]
  },
  "al-abed": {
    notable: [
      { badge: "fighter", name: "Muhammad al-Abed", info: "laut IDF Hamas-Versorgungsoffizier, zuständig für Waffenschmuggel und Schmuggeltunnel; im August 2026 getötet",
        url: "https://www.israelnationalnews.com/flashes/690943" }
    ]
  },
  "al-anqar": {
    notable: [
      { badge: "fighter", name: "Ahmad Ma'in Muhammad Anqar", info: "laut IDF Hamas-Kommandeur; im August 2026 getötet",
        url: "https://www.israelnationalnews.com/flashes/690943" }
    ]
  },
  "tabsh": {
    notable: [
      { badge: "fighter", name: "Osama Tabesh", info: "laut IDF Leiter der Beobachtungs- und Zielabteilung des militärischen Hamas-Geheimdienstes; beim Angriff auf al-Mawasi am 10.9.2024 getroffen",
        url: "https://www.timesofisrael.com/liveblog_entry/idf-says-gaza-strike-targeted-3-senior-hamas-officials-disputes-claimed-death-toll/" }
    ]
  },
  "al-mabhouh": {
    notable: [
      { badge: "fighter", name: "Ayman Mabhouh", info: "von der IDF als ranghoher Hamas-Angehöriger bezeichnet; beim Angriff auf al-Mawasi am 10.9.2024 getroffen",
        url: "https://www.timesofisrael.com/liveblog_entry/idf-says-gaza-strike-targeted-3-senior-hamas-officials-disputes-claimed-death-toll/" }
    ]
  },
  "thabet": {
    notable: [
      { badge: "fighter", name: "Raad Thabet", info: "laut IDF einer der zehn ranghöchsten Hamas-Militärs und Leiter für Rekrutierung und Beschaffung; am 28.3.2024 im al-Schifa-Krankenhaus getötet",
        url: "https://www.timesofisrael.com/troops-raiding-gazas-shifa-hospital-kill-senior-hamas-commander-idf-says/" }
    ]
  },
  "dalloul": {
    notable: [
      { badge: "fighter", name: "Ammar Daloul", info: "laut IDF Abteilungsleiter im Hamas-Hauptquartier für Waffenproduktion; im Dezember 2024 bei einem Luftangriff auf ein als Kommandozentrum genutztes Schulgebäude getötet",
        url: "https://www.idf.il/en/mini-sites/israel-hamas-war-gaza/articles-israel-hamas-war-gaza/distributions-swords-of-iron-war-gaza/northern-gaza-24/121224-eliminated-a-department-head-in-hamas-manufacturing-headquarters-and-a-company-commander-in-the-zeitoun-battalion/" }
    ]
  },
  "yassin": {
    notable: [
      { badge: "fighter", name: "Jihad Yassin", info: "laut IDF Kompaniekommandeur im Zeitoun-Bataillon und verantwortlich für Angriffe auf israelische Soldaten; im Dezember 2024 beim selben Luftangriff wie Ammar Daloul getötet",
        url: "https://www.idf.il/en/mini-sites/israel-hamas-war-gaza/articles-israel-hamas-war-gaza/distributions-swords-of-iron-war-gaza/northern-gaza-24/121224-eliminated-a-department-head-in-hamas-manufacturing-headquarters-and-a-company-commander-in-the-zeitoun-battalion/" }
    ]
  }
});

// Zweite, vollstaendige Auswertung derselben Mail: weitere eindeutige Personen,
// deren Familienname in der Gaza-Familienliste tatsaechlich vorkommt. Personen
// ausserhalb Gazas und Austausch-Haeftlinge werden im Infotext klar bezeichnet.
[
  ["arouri", { badge: "official", name: "Saleh al-Arouri", info: "stellvertretender Leiter des Hamas-Politbüros und Verbindungsmann zu Iran und Hisbollah; am 2.1.2024 bei einem Israel zugeschriebenen Angriff in Beirut getötet",
    url: "https://apnews.com/article/4ea42d6459496468ae39258e31832011" }],
  ["ouda", { badge: "official", name: "Sami Odeh", info: "laut IDF und Shin Bet Leiter des allgemeinen Hamas-Sicherheitsapparats; im Juli 2024 zusammen mit Rawhi Mushtaha und Sameh al-Siraj in Nord-Gaza getötet, später von Hamas bestätigt",
    url: "https://www.timesofisrael.com/idf-says-it-killed-hamas-de-facto-pm-sinwars-right-hand-man-in-strike-3-months-ago/" }],
  ["abu askar", { badge: "official", name: "Muhammad Abu Askar (Abu Khaled)", info: "Hamas-Funktionär und Vorsitzender des Sommerlager-Komitees; laut Berichten am 22.12.2024 bei einem Luftangriff in Gaza-Stadt getötet",
    url: "https://www.terrorism-info.org.il/app/uploads/2025/01/E_010_25.pdf" }],
  ["ibrahim", { badge: "official", name: "Taysir Kamel Ismail Ibrahim", info: "Dekan der Scharia- und Rechtsfakultät der Islamischen Universität; in Berichten als Leiter des Hamas-Justizzweigs bezeichnet, am 13.10.2023 in Gaza getötet",
    url: "https://airwars.org/civilian-casualties/ispt0181-october-13-2023/" }],

  ["mushtaha", { badge: "fighter", name: "Muhammad Mashtaha", info: "laut IDF und Shin Bet beim Palästinensischen Islamischen Dschihad für militärische Spezialisierung in Nord-Gaza zuständig; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["wadi", { badge: "fighter", name: "Amir Hisham Fayez Wadi", info: "laut IDF und Shin Bet verantwortlich für das Scharfschützenwesen der Khan-Younis-Brigade des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["muammar", { badge: "fighter", name: "Jamal Maamar (auch Muammar)", info: "laut IDF und Shin Bet verantwortlich für die Raketenartillerie des Islamischen Dschihad in Rafah; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["abu al-ata", { badge: "fighter", name: "Fadl Zakariya Ahmed Abu al-Ata", info: "laut IDF und Shin Bet Sektorenkommandeur der Gaza-Stadt-Brigade des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["abu shawish", { badge: "fighter", name: "Samir Suleiman Ali Abu Shawish", info: "laut IDF und Shin Bet Kommandeur des Yabna-Sektors des Islamischen Dschihad in Rafah; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["salah", { badge: "fighter", name: "Muntasir Mahmoud Mohammed Salah", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["al-qadi", { badge: "fighter", name: "Ahmad Qadi", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["ghannam", { badge: "fighter", name: "Fuad Shaker Diab Ghannam", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["al-banna", { badge: "fighter", name: "Khaled Bana (al-Banna)", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["al-mashrawi", { badge: "fighter", name: "Saeed Mashraoui (al-Mashrawi)", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["kassab", { badge: "fighter", name: "Youssef Kassab", info: "laut IDF und Shin Bet stellvertretender Kommandeur des östlichen Sektors des Islamischen Dschihad in Rafah; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],
  ["abu jarad", { badge: "fighter", name: "Murad Naser Mousa Abu Jarad", info: "laut IDF und Shin Bet stellvertretender Kommandeur des Beit-Hanoun-Sektors des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://vinnews.com/2025/09/15/idf-shin-bet-name-21-senior-islamic-jihad-operatives-killed-in-gaza/" }],

  ["qawasma", { badge: "prisoner", name: "Imad Salah Abd al-Fattah Qawasmeh", info: "ranghohes Hamas-Mitglied, wegen Beteiligung an mehreren tödlichen Anschlägen inhaftiert; im Oktober 2025 auf der israelischen Freilassungsliste des Geiselaustauschs",
    url: "https://www.jpost.com/israel-news/defense-news/article-870030" }],
  ["al-sheikh", { badge: "prisoner", name: "Ra'ad Sheikh", info: "wegen Beteiligung am Ramallah-Lynching von 2000 inhaftiert; im Oktober 2025 auf der israelischen Freilassungsliste des Geiselaustauschs",
    url: "https://www.jpost.com/israel-news/defense-news/article-870030" }],
  ["badr", { badge: "prisoner", name: "Baher Badr", info: "wegen des Selbstmordanschlags von Tzrifin 2003 zu elf lebenslangen Strafen verurteilt; im Oktober 2025 auf der israelischen Freilassungsliste des Geiselaustauschs",
    url: "https://www.jpost.com/israel-news/defense-news/article-870030" }],
  ["al-amour", { badge: "prisoner", name: "Riad al-Amor", info: "Mitglied einer Zelle aus Bethlehem, die für Anschläge mit neun Todesopfern verantwortlich gemacht wurde; zu elf lebenslangen Strafen verurteilt und im Oktober 2025 auf der Freilassungsliste",
    url: "https://www.jpost.com/israel-news/defense-news/article-870030" }],
  ["barghouth", { badge: "prisoner", name: "Ahmed Barghouti", info: "wegen direkter Beteiligung an Anschlägen mit zwölf Todesopfern zu 13 lebenslangen Strafen verurteilt; am 15.2.2025 im Geiselaustausch freigelassen",
    url: "https://www.jpost.com/israel-news/article-842222" }],
  ["al-qadi", { badge: "prisoner", name: "Mazen al-Qadi", info: "wegen Beihilfe zum Anschlag auf ein Restaurant in Tel Aviv 2002 zu drei lebenslangen Strafen verurteilt; am 15.2.2025 im Geiselaustausch freigelassen",
    url: "https://www.jpost.com/israel-news/article-842222" }],
  ["obeid", { badge: "prisoner", name: "Nael Obeid", info: "Hamas-Mitglied, wegen Beteiligung am Anschlag auf das Café Hillel 2003 inhaftiert; am 15.2.2025 im Geiselaustausch freigelassen",
    url: "https://www.jpost.com/israel-news/article-842222" }],
  ["qasim", { badge: "prisoner", name: "Wael Qassem (Qassam)", info: "Hamas-Mitglied, wegen Planung des Anschlags auf die Cafeteria der Hebräischen Universität 2002 verurteilt; Anfang 2025 im Geiselaustausch freigelassen",
    url: "https://www.jpost.com/diaspora/article-840886" }],
  ["ouda", { badge: "prisoner", name: "Mohammed Odeh", info: "wegen Beteiligung am Anschlag auf die Cafeteria der Hebräischen Universität 2002 verurteilt; Anfang 2025 im Geiselaustausch freigelassen",
    url: "https://www.jpost.com/diaspora/article-840886" }],
  ["al-abbasi", { badge: "prisoner", name: "Wissam Abassi", info: "wegen Beteiligung am Anschlag auf die Cafeteria der Hebräischen Universität 2002 verurteilt; Anfang 2025 im Geiselaustausch freigelassen",
    url: "https://www.jpost.com/diaspora/article-840886" }],

  ["al-kharraz", { badge: "fighter", name: "Khalil Hamed al-Kharraz", info: "stellvertretender Qassam-Kommandeur im Libanon und laut Ermittlungsakten Leiter einer Hamas-Auslandsstruktur; im November 2023 im Südlibanon getötet",
    url: "https://www.terrorism-info.org.il/en/arrest-of-hamas-terrorist-cells-in-europe-hamas-may-carry-out-attacks-abroad/" }],
  ["al-haj", { badge: "fighter", name: "Samer Mahmoud al-Haj", info: "Hamas-Kommandeur im Flüchtlingslager Ain al-Hilweh im Libanon; laut IDF für Rekrutierung und Angriffsplanung zuständig, am 9.8.2024 bei Sidon getötet; Hamas bestätigte den Tod",
    url: "https://www.jpost.com/breaking-news/article-814069" }],
  ["dawas", { badge: "fighter", name: "Raafat Dawasi", info: "von Hamas als Kommandeur ihres lokalen bewaffneten Flügels in Jenin bestätigt; am 17.8.2024 bei einem israelischen Drohnenangriff im Westjordanland getötet",
    url: "https://www.timesofisrael.com/liveblog_entry/hamas-confirms-2-senior-operatives-were-killed-in-jenin-drone-strike/" }]
].forEach(([family, person]) => {
  if (!window.FAM_NOTES[family]) window.FAM_NOTES[family] = {};
  if (!window.FAM_NOTES[family].notable) window.FAM_NOTES[family].notable = [];
  window.FAM_NOTES[family].notable.push(person);
});

// --- Namens-Herkuenfte der Top-100-Familien (arabische Onomastik; unsichere ausgelassen) ---
// Drei Klassen: Beruf/Titel · Ort/Ethnie · Vor-/Ahnenname (Patronym). Kuratierte Eintraege oben haben Vorrang.
window.FAM_ORIGINS = {
  "ahmed": "Patronym vom Vornamen Ahmad („der Gepriesene“).",
  "hamdan": "Patronym von Hamd („Lob“) — alter Stammesname.",
  "hassouna": "Koseform von Hassan — Ahnenname.",
  "al-shaer": "Berufsname: „der Dichter“.",
  "salem": "Vom Vornamen Salim („unversehrt“).",
  "al-khatib": "Berufsname: „der Prediger/Redner“ (Freitagsprediger).",
  "nasr": "„Sieg“ — Vorname als Familienname.",
  "yassin": "Vom Koran-Vers Ya-Sin — verbreiteter Vorname als Familienname.",
  "obeid": "Verkleinerungsform von 'Abd („kleiner Diener [Gottes]“).",
  "abu warda": "„Vater der Rose“ — Beiname als Familienname.",
  "hamouda": "Koseform von Hamid/Mahmoud.",
  "mousa": "Patronym: Moses.",
  "hassan": "Patronym: Hassan.",
  "al-farra": "Berufsname: „der Kürschner“ — Notabeln-Familie aus Khan Younis (stellte mehrfach Bürgermeister).",
  "abu mustafa": "Patronym-Beiname („Vater des Mustafa“).",
  "al-attar": "Berufsname: „der Parfüm-/Gewürzhändler“.",
  "saleh": "Vom Vornamen Salih („rechtschaffen“).",
  "mansour": "„der [von Gott] zum Sieg Geführte“ — Vorname.",
  "abed": "„Diener [Gottes]“ — Kurzform von Abdallah-Namen.",
  "matar": "„Regen“ — alter Segensname.",
  "abu daqqa": "Groß-Clan aus Khuza'a (Ost-Khan-Younis).",
  "al-haddad": "Berufsname: „der Schmied“.",
  "hamad": "Patronym von Hamd („Lob“).",
  "al-agha": "Osmanischer Titel „Agha“ — alte Notabeln-Familie der Gaza-Stadt.",
  "shahada": "„Glaubensbekenntnis“ — Vorname als Familienname.",
  "deeb": "„Wolf“ (dhi'b) — alter Beiname.",
  "hamada": "Koseform von Muhammad/Ahmad.",
  "atallah": "„Gottesgabe“ — Vorname.",
  "abu hasira": "„Vater der Matte“ — alteingesessene Fischerfamilie am Hafen von Gaza-Stadt.",
  "jouda": "„Güte/Großzügigkeit“ — Vorname.",
  "abu nasr": "Patronym-Beiname („Vater des Sieges“).",
  "radwan": "„Wohlgefallen [Gottes]“ — auch Name des Stadtviertels Scheich Radwan.",
  "abu jazar": "Berufs-Beiname: „Vater des Metzgers“ — Rafah-Familie.",
  "khader": "Vom Propheten al-Khidr („der Grüne“).",
  "al-helou": "„der Süße“ — Beiname.",
  "azzam": "„entschlossen“ — Vorname.",
  "ali": "Patronym: Ali.",
  "al-aqqad": "Berufsname: „der Knüpfer/Posamentenhändler“ — Kaufmannsfamilie (Khan Younis).",
  "shaaban": "Vom Monatsnamen Scha'ban — wie Radschab ein Kalender-Vorname.",
  "abu taha": "Patronym-Beiname (Taha = Koranname des Propheten).",
  "eid": "„Fest“ — oft für an einem Festtag Geborene.",
  "salman": "Vom Vornamen Salman.",
  "nabhan": "„wachsam/edel“ — Stammesname.",
  "abu lubda": "Vom Filz (libda) — Handwerker-Beiname.",
  "al-louh": "„die Tafel/Planke“ — Clan aus Deir al-Balah.",
  "aqel": "„Verstand/verständig“ — Beiname.",
  "nassar": "Intensivform von „Sieg“ — auch christlich verbreiteter Name.",
  "baraka": "„Segen“.",
  "dalloul": "Koseform „der Verhätschelte“ — alteingesessen in Gaza-Stadt.",
  "darwish": "„Derwisch“ — Sufi-Bezug; berühmtester Träger: Dichter Mahmoud Darwish (keine Verwandtschaft belegt).",
  "salah": "„Rechtschaffenheit“ — Vorname (wie Salah ad-Din).",
  "marouf": "„der Bekannte/Wohltat“ — Vorname.",
  "miqdad": "Nach al-Miqdad, Gefährte des Propheten.",
  "juha": "Nach der Volks-Witzfigur Dschuha — seltener Fall eines humoristischen Familiennamens.",
  "nawfal": "Alter arabischer Stammesname (auch: „großzügig“).",
  "ouda": "„Rückkehr“ — Vorname; auch Flüchtlings-Konnotation ('awda).",
  "al-jamal": "„das Kamel“ — Händler-/Treiber-Beiname.",
  "al-kurd": "Ethnie als Name: „der Kurde“ — Ortsthese bestätigt (wie al-Masri, Hijazi, Halabi).",
  "qasim": "Vom Vornamen Qasim („der Teilende“).",
  "masoud": "„der Glückliche“ — Vorname.",
  "khalifa": "„Nachfolger/Kalif“ — Vorname.",
  "habib": "„der Geliebte“ — Vorname.",
  "alwan": "„Farben“ — alter Beiname.",
  "hammad": "„viel lobend“ — Intensivform von Hamd.",
  "sammour": "„Zobel“ — bekannte Fischhändler-Familie in Gaza-Stadt.",
  "owaida": "Verkleinerungsform von 'Ouda („kleine Rückkehr“).",
  "jabr": "„Trost/Wiederherstellung“ — Vorname (wie Algebra, al-dschabr).",
  "ghaben": "Groß-Clan aus Beit Lahia im Norden.",
  "qdeih": "Clan aus Khuza'a (Ost-Khan-Younis).",
  "zaqqut": "Alteingesessener Gaza-Clan.",
  "barbakh": "Clan aus Rafah.",
  "kuhail": "„dunkeläugig“ (kahil) — Beiname.",
  "abu ouda": "Patronym-Beiname zu 'Ouda („Rückkehr“).",
  "eliwa": "Koseform von Ali — Ahnenname.",
  "khella": "Alteingesessene Familie (Gaza-Stadt); auch als Khella/Khilla transliteriert.",
  "islim": "Variante von Salim/Sulaiman — Ahnenname.",
  "jundia": "Vom Wort dschundi („Soldat“) — alter Beiname.",
  "abu asi": "Patronym-Beiname; Groß-Familie in Gaza-Stadt.",
  "al-amour": "Beduinischer Stammesname im Süden (Rafah/Khan Younis).",
  "asaliya": "Vom Honig (ʿasal) — Beiname.",
  "al-madhoun": "Wörtlich „der Gesalbte/Geölte“ — Berufs-Beiname; Groß-Familie in Nord-Gaza."
};
