"use client";

import Image from "next/image";
import Link from "next/link";
import BestSellersBuyIcon from "@/components/icons/BestSellersBuyIcon";

const ProductCard = ({ image, title, price }) => {
  return (
    <div className="w-full h-full p-4 bg-white rounded-[20px] border border-gray-200 shadow-cookie flex flex-col gap-4 justify-between transition-transform sm:hover:scale-[1.01]">
      {/* Image Section */}
      <div className="relative w-full aspect-square sm:h-[280px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-[20px]"
          sizes="(max-width: 768px) 100vw, 280px"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4 text-left justify-between flex-1">
        {/* Title */}
        <p className="text-button text-title font-medium">{title}</p>

        {/* Price + Buy Icon */}
        <div className="mt-auto flex justify-between items-end">
          <div>
            <p className="text-text pb-3">Price</p>
            <p className="font-medium">${price} AUD</p>
          </div>

          <Link
            href="/shop"
            aria-label="Go to shop"
            className="group flex items-center justify-center rounded-full transition-colors"
          >
            <BestSellersBuyIcon
              size={60}
              bgColor="group-hover:fill-secondary1 group-active:fill-title fill-[#8FE3D9]"
              textColor="group-hover:fill-title group-active:fill-white fill-[#46494C]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
