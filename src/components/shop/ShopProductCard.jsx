import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BestSellersBuyIcon from "@/components/icons/BestSellersBuyIcon";
import { useCart } from "@/context/CartContext";

const ShopProductCard = ({ product }) => {
  const { title, slug, image_url, alt_text, variants = [] } = product;
  const { addToCart, setCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const activeVariants = variants.filter((v) => v.is_active);
  const minPrice = activeVariants.length
    ? Math.min(...activeVariants.map((v) => Number(v.price_aud)))
    : 0;

  const totalStock = activeVariants.reduce((sum, v) => sum + v.stock_count, 0);
  const isSoldOut = totalStock === 0;
  const hasMultipleVariants = activeVariants.length > 1;

  const canQuickAdd =
    !isSoldOut && activeVariants.length === 1 && activeVariants[0].stock_count > 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, activeVariants[0], 1);
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="w-full h-full p-4 bg-white rounded-[20px] border border-gray-200 shadow-cookie flex flex-col gap-4 justify-between transition-transform sm:hover:scale-[1.01]">
      {/* Image */}
      <Link href={`/shop/${slug}`} scroll={true} className="block">
        <div className="relative w-full aspect-square sm:h-[280px]">
          <Image
            src={image_url}
            alt={alt_text || title}
            fill
            className={`object-cover rounded-[20px] ${isSoldOut ? "grayscale opacity-60" : ""}`}
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 280px"
          />
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center rounded-[20px]">
              <span className="bg-white/90 text-title font-semibold px-4 py-2 rounded-full text-sm">
                Sold Out
              </span>
            </div>
          )}
          {!isSoldOut && totalStock > 0 && totalStock <= 5 && (
            <span className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Only {totalStock} left
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-4 text-left justify-between flex-1">
        <Link href={`/shop/${slug}`} scroll={true}>
          <p className="text-button text-title font-medium">{title}</p>
        </Link>

        {/* Price + Action */}
        <div className="mt-auto flex justify-between items-end">
          <p className="font-medium text-text">
            {hasMultipleVariants ? "From " : ""}${minPrice} AUD
          </p>

          {canQuickAdd ? (
            <button
              onClick={handleQuickAdd}
              aria-label={`Add ${title} to cart`}
              className="group flex items-center justify-center rounded-full transition-colors"
            >
              <BestSellersBuyIcon
                size={60}
                bgColor={
                  added
                    ? "fill-secondary1"
                    : "group-hover:fill-secondary1 group-active:fill-title fill-[#8FE3D9]"
                }
                textColor={
                  added
                    ? "fill-title"
                    : "group-hover:fill-title group-active:fill-white fill-[#46494C]"
                }
              />
            </button>
          ) : (
            <Link
              href={`/shop/${slug}`}
              aria-label={`View ${title}`}
              className="group flex items-center justify-center rounded-full transition-colors"
            >
              <BestSellersBuyIcon
                size={60}
                bgColor="group-hover:fill-secondary1 group-active:fill-title fill-[#8FE3D9]"
                textColor="group-hover:fill-title group-active:fill-white fill-[#46494C]"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
