export class Character {
  constructor(character) {
    this.name = character.name;
    this.height = character.height;
    this.mass = character.mass;
    this.eyeColor = character.eye_color;
    this.birthYear = character.birth_year;
    this.gender = character.gender;

    this.hairColor = character.hair_color;
    this.skinColor = character.skin_color;

    this.films = character.films;
    this.vehicles = character.vehicles;
    this.starships = character.starships;
  }
}