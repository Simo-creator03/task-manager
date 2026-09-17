/**
 * VALIDATION DES CHAMPS DU FORMULAIRE
 *
 * Ces règles sont volontairement IDENTIQUES à celles du backend
 * (fichier Constants.java). Le front les utilise pour donner un retour
 * immédiat à l'utilisateur ; le backend reste la seule source de vérité
 * (il revalide de toute façon).
 */

/** Format d'un email valide : quelque chose@domaine.extension. */
export const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

/**
 * Numéro de téléphone camerounais :
 *   - commence par 6 ;
 *   - puis un préfixe valide (50 à 59, 70 à 79, 80 à 83, 90 à 99) ;
 *   - puis 6 chiffres.
 * Le préfixe international 237 ou +237 est facultatif.
 */
export const CAMEROON_CONTACT_PATTERN =
  /^(\+?237)?6((50|51|52|53|54)|(55|56|57|58|590|591|592|593|594|595)|(70|71|72|73|74|75|76|77|78|79)|(80|81|82|83)|(90|91|92|93|94|95|96|97|98|99))\d{6}$/;

/** Vrai si la chaîne est un email valide. */
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

/** Vrai si la chaîne est un numéro camerounais valide (ex. 670000000, +237670000000). */
export function isValidCameroonPhone(value: string): boolean {
  return CAMEROON_CONTACT_PATTERN.test(value);
}
