#!/usr/bin/env node --harmony

const fs = require('fs');
const glob = require('glob');
const packageJson = require('./package.json');
const path = require('path');
const clean = require('./json-clean');
const program = require('commander');
require('colors');

program
  .version(packageJson.version)
  .description(packageJson.description)
  .usage('[options] <file ...>')
  .option('-e, --on-error-resume-next', 'continue whenever an error is encountered')
  .option('-r, --remove [value]', 'remove only these characters e.g. [0xFFFD, 0xFFFE]')
  .option('-s, --silent', 'suppress command line output')
  .option('-y, --encoding', `file format encoding. Default = 'utf-8'`)
  .option('-c, --check', `do a dry run without changing any files`)
  .option('-i, --indent <n>', `a Number that's used to insert white space into the output JSON string for readability purposes. 
      Default = 2, Max = 10.`, parseInt)
  .parse(process.argv);

let errorCount = 0;

if (program.silent) {
  const silenceConsoleMethods = ['error', 'log', 'warn'];
  silenceConsoleMethods.forEach(method => console[method] = () => void(0));
}

/**
 * Parse the given argument value for an array of characters that should be removed from the json file.
 * @param {string} argValue
 * @returns {Array<string>}
 */
const parseRemoveChars = (argValue) => {
  if (!argValue) {
    return undefined;
  }

  if (!argValue.match(/^\[[0-9a-fx,\s]+]$/i)) {
    console.error('Invalid format for argument --remove'.red);
    process.exit(1);
  }

  const parsed = eval(argValue);

  return Array.isArray(parsed) ? parsed : [parsed];
};

const customRemoveChars = parseRemoveChars(program.remove);

if (Array.isArray(program.args)) {
  program.args.forEach(arg => {
    glob(arg, {}, (err, files) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }
      files.forEach((fileToProcess) => {
        try {
          clean(fileToProcess, program.encoding, program.indent, customRemoveChars, program.check);
          console.log(`[${'✔︎'.green}] ${fileToProcess}`);
        } catch (x) {
          console.error(`[${'✘'.red}] ${fileToProcess.red}`);
          console.error(`    ${x.message.split(/\n|\r/)[0].red}`.red);
          if (!program.onErrorResumeNext) {
            process.exit(1);
          } else {
            errorCount += 1;
          }
        }
      });
    });
  });
}

process.on('exit', (exitCode) => {
  if (program.check) {
    console.log(`\n[${'❋'.yellow}] ${'No files changed. --check option specified'.yellow}`);
  }

  if (!exitCode && errorCount) {
    console.log(`\n[${'✘'.red}] ${'FAIL'.red}\n`);
    process.exit(1);
  }
  console.log(`\n[${'✔'.green}] ${'OK'.green}\n`);
});
