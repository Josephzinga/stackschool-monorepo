import { api } from '@stackschool/shared';

/**
 * Fetcher personnalisé pour React Query Codegen.
 * Utilise l'instance Axios configurée (avec intercepteurs auth).
 */

export const fetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit['headers'],
) => {
  return async (): Promise<TData> => {
    try {
      const res = await api.post<{ data: TData; errors?: any[] }>('/graphql', {
        query,
        variables,
        options,
      });

      const { data, errors } = res.data;

      if (errors && errors.length > 0) {
        const errorMessage = errors[0]?.message || 'Erreur GraphQL inconnue';
        // On peut aussi attacher les détails de l'erreur
        const error = new Error(errorMessage);
        (error as any).graphQLErrors = errors;
        throw error;
      }

      return data;
    } catch (error: any) {
      // Gestion des erreurs Axios (Réseau, 4xx, 5xx)
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        const serverError = error.response.data?.errors?.[0]?.message || error.response.statusText;
        throw new Error(serverError);
      }
      // Erreur JS ou Réseau pure
      throw error;
    }
  };
};
