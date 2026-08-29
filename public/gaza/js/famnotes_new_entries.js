// =============================================================================
// ERGÄNZUNG zu window.FAM_NOTES — Neue Familien mit recherchierten Notizen
// =============================================================================
// Diese Einträge können direkt in die bestehende window.FAM_NOTES = { ... }
// eingefügt werden (nach dem letzten Eintrag, vor dem schließenden `};`).
//
// Kategorien (badge):
//   "fighter"   = ★ dokumentierte(r) Kämpfer/Kommandeur(in)
//   "medic"     = ✚ Sanitäter-/Medizin-Fall
//   "prisoner"  = ⛓ Austausch-Häftling
//   "official"  = ◆ Hamas-Funktionär
//   "victims"   = ● international bekannter Zivilopfer-Fall
//   "media"     = ◎ Medien / Fotojournalismus
//   "culture"   = ✦ Kunst / Literatur
//   "activism"  = ⚑ Zivilgesellschaft / Aktivismus
//   "diplomat"  = ◇ Politik / Diplomatie
//   "aid"       = ♥ humanitäre Hilfe
//   "academic"  = ▦ Wissenschaft / Bildung
//   "sport"     = 🏅 Sport
// =============================================================================

  // ---------------------------------------------------------------------------
  // A
  // ---------------------------------------------------------------------------

  "aal": {
    origin: "Arabisch Āl (آل), nobles Stammespräfix: „Nachkommen von…“ — historisch für mächtige dynastische Familien reserviert (vgl. Āl Saʿūd). In Gaza Zeichen für beanspruchtes adeliges oder tribales Erbe.",
    notable: []
  },

  "afana": {
    origin: "Arabisch ʿAfanā (عفانة): „der Verzeihende“, „der Strahlende“. Indirekter Quranischer Name, abgeleitet von der Wurzel ʿ-f-n.",
    notable: [
      { badge: "academic", name: "Hussam al-Din Musa Afana", info: "Palästinensischer Jurist, Mufti und Reformator; Professor für Rechtswissenschaft an der Al-Quds-Universität; Autor von Dutzenden Büchern.", url: "https://www.all4palestine.org/ModelDetails.aspx?gid=10&mid=118839" }
    ]
  },

  "afifi": {
    origin: "Arabisch ʿAfīfī (عفيفي): abgeleitet von ʿafīf („rein, keusch, bescheiden“). Deskriptiver Name.",
    notable: []
  },

  "abu eida": {
    origin: "Kunya (patronymisch): Abu (Vater von) + Eida (von ʿĪd, „Fest“). Typisches palästinensisches Namensmuster.",
    notable: [
      { badge: "victims", name: "Abu-Eida-Platz-Massaker", info: "Euro-Med-HRM: Israelischer Luftangriff auf den Abu-Eida-Platz im Flüchtlingslager Jabalia, November 2023. Etwa 120 Tote, überwiegend aus einer erweiterten Familie.", url: "https://euromedmonitor.org/en/article/6369/" }
    ]
  },

  "abu hashem": {
    origin: "Kunya: Abu (Vater von) + Hashem. Hashem = Name des Urgroßvaters des Propheten Mohammed; verbreiteter Name unter den Nachfahren der Banu Hashim.",
    notable: []
  },

  "abu samra": {
    origin: "Kunya: Abu (Vater von) + Samra („die Brünette/die Dunkelhäutige“). Wurde zu einem erblichen Familiennamen, auch ohne Sohn namens Samra.",
    notable: [
      { badge: "sport", name: "Nagham Abu Samra (24)", info: "Palästinensische Karate-Meisterin, Schwarzgurtträgerin und Gründerin eines Sportzentrums in Gaza. Verlor im Dezember 2023 ein Bein bei einem israelischen Luftangriff auf Nuseirat; starb im Januar 2024 in einem ägyptischen Krankenhaus.", url: "https://www.thenationalnews.com/mena/palestine-israel/2024/01/12/gaza-karate-champion-hit-by-israeli-strike-succumbs-to-injuries-at-hospital-in-egypt/" }
    ]
  },

  "abu tuaima": {
    origin: "Kunya: Abu (Vater von) + Tuaima (Diminutiv von Tuma/Thomas, also „Vater des kleinen Thomas“). Christlich-arabisches Namensmuster.",
    notable: []
  },

  "al-agha": {
    origin: "Arabisch al-Āghā (الآغا): osmanischer Adelstitel, ursprünglich türkisch „Agha“ (Herr/Meister). Wurde zu einem Familiennamen unter Familien mit osmanischem Beamten- oder Militärhintergrund.",
    notable: []
  },

  "al-aqqad": {
    origin: "Arabisch al-ʿAqqād (العقاد): „der Nagler“, „der Fesseler“ — Berufsname oder Spitzname für jemanden, der mit Holz oder Metall arbeitete.",
    notable: []
  },

  "al-areer": {
    origin: "Familie aus dem Viertel Al-Shujaiya in Gaza-Stadt. Der Name ist lokal verankert.",
    notable: [
      { badge: ["culture", "academic"], name: "Dr. Refaat Alareer", info: "Dichter, Geschichtenerzähler und Professor an der Islamischen Universität Gaza. Herausgeber von „Gaza Writes Back“. Wurde am 6.12.2023 gezielt bombardiert, während er bei seiner Schwester Asmaa wohnte. Verfasste das berühmte Gedicht „If I Must Die“.", url: "https://en.wikipedia.org/wiki/Refaat_Alareer" },
      { badge: "victims", name: "Familie Alareer (6.12.2023)", info: "Refaat wurde zusammen mit Bruder Salah, Neffe Muhammad, Schwester Asmaa und drei ihrer Kinder (Alaa, Yahya, Muhammad) getötet. Die Wohnung wurde „chirurgisch“ bombardiert — nur diese eine Wohnung im Gebäude.", url: "https://electronicintifada.net/blogs/tamara-nassar/refaat-alareer-was-assassinated-israel" },
      { badge: "victims", name: "Shaymaa Alareer", info: "Tochter von Refaat Alareer. Wurde am 16.4.2024 zusammen mit Ehemann und Neugeborenem getötet — sechs Monate nach dem Tod ihres Vaters.", url: "https://www.euppublishing.com/doi/full/10.3366/hlps.2025.0362" },
      { badge: "victims", name: "Brüder Mohammed und Hamada Alareer", info: "Beide bei israelischen Angriffen 2014 getötet. Refaat schrieb: „Mein Bruder wird Märtyrer Nummer 26 in meiner erweiterten Familie.“", url: "https://electronicintifada.net/blogs/tamara-nassar/refaat-alareer-was-assassinated-israel" },
      { badge: "victims", name: "Onkel Tayseer Alareer", info: "Wurde 2001 von israelischen Streitkräften erschossen, während er auf seinem Land östlich von Al-Shujaiya arbeitete.", url: "https://themarkaz.org/a-students-tribute-to-refaat-alareer-gazas-beloved-storyteller/" }
    ]
  },

  "al-ashqar": {
    origin: "Arabisch ašqar (أشقر): „hellhäutig“, „rosige Wangen“, „rothaarig“. Klassischer Laqab (Spitzname), der auf einen auffälligen physischen Merkmal hinweist.",
    notable: [
      { badge: "sport", name: "Saleem Al-Ashqar (32)", info: "Torwart des Fußballclubs Khadamat Khan Younis. Wurde im Juli 2026 durch israelischen Panzerbeschuss bei al-Qarara getötet — einer von über 1.000 palästinensischen Sportlern, die seit Oktober 2023 getötet wurden.", url: "https://www.newarab.com/news/israeli-forces-kill-palestinian-goalkeeper-al-ashqar-gaza" },
      { badge: "fighter", name: "Abdel-Latif Al-Ashqar", info: "Hochrangiger Hamas-Militäroffizier, zuständig für Waffenbeschaffung. Wurde im April 2011 bei einem Raketenangriff in Port Sudan getötet.", url: "https://ict.org.il/summary-of-terrorist-incidents-and-ct-operations-march-to-may-2011/" }
    ]
  },

  "al-attar": {
    origin: "Berufsname: al-ʿAṭṭār (العطار) = „der Gewürzhändler“, „der Parfümeur“. Klassischer Berufsname für jemanden, der mit Duftstoffen, Kräutern und Gewürzen handelte.",
    notable: []
  },

  "al-banna": {
    origin: "Berufsname: al-Bannāʾ (البناء) = „der Baumeister“, „der Maurer“, „der Zimmermann“. Von der Wurzel bana (bauen).",
    notable: [
      { badge: "activism", name: "Hasan al-Banna (1906–1949)", info: "Gründer der Muslimbruderschaft in Ismailia, Ägypten, 1928. Sein Bruder Abd al-Rahman al-Banna gründete 1935 die Muslimbruderschaft in Palästina — die ideologische Wiege der späteren Hamas.", url: "https://ctc.westpoint.edu/inside-hamas-how-it-thinks-fights-and-governs/" },
      { badge: "fighter", name: "Sabri Khalil al-Banna („Abu Nidal“, 1937–2002)", info: "In Jaffa geboren, floh 1948 mit seiner Familie nach Gaza. Gründete die Abu-Nidal-Organisation (ANO), eine militante palästinensische Splittergruppe.", url: "https://www.wrmea.org/1990-february/abu-nidal-portrait-of-a-renegade.html" }
    ]
  },

  "al-batsh": {
    origin: "Arabisch al-Baṭsh (البطش): „die Gewalt“, „das strenge Vorgehen“. Möglicherweise ein Spitzname für jemanden mit harter Hand oder militärischem Hintergrund.",
    notable: [
      { badge: ["fighter", "official"], name: "Adnan al-Batsh", info: "Hochrangiger Hamas-Militäroffizier und Kommandeur der Qassam-Brigaden in Süd-Gaza. Wurde 2014 bei einem israelischen Luftangriff getötet.", url: "https://www.reuters.com/article/us-palestinians-israel-hamas-idUSKBN0G720L/" }
    ]
  },

  "al-bayouk": {
    origin: "Herkunft nicht eindeutig dokumentiert. Die Familie ist in Khan Younis und Süd-Gaza ansässig.",
    notable: [
      { badge: "victims", name: "Ibrahim Shahada Muhammad al-Bayouk", info: "Ziviler Todesfall bei israelischem Luftangriff im al-Samin-Gebiet, südlich von Khan Younis, am 30. April 2025.", url: "https://airwars.org/civilian-casualties/ispt300425j-april-30-2025/" }
    ]
  },

  "al-biari": {
    origin: "Herkunftsname: al-Biārī (البيري / البياري) = „aus dem Brunnen/dem Wasser“ oder abgeleitet von einem Ortsnamen mit Wasserquelle.",
    notable: []
  },

  "al-bursh": {
    origin: "Lokal verankerter Familienname in Gaza-Stadt.",
    notable: [
      { badge: "medic", name: "Dr. Adnan Ahmad Ateya al-Bursh", info: "Leiter der Orthopädie am Al-Shifa-Krankenhaus, Gaza. Wurde am 18.12.2023 bei der Arbeit im Al-Awda-Hospital festgenommen. Starb am 19.4.2024 im israelischen Ofer-Gefängnis unter Folterverdacht. Die Leiche wurde nicht freigegeben.", url: "https://www.un.org/unispal/document/un-expert-horrified-by-death-of-gazan-orthopedic-surgeon-16may24/" }
    ]
  },

  "al-dahdouh": {
    origin: "Stammesname/Herkunftsname. Die Familie stammt ursprünglich von der Arabischen Halbinsel. „Dahdouh“ ist eine Diminutiv- oder Variantenform, verwandt mit „al-Dahdah“.",
    notable: [
      { badge: "media", name: "Wael al-Dahdouh", info: "Al Jazeera Gaza-Bürochef, Symbol des palästinensischen Journalismus während des Gazakriegs. Verlor Frau, Tochter Sham (7), Sohn Mahmoud (15), einen Enkel und später Sohn Hamza bei israelischen Luftangriffen. Wurde im Dezember 2023 verletzt. Träger des International John Aubuchon Press Freedom Award 2024.", url: "https://en.wikipedia.org/wiki/Wael_Al-Dahdouh" },
      { badge: "media", name: "Hamza al-Dahdouh", info: "Journalist für Al Jazeera, ältester Sohn von Wael. Wurde am 7. Januar 2024 bei einem israelischen Luftangriff in Khan Younis getötet.", url: "https://apnews.com/article/israel-hamas-war-journalist-killed-jazeera-86db4604dde19caa9c29366225a6648e" },
      { badge: "victims", name: "Weitere Familienmitglieder", info: "Wael al-Dahdouhs Frau, Tochter Sham (7), Sohn Mahmoud (15) und ein Enkel wurden am 28. Oktober 2023 bei einem Angriff auf das Flüchtlingslager Nuseirat getötet.", url: "https://apnews.com/article/dahdouh-aljazeera-war-israel-palestinians-968a24495e1ce420dfe2f9257528c5c4" }
    ]
  },

  "al-dahshan": {
    origin: "Von der arabischen Wurzel dahisha (دهش): „verwundert sein“, „staunen“. Al-Dahshan = „der Verwunderte“ — ein Spitzname für jemanden mit ausdrucksstarker oder staunender Persönlichkeit.",
    notable: [
      { badge: "academic", name: "Saeed Talal al-Dahshan (1972–2023)", info: "Professor für Völkerrecht an der Islamischen Universität Gaza. Wurde am 11. Oktober 2023 bei einem israelischen Luftangriff auf sein Haus im Viertel al-Sabra getötet — zusammen mit Ehefrau, Sohn, Mutter und etwa zehn weiteren Familienmitgliedern.", url: "https://gazaeducationsector.palestine-studies.org/en/node/3634" },
      { badge: "victims", name: "Al-Dahshan (Apothekerin)", info: "Eine Apothekerin namens Al-Dahshan wurde zusammen mit ihren Eltern Haiel Al-Dahshan und Hiba Al-Dahshan (al-Khodari) bei einem israelischen Luftangriff getötet.", url: "https://gazahcsector.palestine-studies.org/en/node/2267" }
    ]
  },

  "al-falujah": {
    origin: "Herkunftsname: al-Fallūja (الفالوجة) = „aus Falluja“, einer Stadt im Irak. Wie viele palästinensische Familiennamen deutet er auf Migration oder Handelsbeziehungen hin.",
    notable: []
  },

  "al-farra": {
    origin: "Berufsname/Herkunftsname. al-Farrāʾ (الفراء) = „der Viehhändler“ oder „der Maultierzüchter“. Alternativ von Farra = „fliehen, entkommen“ — möglicherweise ein Spitzname für Flüchtlinge.",
    notable: []
  },

  "al-fayoumi": {
    origin: "Herkunftsname: al-Fayyūmī (الفيومي) = „aus al-Fayyum“, einer Oasenstadt in Ägypten. Die Nisba-Endung -i zeigt Herkunft aus dieser Region.",
    notable: [
      { badge: "victims", name: "Wadee Al-Fayoumi (6)", info: "Palästinensisch-amerikanischer Junge, der am 14. Oktober 2023 in Plainfield, Illinois, in einem Hassverbrechen ermordet wurde. Sein Vermieter Joseph Czuba stach auf ihn und seine Mutter ein, weil sie Muslime und Palästinenser waren.", url: "https://apnews.com/article/palestinian-family-attacked-illinois-hate-crime-trial-muslim-1c94621e19bd5cece7d323fc188f0611" }
    ]
  },

  "al-ghafri": {
    origin: "Von al-Ghafir (الغافر), „der Vergebende“ — einer der Namen Allahs. Als Familienname Zeichen für religiöse oder moralische Tugend.",
    notable: [
      { badge: "victims", name: "Al-Ghafri Tower", info: "20-stöckiges Wohnhochhaus in West-Gaza, lokal als „Gesicht des alten Gaza“ bekannt. Am 15. September 2025 von israelischen Streitkräften zerstört, nachdem Bewohner zur Evakuierung aufgefordert wurden.", url: "https://www.aa.com.tr/en/middle-east/israeli-army-destroys-gaza-s-tallest-tower-after-evacuation-order/3687991" }
    ]
  },

  "al-ghandour": {
    origin: "Arabisch al-Ghandūr (الغندور): „der stolze Mann“, „der aufrechte Mensch“. Ein Laqab (Spitzname) für jemanden mit würdevollem Auftreten.",
    notable: [
      { badge: "fighter", name: "Ahmed Ghandour", info: "Brigadekommandeur Nord-Gaza der Qassam-Brigaden. Wurde im November 2023 getötet.", url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },

  "al-ghoul": {
    origin: "Von arabisch ghūl (غول), das mythische Dämonenwesen der arabischen Folklore. Begann als Spitzname für jemanden, der als wild oder furchteinflößend galt.",
    notable: [
      { badge: "media", name: "Ismail al-Ghoul (27)", info: "Al Jazeera-Korrespondent. Wurde am 31. Juli 2024 zusammen mit Kameramann Rami al-Rifi bei einem israelischen Luftangriff in Gaza-Stadt getötet.", url: "https://apnews.com/article/aljazeera-journalists-killed-gaza-war-israel-d22cd40578c0c88d75d85d8cb9601130" },
      { badge: "official", name: "Muhammad Faraj al-Ghoul", info: "Hamas-Justizminister, ernannt im November 2008. Leitete die Überarbeitung des Strafgesetzbuchs in Gaza.", url: "https://www.academia.edu/2984906/Ideology_and_Practice_The_Legal_System_in_Gaza_under_Hamas" }
    ]
  },

  "al-haddad": {
    origin: "Berufsname: al-Ḥaddād (الحداد) = „der Schmied“. Einer der klassischen arabischen Berufsnamen, verbreitet im gesamten Nahen Osten.",
    notable: [
      { badge: "fighter", name: "Az al-Din al-Haddad", info: "Kommandeur der Gaza-Stadt-Brigade der Qassam-Brigaden. Überlebte mehrere Attentatsversuche; beide Söhne (Nukhba-Kommandeure) wurden im Krieg getötet.", url: "https://www.ynetnews.com/article/syd4200lake" }
    ]
  },

  "al-halabi": {
    origin: "Herkunftsname: al-Ḥalabī (الحلبي) = „aus Aleppo“ (Ḥalab), der syrischen Metropole. Wie viele andere Gazan-Familien deutet der Name auf Herkunft aus dem nördlichen Levante hin.",
    notable: []
  },

  "al-hassi": {
    origin: "Möglicherweise von der Wurzel ḥ-ṣ-ṣ (umgeben, einschließen) oder von ḥāṣī (Brunnen, umschlossener Ort). Toponymischer oder deskriptiver Name.",
    notable: []
  },

  "al-hawajri": {
    origin: "Großfamilie im Raum Nuseirat (Zentralgaza).",
    notable: [
      { badge: "fighter", name: "Haitham al-Hawajri", info: "Kommandeur des Schati-Bataillons der Qassam-Brigaden. Ziel eines fehlgeschlagenen Anschlags Anfang 2025, später als getötet gemeldet.", url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },

  "al-hindi": {
    origin: "Herkunftsname: al-Hindī (الهندي) = „der Inder“ — ursprünglich für jemanden aus Indien oder mit indischen Vorfahren. In palästinensischem Kontext oft auf historische Handelsbeziehungen oder Migration zurückzuführen.",
    notable: []
  },

  "al-jaabari": {
    origin: "Stammesname mit beduinischen Wurzeln. Der Jabari-Clan ist besonders im Westjordanland (Hebron) einflussreich; kontrolliert die Hebron University.",
    notable: [
      { badge: "fighter", name: "Ahmed Jabari", info: "Militärchef der Qassam-Brigaden (Hamas) bis zu seiner Ermordung am 14. November 2012 durch einen israelischen Luftangriff in Gaza-Stadt. Galt als einer der mächtigsten Hamas-Militärführer vor Mohammed Deif.", url: "https://en.wikipedia.org/wiki/Ahmed_Jabari" }
    ]
  },

  "al-jamal": {
    origin: "Berufsname: al-Jammāl (الجمل) = „der Kamelhändler“ oder „der Kameltreiber“. Historisch wichtiger Beruf in der Levante.",
    notable: [
      { badge: "official", name: "Muhammad al-Jamasi", info: "Leitete die Verwaltung Hamas in Süd-Gaza und das Notfallkomitee. Wurde im März 2025 getötet.", url: "https://www.ynetnews.com/article/skd8m11p2ke" }
    ]
  },

  "al-jendiya": {
    origin: "Lokaler Familienname in Gaza. Etymologie nicht eindeutig dokumentiert.",
    notable: []
  },

  "al-kafarna": {
    origin: "Lokaler Gazan-Name, möglicherweise von einem Ortsnamen oder Dialektwort abgeleitet. Varianten: al-Kafarana.",
    notable: [
      { badge: "victims", name: "Nabila und Basmala Al-Kafarna", info: "Waisenschwestern, fotografiert von AP 2026. Ihre Eltern wurden am 3. April 2025 bei einem israelischen Luftangriff auf eine Schule getötet, die Vertriebene beherbergte.", url: "https://apnews.com/photo-essay/gaza-orphans-unicef-photo-essay-745f4ff42fad02a379edc55cd4ecfe4b" },
      { badge: "aid", name: "Ikhlas al-Kafarna (35)", info: "Tante, die sich nach dem Krieg um ihre verwaisten Nichten und Neffen kümmerte.", url: "https://apnews.com/photo-essay/gaza-orphans-unicef-photo-essay-745f4ff42fad02a379edc55cd4ecfe4b" }
    ]
  },

  "al-kahlout": {
    origin: "Großfamilie im Norden Gazas (Jabalia/Beit Lahia).",
    notable: [
      { badge: "fighter", name: "Abu Obeida (Hudhayfa Samir Abdullah al-Kahlout)", info: "Der maskierte Sprecher der Qassam-Brigaden. Wurde 2025 von Israel getötet, von Hamas bestätigt.", url: "https://www.foxnews.com/world/hamas-confirms-five-leaders-killed-including-masked-spokesperson-major-blow-terror-group" }
    ]
  },

  "al-khayyat": {
    origin: "Berufsname: al-Khayyāṭ (الخياط) = „der Schneider“. Klassischer Handwerksname.",
    notable: [
      { badge: "medic", name: "Dr. Tamer al-Khayyat", info: "Arzt aus Rafah. Wurde am 13. Oktober 2023 zusammen mit Ehefrau Dr. Razan al-Khayyat und Tochter getötet. Ein überlebendes Kind verlor 18 Familienmitglieder.", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" },
      { badge: "medic", name: "Dr. Razan al-Khayyat", info: "Ärztin, arbeitete im Emirates Crescent Hospital und al-Shifa. Wurde mit Ehemann und Tochter getötet.", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" }
    ]
  },

  "al-kurd": {
    origin: "Herkunftsname: al-Kurd (الكرد) = „der Kurde“. Zeigt auf Vorfahren aus dem kurdischen Raum, möglicherweise durch osmanische Migration oder Militärdienst.",
    notable: []
  },

  "al-maqadma": {
    origin: "Lokaler Gazan-Name, möglicherweise von maqādim (Vorderseite, Vorsprung) oder einem Ortsnamen abgeleitet.",
    notable: [
      { badge: "medic", name: "Dr. Ahmad al-Maqadma", info: "Plastischer Chirurg, Mitglied des Royal College of Surgeons of England. Wurde am 22. März 2024 zusammen mit Mutter Dr. Yusra al-Maqadma (Mathematiklehrerin) getötet. Leichen wurden im Hof von al-Shifa gefunden.", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" },
      { badge: "academic", name: "Dr. Yusra al-Maqadma", info: "Mathematiklehrerin und Mutter von Dr. Ahmad al-Maqadma. Wurde mit ihrem Sohn getötet.", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" }
    ]
  },

  "al-maslamani": {
    origin: "Möglicherweise von maʿṣūmānī (geschnitzt, geformt) oder einem Ortsnamen abgeleitet.",
    notable: []
  },

  "al-matouq": {
    origin: "Von matūk (مطوك): „das Gefaltete“ oder „das Gerollte“ — möglicherweise ein Spitzname für jemanden, der Teppiche oder Textilien herstellte.",
    notable: []
  },

  "al-nabahin": {
    origin: "Beduinen-Clan in Gaza. Von der Wurzel n-b-h (adelig, berühmt, wachsam).",
    notable: [
      { badge: "sport", name: "Basem Al-Nabahin", info: "Basketballspieler. Wurde bei israelischen Luftangriffen auf Gaza während des Krieges 2023–2024 getötet.", url: "https://www.sportspolitika.news/p/list-athletes-gaza-killed-israel-war" },
      { badge: "academic", name: "Haitham Muhammad Al-Nabahin", info: "Prominenter Programmierer und IT-Experte des Gazastreifens. Wurde im März 2024 zusammen mit seiner Ehefrau bei einem israelischen Luftangriff auf das Flüchtlingslager Bureij getötet.", url: "https://reliefweb.int/report/occupied-palestinian-territory/israel-targets-information-technology-experts-part-its-genocide-gaza-enar" }
    ]
  },

  "al-naji": {
    origin: "Vom Vornamen Nājī (ناجي): „der Überlebende“, „der Retter“. Wurde zu einem Familiennamen.",
    notable: []
  },

  "al-qassas": {
    origin: "Berufsname: al-Qaṣṣāṣ (القصاص) = „der Geschichtenerzähler“, „der Chronist“, „der Prediger“. Klassischer Beruf in traditioneller arabischer Gesellschaft.",
    notable: [
      { badge: "victims", name: "Rashad Qasas", info: "Wurde in Rafah auf dem Weg zu einer Hilfsgüterverteilung getötet; seine Beerdigung wurde von AP im Juni 2025 fotografiert.", url: "https://apnews.com/photo-gallery/mideast-wars-gaza-journalists-killed-photos-a19cdcbab5d0f043c7f80a3f7cffc50f" }
    ]
  },

  "al-qrinawi": {
    origin: "Herkunftsname: al-Qarārawī/al-Qrināwī (القريناوي) = „aus al-Qarāra“, einer Stadt nördlich von Khan Younis.",
    notable: [
      { badge: "victims", name: "Muneer al-Qrinawi", info: "Ziviler Todesfall, dokumentiert in Gazakriegsaufzeichnungen.", url: "https://www.bloodlinesbook.com/salt-water-a-living-count" },
      { badge: "prisoner", name: "Karam Jaber Odah al-Qrinawi (22)", info: "Wurde im Dezember 2014 von israelischen Streitkräften nahe dem Grenzzaun östlich von al-Bureij festgenommen.", url: "https://pchrgaza.org/weekly-report-on-israeli-human-rights-violations-in-the-occupied-palestinian-territory-18-23-dec-2014/" }
    ]
  },

  "al-qudra": {
    origin: "Von arabisch qudra (قدرة): „Kraft“, „Fähigkeit“, „Macht“. Deskriptiver Name für jemanden von bemerkenswerter Stärke oder Fähigkeit.",
    notable: [
      { badge: "medic", name: "Dr. Ashraf al-Qudra", info: "Langjähriger Sprecher des Hamas-geführten Gesundheitsministeriums in Gaza. Wurde während des Krieges zum international bekannten Gesicht der Gesundheitskrise, aktualisierte regelmäßig Todeszahlen und Krankenhausbedingungen.", url: "https://apnews.com/article/israel-hamas-war-live-updates-11-20-2023-9913a29b48afc4a75e724674fe51bd82" }
    ]
  },

  "al-rantisi": {
    origin: "Stammesname, verankert in Khan Younis und dem Flüchtlingslager Jabalia.",
    notable: [
      { badge: "official", name: "Abdel Aziz al-Rantisi (1947–2004)", info: "Mitbegründer von Hamas und Nachfolger von Ahmed Yassin als politischer Führer. Wurde im April 2004, weniger als einen Monat nach Yassin, bei einem israelischen Luftangriff auf sein Auto ermordet.", url: "https://en.wikipedia.org/wiki/Abdel_Aziz_al-Rantisi" },
      { badge: ["official", "activism"], name: "Jamila Abdallah Taha al-Shanti (1944–2023)", info: "Witwe von al-Rantisi, erste Frau im Hamas-Politbüro Gaza. Gründete den Frauenflügel von Hamas und initiierte den Frauenmarsch 2008. Wurde im Oktober 2023 bei einem israelischen Luftangriff auf ihr Haus in Gaza-Stadt getötet.", url: "https://www.ynetnews.com/article/hkuwcdrwt" },
      { badge: "medic", name: "Dr. Iyad al-Rantisi", info: "Gynäkologe, Leiter der Geburtenabteilung am Kamal Adwan Hospital. Wurde am 10. November 2023 festgenommen; starb sechs Tage später im Shikma-Gefängnis.", url: "https://www.un.org/unispal/document/sitrep-181-gaza-strip-ocha-21jun24/" }
    ]
  },

  "al-rayyes": {
    origin: "Von arabisch rayyis (رئيس): „der Chef“, „der Anführer“, „der Präsident“. Laqab für jemanden in Führungsposition.",
    notable: []
  },

  "al-rifi": {
    origin: "Herkunftsname: al-Rīfī (الريفي) = „der Ländliche“, „aus dem Dorf“. Nisba für jemanden vom Land (im Gegensatz zur Stadt).",
    notable: []
  },

  "al-safadi": {
    origin: "Herkunftsname: al-Ṣafadī (الصفدي) = „aus Safed“ (Ṣafad), einer Stadt im nördlichen Galiläa. Viele 48er-Flüchtlingsfamilien tragen diesen Namen.",
    notable: []
  },

  "al-safin": {
    origin: "Von safīna (سفينة): „das Schiff“. Möglicherweise ein Berufsname für Schiffsbauer oder Händler.",
    notable: []
  },

  "al-sakka": {
    origin: "Berufsname: al-Sakkāʾ (السقا) = „der Wasserträger“, „der Getränkeausschank-Betreiber“. Wichtiger Beruf in vorindustrieller Zeit.",
    notable: []
  },

  "al-sarhi": {
    origin: "Etymologie nicht eindeutig dokumentiert. In Gaza verankert.",
    notable: []
  },

  "al-shanti": {
    origin: "Familie aus dem Flüchtlingslager Jabalia.",
    notable: [
      { badge: ["official", "activism"], name: "Jamila Abdallah Taha al-Shanti", info: "Siehe unter al-rantisi.", url: "https://www.ynetnews.com/article/hkuwcdrwt" }
    ]
  },

  "al-sharif": {
    origin: "Von sharīf (شريف): „edel“, „ehrenhaft“, „von vornehmer Abstammung“. Historisch Bezeichnung für Nachkommen der Familie des Propheten Mohammed.",
    notable: [
      { badge: "media", name: "Anas al-Sharif (1996–2025)", info: "Al Jazeera Arabisch-Journalist und Videofilmer aus dem Flüchtlingslager Jabalia. Pulitzer-Preis 2024 (Reuters-Team). Wurde am 10. August 2025 bei einem israelischen Luftangriff auf ein Medienzelt vor dem Al-Shifa-Hospital getötet.", url: "https://en.wikipedia.org/wiki/Anas_Al-Sharif" },
      { badge: "victims", name: "Karam al-Sharif", info: "UNRWA-Mitarbeiter, der seine eineiigen 18 Monate alten Söhne Kenan und Neman sowie die Töchter Joud (5) und Tasnim (10) bei einem israelischen Luftangriff auf Nuseirat im November 2023 verlor.", url: "https://apnews.com/article/israel-hamas-11-1-2023-children-killed-4a352398b32887e60a658e0270f0a021" }
    ]
  },

  "al-shawa": {
    origin: "Eine der ältesten und prominentesten Familien in Gaza-Stadt. Möglicherweise von shawā (شوا): „rösten, trocknen" abgeleitet — oder ein Stammesname.",
    notable: [
      { badge: "diplomat", name: "Rashad al-Shawa", info: "Bürgermeister von Gaza (ernannt 1971). Gründete 1983 das Rashad al-Shawa Cultural Center und al-Shawa Press, die die offizielle Palestinian Gazette herausgab.", url: "https://www.palestine-studies.org/en/node/1657550" },
      { badge: "culture", name: "Rawya Rashad Shawa", info: "Künstlerin und Kulturfigur, Tochter von Rashad al-Shawa. Geboren 1948 in Gaza, gestorben 2017.", url: "https://passia.org/personalities/page/7/" },
      { badge: "academic", name: "Majdi al-Shawa", info: "Gazaner Doktor der Chemie, schrieb in den 1930er Jahren über Zement und nationale Wirtschaft.", url: "https://www.palestine-studies.org/sites/default/files/jqpdf/JQ%2079%20-%20Full%20Issue%20with%20Covers.pdf" }
    ]
  },

  "al-shrafi": {
    origin: "In Jabaliya und Nordgaza über mehrere Generationen dokumentiert.",
    notable: [
      { badge: "media", name: "Momen Al Sharafi", info: "Al Jazeera-Korrespondent. Im Dezember 2023 wurde bei einem israelischen Luftangriff auf Jabalia das gesamte Haus seiner Familie zerstört — 21 Familienmitglieder getötet, darunter Eltern, Geschwister und deren Kinder.", url: "https://www.dawn.com/news/1795616" },
      { badge: "victims", name: "Samir al-Shrafi", info: "47-jähriger Hausbesitzer, getötet am 4. Januar 2009, als eine israelische Drohne eine Rakete auf sein Haus im Zentrum des Flüchtlingslagers Jabalia feuerte.", url: "https://reliefweb.int/report/occupied-palestinian-territory/opt-10th-day-iof-crimes-gaza-death-toll-rises-489-including-89" },
      { badge: "victims", name: "Ramzi Mowafaq al-Shrafi", info: "16-jähriger Schüler, getötet durch eine IDF-Rakete auf dem Weg zur Schule im Flüchtlingslager Jabalia, November 2006.", url: "https://www.rememberthesechildren.org/remember2006.html" },
      { badge: "victims", name: "Abdel Rahman Al Shrafi", info: "Getötet bei einem israelischen Luftangriff auf sein Haus im Viertel Al-Saftawi, Nord-Gaza, August 2014.", url: "https://mezan.org/public/en/post/19294" }
    ]
  },

  "al-sultan": {
    origin: "Von sultān (سلطان): „Herrscher“, „Macht“. Laqab für jemanden mit Autorität oder militärischem Rang.",
    notable: [
      { badge: "medic", name: "Dr. Marwan al-Sultan", info: "Direktor des Indonesischen Hospitals und Kardiologe. Wurde am 2. Juli 2025 zusammen mit acht Familienmitgliedern (Ehefrau, Tochter, Schwester) bei einem Angriff auf ihre Wohnung in West-Gaza getötet.", url: "https://www.aa.com.tr/en/features/1-000-days-of-israeli-genocide-gaza-doctors-medics-pay-heavy-price-in-line-of-duty/3984520" }
    ]
  },

  "al-taweel": {
    origin: "Von al-ṭawīl (الطويل): „der Lange“. Klassischer arabischer Laqab (Spitzname) für eine große Person.",
    notable: [
      { badge: "culture", name: "Tha'er Al-Taweel", info: "43-jähriger Bildender Künstler aus Gaza. Wurde während des Krieges getötet; dokumentiert im Gaza Cultural Sector Martyrs Project.", url: "https://gazacultrualsector.palestine-studies.org/en/Martyrs_Culture" },
      { badge: "culture", name: "Adel Al Taweel", info: "1995 im Flüchtlingslager Nuseirat geboren. Bildender Künstler, Absolvent des Instituts für Bildende Künste der Al-Aqsa-Universität. Mitglied des Verbands Palästinensischer Künstler. Siedelte 2024 nach Frankreich über.", url: "https://aa-e.org/en/artiste/adel-al-taweel-2/" }
    ]
  },

  "al-wadiya": {
    origin: "Herkunftsname: al-Wādiyya (الوادية) = „aus dem Tal“. Nisba für jemanden, der in einem wadi (Trockental) lebte.",
    notable: []
  },

  "al-yaziji": {
    origin: "Herkunftsname: al-Yāzijī (اليازجي) = „aus Yaziji“ — möglicherweise abgeleitet von einem Ortsnamen oder Vorfahrennamen. Auch als Familienname im Libanon verbreitet.",
    notable: []
  },

  "al-zaharna": {
    origin: "Von zahr (زهر): „Blume“, „Blüte“. Deskriptiver Name für Schönheit oder Anmut.",
    notable: []
  },

  "al-zard": {
    origin: "Von zard (زرد): „gelb/golden" (persisches Lehnwort). Möglicherweise ein Spitzname für jemanden mit blondem oder hellerem Haar.",
    notable: []
  },

  "ayyad": {
    origin: "Von ʿAyyād (عياد): „geboren am Festtag“ (ʿĪd) oder „Helfer/Unterstützer“. Verbreitet in Gaza-Stadt und Shuja'iyya.",
    notable: [
      { badge: "culture", name: "Hassan Ayyad", info: "14-jähriger Sänger und Songwriter aus Gaza, bekannt für Lieder über das Leben unter Belagerung. Wurde im Mai 2025 bei einem israelischen Luftangriff auf Nuseirat getötet.", url: "https://www.commondreams.org/news/hassan-ayyad" },
      { badge: "victims", name: "Rami Khader Ayyad (29)", info: "Mitglied der Baptistenkirche Gaza und Leiter des einzigen christlichen Buchladens der Palestinian Bible Society. Entführt und im Oktober 2007 ermordet, nachdem er Morddrohungen erhalten hatte.", url: "https://banneroftruth.org/us/resources/articles/2008/christians-in-gaza/" },
      { badge: "victims", name: "Ayyad-Familie (Shuja'iyya)", info: "Mehrere Familienmitglieder getötet am 20. Juli 2014 beim Fluchtversuch aus der israelischen Offensive im Viertel Shuja'iyya. Dokumentiert im „Obliterated Families“-Projekt.", url: "https://obliteratedfamilies.com/en/family/ayyad/" },
      { badge: "media", name: "Tasneem Ayyad", info: "Palästinensische Schriftstellerin und Übersetzerin aus Gaza, dokumentierte die Erfahrungen ihrer Familie während des Krieges 2023–2024.", url: "https://maritotto.nl/guest-tasneem-ayyad/" }
    ]
  },

  "aziz": {
    origin: "Vom Vornamen ʿAzīz (عزيز): „mächtig“, „geehrter Lieber“. Verbreiteter Name in der gesamten arabischen Welt.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // B
  // ---------------------------------------------------------------------------

  "barbakh": {
    origin: "Von barbakh (بربخ): „Wasserrinne“, „Kanal“. Möglicherweise ein topographischer Name.",
    notable: []
  },

  "barboud": {
    origin: "Variante von Barbakh oder eigenständiger Name. Verbreitet in Gaza.",
    notable: []
  },

  "barhoum": {
    origin: "Von barhūm (برحوم): „Bärenkraut“, „Ysop“ — möglicherweise ein Spitzname oder Berufsname für Heilkundige.",
    notable: [
      { badge: "fighter", name: "Khamis Barhoum", info: "Stellvertretender Kommandeur der Rafah-Brigade. Verantwortlich für das Massaker von Kerem Shalom am 7. Oktober. Wurde im März 2025 getötet.", url: "https://www.ynetnews.com/article/skd8m11p2ke" }
    ]
  },

  "baroud": {
    origin: "Von barūd (بارود): „Schießpulver“. Möglicherweise ein Spitzname für jemanden mit explosives Temperament — oder ein Berufsname für Pulvermacher.",
    notable: []
  },

  "baroud": {
    origin: "Von barūd (بارود): „Schießpulver“. Möglicherweise ein Spitzname für jemanden mit explosives Temperament — oder ein Berufsname für Pulvermacher.",
    notable: []
  },

  "bayouk": {
    origin: "Siehe al-bayouk.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // D
  // ---------------------------------------------------------------------------

  "daoud": {
    origin: "Arabische Form von David (Dāwūd داود). In palästinensischem Kontext sowohl bei Muslimen als auch bei Christen verbreitet.",
    notable: []
  },

  "darwish": {
    origin: "Von darwīsh (درويش): „Der Derwisch“, „der Asket“. Ursprünglich ein religiöser Titel für Sufis, wurde zu einem Familiennamen. (Nicht zu verwechseln mit dem nationalen Dichter Mahmoud Darwish, der aus dem Galiläa stammte.)",
    notable: []
  },

  "deeb": {
    origin: "Von dīb (ديب): „Wolf“. Tiername als Spitzname für Wildheit oder List.",
    notable: []
  },

  "duhair": {
    origin: "Etymologie nicht eindeutig. In Gaza verankert.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // E
  // ---------------------------------------------------------------------------

  "eid": {
    origin: "Vom Vornamen ʿĪd (عيد): „Fest“. Verbreitet als Familienname für jemanden, der an einem Festtag geboren wurde.",
    notable: []
  },

  "eliwa": {
    origin: "Möglicherweise von ʿalīwa (عليوة): „die Erhöhte“ oder ein Ortsname.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // F
  // ---------------------------------------------------------------------------

  "farajallah": {
    origin: "Zusammensetzung: Faraj (فرج: Erlösung, Öffnung) + allah (Gott). Theophorischer Name.",
    notable: []
  },

  "fayyad": {
    origin: "Von fayyāḍ (فياض): „der Großzügige“, „der Spender“. Beschreibender Name.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // G
  // ---------------------------------------------------------------------------

  "ghaben": {
    origin: "Von ghābin (غابن): „der Betrogene“ oder „der Täuscher“. Unklare Etymologie.",
    notable: []
  },

  "ghandour": {
    origin: "Siehe al-ghandour.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // H
  // ---------------------------------------------------------------------------

  "habib": {
    origin: "Von ḥabīb (حبيب): „Geliebter“, „Liebling“. Verbreiteter Name und Kosenamen.",
    notable: []
  },

  "hamad": {
    origin: "Vom Vornamen Ḥamad (حمد): „Lobpreiser“. Verbreitet in der gesamten arabischen Welt.",
    notable: []
  },

  "hamada": {
    origin: "Diminutiv von Hamad. Verbreitet in Gaza.",
    notable: []
  },

  "hammouda": {
    origin: "Diminutiv von Hammud, einer Variante von Ahmad.",
    notable: []
  },

  "hammouda": {
    origin: "Diminutiv von Hammud, einer Variante von Ahmad.",
    notable: []
  },

  "hassanein": {
    origin: "Von Ḥasanayn (حسنين): „die beiden Hasan“ — dual von Hasan. Bezieht sich auf Hasan und Hussein, die Söhne von Ali. Besonders bei Sunniten und Schiiten verehrt.",
    notable: [
      { badge: "media", name: "Saeed Abu Hassanein", info: "Journalist; starb im April 2025 an Verletzungen durch einen israelischen Luftangriff in Khan Younis. Die Regierungsmedienbehörde nannte ihn den 212. getöteten Journalisten in Gaza seit Oktober 2023.", url: "https://www.aa.com.tr/en/middle-east/israeli-army-killed-212-palestinian-journalists-in-gaza-since-oct-2023/3548708" },
      { badge: "media", name: "Rula Hassanein", info: "Journalistin und Redakteurin für Wattan Media Network. Wurde von israelischen Streitkräften festgenommen und im Damon-Gefängnis inhaftiert. Wurde im Januar 2025 im Rahmen eines Waffenstillstands-Gefangenenaustauschs freigelassen.", url: "https://samidoun.net/2024/11/prisoner-rula-hassanein-between-motherhood-and-the-walls-of-damon-prison/" }
    ]
  },

  "hassan": {
    origin: "Vom Vornamen Ḥasan (حسن): „schön“, „gut“, „tugendhaft". Einer der verbreitetsten Namen in der islamischen Welt.",
    notable: []
  },

  "hassouna": {
    origin: "Diminutiv oder Nisba von Hassan.",
    notable: []
  },

  "hussam": {
    origin: "Vom Vornamen Ḥussām (حسام): „das Schwert". Symbol für Tapferkeit und Stärke.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // I
  // ---------------------------------------------------------------------------

  "islim": {
    origin: "Von islim (اسلم) oder islam (اسلام): „Frieden durch Unterwerfung“. Religiöser Name.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // J
  // ---------------------------------------------------------------------------

  "jabr": {
    origin: "Von jabr (جبر): „Macht“, „Stärke“, „Zwang“. Auch mathematischer Begriff (Algebra = al-Jabr).",
    notable: []
  },

  "jouda": {
    origin: "Von jud (جود): „Freigiebigkeit", „Großzügigkeit". Möglicherweise von einem Vornamen abgeleitet.",
    notable: []
  },

  "jumaa": {
    origin: "Von jumʿa (جمعة): „Freitag“. Name für jemanden, der am Freitag geboren wurde — dem wichtigsten islamischen Tag.",
    notable: []
  },

  "jundia": {
    origin: "Von jund (جند): „Armee", „Soldaten". Möglicherweise ein Militärname.",
    notable: []
  },

  "junaid": {
    origin: "Von junayd (جنيد): „kleine Armee" oder „kleiner Krieger". Diminutiv von jund.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // K
  // ---------------------------------------------------------------------------

  "karam": {
    origin: "Von karam (كرم): „Großzügigkeit", „Edelmut". Verbreiteter Name.",
    notable: []
  },

  "kashkou": {
    origin: "Etymologie unklar. Möglicherweise von kishk (كسكسي-Gericht) oder einem Dialektwort abgeleitet.",
    notable: []
  },

  "khalil": {
    origin: "Von khalīl (خليل): „Freund", „Vertrauter". Khaliullah = „Freund Gottes" — Ehrentitel des Propheten Ibrahim (Abraham).",
    notable: [
      { badge: "official", name: "Khalil al-Hayya", info: "Siehe unter al-hayya (bereits in famnotes.js).", url: "https://www.france24.com/en/middle-east/20260720-who-is-khalil-al-hayya-hamas-s-new-leader" }
    ]
  },

  "khella": {
    origin: "Diminutiv oder Dialektform. In Gaza verankert.",
    notable: []
  },

  "khudari": {
    origin: "Von khudayr (خضير): „grünlich", „das Grün“. Diminutiv von akhdar (grün).",
    notable: []
  },

  "kurd": {
    origin: "Siehe al-kurd.",
    notable: []
  },

  "kuhail": {
    origin: "Von kuhayl (كحيل): „mit Kohl geschwärzt" — traditionell für Augen mit Kohl umrandet. Schönheitsbezeichnung.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // L
  // ---------------------------------------------------------------------------

  "lubbad": {
    origin: "Etymologie nicht umfassend dokumentiert. Bekannt in Gazas medizinischer Gemeinschaft.",
    notable: [
      { badge: "medic", name: "Dr. Rafat (Rafet) Lubbad", info: "Leiter der Inneren Medizin am Shifa-Hospital und einer der wenigen Spezialisten für Autoimmunerkrankungen in Gaza. Wurde im November 2023 bei einem israelischen Luftangriff auf sein Haus in Gaza-Stadt getötet, zusammen mit 7 Familienmitgliedern.", url: "https://apnews.com/article/gaza-doctor-killed-israeli-airstrike-527ee681c4e1155bb24f4380d011fe5d" }
    ]
  },

  // ---------------------------------------------------------------------------
  // M
  // ---------------------------------------------------------------------------

  "madi": {
    origin: "Von mādiy (ماضي): „Vergangenheit", „Uraltes". Oder Kurzform von Majd (Ruhm).",
    notable: [
      { badge: "victims", name: "Musa Ghaleb Ibrahim Madi (25)", info: "Getötet in Gaza im Mai 2021, als israelische Streitkräfte sein Motorrad in der Nähe von Protesten angriffen.", url: "https://imemc.org/article/pchr-weekly-report-on-israeli-human-rights-violations-in-the-occupied-palestinian-territory-24/" },
      { badge: "victims", name: "Omar Madi", info: "Getötet nahe dem Flüchtlingslager al-Aroub, Hebron-Gebiet, Februar 2016; seine Beerdigung löste Proteste in Gaza aus.", url: "https://pchrgaza.org/weekly-report-on-israeli-human-rights-violations-in-the-occupied-palestinian-territory-11-17-february-2016/" }
    ]
  },

  "mansour": {
    origin: "Von manṣūr (منصور): „der Siegreiche". Verbreiteter Name in der islamischen Welt.",
    notable: []
  },

  "marouf": {
    origin: "Von maʿrūf (معروف): „Bekannt", „Anerkannt", „Gutes Tun". Name mit positiver Konnotation.",
    notable: []
  },

  "masoud": {
    origin: "Von masʿūd (مسعود): „glücklich", „gesegnet". Verbreiteter Name.",
    notable: []
  },

  "matar": {
    origin: "Von maṭar (مطر): „Regen". Naturbezogener Name, möglicherweise für jemanden, der bei Regen geboren wurde.",
    notable: []
  },

  "miqdad": {
    origin: "Vom Vornamen Miqdād (مقداد): „stark", „kraftvoll". Bekannt durch Miqdad ibn Amr, einen Gefährten des Propheten.",
    notable: []
  },

  "mousa": {
    origin: "Arabische Form von Moses (Mūsā موسى). In der gesamten arabischen Welt verbreitet, sowohl bei Muslimen als auch bei Christen.",
    notable: []
  },

  "muammar": {
    origin: "Vom Vornamen Muʿammar (معمر): „langlebig", „der Alte".",
    notable: []
  },

  "muqat": {
    origin: "Etymologie unklar. In Gaza in zivilen Todesfall-Aufzeichnungen dokumentiert.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // N
  // ---------------------------------------------------------------------------

  "nabhan": {
    origin: "Von nabhan (نبهان): „wachsam", „aufmerksam". Oder Stammesname.",
    notable: []
  },

  "nasr": {
    origin: "Von naṣr (نصر): „Sieg", „Hilfe". Verbreiteter Name.",
    notable: []
  },

  "nassar": {
    origin: "Variante von nasr (Sieg).",
    notable: []
  },

  "nawfal": {
    origin: "Vom Vornamen Nofal (نوفل): „Großzügigkeit", „Freigiebigkeit". Alter arabischer Stammesname.",
    notable: [
      { badge: "fighter", name: "Ayman Nofal", info: "Mitglied des Obersten Militärrats der Qassam-Brigaden, Kommandeur Zentral-Gaza. Wurde am 17. Oktober 2023 getötet.", url: "https://news.yahoo.com/israeli-air-strike-kills-senior-133307899.html" }
    ]
  },

  // ---------------------------------------------------------------------------
  // O
  // ---------------------------------------------------------------------------

  "obeid": {
    origin: "Von ʿubayd (عبيد): „kleiner Sklave“ — ursprünglich religiöser Sklavenname (ʿabd = Sklave Gottes), hier Diminutiv.",
    notable: []
  },

  "ouda": {
    origin: "Von ʿawda (عودة): „Rückkehr". Symbolischer Name für das palästinensische Recht auf Rückkehr.",
    notable: []
  },

  "owaida": {
    origin: "Variante von ouda (Rückkehr).",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // Q
  // ---------------------------------------------------------------------------

  "qashta": {
    origin: "Möglicherweise von qaṣhta (قشطة): „Sahne". Berufsname für Milchverkäufer oder Spitzname für jemanden mit heller Haut.",
    notable: [
      { badge: "media", name: "Mohammed Salah Qashta", info: "Journalist und Sprecher des Ägyptischen Komitees für Gazahilfe. Wurde am 21. Januar 2026 zusammen mit zwei anderen Journalisten bei einem israelischen Luftangriff in Al-Zahra, Südwest-Gaza-Stadt, getötet.", url: "https://www.unesco.org/en/articles/unesco-director-general-condemns-killing-journalists-abdul-raouf-shaat-anas-ghoneim-and-mohammed" },
      { badge: "victims", name: "Qeshta-Familie", info: "12 Zivilisten, darunter Frauen und Kinder, getötet, als ein israelischer Luftangriff am 6. November 2023 ihr Haus in Rafah traf.", url: "https://airwars.org/civilian-casualties/ispt0915-november-6-2023/" }
    ]
  },

  "qasim": {
    origin: "Vom Vornamen Qāsim (قاسم): „der Verteiler". Name mit religiöser Bedeutung.",
    notable: []
  },

  "qdeih": {
    origin: "Lokaler Gazan-Name. Etymologie unklar.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // R
  // ---------------------------------------------------------------------------

  "rajab": {
    origin: "Vom Monatsnamen Rajab (رجب): der siebte Monat des islamischen Kalenders. Heiliger Monat.",
    notable: []
  },

  "reihan": {
    origin: "Von rīḥān (ريحان): „Basilikum". Pflanzenname, möglicherweise ein Spitzname für jemanden, der Kräuter anbaute.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // S
  // ---------------------------------------------------------------------------

  "saad": {
    origin: "Vom Vornamen Saʿd (سعد): „Glück", „Erfolg". Verbreiteter Name.",
    notable: [
      { badge: "fighter", name: "Raed Saad", info: "Hochrangiger Qassam-Kommandeur (Produktion/Generalstab), durch gezielten Schlag getötet.", url: "https://www.ynetnews.com/article/bkp3abjmbx" }
    ]
  },

  "safi": {
    origin: "Von ṣafī (صافي): „rein", „klar". Beschreibender Name.",
    notable: []
  },

  "salah": {
    origin: "Von ṣalāḥ (صلاح): „Rechtschaffenheit", „Gerechtigkeit". Religiöser Name.",
    notable: []
  },

  "salha": {
    origin: "Diminutiv oder weibliche Form von Salih/Salah.",
    notable: []
  },

  "salman": {
    origin: "Vom Vornamen Salmān (سلمان): „sicher", „friedlich". Bekannt durch Salman al-Farisi, Gefährte des Propheten.",
    notable: []
  },

  "sammour": {
    origin: "Von samūr (سامور): „dunkle Wolke" oder „regnerische Wolke". Naturbezogener Name.",
    notable: []
  },

  "saydam": {
    origin: "Von ṣaydām (صيدام): „starker, kraftvoller Mann". Spitzname.",
    notable: [
      { badge: "medic", name: "Dr. Midhat Saydam", info: "Professor für Plastische Chirurgie, Gründer der Brandverletzten-Station am Shifa-Hospital. Kam nach sieben Tagen Dienst nach Hause; wurde mit seiner gesamten Familie bei einem Angriff auf sein Haus in Tel al-Hawa getötet (14. Oktober 2023).", url: "https://gazahcsector.palestine-studies.org/en/medical_teams" }
    ]
  },

  "sharab": {
    origin: "Von sharāb (شراب): „Getränk", „Syrup". Berufsname für jemanden, der Getränke oder Sirupe herstellte oder verkaufte.",
    notable: [
      { badge: "culture", name: "Naji Abdel Qader Sharab", info: "Kalligraph und Kunstlehrer aus Gaza-Stadt. Wurde am 13. August 2024 bei israelischen Bombardements getötet. Dokumentiert unter den Kulturmärtyrern Gazas.", url: "https://gazacultrualsector.palestine-studies.org/en/node/4805" }
    ]
  },

  "sharah": {
    origin: "Von sharāḥ (شراح): „Offenheit", „Aufrichtigkeit". Beschreibender Name.",
    notable: []
  },

  "sobh": {
    origin: "Von ṣubḥ (صبح): „Morgen". Name für jemanden, der am Morgen geboren wurde.",
    notable: []
  },

  "sultan": {
    origin: "Siehe al-sultan.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // T
  // ---------------------------------------------------------------------------

  "tabsh": {
    origin: "Von ṭabsh (طنش): „die Schicht", „die Lage". Möglicherweise ein Berufsname für Lageristen.",
    notable: []
  },

  "tafesh": {
    origin: "Verbreitet im Levante mit palästinensischen Wurzeln in Safed (Vor-1948-Palästina).",
    notable: [
      { badge: "culture", name: "Youssef Muhammad Tafesh", info: "Palästinensischer Dichter und Autor, geboren 1938 in Safed. Mitglied der Union palästinensischer Schriftsteller und Journalisten sowie der Union arabischer Schriftsteller.", url: "https://www.all4palestine.org/ModelDetails.aspx?gid=7&mid=78075" },
      { badge: "culture", name: "Nasreen Tafesh", info: "Bekannte syrisch-palästinensisch-algerische Schauspielerin, Tochter von Youssef Tafesh. Wurde in Aleppo geboren und wurde durch syrische Dramaserien berühmt.", url: "https://en.everybodywiki.com/Nesreen_Abdelrhman_tafesh" },
      { badge: "victims", name: "Nermeen Tafesh", info: "Gaza-Bewohnerin, die im März 2024 von NPR vorgestellt wurde, als sie mit ihren fünf Kindern in ihrem zerstörten Haus in Hayy al-Nasr die einzige Mahlzeit des Tages zubereitete.", url: "https://www.npr.org/2024/03/29/1241148952/gaza-hunger-famine-aid-israel-hamas-war" }
    ]
  },

  "thabet": {
    origin: "Von thābit (ثابت): „fest", „standhaft". Beschreibender Name.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // W
  // ---------------------------------------------------------------------------

  "washh": {
    origin: "Etymologie unklar. In Gaza verankert.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // Y
  // ---------------------------------------------------------------------------

  "yassin": {
    origin: "Vom Vornamen Yāsīn (ياسين): eine Sure des Quran, oft als Talisman-Name verwendet. Oder von ya sīn, einem Anruf an den Propheten Mohammed.",
    notable: [
      { badge: "official", name: "Scheich Ahmed Yassin (1936–2004)", info: "Gründer und spiritueller Führer von Hamas. Im Rollstuhl seit Jugend. Wurde im März 2004 bei einem israelischen Raketenangriff auf sein Auto ermordet.", url: "https://en.wikipedia.org/wiki/Ahmed_Yassin" }
    ]
  },

  "youssef": {
    origin: "Arabische Form von Joseph (Yūsuf يوسف). In der gesamten arabischen Welt verbreitet.",
    notable: []
  },

  // ---------------------------------------------------------------------------
  // Z
  // ---------------------------------------------------------------------------

  "zaqqut": {
    origin: "Von zaqqūṭ (زقوق): „Röhre", „Rohr". Möglicherweise ein Berufsname für jemanden, der Rohre oder Wasserleitungen verlegte.",
    notable: []
  },

  "zarab": {
    origin: "Persisch-arabische Zusammensetzung: zar (Gold) + ab (Wasser) = „Goldenes Wasser". Deskriptiver Name, möglicherweise für Goldhändler oder jemanden aus einem Gebiet mit goldfarbenem Wasser.",
    notable: [
      { badge: "victims", name: "Odai Zarab (13) und sein Bruder (15)", info: "Zwei Brüder, die bei israelischen Luftangriffen während der Operation Protective Edge im Juli 2014 in Gaza getötet wurden.", url: "https://d3n8a8pro7vhmx.cloudfront.net/dcipalestine/pages/530/attachments/original/1436292897/OPE_A_War_Waged_on_Children.pdf?1436292897" }
    ]
  },

  "zarab": {
    origin: "Persisch-arabische Zusammensetzung: zar (Gold) + ab (Wasser) = „Goldenes Wasser". Deskriptiver Name, möglicherweise für Goldhändler oder jemanden aus einem Gebiet mit goldfarbenem Wasser.",
    notable: [
      { badge: "victims", name: "Odai Zarab (13) und sein Bruder (15)", info: "Zwei Brüder, die bei israelischen Luftangriffen während der Operation Protective Edge im Juli 2014 in Gaza getötet wurden.", url: "https://d3n8a8pro7vhmx.cloudfront.net/dcipalestine/pages/530/attachments/original/1436292897/OPE_A_War_Waged_on_Children.pdf?1436292897" }
    ]
  },

  "zohdi": {
    origin: "Von zuhd (زهد): „Askese", „Entsagung“. Religiöser Name für jemanden, der ein asketisches Leben führte.",
    notable: []
  },
