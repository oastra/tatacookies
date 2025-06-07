"use client";
import { useState } from "react";
import Tabs from "../ui/Tabs";
import CookieGrid from "../ui/CookieGrid";

const GalleryDesktop = ({ categories, imagesByCategory }) => {
  const [activeTab, setActiveTab] = useState(categories[0]);

  return (
    <div className="hidden lg:block">
      <Tabs
        categories={categories}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <CookieGrid images={imagesByCategory[activeTab]} category={activeTab} />
    </div>
  );
};

export default GalleryDesktop;
