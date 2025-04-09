export const setLocalStorage = (key: string, data: string) => {
  return window.localStorage.setItem(key, data);
};

export const getLocalStorage = (key: string) => {
  return window.localStorage.getItem(key);
};
