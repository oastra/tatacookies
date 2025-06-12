"use client";
import { useEffect, useState } from "react";
import Tabs from "../ui/Tabs";
import CookieGrid from "../ui/CookieGrid";

const GalleryDesktop = ({ categories, imagesByCategory }) => {
  const [activeTab, setActiveTab] = useState("");

  // Set default tab after component mounts
  useEffect(() => {
    if (categories?.length) {
      setActiveTab(categories[0]);
    }
  }, [categories]);

  // Don’t render until activeTab is defined
  if (!activeTab) return null;

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
