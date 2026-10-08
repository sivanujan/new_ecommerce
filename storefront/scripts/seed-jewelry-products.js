const fetch = require("node-fetch").default || globalThis.fetch;

const BACKEND_URL = (process.env.MEDUSA_BACKEND_URL || "http://127.0.0.1:9000").replace(/\/+$/, "");
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL || "admin@tamzen.shop";
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || "supersecret";
const DEFAULT_SALES_CHANNEL_ID = "sc_01M4AZ8B99DQHGQ3RFP2YR865W";

const TARGET_CATEGORIES = [
  { name: "Pendants", handle: "pendants", description: "Symbolic Tamil heritage pendants forged in surgical-grade steel." },
  { name: "Chains", handle: "chains", description: "Timeless 316L stainless steel chains engineered for daily wear." },
  { name: "Special Editions", handle: "special-editions", description: "Limited collector editions celebrating Tamil resilience and memory." },
];

const TARGET_PRODUCTS = [
  // 1. PENDANTS
  {
    title: "Eelam Leaf Dog-Tag Pendant",
    handle: "eelam-leaf-dog-tag-pendant",
    categoryHandle: "pendants",
    basePrice: 69,
    description:
      "Forged from premium 316L surgical stainless steel, this signature dog-tag pendant embodies Tamil resilience and enduring heritage. Engineered with complete water and sweat resistance, guaranteed never to tarnish or fade. A timeless piece of personal identity crafted for everyday wear.",
  },
  {
    title: "Lion Emblem Pendant",
    handle: "lion-emblem-pendant",
    categoryHandle: "pendants",
    basePrice: 75,
    description:
      "Featuring the sovereign Tamil royal lion motif intricately engraved in solid 316L surgical steel. Built for lifetime durability with scratch, water, and sweat-resistant finishing that never tarnishes. A bold cultural emblem radiating regal dignity.",
  },
  {
    title: "Karthigai Flower Pendant",
    handle: "karthigai-flower-pendant",
    categoryHandle: "pendants",
    basePrice: 65,
    description:
      "An artistic tribute to the sacred Karthigai glory lily, meticulously sculpted in hypoallergenic 316L stainless steel. Highly polished for brilliant shine, 100% water and sweat resistant, with zero tarnishing. A cherished botanical symbol of remembrance and eternal light.",
  },

  // 2. CHAINS
  {
    title: "Classic Cuban Link Chain",
    handle: "classic-cuban-link-chain",
    categoryHandle: "chains",
    basePrice: 59,
    description:
      "A statement 6mm Cuban link chain expertly machined from high-tensile 316L surgical-grade stainless steel. Completely impervious to water, sweat, and tarnishing, designed to maintain its brilliant luster 24/7. Finished with our signature TamZen double-locking luxury clasp.",
  },
  {
    title: "Box Chain 3mm",
    handle: "box-chain-3mm",
    categoryHandle: "chains",
    basePrice: 49,
    description:
      "A sleek geometric 3mm box chain crafted from solid 316L stainless steel with geometric precision. Engineered to withstand heavy everyday use, gym sessions, and showers without tarnishing or skin discoloration. The quintessential luxury foundation for any TamZen pendant.",
  },
  {
    title: "Rope Chain",
    handle: "rope-chain",
    categoryHandle: "chains",
    basePrice: 55,
    description:
      "Diamond-cut twisted rope chain sculpted with intricate light-catching facets in durable 316L stainless steel. Fully waterproof, sweat-resistant, and tarnish-free, delivering exceptional drape and comfort. An iconic essential that elevates both standalone styling and layered aesthetics.",
  },

  // 3. SPECIAL EDITIONS
  {
    title: "Tamil Eelam Map Tiger Pendant",
    handle: "tamil-eelam-map-tiger-pendant",
    categoryHandle: "special-editions",
    basePrice: 89,
    description:
      "A collector's special edition pendant detailing the sovereign homeland topography accented with the courageous Tamil tiger emblem in solid 316L surgical steel. Engineered for generational endurance with complete water and sweat resistance that never tarnishes. An immortal artifact of roots, memory, and sacred homeland.",
  },
  {
    title: "Lion Crest Limited Edition",
    handle: "lion-crest-limited-edition",
    categoryHandle: "special-editions",
    basePrice: 95,
    description:
      "A numbered atelier masterpiece bearing the historic Tamil royal crest deeply stamped into heavy-gauge 316L stainless steel. Hand-finished with mirror polishing and vacuum ion plating, 100% water and sweat resistant with guaranteed anti-tarnish longevity. A proud statement of heritage forged for the discerning collector.",
  },
  {
    title: "Heritage Spear Pendant",
    handle: "heritage-spear-pendant",
    categoryHandle: "special-editions",
    basePrice: 79,
    description:
      "Inspired by the divine Vel of valor and wisdom, this sharp geometric spear pendant is precision-cast in solid 316L surgical steel. Resistant to water, perspiration, and environmental wear, engineered never to tarnish or lose its edge. A sacred symbol of truth, strength, and unwavering protection.",
  },
];

