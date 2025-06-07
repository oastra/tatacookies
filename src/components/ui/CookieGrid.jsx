import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const CookieGrid = ({ images, category }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={category}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hidden lg:grid gap-6 lg:grid-cols-6"
    >
      {images.map((src, i) => {
        const isTopRow = i < 2;
        return (
          <motion.div
            key={`${category}-${i}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-[20px] h-[376px] ${
              isTopRow ? "lg:col-span-3" : "lg:col-span-2"
            }`}
          >
            <Image
              src={src}
              alt={`${category} cookie ${i + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        );
      })}
    </motion.div>
  </AnimatePresence>
);

export default CookieGrid;
