"use client";

import { useState } from "react";
import Image from "next/image";
import CloseRoundIcon from "../icons/CloseRoundIcon";

const BlogModal = ({ blogPosts, currentIndex, onClose }) => {
  const [index, setIndex] = useState(currentIndex);
  const currentPost = blogPosts?.[index];
  if (!currentPost) return null; // or a loading/error state
  const { date, title, post, image } = currentPost;

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const goNext = () => {
    if (index < blogPosts.length - 1) setIndex(index + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-8"
      onClick={onClose} // Close on backdrop click
    >
      <div
        className="bg-white rounded-[20px] w-full max-w-[800px] p-6 sm:p-8 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent close on content click
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-text hover:text-title"
          aria-label="Close Modal"
        >
          <CloseRoundIcon />
        </button>

        {/* Image */}
        <div className="aspect-[4/3] relative mb-4 mt-4 rounded-[10px] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Date and Title */}
        <p className="text-text2 text-sm mb-1">{date}</p>
        <h2 className="text-title text-[24px] sm:text-[28px] font-semibold mb-4">
          {title}
        </h2>

        {/* Full Blog Content */}
        {Array.isArray(post) ? (
          post.map((paragraph, idx) => (
            <p key={idx} className="text-text text-base mb-3">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-text text-base">{post}</p>
        )}

        {/* Prev / Next Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className={`text-primary font-medium ${
              index === 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={goNext}
            disabled={index === blogPosts.length - 1}
            className={`text-primary font-medium ${
              index === blogPosts.length - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:underline"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
