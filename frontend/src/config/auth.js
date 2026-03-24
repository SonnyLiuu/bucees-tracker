export const getAuthHeaders = (user, headers = {}) => {
  const token = user?.token;

  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
