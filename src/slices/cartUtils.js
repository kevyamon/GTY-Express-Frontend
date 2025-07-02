export const updateCart = (state) => {
  // Calculer le prix des articles
  state.itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Sauvegarder le panier dans le localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
