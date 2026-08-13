import { fetchCharacters } from "./api.js";
import { Character } from "./characterClass.js";

const tableBody = document.querySelector("#characters-table-body");

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

const initApp = async () => {
  const data = await fetchCharacters();

  const characters = data.map(
    (character) => new Character(character)
  );

  renderCharacters(characters);
};

initApp();