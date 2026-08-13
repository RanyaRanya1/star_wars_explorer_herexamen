const API_URL = "https://swapi.info/api/people";

export const fetchCharacters = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Impossible de récupérer les personnages.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Erreur API :", error);
    return [];
  }
};