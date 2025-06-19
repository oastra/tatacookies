"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import imagesByCategory from "@/data/galleryImagesByCategory";
import Tabs from "../ui/Tabs";

const CookieSwiper = dynamic(() => import("../ui/CookieSwiper"), {
  ssr: false,
});

const GalleryMobile = () => {
  const categories = Object.keys(imagesByCategory);
  const [activeTab, setActiveTab] = useState(categories[0]);

  return (
    <div className="lg:hidden">
      <Tabs
        categories={categories}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <CookieSwiper
        key={activeTab}
        images={imagesByCategory[activeTab]}
        category={activeTab}
      />
    </div>
  );
};

export default GalleryMobile;
