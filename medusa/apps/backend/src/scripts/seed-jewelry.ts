import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Seed 10 dummy products for a premium jewelry & sarees brand.
 *
 * - Categories: "Bijoux" (gold chains, pendants, rings) and "Sarees" (silk sarees)
 * - Prices in EUR, per-variant stock quantities, placeholder images (picsum.photos)
 * - All products published to the Default Sales Channel and attached to a
 *   "Signature" collection so they render on the storefront homepage (/fr) and
 *   the store listing (/fr/store).
 *
 * Idempotent: re-running skips categories, the collection, and products that
 * already exist (matched by name / handle).
 *
 * Run with:  npx medusa exec ./src/scripts/seed-jewelry.ts
 */

const SKU_PREFIX = "MZ-";
const IMG = (handle: string, n: number) =>
  `https://picsum.photos/seed/${handle}-${n}/900/1100`;

type SeedProduct = {
  title: string;
  handle: string;
  category: "Bijoux" | "Sarees";
  description: string;
  price: number; // EUR, TVA-inclusive
  weight: number; // grams
  stock: number; // stocked quantity per variant
  optionTitle: string;
  optionValues: string[];
  skuBase: string;
};

const PRODUCTS: SeedProduct[] = [
  // ---- Bijoux : chaînes ----
  {
    title: "Chaîne Maille Vénitienne Or 18k",
    handle: "chaine-maille-venitienne",
    category: "Bijoux",
    description:
      "Une chaîne intemporelle en or 18 carats à maille vénitienne, polie à la main pour un éclat miroir. Portée seule ou avec un pendentif, elle habille chaque tenue avec élégance.",
    price: 490,
    weight: 12,
    stock: 40,
    optionTitle: "Longueur",
    optionValues: ["45 cm", "50 cm", "55 cm"],
    skuBase: "CHAIN-VEN",
  },
  {
    title: "Chaîne Gourmette Classique Or Jaune",
    handle: "chaine-gourmette-classique",
    category: "Bijoux",
    description:
      "La gourmette revisitée : maillons plats en or jaune, finition brillante et fermoir sécurisé. Un classique masculin comme féminin qui traverse les saisons.",
    price: 390,
    weight: 15,
    stock: 55,
    optionTitle: "Longueur",
    optionValues: ["45 cm", "50 cm"],
    skuBase: "CHAIN-GRM",
  },
  // ---- Bijoux : pendentifs ----
  {
    title: "Pendentif Cœur Serti Diamant",
    handle: "pendentif-coeur-serti",
    category: "Bijoux",
    description:
      "Un cœur délicatement serti d'un diamant naturel, suspendu à une bélière discrète. Une déclaration d'amour à offrir ou à s'offrir.",
    price: 650,
    weight: 4,
    stock: 30,
    optionTitle: "Finition",
    optionValues: ["Or jaune", "Or blanc"],
    skuBase: "PEND-COEUR",
  },
  {
    title: "Pendentif Médaillon Ancien Or Rose",
    handle: "pendentif-medaillon-ancien",
    category: "Bijoux",
    description:
      "Un médaillon ouvrant gravé à la main, inspiré des bijoux de famille. Glissez-y une photo et faites-en un héritage à transmettre.",
    price: 320,
    weight: 6,
    stock: 45,
    optionTitle: "Finition",
    optionValues: ["Or rose", "Or jaune"],
    skuBase: "PEND-MED",
  },
  // ---- Bijoux : bagues ----
  {
    title: "Bague Solitaire Or Blanc",
    handle: "bague-solitaire-or-blanc",
    category: "Bijoux",
    description:
      "Le solitaire par excellence : un diamant taille brillant porté par un anneau épuré en or blanc. La promesse d'un éclat qui ne se démode jamais.",
    price: 1290,
    weight: 3,
    stock: 20,
    optionTitle: "Taille",
    optionValues: ["50", "52", "54", "56"],
    skuBase: "RING-SOL",
  },
  {
    title: "Bague Jonc Martelé Or Rose",
    handle: "bague-jonc-martele",
    category: "Bijoux",
    description:
      "Un jonc large au martelage artisanal qui accroche la lumière sous tous les angles. Sobre et contemporain, il se porte au quotidien.",
    price: 780,
    weight: 5,
    stock: 25,
    optionTitle: "Taille",
    optionValues: ["50", "52", "54"],
    skuBase: "RING-JONC",
  },
  // ---- Sarees : soie ----
  {
    title: "Sari en Soie Kanjivaram Grenat",
    handle: "sari-kanjivaram-grenat",
    category: "Sarees",
    description:
      "Sari Kanjivaram tissé en pure soie grenat, rehaussé d'une bordure en fil d'or zari. Une pièce de cérémonie au drapé somptueux, livrée avec son pan de corsage.",
    price: 420,
    weight: 700,
    stock: 15,
    optionTitle: "Taille",
    optionValues: ["Unique"],
    skuBase: "SAREE-KANJ",
  },
  {
    title: "Sari Banarasi Fil d'Or",
    handle: "sari-banarasi-fil-dor",
    category: "Sarees",
    description:
      "Soie de Banaras aux motifs floraux brochés de fil d'or véritable. Un savoir-faire séculaire pour un tombé majestueux, idéal pour les grandes occasions.",
    price: 520,
    weight: 750,
    stock: 12,
    optionTitle: "Taille",
    optionValues: ["Unique"],
    skuBase: "SAREE-BANA",
  },
  {
    title: "Sari en Soie Mysore Émeraude",
    handle: "sari-mysore-emeraude",
    category: "Sarees",
    description:
      "La légèreté de la soie de Mysore dans un vert émeraude profond, au fini lisse et lumineux. Un sari fluide et facile à draper pour un port tout en élégance.",
    price: 280,
    weight: 500,
    stock: 18,
    optionTitle: "Taille",
    optionValues: ["Unique"],
    skuBase: "SAREE-MYS",
  },
  {
    title: "Sari de Mariage Brodé Ivoire",
    handle: "sari-mariage-brode-ivoire",
    category: "Sarees",
    description:
      "Sari de mariée ivoire entièrement brodé de perles et de fil d'or, doublé pour un maintien parfait. La pièce maîtresse d'une tenue de mariage inoubliable.",
    price: 890,
    weight: 900,
    stock: 8,
    optionTitle: "Taille",
    optionValues: ["Unique"],
    skuBase: "SAREE-MAR",
  },
];

