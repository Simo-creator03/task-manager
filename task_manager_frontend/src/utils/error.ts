/**
 * UTILITAIRE DE GESTION DES ERREURS
 *
 * En TypeScript, une erreur attrapée avec "catch" est de type inconnu
 * (unknown) : on ne sait pas si c'est une Error, une string, etc.
 * Cette fonction la transforme toujours en message affichable.
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Une erreur est survenue';
}
