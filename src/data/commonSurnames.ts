import { TipkurResponse } from "../types";

// 26 Common Khasi Surnames cataloged with verified API response data
export const COMMON_SURNAMES_LIST: string[] = [
  "Diengdoh",
  "Diengdoh Nongstoiñ",
  "Hek",
  "Hynñiewta",
  "Ïawphñiaw",
  "Kharkongor",
  "Kurbah",
  "Kurkalang",
  "Laloo",
  "Lyngdoh",
  "Marngar",
  "Nongbri",
  "Nongbsap Pyrtuh",
  "Nongkynrih",
  "Pakynteiñ",
  "Pariat",
  "Rapsang Marbisu",
  "Rapsang Nongpiur",
  "Ryntathiang",
  "Shabong",
  "Shadap",
  "Shylla",
  "Sohkhlet",
  "Sohtun",
  "Syiemlieh",
  "Tariang"
];

// Map of pre-loaded wad-kur responses for the 26 common surnames
export const COMMON_SURNAMES_DATA: Record<string, TipkurResponse> = {
  "diengdoh": {
    "mode": "wad-kur",
    "query": "Diengdoh",
    "normalized_query": "diengdoh",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "iaw-shi-bdi",
        "title": "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
        "shikur_clans": [
          "Ïaw Shi Bdi",
          "Laloo",
          "Pyrbot",
          "Amkoi",
          "Amdep",
          "Kadep",
          "Kadew",
          "Kadiang",
          "Kalang",
          "Kanai",
          "Kasah",
          "Kashngaiñ",
          "Katkeh",
          "Diengdoh",
          "Diengdoh-Bah",
          "Diengdoh-Kylla",
          "Diengdoh-Shngaiñlang",
          "Diengdoh Parïong",
          "Diengdoh Nongstoiñ",
          "Doom",
          "Hek",
          "Ïongkjam",
          "Jui",
          "Larom",
          "Lamin",
          "Lyngdoh Lamin",
          "Marngar",
          "Marong",
          "Mesui",
          "Nartiang",
          "Nui",
          "Parïong",
          "Phup",
          "Piat",
          "Pohkhloo",
          "Pohduna",
          "Pohlynjar",
          "Pohriej",
          "Pohrmen",
          "Pohshen",
          "Pohsnem",
          "Pohtam",
          "Put",
          "Rymbui",
          "Suji",
          "Tui",
          "Tai",
          "Wanpiat",
          "War"
        ],
        "teh_kur_clans": [
          "Syngngai",
          "Khongsdoh",
          "Padoh"
        ],
        "summary_khasi": "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
        "summary_english": "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
        "citation": "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "nongkynrih": {
    "mode": "wad-kur",
    "query": "Nongkynrih",
    "normalized_query": "nongkynrih",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "nongkynrih-shadap-kynshi",
        "title": "Nongkynrih / Shadap / Nongbri / Passah / Lyngdoh Kynshi",
        "shikur_clans": [
          "Nongkynrih",
          "Shadap",
          "Passah",
          "Pasah",
          "Nongbri",
          "Lyngdoh Kynshi",
          "Lyngdoh Nongbri",
          "Marboh",
          "Namsheh",
          "Nongphod"
        ],
        "teh_kur_clans": [
          "Pombah",
          "Wahbah",
          "Shadap Manner",
          "Shadap Sabit"
        ],
        "summary_khasi": "Ki kur Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, bad Namsheh ki ïalong shikur (kawei ka kpoh) bad kim bit ban ïashongkha (Sang). Ha Riangmang (p. 93) ïa ki Nongkynrih la khot 'Nongphod'. Ki Pombah bad Wahbah ruh ki ïateh kur bad ki Shadap.",
        "summary_english": "Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, and Namsheh share the same clan lineage (ïalong shikur) and cannot intermarry (Sang). Pombah and Wahbah are also prohibited from marrying Shadap.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #57, #76, #92 (Pages 93, 95, 97, 98)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "kharkongor": {
    "mode": "wad-kur",
    "query": "Kharkongor",
    "normalized_query": "kharkongor",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "kharkongngor",
        "title": "Kharkongngor & Kharshi-ïing",
        "shikur_clans": [
          "Kharkongngor",
          "Kharkongor"
        ],
        "teh_kur_clans": [
          "Kharshi-ïing",
          "Kharshiing"
        ],
        "summary_khasi": "Mih na ka Mei-Ïawbei 'Mei Moh Kynhong' (~1450 AD) ha Nongkyntir kaba la shongkha bad u Step na ka kur Ryndem. Ki Kharkongngor ki ïakam kur bad ki Kharshi-ïing.",
        "summary_english": "Descends from 'Mei Moh Kynhong' (~1450 AD) in Nongkyntir. Kharkongngor maintains an ïakam kur pact with Kharshi-ïing.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #13 (Page 87)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "laloo": {
    "mode": "wad-kur",
    "query": "Laloo",
    "normalized_query": "laloo",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "iaw-shi-bdi",
        "title": "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
        "shikur_clans": [
          "Ïaw Shi Bdi",
          "Laloo",
          "Pyrbot",
          "Amkoi",
          "Amdep",
          "Kadep",
          "Kadew",
          "Kadiang",
          "Kalang",
          "Kanai",
          "Kasah",
          "Kashngaiñ",
          "Katkeh",
          "Diengdoh",
          "Diengdoh-Bah",
          "Diengdoh-Kylla",
          "Diengdoh-Shngaiñlang",
          "Diengdoh Parïong",
          "Diengdoh Nongstoiñ",
          "Doom",
          "Hek",
          "Ïongkjam",
          "Jui",
          "Larom",
          "Lamin",
          "Lyngdoh Lamin",
          "Marngar",
          "Marong",
          "Mesui",
          "Nartiang",
          "Nui",
          "Parïong",
          "Phup",
          "Piat",
          "Pohkhloo",
          "Pohduna",
          "Pohlynjar",
          "Pohriej",
          "Pohrmen",
          "Pohshen",
          "Pohsnem",
          "Pohtam",
          "Put",
          "Rymbui",
          "Suji",
          "Tui",
          "Tai",
          "Wanpiat",
          "War"
        ],
        "teh_kur_clans": [
          "Syngngai",
          "Khongsdoh",
          "Padoh"
        ],
        "summary_khasi": "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
        "summary_english": "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
        "citation": "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "syiemlieh": {
    "mode": "wad-kur",
    "query": "Syiemlieh",
    "normalized_query": "syiemlieh",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "syiem-sutnga-syiemlieh",
        "title": "Syiem Sutnga / Syiemlieh / Nongspung / Kurkalang (Ka Li Dohkha)",
        "shikur_clans": [
          "Syiem Sutnga",
          "Syiemlieh",
          "Syiemlieh Nongkhlaw",
          "Syiemlieh Nongspung",
          "Syiem Kaitkuna",
          "Syiemïong Nongspung",
          "Syiem Nongshai",
          "Syiemsat",
          "Syiem Umsaw Nongbri",
          "Mynso Shangpung",
          "Nongspung",
          "Nongsteng",
          "Pakem Kajuh",
          "Pyrtuh Shangpung",
          "Sutnga",
          "Kurkalang",
          "Muliar"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Mih na ki 5 ngut ki khun kynthei Ka Li Dohkha (Ka Nga, Ka Teiñ, Ka Lieh, Ka Pung, Ka Lang).",
        "summary_english": "Descends from the five daughters of Ka Li Dohkha across Sutnga, Shangpung, Nongkhlaw, and Nongspung.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #102, #104 (Pages 8, 99)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "shadap": {
    "mode": "wad-kur",
    "query": "Shadap",
    "normalized_query": "shadap",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "nongkynrih-shadap-kynshi",
        "title": "Nongkynrih / Shadap / Nongbri / Passah / Lyngdoh Kynshi",
        "shikur_clans": [
          "Nongkynrih",
          "Shadap",
          "Passah",
          "Pasah",
          "Nongbri",
          "Lyngdoh Kynshi",
          "Lyngdoh Nongbri",
          "Marboh",
          "Namsheh",
          "Nongphod"
        ],
        "teh_kur_clans": [
          "Pombah",
          "Wahbah",
          "Shadap Manner",
          "Shadap Sabit"
        ],
        "summary_khasi": "Ki kur Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, bad Namsheh ki ïalong shikur (kawei ka kpoh) bad kim bit ban ïashongkha (Sang). Ha Riangmang (p. 93) ïa ki Nongkynrih la khot 'Nongphod'. Ki Pombah bad Wahbah ruh ki ïateh kur bad ki Shadap.",
        "summary_english": "Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, and Namsheh share the same clan lineage (ïalong shikur) and cannot intermarry (Sang). Pombah and Wahbah are also prohibited from marrying Shadap.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #57, #76, #92 (Pages 93, 95, 97, 98)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "pakynteiñ": {
    "mode": "wad-kur",
    "query": "Pakynteiñ",
    "normalized_query": "pakyntein",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "so-kpoh-khatar-wyrnai",
        "title": "So Kpoh Khatar Wyrnai (Bon / Teiñ / Wet / Doh)",
        "shikur_clans": [
          "Bon",
          "Pasubon",
          "Lipon",
          "Rangad",
          "Rngad",
          "Teiñ",
          "Pakynteiñ",
          "War",
          "Nikhla",
          "Wet",
          "Paswet",
          "Kynjing",
          "Lytan",
          "Lywait",
          "Muthyan",
          "Lakiang",
          "Niangliar",
          "Lakhon",
          "Katphoh",
          "Gatphoh",
          "Niangphoh",
          "Siangphoh",
          "Shyrmang Jowai",
          "Lanong",
          "Pyrdiang",
          "Bleiñ",
          "Kma",
          "Doh",
          "Lyngdoh",
          "Syngkon",
          "Kon",
          "Siangbud",
          "Nongbah"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "So Kpoh Khatar Wyrnai ha Jaiñtia: Bon, Teiñ, Wet, bad Doh lem bad ki tnad kpoh jong ki.",
        "summary_english": "The historic 'So Kpoh Khatar Wyrnai' (Four Wombs, Twelve Branches) of Jaiñtia Hills.",
        "citation": "Rev. I. Kharkongngor (2004) & Spiton Kharakor, Entries #3 (Page 86)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "pakyntein": {
    "mode": "wad-kur",
    "query": "Pakynteiñ",
    "normalized_query": "pakyntein",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "so-kpoh-khatar-wyrnai",
        "title": "So Kpoh Khatar Wyrnai (Bon / Teiñ / Wet / Doh)",
        "shikur_clans": [
          "Bon",
          "Pasubon",
          "Lipon",
          "Rangad",
          "Rngad",
          "Teiñ",
          "Pakynteiñ",
          "War",
          "Nikhla",
          "Wet",
          "Paswet",
          "Kynjing",
          "Lytan",
          "Lywait",
          "Muthyan",
          "Lakiang",
          "Niangliar",
          "Lakhon",
          "Katphoh",
          "Gatphoh",
          "Niangphoh",
          "Siangphoh",
          "Shyrmang Jowai",
          "Lanong",
          "Pyrdiang",
          "Bleiñ",
          "Kma",
          "Doh",
          "Lyngdoh",
          "Syngkon",
          "Kon",
          "Siangbud",
          "Nongbah"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "So Kpoh Khatar Wyrnai ha Jaiñtia: Bon, Teiñ, Wet, bad Doh lem bad ki tnad kpoh jong ki.",
        "summary_english": "The historic 'So Kpoh Khatar Wyrnai' (Four Wombs, Twelve Branches) of Jaiñtia Hills.",
        "citation": "Rev. I. Kharkongngor (2004) & Spiton Kharakor, Entries #3 (Page 86)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "ïawphñiaw": {
    "mode": "wad-kur",
    "query": "Ïawphñiaw",
    "normalized_query": "iawphniaw",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "iawphniaw-nongrum",
        "title": "Ïawphñiaw / Phñiaw / Nongrum / Rumnong / Nongneng",
        "shikur_clans": [
          "Ïawphñiaw",
          "Phñiaw",
          "Nongrum",
          "Rumnong",
          "Nongneng",
          "Nengnong",
          "Nongrem"
        ],
        "teh_kur_clans": [
          "Lyngkhoi",
          "Tariang",
          "Sianglong"
        ],
        "summary_khasi": "Mih na ka Phñiaw ha Rymbai/Tongseng bad pur sha Shella, Sohra, bad Sepngi. Ki Nongneng/Nengnong bad Nongrum/Rumnong ki ïalong shikur bad ki Ïawphñiaw.",
        "summary_english": "Originates from Ka Phñiaw. Nongrum, Rumnong, Nongneng, Nengnong, and Nongrem share the same bloodline with Ïawphñiaw.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #43, #78 (Pages 90–91, 97)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "iawphniaw": {
    "mode": "wad-kur",
    "query": "Ïawphñiaw",
    "normalized_query": "iawphniaw",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "iawphniaw-nongrum",
        "title": "Ïawphñiaw / Phñiaw / Nongrum / Rumnong / Nongneng",
        "shikur_clans": [
          "Ïawphñiaw",
          "Phñiaw",
          "Nongrum",
          "Rumnong",
          "Nongneng",
          "Nengnong",
          "Nongrem"
        ],
        "teh_kur_clans": [
          "Lyngkhoi",
          "Tariang",
          "Sianglong"
        ],
        "summary_khasi": "Mih na ka Phñiaw ha Rymbai/Tongseng bad pur sha Shella, Sohra, bad Sepngi. Ki Nongneng/Nengnong bad Nongrum/Rumnong ki ïalong shikur bad ki Ïawphñiaw.",
        "summary_english": "Originates from Ka Phñiaw. Nongrum, Rumnong, Nongneng, Nengnong, and Nongrem share the same bloodline with Ïawphñiaw.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #43, #78 (Pages 90–91, 97)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "hynñiewta": {
    "mode": "wad-kur",
    "query": "Hynñiewta",
    "normalized_query": "hynniewta",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "majaw-sangkli",
        "title": "Majaw & Sangkli (16 Jait)",
        "shikur_clans": [
          "Majaw",
          "Lyngdoh Peiñlang",
          "Basaïawmoit",
          "Basaïawmah",
          "Basaïawsnai",
          "Basaïawrit",
          "Lyngwi",
          "Nongbri Kynrut",
          "Hynñiewta",
          "Langpen",
          "Kurbah",
          "Rapsang Marbisu",
          "Sangkli",
          "Sankli",
          "Sangkli Pator",
          "Sangkli Lalung",
          "Sangkli Rngi",
          "Sangkli Mawïong",
          "Sangkli Pardi",
          "Muktieh",
          "Khongji",
          "Khongwar"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Khathynriew (16) jait ki kpoh kiba la mih na ka kur Majaw. Baroh ki ïalong shikur bad sang ban ïashongkha.",
        "summary_english": "Sixteen clans emerged from the Majaw clan. All 16 share the same ancestral lineage and cannot intermarry.",
        "citation": "Ka Seng Kur Majaw & Rev. I. Kharkongngor (2004), Entries #65 (Page 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "hynniewta": {
    "mode": "wad-kur",
    "query": "Hynñiewta",
    "normalized_query": "hynniewta",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "majaw-sangkli",
        "title": "Majaw & Sangkli (16 Jait)",
        "shikur_clans": [
          "Majaw",
          "Lyngdoh Peiñlang",
          "Basaïawmoit",
          "Basaïawmah",
          "Basaïawsnai",
          "Basaïawrit",
          "Lyngwi",
          "Nongbri Kynrut",
          "Hynñiewta",
          "Langpen",
          "Kurbah",
          "Rapsang Marbisu",
          "Sangkli",
          "Sankli",
          "Sangkli Pator",
          "Sangkli Lalung",
          "Sangkli Rngi",
          "Sangkli Mawïong",
          "Sangkli Pardi",
          "Muktieh",
          "Khongji",
          "Khongwar"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Khathynriew (16) jait ki kpoh kiba la mih na ka kur Majaw. Baroh ki ïalong shikur bad sang ban ïashongkha.",
        "summary_english": "Sixteen clans emerged from the Majaw clan. All 16 share the same ancestral lineage and cannot intermarry.",
        "citation": "Ka Seng Kur Majaw & Rev. I. Kharkongngor (2004), Entries #65 (Page 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "diengdoh nongstoiñ": {
    "mode": "wad-kur",
    "query": "Diengdoh Nongstoiñ",
    "normalized_query": "diengdoh nongstoin",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "iaw-shi-bdi",
        "title": "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
        "shikur_clans": [
          "Ïaw Shi Bdi",
          "Laloo",
          "Pyrbot",
          "Amkoi",
          "Amdep",
          "Kadep",
          "Kadew",
          "Kadiang",
          "Kalang",
          "Kanai",
          "Kasah",
          "Kashngaiñ",
          "Katkeh",
          "Diengdoh",
          "Diengdoh-Bah",
          "Diengdoh-Kylla",
          "Diengdoh-Shngaiñlang",
          "Diengdoh Parïong",
          "Diengdoh Nongstoiñ",
          "Doom",
          "Hek",
          "Ïongkjam",
          "Jui",
          "Larom",
          "Lamin",
          "Lyngdoh Lamin",
          "Marngar",
          "Marong",
          "Mesui",
          "Nartiang",
          "Nui",
          "Parïong",
          "Phup",
          "Piat",
          "Pohkhloo",
          "Pohduna",
          "Pohlynjar",
          "Pohriej",
          "Pohrmen",
          "Pohshen",
          "Pohsnem",
          "Pohtam",
          "Put",
          "Rymbui",
          "Suji",
          "Tui",
          "Tai",
          "Wanpiat",
          "War"
        ],
        "teh_kur_clans": [
          "Syngngai",
          "Khongsdoh",
          "Padoh"
        ],
        "summary_khasi": "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
        "summary_english": "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
        "citation": "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "diengdoh nongstoin": {
    "mode": "wad-kur",
    "query": "Diengdoh Nongstoiñ",
    "normalized_query": "diengdoh nongstoin",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "iaw-shi-bdi",
        "title": "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
        "shikur_clans": [
          "Ïaw Shi Bdi",
          "Laloo",
          "Pyrbot",
          "Amkoi",
          "Amdep",
          "Kadep",
          "Kadew",
          "Kadiang",
          "Kalang",
          "Kanai",
          "Kasah",
          "Kashngaiñ",
          "Katkeh",
          "Diengdoh",
          "Diengdoh-Bah",
          "Diengdoh-Kylla",
          "Diengdoh-Shngaiñlang",
          "Diengdoh Parïong",
          "Diengdoh Nongstoiñ",
          "Doom",
          "Hek",
          "Ïongkjam",
          "Jui",
          "Larom",
          "Lamin",
          "Lyngdoh Lamin",
          "Marngar",
          "Marong",
          "Mesui",
          "Nartiang",
          "Nui",
          "Parïong",
          "Phup",
          "Piat",
          "Pohkhloo",
          "Pohduna",
          "Pohlynjar",
          "Pohriej",
          "Pohrmen",
          "Pohshen",
          "Pohsnem",
          "Pohtam",
          "Put",
          "Rymbui",
          "Suji",
          "Tui",
          "Tai",
          "Wanpiat",
          "War"
        ],
        "teh_kur_clans": [
          "Syngngai",
          "Khongsdoh",
          "Padoh"
        ],
        "summary_khasi": "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
        "summary_english": "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
        "citation": "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "lyngdoh": {
    "mode": "wad-kur",
    "query": "LYNGDOH",
    "normalized_query": "lyngdoh",
    "found": true,
    "match_count": 7,
    "clusters": [
      {
        "id": "nongkynrih-shadap-kynshi",
        "title": "Nongkynrih / Shadap / Nongbri / Passah / Lyngdoh Kynshi",
        "shikur_clans": [
          "Nongkynrih",
          "Shadap",
          "Passah",
          "Pasah",
          "Nongbri",
          "Lyngdoh Kynshi",
          "Lyngdoh Nongbri",
          "Marboh",
          "Namsheh",
          "Nongphod"
        ],
        "teh_kur_clans": [
          "Pombah",
          "Wahbah",
          "Shadap Manner",
          "Shadap Sabit"
        ],
        "summary_khasi": "Ki kur Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, bad Namsheh ki ïalong shikur (kawei ka kpoh) bad kim bit ban ïashongkha (Sang). Ha Riangmang (p. 93) ïa ki Nongkynrih la khot 'Nongphod'. Ki Pombah bad Wahbah ruh ki ïateh kur bad ki Shadap.",
        "summary_english": "Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, and Namsheh share the same clan lineage (ïalong shikur) and cannot intermarry (Sang). Pombah and Wahbah are also prohibited from marrying Shadap.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #57, #76, #92 (Pages 93, 95, 97, 98)"
      },
      {
        "id": "iaw-shi-bdi",
        "title": "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
        "shikur_clans": [
          "Ïaw Shi Bdi",
          "Laloo",
          "Pyrbot",
          "Amkoi",
          "Amdep",
          "Kadep",
          "Kadew",
          "Kadiang",
          "Kalang",
          "Kanai",
          "Kasah",
          "Kashngaiñ",
          "Katkeh",
          "Diengdoh",
          "Diengdoh-Bah",
          "Diengdoh-Kylla",
          "Diengdoh-Shngaiñlang",
          "Diengdoh Parïong",
          "Diengdoh Nongstoiñ",
          "Doom",
          "Hek",
          "Ïongkjam",
          "Jui",
          "Larom",
          "Lamin",
          "Lyngdoh Lamin",
          "Marngar",
          "Marong",
          "Mesui",
          "Nartiang",
          "Nui",
          "Parïong",
          "Phup",
          "Piat",
          "Pohkhloo",
          "Pohduna",
          "Pohlynjar",
          "Pohriej",
          "Pohrmen",
          "Pohshen",
          "Pohsnem",
          "Pohtam",
          "Put",
          "Rymbui",
          "Suji",
          "Tui",
          "Tai",
          "Wanpiat",
          "War"
        ],
        "teh_kur_clans": [
          "Syngngai",
          "Khongsdoh",
          "Padoh"
        ],
        "summary_khasi": "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
        "summary_english": "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
        "citation": "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
      },
      {
        "id": "majaw-sangkli",
        "title": "Majaw & Sangkli (16 Jait)",
        "shikur_clans": [
          "Majaw",
          "Lyngdoh Peiñlang",
          "Basaïawmoit",
          "Basaïawmah",
          "Basaïawsnai",
          "Basaïawrit",
          "Lyngwi",
          "Nongbri Kynrut",
          "Hynñiewta",
          "Langpen",
          "Kurbah",
          "Rapsang Marbisu",
          "Sangkli",
          "Sankli",
          "Sangkli Pator",
          "Sangkli Lalung",
          "Sangkli Rngi",
          "Sangkli Mawïong",
          "Sangkli Pardi",
          "Muktieh",
          "Khongji",
          "Khongwar"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Khathynriew (16) jait ki kpoh kiba la mih na ka kur Majaw. Baroh ki ïalong shikur bad sang ban ïashongkha.",
        "summary_english": "Sixteen clans emerged from the Majaw clan. All 16 share the same ancestral lineage and cannot intermarry.",
        "citation": "Ka Seng Kur Majaw & Rev. I. Kharkongngor (2004), Entries #65 (Page 96)"
      },
      {
        "id": "so-kpoh-khatar-wyrnai",
        "title": "So Kpoh Khatar Wyrnai (Bon / Teiñ / Wet / Doh)",
        "shikur_clans": [
          "Bon",
          "Pasubon",
          "Lipon",
          "Rangad",
          "Rngad",
          "Teiñ",
          "Pakynteiñ",
          "War",
          "Nikhla",
          "Wet",
          "Paswet",
          "Kynjing",
          "Lytan",
          "Lywait",
          "Muthyan",
          "Lakiang",
          "Niangliar",
          "Lakhon",
          "Katphoh",
          "Gatphoh",
          "Niangphoh",
          "Siangphoh",
          "Shyrmang Jowai",
          "Lanong",
          "Pyrdiang",
          "Bleiñ",
          "Kma",
          "Doh",
          "Lyngdoh",
          "Syngkon",
          "Kon",
          "Siangbud",
          "Nongbah"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "So Kpoh Khatar Wyrnai ha Jaiñtia: Bon, Teiñ, Wet, bad Doh lem bad ki tnad kpoh jong ki.",
        "summary_english": "The historic 'So Kpoh Khatar Wyrnai' (Four Wombs, Twelve Branches) of Jaiñtia Hills.",
        "citation": "Rev. I. Kharkongngor (2004) & Spiton Kharakor, Entries #3 (Page 86)"
      },
      {
        "id": "khongsngi-lyngdoh-mawphlang",
        "title": "Khongsngi / Lyngdoh Mawphlang / Rapthap / Thawmuit",
        "shikur_clans": [
          "Khongsngi",
          "Lyngdoh Mawphlang",
          "Lyngdoh Nonglwai",
          "Lyngdoh Nongpiur",
          "Rapthap",
          "Lyngwa Rapthap",
          "Thawmuit",
          "Pom Pyrthat",
          "Pompyrthat",
          "Rapsang Nongpiur",
          "Khongsti",
          "Mawlieh",
          "Khongnoh",
          "Kyllang"
        ],
        "teh_kur_clans": [
          "Lyngdoh Sangriang"
        ],
        "summary_khasi": "Baroh kine ki dei ki khun ka Khmah Lyngdoh Mawphlang (bad ha Riangmang la khot 'Kyllang'). Ki Lyngdoh Sangriang ruh ki ïadei kur bad ki.",
        "summary_english": "All descend from Ka Khmah Lyngdoh Mawphlang, with Lyngdoh Sangriang also bound by clan kinship.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #29 (Page 89)"
      },
      {
        "id": "lyngkhoi-cluster",
        "title": "Lyngkhoi / Lyngdoh Nonglait / Sawkmie / Thangmyrsiang",
        "shikur_clans": [
          "Lyngkhoi",
          "Langkhoi",
          "Lyngdoh Nonglait",
          "Lyngkhoi Saw",
          "Sawkmie",
          "Lyngkhoi Ñiuh",
          "Lyngkhoi Thangmyrsiang",
          "Thangmyrsiang",
          "Lyngkhoi War Shrieh",
          "Lyngkhoi Ritiang",
          "Lyngkhoi Ladew",
          "Lyngkhoi Dewsaw"
        ],
        "teh_kur_clans": [
          "Nongrum"
        ],
        "summary_khasi": "Mih na ki saw ngut ki khun kynthei ka kmie tymmen Lyngkhoi ha Nongsynrieh (Mawkyrwat): Lyngdoh Nonglait, Sawkmie, Lyngkhoi Ñiuh, bad Lyngkhoi Thangmyrsiang. Ki ïakam kur ruh bad ki Nongrum.",
        "summary_english": "Descends from four daughters of the first Lyngkhoi ancestress in Nongsynrieh: Lyngdoh Nonglait, Sawkmie, Lyngkhoi Ñiuh, and Lyngkhoi Thangmyrsiang. Also bound with Nongrum.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #55 (Pages 94–95)"
      },
      {
        "id": "nongbsap-vs-mylliem-pyrtuh",
        "title": "Lyngdoh Nongbsap / Nongbsap Pyrtuh / Nongrang / Sohphoh",
        "shikur_clans": [
          "Lyngdoh Nongbsap",
          "Nongbsap",
          "Nongbsap Pyrtuh",
          "Nongrang",
          "Sohphoh"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Lyngdoh Nongbsap, Nongbsap Pyrtuh, Nongrang, bad Sohphoh ki dei kawei ka kpoh. Hynrei ki Nongbsap Pyrtuh bad ki Mylliem Pyrtuh KIM DEI KI JUH (Page 96).",
        "summary_english": "Lyngdoh Nongbsap, Nongbsap Pyrtuh, Nongrang, and Sohphoh are one womb. Explicitly distinct from Mylliem Pyrtuh (Page 96).",
        "citation": "Rev. I. Kharkongngor (2004), Entries #62, #74 (Pages 95–97)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "sohtun": {
    "mode": "wad-kur",
    "query": "Sohtun",
    "normalized_query": "sohtun",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "kharphuli-myrthong",
        "title": "Kharphuli / Sohkhlet / Sohtun & Myrthong",
        "shikur_clans": [
          "Kharphuli",
          "Sohkhlet",
          "Sohtun"
        ],
        "teh_kur_clans": [
          "Myrthong"
        ],
        "summary_khasi": "Ki Kharphuli (bad Sohkhlet/Sohtun) ki ïakam kur bad ki Myrthong namar u parad Myrthong u la pynrieh bad pyllait im ïa ki ha ka thma ha Lyngngam.",
        "summary_english": "Kharphuli (and Sohkhlet/Sohtun) maintain an ïakam kur covenant with Myrthong after a Myrthong elder hid and saved them during a conflict in Lyngngam.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #17, #96 (Pages 88, 98)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "nongbsap pyrtuh": {
    "mode": "wad-kur",
    "query": "Nongbsap Pyrtuh",
    "normalized_query": "nongbsap pyrtuh",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "nongbsap-vs-mylliem-pyrtuh",
        "title": "Lyngdoh Nongbsap / Nongbsap Pyrtuh / Nongrang / Sohphoh",
        "shikur_clans": [
          "Lyngdoh Nongbsap",
          "Nongbsap",
          "Nongbsap Pyrtuh",
          "Nongrang",
          "Sohphoh"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Lyngdoh Nongbsap, Nongbsap Pyrtuh, Nongrang, bad Sohphoh ki dei kawei ka kpoh. Hynrei ki Nongbsap Pyrtuh bad ki Mylliem Pyrtuh KIM DEI KI JUH (Page 96).",
        "summary_english": "Lyngdoh Nongbsap, Nongbsap Pyrtuh, Nongrang, and Sohphoh are one womb. Explicitly distinct from Mylliem Pyrtuh (Page 96).",
        "citation": "Rev. I. Kharkongngor (2004), Entries #62, #74 (Pages 95–97)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "ryntathiang": {
    "mode": "wad-kur",
    "query": "Ryntathiang",
    "normalized_query": "ryntathiang",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "laitphlang-wahlang",
        "title": "Laitphlang & Wahlang Pahsyntiew",
        "shikur_clans": [
          "Wahlang",
          "Wahlang Pahsyntiew",
          "Laitphlang",
          "Wahlang Ryntathiang",
          "Ryntathiang"
        ],
        "teh_kur_clans": [
          "Aliya",
          "Alia"
        ],
        "summary_khasi": "Ka Laitphlang ka dei ka kyrteng sin jong ka kpoh ba mih na ka Wahlang Pahsyntiew. Tangba ka kpoh Laitphlang kam shym la ïasoh ha ki jingïateh kur ba hadien jong ki Wahlang Pahsyntiew—kumta ka sang tang bad ki ïing tynrai Wahlang Pahsyntiew.",
        "summary_english": "Laitphlang is a branch nickname of Wahlang Pahsyntiew. Laitphlang did not join external Teh Kur pacts, so it is strictly Sang only with original ancestral Wahlang Pahsyntiew houses.",
        "citation": "Tbn. W.R. Laitphlang & Rev. I. Kharkongngor (2004), Entries #91, #110 (Pages 98, 100–102)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "marngar": {
    "mode": "wad-kur",
    "query": "Marngar",
    "normalized_query": "marngar",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "iaw-shi-bdi",
        "title": "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
        "shikur_clans": [
          "Ïaw Shi Bdi",
          "Laloo",
          "Pyrbot",
          "Amkoi",
          "Amdep",
          "Kadep",
          "Kadew",
          "Kadiang",
          "Kalang",
          "Kanai",
          "Kasah",
          "Kashngaiñ",
          "Katkeh",
          "Diengdoh",
          "Diengdoh-Bah",
          "Diengdoh-Kylla",
          "Diengdoh-Shngaiñlang",
          "Diengdoh Parïong",
          "Diengdoh Nongstoiñ",
          "Doom",
          "Hek",
          "Ïongkjam",
          "Jui",
          "Larom",
          "Lamin",
          "Lyngdoh Lamin",
          "Marngar",
          "Marong",
          "Mesui",
          "Nartiang",
          "Nui",
          "Parïong",
          "Phup",
          "Piat",
          "Pohkhloo",
          "Pohduna",
          "Pohlynjar",
          "Pohriej",
          "Pohrmen",
          "Pohshen",
          "Pohsnem",
          "Pohtam",
          "Put",
          "Rymbui",
          "Suji",
          "Tui",
          "Tai",
          "Wanpiat",
          "War"
        ],
        "teh_kur_clans": [
          "Syngngai",
          "Khongsdoh",
          "Padoh"
        ],
        "summary_khasi": "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
        "summary_english": "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
        "citation": "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "shabong": {
    "mode": "wad-kur",
    "query": "Shabong",
    "normalized_query": "shabong",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "mukhim-shabong-shallam",
        "title": "Mukhim / Shabong / Shallam / Khonglam",
        "shikur_clans": [
          "Mukhim",
          "Mukhim Bina",
          "Mukhim Tangphar",
          "Shabong",
          "Shallam",
          "Challam",
          "Shalam"
        ],
        "teh_kur_clans": [
          "Khonglam"
        ],
        "summary_khasi": "Lai ngut shipara na Umtangper: kiba leit sha Synteng la khot Shallam, sha War la khot Mukhim, sha Khyrim la khot Shabong. Kawei ka kpoh. Ki Khonglam na Nongblai ruh ki kam kur bad ki Shabong.",
        "summary_english": "Three sisters from Umtangper settled in Synteng (Shallam), War (Mukhim), and Khyrim (Shabong)—one single womb. Khonglam also claims kinship with Shabong.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #72 (Pages 3, 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "hek": {
    "mode": "wad-kur",
    "query": "Hek",
    "normalized_query": "hek",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "iaw-shi-bdi",
        "title": "Ïaw Shi Bdi (Diengdoh / Laloo / Lamin / Pyrbot / Syngngai)",
        "shikur_clans": [
          "Ïaw Shi Bdi",
          "Laloo",
          "Pyrbot",
          "Amkoi",
          "Amdep",
          "Kadep",
          "Kadew",
          "Kadiang",
          "Kalang",
          "Kanai",
          "Kasah",
          "Kashngaiñ",
          "Katkeh",
          "Diengdoh",
          "Diengdoh-Bah",
          "Diengdoh-Kylla",
          "Diengdoh-Shngaiñlang",
          "Diengdoh Parïong",
          "Diengdoh Nongstoiñ",
          "Doom",
          "Hek",
          "Ïongkjam",
          "Jui",
          "Larom",
          "Lamin",
          "Lyngdoh Lamin",
          "Marngar",
          "Marong",
          "Mesui",
          "Nartiang",
          "Nui",
          "Parïong",
          "Phup",
          "Piat",
          "Pohkhloo",
          "Pohduna",
          "Pohlynjar",
          "Pohriej",
          "Pohrmen",
          "Pohshen",
          "Pohsnem",
          "Pohtam",
          "Put",
          "Rymbui",
          "Suji",
          "Tui",
          "Tai",
          "Wanpiat",
          "War"
        ],
        "teh_kur_clans": [
          "Syngngai",
          "Khongsdoh",
          "Padoh"
        ],
        "summary_khasi": "Kine ki 40+ tylli ki kur (lait noh ki Syngngai) ki mih na ki 20 ngut ki khun kynthei ka Ïaw Shi Bdi bad u Riang Bareh. Ki Syngngai pat ki la ïateh kur bad ki Diengdoh ha Sohra.",
        "summary_english": "Over 40 clans across War Jaiñtia, Jowai, Khasi Hills, and Bhoi descend from the 20 daughters of Ka Ïaw Shi Bdi and U Riang Bareh. Syngngai bound themselves via ïateh kur with Diengdoh in Sohra.",
        "citation": "Rev. I. Kharkongngor (2004) & Medro Singh Diengdoh, Entries #28, #44, #50, #67 (Pages 89, 91–92, 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "kurbah": {
    "mode": "wad-kur",
    "query": "Kurbah",
    "normalized_query": "kurbah",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "majaw-sangkli",
        "title": "Majaw & Sangkli (16 Jait)",
        "shikur_clans": [
          "Majaw",
          "Lyngdoh Peiñlang",
          "Basaïawmoit",
          "Basaïawmah",
          "Basaïawsnai",
          "Basaïawrit",
          "Lyngwi",
          "Nongbri Kynrut",
          "Hynñiewta",
          "Langpen",
          "Kurbah",
          "Rapsang Marbisu",
          "Sangkli",
          "Sankli",
          "Sangkli Pator",
          "Sangkli Lalung",
          "Sangkli Rngi",
          "Sangkli Mawïong",
          "Sangkli Pardi",
          "Muktieh",
          "Khongji",
          "Khongwar"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Khathynriew (16) jait ki kpoh kiba la mih na ka kur Majaw. Baroh ki ïalong shikur bad sang ban ïashongkha.",
        "summary_english": "Sixteen clans emerged from the Majaw clan. All 16 share the same ancestral lineage and cannot intermarry.",
        "citation": "Ka Seng Kur Majaw & Rev. I. Kharkongngor (2004), Entries #65 (Page 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "kurkalang": {
    "mode": "wad-kur",
    "query": "Kurkalang",
    "normalized_query": "kurkalang",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "syiem-sutnga-syiemlieh",
        "title": "Syiem Sutnga / Syiemlieh / Nongspung / Kurkalang (Ka Li Dohkha)",
        "shikur_clans": [
          "Syiem Sutnga",
          "Syiemlieh",
          "Syiemlieh Nongkhlaw",
          "Syiemlieh Nongspung",
          "Syiem Kaitkuna",
          "Syiemïong Nongspung",
          "Syiem Nongshai",
          "Syiemsat",
          "Syiem Umsaw Nongbri",
          "Mynso Shangpung",
          "Nongspung",
          "Nongsteng",
          "Pakem Kajuh",
          "Pyrtuh Shangpung",
          "Sutnga",
          "Kurkalang",
          "Muliar"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Mih na ki 5 ngut ki khun kynthei Ka Li Dohkha (Ka Nga, Ka Teiñ, Ka Lieh, Ka Pung, Ka Lang).",
        "summary_english": "Descends from the five daughters of Ka Li Dohkha across Sutnga, Shangpung, Nongkhlaw, and Nongspung.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #102, #104 (Pages 8, 99)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "sohkhlet": {
    "mode": "wad-kur",
    "query": "Sohkhlet",
    "normalized_query": "sohkhlet",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "kharphuli-myrthong",
        "title": "Kharphuli / Sohkhlet / Sohtun & Myrthong",
        "shikur_clans": [
          "Kharphuli",
          "Sohkhlet",
          "Sohtun"
        ],
        "teh_kur_clans": [
          "Myrthong"
        ],
        "summary_khasi": "Ki Kharphuli (bad Sohkhlet/Sohtun) ki ïakam kur bad ki Myrthong namar u parad Myrthong u la pynrieh bad pyllait im ïa ki ha ka thma ha Lyngngam.",
        "summary_english": "Kharphuli (and Sohkhlet/Sohtun) maintain an ïakam kur covenant with Myrthong after a Myrthong elder hid and saved them during a conflict in Lyngngam.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #17, #96 (Pages 88, 98)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "rapsang marbisu": {
    "mode": "wad-kur",
    "query": "Rapsang Marbisu",
    "normalized_query": "rapsang marbisu",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "majaw-sangkli",
        "title": "Majaw & Sangkli (16 Jait)",
        "shikur_clans": [
          "Majaw",
          "Lyngdoh Peiñlang",
          "Basaïawmoit",
          "Basaïawmah",
          "Basaïawsnai",
          "Basaïawrit",
          "Lyngwi",
          "Nongbri Kynrut",
          "Hynñiewta",
          "Langpen",
          "Kurbah",
          "Rapsang Marbisu",
          "Sangkli",
          "Sankli",
          "Sangkli Pator",
          "Sangkli Lalung",
          "Sangkli Rngi",
          "Sangkli Mawïong",
          "Sangkli Pardi",
          "Muktieh",
          "Khongji",
          "Khongwar"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Khathynriew (16) jait ki kpoh kiba la mih na ka kur Majaw. Baroh ki ïalong shikur bad sang ban ïashongkha.",
        "summary_english": "Sixteen clans emerged from the Majaw clan. All 16 share the same ancestral lineage and cannot intermarry.",
        "citation": "Ka Seng Kur Majaw & Rev. I. Kharkongngor (2004), Entries #65 (Page 96)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "rapsang nongpiur": {
    "mode": "wad-kur",
    "query": "Rapsang Nongpiur",
    "normalized_query": "rapsang nongpiur",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "khongsngi-lyngdoh-mawphlang",
        "title": "Khongsngi / Lyngdoh Mawphlang / Rapthap / Thawmuit",
        "shikur_clans": [
          "Khongsngi",
          "Lyngdoh Mawphlang",
          "Lyngdoh Nonglwai",
          "Lyngdoh Nongpiur",
          "Rapthap",
          "Lyngwa Rapthap",
          "Thawmuit",
          "Pom Pyrthat",
          "Pompyrthat",
          "Rapsang Nongpiur",
          "Khongsti",
          "Mawlieh",
          "Khongnoh",
          "Kyllang"
        ],
        "teh_kur_clans": [
          "Lyngdoh Sangriang"
        ],
        "summary_khasi": "Baroh kine ki dei ki khun ka Khmah Lyngdoh Mawphlang (bad ha Riangmang la khot 'Kyllang'). Ki Lyngdoh Sangriang ruh ki ïadei kur bad ki.",
        "summary_english": "All descend from Ka Khmah Lyngdoh Mawphlang, with Lyngdoh Sangriang also bound by clan kinship.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #29 (Page 89)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "tariang": {
    "mode": "wad-kur",
    "query": "Tariang",
    "normalized_query": "tariang",
    "found": true,
    "match_count": 2,
    "clusters": [
      {
        "id": "iawphniaw-nongrum",
        "title": "Ïawphñiaw / Phñiaw / Nongrum / Rumnong / Nongneng",
        "shikur_clans": [
          "Ïawphñiaw",
          "Phñiaw",
          "Nongrum",
          "Rumnong",
          "Nongneng",
          "Nengnong",
          "Nongrem"
        ],
        "teh_kur_clans": [
          "Lyngkhoi",
          "Tariang",
          "Sianglong"
        ],
        "summary_khasi": "Mih na ka Phñiaw ha Rymbai/Tongseng bad pur sha Shella, Sohra, bad Sepngi. Ki Nongneng/Nengnong bad Nongrum/Rumnong ki ïalong shikur bad ki Ïawphñiaw.",
        "summary_english": "Originates from Ka Phñiaw. Nongrum, Rumnong, Nongneng, Nengnong, and Nongrem share the same bloodline with Ïawphñiaw.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #43, #78 (Pages 90–91, 97)"
      },
      {
        "id": "tariang-cluster",
        "title": "Tariang / Nongtariang / Umdor / Nongrum",
        "shikur_clans": [
          "Tariang",
          "Nongtariang",
          "Tariang Lamarai",
          "Tariang Lukoi",
          "Tariang Mukhlen",
          "Tariang Sohmatan",
          "Tariang Pyrtuh",
          "Tariang Bataw",
          "Umdor",
          "Binan",
          "Jait Binan"
        ],
        "teh_kur_clans": [
          "Bareh Pohkshang",
          "Bareh",
          "Kassar",
          "Manar",
          "Pohlong",
          "Pohti Lynrum",
          "Nongrum Sohra",
          "Nongrum"
        ],
        "summary_khasi": "Ka kur Tariang ka don 5 kpoh bad ki ïalong shikur bad ki Nongrum (ha Ri Khasi) bad Umdor (Jait Binan).",
        "summary_english": "Tariang has 5 internal kpoh and is shikur with Nongrum and Umdor (Jait Binan), with lineage-specific prohibitions in Jowai.",
        "citation": "E.R. Tariang & Rev. I. Kharkongngor (2004), Entries #104, #114 (Pages 99, 102)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "pariat": {
    "mode": "wad-kur",
    "query": "Pariat",
    "normalized_query": "pariat",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "slong-thangkhiew-pariat-blah",
        "title": "Slong / Thangkhiew / Pariat / Shylla / Blah",
        "shikur_clans": [
          "Slong",
          "Shylla",
          "Chylla",
          "Blah",
          "Pariat",
          "Pde",
          "Thangkhiew",
          "Tangliang",
          "Sajem",
          "Ïatam",
          "Rabon"
        ],
        "teh_kur_clans": [
          "Snaitang",
          "Lartang"
        ],
        "summary_khasi": "Thangkhiew, Pariat, Shylla, Blah, Slong, bad Pde ki ïakam kur. Kumjuh Tangliang, Shylla, Sajem (Rabon), bad Ïatam.",
        "summary_english": "Thangkhiew, Pariat, Shylla, Blah, Slong, and Pde share clan kinship, alongside Tangliang, Sajem, and Ïatam.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #94, #95, #103, #105 (Pages 98, 99)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "shylla": {
    "mode": "wad-kur",
    "query": "Shylla",
    "normalized_query": "shylla",
    "found": true,
    "match_count": 1,
    "clusters": [
      {
        "id": "slong-thangkhiew-pariat-blah",
        "title": "Slong / Thangkhiew / Pariat / Shylla / Blah",
        "shikur_clans": [
          "Slong",
          "Shylla",
          "Chylla",
          "Blah",
          "Pariat",
          "Pde",
          "Thangkhiew",
          "Tangliang",
          "Sajem",
          "Ïatam",
          "Rabon"
        ],
        "teh_kur_clans": [
          "Snaitang",
          "Lartang"
        ],
        "summary_khasi": "Thangkhiew, Pariat, Shylla, Blah, Slong, bad Pde ki ïakam kur. Kumjuh Tangliang, Shylla, Sajem (Rabon), bad Ïatam.",
        "summary_english": "Thangkhiew, Pariat, Shylla, Blah, Slong, and Pde share clan kinship, alongside Tangliang, Sajem, and Ïatam.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #94, #95, #103, #105 (Pages 98, 99)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  },
  "nongbri": {
    "mode": "wad-kur",
    "query": "Nongbri",
    "normalized_query": "nongbri",
    "found": true,
    "match_count": 3,
    "clusters": [
      {
        "id": "nongkynrih-shadap-kynshi",
        "title": "Nongkynrih / Shadap / Nongbri / Passah / Lyngdoh Kynshi",
        "shikur_clans": [
          "Nongkynrih",
          "Shadap",
          "Passah",
          "Pasah",
          "Nongbri",
          "Lyngdoh Kynshi",
          "Lyngdoh Nongbri",
          "Marboh",
          "Namsheh",
          "Nongphod"
        ],
        "teh_kur_clans": [
          "Pombah",
          "Wahbah",
          "Shadap Manner",
          "Shadap Sabit"
        ],
        "summary_khasi": "Ki kur Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, bad Namsheh ki ïalong shikur (kawei ka kpoh) bad kim bit ban ïashongkha (Sang). Ha Riangmang (p. 93) ïa ki Nongkynrih la khot 'Nongphod'. Ki Pombah bad Wahbah ruh ki ïateh kur bad ki Shadap.",
        "summary_english": "Nongkynrih, Shadap, Passah, Nongbri, Lyngdoh Kynshi, Lyngdoh Nongbri, Marboh, and Namsheh share the same clan lineage (ïalong shikur) and cannot intermarry (Sang). Pombah and Wahbah are also prohibited from marrying Shadap.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #57, #76, #92 (Pages 93, 95, 97, 98)"
      },
      {
        "id": "majaw-sangkli",
        "title": "Majaw & Sangkli (16 Jait)",
        "shikur_clans": [
          "Majaw",
          "Lyngdoh Peiñlang",
          "Basaïawmoit",
          "Basaïawmah",
          "Basaïawsnai",
          "Basaïawrit",
          "Lyngwi",
          "Nongbri Kynrut",
          "Hynñiewta",
          "Langpen",
          "Kurbah",
          "Rapsang Marbisu",
          "Sangkli",
          "Sankli",
          "Sangkli Pator",
          "Sangkli Lalung",
          "Sangkli Rngi",
          "Sangkli Mawïong",
          "Sangkli Pardi",
          "Muktieh",
          "Khongji",
          "Khongwar"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Khathynriew (16) jait ki kpoh kiba la mih na ka kur Majaw. Baroh ki ïalong shikur bad sang ban ïashongkha.",
        "summary_english": "Sixteen clans emerged from the Majaw clan. All 16 share the same ancestral lineage and cannot intermarry.",
        "citation": "Ka Seng Kur Majaw & Rev. I. Kharkongngor (2004), Entries #65 (Page 96)"
      },
      {
        "id": "syiem-sutnga-syiemlieh",
        "title": "Syiem Sutnga / Syiemlieh / Nongspung / Kurkalang (Ka Li Dohkha)",
        "shikur_clans": [
          "Syiem Sutnga",
          "Syiemlieh",
          "Syiemlieh Nongkhlaw",
          "Syiemlieh Nongspung",
          "Syiem Kaitkuna",
          "Syiemïong Nongspung",
          "Syiem Nongshai",
          "Syiemsat",
          "Syiem Umsaw Nongbri",
          "Mynso Shangpung",
          "Nongspung",
          "Nongsteng",
          "Pakem Kajuh",
          "Pyrtuh Shangpung",
          "Sutnga",
          "Kurkalang",
          "Muliar"
        ],
        "teh_kur_clans": [],
        "summary_khasi": "Mih na ki 5 ngut ki khun kynthei Ka Li Dohkha (Ka Nga, Ka Teiñ, Ka Lieh, Ka Pung, Ka Lang).",
        "summary_english": "Descends from the five daughters of Ka Li Dohkha across Sutnga, Shangpung, Nongkhlaw, and Nongspung.",
        "citation": "Rev. I. Kharkongngor (2004), Entries #102, #104 (Pages 8, 99)"
      }
    ],
    "disclaimer": "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
  }
};

/**
 * Normalizes Khasi characters for diacritic-safe comparison
 */
function normalizeKhasi(str: string): string {
  return str
    .toLowerCase()
    .replace(/[ïï]/g, "i")
    .replace(/[ññ]/g, "n")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Looks up a pre-cached wad-kur response from the common surnames dataset.
 * Returns the verified TipkurResponse if found, otherwise undefined.
 */
export function getCommonSurnameResponse(jait: string): TipkurResponse | undefined {
  if (!jait || typeof jait !== "string") return undefined;
  const clean = jait.trim();
  const lower = clean.toLowerCase();

  // 1. Direct match by lowercase key
  if (COMMON_SURNAMES_DATA[lower]) {
    return COMMON_SURNAMES_DATA[lower];
  }

  // 2. Diacritic-normalized match
  const norm = normalizeKhasi(clean);
  if (COMMON_SURNAMES_DATA[norm]) {
    return COMMON_SURNAMES_DATA[norm];
  }

  // 3. Fallback scan matching normalized keys
  for (const [key, data] of Object.entries(COMMON_SURNAMES_DATA)) {
    if (normalizeKhasi(key) === norm) {
      return data;
    }
  }

  return undefined;
}
