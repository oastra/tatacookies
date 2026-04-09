const QuantitySelector = ({ qty, onChange, max = 99 }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(1, qty - 1))}
        disabled={qty <= 1}
        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-medium text-text hover:border-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="w-8 text-center text-base font-medium text-text">
        {qty}
      </span>
      <button
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty >= max}
        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-lg font-medium text-text hover:border-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
