import { fetchCharacters } from "./api.js";
import { Character } from "./characterClass.js";

const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");

const tableBody = document.querySelector("#characters-table-body");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const genderFilter = document.querySelector("#gender-filter");
const sortSelect = document.querySelector("#sort-select");

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
        <button class="btn favorite-btn">
          Favoriet
        </button>
      </td>
    `;

    tableBody.appendChild(row);
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

  loadingMessage.hidden = true;
};

initApp();