import { useCart } from "@/context/CartContext";

export default function ProductCard({ id, title, price, image }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <img src={image} alt={title} className="w-full rounded-md" />
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-pink-600 font-bold">${price} AUD</p>
      <button
        onClick={() => addToCart({ id, title, price, image })}
        className="mt-2 bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
      >
        Add to Cart
      </button>
    </div>
  );
}
