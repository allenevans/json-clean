const filterChar = require('./filterCharacter');
const fs = require('fs');

/**
 * Clean a json file.
 * @param {string} fileToProcess File path for the file to be cleaned.
 * @param {string?} encoding File encoding format. Default = 'utf-8'.
 * @param {number} indent Indent the json output. Default = 2, min = 0, max = 10.
 * @param {Array<string>?} exclude  Exclude only these characters from the json file.
 * @param {boolean} check Do not write results to file.
 */
const processFile = (fileToProcess, encoding = 'utf-8', indent = 2, exclude, check) => {
  encoding = encoding || 'utf-8';

  const inputJson = fs.readFileSync(fileToProcess, encoding);

  const filteredJson = inputJson.split('').map(character => filterChar(character, exclude)).join('');

  const parsedJson = JSON.parse(filteredJson);

  if (!check) {
    fs.writeFileSync(fileToProcess, JSON.stringify(parsedJson, null, indent), encoding);
  }
};

module.exports = processFile;
