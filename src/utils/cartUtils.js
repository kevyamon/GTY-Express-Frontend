export const updateCart = (state) => {
  // Calculer le prix des articles
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Calculer les frais de port (Ex: Gratuit si > 10000 FCFA, sinon 1000 FCFA)
  state.shippingPrice = state.itemsPrice > 10000 ? 0 : 1000;

  // Calculer les taxes (Ex: 18%)
  state.taxPrice = 0.18 * state.itemsPrice;

  // Calculer le prix total
  state.totalPrice =
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice);

  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};