export default async function seedJewelry({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  // --- Default sales channel, stock location, shipping profile (already seeded) ---
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });
  const defaultSalesChannel =
    salesChannels.find((sc) => sc.name === "Default Sales Channel") ??
    salesChannels[0];
  if (!defaultSalesChannel) {
    throw new Error("No sales channel found. Run the initial data seed first.");
  }

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });
  const stockLocation = stockLocations[0];
  if (!stockLocation) {
    throw new Error("No stock location found. Run the initial data seed first.");
  }

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfiles[0];
  if (!shippingProfile) {
    throw new Error("No shipping profile found. Run the initial data seed first.");
  }

  // --- Categories: Bijoux + Sarees (idempotent) ---
  const wantedCategories = ["Bijoux", "Sarees"];
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });
  const categoryByName = new Map<string, string>(
    existingCategories.map((c) => [c.name as string, c.id as string])
  );
  const categoriesToCreate = wantedCategories.filter(
    (name) => !categoryByName.has(name)
  );
  if (categoriesToCreate.length) {
    const { result: created } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: categoriesToCreate.map((name) => ({
          name,
          is_active: true,
        })),
      },
    });
    created.forEach((c) => categoryByName.set(c.name, c.id));
    logger.info(`Created categories: ${categoriesToCreate.join(", ")}`);
  } else {
    logger.info("Categories already exist, reusing.");
  }

  // --- "Signature" collection so products surface on the homepage (/fr) ---
  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title"],
  });
  let signatureCollection = existingCollections.find(
    (c) => c.title === "Signature"
  );
  if (!signatureCollection) {
    const { result: createdCollections } = await createCollectionsWorkflow(
      container
    ).run({
      input: { collections: [{ title: "Signature", handle: "signature" }] },
    });
    signatureCollection = createdCollections[0];
    logger.info("Created 'Signature' collection.");
  }

  // --- Skip products whose handle already exists (idempotent re-runs) ---
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });
  const existingHandles = new Set(existingProducts.map((p) => p.handle));
  const toCreate = PRODUCTS.filter((p) => !existingHandles.has(p.handle));

  if (!toCreate.length) {
    logger.info("All jewelry/saree products already seeded. Nothing to do.");
    return;
  }

  // Track intended stock per SKU so we can set inventory levels afterwards.
  const skuToStock = new Map<string, number>();

  const productsInput = toCreate.map((p) => {
    const variants = p.optionValues.map((value, i) => {
      const sku = `${SKU_PREFIX}${p.skuBase}-${i + 1}`;
      skuToStock.set(sku, p.stock);
      return {
        title: p.optionValues.length === 1 ? p.title : `${p.title} – ${value}`,
        sku,
        options: { [p.optionTitle]: value },
        prices: [{ amount: p.price, currency_code: "eur" }],
      };
    });

    return {
      title: p.title,
      handle: p.handle,
      description: p.description,
      status: ProductStatus.PUBLISHED,
      weight: p.weight,
      shipping_profile_id: shippingProfile.id,
      collection_id: signatureCollection!.id,
      category_ids: [categoryByName.get(p.category)!],
      images: [
        { url: IMG(p.handle, 1) },
        { url: IMG(p.handle, 2) },
      ],
      options: [{ title: p.optionTitle, values: p.optionValues }],
      variants,
      sales_channels: [{ id: defaultSalesChannel.id }],
    };
  });

  logger.info(`Creating ${productsInput.length} products...`);
  await createProductsWorkflow(container).run({
    input: { products: productsInput },
  });

  // --- Stock: create an inventory level per new inventory item ---
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  });
  const newInventoryLevels = inventoryItems
    .filter((item) => item.sku && skuToStock.has(item.sku as string))
    .map((item) => ({
      location_id: stockLocation.id,
      inventory_item_id: item.id,
      stocked_quantity: skuToStock.get(item.sku as string)!,
    }));

  if (newInventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: newInventoryLevels },
    });
    logger.info(`Set stock for ${newInventoryLevels.length} variants.`);
  }

  logger.info(
    `Done. Seeded ${productsInput.length} products across Bijoux & Sarees.`
  );
}
