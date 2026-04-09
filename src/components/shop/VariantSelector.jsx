const VariantSelector = ({ variants, selectedVariantId, onSelect }) => {
  if (!variants || variants.length <= 1) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-base font-medium text-text">Size</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isSoldOut = variant.stock_count === 0;

          return (
            <button
              key={variant.id}
              onClick={() => !isSoldOut && onSelect(variant.id)}
              disabled={isSoldOut}
              className={`px-5 py-3 rounded-full text-sm font-medium transition border ${
                isSelected
                  ? "bg-primary border-primary text-text"
                  : isSoldOut
                    ? "bg-gray-100 border-gray-200 text-text60 cursor-not-allowed line-through"
                    : "bg-white border-gray-200 text-text hover:border-primary"
              }`}
            >
              {variant.name}
              {isSoldOut ? " - Sold Out" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
