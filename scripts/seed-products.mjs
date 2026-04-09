/**
 * Seed script: migrates bestSellersList data into Supabase
 *
 * Usage:
 *   node scripts/seed-products.mjs
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Load from .env.local with: node --env-file=.env.local scripts/seed-products.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Map products to categories based on their seasonal dates and content
function getCategoryMappings(product) {
  const cats = [];
  const { title, start, end, price, randomOnly } = product;
  const t = title.toLowerCase();

  // Seasonal categories
  if (start === "01-17" && end === "02-14") cats.push("valentines-day");
  if (start === "02-15" && end === "04-19") cats.push("easter");
  if (start === "10-15" && end === "10-31") cats.push("halloween");
  if (start === "12-01" && end === "12-31") cats.push("christmas");

  // Content-based categories
  if (t.includes("wedding") || t.includes("eldary couple"))
    cats.push("wedding");
  if (
    t.includes("baby") ||
    t.includes("unicorn") ||
    t.includes("cute babies")
  )
    cats.push("baby-shower");
  if (
    t.includes("birthday") ||
    t.includes("school") ||
    t.includes("graduation")
  )
    cats.push("birthday");

  // Type-based categories
  if (t.includes("set") || t.includes("box") || price >= 20)
    cats.push("gift-boxes");
  if (!t.includes("set") && !t.includes("box") && price <= 15)
    cats.push("single-cookies");

  return cats;
}

const bestSellersList = [
  { id: 1, title: "Wedding Cookie", alt: "Romantic cookies shaped like hearts and engagement rings for wedding, handmade in Sydney", price: 9, image: "/images/cookies/heart-proposing.webp", start: "01-17", end: "02-14" },
  { id: 2, title: "Hearts Gift Box Cookies", alt: "Valentine's Day cookie set with heart shapes and pink tones, handmade in Sydney", price: 20, image: "/images/cookies/hearts-1.webp", start: "01-17", end: "02-14" },
  { id: 3, title: "Love Message Cookie", alt: "Cookies with love messages for Valentine's Day, handmade in Sydney", price: 11, image: "/images/cookies/Love.webp", start: "01-17", end: "02-14" },
  { id: 4, title: "Eldary Couple Cookie", alt: "Fantasy-style couple cookies with hearts and roses, handmade in Sydney", price: 15, image: "/images/cookies/eldary-couple.webp", start: "01-17", end: "02-14" },
  { id: 5, title: "Heart Cookie", alt: "Heart-shaped cookies in a gift box, handmade in Sydney", price: 9, image: "/images/cookies/hearts.webp", start: "01-17", end: "02-14" },
  { id: 6, title: "Easter Cookie Set", alt: "Colorful Easter-themed cookie assortment, handmade in Sydney", price: 30, image: "/images/cookies/easter-set.webp", start: "02-15", end: "04-19" },
  { id: 7, title: "Yellow Easter Cookie", alt: "Bright yellow cookies with Easter bunnies and eggs, handmade in Sydney", price: 8, image: "/images/cookies/easter-yellow.webp", start: "02-15", end: "04-19" },
  { id: 8, title: "School Celebration Set", alt: "Cookies for end-of-year school celebrations, handmade in Sydney", price: 20, image: "/images/cookies/end-of-school.webp", start: "11-20", end: "12-05" },
  { id: 9, title: "Graduation Party Cookie", alt: "Graduation-themed cookies with hats and diplomas, handmade in Sydney", price: 5, image: "/images/cookies/end-of-school-1.webp", start: "11-20", end: "12-05" },
  { id: 10, title: "Classic Christmas Cookie", alt: "Festive holiday cookie assortment, handmade in Sydney", price: 10, image: "/images/cookies/christmas-1.webp", start: "12-01", end: "12-31" },
  { id: 11, title: "Christmas Cookie", alt: "Christmas cookies beautifully held in hands, handmade in Sydney", price: 2, image: "/images/cookies/christmas-cookies-in-hands.webp", start: "12-01", end: "12-31" },
  { id: 12, title: "New Year Tiger & Bear Cookie", alt: "Cookies with tigers and bears for the New Year, handmade in Sydney", price: 10, image: "/images/cookies/new-year-tiger-bear-cookie.webp", start: "12-01", end: "12-31" },
  { id: 13, title: "Penguin Winter Cookie", alt: "Christmas penguin cookies, handmade in Sydney", price: 10, image: "/images/cookies/penguin.webp", start: "12-01", end: "12-31" },
  { id: 14, title: "Snow White Bear Cookie", alt: "Cookies shaped like polar bears for Christmas, handmade in Sydney", price: 8, image: "/images/cookies/snow-white-bear.webp", start: "12-01", end: "12-31" },
  { id: 15, title: "Snowman Cookie", alt: "Snowman cookies for the holiday season, handmade in Sydney", price: 10, image: "/images/cookies/snowman.webp", start: "12-01", end: "12-31" },
  { id: 16, title: "Favorite book Cookie", alt: "Cookies inspired by Harry Potter, handmade in Sydney", price: 8, image: "/images/cookies/harry-potter.webp", start: "08-01", end: "08-31" },
  { id: 17, title: "Favorite book Cookie Set", alt: "Cookies inspired by Harry Potter set, handmade in Sydney", price: 15, image: "/images/cookies/harry-potter-badge.webp", start: "08-01", end: "08-31" },
  { id: 18, title: "Doctor Appreciation Set", alt: "Stethoscope and heart-themed cookies for healthcare workers, handmade in Sydney", price: 40, image: "/images/cookies/doctor-set.webp", start: "02-01", end: "02-11" },
  { id: 19, title: "Soccer & Formula 1 Set", alt: "Cookies with soccer balls and F1 helmets, handmade in Sydney", price: 85, image: "/images/cookies/soccer-formula1-set.webp", start: "03-01", end: "04-10" },
  { id: 20, title: "Blue & Pink Halloween Cookie", alt: "Cute Halloween cookies in pastel colors, handmade in Sydney", price: 8, image: "/images/cookies/halloween-blue-pink.webp", start: "10-15", end: "10-31" },
  { id: 21, title: "Classic Boo Cookie", alt: "Halloween cookies with ghosts and Boo text, handmade in Sydney", price: 8, image: "/images/cookies/halloween-boo.webp", start: "10-15", end: "10-31" },
  { id: 22, title: "Blue Halloween Cookies", alt: "Dark blue Halloween cookie set, handmade in Sydney", price: 8, image: "/images/cookies/halloween-blue.webp", start: "10-15", end: "10-31" },
  { id: 23, title: "Farm Set", alt: "Springtime farm cookie set, handmade in Sydney", price: 26, image: "/images/cookies/farm-set-2.webp", start: "09-01", end: "09-21" },
  { id: 24, title: "Veggie Cookie", alt: "Cookies shaped like cute vegetables, handmade in Sydney", price: 8, image: "/images/cookies/vegetables.webp", start: "09-01", end: "09-21" },
  { id: 25, title: "Veggie Set", alt: "Decorated cookie vegetables for springtime, handmade in Sydney", price: 22, image: "/images/cookies/vegetables-2.webp", start: "09-01", end: "09-21" },
  { id: 26, title: "Green Fish Cookie", alt: "Sea-life inspired cookie, handmade in Sydney", price: 8, image: "/images/cookies/green-fish.webp", start: "01-26", end: "01-31" },
  { id: 27, title: "Sea Life Cookie", alt: "Cookies inspired by sea creatures, handmade in Sydney", price: 10, image: "/images/cookies/sea-life.webp", start: "01-26", end: "01-31" },
  { id: 28, title: "Back to School Cookie", alt: "Cookies for school start, handmade in Sydney", price: 6, image: "/images/cookies/school.webp", start: "01-22", end: "01-31" },
  { id: 29, title: "Baby Girl Cookie", alt: "Pink-themed cookies for baby girl party, handmade in Sydney", price: 10, image: "/images/cookies/baby-girl.webp", start: "05-05", end: "05-25", randomOnly: true },
  { id: 30, title: "Baby Girl Set", alt: "Floral cookies for baby girl celebration, handmade in Sydney", price: 130, image: "/images/cookies/baby-girl-1.webp", start: "05-05", end: "05-25", randomOnly: true },
  { id: 31, title: "Baby Boy Cookie", alt: "Blue-themed cookies for baby shower, handmade in Sydney", price: 10, image: "/images/cookies/baby-boy-set.webp", start: "05-05", end: "05-25", randomOnly: true },
  { id: 32, title: "Baby Shower Set", alt: "Gender-neutral baby shower cookies, handmade in Sydney", price: 130, image: "/images/cookies/baby-shower.webp", start: "05-05", end: "05-25", randomOnly: true },
  { id: 33, title: "Cute Babies", alt: "Cookies decorated as baby faces, handmade in Sydney", price: 15, image: "/images/cookies/cute-babies.webp", start: "05-05", end: "05-25", randomOnly: true },
  { id: 34, title: "Unicorn Cookie", alt: "Magical unicorn cookies with rainbow accents, handmade in Sydney", price: 10, image: "/images/cookies/unicorn.webp", start: "05-05", end: "05-25", randomOnly: true },
  { id: 35, title: "Girl Cookie Portrait", alt: "Art cookie with cute girl illustration, handmade in Sydney", price: 15, image: "/images/cookies/girl-cookie.webp", start: "05-05", end: "05-25", randomOnly: true },
  { id: 36, title: "Social Media Cookie", alt: "Cookies with YouTube, Instagram, Facebook icons, handmade in Sydney", price: 8, image: "/images/cookies/youtube-instagram-facebook-girl.webp", start: "05-05", end: "05-25", randomOnly: true },
];

async function seed() {
  console.log("Fetching categories...");
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, slug");

  if (catError) {
    console.error("Failed to fetch categories:", catError);
    process.exit(1);
  }

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  console.log(`Found ${categories.length} categories`);

  console.log(`Seeding ${bestSellersList.length} products...`);

  for (const item of bestSellersList) {
    const slug = slugify(item.title);

    // Insert product
    const { data: product, error: prodError } = await supabase
      .from("products")
      .upsert(
        {
          title: item.title,
          slug,
          description: item.alt.split(",")[0], // first part of alt as description
          image_url: item.image,
          alt_text: item.alt,
          is_active: true,
          is_featured: !item.randomOnly,
          season_start: item.start,
          season_end: item.end,
          sort_order: item.id,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (prodError) {
      console.error(`Failed to insert "${item.title}":`, prodError);
      continue;
    }

    console.log(`  + ${item.title} (${product.id})`);

    // Insert default variant
    const { error: varError } = await supabase.from("product_variants").upsert(
      {
        product_id: product.id,
        name: item.price >= 20 ? "Set" : "Single Cookie",
        price_aud: item.price,
        stock_count: 10, // default stock
        sort_order: 0,
        is_active: true,
      },
      { onConflict: "product_id,name", ignoreDuplicates: true }
    );

    if (varError) {
      console.error(`  Failed variant for "${item.title}":`, varError);
    }

    // Map categories
    const catSlugs = getCategoryMappings(item);
    for (const catSlug of catSlugs) {
      if (!catMap[catSlug]) continue;
      const { error: linkError } = await supabase
        .from("product_categories")
        .upsert(
          { product_id: product.id, category_id: catMap[catSlug] },
          { onConflict: "product_id,category_id", ignoreDuplicates: true }
        );
      if (linkError) {
        console.error(`  Failed category link ${catSlug}:`, linkError);
      }
    }
  }

  console.log("\nSeed complete!");
}

seed().catch(console.error);
