import Image from "next/image";

const BlogCard = ({ date, title, post, image }) => (
  <div className="bg-white rounded-[20px] shadow-cookie overflow-hidden max-w-[396px] w-full">
    <div className="aspect-[4/3] relative">
      <Image src={image} alt={title} fill className="object-cover" />
    </div>
    <div className="flex flex-col gap-3 px-4 py-4 sm:p-6">
      <p className="text-text2 text-small mb-1">{date}</p>
      <h3 className="text-title text-button font-medium mb-2">{title}</h3>
      <p className="text-text text-base line-clamp-3">{post}</p>
    </div>
  </div>
);

export default BlogCard;
