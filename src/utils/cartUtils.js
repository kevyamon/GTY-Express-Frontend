export const updateCart = (state) => {
  // 1. Calculer le prix des articles (le sous-total avant toute réduction)
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // 2. Initialiser le prix total avec le prix des articles
  let totalPrice = state.itemsPrice;
  
  // --- NOUVEAU : LOGIQUE DU COUPON ---
  if (state.coupon && state.coupon.code) {
    let discountAmount = 0;
    if (state.coupon.discountType === 'percentage') {
      // Calculer la réduction en pourcentage
      discountAmount = (state.itemsPrice * state.coupon.discountValue) / 100;
    } else {
      // La réduction est un montant fixe
      discountAmount = state.coupon.discountValue;
    }

    // Appliquer la réduction
    totalPrice -= discountAmount;

    // Stocker les détails pour le récapitulatif de la commande
    state.coupon.discountAmountApplied = discountAmount;
    state.coupon.priceBeforeDiscount = state.itemsPrice;
  }
  // --- FIN DE L'AJOUT ---

  // S'assurer que le total ne soit jamais négatif
  totalPrice = Math.max(totalPrice, 0);
  
  // 3. Calculer les autres frais (actuellement à 0, mais la logique est là)
  state.shippingPrice = 0;
  state.taxPrice = 0;

  // 4. Calculer le prix final
  state.totalPrice = totalPrice + state.shippingPrice + state.taxPrice;

  // 5. Sauvegarder dans le localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};