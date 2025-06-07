import Image from "next/image";

const FaqImage = () => {
  return (
    <div className="w-[227px] h-[366px] sm:w-[254px] sm:h-[370px] xl:w-[284px] xl:h-[416px] mx-auto shrink-0 -mt-[90px] sm:mt-0">
      <picture>
        <source
          srcSet="/images/faq-cat-desctop.webp"
          media="(min-width: 1024px)"
          type="image/webp"
        />
        <Image
          src="/images/faq-cat-tablet.webp"
          alt="Cute clay cat holding flowers representing FAQ support"
          width={284}
          height={416}
          className="w-full h-full object-contain"
          priority
        />
      </picture>
    </div>
  );
};

export default FaqImage;
