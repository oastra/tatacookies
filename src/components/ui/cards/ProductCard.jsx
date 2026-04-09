"use client";

import Link from "next/link";
import BestSellersBuyIcon from "@/components/icons/BestSellersBuyIcon";
import BaseProductCard from "./BaseProductCard";

const ProductCard = ({ image, title, price, slug }) => {
  return (
    <BaseProductCard
      image={image}
      alt={title}
      title={title}
      priceLabel={`$${price} AUD`}
      action={
        <Link
          href={slug ? `/shop/${slug}` : "/shop"}
          aria-label={`View ${title}`}
          className="group flex items-center justify-center rounded-full transition-colors"
        >
          <BestSellersBuyIcon
            size={60}
            bgColor="group-hover:fill-secondary1 group-active:fill-title fill-[#8FE3D9]"
            textColor="group-hover:fill-title group-active:fill-white fill-[#46494C]"
          />
        </Link>
      }
    />
  );
};

export default ProductCard;
