"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Tabs from "../ui/Tabs";

const CookieSwiper = dynamic(() => import("../ui/CookieSwiper"), {
  ssr: false,
});

const GalleryMobile = ({ categories, imagesByCategory }) => {
  const [activeTab, setActiveTab] = useState(categories[0]);

  return (
    <div className="lg:hidden">
      <Tabs
        categories={categories}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <CookieSwiper images={imagesByCategory[activeTab]} category={activeTab} />
    </div>
  );
};

export default GalleryMobile;
