import Tabs from "@/components/ui/Tabs";

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  const tabLabels = ["All", ...categories.map((c) => c.name)];

  const handleTabClick = (tabName) => {
    if (tabName === "All") {
      onCategoryChange(null);
    } else {
      const cat = categories.find((c) => c.name === tabName);
      onCategoryChange(cat?.slug || null);
    }
  };

  const activeTab = activeCategory
    ? categories.find((c) => c.slug === activeCategory)?.name || "All"
    : "All";

  return (
    <Tabs
      categories={tabLabels}
      activeTab={activeTab}
      onTabClick={handleTabClick}
    />
  );
};

export default CategoryFilter;
