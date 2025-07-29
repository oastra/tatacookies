"use client";

import ButtonOrLink from "@/components/ui/ButtonOrLink";
import VectorIcon from "@/components/icons/VectorIcon";
import BestSellersBuyIcon from "@/components/icons/BestSellersBuyIcon";

export default function SuccessLayout({
  title,
  message,
  buttonText,
  buttonHref,
  iconColor = "fill-primary",
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgPink">
      <div className="bg-white rounded-xl shadow-cookie p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold text-title mb-4">
          {title}
          <span className="inline-block text-center mx-2 align-middle">
            <BestSellersBuyIcon
              size={34}
              bgColor={iconColor}
              textColor="fill-transparent"
            />
          </span>
        </h1>
        <p className="text-text mb-6">{message}</p>

        <ButtonOrLink
          isLink
          href={buttonHref}
          animated={false}
          className="bg-primary mx-auto text-text w-full sm:w-fit flex items-center justify-center gap-2 mt-10"
        >
          {buttonText}
          <VectorIcon className="inline-block align-middle pl-2" />
        </ButtonOrLink>
      </div>
    </div>
  );
}
