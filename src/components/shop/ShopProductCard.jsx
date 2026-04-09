import Link from "next/link";
import BaseProductCard from "@/components/ui/cards/BaseProductCard";

const ShopProductCard = ({ product }) => {
  const { title, slug, image_url, alt_text, variants = [] } = product;

  const activeVariants = variants.filter((v) => v.is_active);
  const minPrice = activeVariants.length
    ? Math.min(...activeVariants.map((v) => Number(v.price_aud)))
    : 0;

  const totalStock = activeVariants.reduce((sum, v) => sum + v.stock_count, 0);
  const isSoldOut = totalStock === 0;

  const hasMultipleVariants = activeVariants.length > 1;

  return (
    <Link
      href={`/shop/${slug}`}
      className="block w-full h-full"
      aria-label={`View ${title}`}
    >
      <BaseProductCard
        image={image_url}
        alt={alt_text || title}
        title={title}
        priceLabel={`${hasMultipleVariants ? "From " : ""}$${minPrice} AUD`}
        isSoldOut={isSoldOut}
      />
    </Link>
  );
};

export default ShopProductCard;
