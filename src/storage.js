export const saveFavorites = (favorites) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

export const loadFavorites = () => {
  const savedFavorites = localStorage.getItem("favorites");

  if (savedFavorites) {
    return JSON.parse(savedFavorites);
  }

  return [];
};