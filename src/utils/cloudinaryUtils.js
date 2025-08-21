/**
 * Prend une URL d'image Cloudinary et y insère des paramètres d'optimisation.
 * Utilise q_auto pour la qualité et f_auto pour le format.
 * Exemple : 
 * '.../upload/v123/image.jpg' 
 * devient 
 * '.../upload/f_auto,q_auto/v123/image.jpg'
 * @param {string} url L'URL originale de l'image Cloudinary.
 * @returns {string} L'URL optimisée.
 */
export const getOptimizedUrl = (url) => {
  if (typeof url !== 'string' || !url.includes('cloudinary.com')) {
    // Si ce n'est pas une URL Cloudinary, on la retourne telle quelle.
    return url;
  }

  const parts = url.split('/upload/');
  
  if (parts.length !== 2) {
    // Si l'URL n'a pas le format attendu, on la retourne telle quelle.
    return url;
  }

  // On ajoute les transformations juste après '/upload/'
  const optimizedUrl = `${parts[0]}/upload/f_auto,q_auto/${parts[1]}`;
  
  return optimizedUrl;
};