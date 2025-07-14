"use client";

import ButtonOrLink from "@/components/ui/ButtonOrLink";
import VectorIcon from "@/components/icons/VectorIcon";
import BestSellersBuyIcon from "@/components/icons/BestSellersBuyIcon";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Thank you
          <span className="inline-block text-center mx-2 align-middle">
            <BestSellersBuyIcon
              size={34}
              bgColor="fill-secondary"
              textColor="fill-transparent"
            />
          </span>
          for your order!
        </h1>
        <p className="text-gray-600 mb-6">
          We’ve received your gingerbread cookie order. Our team will contact
          you soon to confirm the details and delivery.
        </p>
        <div className="mt-[40px] ">
          <ButtonOrLink
            isLink
            href="/shop"
            animated={false}
            className="bg-primary mx-auto text-text w-full sm:w-fit"
          >
            Back To Shop <VectorIcon className="ml-4" />
          </ButtonOrLink>
        </div>
      </div>
    </div>
  );
}
// This page is a simple success message after an order is placed.
