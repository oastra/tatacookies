// src/components/common/FlexSection.jsx
"use client";

import Image from "next/image";
import SectionTitle from "./SectionTitle";
import Container from "@/components/common/Container";

export default function FlexSection({
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
  imgClassName = "",
  mobileOrder = "default",
  priority = false,
}) {
  const renderMedia = () =>
    isVideo ? (
      <div className="rounded-[20px] overflow-hidden w-full lg:h-full">
        <video
          controls
          poster={poster}
          preload="metadata"
          className="w-full h-auto lg:h-full object-cover rounded-[20px]"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    ) : (
      <div className="relative w-full aspect-[4/3] sm:aspect-video lg:h-full rounded-[20px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={imgClassName}
          sizes="(min-width:1024px) 50vw, 100vw"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          priority={priority}
        />
      </div>
    );

  const isImageAfterTitle = mobileOrder === "imageAfterTitle";
  const isImageLast = mobileOrder === "imageLast";

  return (
    <section
      id={id}
      className={`${bgColor} w-full py-[70px] md:py-[100px] xl:py-[120px]`}
    >
      <Container className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div
          className={`w-full min-h-[1px] lg:flex-1 ${reverse ? "lg:order-2" : "lg:order-1"} hidden lg:block`}
        >
          {renderMedia()}
        </div>

        <div
          className={`w-full min-h-[1px] lg:flex-1 text-left ${reverse ? "lg:order-1" : "lg:order-2"} order-2`}
        >
          <SectionTitle className="text-center lg:text-left">
            {title}
          </SectionTitle>

          {(isImageAfterTitle || mobileOrder === "default") && (
            <div className="block lg:hidden my-6">{renderMedia()}</div>
          )}

          {paragraphs.map((para, idx) => (
            <div key={idx} className="mb-4 last:mb-0">
              {typeof para === "string" ? (
                <p className="text-base text-h4">{para}</p>
              ) : (
                para
              )}
            </div>
          ))}

          {cta && <div className="mt-6">{cta}</div>}
        </div>

        {isImageLast && (
          <div
            className={`w-full ${reverse ? "lg:order-2" : "lg:order-1"} order-3 block lg:hidden`}
          >
            {renderMedia()}
          </div>
        )}
      </Container>
    </section>
  );
}
