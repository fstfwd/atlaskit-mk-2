// @flow
const spawn = require('projector-spawn');
const jest = require('projector-jest');
const ts = require('projector-typescript');
const path = require('path');

const component = name => path.join(__dirname, 'components', name);
const buildTSComponent = async (name) => {
  const package = component(name);

  // ES5
  await ts.compile({ cwd: package });

  // ES2015
  await ts.compile({
    cwd: package,
    compilerOptions: {
      module: 'es2015',
      outDir: './dist/es2015'
    }
  });
};

exports.build = async () => {
  await spawn('babel', ['src', '-d', 'dist/cjs'], {
    cwd: component('badge'),
  });

  await spawn('babel', ['src', '-d', 'dist/cjs'], {
    cwd: path.join(__dirname, 'utils', 'docs'),
  });

  await buildTSComponent('code');
};

exports.test = async () => {
  await jest.test({
    rootDir: __dirname,

    transform: JSON.stringify({
      '^.+\\.tsx?$': 'ts-jest/preprocessor',
      '^.+\\.jsx?$': 'babel-jest'
    }),

    globals: JSON.stringify({
      'ts-jest': {
        tsConfigFile: path.join(__dirname, 'tsconfig.base.json'),
        // we can safely disable babel for perf improvements since we don't use synthetic imports
        // @see https://github.com/kulshekhar/ts-jest#supports-synthetic-modules
        skipBabel: true,
      }
    }),

    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(tsx?|jsx?)$',

    moduleFileExtensions: [
      "js",
      "jsx",
      "ts",
      "tsx",
    ]
  });
};
