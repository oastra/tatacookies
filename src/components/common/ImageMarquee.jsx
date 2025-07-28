"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import imagesByCategory from "@/data/galleryImagesByCategory";

const allImages = Object.values(imagesByCategory).flat();

const ImageMarquee = () => {
  return (
    <div className="overflow-hidden py-12 ">
      <motion.div
        className="flex gap-8 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 140,
        }}
      >
        {allImages.concat(allImages).map((src, i) => (
          <div
            key={i}
            className="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] flex-shrink-0 shadow-cookie rounded-[20px] "
          >
            <Image
              src={src}
              alt={`cookie-${i}`}
              fill
              sizes="200px"
              className="rounded-[20px]  object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ImageMarquee;
