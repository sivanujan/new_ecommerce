const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PRODUCTS = [
  {
    handle: "eelam-leaf-dog-tag-pendant",
    title: "Eelam Leaf Dog-Tag Pendant",
    category: "Pendants",
    subtitle: "SIGNATURE RESILIENCE DOG-TAG",
  },
  {
    handle: "lion-emblem-pendant",
    title: "Lion Emblem Pendant",
    category: "Pendants",
    subtitle: "ROYAL SOVEREIGN CREST",
  },
  {
    handle: "karthigai-flower-pendant",
    title: "Karthigai Flower Pendant",
    category: "Pendants",
    subtitle: "SACRED MEMORIAL BOTANICAL",
  },
  {
    handle: "classic-cuban-link-chain",
    title: "Classic Cuban Link Chain",
    category: "Chains",
    subtitle: "6MM PRECISION INTERLOCKING LINKS",
  },
  {
    handle: "box-chain-3mm",
    title: "Box Chain 3mm",
    category: "Chains",
    subtitle: "3MM SLEEK GEOMETRIC WEAVE",
  },
  {
    handle: "rope-chain",
    title: "Rope Chain",
    category: "Chains",
    subtitle: "DIAMOND-CUT TWISTED ROPE",
  },
  {
    handle: "tamil-eelam-map-tiger-pendant",
    title: "Tamil Eelam Map Tiger Pendant",
    category: "Special Editions",
    subtitle: "HOMELAND TOPOGRAPHY & TIGER",
  },
  {
    handle: "lion-crest-limited-edition",
    title: "Lion Crest Limited Edition",
    category: "Special Editions",
    subtitle: "NUMBERED ATELIER HEIRLOOM",
  },
  {
    handle: "heritage-spear-pendant",
    title: "Heritage Spear Pendant",
    category: "Special Editions",
    subtitle: "SACRED VEL OF WISDOM & VALOR",
  },
];

const COLOR_CONFIGS = {
  silver: {
    colorName: "Silver",
    label: "SILVER EDITION",
    sublabel: "MIRROR-POLISHED SURGICAL STEEL",
    bgFrom: "#0B0D12",
    bgTo: "#161B24",
    auraColor: "#7B8E9E",
    accentColor: "#E2E8F0",
    gradColor1: "#FFFFFF",
    gradColor2: "#CBD5E1",
    gradColor3: "#64748B",
    gradColor4: "#334155",
    badgeBg: "rgba(226, 232, 240, 0.15)",
    badgeBorder: "#94A3B8",
    badgeText: "#F1F5F9",
  },
  gold: {
    colorName: "Gold",
    label: "18K GOLD FINISH",
    sublabel: "VACUUM ION 18K GOLD PLATING",
    bgFrom: "#0F0C05",
    bgTo: "#1F180A",
    auraColor: "#8C6510",
    accentColor: "#F3D798",
    gradColor1: "#FFF8D6",
    gradColor2: "#D4AF37",
    gradColor3: "#A37B1B",
    gradColor4: "#5C3E08",
    badgeBg: "rgba(212, 175, 55, 0.18)",
    badgeBorder: "#D4AF37",
    badgeText: "#FFE082",
  },
  black: {
    colorName: "Black",
    label: "MATTE BLACK ONYX",
    sublabel: "DEEP SATIN PVD TITANIUM FINISH",
    bgFrom: "#070709",
    bgTo: "#13131A",
    auraColor: "#333A48",
    accentColor: "#CBD5E1",
    gradColor1: "#94A3B8",
    gradColor2: "#475569",
    gradColor3: "#1E293B",
    gradColor4: "#0F172A",
    badgeBg: "rgba(148, 163, 184, 0.15)",
    badgeBorder: "#64748B",
    badgeText: "#E2E8F0",
  },
};

function encodeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSvg(prod, colorKey) {
  const cfg = COLOR_CONFIGS[colorKey];
  const gradId = `grad_${colorKey}`;
  const auraId = `aura_${colorKey}`;
  const safeTitle = encodeXml(prod.title);
  const safeSubtitle = encodeXml(prod.subtitle);
  const safeCat = encodeXml(prod.category.toUpperCase());

  return `
<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${auraId}" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="${cfg.auraColor}" stop-opacity="0.8"/>
      <stop offset="55%" stop-color="${cfg.bgTo}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${cfg.bgFrom}" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cfg.gradColor1}"/>
      <stop offset="35%" stop-color="${cfg.gradColor2}"/>
      <stop offset="70%" stop-color="${cfg.gradColor3}"/>
      <stop offset="100%" stop-color="${cfg.gradColor4}"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="1200" fill="url(#${auraId})"/>

  <!-- Ornate Luxury Frames -->
  <rect x="40" y="40" width="1120" height="1120" rx="32" fill="none" stroke="${cfg.accentColor}" stroke-opacity="0.18" stroke-width="2"/>
  <rect x="52" y="52" width="1096" height="1096" rx="24" fill="none" stroke="${cfg.accentColor}" stroke-opacity="0.08" stroke-width="1"/>

  <!-- Corner Flourishes -->
  <circle cx="68" cy="68" r="4" fill="${cfg.accentColor}" fill-opacity="0.4"/>
  <circle cx="1132" cy="68" r="4" fill="${cfg.accentColor}" fill-opacity="0.4"/>
  <circle cx="68" cy="1132" r="4" fill="${cfg.accentColor}" fill-opacity="0.4"/>
  <circle cx="1132" cy="1132" r="4" fill="${cfg.accentColor}" fill-opacity="0.4"/>

  <!-- Top Atelier Branding -->
  <text x="600" y="130" font-family="'Cinzel', Georgia, serif" font-size="26" font-weight="bold" fill="${cfg.accentColor}" letter-spacing="10" text-anchor="middle">TAMZEN ATELIER</text>
  <text x="600" y="165" font-family="'Inter', Helvetica, sans-serif" font-size="13" font-weight="600" fill="${cfg.accentColor}" fill-opacity="0.6" letter-spacing="4" text-anchor="middle">PARIS • FINE TAMIL HERITAGE JEWELRY</text>
  <line x1="450" y1="185" x2="750" y2="185" stroke="${cfg.accentColor}" stroke-opacity="0.25" stroke-width="1"/>

  <!-- Central Jewel / Coin Emblem -->
  <circle cx="600" cy="510" r="230" fill="#0A0B0E" stroke="url(#${gradId})" stroke-width="8"/>
  <circle cx="600" cy="510" r="215" fill="none" stroke="${cfg.accentColor}" stroke-dasharray="6 8" stroke-opacity="0.3" stroke-width="2"/>
  <circle cx="600" cy="510" r="170" fill="url(#${gradId})" fill-opacity="0.12" stroke="url(#${gradId})" stroke-width="3"/>
  <circle cx="600" cy="510" r="130" fill="#0E1015" stroke="${cfg.accentColor}" stroke-opacity="0.4" stroke-width="2"/>

  <!-- Color Emblem Typography -->
  <text x="600" y="495" font-family="'Cinzel', Georgia, serif" font-size="20" font-weight="bold" fill="${cfg.accentColor}" fill-opacity="0.8" letter-spacing="6" text-anchor="middle">AUTHENTIC</text>
  <text x="600" y="545" font-family="'Cinzel', Georgia, serif" font-size="52" font-weight="bold" fill="url(#${gradId})" letter-spacing="4" text-anchor="middle">${cfg.colorName.toUpperCase()}</text>
  <text x="600" y="580" font-family="'Inter', sans-serif" font-size="12" font-weight="bold" fill="${cfg.accentColor}" fill-opacity="0.7" letter-spacing="3" text-anchor="middle">316L STEEL</text>

  <!-- Category Tag -->
  <rect x="500" y="780" width="200" height="32" rx="16" fill="rgba(255,255,255,0.04)" stroke="${cfg.accentColor}" stroke-opacity="0.2" stroke-width="1"/>
  <text x="600" y="801" font-family="'Inter', sans-serif" font-size="11" font-weight="bold" fill="${cfg.accentColor}" fill-opacity="0.8" letter-spacing="3" text-anchor="middle">${safeCat}</text>

  <!-- Product Title & Subtitle -->
  <text x="600" y="870" font-family="'Cinzel', Georgia, serif" font-size="42" font-weight="bold" fill="#FFFFFF" letter-spacing="1" text-anchor="middle">${safeTitle}</text>
  <text x="600" y="910" font-family="'Inter', sans-serif" font-size="14" font-weight="500" fill="${cfg.accentColor}" fill-opacity="0.75" letter-spacing="2" text-anchor="middle">${safeSubtitle}</text>

  <!-- Color Variant Pill -->
  <rect x="420" y="945" width="360" height="52" rx="26" fill="${cfg.badgeBg}" stroke="${cfg.badgeBorder}" stroke-width="1.5"/>
  <circle cx="455" cy="971" r="10" fill="url(#${gradId})" stroke="#000" stroke-width="1.5"/>
  <text x="610" y="977" font-family="'Inter', sans-serif" font-size="16" font-weight="bold" fill="${cfg.badgeText}" letter-spacing="3" text-anchor="middle">${cfg.label}</text>

  <!-- Engineering Trust Marks -->
  <text x="600" y="1055" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="${cfg.accentColor}" fill-opacity="0.7" letter-spacing="2" text-anchor="middle">SOLID 316L SURGICAL STEEL • WATER &amp; SWEAT RESISTANT • NO TARNISH</text>
  <text x="600" y="1085" font-family="'Inter', sans-serif" font-size="11" font-weight="400" fill="${cfg.accentColor}" fill-opacity="0.4" letter-spacing="1.5" text-anchor="middle">TAMZEN ATELIER PARIS • GUARANTEED FOR EVERYDAY WEAR</text>
</svg>
`;
}

async function generateAll() {
  const baseDir = path.resolve(__dirname, "../public/seed-images");
  fs.mkdirSync(baseDir, { recursive: true });

  console.log(`Generating 27 sample jewelry images in ${baseDir}...`);

  for (const prod of PRODUCTS) {
    const prodDir = path.join(baseDir, prod.handle);
    fs.mkdirSync(prodDir, { recursive: true });

    for (const colorKey of ["silver", "gold", "black"]) {
      const svg = buildSvg(prod, colorKey);
      const jpgPath = path.join(prodDir, `${colorKey}.jpg`);
      const pngPath = path.join(prodDir, `${colorKey}.png`);

      const buffer = Buffer.from(svg);

      await sharp(buffer)
        .jpeg({ quality: 95 })
        .toFile(jpgPath);

      await sharp(buffer)
        .png()
        .toFile(pngPath);

      console.log(`  ✓ Created: ${prod.handle}/${colorKey}.jpg & .png`);
    }
  }

  console.log("\nAll 27 seed images generated successfully!");
}

generateAll().catch((err) => {
  console.error("Failed to generate seed images:", err);
  process.exit(1);
});
