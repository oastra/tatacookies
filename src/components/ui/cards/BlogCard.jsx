"use client";

import { useState } from "react";
import Image from "next/image";
import BlogModal from "../../modals/BlogModal";
const BlogCard = ({ date, title, post, image, allPosts, index }) => {
  const [showModal, setShowModal] = useState(false);

  // Combine array of paragraphs into one string for preview
  const content = Array.isArray(post) ? post.join(" ") : post;

  return (
    <>
      <div
        className="bg-white rounded-[20px] shadow-cookie overflow-hidden max-w-[396px] w-full cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="aspect-[4/3] relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col gap-3 px-4 py-4 sm:p-6">
          <p className="text-text2 text-small mb-1">{date}</p>
          <h3 className="text-title text-button font-medium mb-2">{title}</h3>
          <p className="text-text text-base line-clamp-3">{content}</p>
        </div>
      </div>

      {showModal && (
        <BlogModal
          blogPosts={allPosts} // Pass the full array of blog posts here
          currentIndex={index} // Pass the index of the clicked card
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default BlogCard;
