"use client";

import { motion } from "framer-motion";
import StarIcon from "../icons/StarIcon";

const DecorativeStars = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute left-[62px] top-[363px] z-0"
      >
        <StarIcon size={60} color="#F9BEFE" />
      </motion.div>

      <motion.div
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute top-[69px] left-[4px] z-0"
      >
        <StarIcon size={40} color="#FDC8ED" />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute left-[102px] top-[0px] z-0"
      >
        <StarIcon size={40} color="#CDAEF5" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute left-[231px] top-[19px] z-0"
      >
        <StarIcon size={30} color="#EEC8FD" />
      </motion.div>

      <motion.div
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute left-[284px] top-[50px] sm:left-[444px] sm:top-[0px] z-0"
      >
        <StarIcon size={40} color="#FFC8CD" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="absolute left-[284px] top-[323px] z-0"
      >
        <StarIcon size={40} color="#CDAEF5" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute left-[210px] top-[363px] z-0"
      >
        <StarIcon size={20} color="#F9BEFE" />
      </motion.div>
    </div>
  );
};

export default DecorativeStars;
