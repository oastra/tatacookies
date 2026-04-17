import { useState, useMemo } from "react";
import Head from "next/head";
import Layout from "@/components/layout/Layout";
import SectionWrapper from "@/components/common/SectionWrapper";
import SectionTitle from "@/components/common/SectionTitle";
import ShopCategoryTabs from "@/components/shop/ShopCategoryTabs";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { getServiceSupabase } from "@/lib/supabase";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price, low to high" },
  { value: "price-high", label: "Price, high to low" },
  { value: "a-z", label: "Alphabetically, A-Z" },
  { value: "z-a", label: "Alphabetically, Z-A" },
];

export default function ShopPage({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [availability, setAvailability] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showAvailFilter, setShowAvailFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const categoryNames = ["All", ...categories.map((c) => c.name)];

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== "All") {
      const cat = categories.find((c) => c.name === activeCategory);
      if (cat) {
        result = result.filter((p) =>
          p.categories.some((c) => c.slug === cat.slug),
        );
      }
    }

    // Availability filter
    if (availability === "in-stock") {
      result = result.filter((p) => {
        const av = (p.variants || []).filter((v) => v.is_active);
        return av.some((v) => v.stock_count > 0);
      });
    } else if (availability === "out-of-stock") {
      result = result.filter((p) => {
        const av = (p.variants || []).filter((v) => v.is_active);
        return av.every((v) => v.stock_count === 0);
      });
    }

    // Price filter
    if (priceRange !== "all") {
      result = result.filter((p) => {
        const av = (p.variants || []).filter((v) => v.is_active);
        const minPrice = av.length
          ? Math.min(...av.map((v) => Number(v.price_aud)))
          : 0;
        switch (priceRange) {
          case "under-10":
            return minPrice < 10;
          case "10-25":
            return minPrice >= 10 && minPrice <= 25;
          case "25-50":
            return minPrice >= 25 && minPrice <= 50;
          case "over-50":
            return minPrice > 50;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => {
          const aP = Math.min(
            ...(a.variants || [])
              .filter((v) => v.is_active)
              .map((v) => Number(v.price_aud)),
          );
          const bP = Math.min(
            ...(b.variants || [])
              .filter((v) => v.is_active)
              .map((v) => Number(v.price_aud)),
          );
          return aP - bP;
        });
        break;
      case "price-high":
        result.sort((a, b) => {
          const aP = Math.min(
            ...(a.variants || [])
              .filter((v) => v.is_active)
              .map((v) => Number(v.price_aud)),
          );
          const bP = Math.min(
            ...(b.variants || [])
              .filter((v) => v.is_active)
              .map((v) => Number(v.price_aud)),
          );
          return bP - aP;
        });
        break;
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, categories, activeCategory, sortBy, availability, priceRange]);

  const activeFiltersCount =
    (availability !== "all" ? 1 : 0) + (priceRange !== "all" ? 1 : 0);

  const resetFilters = () => {
    setAvailability("all");
    setPriceRange("all");
  };

  return (
    <>
      <Head>
        <title>Shop - Tatacookies | Custom Decorated Cookies Sydney</title>
        <meta
          name="description"
          content="Shop custom decorated cookies for weddings, birthdays, Easter, Christmas & more. Handmade in Sydney with love. Order online for delivery across Australia."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tatacookies.com/shop" />
        <meta
          property="og:title"
          content="Shop - Tatacookies | Custom Decorated Cookies Sydney"
        />
        <meta
          property="og:description"
          content="Shop custom decorated cookies for weddings, birthdays & events. Handmade in Sydney, delivered across Australia."
        />
        <meta property="og:url" content="https://tatacookies.com/shop" />
        <meta property="og:type" content="website" />
      </Head>

      <Layout>
        <SectionWrapper id="shop" bg="bg-bgPink">
          <SectionTitle className="text-center text-title">Shop</SectionTitle>

          {/* Category Tabs */}
          <ShopCategoryTabs
            categories={categoryNames}
            activeTab={activeCategory}
            onTabClick={setActiveCategory}
          />

          {/* Shipping info */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 py-2.5 px-4 bg-bgBlue/60 rounded-full text-xs sm:text-sm text-text60">
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Delivery $20 · Free over $300
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Free Sydney pick-up
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
              </svg>
              Handmade fresh
            </span>
          </div>

          {/* Filter + Sort Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text">Filter:</span>

              {/* Availability */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAvailFilter(!showAvailFilter);
                    setShowPriceFilter(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm border transition flex items-center gap-1.5 ${
                    availability !== "all"
                      ? "border-primary bg-primary/10 text-title"
                      : "border-gray-200 bg-white text-text60 hover:border-gray-300"
                  }`}
                >
                  Availability
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="opacity-50"
                  >
                    <path
                      d="M3 5L6 8L9 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                {showAvailFilter && (
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-[16px] shadow-cookie border border-gray-100 p-2 z-20">
                    {[
                      { value: "in-stock", label: "In stock" },
                      { value: "out-of-stock", label: "Out of stock" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-bgPink cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="availability"
                          checked={availability === opt.value}
                          onChange={() => {
                            setAvailability(opt.value);
                            setShowAvailFilter(false);
                          }}
                          className="accent-[#8FE3D9]"
                        />
                        <span className="text-sm text-text">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowPriceFilter(!showPriceFilter);
                    setShowAvailFilter(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm border transition flex items-center gap-1.5 ${
                    priceRange !== "all"
                      ? "border-primary bg-primary/10 text-title"
                      : "border-gray-200 bg-white text-text60 hover:border-gray-300"
                  }`}
                >
                  Price
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="opacity-50"
                  >
                    <path
                      d="M3 5L6 8L9 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                {showPriceFilter && (
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-[16px] shadow-cookie border border-gray-100 p-2 z-20">
                    {[
                      { value: "under-10", label: "Under $10" },
                      { value: "10-25", label: "$10 - $25" },
                      { value: "25-50", label: "$25 - $50" },
                      { value: "over-50", label: "Over $50" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-bgPink cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="priceRange"
                          checked={priceRange === opt.value}
                          onChange={() => {
                            setPriceRange(opt.value);
                            setShowPriceFilter(false);
                          }}
                          className="accent-[#8FE3D9]"
                        />
                        <span className="text-sm text-text">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-title hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Sort + Count */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text60">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-full text-sm border border-gray-200 bg-white text-text focus:outline-none focus:border-primary cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-sm text-text60">
                {filteredAndSorted.length} product
                {filteredAndSorted.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Product Grid — full width, 4 columns */}
          {filteredAndSorted.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSorted.map((product) => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text60 text-h4 py-12">
              No cookies match your filters.
            </p>
          )}
        </SectionWrapper>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const supabase = getServiceSupabase();

  const { data: products, error: prodError } = await supabase
    .from("products")
    .select(
      `
      id,
      title,
      slug,
      description,
      image_url,
      alt_text,
      is_featured,
      season_start,
      season_end,
      sort_order,
      product_variants (
        id,
        name,
        price_aud,
        stripe_price_id,
        stock_count,
        sort_order,
        is_active
      ),
      product_categories (
        category_id,
        categories (
          id,
          name,
          slug,
          type
        )
      )
    `,
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name, slug, type")
    .order("sort_order", { ascending: true });

  if (prodError || catError) {
    console.error("Supabase error:", prodError || catError);
    return { props: { products: [], categories: [] }, revalidate: 60 };
  }

  const formattedProducts = (products || []).map((p) => {
    const { product_variants, product_categories, ...rest } = p;
    return {
      ...rest,
      variants: (product_variants || []).map((v) => ({
        ...v,
        stripe_price_id: v.stripe_price_id || null,
      })),
      categories: (product_categories || []).map((pc) => pc.categories),
    };
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(formattedProducts)),
      categories: JSON.parse(JSON.stringify(categories || [])),
    },
    revalidate: 60,
  };
}
