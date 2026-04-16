import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import SectionWrapper from "@/components/common/SectionWrapper";
import VariantSelector from "@/components/shop/VariantSelector";
import QuantitySelector from "@/components/shop/QuantitySelector";
import StockBadge from "@/components/shop/StockBadge";
import ShopProductCard from "@/components/shop/ShopProductCard";
import ButtonOrLink from "@/components/ui/ButtonOrLink";
import VectorIcon from "@/components/icons/VectorIcon";
import SectionTitle from "@/components/common/SectionTitle";
import { useCart } from "@/context/CartContext";
import { getServiceSupabase } from "@/lib/supabase";

export default function ProductDetailPage({ product, relatedProducts }) {
  const { addToCart, setCartOpen } = useCart();

  // Scroll to top when product changes (e.g. clicking a related cookie)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [product.id]);

  const activeVariants = (product.variants || []).filter((v) => v.is_active);

  const firstInStock = activeVariants.find((v) => v.stock_count > 0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    firstInStock?.id || activeVariants[0]?.id
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Multi-image: main image + additional images
  const allImages = [
    { image_url: product.image_url, alt_text: product.alt_text || product.title },
    ...(product.images || []),
  ];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedVariant = activeVariants.find(
    (v) => v.id === selectedVariantId
  );

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock_count === 0) return;

    addToCart(product, selectedVariant, qty);
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isSoldOut = !selectedVariant || selectedVariant.stock_count === 0;

  return (
    <>
      <Head>
        <title>{`${product.title} - Tatacookies | Custom Cookies Sydney`}</title>
        <meta
          name="description"
          content={
            product.description ||
            `${product.title} - Handmade decorated cookies from Tatacookies Sydney`
          }
        />
        <link
          rel="canonical"
          href={`https://tatacookies.com/shop/${product.slug}`}
        />
        <meta
          property="og:title"
          content={`${product.title} - Tatacookies`}
        />
        <meta
          property="og:description"
          content={
            product.description ||
            `${product.title} - Handmade decorated cookies`
          }
        />
        <meta property="og:image" content={product.image_url} />
        <meta
          property="og:url"
          content={`https://tatacookies.com/shop/${product.slug}`}
        />
        <meta property="og:type" content="product" />
      </Head>

      <Layout>
        <SectionWrapper>
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-text60">
            <Link href="/" className="hover:text-title transition">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-title transition">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-title">{product.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Images */}
            <div className="w-full lg:w-1/2">
              {/* Main image */}
              <div className="relative aspect-square rounded-[20px] overflow-hidden mb-4">
                <Image
                  src={allImages[activeImageIndex]?.image_url || product.image_url}
                  alt={allImages[activeImageIndex]?.alt_text || product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-20 h-20 rounded-[12px] overflow-hidden shrink-0 border-2 transition ${
                        activeImageIndex === index
                          ? "border-primary"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={img.alt_text || `${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <h1 className="text-mobTitle md:text-titleDesktop font-heading font-semibold text-title">
                {product.title}
              </h1>

              {product.description && (
                <p className="text-h4 text-text leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Price */}
              {selectedVariant && (
                <p className="text-h2 font-semibold text-title">
                  ${Number(selectedVariant.price_aud).toFixed(2)} AUD
                </p>
              )}

              {/* Stock */}
              {selectedVariant && (
                <StockBadge stockCount={selectedVariant.stock_count} />
              )}

              {/* Variant Selector */}
              <VariantSelector
                variants={activeVariants}
                selectedVariantId={selectedVariantId}
                onSelect={(id) => {
                  setSelectedVariantId(id);
                  setQty(1);
                }}
              />

              {/* Quantity */}
              <div className="flex flex-col gap-2">
                <p className="text-base font-medium text-text">Quantity</p>
                <QuantitySelector
                  qty={qty}
                  onChange={setQty}
                  max={selectedVariant?.stock_count || 1}
                />
              </div>

              {/* Add to Cart */}
              <div className="pt-2">
                {isSoldOut ? (
                  <div className="w-full sm:w-[293px] h-[64px] flex items-center justify-center bg-gray-200 rounded-full text-text60 font-medium">
                    Sold Out
                  </div>
                ) : (
                  <ButtonOrLink
                    onClick={handleAddToCart}
                    className={added ? "bg-secondary" : "bg-primary"}
                  >
                    {added ? "Added!" : "Add to Cart"}{" "}
                    <VectorIcon className="ml-2" />
                  </ButtonOrLink>
                )}
              </div>

              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  {product.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="px-3 py-1 bg-bgBlue rounded-full text-small text-text60"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>

        {/* Related Cookies */}
        {relatedProducts && relatedProducts.length > 0 && (
          <SectionWrapper bg="bg-bgPink">
            <SectionTitle className="text-center text-title">
              Related Cookies
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ShopProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </SectionWrapper>
        )}
      </Layout>
    </>
  );
}

export async function getStaticPaths() {
  const supabase = getServiceSupabase();

  const { data: products } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);

  const paths = (products || []).map((p) => ({
    params: { slug: p.slug },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const supabase = getServiceSupabase();

  const { data: product, error } = await supabase
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
        categories (
          id,
          name,
          slug,
          type
        )
      ),
      product_images (
        id,
        image_url,
        alt_text,
        sort_order
      )
    `
    )
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    return { notFound: true };
  }

  // Get related products from same categories
  const categoryIds = (product.product_categories || []).map(
    (pc) => pc.categories?.id
  ).filter(Boolean);

  let relatedProducts = [];

  if (categoryIds.length > 0) {
    const { data: related } = await supabase
      .from("products")
      .select(
        `
        id,
        title,
        slug,
        image_url,
        alt_text,
        product_variants (
          id,
          name,
          price_aud,
          stock_count,
          is_active
        ),
        product_categories!inner (
          category_id
        )
      `
      )
      .eq("is_active", true)
      .neq("id", product.id)
      .in("product_categories.category_id", categoryIds)
      .limit(8);

    if (related) {
      // Deduplicate (product can appear multiple times from multiple categories)
      const seen = new Set();
      relatedProducts = related
        .filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        })
        .slice(0, 4)
        .map((p) => {
          const { product_variants, product_categories, ...rest } = p;
          return {
            ...rest,
            variants: product_variants || [],
            categories: [],
          };
        });
    }
  }

  const { product_variants, product_categories, product_images, ...rest } = product;

  const formatted = {
    ...rest,
    variants: (product_variants || []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
    categories: (product_categories || []).map((pc) => pc.categories),
    images: (product_images || []).sort((a, b) => a.sort_order - b.sort_order),
  };

  return {
    props: {
      product: JSON.parse(JSON.stringify(formatted)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    },
    revalidate: 60,
  };
}
