export const AUTH_STORAGE_KEY = "user";

export const persistAuthSession = (authPayload) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const readAuthSession = () => {
  const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    clearAuthSession();
    return null;
  }
};
