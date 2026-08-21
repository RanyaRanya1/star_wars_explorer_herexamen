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

let favorites = loadFavorites();
let allCharacters = [];

const renderCharacters = (characters) => {
  tableBody.innerHTML = "";

  characters.forEach((character) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${character.name}</td>
      <td>${character.height}</td>
      <td>${character.mass}</td>
      <td>${character.eyeColor}</td>
      <td>${character.birthYear}</td>
      <td>${character.gender}</td>
      <td>
        <button class="btn favorite-btn" data-name="${character.name}">
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
      alert(`
Naam: ${character.name}
Lengte: ${character.height} cm
Gewicht: ${character.mass} kg
Oogkleur: ${character.eyeColor}
Geboortejaar: ${character.birthYear}
Geslacht: ${character.gender}
      `);
    });
  });

  observeRows();
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

  const searchValue = searchInput.value.toLowerCase();
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

  renderCharacters(filteredCharacters);
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
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