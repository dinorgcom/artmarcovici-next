/*
 * Namentlich belegte UNRWA-Beschaeftigte in der Gaza-Opferliste.
 *
 * Aufnahmebedingung: Eine offizielle UNRWA-/UN-Quelle nennt die Person und
 * die Zuordnung laesst sich ueber den Namen (bei Mai Obaid zusaetzlich ueber
 * die eindeutige Biografie) mit einem Eintrag in data/list.json abgleichen.
 * Ein gleicher Familienname allein reicht ausdruecklich nicht aus.
 */
(function addUnrwaPersonnel() {
  const records = [
    {
      family: "al-attar",
      person: {
        badge: "unrwa",
        name: "Sireen Mohammed Yousef Al-Attar",
        nameI18n: { de: "Sireen Mohammed Yousef Al-Attar", en: "Sireen Mohammed Yousef Al-Attar", ar: "سرين محمد يوسف العطار", he: "סירין מוחמד יוסף אל-עטאר" },
        info: "UNRWA-Gynäkologin; Namens- und Altersabgleich mit der Opferliste (39); getötet am 11.10.2023 im Flüchtlingslager al-Bureij",
        infoI18n: {
          de: "UNRWA-Gynäkologin; Namens- und Altersabgleich mit der Opferliste (39); getötet am 11.10.2023 im Flüchtlingslager al-Bureij",
          en: "UNRWA gynaecologist; name-and-age match with the casualty list (39); killed on 11 October 2023 in al-Bureij refugee camp",
          ar: "طبيبة نسائية في الأونروا؛ تطابق الاسم والعمر مع قائمة القتلى (39)؛ قُتلت في 11 تشرين الأول/أكتوبر 2023 في مخيم البريج",
          he: "רופאת נשים באונר״א; התאמת שם וגיל לרשימת ההרוגים (39); נהרגה ב-11 באוקטובר 2023 במחנה הפליטים אל-בורייג׳",
        },
        url: "https://www.unrwa.org/they-will-never-be-forgotten-dr-sirin-mohammed-al-attar",
        match: "full-name+age",
        unrwaEvidence: "official-un-casualty",
        generated: false,
      },
    },
    {
      family: "al-maqadma",
      person: {
        badge: "unrwa",
        name: "Amal Yousef Hassan Al-Maqadma",
        nameI18n: { de: "Amal Yousef Hassan Al-Maqadma", en: "Amal Yousef Hassan Al-Maqadma", ar: "امل يوسف حسن المقادمه", he: "אמל יוסף חסן אל-מקדמה" },
        info: "UNRWA Medical Officer; Namens-, Alters- und Familienabgleich mit der Opferliste (38); getötet am 24.10.2023 in Nuseirat",
        infoI18n: {
          de: "UNRWA Medical Officer; Namens-, Alters- und Familienabgleich mit der Opferliste (38); getötet am 24.10.2023 in Nuseirat",
          en: "UNRWA Medical Officer; name, age and family match with the casualty list (38); killed on 24 October 2023 in Nuseirat",
          ar: "طبيبة في الأونروا؛ تطابق الاسم والعمر والعائلة مع قائمة القتلى (38)؛ قُتلت في 24 تشرين الأول/أكتوبر 2023 في النصيرات",
          he: "רופאה באונר״א; התאמת שם, גיל ומשפחה לרשימת ההרוגים (38); נהרגה ב-24 באוקטובר 2023 בנוסייראת",
        },
        url: "https://www.unrwa.org/they-will-never-be-forgotten-dr-amal-maqadmeh",
        match: "full-name+age+family",
        unrwaEvidence: "official-un-casualty",
        generated: false,
      },
    },
    {
      family: "ramadan",
      person: {
        badge: "unrwa",
        name: "Mohammed Abdel Qadir Eid Ramadan",
        nameI18n: { de: "Mohammed Abdel Qadir Eid Ramadan", en: "Mohammed Abdel Qadir Eid Ramadan", ar: "محمد عبد القادر عيد رمضان", he: "מוחמד עבד אל-קאדר עיד רמדאן" },
        info: "UNRWA-Labortechniker; Namens- und Altersabgleich mit der Opferliste (40); getötet am 1.12.2023 in Beit Lahia",
        infoI18n: {
          de: "UNRWA-Labortechniker; Namens- und Altersabgleich mit der Opferliste (40); getötet am 1.12.2023 in Beit Lahia",
          en: "UNRWA laboratory technician; name-and-age match with the casualty list (40); killed on 1 December 2023 in Beit Lahia",
          ar: "فني مختبر في الأونروا؛ تطابق الاسم والعمر مع قائمة القتلى (40)؛ قُتل في 1 كانون الأول/ديسمبر 2023 في بيت لاهيا",
          he: "טכנאי מעבדה באונר״א; התאמת שם וגיל לרשימת ההרוגים (40); נהרג ב-1 בדצמבר 2023 בבית לאהיא",
        },
        url: "https://www.unrwa.org/they-will-never-be-forgotten-mohammad-abdel-qader-ramadan",
        match: "full-name+age",
        unrwaEvidence: "official-un-casualty",
        generated: false,
      },
    },
    {
      family: "obaid",
      person: {
        badge: "unrwa",
        name: "Mai Ramzi Abdullah Obaid",
        nameI18n: { de: "Mai Ramzi Abdullah Obaid", en: "Mai Ramzi Abdullah Obaid", ar: "مي رمزي عبدالله اعبيد", he: "מאי רמזי עבדאללה עובייד" },
        info: "UNRWA-Softwareentwicklerin (in der UNRWA-Quelle: Mai Ibaid); eindeutiger Namens- und Biografieabgleich mit der Opferliste (28)",
        infoI18n: {
          de: "UNRWA-Softwareentwicklerin (in der UNRWA-Quelle: Mai Ibaid); eindeutiger Namens- und Biografieabgleich mit der Opferliste (28)",
          en: "UNRWA software developer (named Mai Ibaid by UNRWA); unique name-and-biography match with the casualty list (28)",
          ar: "مطوّرة برمجيات في الأونروا (ورد اسمها لدى الأونروا: مي اعبيد)؛ تطابق فريد للاسم والسيرة مع قائمة القتلى (28)",
          he: "מפתחת תוכנה באונר״א (מאי איבאיד במקור אונר״א); התאמה ייחודית של השם והביוגרפיה לרשימת ההרוגים (28)",
        },
        url: "https://www.unrwa.org/sites/default/files/content/resources/13.may_version.pdf",
        match: "name+biography",
        unrwaEvidence: "official-un-casualty",
        generated: false,
      },
    },
  ];

  window.FAM_NOTES = window.FAM_NOTES || {};
  records.forEach(({ family, person }) => {
    const note = window.FAM_NOTES[family] = window.FAM_NOTES[family] || {};
    note.notable = note.notable || [];
    note.notable.push(person);
  });
  window.UNRWA_PERSONNEL = records;
})();
