const Tabs = ({ categories, activeTab, onTabClick }) => (
  <div className="flex flex-wrap justify-center gap-1 lg:gap-4 mb-10 ">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onTabClick(category)}
        className={`px-[18px] py-4 sm:pb-2 text-base  hover:text-title font-medium lg:px-8 transition ${
          activeTab === category
            ? "text-title bg-bg rounded-full sm:bg-white sm:underline underline-offset-[8px]"
            : "text-text60 sm:underline underline-offset-[8px]"
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

export default Tabs;