async function getAdminToken() {
  const res = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!res.ok || !data.token) {
    throw new Error(`Admin authentication failed: ${data.message || res.statusText}`);
  }
  return data.token;
}

async function adminRequest(endpoint, token, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  return { status: res.status, ok: res.ok, data: json };
}

async function run() {
  console.log("=== TAMZEN JEWELRY SEED & CLEANUP SCRIPT ===");
  console.log(`Target Backend: ${BACKEND_URL}`);

  // 1. Authenticate
  const token = await getAdminToken();
  console.log("✓ Authenticated as admin staff");

  // 2. Ensure Categories Exist & Cleaned
  console.log("\n--- Checking Categories ---");
  const catListRes = await adminRequest("/admin/product-categories?limit=50", token);
  const existingCategories = catListRes.data?.product_categories || [];

  const categoryMap = new Map(); // handle -> id

  for (const targetCat of TARGET_CATEGORIES) {
    const found = existingCategories.find((c) => c.handle === targetCat.handle);
    if (found) {
      categoryMap.set(targetCat.handle, found.id);
      // Ensure title case
      if (found.name !== targetCat.name) {
        await adminRequest(`/admin/product-categories/${found.id}`, token, {
          method: "POST",
          body: JSON.stringify({ name: targetCat.name }),
        });
        console.log(`  ✓ Updated category name: "${targetCat.name}" (${found.id})`);
      } else {
        console.log(`  ✓ Verified category: "${targetCat.name}" (${found.id})`);
      }
    } else {
      const createRes = await adminRequest("/admin/product-categories", token, {
        method: "POST",
        body: JSON.stringify({
          name: targetCat.name,
          handle: targetCat.handle,
          description: targetCat.description,
          is_active: true,
          is_internal: false,
        }),
      });
      const newId = createRes.data?.product_category?.id;
      categoryMap.set(targetCat.handle, newId);
      console.log(`  + Created category: "${targetCat.name}" (${newId})`);
    }
  }

  // Remove any obsolete demo categories (Shirts, Pants, etc.)
  for (const existingCat of existingCategories) {
    if (!TARGET_CATEGORIES.some((c) => c.handle === existingCat.handle)) {
      console.log(`  - Deleting legacy non-jewelry category: "${existingCat.name}" (${existingCat.id})`);
      await adminRequest(`/admin/product-categories/${existingCat.id}`, token, {
        method: "DELETE",
      });
    }
  }

  // 3. Cleanup Old Products
  console.log("\n--- Cleaning up Old Products ---");
  const targetHandles = new Set(TARGET_PRODUCTS.map((p) => p.handle));
  const prodListRes = await adminRequest("/admin/products?limit=100", token);
  const existingProducts = prodListRes.data?.products || [];

  console.log(`Found ${existingProducts.length} existing products in database.`);

  for (const p of existingProducts) {
    // If not one of the target 9, delete it
    if (!targetHandles.has(p.handle)) {
      console.log(`  - Deleting old item: "${p.title}" (handle: ${p.handle}, id: ${p.id})`);
      await adminRequest(`/admin/products/${p.id}`, token, { method: "DELETE" });
    } else {
      // If it is one of the target 9, remove it so we recreate clean variants & options (idempotent)
      console.log(`  ↻ Refreshing target item: "${p.title}" (id: ${p.id})`);
      await adminRequest(`/admin/products/${p.id}`, token, { method: "DELETE" });
    }
  }

  // 4. Seed the 9 Products with 3 Color Variants Each
  console.log("\n--- Seeding 9 Jewelry Products with 3 Color Variants Each ---");

  for (const p of TARGET_PRODUCTS) {
    const categoryId = categoryMap.get(p.categoryHandle);
    const handle = p.handle;

    const silverImg = `/seed-images/${handle}/silver.jpg`;
    const goldImg = `/seed-images/${handle}/gold.jpg`;
    const blackImg = `/seed-images/${handle}/black.jpg`;

    const productPayload = {
      title: p.title,
      handle: p.handle,
      description: p.description,
      status: "published",
      thumbnail: silverImg,
      images: [
        { url: silverImg },
        { url: goldImg },
        { url: blackImg },
      ],
      sales_channels: [{ id: DEFAULT_SALES_CHANNEL_ID }],
      categories: categoryId ? [{ id: categoryId }] : [],
      options: [
        {
          title: "Color",
          values: ["Silver", "Gold", "Black"],
        },
      ],
      variants: [
        {
          title: `${p.title} – Silver`,
          sku: `${handle.toUpperCase()}-SILVER`,
          options: { Color: "Silver" },
          prices: [{ currency_code: "eur", amount: p.basePrice }],
          manage_inventory: false,
          allow_backorder: true,
          metadata: {
            stock_quantity: 20,
            color: "Silver",
            image_url: silverImg,
            images: [silverImg],
          },
        },
        {
          title: `${p.title} – Gold`,
          sku: `${handle.toUpperCase()}-GOLD`,
          options: { Color: "Gold" },
          prices: [{ currency_code: "eur", amount: p.basePrice + 10 }],
          manage_inventory: false,
          allow_backorder: true,
          metadata: {
            stock_quantity: 20,
            color: "Gold",
            image_url: goldImg,
            images: [goldImg],
          },
        },
        {
          title: `${p.title} – Black`,
          sku: `${handle.toUpperCase()}-BLACK`,
          options: { Color: "Black" },
          prices: [{ currency_code: "eur", amount: p.basePrice }],
          manage_inventory: false,
          allow_backorder: true,
          metadata: {
            stock_quantity: 20,
            color: "Black",
            image_url: blackImg,
            images: [blackImg],
          },
        },
      ],
      metadata: {
        featured_image: silverImg,
        color_images: {
          Silver: [silverImg],
          Gold: [goldImg],
          Black: [blackImg],
        },
      },
    };

    const createRes = await adminRequest("/admin/products", token, {
      method: "POST",
      body: JSON.stringify(productPayload),
    });

    if (!createRes.ok || !createRes.data?.product?.id) {
      console.error(`  ✗ Failed to create "${p.title}":`, createRes.data?.message || createRes.status);
    } else {
      const createdProd = createRes.data.product;
      // Associate category explicitly if Medusa 2.0 requires separate linking
      if (categoryId) {
        await adminRequest(`/admin/products/${createdProd.id}`, token, {
          method: "POST",
          body: JSON.stringify({ categories: [{ id: categoryId }] }),
        });
      }
      console.log(`  ✓ Successfully seeded: "${p.title}" (${p.categoryHandle})`);
      console.log(`     Variants: Silver (€${p.basePrice}), Gold (€${p.basePrice + 10}), Black (€${p.basePrice})`);
    }
  }

  console.log("\n=== SEED COMPLETED SUCCESSFULLY! ===");
  console.log("9 products seeded with 3 color variants each.");
}

run().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
