"use client";
import SectionWrapper from "@/components/common/SectionWrapper";
import SectionTitle from "@/components/common/SectionTitle";
import BlogCard from "../ui/cards/BlogCard";
import blogPosts from "@/data/blogPosts";

const BlogSection = () => {
  return (
    <SectionWrapper id="blog" bg="bg-bgPink">
      <SectionTitle className="text-center text-title mb-[32px] lg:mb-[40px]">
        Latest news & article
      </SectionTitle>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
        {blogPosts.map((post, i) => (
          <BlogCard
            key={i}
            {...post} // date, title, post, image
            allPosts={blogPosts} // Pass full array
            index={i} // Pass current index
          />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default BlogSection;
