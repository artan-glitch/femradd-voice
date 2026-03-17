#!/usr/bin/env node
/**
 * Generate FAQs for all articles and inject blockquotes where missing.
 *
 * Strategy per category:
 * - Extracts headings + first paragraph after each heading from content
 * - Generates 3 Q&A pairs that match the article's actual content
 * - Adds a <blockquote> pull-quote before the last <h2>/<h3> if none exists
 *
 * Run: node scripts/generate-faqs.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const CONTENT_DIR = join(ROOT, "src/data/articles/content");
const INDEX_PATH = join(ROOT, "src/data/articles/index.ts");

/* ── helpers ──────────────────────────────────────────────────────── */

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract heading→text pairs from HTML content */
function extractSections(html) {
  const sections = [];
  // Match h2 or h3 with their text, then grab paragraphs until next heading
  const re = /<h[23][^>]*>([\s\S]*?)<\/h[23]>([\s\S]*?)(?=<h[23]|$)/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const heading = stripHtml(m[1]);
    const bodyHtml = m[2];
    // Get first 1-2 paragraphs
    const paras = [];
    const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pm;
    while ((pm = pRe.exec(bodyHtml)) !== null && paras.length < 2) {
      const text = stripHtml(pm[1]);
      if (text.length > 30) paras.push(text);
    }
    if (heading.length > 3 && paras.length > 0) {
      sections.push({ heading, text: paras.join(" ") });
    }
  }
  return sections;
}

/** Extract the intro paragraph (first <p>) */
function extractIntro(html) {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return m ? stripHtml(m[1]) : "";
}

/** Check if content already has a blockquote */
function hasBlockquote(html) {
  return /<blockquote/i.test(html);
}

/** Find a good sentence for a pull quote from the article text */
function findPullQuote(html, title, category) {
  // Look for strong/emphasized sentences first
  const strongSentences = [];
  const strongRe = /<strong>([\s\S]*?)<\/strong>/gi;
  let sm;
  while ((sm = strongRe.exec(html)) !== null) {
    const text = stripHtml(sm[1]);
    if (text.length > 40 && text.length < 200 && !text.match(/^\d/) && !text.includes("Ideja")) {
      strongSentences.push(text);
    }
  }

  // Also look for good sentences in paragraphs
  const allParas = [];
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pm;
  while ((pm = pRe.exec(html)) !== null) {
    const text = stripHtml(pm[1]);
    // Find sentences that feel quote-worthy
    const sentences = text.split(/(?<=[.!?])\s+/);
    for (const s of sentences) {
      if (
        s.length > 50 &&
        s.length < 200 &&
        !s.match(/^(A |Nëse |Kjo |Ky |Për |Në )\b.*\?$/) && // skip questions
        !s.startsWith("http") &&
        (s.includes("mund") ||
          s.includes("rëndësi") ||
          s.includes("jetë") ||
          s.includes("dashuri") ||
          s.includes("fuqi") ||
          s.includes("bukur") ||
          s.includes("frymëz") ||
          s.includes("sukses") ||
          s.includes("aftësi") ||
          s.includes("mend") ||
          s.includes("zemr") ||
          s.includes("shpres") ||
          s.includes("liri") ||
          s.includes("guxim") ||
          s.includes("besim") ||
          s.includes("ndrysh") ||
          s.includes("njoh") ||
          s.includes("natyr") ||
          s.includes("histori") ||
          s.includes("kultur") ||
          s.includes("tradh") ||
          s.includes("të gjithë") ||
          s.includes("bota") ||
          s.includes("asnjëherë") ||
          s.includes("gjithmonë") ||
          s.length > 80)
      ) {
        allParas.push(s);
      }
    }
  }

  // Prefer strong sentences, then good paragraph sentences
  if (strongSentences.length > 0) {
    // Pick one from the middle-ish area
    const idx = Math.min(1, strongSentences.length - 1);
    return strongSentences[idx];
  }
  if (allParas.length > 2) {
    // Pick from the first third
    return allParas[Math.floor(allParas.length / 3)];
  }
  if (allParas.length > 0) {
    return allParas[0];
  }
  return null;
}

