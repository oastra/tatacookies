"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import BestSellersBuyIcon from "../icons/BestSellersBuyIcon";

const flowers = [
  { id: 1, toX: 20, toY: 28, fromX: -20, fromY: 120 },
  { id: 2, toX: -35, toY: -40, fromX: -50, fromY: -70 },
  { id: 3, toX: 105, toY: -55, fromX: 105, fromY: -79 },
  { id: 4, toX: 230, toY: -42, fromX: 250, fromY: -70 },
  { id: 5, toX: 160, toY: 35, fromX: 160, fromY: 70 },
];

const ButtonOrLink = ({
  href,
  target,
  rel,
  children,
  onClick,
  className = "",
  type = "button",
  buttonWidth = 293,
}) => {
  const [hovered, setHovered] = useState(false);
  const isLink = typeof href === "string";

  const commonStyles = clsx(
    "relative overflow-hidden flex items-center justify-center text-button rounded-full transition-all duration-300 active:bg-secondary transition-colors duration-200",
    className
  );

  const Inner = (
    <motion.div
      className={commonStyles}
      style={{ width: `${buttonWidth}px`, height: "64px" }}
      onClick={onClick}
      type={type}
    >
      {flowers.map(({ id, toX, toY, fromX, fromY }) => (
        <motion.div
          key={id}
          className="absolute left-0 top-0"
          initial={{ x: fromX, y: fromY, opacity: 0 }}
          animate={
            hovered
              ? { x: toX, y: toY, opacity: 1 }
              : { x: fromX, y: fromY, opacity: 1 }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <BestSellersBuyIcon
            size={80}
            bgColor="fill-secondary"
            textColor="fill-transparent"
          />
        </motion.div>
      ))}

      <div className="relative flex flex-row justify-center items-center z-10">
        {children}
      </div>
    </motion.div>
  );

  return (
    <div
      className="inline-block relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isLink ? (
        <Link href={href} passHref>
          {Inner}
        </Link>
      ) : (
        Inner
      )}
    </div>
  );
};

export default ButtonOrLink;
