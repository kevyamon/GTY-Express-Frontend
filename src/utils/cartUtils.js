export const updateCart = (state) => {
  // Calculer le prix des articles
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Mettre les frais de livraison à 0
  state.shippingPrice = 0;

  // Mettre les taxes à 0
  state.taxPrice = 0;

  // Le total est maintenant juste le prix des articles
  state.totalPrice = state.itemsPrice; 

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};