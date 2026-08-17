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
          ⭐ Favori
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
};

const searchCharacters = () => {
  const searchValue = searchInput.value.toLowerCase();

  const filteredCharacters = allCharacters.filter((character) => {
    return character.name.toLowerCase().includes(searchValue);
  });

  renderCharacters(filteredCharacters);
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchCharacters();
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

  allCharacters = data.map(
    (character) => new Character(character)
  );

  renderCharacters(allCharacters);

  loadingMessage.hidden = true;
};
initApp();

genderFilter.addEventListener("change", () => {
  const selectedGender = genderFilter.value;

  if (selectedGender === "all") {
    renderCharacters(allCharacters);
    return;
  }

  const filteredCharacters = allCharacters.filter((character) => {
    return character.gender === selectedGender;
  });

  renderCharacters(filteredCharacters);
});

sortSelect.addEventListener("change", () => {
  const sortedCharacters = [...allCharacters];

  if (sortSelect.value === "name-asc") {
    sortedCharacters.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  } else {
    sortedCharacters.sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
  }

  renderCharacters(sortedCharacters);
});