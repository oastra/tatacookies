const session = await stripe.checkout.sessions.create({
  line_items: cart.map((item) => ({
    price: item.id, // Stripe Price ID
    quantity: item.qty,
  })),
  mode: "payment",
  success_url: `${req.headers.origin}/success`,
  cancel_url: `${req.headers.origin}/cart`,
});