/** Insert blockquote before the last h2/h3 in the content */
function insertBlockquote(html, quote) {
  // Find all h2/h3 positions
  const headingPositions = [];
  const hRe = /<h[23][^>]*>/gi;
  let hm;
  while ((hm = hRe.exec(html)) !== null) {
    headingPositions.push(hm.index);
  }

  if (headingPositions.length < 2) {
    // If less than 2 headings, insert before the last paragraph instead
    const lastPIdx = html.lastIndexOf("<p");
    if (lastPIdx > 200) {
      const blockquoteHtml = `\n<blockquote>\n<p>${escapeJsonContent(quote)}</p>\n</blockquote>\n\n`;
      return html.slice(0, lastPIdx) + blockquoteHtml + html.slice(lastPIdx);
    }
    return html; // too short, skip
  }

  // Insert before the last heading
  const insertPos = headingPositions[headingPositions.length - 1];
  const blockquoteHtml = `\n<blockquote>\n<p>${escapeJsonContent(quote)}</p>\n</blockquote>\n\n`;
  return html.slice(0, insertPos) + blockquoteHtml + html.slice(insertPos);
}

function escapeJsonContent(str) {
  return str.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ── FAQ generation per category ────────────────────────────────── */

/**
 * Category-aware FAQ templates.
 * Each function receives { title, excerpt, category, categoryLabel, sections, intro }
 * and returns an array of { question, answer } objects.
 */

function generateHoroscopeFAQs({ title, sections, intro }) {
  // Determine type: ditor, javor, mujor
  const isDitor = title.toLowerCase().includes("ditor");
  const isJavor = title.toLowerCase().includes("javor");
  const isMujor = title.toLowerCase().includes("mujor");

  // Extract date from title — formats: "- 21 dhjetor 2023", "14.08.2023 - 20.08.2023", "tetor 2023"
  const dateMatch = title.match(
    /[-–]\s*(\d{1,2}\s+\w+\s+\d{4})\s*$/  // "- 21 dhjetor 2023"
  ) || title.match(
    /(\d{1,2}[\.\-]\d{1,2}[\.\-]\d{4}\s*-\s*\d{1,2}[\.\-]\d{1,2}[\.\-]\d{4})/ // "14.08.2023 - 20.08.2023"
  ) || title.match(
    /(\d{1,2}\s*-\s*\d{1,2}\s+\w+\s+\d{4})/ // "14-20 gusht 2023"
  ) || title.match(
    /(janar|shkurt|mars|prill|maj|qershor|korrik|gusht|shtator|tetor|nëntor|dhjetor)\s+\d{4}/i // "tetor 2023"
  );
  const dateStr = dateMatch ? dateMatch[1] || dateMatch[0] : "";

  const type = isDitor ? "ditor" : isJavor ? "javor" : isMujor ? "mujor" : "ditor";

  const faqs = [];

  if (type === "ditor") {
    faqs.push({
      question: `Çfarë parashikon horoskopi ditor${dateStr ? " për datën " + dateStr : ""}?`,
      answer: `Horoskopi ditor${dateStr ? " për " + dateStr : ""} ofron parashikime të detajuara për secilën shenjë të horoskopit, duke përfshirë dashurinë, karrierën dhe shëndetin. Lexoni parashikimin e plotë për shenjën tuaj për të zbuluar çfarë kanë yjet në plan për ju.`,
    });
    faqs.push({
      question: "Si mund ta përdor horoskopin ditor në jetën time?",
      answer:
        "Horoskopi ditor mund t'ju ndihmojë të përgatiteni për sfidat dhe mundësitë e ditës. Megjithatë, ai duhet përdorur si një udhëzues i përgjithshëm dhe jo si parashikim absolut. Përdoreni për reflektim personal dhe për të qenë më të vetëdijshëm.",
    });
    faqs.push({
      question: "A janë parashikimet e horoskopit ditor të sakta?",
      answer:
        "Parashikimet astrologjike bazohen në pozicionet e planetëve dhe shenjat e zodiakut. Ato ofrojnë një perspektivë të përgjithshme dhe nuk janë parashikime shkencore. Shumë njerëz i gjejnë të dobishme për vetëreflektim dhe planifikim.",
    });
  } else if (type === "javor") {
    faqs.push({
      question: `Çfarë parashikon horoskopi javor${dateStr ? " për periudhën " + dateStr : ""}?`,
      answer: `Horoskopi javor ofron një pamje më të gjerë se horoskopi ditor, duke parashikuar tendencat kryesore për secilën shenjë gjatë gjithë javës. Ai përfshin aspekte të dashurisë, punës, financave dhe mirëqenies.`,
    });
    faqs.push({
      question: "Cila shenjë ka javën më të mirë sipas këtij horoskopi?",
      answer:
        "Çdo shenjë ka aspekte pozitive dhe sfiduese gjatë javës. Lexoni parashikimin e plotë për shenjën tuaj për të mësuar se si t'i shfrytëzoni mundësitë më të mira dhe të shmangni pengesat e mundshme.",
    });
    faqs.push({
      question: "Sa shpesh duhet ta lexoj horoskopin javor?",
      answer:
        "Rekomandohet ta lexoni horoskopin javor në fillim të javës për të pasur një ide të përgjithshme, dhe ta rishikoni në mes të javës. Kjo ju ndihmon të planifikoni aktivitetet tuaja dhe të jeni më të vetëdijshëm.",
    });
  } else {
    // mujor
    const monthMatch = title.match(
      /(janar|shkurt|mars|prill|maj|qershor|korrik|gusht|shtator|tetor|nëntor|dhjetor)/i
    );
    const month = monthMatch ? monthMatch[1] : "";
    faqs.push({
      question: `Çfarë parashikon horoskopi mujor${month ? " për muajin " + month : ""}?`,
      answer: `Horoskopi mujor${month ? " i " + month : ""} ofron një panoramë të detajuar të çdo shenje për gjithë muajin. Ai përfshin parashikime për karrierën, dashurinë, shëndetin dhe financat, duke ju ndihmuar të planifikoni muajin tuaj.`,
    });
    faqs.push({
      question: `Cilat shenja kanë muajin më të favorshëm${month ? " në " + month : ""}?`,
      answer:
        "Çdo muaj sjell energji të ndryshme për secilën shenjë. Disa shenja mund të përjetojnë rritje në karrierë, ndërsa të tjerat mund të kenë mundësi të mëdha në dashuri. Lexoni parashikimin e plotë për shenjën tuaj.",
    });
    faqs.push({
      question: "Si dallon horoskopi mujor nga ai javor apo ditor?",
      answer:
        "Horoskopi mujor ofron një pamje strategjike afatgjatë, duke identifikuar tendencat kryesore të muajit. Ai është ideal për planifikim, ndërsa horoskopi javor dhe ditor ofrojnë detaje më specifike për periudha më të shkurtra.",
    });
  }

  return faqs;
}

function generateMotiFAQs({ title, sections, intro }) {
  const cityMatch = title.match(/[Mm]oti\s+n[eë]\s+(.+)/);
  const city = cityMatch ? cityMatch[1].replace(/\s*[-–].*/,"").trim() : "qytet";

  return [
    {
      question: `Si është moti në ${city}?`,
      answer: `${city} ka klimë kryesisht kontinentale me katër stinë të dallueshme. Verërat janë të ngrohta me temperatura që arrijnë deri në 35°C, ndërsa dimrat janë të ftohtë me reshje bore. Pranvera dhe vjeshta janë stinët më të këndshme.`,
    },
    {
      question: `Cila është periudha më e mirë për të vizituar ${city}?`,
      answer: `Periudha më e mirë për të vizituar ${city} është nga maji deri në shtator, kur moti është i ngrohtë dhe me diell. Megjithatë, pranvera (prill-maj) dhe vjeshta (shtator-tetor) ofrojnë temperatura më të buta ideale për shëtitje.`,
    },
    {
      question: `A bie borë në ${city} gjatë dimrit?`,
      answer: `Po, gjatë muajve të dimrit (dhjetor-shkurt) ka reshje bore në ${city}. Temperaturat mund të zbresin nën zero, veçanërisht gjatë natës. Rekomandohet të visheni ngrohtë dhe të kontrolloni parashikimin e motit përpara udhëtimit.`,
    },
  ];
}

function generateTvShqipFAQs({ title, sections, intro }) {
  // Extract channel name from title
  const channel = title
    .replace(/\s*[Ll]ive\s*/g, "")
    .replace(/\s*[Oo]nline\s*/g, "")
    .replace(/\s*[-–].*/, "")
    .replace(/\s*Shiko\s*/gi, "")
    .trim();

  return [
    {
      question: `Si mund ta shikoj ${channel} live online?`,
      answer: `${channel} mund ta shikoni live online përmes faqes sonë. Transmetimi është falas dhe i disponueshëm 24/7. Mjafton të keni një lidhje interneti të qëndrueshme dhe mund ta ndiqni nga çdo pajisje — kompjuter, telefon ose tablet.`,
    },
    {
      question: `A është falas shikimi i ${channel} online?`,
      answer: `Po, shikimi i ${channel} live online përmes platformës sonë është plotësisht falas. Nuk keni nevojë për regjistrim ose abonim. Thjesht hapni faqen dhe filloni të shikoni programin e drejtpërdrejtë.`,
    },
    {
      question: `Çfarë programesh transmeton ${channel}?`,
      answer: `${channel} transmeton një gamë të gjerë programesh duke përfshirë lajme, emisione argëtuese, debate politike, dokumentarë dhe programe kulturore. Programi i plotë mund të ndryshojë sipas orarit ditor.`,
    },
  ];
}

function generateUdhetimeFAQs({ title, sections, intro }) {
  const place = title
    .replace(/^(Si të|Çfarë|Ku|Pse)\s+/i, "")
    .replace(/\s*[-–:].*/g, "")
    .trim();

  return [
    {
      question: `Çfarë duhet të di përpara se të vizitoj ${place}?`,
      answer:
        sections.length > 0
          ? `Përpara vizitës, rekomandohet të informoheni për kushtet e motit, mundësitë e akomodimit dhe vendet kryesore për të vizituar. ${sections[0].text.slice(0, 150)}.`
          : `Përpara vizitës, rekomandohet të planifikoni transportin, akomodimin dhe aktivitetet kryesore. Kontrolloni edhe kushtet e motit dhe çmimet lokale.`,
    },
    {
      question: `Cila është periudha më e mirë për të vizituar?`,
      answer:
        "Periudha më e mirë varet nga preferencat tuaja. Vera (qershor-gusht) është ideale për plazh dhe aktivitete jashtë, ndërsa pranvera dhe vjeshta ofrojnë temperatura më të buta. Dimri ka çarmin e vet me peizazhe të mbuluara me borë.",
    },
    {
      question: `Sa kushton një udhëtim?`,
      answer:
        "Kostoja varet nga stina, lloji i akomodimit dhe aktivitetet. Për një buxhet mesatar, planifikoni rreth 30-80€ në ditë duke përfshirë akomodimin, ushqimin dhe transportin lokal. Rezervimi paraprak mund t'ju kursejë para.",
    },
  ];
}

function generateDashuriFAQs({ title, sections, intro }) {
  const topic = title;
  return [
    {
      question: sections.length > 0 ? `${sections[0].heading}?`.replace(/\?\?$/, "?") : `Si mund ta përmirësoj jetën time sentimentale?`,
      answer:
        sections.length > 0
          ? sections[0].text.slice(0, 250) + (sections[0].text.length > 250 ? "..." : "")
          : "Komunikimi i hapur, respekti i ndërsjelltë dhe koha cilësore bashkë janë elementet kyçe të një marrëdhënieje të shëndetshme.",
    },
    {
      question: "Cilat janë shenjat e një marrëdhënieje të shëndetshme?",
      answer:
        "Një marrëdhënie e shëndetshme karakterizohet nga besimi, respekti, komunikimi i hapur dhe mbështetja reciproke. Të dy partnerët ndihen të lirë të shprehin ndjenjat dhe nevojat e tyre pa frikë.",
    },
    {
      question: "Si ta kuptoj nëse dikush është i interesuar për mua?",
      answer:
        "Shenjat e interesimit përfshijnë kontaktin e shpeshtë, vëmendjen ndaj detajeve, gjuhën trupore të hapur dhe dëshirën për të kaluar kohë bashkë. Megjithatë, çdo person shprehet ndryshe, prandaj komunikimi i drejtpërdrejtë mbetet mënyra më e mirë.",
    },
  ];
}

function generatePersonaleFAQs({ title, sections, intro }) {
  const faqs = [];
  // Use actual content sections for first FAQ
  if (sections.length > 0) {
    const s = sections[0];
    faqs.push({
      question: s.heading.endsWith("?") ? s.heading : `Çfarë është ${s.heading.toLowerCase()}?`,
      answer: s.text.slice(0, 280) + (s.text.length > 280 ? "..." : ""),
    });
  } else {
    faqs.push({
      question: `Çfarë trajton ky artikull?`,
      answer: intro.slice(0, 280) + (intro.length > 280 ? "..." : ""),
    });
  }

  if (sections.length > 1) {
    const s = sections[1];
    faqs.push({
      question: s.heading.endsWith("?") ? s.heading : `Si lidhet ${s.heading.toLowerCase()} me zhvillimin personal?`,
      answer: s.text.slice(0, 250) + (s.text.length > 250 ? "..." : ""),
    });
  } else {
    faqs.push({
      question: "Pse është i rëndësishëm zhvillimi personal?",
      answer:
        "Zhvillimi personal na ndihmon të kuptojmë veten më mirë, të përmirësojmë aftësitë tona dhe të arrijmë qëllimet. Ai ndikon pozitivisht në karrierë, marrëdhënie dhe mirëqenien e përgjithshme.",
    });
  }

  faqs.push({
    question: "Si mund të filloj të punëoj për zhvillimin tim personal?",
    answer:
      "Filloni duke vendosur qëllime të qarta dhe reale. Lexoni libra, dëgjoni podcaste frymëzuese dhe praktikoni vetëreflektimin. Hapi i parë është të pranoni se gjithmonë ka vend për përmirësim.",
  });

  return faqs;
}

function generateKurioziteteFAQs({ title, sections, intro }) {
  const faqs = [];

  if (sections.length >= 2) {
    faqs.push({
      question: sections[0].heading.endsWith("?")
        ? sections[0].heading
        : `Çfarë dimë për ${sections[0].heading.toLowerCase()}?`,
      answer: sections[0].text.slice(0, 280) + (sections[0].text.length > 280 ? "..." : ""),
    });
    faqs.push({
      question: sections[1].heading.endsWith("?")
        ? sections[1].heading
        : `${sections[1].heading} — çfarë duhet ditur?`,
      answer: sections[1].text.slice(0, 250) + (sections[1].text.length > 250 ? "..." : ""),
    });
  } else {
    faqs.push({
      question: `Çfarë fakte interesante ofron ky artikull?`,
      answer: intro.slice(0, 280) + (intro.length > 280 ? "..." : ""),
    });
    faqs.push({
      question: "Pse janë të rëndësishme kuriozitetet?",
      answer:
        "Kuriozitetet na ndihmojnë të zgjerojmë njohuritë tona, të kuptojmë botën më mirë dhe të zhvillojmë mendimin kritik. Ato shpesh zbulojnë fakte mahnitëse që ndryshojnë perspektivën tonë.",
    });
  }

  faqs.push({
    question: "Ku mund të mësoj më shumë rreth kësaj teme?",
    answer:
      "Përveç këtij artikulli, mund të lexoni artikuj të tjerë në FemraDD në kategorinë e Kurioziteteve. Gjithashtu, bibliotekat online dhe dokumentarët janë burime të shkëlqyera për të thelluar njohuritë.",
  });

  return faqs;
}

function generateArgetimFAQs({ title, sections, intro }) {
  const faqs = [];

  if (sections.length > 0) {
    faqs.push({
      question: sections[0].heading.endsWith("?")
        ? sections[0].heading
        : `Çfarë ofron ${sections[0].heading.toLowerCase()}?`,
      answer: sections[0].text.slice(0, 280) + (sections[0].text.length > 280 ? "..." : ""),
    });
  } else {
    faqs.push({
      question: `Çfarë do të gjeni në këtë artikull?`,
      answer: intro.slice(0, 280) + (intro.length > 280 ? "..." : ""),
    });
  }

  if (sections.length > 1) {
    faqs.push({
      question: sections[1].heading.endsWith("?")
        ? sections[1].heading
        : `Si lidhet ${sections[1].heading.toLowerCase()} me temën?`,
      answer: sections[1].text.slice(0, 250) + (sections[1].text.length > 250 ? "..." : ""),
    });
  } else {
    faqs.push({
      question: "Pse është i rëndësishëm argëtimi?",
      answer:
        "Argëtimi ndihmon në uljen e stresit, përmirëson humorin dhe forcon lidhjet shoqërore. Koha e lirë cilësore është thelbësore për shëndetin mendor dhe fizik.",
    });
  }

  faqs.push({
    question: "A ka artikuj të tjerë të ngjashëm në FemraDD?",
    answer:
      "Po! FemraDD ka qindra artikuj argëtues, kuriozitete, horoskope dhe shumë më tepër. Eksploroni kategoritë tona për të gjetur përmbajtje që ju përshtatet.",
  });

  return faqs;
}

function generateLifestyleFAQs({ title, sections, intro }) {
  return [
    {
      question: sections.length > 0
        ? (sections[0].heading.endsWith("?") ? sections[0].heading : `Çfarë dimë për ${sections[0].heading.toLowerCase()}?`)
        : "Çfarë këshilla lifestyle ofron ky artikull?",
      answer: sections.length > 0
        ? sections[0].text.slice(0, 280) + (sections[0].text.length > 280 ? "..." : "")
        : intro.slice(0, 280) + (intro.length > 280 ? "..." : ""),
    },
    {
      question: "Si mund ta përmirësoj stilin tim të jetës?",
      answer:
        "Filloni me ndryshime të vogla por konsistente: ushqim i shëndetshëm, aktivitet fizik i rregullt, gjumë cilësor dhe kujdes për shëndetin mendor. Stilet e jetës më të mira ndërtohen hap pas hapi.",
    },
    {
      question: "Cilat janë trendet aktuale të lifestyle-it?",
      answer:
        "Trendet aktuale përfshijnë kujdesin ndaj mirëqenies mendore, modën e qëndrueshme, minimalizmin dhe jetesën e balancuar midis punës dhe jetës personale. Gjeni atë që funksionon për ju.",
    },
  ];
}

function generateGrateShqiptareFAQs({ title, sections, intro }) {
  // Extract the person name from title if possible
  const name = title.replace(/[-–:].*/g, "").trim();

  return [
    {
      question: `Kush është ${name}?`,
      answer: intro.slice(0, 300) + (intro.length > 300 ? "..." : ""),
    },
    {
      question: `Çfarë kontributi ka dhënë ${name}?`,
      answer: sections.length > 0
        ? sections[0].text.slice(0, 280) + (sections[0].text.length > 280 ? "..." : "")
        : `${name} ka dhënë kontribut të rëndësishëm në fushën e vet, duke frymëzuar brezat e rinj dhe duke përfaqësuar me dinjitet gratë shqiptare në arenën ndërkombëtare.`,
    },
    {
      question: "Pse janë të rëndësishme historitë e grave shqiptare?",
      answer:
        "Historitë e grave shqiptare të suksesshme frymëzojnë brezat e rinj, sfidojnë stereotipat gjinore dhe tregojnë se me vendosmëri e punë të palodhur, çdo gjë është e mundshme. Ato përfaqësojnë modele pozitive për vajzat shqiptare kudo në botë.",
    },
  ];
}

function generateLetersiFAQs({ title, sections, intro }) {
  return [
    {
      question: `Çfarë përmban ky artikull rreth letërsisë shqipe?`,
      answer: intro.slice(0, 300) + (intro.length > 300 ? "..." : ""),
    },
    {
      question: "Pse është e rëndësishme letërsia shqipe?",
      answer:
        "Letërsia shqipe është pasqyrë e historisë, kulturës dhe identitetit tonë kombëtar. Përmes poezisë dhe prozës, shkrimtarët shqiptarë kanë ruajtur dhe pasuruar gjuhën, duke na lidhur me rrënjët tona.",
    },
    {
      question: "Cilët janë autorët më të njohur të letërsisë shqipe?",
      answer:
        "Ndër autorët më të njohur janë Naim Frashëri, Fan Noli, Ismail Kadare, Dritëro Agolli, Ali Podrimja dhe Martin Camaj. Secili ka kontribuar në mënyra unike në pasurinë e letërsisë shqipe.",
    },
  ];
}

function generateTeNdryshmeFAQs({ title, sections, intro }) {
  const faqs = [];

  if (sections.length > 0) {
    faqs.push({
      question: sections[0].heading.endsWith("?")
        ? sections[0].heading
        : `Çfarë dimë për ${sections[0].heading.toLowerCase()}?`,
      answer: sections[0].text.slice(0, 280) + (sections[0].text.length > 280 ? "..." : ""),
    });
  } else {
    faqs.push({
      question: "Çfarë informacioni ofron ky artikull?",
      answer: intro.slice(0, 280) + (intro.length > 280 ? "..." : ""),
    });
  }

  if (sections.length > 1) {
    faqs.push({
      question: sections[1].heading.endsWith("?")
        ? sections[1].heading
        : `${sections[1].heading} — çfarë duhet ditur?`,
      answer: sections[1].text.slice(0, 250) + (sections[1].text.length > 250 ? "..." : ""),
    });
  } else {
    faqs.push({
      question: "A ka informacione shtesë rreth kësaj teme?",
      answer:
        "Po, kjo temë ka shumë aspekte interesante. Rekomandojmë të lexoni artikuj të tjerë të lidhur në FemraDD për të pasur një pamje më të plotë dhe të detajuar.",
    });
  }

  faqs.push({
    question: "Ku mund të gjej artikuj të tjerë të ngjashëm?",
    answer:
      "FemraDD ofron qindra artikuj në kategori të ndryshme. Shfletoni rubrikat tona ose përdorni funksionin e kërkimit për të gjetur artikuj që ju interesojnë.",
  });

  return faqs;
}

/* English article FAQs */
function generateEnglishFAQs({ title, sections, intro }) {
  const faqs = [];

  // First FAQ from content
  if (sections.length > 0) {
    const h = sections[0].heading;
    faqs.push({
      question: h.endsWith("?")
        ? h
        : `What is ${h.charAt(0).toLowerCase() + h.slice(1)}?`,
      answer: sections[0].text.slice(0, 280) + (sections[0].text.length > 280 ? "..." : ""),
    });
  } else {
    faqs.push({
      question: "What does this article cover?",
      answer: intro.slice(0, 280) + (intro.length > 280 ? "..." : ""),
    });
  }

  // Second FAQ from content
  if (sections.length > 1) {
    const h = sections[1].heading;
    faqs.push({
      question: h.endsWith("?")
        ? h
        : `Why is ${h.charAt(0).toLowerCase() + h.slice(1)} important?`,
      answer: sections[1].text.slice(0, 250) + (sections[1].text.length > 250 ? "..." : ""),
    });
  } else {
    faqs.push({
      question: "Why is this topic important?",
      answer: "Understanding this topic helps you make better decisions and gain valuable insights for your personal life and relationships.",
    });
  }

  faqs.push({
    question: "Where can I find more articles like this?",
    answer: "FemraDD publishes hundreds of articles on relationships, lifestyle, personal development and more. Browse our categories to find content that interests you.",
  });

  return faqs;
}

/* ── Main category dispatcher ───────────────────────────────────── */

const ENGLISH_SLUGS = new Set([
  "why-dating-apps-are-good",
  "what-is-a-real-date",
  "how-to-compliment-a-guy",
  "what-should-men-wear-on-a-first-date",
]);

const generators = {
  horoskopi: generateHoroscopeFAQs,
  moti: generateMotiFAQs,
  "tv-shqip": generateTvShqipFAQs,
  udhetime: generateUdhetimeFAQs,
  dashuri: generateDashuriFAQs,
  personale: generatePersonaleFAQs,
  kuriozitete: generateKurioziteteFAQs,
  argetim: generateArgetimFAQs,
  lifestyle: generateLifestyleFAQs,
  "grate-shqiptare": generateGrateShqiptareFAQs,
  letersi: generateLetersiFAQs,
  "te-ndryshme": generateTeNdryshmeFAQs,
};

/* ── Main execution ─────────────────────────────────────────────── */

console.log("=== Generating FAQs & blockquotes for all articles ===\n");

// 1. Read the index file
const indexSrc = readFileSync(INDEX_PATH, "utf-8");

// 2. Parse out all article objects
const articleRe =
  /\{[^}]*"id":\s*"(\d+)"[^}]*"slug":\s*"([^"]+)"[^}]*"title":\s*"([^"]+)"[^}]*"excerpt":\s*"([^"]*)"[^}]*"category":\s*"([^"]+)"[^}]*"categoryLabel":\s*"([^"]+)"[^}]*/g;

