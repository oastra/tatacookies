import Image from "next/image";

const FaqImage = () => {
  return (
    <div className="w-full max-w-[320px] lg:max-w-[360px] mx-auto">
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
          className="w-full h-auto object-contain"
          priority
        />
      </picture>
    </div>
  );
};

export default FaqImage;
