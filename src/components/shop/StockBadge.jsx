const StockBadge = ({ stockCount }) => {
  if (stockCount === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Sold Out
      </span>
    );
  }

  if (stockCount <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Only {stockCount} left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
      <span className="w-2 h-2 rounded-full bg-green-500" />
      In Stock
    </span>
  );
};

export default StockBadge;
