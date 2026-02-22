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
    const res = await api.post<{ data: TData; errors?: any[] }>('/graphql', {
      query,
      variables,
      options,
    });

    const { data, errors } = res.data;

    if (errors) {
      const errorMessage = errors[0]?.message || 'Erreur GraphQL inconnue';
      throw new Error(errorMessage);
    }

    return data;
  };
};
