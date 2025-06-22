// import { useState, useEffect } from "react";
// import SectionWrapper from "@/components/common/SectionWrapper";
// import SectionTitle from "@/components/common/SectionTitle";
// import ButtonOrLink from "@/components/ui/ButtonOrLink";
// import VectorIcon from "../icons/VectorIcon";

// useEffect(() => {
//   const updateCount = () => {
//     const width = window.innerWidth;
//     setCount(width < 1024 ? 4 : 8);
//   };

//   const fetchInstagram = async () => {
//     try {
//       const res = await fetch("/api/instagram");
//       const json = await res.json();
//       setPosts(json.data || []);
//     } catch (err) {
//       console.error("Failed to load Instagram feed", err);
//     }
//   };

//   updateCount();
//   fetchInstagram();
//   window.addEventListener("resize", updateCount);
//   return () => window.removeEventListener("resize", updateCount);
// }, []);

// const InstagramSection = () => {
//   const [count, setCount] = useState(8);

//   useEffect(() => {
//     const updateCount = () => {
//       const width = window.innerWidth;
//       if (width < 1024) {
//         setCount(4); // Mobile + Tablet
//       } else {
//         setCount(8); // Desktop
//       }
//     };

//     updateCount();
//     window.addEventListener("resize", updateCount);
//     return () => window.removeEventListener("resize", updateCount);
//   }, []);

//   return (
//     <SectionWrapper id="instagram">
//       <SectionTitle className="text-center text-title mb-[32px] lg:mb-[40px]">
//         We’re on Instagram
//       </SectionTitle>

//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-[32px] lg:mb-[40px] mx-auto">
//         {posts.slice(0, count).map((post, index) => (
//           <a
//             key={post.id}
//             href={post.permalink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="overflow-hidden rounded-[16px] aspect-square block"
//           >
//             <img
//               src={post.media_url}
//               alt={`Instagram post ${index + 1}`}
//               className="w-full h-full object-cover"
//               loading="lazy"
//             />
//           </a>
//         ))}
//       </div>

//       <div className="text-center">
//         <ButtonOrLink
//           isLink
//           href="https://instagram.com/tatacookies.au"
//           target="_blank"
//           className="w-[280px] mx-auto bg-primary text-text"
//         >
//           Follow Us <VectorIcon className="ml-2" />
//         </ButtonOrLink>
//       </div>
//     </SectionWrapper>
//   );
// };

// export default InstagramSection;
