const ShopCategoryTabs = ({ categories, activeTab, onTabClick }) => (
  <div
    className="flex gap-2 mb-6 overflow-x-auto -mx-4 px-4 py-1"
    style={{
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      WebkitOverflowScrolling: "touch",
    }}
  >
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onTabClick(category)}
        className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition ${
          activeTab === category
            ? "bg-primary border-primary text-text"
            : "bg-white border-gray-200 text-text60 hover:border-gray-300"
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

export default ShopCategoryTabs;
