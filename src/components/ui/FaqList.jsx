"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BestSellersBuyIcon from "../icons/BestSellersBuyIcon";
import ArrowDownSlantedIcon from "../icons/ArrowDownSlantedIcon";
import ArrowUpIcon from "../icons/ArrowUpIcon";

const FaqList = ({ faqs = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (idx) => {
    setActiveIndex(idx === activeIndex ? null : idx);
  };

  return (
    <div className="w-full lg:w-2/3 flex flex-col gap-6 bg-white px-4 py-6 rounded-[20px]">
      {faqs.map((item, idx) => {
        const isActive = idx === activeIndex;
        const number = `(0${idx + 1})`;

        return (
          <div
            key={idx}
            className="border-b last:border-b-0 border-gray-200 pb-3 group relative"
          >
            {/* Header Row */}
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <BestSellersBuyIcon
                  size={40}
                  bgColor="group-hover:fill-title group-active:fill-title fill-primary"
                />
                <div>
                  <p className="text-text text-h4">{item.question}</p>
                  {/* Preview answer line (visible when closed) */}
                  {!isActive && (
                    <p className="text-base text-text60 line-clamp-1 mt-3 pr-[8px]">
                      {item.answer}
                    </p>
                  )}
                </div>
              </div>

              {/* Number + Arrow toggle */}
              <div className="flex flex-col gap-4 items-end gap-1 shrink-0">
                <span className="text-small pr-2 text-text60">{number}</span>
                <button
                  onClick={() => toggle(idx)}
                  aria-expanded={isActive}
                  aria-controls={`faq-answer-${idx}`}
                  className="transition-colors group"
                >
                  <ArrowDownSlantedIcon
                    className={`text-primary transition-transform duration-300 group-hover:text-title group-active:text-title ${
                      isActive ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Expanded Answer */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  id={`faq-answer-${idx}`}
                  key={`answer-${idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden relative text-base text-text60 mt-3 pl-[56px] pr-[16px]"
                >
                  <p>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FaqList;