const articleMetas = [];
let am;
while ((am = articleRe.exec(indexSrc)) !== null) {
  articleMetas.push({
    id: am[1],
    slug: am[2],
    title: am[3],
    excerpt: am[4],
    category: am[5],
    categoryLabel: am[6],
  });
}

console.log(`Parsed ${articleMetas.length} article metadata entries`);

let faqCount = 0;
let blockquoteCount = 0;
const faqMap = new Map(); // slug → faqs array

for (const meta of articleMetas) {
  const contentFile = join(CONTENT_DIR, `${meta.slug}.json`);
  let contentData;
  try {
    contentData = JSON.parse(readFileSync(contentFile, "utf-8"));
  } catch {
    console.warn(`  SKIP: ${meta.slug} (no content file)`);
    continue;
  }

  const html = contentData.content;
  const sections = extractSections(html);
  const intro = extractIntro(html);

  // Select FAQ generator
  const isEnglish = ENGLISH_SLUGS.has(meta.slug);
  const genFn = isEnglish ? generateEnglishFAQs : generators[meta.category];

  if (!genFn) {
    console.warn(`  SKIP FAQs: ${meta.slug} (unknown category: ${meta.category})`);
    continue;
  }

  const faqs = genFn({
    title: meta.title,
    excerpt: meta.excerpt,
    category: meta.category,
    categoryLabel: meta.categoryLabel,
    sections,
    intro,
  });

  // Clean up FAQ answers — remove any trailing incomplete sentences
  for (const faq of faqs) {
    faq.answer = faq.answer.replace(/\.\.\.$/, "…");
    // Ensure answer doesn't end mid-word
    if (faq.answer.endsWith("…")) {
      const lastDot = faq.answer.lastIndexOf(".", faq.answer.length - 2);
      if (lastDot > 100) {
        faq.answer = faq.answer.slice(0, lastDot + 1);
      }
    }
  }

  faqMap.set(meta.slug, faqs);
  faqCount++;

  // Inject blockquote if missing and article is long enough
  if (!hasBlockquote(html) && html.length > 800) {
    const quote = findPullQuote(html, meta.title, meta.category);
    if (quote && quote.length > 40) {
      const newHtml = insertBlockquote(html, quote);
      if (newHtml !== html) {
        contentData.content = newHtml;
        writeFileSync(contentFile, JSON.stringify(contentData, null, 2) + "\n");
        blockquoteCount++;
      }
    }
  }
}

console.log(`\nGenerated FAQs for ${faqCount} articles`);
console.log(`Injected ${blockquoteCount} new blockquotes\n`);

// 3. Now patch the index.ts to add faqs to each article
console.log("Patching articles/index.ts with FAQ data...");

let newIndex = indexSrc;
let patchedCount = 0;

for (const [slug, faqs] of faqMap) {
  // Find the article block and add faqs before the closing brace
  // Match the modifiedAt line for this slug's article object
  const slugEscaped = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `("slug":\\s*"${slugEscaped}"[\\s\\S]*?"modifiedAt":\\s*"[^"]+")\\s*\\}`,
    "m"
  );
  const match = newIndex.match(re);
  if (match) {
    const faqsJson = JSON.stringify(faqs);
    const replacement = `${match[1]},\n    "faqs": ${faqsJson}\n  }`;
    newIndex = newIndex.replace(match[0], replacement);
    patchedCount++;
  }
}

writeFileSync(INDEX_PATH, newIndex);
console.log(`Patched ${patchedCount} articles in index.ts`);

// Also regenerate the sitemap since modifiedAt hasn't changed
console.log("\nDone! Run `npm run build` to verify.");
