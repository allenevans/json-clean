/**
 * The default list of character codes to be removed from a JSON file.
 * @type {number[]}
 */
const filteredCharacters = [
  0x00,
  0xFEFF,
  0xFFFD,
  0xFFFE,
  0xFFFF
];

/**
 *
 * @param {string} inputCharacter single character to be filtered
 * @param {Array<string>} exclude Optional array of characters to be removed, else use defaults.
 * @returns {string} Either an empty string if the character should be excluded, or the character.
 */
const filterCharacter = (inputCharacter, exclude) => {
  exclude = exclude || [];

  return (
    filteredCharacters.concat(exclude).indexOf(inputCharacter.toString().charCodeAt(0)) >= 0
  ) ? '' : inputCharacter;
};

module.exports = filterCharacter;
