// @flow

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('analytics', () => {
  defineTest(__dirname, 'index', null, 'AddsCorrectImports');
  defineTest(__dirname, 'index', null, 'NoDuplicateImportStatements');
  defineTest(__dirname, 'index', null, 'NoDuplicateImportSpecifiers');
  defineTest(__dirname, 'index', null, 'WrapsDefaultExportExpression');
  defineTest(__dirname, 'index', null, 'WrapsDefaultExportDeclaration');
  defineTest(__dirname, 'index', null, 'noDuplicateHocsBoth');
  defineTest(__dirname, 'index', null, 'noDuplicateHocsEvents');
});
