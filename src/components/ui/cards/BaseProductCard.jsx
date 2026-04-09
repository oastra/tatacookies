import Image from "next/image";
import BestSellersBuyIcon from "@/components/icons/BestSellersBuyIcon";

/**
 * Shared card shell for all product cards.
 * Provides consistent styling: rounded-20, shadow-cookie, image + content layout.
 *
 * @param {string} image - Image URL
 * @param {string} alt - Alt text for image
 * @param {string} title - Product title
 * @param {string} priceLabel - Price display text (e.g. "$9 AUD" or "From $9 AUD")
 * @param {boolean} isSoldOut - Show sold-out overlay on image
 * @param {React.ReactNode} action - Bottom-right action (Buy icon, link, etc.)
 * @param {React.ReactNode} children - Optional extra content below title
 */
const BaseProductCard = ({
  image,
  alt,
  title,
  priceLabel,
  isSoldOut = false,
  action,
  children,
}) => {
  return (
    <div className="w-full h-full p-4 bg-white rounded-[20px] border border-gray-200 shadow-cookie flex flex-col gap-4 justify-between transition-transform sm:hover:scale-[1.01]">
      {/* Image */}
      <div className="relative w-full aspect-square sm:h-[280px]">
        <Image
          src={image}
          alt={alt || title}
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
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 text-left justify-between flex-1">
        <p className="text-button text-title font-medium">{title}</p>

        {children}

        {/* Price + Action */}
        <div className="mt-auto flex justify-between items-end">
          <div>
            <p className="text-text pb-3">Price</p>
            <p className="font-medium">{priceLabel}</p>
          </div>

          {action || (
            <span
              aria-hidden="true"
              className="group flex items-center justify-center rounded-full transition-colors"
            >
              <BestSellersBuyIcon
                size={60}
                bgColor="group-hover:fill-secondary1 group-active:fill-title fill-[#8FE3D9]"
                textColor="group-hover:fill-title group-active:fill-white fill-[#46494C]"
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseProductCard;
