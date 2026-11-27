const fs = require("fs");
const path = require("path");

function normalizeKhasi(str) {
  return str
    .toLowerCase()
    .replace(/[ïï]/g, "i")
    .replace(/[ññ]/g, "n")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function slugify(str) {
  return normalizeKhasi(str).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// 81 links dataset from docs/Kur - links.pdf
const links81 = [
  { num: 1, page: 8, p: "Bamon", c: ["Suja"] },
  { num: 2, page: 8, p: "Khaiñ", c: ["Laitïam"] },
  { num: 3, page: 8, p: "Kharbani", c: ["Kharrani", "Kharsati"] },
  { num: 4, page: 8, p: "Kharbithai", c: ["Kharmithai"] },
  { num: 5, page: 8, p: "Kharbuki", c: ["Kharbihkhiew", "Kharbynnuid", "Kharsawkmie", "Kharumnuid"] },
  { num: 6, page: 8, p: "Kharbudon", c: ["Kharmatpen", "Kharmihpen"] },
  { num: 7, page: 8, p: "Kharkongor", c: ["Kharlor", "Kharshiïeng"] },
  { num: 8, page: 8, p: "Kharkrang", c: ["Lyngdoh Sadew"] },
  { num: 9, page: 8, p: "Khardohling", c: ["Khardympep", "Kharsahnoh", "Khonghat", "Khongshei"] },
  { num: 10, page: 8, p: "Kharlukhi", c: ["Kharsnabi", "Tiewtabi"] },
  { num: 11, page: 8, p: "Kharmudai", c: ["Kharmyndai"] },
  { num: 12, page: 8, p: "Kharphur", c: ["Wankhar"] },
  { num: 13, page: 8, p: "Kharumlong", c: ["Babai", "Kharmylliem"] },
  { num: 14, page: 8, p: "Kharraji", c: ["Kharhujon", "Kharhuru"] },
  { num: 15, page: 8, p: "Kharryja", c: ["Langte"] },
  { num: 16, page: 8, p: "Kharsyntiew", c: ["Kharngapkynta", "Kharphanbuh", "Kharsawian", "Kharwanlang", "Puiñdiwang", "Dkhar"] },
  { num: 17, page: 8, p: "Khongbuh", c: ["Khongbeh"] },
  { num: 18, page: 8, p: "Khongjoh", c: ["Nongpluh"] },
  { num: 19, page: 8, p: "Khonglah", c: ["Mynsong", "Ryntong", "Surong"] },
  { num: 20, page: 8, p: "Khongsit", c: ["Syngkrem", "Tongper", "Tynsong"] },
  { num: 21, page: 8, p: "Khongwir", c: ["Khongjah"] },
  { num: 22, page: 8, p: "Khyllait", c: ["Rani", "Stepwar"] },
  { num: 23, page: 8, p: "Khyllep", c: ["Tiewmon", "Tiewsoh", "Tiewla"] },
  { num: 24, page: 8, p: "Kyndiah", c: ["Najiar", "Rymbai", "Toi"] },
  { num: 25, page: 8, p: "Jyrwa Nongsiej", c: ["Jyrwa", "Mawleiñ Nongsiej", "Nongsiej", "Pdah-Ka-Siej"] },
  { num: 26, page: 8, p: "Langñiuh", c: ["Pathaw", "Pathawbah", "Khyrïemmujat", "Pathaw-Lar-ïew", "Pathawdih"] },
  { num: 27, page: 8, p: "Lahong", c: ["Suchiang"] },
  { num: 28, page: 9, p: "Laloo", aka: "Ïaw-shi-bdi", c: ["Amkoi", "Amdep", "Kadep", "Kadew", "Kadiang", "Kaiang", "Kanai", "Kasah", "Kashngaiñ", "Katkeh", "Khongsdoh", "Diengdohbah", "Diengdohkylla", "Doom", "Hek", "Ïongkjam", "Jui", "Laithma", "Lamin", "Larom", "Lyngdoh Lamin", "Marngor", "Marngar", "Marong", "Mesui", "Nartiang", "Nui", "Parïong", "Phup", "Piat", "Pohkhloo", "Pohduna", "Pohlynjar", "Pohriej", "Pohrmen", "Pohshen", "Pohsnem", "Pohtam", "Put", "Pyrbot", "Rymbui", "Suji", "Syngngai", "Tui", "Wanpiat", "War-Ïaw-shi-bdi"] },
  { num: 29, page: 9, p: "Lyngdoh Mawdkhap", c: ["Lyngdoh Marshyllong"] },
  { num: 30, page: 9, p: "Lyngdoh Mawlong", c: ["Mawlong", "Lyngdoh Marpna"] },
  { num: 31, page: 9, p: "Lyngdoh Mawnai", c: ["Jaraiñ", "Mawnai", "Lokhmi", "Lyngdoh Jaraiñ"] },
  { num: 32, page: 9, p: "Lyngdoh Mawphlang", c: ["Khongsti", "Khongstia", "Khongnoh", "Khongsngi", "Lyngdoh Mawlieh", "Lyngdoh Nongpyiur", "Thawmuit", "Rapsang Nongpyiur"] },
  { num: 33, page: 9, p: "Lyngdoh Mylliem", c: ["Basaringaid Kurkajuh", "Marbañiang", "Massar", "Mylliemumlong", "Sangot"] },
  { num: 34, page: 9, p: "Lyngdoh Mynso", c: ["Shen"] },
  { num: 35, page: 9, p: "Lyngdoh Nongkrem", c: ["Khongblah", "Khonglyngka", "Khongpdah", "Khonglyngkut", "Khyrïem Basanlarkhra", "Mawsharoh", "Mawthoh", "Nongtraw", "Pyngrope"] },
  { num: 36, page: 9, p: "Lyngdoh Nongkseh Sohïong", c: ["Thawbri"] },
  { num: 37, page: 9, p: "Lyngdoh Nongbri", c: ["Lyngdoh Kynshi", "Nongkynrih", "Passah", "Shadap"] },
  { num: 38, page: 9, p: "Lyngdoh Nongrang", c: ["Nongrang", "Lyngdoh Nongbsap", "Nongbsap Pyrtuh", "Nongbsap-Nongrang", "Khyrïem Nongrang"] },
  { num: 39, page: 9, p: "Lyngdoh Pyrtuh", c: ["Pyrtuh", "Lyngkot"] },
  { num: 40, page: 9, p: "Majaw", c: ["Basaïawmoit", "Lyngdoh Peiñlang", "Lyngwi", "Khongji", "Hynñiewta", "Sangkli", "Langi", "Muktieh", "Be", "Kurbah", "Rapsang Marbisu"] },
  { num: 41, page: 10, p: "Marpna", c: ["Mawlaitbnai"] },
  { num: 42, page: 10, p: "Marweiñ", c: ["Hahshah Ïawshwar", "Hahshah Nongiriang", "Hahshah Shrieh", "Nongdiangngan", "Nongtynger", "Shrieh"] },
  { num: 43, page: 10, p: "Mawkon", c: ["Khongbinan"] },
  { num: 44, page: 10, p: "Mawnai", c: ["Mawnai-aiñ", "Mawnaibah", "Mawblei", "Nongkhlaw"] },
  { num: 45, page: 10, p: "Mawpamkyi", c: ["Lartang"] },
  { num: 46, page: 10, p: "Mawri", c: ["Mawïong", "Mawkhap", "Nongbet", "Sohlang"] },
  { num: 47, page: 10, p: "Mylliemngap", c: ["Mylliempdah", "Sohtun", "Myrthong"] },
  { num: 48, page: 10, p: "Ñiewphantang", c: ["Hehkhlieh"] },
  { num: 49, page: 10, p: "Nongrum", c: ["Ïawphñiaw", "Nengnong", "Nongkyum", "Nongneng", "Nongrem", "Pohnong", "Rumnong"] },
  { num: 50, page: 10, p: "Nongneng Daloi", c: ["Lyngdoh Nongumlong", "Shanprew", "Nongneng Pator", "Kapew"] },
  { num: 51, page: 10, p: "Nongtdu", c: ["Nongtdeh"] },
  { num: 52, page: 10, p: "Pakynteiñ", c: ["Bhoi So-Kpoh", "War So-Kpoh", "Nikhla", "Bleiñ", "Katphoh", "Lipon", "Liwait", "Niangphoh", "Pasubon", "Rangat", "Singphoh", "Shyrmang So-Kpoh", "Paswet", "Kma", "Kynjing", "Lakiang", "Lanong", "Lytan", "Mutyen", "Pyrdiang", "Langdoh-Jwai", "Siangbud", "Syngkon"] },
  { num: 53, page: 10, p: "Pala", c: ["Sutong"] },
  { num: 54, page: 10, p: "Ryngngait Lyngdoh", c: ["Kharrymen", "Diengdoh Nongstoiñ", "Rymen"] },
  { num: 55, page: 10, p: "Sawkmie", c: ["Lyngdoh Lyngkhoi", "Lyngdoh Nonglait", "Thangmyrsiang"] },
  { num: 56, page: 10, p: "Shallam", c: ["Khyrïem", "Mukhim", "Shabong", "Khongshah"] },
  { num: 57, page: 10, p: "Shongwan", c: ["Wanphai"] },
  { num: 58, page: 10, p: "Shullai", c: ["Dhar", "Mallai", "Nonghulo"] },
  { num: 59, page: 10, p: "Slong", c: ["Blah", "Pariat", "Pde", "Shylla", "Thangkhiew", "Norlong"] },
  { num: 60, page: 10, p: "Sun", c: ["Khlem", "Lamare"] },
  { num: 61, page: 11, p: "Syiem Maring Nonglyngdoh", c: ["Maring"] },
  { num: 62, page: 11, p: "Syiem Mawthoh", c: ["Syiem Narleiñ"] },
  { num: 63, page: 11, p: "Syiem Myriaw", c: ["Shangoi"] },
  { num: 64, page: 11, p: "Syiem Nobosohphoh", c: ["Sohphoh"] },
  { num: 65, page: 11, p: "Syiem Nongbri", c: ["Syiem Nongtluh"] },
  { num: 66, page: 11, p: "Syiem Nongstoiñ", c: ["Nongstiñ", "Rynñiaw"] },
  { num: 67, page: 11, p: "Syiem Shyllong", c: ["Syiem Mawpdang", "Syiem Mylliem", "Syiem Nongkrem"] },
  { num: 68, page: 11, p: "Syiem Sohra", c: ["Swer", "Suwer"] },
  { num: 69, page: 11, p: "Syiem Sutnga", c: ["Kurkalang", "Muliar", "Mynso Shangpung", "Nongspung", "Nongsteng", "Pakem Pajuh", "Pyrtuh Shangpung", "Sutnga", "Syiemïong Nongspung", "Syiemlieh-Nongkhlaw", "Syiemlieh Nongspung", "Syiem Nongshai", "Syiemsat", "Syiem Umsaw Nongbri"] },
  { num: 70, page: 11, p: "Synteng", c: ["Sohsngi"] },
  { num: 71, page: 11, p: "Tangdhara", c: ["Tangsai"] },
  { num: 72, page: 11, p: "Thabah", c: ["Kyrsian", "Lyngdoh Sohïong", "Khongmawloh", "Khongni-ur"] },
  { num: 73, page: 11, p: "Thaïang", c: ["Nongtariang", "Tariang", "Teron"] },
  { num: 74, page: 11, p: "Thongni Nongdiang", c: ["Nongdiang"] },
  { num: 75, page: 11, p: "Thongnirit", c: ["Thongniïong"] },
  { num: 76, page: 11, p: "Tymthai", c: ["Lyngskor Tymmeniang"] },
  { num: 77, page: 11, p: "Wahlang Pahsyntiew", c: ["Alia", "Laitphlang", "Lyngdoh Lyngïong", "Malang", "Mawïong", "Mawshai", "Byrsat", "Mawsor", "Rangslang", "Ryntathiang", "Symbai", "Tyrsa", "Wahlang-Ryntathiang", "Wallang"] },
  { num: 78, page: 11, p: "Warbah", c: ["Lating", "Suting", "Warshong"] },
  { num: 79, page: 11, p: "Warlarpih", c: ["Langstieh", "Nongkhlawmulong", "Nongkhlawrngi", "Khongbri", "War Sadew", "Warkhnang"] },
  { num: 80, page: 11, p: "War Nongjri", c: ["Warjri", "War Nongbri"] },
  { num: 81, page: 11, p: "War Wahksing", c: ["War Shabong"] }
];

// Load existing 26 responses from docs/common-surnames
const dir = path.join(__dirname, "../docs/common-surnames");
const baseResponses = {};
fs.readdirSync(dir).filter(f => f.endsWith(".json")).forEach(f => {
  const c = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  baseResponses[c.query.toLowerCase()] = c;
});

// Build initial COMMON_SURNAMES_LIST with 26 names
const primarySet = new Set([
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
]);

// Add the primary clan of all 81 links to COMMON_SURNAMES_LIST
links81.forEach(l => primarySet.add(l.p));

// Sort alphabetically
const commonSurnamesList = Array.from(primarySet).sort((a, b) =>
  a.localeCompare(b, "en", { sensitivity: "base" })
);

// Map of all clusters generated for the 81 links
const linkClusters = links81.map(link => {
  const allClans = [link.p, ...(link.aka ? [link.aka] : []), ...link.c];
  const title = `${link.p}${link.aka ? " / " + link.aka : ""} (${link.c.join(", ")})`;
  return {
    num: link.num,
    clans: allClans,
    cluster: {
      id: `link-${link.num}-${slugify(link.p)}`,
      title,
      shikur_clans: allClans,
      teh_kur_clans: [],
      summary_khasi: `Ki kur ${allClans.join(", ")} ki ïalong shi-kur (kawei ka jait/kpoh) katkum ka kot 'Ki Khun Ki Ksiew U Hynñiew Trep' bad kim bit ban ïashongkha (Sang).`,
      summary_english: `The clans ${allClans.join(", ")} belong to the same ancestral clan lineage (shikur) according to 'Ki Khun Ki Ksiew U Hynñiew Trep', and intermarriage between them is strictly prohibited (Sang).`,
      citation: `Ki Khun Ki Ksiew U Hynñiew Trep (Spiton Kharakor, 1981), Link #${link.num} (Page ${link.page})`
    }
  };
});

// Map from normalized clan name to list of link clusters
const clanToLinkClusters = new Map();
linkClusters.forEach(item => {
  item.clans.forEach(clan => {
    const norm = normalizeKhasi(clan);
    if (!clanToLinkClusters.has(norm)) {
      clanToLinkClusters.set(norm, { originalName: clan, clusters: [] });
    }
    clanToLinkClusters.get(norm).clusters.push(item.cluster);
  });
});

// Combined dataset dictionary
const combinedData = {};

// 1. Populate base 26 responses
for (const [key, resp] of Object.entries(baseResponses)) {
  combinedData[key] = resp;
  const norm = normalizeKhasi(resp.query);
  if (norm !== key) {
    combinedData[norm] = resp;
  }
}

// 2. For each clan in 81 links:
let addedClansCount = 0;
let attachedToExistingCount = 0;

clanToLinkClusters.forEach((val, norm) => {
  const lower = val.originalName.toLowerCase();

  if (combinedData[lower] || combinedData[norm]) {
    // Already in existing 26 data
    attachedToExistingCount++;
  } else {
    // New clan to add
    const resp = {
      mode: "wad-kur",
      query: val.originalName,
      normalized_query: norm,
      found: true,
      match_count: val.clusters.length,
      clusters: val.clusters,
      disclaimer: "Final authority on Ka Sang rests with your Longkñii and registered Seng Kur."
    };
    combinedData[lower] = resp;
    if (lower !== norm) {
      combinedData[norm] = resp;
    }
    addedClansCount++;
  }
});

console.log(`COMMON_SURNAMES_LIST total: ${commonSurnamesList.length}`);
console.log(`New clans appended from 81 links: ${addedClansCount}`);
console.log(`Existing clans referenced in 81 links: ${attachedToExistingCount}`);
console.log(`Total keys in combinedData: ${Object.keys(combinedData).length}`);

// Generate TypeScript source code
let ts = `import { TipkurResponse } from "../types";\n\n`;
ts += `// Primary common Khasi surnames cataloged (${commonSurnamesList.length} clans)\n`;
ts += `export const COMMON_SURNAMES_LIST: string[] = ${JSON.stringify(commonSurnamesList, null, 2)};\n\n`;
ts += `// Pre-loaded wad-kur responses for common surnames and historical links (${Object.keys(combinedData).length} index entries)\n`;
ts += `export const COMMON_SURNAMES_DATA: Record<string, TipkurResponse> = {\n`;

const keys = Object.keys(combinedData).sort();
keys.forEach((key, idx) => {
  const valStr = JSON.stringify(combinedData[key], null, 2).replace(/\n/g, "\n  ");
  ts += `  ${JSON.stringify(key)}: ${valStr}${idx < keys.length - 1 ? "," : ""}\n`;
});

ts += `};\n\n`;
ts += `/**\n * Normalizes Khasi characters for diacritic-safe comparison\n */\n`;
ts += `function normalizeKhasi(str: string): string {\n`;
ts += `  return str\n`;
ts += `    .toLowerCase()\n`;
ts += `    .replace(/[ïï]/g, "i")\n`;
ts += `    .replace(/[ññ]/g, "n")\n`;
ts += `    .normalize("NFD")\n`;
ts += `    .replace(/[\\u0300-\\u036f]/g, "");\n`;
ts += `}\n\n`;
ts += `/**\n * Looks up a pre-cached wad-kur response from the common surnames dataset.\n * Returns the verified TipkurResponse if found, otherwise undefined.\n */\n`;
ts += `export function getCommonSurnameResponse(jait: string): TipkurResponse | undefined {\n`;
ts += `  if (!jait || typeof jait !== "string") return undefined;\n`;
ts += `  const clean = jait.trim();\n`;
ts += `  const lower = clean.toLowerCase();\n\n`;
ts += `  // 1. Direct match by lowercase key\n`;
ts += `  if (COMMON_SURNAMES_DATA[lower]) {\n`;
ts += `    return COMMON_SURNAMES_DATA[lower];\n`;
ts += `  }\n\n`;
ts += `  // 2. Diacritic-normalized match\n`;
ts += `  const norm = normalizeKhasi(clean);\n`;
ts += `  if (COMMON_SURNAMES_DATA[norm]) {\n`;
ts += `    return COMMON_SURNAMES_DATA[norm];\n`;
ts += `  }\n\n`;
ts += `  // 3. Fallback scan matching normalized keys\n`;
ts += `  for (const [key, data] of Object.entries(COMMON_SURNAMES_DATA)) {\n`;
ts += `    if (normalizeKhasi(key) === norm) {\n`;
ts += `      return data;\n`;
ts += `    }\n`;
ts += `  }\n\n`;
ts += `  return undefined;\n`;
ts += `}\n`;

fs.writeFileSync(path.join(__dirname, "../src/data/commonSurnames.ts"), ts, "utf8");
console.log("Successfully wrote src/data/commonSurnames.ts");

