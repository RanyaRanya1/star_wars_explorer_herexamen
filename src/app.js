import { fetchCharacters } from "./api.js";
import { Character } from "./characterClass.js";
import { saveFavorites, loadFavorites } from "./storage.js";

const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");

const tableBody = document.querySelector("#characters-table-body");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const genderFilter = document.querySelector("#gender-filter");
const sortSelect = document.querySelector("#sort-select");

const favoritesList = document.querySelector("#favorites-list");
const themeToggle = document.querySelector("#theme-toggle");
const characterDetails = document.querySelector("#character-details");

const searchMessage = document.querySelector("#search-message");

let favorites = loadFavorites();
let allCharacters = [];

const renderCharacters = (characters) => {
  tableBody.innerHTML = "";

  characters.forEach((character) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${character.name}</td>
      <td>${character.gender}</td>
      <td>
        <button class="btn favorite-btn">
          Favoriet
        </button>

        <button class="btn details-btn">
          Details
        </button>
      </td>
    `;

    tableBody.appendChild(row);

    const favoriteButton = row.querySelector(".favorite-btn");
    const detailsButton = row.querySelector(".details-btn");

    favoriteButton.addEventListener("click", () => {
      const alreadyFavorite = favorites.some((favorite) => {
        return favorite.name === character.name;
      });

      if (!alreadyFavorite) {
        favorites.push(character);
        saveFavorites(favorites);
        renderFavorites();
      }
    });

    detailsButton.addEventListener("click", () => {
      characterDetails.innerHTML = `
        <h3>${character.name}</h3>
        <p>Lengte: ${character.height} cm</p>
        <p>Gewicht: ${character.mass} kg</p>
        <p>Oogkleur: ${character.eyeColor}</p>
        <p>Geboortejaar: ${character.birthYear}</p>
        <p>Geslacht: ${character.gender}</p>

        <button id="close-details" class="btn">
          Sluiten
        </button>
      `;

      const closeButton = document.querySelector("#close-details");

      closeButton.addEventListener("click", () => {
        characterDetails.innerHTML = `
          <p>Klik op Details om meer informatie te zien.</p>
        `;
      });
    });
  });

  observeRows();
};

const renderFavorites = () => {
  favoritesList.innerHTML = "";

  favorites.forEach((character) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
      ${character.name}
      <button class="remove-favorite">
        Verwijderen
      </button>
    `;

    const removeButton = listItem.querySelector(".remove-favorite");

    removeButton.addEventListener("click", () => {
      favorites = favorites.filter((favorite) => {
        return favorite.name !== character.name;
      });

      saveFavorites(favorites);
      renderFavorites();
    });

    favoritesList.appendChild(listItem);
  });
};

const observeRows = () => {
  const rows = document.querySelectorAll("#characters-table-body tr");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  rows.forEach((row) => {
    observer.observe(row);
  });
};

const updateCharacters = () => {
  let filteredCharacters = [...allCharacters];

const searchValue = searchInput.value.trim().toLowerCase();
  const selectedGender = genderFilter.value;

  if (searchValue !== "") {
    filteredCharacters = filteredCharacters.filter((character) => {
      return character.name.toLowerCase().includes(searchValue);
    });
  }

  if (selectedGender !== "all") {
    filteredCharacters = filteredCharacters.filter((character) => {
      return character.gender === selectedGender;
    });
  }

  if (sortSelect.value === "name-asc") {
    filteredCharacters.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  } else {
    filteredCharacters.sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
  }
if (filteredCharacters.length === 0) {
  searchMessage.textContent = "Geen personages gevonden.";
  searchMessage.hidden = false;
} else {
  searchMessage.hidden = true;
}
  renderCharacters(filteredCharacters);
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchValue = searchInput.value.trim();

  if (searchValue === "") {
    searchMessage.textContent = "Vul een naam in om te zoeken.";
    searchMessage.hidden = false;
    return;
  }

  searchMessage.hidden = true;
  updateCharacters();
});

genderFilter.addEventListener("change", () => {
  updateCharacters();
});

sortSelect.addEventListener("change", () => {
  updateCharacters();
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

const initApp = async () => {
  loadingMessage.hidden = false;
  errorMessage.hidden = true;

  const data = await fetchCharacters();

  if (data.length === 0) {
    loadingMessage.hidden = true;
    errorMessage.hidden = false;
    return;
  }

  allCharacters = data.map((character) => {
    return new Character(character);
  });

  renderCharacters(allCharacters);
  renderFavorites();

  loadingMessage.hidden = true;
};

initApp();