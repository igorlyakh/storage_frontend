export const usernameSelector = state => state.user.username;
export const tokenSelector = state => state.user.accessToken;

export const isGlobalLoading = state => {
  const hasActiveMutation = Object.values(state.api.mutations).some(
    mutation => mutation?.status === 'pending',
  );

  const hasActiveQueries = Object.values(state.api.queries).some(
    query => query?.status === 'pending',
  );

  return hasActiveMutation || hasActiveQueries;
};
