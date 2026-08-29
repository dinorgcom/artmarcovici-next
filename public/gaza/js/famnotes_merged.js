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

  ["mushtaha", { badge: "fighter", name: "Mohammad Radwan Ramadan Mushtaha", info: "laut IDF und Shin Bet beim Palästinensischen Islamischen Dschihad für militärische Spezialisierung in Nord-Gaza zuständig; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["wadi", { badge: "fighter", name: "Amir al-Shaam Faiz Wadi (MoH: Amir Hisham Fayez Wadi)", info: "laut IDF und Shin Bet verantwortlich für das Scharfschützenwesen der Khan-Younis-Brigade des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["muammar", { badge: "fighter", name: "Jamal Mahmoud Salem Ma'amar (auch Muammar)", info: "laut IDF und Shin Bet verantwortlich für die Raketenartillerie des Islamischen Dschihad in Rafah; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["abu al-ata", { badge: "fighter", name: "Fazel Zakariya Ahmad Abu al-Ata", info: "laut IDF und Shin Bet Sektorenkommandeur der Gaza-Stadt-Brigade des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["abu shawish", { badge: "fighter", name: "Samir Suleiman Ali Abu-Shaweesh", info: "laut IDF und Shin Bet Kommandeur des Yabna-Sektors des Islamischen Dschihad in Rafah; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["salah", { badge: "fighter", name: "Mansour Mahmoud Mohammad Salah (MoH: Muntasir)", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["al-qadi", { badge: "fighter", name: "Ahmad Ziyad Qasem Qadi", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["ghannam", { badge: "fighter", name: "Fuad Shaker Diab Ghanam", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["al-banna", { badge: "fighter", name: "Khaled Mousa Ramadan Bana (al-Banna)", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["al-mashrawi", { badge: "fighter", name: "Saeed Samir Nimer Masharawi", info: "laut IDF und Shin Bet Waffenproduktions-Experte des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["kassab", { badge: "fighter", name: "Yousef Saleh Younes Kassab", info: "laut IDF und Shin Bet stellvertretender Kommandeur des östlichen Sektors des Islamischen Dschihad in Rafah; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],
  ["abu jarad", { badge: "fighter", name: "Murad Nasser Mousa Abu Jarad", info: "laut IDF und Shin Bet stellvertretender Kommandeur des Beit-Hanoun-Sektors des Islamischen Dschihad; 2025 in Gaza getötet",
    url: "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/" }],

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

// --- Automatischer Abgleich: zentrale IDF/ISA-Liste + Gaza-Pressemitteilungen ---
// Stand 20.8.2026. Aufgenommen werden nur eindeutige Nachnamens-Treffer gegen
// die 3.127 Familien der TfP/MoH-Liste. Die Einstufungen sind Behauptungen der
// jeweiligen israelischen Primärquelle und werden deshalb immer attribuiert.
(() => {
  const overview = "https://www.idf.il/en/mini-sites/israel-at-war/all-articles/eliminated-key-terrorist-operatives-eliminated-by-the-idf-and-isa/";
  const pijList = "https://m.www.idf.il/en/mini-sites/idf-press-releases-israel-at-war/september-25-pr/the-idf-and-the-isa-reveal-21-eliminated-islamic-jihad-senior-terrorists/";
  [
    ["dababesh", { badge: "fighter", name: "Mohammed Khamis Dababash", info: "von IDF und Shin Bet als ranghoher Hamas-Angehöriger und früherer Leiter des militärischen Geheimdienstes geführt", url: overview }],
    ["ashour", { badge: "fighter", name: "Yaakub A'ashur", info: "von IDF und Shin Bet als Leiter der Panzerabwehr der Khan-Younis-Brigade geführt", url: overview }],
    ["siyam", { badge: "fighter", name: "Ahmed Siam", info: "von IDF und Shin Bet als Kompaniekommandeur im Naser-Radwan-Bataillon geführt", url: overview }],
    ["abu mughaisib", { badge: "fighter", name: "Ibrahim Abu-Maghsib", info: "von IDF und Shin Bet als Leiter einer Hamas-Panzerabwehreinheit in den Zentrallagern geführt", url: overview }],
    ["abu zina", { badge: "fighter", name: "Mohsen Abu Zina", info: "von IDF und Shin Bet als Leiter für Waffen- und Industrieproduktion bei Hamas geführt", url: overview }],
    ["dalloul", { badge: "fighter", name: "Mustafa Dalul", info: "von IDF und Shin Bet als Kommandeur des Sabra-Tel-al-Hawa-Bataillons geführt", url: overview }],
    ["al-assar", { badge: "fighter", name: "Muhammad A'sar", info: "von IDF und Shin Bet als Leiter der Hamas-Panzerabwehreinheiten im Gazastreifen geführt", url: overview }],
    ["abu rukba", { badge: "fighter", name: "Asem Abu Rakba", info: "von IDF und Shin Bet als Leiter des Hamas-Luftbereichs und Mitplaner des 7. Oktober geführt", url: overview }],
    ["baroud", { badge: "fighter", name: "Shadi Barud", info: "von IDF und Shin Bet als Leiter des militärischen Hamas-Geheimdienstes und Mitplaner des 7. Oktober geführt", url: overview }],
    ["abu shamla", { badge: "fighter", name: "Muhammad Abu Shamla", info: "von IDF und Shin Bet als ranghoher Angehöriger der Hamas-Seestreitkräfte der Rafah-Brigade geführt", url: overview }],
    ["al-qadi", { badge: "fighter", name: "Ali Qadi", info: "von IDF und Shin Bet als Nukhba-Kommandeur der Jabalya-Sturmkompanie geführt; 2011 im Shalit-Austausch freigelassen", url: overview }],
    ["mousa", { badge: "fighter", name: "Jamal Mussa", info: "von IDF und Shin Bet als Verantwortlicher für besondere Sicherheitsoperationen der Hamas geführt", url: overview }],
    ["mousa", { badge: "fighter", name: "Ahmed Musa", info: "von IDF und Shin Bet als Nukhba-Kompaniekommandeur und Leiter des Angriffs auf Zikim geführt", url: overview }],
    ["al-hindi", { badge: "fighter", name: "Omar Al-Hindi", info: "von IDF und Shin Bet als Nukhba-Zugführer und Teilnehmer des 7. Oktober geführt", url: overview }],
    ["abu jalala", { badge: "fighter", name: "Amar Abu Jalalah", info: "von IDF und Shin Bet als ranghoher Angehöriger der Hamas-Seestreitkräfte geführt", url: overview }],
    ["siyam", { badge: "fighter", name: "Aiman Siam", info: "von IDF und Shin Bet als Leiter des Hamas-Raketenbereichs geführt", url: overview }],
    ["rajab", { badge: "fighter", name: "Wael Rajeb", info: "von IDF und Shin Bet als stellvertretender Kommandeur der Nord-Gaza-Brigade geführt", url: overview }],
    ["khalifa", { badge: "fighter", name: "Farsan Halifa", info: "von IDF und Shin Bet als Angehöriger des Hamas-Hauptquartiers für das Westjordanland und Verantwortlicher für Tulkarm geführt", url: overview }],
    ["salman", { badge: "fighter", name: "Rafet Salman", info: "von IDF und Shin Bet als Leiter der Kampfunterstützung in Nord-Gaza und der Gaza-Stadt-Brigade geführt", url: overview }],
    ["farhat", { badge: "fighter", name: "Wessam Farhat", info: "von IDF und Shin Bet als Kommandeur des Shejaiya-Bataillons geführt", url: overview }],
    ["al-rantisi", { badge: "fighter", name: "Abdel Aziz Rantisi", info: "von IDF und Shin Bet als Leiter der Feldaufklärung im militärischen Hamas-Geheimdienst und Beteiligter des 7. Oktober geführt", url: overview }],
    ["farwana", { badge: "official", name: "Subhi Ferwana", info: "von IDF und Shin Bet als Finanzier der militärischen Hamas-Aktivitäten geführt", url: overview }],
    ["ayesh", { badge: "fighter", name: "Ahmed Aiush", info: "von IDF und Shin Bet als Beobachtungsfunktionär des Carrara-Bataillons geführt", url: overview }],
    ["hamdan", { badge: "fighter", name: "Othman Hamdan", info: "von IDF und Shin Bet als Kommandeur für Kampf- und Verwaltungsunterstützung eines Hamas-Bataillons geführt", url: overview }],
    ["al-shalfouh", { badge: "fighter", name: "Ghassan Shalfuah", info: "von IDF und Shin Bet als Ausbildungsleiter der Hamas-Luftabwehr in Nord-Gaza geführt", url: overview }],
    ["al-rifi", { badge: "fighter", name: "Mahmoud Al-Rifi", info: "von IDF und Shin Bet als Verantwortlicher für militärischen Nachschub in Gaza-Stadt geführt", url: overview }],
    ["salah", { badge: "fighter", name: "Suleiman Selah", info: "von IDF und Shin Bet als Kommandeur des Zentral-Jabalya-Bataillons und einer Panzerabwehreinheit geführt", url: overview }],
    ["abbas", { badge: "fighter", name: "Ref'at Abbas", info: "von IDF und Shin Bet als Kommandeur des Darj-Tufah-Bataillons geführt", url: overview }],
    ["al-sahhar", { badge: "fighter", name: "Ibrahim Al-Sahar", info: "von IDF und Shin Bet als Leiter einer Hamas-Panzerabwehrbrigade geführt", url: overview }],
    ["abed", { badge: "fighter", name: "Mazen Abed", info: "von IDF und Shin Bet als Bataillonskommandeur der Qassam-Brigaden geführt", url: overview }],
    ["qatamish", { badge: "fighter", name: "Muhammad Qatamesh", info: "von IDF und Shin Bet als Leiter einer Hamas-Brigade für Raketenbeschuss geführt", url: overview }],
    ["shehab", { badge: "fighter", name: "Abd El-Rahman Shehab", info: "von IDF und Shin Bet als ranghoher Angehöriger des Palästinensischen Islamischen Dschihad geführt", url: overview }],
    ["alyan", { badge: "fighter", name: "Afif A'lian", info: "von IDF und Shin Bet als Angehöriger der Hamas-Nukhba-Einheit geführt", url: overview }],
    ["al-mubasher", { badge: "fighter", name: "Taisir Mubasher", info: "von IDF und Shin Bet als Leiter des Nord-Khan-Younis-Bataillons geführt", url: overview }],
    ["ward", { badge: "fighter", name: "Wael Al-Ward", info: "von IDF und Shin Bet als Hamas-Angehöriger geführt", url: overview }],
    ["abu rahma", { badge: "fighter", name: "Ahmed Abu Rahma", info: "von IDF und Shin Bet als Kommandeur einer Nukhba-Sturmkompanie geführt", url: overview }],
    ["shalbia", { badge: "fighter", name: "Mamdouh Mohammed Ibrahim Shalbia (IDF: Mamaduh Sha'alabia)", info: "von IDF und Shin Bet als Angehöriger der Hamas-Spezialkräfte zur See geführt; der Vollname steht auch in der MoH-Liste", url: overview }],
    ["al-bardawil", { badge: "fighter", name: "Hassan Al-Bardawill", info: "von IDF und Shin Bet als Angehöriger einer Hamas-Panzerabwehreinheit geführt", url: overview }],
    ["al-wadia", { badge: "fighter", name: "Muhammad Al-Wadea", info: "von IDF und Shin Bet als Angehöriger einer Hamas-Panzerabwehreinheit geführt", url: overview }],
    ["aqel", { badge: "fighter", name: "Loai Hussam Muhammad Aqel", info: "von IDF und Shin Bet als Angehöriger der Al-Aqsa-Märtyrerbrigaden geführt", url: overview }],
    ["baba", { badge: "fighter", name: "Jamil Baba", info: "von IDF und Shin Bet als Kommandeur der Seestreitkräfte in den Zentrallagern geführt", url: overview }],
    ["hijazi", { badge: "fighter", name: "Muwaman Hijazi", info: "von IDF und Shin Bet als bedeutender Angehöriger einer Panzerabwehreinheit geführt", url: overview }],
    ["awadallah", { badge: "fighter", name: "Muhammad Awdallah", info: "von IDF und Shin Bet als ranghoher Angehöriger der Hamas-Waffenproduktion geführt", url: overview }],
    ["al-kahlout", { badge: "fighter", name: "Mohammed Kahlout", info: "von IDF und Shin Bet als Leiter des Scharfschützenbereichs der Nord-Gaza-Brigade geführt", url: overview }],
    ["muslim", { badge: "fighter", name: "Tahsin Muslem", info: "von IDF und Shin Bet als Verantwortlicher für Kampfunterstützung und Spezialkräfte in Beit Lahia geführt", url: overview }],
    ["harb", { badge: "official", name: "Munir Hareb", info: "von IDF und Shin Bet als Leiter der Öffentlichkeitsarbeit der Hamas-Rafah-Brigade geführt", url: overview }],
    ["abu al-khair", { badge: "fighter", name: "Ihab Bassam Yousef Abu al-Kheir", info: "laut IDF und Shin Bet Leiter von Scharfschützengruppen des Palästinensischen Islamischen Dschihad; 2025 in Gaza getötet", url: pijList }],
    ["al-salmi", { badge: "fighter", name: "Fehmi Salmi", info: "laut IDF und Shin Bet Nukhba-Kompaniekommandeur im Zeitoun-Bataillon; führte am 7. Oktober den Angriff auf den IDF-Posten Paga und wurde 2024 getötet", url: "https://www.idf.il/en/mini-sites/israel-hamas-war-gaza/articles-israel-hamas-war-gaza/distributions-swords-of-iron-war-gaza/northern-gaza-24/111224-the-head-of-hamas-paragliding-unit-who-led-the-october-7th-aerial-infiltration-into-israel-was-eliminated/" }],
    ["al-jabari", { badge: "fighter", name: "Mumin Al-Jabari", info: "laut IDF und Shin Bet ranghoher Angehöriger der Scharfschützeneinheit der Hamas-Gaza-Stadt-Brigade; am 27.11.2024 als Ziel eines Luftangriffs gemeldet", url: "https://www.idf.il/en/mini-sites/israel-hamas-war-gaza/articles-israel-hamas-war-gaza/distributions-swords-of-iron-war-gaza/northern-gaza-24/271124-mumin-al-jabari-a-senior-terrorist-in-hamas-gaza-city-brigade-s-sniper-unit-who-operated-in-a-room-within-a-structure-that-previously-served-as-the-al-tabaeen-school/" }]
  ].forEach(([family, person]) => {
    if (!window.FAM_NOTES[family]) window.FAM_NOTES[family] = {};
    if (!window.FAM_NOTES[family].notable) window.FAM_NOTES[family].notable = [];
    window.FAM_NOTES[family].notable.push(person);
  });
})();

// --- Rueckwaertssuche: oeffentliche Personen zu den 100 groessten Familien ---
// Pilotlauf vom 20.8.2026. Ein gleicher Nachname ist kein Verwandtschaftsnachweis;
// deshalb wird das bei jedem Treffer ausdruecklich gesagt. Private Profile und
// Treffer ohne belastbare institutionelle oder journalistische Quelle sind verworfen.
(() => {
  const noKin = "; gleicher bzw. entsprechend transliterierter Familienname, eine Verwandtschaft mit den erfassten Gaza-Familien ist nicht belegt";
  const museum = "https://www.palmuseum.org/en/exhibitions-and-events/exhibitions/not-exhibition";
  const ecfr = "https://ecfr.eu/special/mapping_palestinian_politics/";
  [
    ["salem", { badge: "media", name: "Mohammed Salem", info: "palästinensischer Reuters-Fotograf; gewann mit einer in Khan Younis aufgenommenen Fotografie den World Press Photo of the Year 2024" + noKin,
      url: "https://www.worldpressphoto.org/news/2024/global-winners-announced" }],
    ["abu taha", { badge: "culture", name: "Mosab Abu Toha", info: "palästinensischer Dichter, Essayist und Gründer der Edward Said Library; stammt aus Gaza" + noKin,
      url: "https://www.poetryfoundation.org/people/mosab-toha" }],
    ["al-khatib", { badge: "diplomat", name: "Ghassan Khatib", info: "palästinensischer Politikwissenschaftler, ehemaliger Arbeits- und Planungsminister sowie früherer Leiter des PA-Regierungsmedienzentrums" + noKin,
      url: "https://www.birzeit.edu/en/biography/ghassan-khatib" }],
    ["ouda", { badge: ["media", "activist"], name: "Bisan Owda", info: "Journalistin, Aktivistin und Filmemacherin aus Gaza; erhielt für „It's Bisan from Gaza and I'm Still Alive“ einen Peabody Award" + noKin,
      url: "https://peabodyawards.com/award-profile/its-bisan-from-gaza/" }],
    ["al-aqqad", { badge: "media", name: "Plestia Alaqad", info: "palästinensische Journalistin und Autorin aus Gaza; international bekannt durch ihre Berichte über den Krieg und Autorin von „The Eyes of Gaza“" + noKin,
      url: "https://www.hachettebookgroup.com/contributor/plestia-alaqad/" }],
    ["abu mustafa", { badge: "media", name: "Ibraheem Abu Mustafa", info: "Reuters-Fotograf aus Gaza, der seit vielen Jahren Proteste, Kriege und den Alltag im Gazastreifen dokumentiert" + noKin,
      url: "https://www.yahoo.com/news/gaza-photographer-place-death-202444243.html" }],
    ["abed", { badge: "media", name: "Mohammed Abed", info: "in Gaza ausgebildeter palästinensischer Fotojournalist; arbeitete für Reuters und seit 2003 für AFP" + noKin,
      url: "https://www.worldpressphoto.org/mohammed-abed" }],
    ["al-madhoun", { badge: "aid", name: "Hani Almadhoun (Gaza Soup Kitchen)", info: "Mitgründer der Gaza Soup Kitchen und Mitarbeiter von UNRWA USA; nicht mit einem gleichnamigen Eintrag der Presse-Opferliste gleichzusetzen" + noKin,
      url: "https://www.palestine-studies.org/en/node/1656555" }],
    ["al-madhoun", { badge: "aid", name: "Mahmoud Almadhoun", info: "Mitgründer und örtlicher Organisator der Gaza Soup Kitchen; im November 2024 bei einem israelischen Angriff getötet" + noKin,
      url: "https://www.eater.com/24318675/gaza-soup-kitchen-mahmoud-almadhoun-death-community-future" }],
    ["darwish", { badge: "culture", name: "Mahmoud Darwish (1941–2008)", info: "international bekannter palästinensischer Dichter und Autor von mehr als 30 Gedichtbänden; stammte aus al-Birwa in Galiläa, nicht aus Gaza" + noKin,
      url: "https://www.poetryfoundation.org/poets/mahmoud-darwish" }],
    ["al-kurd", { badge: "activist", name: "Muna El-Kurd", info: "palästinensische Aktivistin aus Sheikh Jarrah in Ost-Jerusalem; 2021 gemeinsam mit ihrem Zwillingsbruder in die TIME100 aufgenommen" + noKin,
      url: "https://time.com/collection_hub_item/muna-mohammed-el-kurd/" }],
    ["al-kurd", { badge: ["culture", "activist"], name: "Mohammed El-Kurd", info: "palästinensischer Schriftsteller und Aktivist aus Sheikh Jarrah in Ost-Jerusalem; 2021 gemeinsam mit seiner Zwillingsschwester in die TIME100 aufgenommen" + noKin,
      url: "https://time.com/collection_hub_item/muna-mohammed-el-kurd/" }],
    ["mansour", { badge: "diplomat", name: "Riyad Mansour", info: "palästinensischer Diplomat und seit 2005 Ständiger Beobachter Palästinas bei den Vereinten Nationen; stammt aus Ramallah, nicht aus Gaza" + noKin,
      url: "https://www.un.org/pga/80/2026/02/09/letter-from-the-president-of-the-general-assembly-on-the-pga81-candidate-submission-of-vision-statement-and-biography/" }],
    ["al-shaer", { badge: "official", name: "Nasser al-Din al-Shaer", info: "palästinensischer Akademiker und Hamas-Politiker aus dem Westjordanland; 2006–2007 stellvertretender Ministerpräsident und Bildungsminister der PA" + noKin,
      url: "https://www.aljazeera.net/encyclopedia/2023/12/1/%D8%A7%D9%84%D8%A3%D8%B3%D9%8A%D8%B1-%D9%86%D8%A7%D8%B5%D8%B1-%D8%A7%D9%84%D8%B4%D8%A7%D8%B9%D8%B1-%D8%A3%D8%A8%D9%88-%D8%A7%D9%84%D9%82%D8%A7%D8%B3%D9%85-%D8%A7%D9%84%D8%AF%D8%A7%D8%B9%D9%8A" }],
    ["yassin", { badge: "official", name: "Scheich Ahmed Yassin", info: "Gründer und geistlicher Führer der Hamas; lebte in Gaza und wurde dort 2004 bei einem israelischen Luftangriff getötet" + noKin,
      url: "https://www.cfr.org/backgrounders/what-hamas" }],
    ["hamad", { badge: "official", name: "Fathi Hamad", info: "Mitglied des Hamas-Politbüros und von 2009 bis 2014 Innen- und Sicherheitsminister der Hamas-Regierung in Gaza" + noKin,
      url: "https://ecfr.eu/special/mapping_palestinian_politics/fathi_hamad/" }],
    ["hamad", { badge: "official", name: "Ghazi Hamad", info: "Mitglied der Hamas-Führung in Gaza und früherer Sprecher der 2006 von Hamas geführten PA-Regierung" + noKin,
      url: "https://ecfr.eu/special/mapping_palestinian_politics/ghazi-hamad/" }],
    ["hamdan", { badge: "official", name: "Osama Hamdan", info: "ranghoher Hamas-Funktionär im Libanon und häufig öffentlich auftretender Sprecher der Organisation" + noKin,
      url: "https://apnews.com/article/625d22d49f84f2442d8d9de285a183d1" }],
    ["marouf", { badge: "official", name: "Salama Maarouf", info: "Leiter des Regierungsmedienbüros und stellvertretender Informationsminister der Hamas-geführten Verwaltung in Gaza" + noKin,
      url: "https://ecfr.eu/special/mapping_palestinian_politics/government-follow-up-committee-gaza/" }],
    ["al-attar", { badge: "fighter", name: "Raed al-Attar", info: "Kommandeur der Rafah-Brigade und Mitglied des Militärrats der Qassam-Brigaden; im August 2014 bei einem israelischen Angriff getötet" + noKin,
      url: "https://www.theguardian.com/world/2014/aug/21/israel-kills-three-hamas-commanders-air-strike" }],
    ["shahada", { badge: "fighter", name: "Salah al-Shahada (auch Shehadeh)", info: "militärischer Hamas-Führer; im Juli 2002 durch eine Ein-Tonnen-Bombe in Gaza getötet, wobei laut Human Rights Watch auch 13 Zivilisten starben" + noKin,
      url: "https://www.hrw.org/news/2002/07/22/israeli-airstrike-crowded-civilian-area-condemned" }],
    ["aqel", { badge: "fighter", name: "Imad Aqel", info: "früher Kommandeur der Qassam-Brigaden und in der ECFR-Übersicht der palästinensischen Politik als deren Führungsperson geführt" + noKin,
      url: ecfr }],

    ["zaqqut", { badge: "culture", name: "Heba Zaqout (1984–2023)", info: "Künstlerin, Grafikdesignerin und Lehrerin aus Gaza; ihre Bilder thematisierten palästinensische Identität und städtische Architektur" + noKin,
      url: "https://mpp-dc.org/gaza-remains-the-story/" }],
    ["ghaben", { badge: "culture", name: "Fathi Ghaben (1947–2024)", info: "bedeutender palästinensischer Maler und Kunstpädagoge aus Gaza; seine Werke behandelten Kultur, Vertreibung und Rückkehr" + noKin,
      url: "https://mpp-dc.org/gaza-remains-the-story/" }],
    ["al-madhoun", { badge: "culture", name: "Mohammed Almadhoun (Künstler)", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["al-shaer", { badge: "culture", name: "Mai Alshaer", info: "vom Palestinian Museum als beteiligte Künstlerin der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["hassouna", { badge: "culture", name: "Moeen Hassouna", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["awad", { badge: "culture", name: "Salem Awad", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["al-farra", { badge: "culture", name: "Mohamad Elfarra", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["matar", { badge: "culture", name: "Dina Mattar", info: "vom Palestinian Museum als beteiligte Künstlerin der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["matar", { badge: "culture", name: "Malak Mattar", info: "vom Palestinian Museum als beteiligte Künstlerin der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["nassar", { badge: "culture", name: "Marwan Nassar", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["abu ouda", { badge: "culture", name: "Fatma Abu Owda", info: "vom Palestinian Museum als beteiligte Künstlerin der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["radwan", { badge: "culture", name: "Shafik Radwan", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["salem", { badge: "culture", name: "Sohail Salem", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["salah", { badge: "culture", name: "Mariam Salah", info: "vom Palestinian Museum als beteiligte Künstlerin der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["juha", { badge: "culture", name: "Mohammed Joha", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["deeb", { badge: "culture", name: "Tamer Al-Deeb", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }],
    ["abu nasr", { badge: "culture", name: "Mohammad Abu Nasser", info: "vom Palestinian Museum als beteiligter Künstler der Gaza-Ausstellung „This Is Not an Exhibition“ geführt" + noKin,
      url: museum }]
  ].forEach(([family, person]) => {
    if (!window.FAM_NOTES[family]) window.FAM_NOTES[family] = {};
    if (!window.FAM_NOTES[family].notable) window.FAM_NOTES[family].notable = [];
    window.FAM_NOTES[family].notable.push(person);
  });
})();

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
  "al-madhoun": "Wörtlich „der Gesalbte/Geölte“ — Berufs-Beiname; Groß-Familie in Nord-Gaza.",

  "aaf": {
    origin: "Kurzform oder abgekürzter Stammesname. In Gaza dokumentiert.",
    notable: []
  },

  "abdelal": {
    origin: "Von ʿabd al-ʿāl (عبد العال): „Sklave des Erhabenen“. Theophorischer Name.",
    notable: []
  },

  "abdelghani": {
    origin: "Von ʿabd al-ghānī (عبد الغني): „Sklave des Reichen/Bedürfnislosen“. Theophorischer Name.",
    notable: []
  },

  "abdelkader": {
    origin: "Von ʿabd al-qādir (عبد القادر): „Sklave des Mächtigen“. Theophorischer Name.",
    notable: []
  },

  "abdelkarim": {
    origin: "Von ʿabd al-karīm (عبد الكريم): „Sklave des Großzügigen“. Theophorischer Name.",
    notable: []
  },

  "abdullah": {
    origin: "Von ʿabd allāh (عبد الله): „Sklave Gottes“. Einer der verbreitetsten Namen in der islamischen Welt.",
    notable: []
  },

  "abu ali": {
    origin: "Kunya: Abu (Vater von) + Ali. Ali = Cousin und Schwiegersohn des Propheten Mohammed, zentral für Schiiten.",
    notable: []
  },

  "abu amra": {
    origin: "Kunya: Abu (Vater von) + Amra (Diminutiv von Amira, „kleine Prinzessin“).",
    notable: [
      { badge: "victims", name: "Mohamed Abu Amra", info: "Gaza-Bewohner, der im Mai 2024 seine Frau, zwei Brüder, Schwester und Nichte verlor, als ein israelischer Angriff ihr Haus in Rafah im Schlaf zerstörte.", url: "https://apnews.com/article/israel-palestinians-gaza-hamas-war-05-07-2024-113bf4ee5dad87dc5c003d76ed2785bf" }
    ]
  },

  "abu amsha": {
    origin: "Kunya: Abu (Vater von) + Amsha (lokaler Kosename).",
    notable: [
      { badge: "victims", name: "Fauzi und Neama Abu Amsha", info: "Älteres Ehepaar (63 und 62), 2014 in Beit Hanoun getötet. Ihre Söhne fanden sie „in Stücken“ in einem engen Raum zwischen Gebäuden nach einem israelischen Angriff.", url: "https://apnews.com/article/gaza-israel-hamas-war-middle-east-palestinians-e6d44f4e478cced2cfaeac61385020ac" }
    ]
  },

  "abu daher": {
    origin: "Kunya: Abu (Vater von) + Daher (Dhaher: „sichtbar“, „manifest“).",
    notable: []
  },

  "abu eida": {
    origin: "Kunya: Abu (Vater von) + Eida (von ʿĪd, „Fest“).",
    notable: [
      { badge: "victims", name: "Abu-Eida-Platz-Massaker", info: "Euro-Med-HRM: Israelischer Luftangriff auf den Abu-Eida-Platz im Flüchtlingslager Jabalia, November 2023. Etwa 120 Tote, überwiegend aus einer erweiterten Familie.", url: "https://euromedmonitor.org/en/article/6369/" }
    ]
  },

  "abu halima": {
    origin: "Kunya: Abu (Vater von) + Halima (Name der Amme des Propheten Mohammed).",
    notable: []
  },

  "abu hashem": {
    origin: "Kunya: Abu (Vater von) + Hashem. Hashem = Urgroßvater des Propheten Mohammed.",
    notable: []
  },

  "abu jayab": {
    origin: "Kunya: Abu (Vater von) + Jayab (möglicherweise von jayyib: „gut“).",
    notable: []
  },

  "abu leila": {
    origin: "Kunya: Abu (Vater von) + Leila („Nacht“). Kosename.",
    notable: []
  },

  "abu musameh": {
    origin: "Kunya: Abu (Vater von) + Musameh (von musāmaḥa: „Nachsicht", „Toleranz“).",
    notable: []
  },

  "abu naser": {
    origin: "Kunya: Abu (Vater von) + Naser (Sieg).",
    notable: []
  },

  "abu nser": {
    origin: "Variante von abu naser.",
    notable: []
  },

  "abu samra": {
    origin: "Kunya: Abu (Vater von) + Samra („die Brünette“).",
    notable: [
      { badge: "sport", name: "Nagham Abu Samra (24)", info: "Palästinensische Karate-Meisterin, Schwarzgurtträgerin und Gründerin eines Sportzentrums in Gaza. Verlor im Dezember 2023 ein Bein bei einem israelischen Luftangriff auf Nuseirat; starb im Januar 2024 in einem ägyptischen Krankenhaus.", url: "https://www.thenationalnews.com/mena/palestine-israel/2024/01/12/gaza-karate-champion-hit-by-israeli-strike-succumbs-to-injuries-at-hospital-in-egypt/" }
    ]
  },

  "abu sitteh": {
    origin: "Kunya: Abu (Vater von) + Sitteh („die Sechzigjährige“ oder „die Großmutter“).",
    notable: []
  },

  "abu tuaima": {
    origin: "Kunya: Abu (Vater von) + Tuaima (Diminutiv von Tuma/Thomas). Christlich-arabisches Muster.",
    notable: []
  },

  "abu watfa": {
    origin: "Kunya: Abu (Vater von) + Watfa (möglicherweise von watafa: „aufsteigen").",
    notable: [
      { badge: "official", name: "Mahmoud Abu Watfa", info: "Generaldirektor des Hamas-Innenministeriums. Wurde 2025 zusammen mit seiner Familie bei einem Angriff auf sein Haus in Gaza-Stadt getötet.", url: "https://www.ynetnews.com/article/skd8m11p2ke" }
    ]
  },

  "adwan": {
    origin: "Vom Stamm ʿAdwān. Historisch bedeutender arabischer Stamm.",
    notable: []
  },

  "afana": {
    origin: "Von ʿAfanā (عفانة): „der Verzeihende", „der Strahlende". Indirekter Quranischer Name.",
    notable: [
      { badge: "academic", name: "Hussam al-Din Musa Afana", info: "Palästinensischer Jurist, Mufti und Reformator; Professor für Rechtswissenschaft an der Al-Quds-Universität.", url: "https://www.all4palestine.org/ModelDetails.aspx?gid=10&mid=118839" }
    ]
  },

  "afifi": {
    origin: "Von ʿafīf (عفيف): „rein, keusch". Deskriptiver Name.",
    notable: []
  },

  "agha": {
    origin: "Von al-Āghā (الآغا): osmanischer Adelstitel, türkisch „Agha" (Herr).",
    notable: []
  },

  "ahel": {
    origin: "Von ahl (أهل): „Familie", „Leute". Gruppenbezeichnung als Name.",
    notable: []
  },

  "akhras": {
    origin: "Von akhras (أخرس): „stumm“. Spitzname.",
    notable: []
  },

  "akkad": {
    origin: "Von ʿAqqād (العقاد): „der Nagler". Berufsname.",
    notable: []
  },

  "al-areer": {
    origin: "Familie aus Al-Shujaiya, Gaza-Stadt.",
    notable: [
      { badge: ["culture","academic"], name: "Dr. Refaat Alareer", info: "Dichter, Geschichtenerzähler und Professor an der Islamischen Universität Gaza. Herausgeber von „Gaza Writes Back“. Wurde am 6.12.2023 gezielt bombardiert. Verfasste das berühmte Gedicht „If I Must Die".", url: "https://en.wikipedia.org/wiki/Refaat_Alareer" },
      { badge: "victims", name: "Familie Alareer (6.12.2023)", info: "Refaat wurde mit Bruder Salah, Neffe Muhammad, Schwester Asmaa und drei ihrer Kinder (Alaa, Yahya, Muhammad) getötet. Die Wohnung wurde chirurgisch bombardiert.", url: "https://electronicintifada.net/blogs/tamara-nassar/refaat-alareer-was-assassinated-israel" },
      { badge: "victims", name: "Shaymaa Alareer", info: "Tochter von Refaat Alareer. Wurde am 16.4.2024 zusammen mit Ehemann und Neugeborenem getötet — sechs Monate nach dem Tod ihres Vaters.", url: "https://www.euppublishing.com/doi/full/10.3366/hlps.2025.0362" },
      { badge: "victims", name: "Brüder Mohammed und Hamada Alareer", info: "Beide 2014 getötet. Refaat schrieb: „Mein Bruder wird Märtyrer Nummer 26 in meiner erweiterten Familie."", url: "https://electronicintifada.net/blogs/tamara-nassar/refaat-alareer-was-assassinated-israel" },
      { badge: "victims", name: "Onkel Tayseer Alareer", info: "2001 von israelischen Streitkräften erschossen, während er auf seinem Land arbeitete.", url: "https://themarkaz.org/a-students-tribute-to-refaat-alareer-gazas-beloved-storyteller/" }
    ]
  },

  "al-ashqar": {
    origin: "Von ašqar (أشقر): „hellhäutig", „rothaarig". Laqab.",
    notable: [
      { badge: "sport", name: "Saleem Al-Ashqar (32)", info: "Torwart von Khadamat Khan Younis. Juli 2026 durch Panzerbeschuss bei al-Qarara getötet — einer von über 1.000 getöteten palästinensischen Sportlern seit Oktober 2023.", url: "https://www.newarab.com/news/israeli-forces-kill-palestinian-goalkeeper-al-ashqar-gaza" },
      { badge: "fighter", name: "Abdel-Latif Al-Ashqar", info: "Hochrangiger Hamas-Militäroffizier, zuständig für Waffenbeschaffung. Wurde April 2011 in Port Sudan getötet.", url: "https://ict.org.il/summary-of-terrorist-incidents-and-ct-operations-march-to-may-2011/" }
    ]
  },

  "al-banna": {
    origin: "Von bannāʾ (البناء): „der Baumeister". Berufsname.",
    notable: [
      { badge: "activism", name: "Hasan al-Banna (1906–1949)", info: "Gründer der Muslimbruderschaft 1928. Sein Bruder gründete 1935 die palästinensische Zweigstelle — ideologische Wiege der späteren Hamas.", url: "https://ctc.westpoint.edu/inside-hamas-how-it-thinks-fights-and-governs/" },
      { badge: "fighter", name: "Sabri Khalil al-Banna („Abu Nidal", 1937–2002)", info: "In Jaffa geboren, 1948 mit Familie nach Gaza geflohen. Gründete die Abu-Nidal-Organisation (ANO).", url: "https://www.wrmea.org/1990-february/abu-nidal-portrait-of-a-renegade.html" }
    ]
  },

  "al-bayouk": {
    origin: "In Khan Younis und Süd-Gaza ansässig.",
    notable: [
      { badge: "victims", name: "Ibrahim Shahada Muhammad al-Bayouk", info: "Ziviler Todesfall bei israelischem Luftangriff im al-Samin-Gebiet, südlich von Khan Younis, 30. April 2025.", url: "https://airwars.org/civilian-casualties/ispt300425j-april-30-2025/" }
    ]
  },

  "al-bursh": {
    origin: "Lokaler Gazan-Name.",
    notable: [
      { badge: "medic", name: "Dr. Adnan Ahmad Ateya al-Bursh", info: "Leiter Orthopädie Al-Shifa. Festgenommen 18.12.2023 im Al-Awda-Hospital. Starb 19.4.2024 im Ofer-Gefängnis unter Folterverdacht. Leiche nicht freigegeben.", url: "https://www.un.org/unispal/document/un-expert-horrified-by-death-of-gazan-orthopedic-surgeon-16may24/" }
    ]
  },

  "al-dahdouh": {
    origin: "Stammesname. Die Familie stammt von der Arabischen Halbinsel.",
    notable: [
      { badge: "media", name: "Wael al-Dahdouh", info: "Al Jazeera Gaza-Bürochef. Verlor Frau, Tochter Sham (7), Sohn Mahmoud (15), einen Enkel und später Sohn Hamza bei israelischen Angriffen. Träger des International John Aubuchon Press Freedom Award 2024.", url: "https://en.wikipedia.org/wiki/Wael_Al-Dahdouh" },
      { badge: "media", name: "Hamza al-Dahdouh", info: "Journalist für Al Jazeera, ältester Sohn von Wael. Getötet 7. Januar 2024 in Khan Younis.", url: "https://apnews.com/article/israel-hamas-war-journalist-killed-jazeera-86db4604dde19caa9c29366225a6648e" },
      { badge: "victims", name: "Weitere Familienmitglieder", info: "Wael al-Dahdouhs Frau, Tochter Sham (7), Sohn Mahmoud (15) und ein Enkel wurden 28. Oktober 2023 in Nuseirat getötet.", url: "https://apnews.com/article/dahdouh-aljazeera-war-israel-palestinians-968a24495e1ce420dfe2f9257528c5c4" }
    ]
  },

  "al-dahshan": {
    origin: "Von dahisha (دهش): „staunen“. Al-Dahshan = „der Verwunderte".",
    notable: [
      { badge: "academic", name: "Saeed Talal al-Dahshan (1972–2023)", info: "Professor für Völkerrecht an der Islamischen Universität Gaza. Getötet 11. Oktober 2023 in al-Sabra mit Ehefrau, Sohn, Mutter und etwa zehn weiteren Familienmitgliedern.", url: "https://gazaeducationsector.palestine-studies.org/en/node/3634" },
      { badge: "victims", name: "Al-Dahshan (Apothekerin)", info: "Apothekerin, getötet mit Eltern Haiel Al-Dahshan und Hiba Al-Dahshan (al-Khodari) bei israelischem Luftangriff.", url: "https://gazahcsector.palestine-studies.org/en/node/2267" }
    ]
  },

  "al-fayoumi": {
    origin: "Herkunftsname: al-Fayyūmī = „aus al-Fayyum" (Ägypten).",
    notable: [
      { badge: "victims", name: "Wadee Al-Fayoumi (6)", info: "Palästinensisch-amerikanischer Junge, 14. Oktober 2023 in Plainfield, Illinois, in einem Hassverbrechen ermordet.", url: "https://apnews.com/article/palestinian-family-attacked-illinois-hate-crime-trial-muslim-1c94621e19bd5cece7d323fc188f0611" }
    ]
  },

  "al-ghafri": {
    origin: "Von al-Ghafir (الغافر), „der Vergebende" — einer der Namen Allahs.",
    notable: [
      { badge: "victims", name: "Al-Ghafri Tower", info: "20-stöckiges Wohnhochhaus in West-Gaza, lokal als „Gesicht des alten Gaza" bekannt. 15. September 2025 von israelischen Streitkräften zerstört.", url: "https://www.aa.com.tr/en/middle-east/israeli-army-destroys-gaza-s-tallest-tower-after-evacuation-order/3687991" }
    ]
  },

  "al-ghoul": {
    origin: "Von ghūl (غول), dem mythischen Dämonenwesen der arabischen Folklore.",
    notable: [
      { badge: "media", name: "Ismail al-Ghoul (27)", info: "Al Jazeera-Korrespondent. Getötet 31. Juli 2024 zusammen mit Kameramann Rami al-Rifi in Gaza-Stadt.", url: "https://apnews.com/article/aljazeera-journalists-killed-gaza-war-israel-d22cd40578c0c88d75d85d8cb9601130" },
      { badge: "official", name: "Muhammad Faraj al-Ghoul", info: "Hamas-Justizminister, ernannt November 2008. Leitete Überarbeitung des Strafgesetzbuchs in Gaza.", url: "https://www.academia.edu/2984906/Ideology_and_Practice_The_Legal_System_in_Gaza_under_Hamas" }
    ]
  },

  "al-halabi": {
    origin: "Herkunftsname: al-Ḥalabī = „aus Aleppo" (Syrien).",
    notable: []
  },

  "al-jaabari": {
    origin: "Stammesname mit beduinischen Wurzeln. Der Jabari-Clan ist besonders in Hebron einflussreich.",
    notable: [
      { badge: "fighter", name: "Ahmed Jabari", info: "Militärchef der Qassam-Brigaden bis zu seiner Ermordung 14. November 2012 in Gaza-Stadt.", url: "https://en.wikipedia.org/wiki/Ahmed_Jabari" }
    ]
  },

  "al-jendiya": {
    origin: "Lokaler Gazan-Name. Etymologie unklar.",
    notable: []
  },

  "al-kafarna": {
    origin: "Lokaler Gazan-Name, möglicherweise von einem Ortsnamen abgeleitet.",
    notable: [
      { badge: "victims", name: "Nabila und Basmala Al-Kafarna", info: "Waisenschwestern (fotografiert von AP 2026). Eltern 3. April 2025 bei Angriff auf Schule getötet.", url: "https://apnews.com/photo-essay/gaza-orphans-unicef-photo-essay-745f4ff42fad02a379edc55cd4ecfe4b" },
      { badge: "aid", name: "Ikhlas al-Kafarna (35)", info: "Tante, die sich nach dem Krieg um verwaiste Nichten und Neffen kümmerte.", url: "https://apnews.com/photo-essay/gaza-orphans-unicef-photo-essay-745f4ff42fad02a379edc55cd4ecfe4b" }
    ]
  },

  "al-khayyat": {
    origin: "Berufsname: al-Khayyāṭ = „der Schneider".",
    notable: [
      { badge: "medic", name: "Dr. Tamer al-Khayyat", info: "Arzt aus Rafah. Getötet 13. Oktober 2023 zusammen mit Ehefrau Dr. Razan al-Khayyat und Tochter.", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" },
      { badge: "medic", name: "Dr. Razan al-Khayyat", info: "Ärztin, arbeitete im Emirates Crescent Hospital und al-Shifa. Getötet mit Ehemann und Tochter.", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" }
    ]
  },

  "al-maqadma": {
    origin: "Lokaler Gazan-Name.",
    notable: [
      { badge: "medic", name: "Dr. Ahmad al-Maqadma", info: "Plastischer Chirurg, Mitglied des Royal College of Surgeons of England. Getötet 22. März 2024 zusammen mit Mutter Dr. Yusra al-Maqadma (Mathematiklehrerin). Leichen im Hof von al-Shifa gefunden.", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" },
      { badge: "academic", name: "Dr. Yusra al-Maqadma", info: "Mathematiklehrerin und Mutter von Dr. Ahmad al-Maqadma. Getötet mit ihrem Sohn.", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" }
    ]
  },

  "al-nabahin": {
    origin: "Beduinen-Clan in Gaza. Von n-b-h (adelig, berühmt).",
    notable: [
      { badge: "sport", name: "Basem Al-Nabahin", info: "Basketballspieler. Getötet bei israelischen Luftangriffen auf Gaza 2023–2024.", url: "https://www.sportspolitika.news/p/list-athletes-gaza-killed-israel-war" },
      { badge: "academic", name: "Haitham Muhammad Al-Nabahin", info: "Prominenter Programmierer und IT-Experte des Gazastreifens. Getötet März 2024 in Bureij mit Ehefrau.", url: "https://reliefweb.int/report/occupied-palestinian-territory/israel-targets-information-technology-experts-part-its-genocide-gaza-enar" }
    ]
  },

  "al-qassas": {
    origin: "Berufsname: al-Qaṣṣāṣ = „der Geschichtenerzähler", „der Chronist".",
    notable: [
      { badge: "victims", name: "Rashad Qasas", info: "Getötet in Rafah auf dem Weg zu einer Hilfsgüterverteilung; Beerdigung von AP im Juni 2025 fotografiert.", url: "https://apnews.com/photo-gallery/mideast-wars-gaza-journalists-killed-photos-a19cdcbab5d0f043c7f80a3f7cffc50f" }
    ]
  },

  "al-qrinawi": {
    origin: "Herkunftsname: al-Qarārawī = „aus al-Qarāra" (nördlich von Khan Younis).",
    notable: [
      { badge: "victims", name: "Muneer al-Qrinawi", info: "Ziviler Todesfall, dokumentiert in Gazakriegsaufzeichnungen.", url: "https://www.bloodlinesbook.com/salt-water-a-living-count" },
      { badge: "prisoner", name: "Karam Jaber Odah al-Qrinawi (22)", info: "Festgenommen Dezember 2014 nahe dem Grenzzaun östlich von al-Bureij.", url: "https://pchrgaza.org/weekly-report-on-israeli-human-rights-violations-in-the-occupied-palestinian-territory-18-23-dec-2014/" }
    ]
  },

  "al-qudra": {
    origin: "Von qudra (قدرة): „Kraft", „Fähigkeit", „Macht".",
    notable: [
      { badge: "medic", name: "Dr. Ashraf al-Qudra", info: "Langjähriger Sprecher des Hamas-geführten Gesundheitsministeriums in Gaza. Wurde zum international bekannten Gesicht der Gesundheitskrise während des Krieges.", url: "https://apnews.com/article/israel-hamas-war-live-updates-11-20-2023-9913a29b48afc4a75e724674fe51bd82" }
    ]
  },

  "al-rantisi": {
    origin: "Stammesname, verankert in Khan Younis und Jabalia.",
    notable: [
      { badge: "official", name: "Abdel Aziz al-Rantisi (1947–2004)", info: "Mitbegründer von Hamas und Nachfolger von Ahmed Yassin. Ermordet April 2004 bei israelischem Luftangriff auf sein Auto.", url: "https://en.wikipedia.org/wiki/Abdel_Aziz_al-Rantisi" },
      { badge: ["official","activism"], name: "Jamila Abdallah Taha al-Shanti (1944–2023)", info: "Witwe von al-Rantisi, erste Frau im Hamas-Politbüro Gaza. Gründete den Frauenflügel von Hamas. Getötet Oktober 2023.", url: "https://www.ynetnews.com/article/hkuwcdrwt" },
      { badge: "medic", name: "Dr. Iyad al-Rantisi", info: "Gynäkologe, Leiter Geburtenabteilung Kamal Adwan Hospital. Festgenommen 10.11.2023; starb 6 Tage später im Shikma-Gefängnis.", url: "https://www.un.org/unispal/document/sitrep-181-gaza-strip-ocha-21jun24/" }
    ]
  },

  "al-sharif": {
    origin: "Von sharīf (شريف): „edel", „ehrenhaft", „von vornehmer Abstammung".",
    notable: [
      { badge: "media", name: "Anas al-Sharif (1996–2025)", info: "Al Jazeera Arabisch-Journalist aus Jabalia. Pulitzer-Preis 2024 (Reuters-Team). Getötet 10. August 2025 bei Angriff auf Medienzelt vor Al-Shifa.", url: "https://en.wikipedia.org/wiki/Anas_Al-Sharif" },
      { badge: "victims", name: "Karam al-Sharif", info: "UNRWA-Mitarbeiter, verlor eineiige Söhne Kenan und Neman (18 Monate) sowie Töchter Joud (5) und Tasnim (10) bei Angriff auf Nuseirat, November 2023.", url: "https://apnews.com/article/israel-hamas-11-1-2023-children-killed-4a352398b32887e60a658e0270f0a021" }
    ]
  },

  "al-shawa": {
    origin: "Eine der ältesten und prominentesten Familien in Gaza-Stadt.",
    notable: [
      { badge: "diplomat", name: "Rashad al-Shawa", info: "Bürgermeister von Gaza (ernannt 1971). Gründete 1983 das Rashad al-Shawa Cultural Center und al-Shawa Press.", url: "https://www.palestine-studies.org/en/node/1657550" },
      { badge: "culture", name: "Rawya Rashad Shawa", info: "Künstlerin und Kulturfigur, Tochter von Rashad al-Shawa. Geboren 1948 in Gaza, gestorben 2017.", url: "https://passia.org/personalities/page/7/" },
      { badge: "academic", name: "Majdi al-Shawa", info: "Gazaner Doktor der Chemie, schrieb 1930er über Zement und nationale Wirtschaft.", url: "https://www.palestine-studies.org/sites/default/files/jqpdf/JQ%2079%20-%20Full%20Issue%20with%20Covers.pdf" }
    ]
  },

  "al-shrafi": {
    origin: "In Jabaliya und Nordgaza über Generationen dokumentiert.",
    notable: [
      { badge: "media", name: "Momen Al Sharafi", info: "Al Jazeera-Korrespondent. Dezember 2023: 21 Familienmitglieder bei Angriff auf Jabalia getötet.", url: "https://www.dawn.com/news/1795616" },
      { badge: "victims", name: "Samir al-Shrafi", info: "47-jähriger Hausbesitzer, getötet 4. Januar 2009 durch Drohnenrakete in Jabalia.", url: "https://reliefweb.int/report/occupied-palestinian-territory/opt-10th-day-iof-crimes-gaza-death-toll-rises-489-including-89" },
      { badge: "victims", name: "Ramzi Mowafaq al-Shrafi", info: "16-jähriger Schüler, getötet November 2006 auf dem Weg zur Schule in Jabalia.", url: "https://www.rememberthesechildren.org/remember2006.html" },
      { badge: "victims", name: "Abdel Rahman Al Shrafi", info: "Getötet August 2014 in Al-Saftawi, Nord-Gaza.", url: "https://mezan.org/public/en/post/19294" }
    ]
  },

  "al-sultan": {
    origin: "Von sultān (سلطان): „Herrscher", „Macht".",
    notable: [
      { badge: "medic", name: "Dr. Marwan al-Sultan", info: "Direktor des Indonesischen Hospitals und Kardiologe. Getötet 2. Juli 2025 mit acht Familienmitgliedern in West-Gaza.", url: "https://www.aa.com.tr/en/features/1-000-days-of-israeli-genocide-gaza-doctors-medics-pay-heavy-price-in-line-of-duty/3984520" }
    ]
  },

  "al-taweel": {
    origin: "Von al-ṭawīl (الطويل): „der Lange". Laqab.",
    notable: [
      { badge: "culture", name: "Tha'er Al-Taweel", info: "43-jähriger Bildender Künstler aus Gaza. Getötet während des Krieges; dokumentiert im Gaza Cultural Sector Martyrs Project.", url: "https://gazacultrualsector.palestine-studies.org/en/Martyrs_Culture" },
      { badge: "culture", name: "Adel Al Taweel", info: "1995 in Nuseirat geboren. Bildender Künstler, Absolvent der Al-Aqsa-Universität. Siedelte 2024 nach Frankreich über.", url: "https://aa-e.org/en/artiste/adel-al-taweel-2/" }
    ]
  },

  "al-zahar": {
    origin: "Von zahr (زهر): „Blüte" oder zāhir (ظاهر): „sichtbar", „offensichtlich".",
    notable: [
      { badge: "official", name: "Mahmoud al-Zahar (1945–)", info: "Mitbegründer von Hamas, Chirurg, Außenminister 2006. Überlebte mehrere Attentatsversuche. Gilt als radikalster Hamas-Führer.", url: "https://en.wikipedia.org/wiki/Mahmoud_al-Zahar" },
      { badge: "fighter", name: "Hussam al-Zahar", info: "Sohn von Mahmoud al-Zahar, Feldkommandeur. Getötet Januar 2008 bei Kämpfen an Gazas Rand.", url: "https://www.ynetnews.com/articles/0,7340,L-3494565,00.html" },
      { badge: "victims", name: "Khaled al-Zahar", info: "Sohn von Mahmoud al-Zahar. Getötet 2003 bei missglücktem Attentat auf seinen Vater.", url: "https://www.ynetnews.com/articles/0,7340,L-3495656,00.html" }
    ]
  },

  "anas": {
    origin: "Vom Vornamen Anas (أنس): „freundlicher Umgang", „Geselligkeit". Gefährte des Propheten.",
    notable: []
  },

  "ayyad": {
    origin: "Von ʿAyyād (عياد): „geboren am Festtag" oder „Helfer".",
    notable: [
      { badge: "culture", name: "Hassan Ayyad", info: "14-jähriger Sänger aus Gaza, bekannt für Lieder über das Leben unter Belagerung. Getötet Mai 2025 in Nuseirat.", url: "https://www.commondreams.org/news/hassan-ayyad" },
      { badge: "victims", name: "Rami Khader Ayyad (29)", info: "Leiter des einzigen christlichen Buchladens in Gaza. Entführt und Oktober 2007 ermordet.", url: "https://banneroftruth.org/us/resources/articles/2008/christians-in-gaza/" }
    ]
  },

  "banna": {
    origin: "Siehe al-banna.",
    notable: []
  },

  "barhoum": {
    origin: "Von barhūm (برحوم): „Bärenkraut".",
    notable: [
      { badge: "fighter", name: "Khamis Barhoum", info: "Stellvertretender Kommandeur Rafah-Brigade. Verantwortlich für Massaker von Kerem Shalom am 7. Oktober. Getötet März 2025.", url: "https://www.ynetnews.com/article/skd8m11p2ke" }
    ]
  },

  "batsh": {
    origin: "Siehe al-batsh.",
    notable: []
  },

  "bayouk": {
    origin: "Siehe al-bayouk.",
    notable: []
  },

  "dahdouh": {
    origin: "Siehe al-dahdouh.",
    notable: []
  },

  "daher": {
    origin: "Von ẓāhir (ظاهر): „sichtbar", „offensichtlich".",
    notable: []
  },

  "dahshan": {
    origin: "Siehe al-dahshan.",
    notable: []
  },

  "farajallah": {
    origin: "Zusammensetzung: Faraj (Erlösung) + allah (Gott).",
    notable: []
  },

  "fayoumi": {
    origin: "Siehe al-fayoumi.",
    notable: []
  },

  "fayyad": {
    origin: "Von fayyāḍ (فياض): „der Großzügige".",
    notable: []
  },

  "ghoul": {
    origin: "Siehe al-ghoul.",
    notable: []
  },

  "hammouda": {
    origin: "Diminutiv von Hammud, Variante von Ahmad.",
    notable: []
  },

  "hassanein": {
    origin: "Von Ḥasanayn (حسنين): „die beiden Hasan" (Hasan und Hussein).",
    notable: [
      { badge: "media", name: "Saeed Abu Hassanein", info: "Journalist; starb April 2025 in Khan Younis. 212. getöteter Journalist in Gaza seit Oktober 2023.", url: "https://www.aa.com.tr/en/middle-east/israeli-army-killed-212-palestinian-journalists-in-gaza-since-oct-2023/3548708" },
      { badge: "media", name: "Rula Hassanein", info: "Journalistin für Wattan Media Network. Festgenommen und inhaftiert; Januar 2025 freigelassen.", url: "https://samidoun.net/2024/11/prisoner-rula-hassanein-between-motherhood-and-the-walls-of-damon-prison/" }
    ]
  },

  "hilu": {
    origin: "Von ḥilū (حلو): „süß". Kosename.",
    notable: []
  },

  "hindi": {
    origin: "Siehe al-hindi.",
    notable: []
  },

  "jendiya": {
    origin: "Siehe al-jendiya.",
    notable: []
  },

  "jumaa": {
    origin: "Von jumʿa (جمعة): „Freitag".",
    notable: []
  },

  "kafarna": {
    origin: "Siehe al-kafarna.",
    notable: []
  },

  "karam": {
    origin: "Von karam (كرم): „Großzügigkeit".",
    notable: []
  },

  "khayyat": {
    origin: "Siehe al-khayyat.",
    notable: []
  },

  "kurd": {
    origin: "Siehe al-kurd.",
    notable: []
  },

  "lubbad": {
    origin: "Etymologie nicht umfassend dokumentiert. Bekannt in Gazas medizinischer Gemeinschaft.",
    notable: [
      { badge: "medic", name: "Dr. Rafat (Rafet) Lubbad", info: "Leiter Innere Medizin Shifa-Hospital, Spezialist für Autoimmunerkrankungen. Getötet November 2023 mit 7 Familienmitgliedern.", url: "https://apnews.com/article/gaza-doctor-killed-israeli-airstrike-527ee681c4e1155bb24f4380d011fe5d" }
    ]
  },

  "madi": {
    origin: "Von mādiy (ماضي): „Vergangenheit" oder Kurzform von Majd (Ruhm).",
    notable: [
      { badge: "victims", name: "Musa Ghaleb Ibrahim Madi (25)", info: "Getötet Mai 2021 in Gaza bei Angriff auf sein Motorrad.", url: "https://imemc.org/article/pchr-weekly-report-on-israeli-human-rights-violations-in-the-occupied-palestinian-territory-24/" }
    ]
  },

  "maqadma": {
    origin: "Siehe al-maqadma.",
    notable: []
  },

  "nabahin": {
    origin: "Siehe al-nabahin.",
    notable: []
  },

  "qashta": {
    origin: "Möglicherweise von qaṣhta (قشطة): „Sahne". Berufsname.",
    notable: [
      { badge: "media", name: "Mohammed Salah Qashta", info: "Journalist. Getötet 21. Januar 2026 in Al-Zahra zusammen mit zwei anderen Journalisten.", url: "https://www.unesco.org/en/articles/unesco-director-general-condemns-killing-journalists-abdul-raouf-shaat-anas-ghoneim-and-mohammed" },
      { badge: "victims", name: "Qeshta-Familie", info: "12 Zivilisten, darunter Frauen und Kinder, getötet bei Angriff auf Haus in Rafah, 6. November 2023.", url: "https://airwars.org/civilian-casualties/ispt0915-november-6-2023/" }
    ]
  },

  "qassas": {
    origin: "Siehe al-qassas.",
    notable: []
  },

  "qrinawi": {
    origin: "Siehe al-qrinawi.",
    notable: []
  },

  "qudra": {
    origin: "Siehe al-qudra.",
    notable: []
  },

  "rantisi": {
    origin: "Siehe al-rantisi.",
    notable: []
  },

  "safi": {
    origin: "Von ṣafī (صافي): „rein".",
    notable: []
  },

  "salha": {
    origin: "Diminutiv oder weibliche Form von Salih/Salah.",
    notable: []
  },

  "saydam": {
    origin: "Von ṣaydām (صيدام): „starker Mann". Spitzname.",
    notable: [
      { badge: "medic", name: "Dr. Midhat Saydam", info: "Professor Plastische Chirurgie, Gründer Brandverletzten-Station Shifa. Getötet 14. Oktober 2023 mit gesamter Familie in Tel al-Hawa.", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" }
    ]
  },

  "sharab": {
    origin: "Von sharāb (شراب): „Getränk". Berufsname.",
    notable: [
      { badge: "culture", name: "Naji Abdel Qader Sharab", info: "Kalligraph und Kunstlehrer aus Gaza-Stadt. Getötet 13. August 2024.", url: "https://gazacultrualsector.palestine-studies.org/en/node/4805" }
    ]
  },

  "sharif": {
    origin: "Siehe al-sharif.",
    notable: []
  },

  "shawa": {
    origin: "Siehe al-shawa.",
    notable: []
  },

  "shrafi": {
    origin: "Siehe al-shrafi.",
    notable: []
  },

  "sobh": {
    origin: "Von ṣubḥ (صبح): „Morgen".",
    notable: []
  },

  "sultan": {
    origin: "Siehe al-sultan.",
    notable: []
  },

  "tafesh": {
    origin: "Verbreitet im Levante mit Wurzeln in Safed.",
    notable: [
      { badge: "culture", name: "Youssef Muhammad Tafesh", info: "Palästinensischer Dichter, geboren 1938 in Safed.", url: "https://www.all4palestine.org/ModelDetails.aspx?gid=7&mid=78075" },
      { badge: "culture", name: "Nasreen Tafesh", info: "Bekannte syrisch-palästinensisch-algerische Schauspielerin.", url: "https://en.everybodywiki.com/Nesreen_Abdelrhman_tafesh" }
    ]
  },

  "taweel": {
    origin: "Siehe al-taweel.",
    notable: []
  },

  "watfa": {
    origin: "Siehe abu watfa.",
    notable: []
  },

  "zaharna": {
    origin: "Siehe al-zaharna.",
    notable: []
  },

  "zarab": {
    origin: "Persisch-arabisch: zar (Gold) + ab (Wasser) = „Goldenes Wasser".",
    notable: [
      { badge: "victims", name: "Odai Zarab (13) und Bruder (15)", info: "Zwei Brüder, Juli 2014 in Gaza bei Operation Protective Edge getötet.", url: "https://d3n8a8pro7vhmx.cloudfront.net/dcipalestine/pages/530/attachments/original/1436292897/OPE_A_War_Waged_on_Children.pdf?1436292897" }
    ]
  }

};
