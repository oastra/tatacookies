import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQty } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed top-0 right-0 w-80 bg-white shadow-lg h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-3"
            >
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p>
                  ${item.price} x {item.qty}
                </p>
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                  className="w-12 border rounded text-center"
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 ml-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <p className="font-bold text-lg">
              Subtotal: ${subtotal.toFixed(2)}
            </p>
            <button className="mt-2 w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
