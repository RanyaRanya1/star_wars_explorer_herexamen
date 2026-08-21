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


/* PERSONAGES TONEN */

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


    /* FAVORIET TOEVOEGEN */

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


    /* DETAILS TONEN */

    detailsButton.addEventListener("click", () => {
      characterDetails.innerHTML = `
        <h3>${character.name}</h3>

        <p><strong>Naam:</strong> ${character.name}</p>
        <p><strong>Lengte:</strong> ${character.height} cm</p>
        <p><strong>Gewicht:</strong> ${character.mass} kg</p>
        <p><strong>Oogkleur:</strong> ${character.eyeColor}</p>
        <p><strong>Geboortejaar:</strong> ${character.birthYear}</p>
        <p><strong>Geslacht:</strong> ${character.gender}</p>
        <p><strong>Haarkleur:</strong> ${character.hairColor}</p>
        <p><strong>Huidskleur:</strong> ${character.skinColor}</p>
        <p><strong>Aantal films:</strong> ${character.films.length}</p>
        <p><strong>Aantal voertuigen:</strong> ${character.vehicles.length}</p>
        <p><strong>Aantal ruimteschepen:</strong> ${character.starships.length}</p>

        <button id="close-details" class="btn">
          Sluiten
        </button>
      `;

      const closeButton = document.querySelector("#close-details");

      closeButton.addEventListener("click", () => {
        characterDetails.innerHTML = `
          <p>Klik op Details om meer informatie over een personage te bekijken.</p>
        `;
      });
    });
  });

  observeRows();
};


/* FAVORIETEN TONEN */

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


/* ANIMATIE */

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


/* ZOEKEN + FILTEREN + SORTEREN */

const updateCharacters = () => {
  let filteredCharacters = [...allCharacters];

  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedGender = genderFilter.value;


  /* ZOEKEN */

  if (searchValue !== "") {
    filteredCharacters = filteredCharacters.filter((character) => {
      return character.name.toLowerCase().includes(searchValue);
    });
  }


  /* FILTEREN */

  if (selectedGender !== "all") {
    filteredCharacters = filteredCharacters.filter((character) => {
      return character.gender === selectedGender;
    });
  }


  /* SORTEREN */

  if (sortSelect.value === "name-asc") {
    filteredCharacters.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  } else {
    filteredCharacters.sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
  }


  /* GEEN RESULTATEN */

  if (filteredCharacters.length === 0) {
    searchMessage.textContent = "Geen personages gevonden.";
    searchMessage.hidden = false;
  } else {
    searchMessage.hidden = true;
  }

  renderCharacters(filteredCharacters);
};


/* ZOEKFORMULIER */

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


/* FILTER */

genderFilter.addEventListener("change", () => {
  updateCharacters();
});


/* SORTEREN */

sortSelect.addEventListener("change", () => {
  updateCharacters();
});


/* THEMA */

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


/* APP STARTEN */

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