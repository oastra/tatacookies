"use client";

import Image from "next/image";
import SectionTitle from "./SectionTitle";

const FlexSection = ({
  id,
  title,
  paragraphs = [],
  imageSrc,
  imageAlt = "",
  isVideo = false,
  videoSrc = "",
  poster = "",
  reverse = false,
  bgColor = "bg-white",
  cta = null,
  mobileOrder = "default", // "default" | "imageLast" | "imageAfterTitle"
}) => {
  const renderMedia = () =>
    isVideo ? (
      <div className="rounded-[20px] overflow-hidden w-full lg:h-full">
        <video
          controls
          poster={poster}
          className="w-full h-auto lg:h-full object-cover rounded-[20px]"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    ) : (
      <div className="relative w-full aspect-[4/3] sm:aspect-video lg:h-full rounded-[20px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    );

  const isImageAfterTitle = mobileOrder === "imageAfterTitle";
  const isImageLast = mobileOrder === "imageLast";

  return (
    <section
      id={id}
      className={`${bgColor} w-full py-[70px] md:py-[100px] lg:py-[120px]`}
    >
      <div className="max-w-[1440px] mx-auto px-[22px] md:px-[32px] xl:px-[100px] flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Desktop image (only if not mobile-specific) */}
        <div
          className={`w-full min-h-[1px] lg:flex-1 ${
            reverse ? "lg:order-2" : "lg:order-1"
          } hidden lg:block`}
        >
          {renderMedia()}
        </div>

        {/* Text content + mobile image if applicable */}
        <div
          className={`w-full min-h-[1px] lg:flex-1 text-left ${
            reverse ? "lg:order-1" : "lg:order-2"
          } order-2`}
        >
          <SectionTitle className="text-center lg:text-left">
            {title}
          </SectionTitle>

          {/* Mobile image (conditionally placed) */}
          {(isImageAfterTitle || mobileOrder === "default") && (
            <div className="block lg:hidden my-6">{renderMedia()}</div>
          )}

          {/* Paragraphs */}
          {paragraphs.map((para, idx) => (
            <div key={idx} className="mb-4 last:mb-0">
              {typeof para === "string" ? (
                <p className="text-base text-h4 ">{para}</p>
              ) : (
                para
              )}
            </div>
          ))}

          {cta && <div className="mt-6">{cta}</div>}
        </div>
        {/* Image again if "imageLast" (mobile only) */}
        {isImageLast && (
          <div
            className={`w-full lg:w-1/2 ${
              reverse ? "lg:order-2" : "lg:order-1"
            } order-3 block lg:hidden`}
          >
            {renderMedia()}
          </div>
        )}
      </div>
    </section>
  );
};

export default FlexSection;
