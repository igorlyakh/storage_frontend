export const usernameSelector = state => state.user.username;
export const tokenSelector = state => state.user.accessToken;
export const userRoleSelector = state => state.user.role;
export const isLoginSelector = state => state.user.isLogin;
export const adminScopesSelector = state => state.user.adminScopes;
export const lowStockCheckTokenSelector = state => state.user.lowStockCheckToken;

export const isGlobalLoading = state => {
  const hasActiveMutation = Object.values(state.api.mutations).some(
    mutation => mutation?.status === 'pending',
  );

  const hasActiveQueries = Object.values(state.api.queries).some(
    query => query?.status === 'pending',
  );

  return hasActiveMutation || hasActiveQueries;
};
