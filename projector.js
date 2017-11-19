// @flow

const chalk = require('chalk');
const release = require('./build/releases/release');
const changeset = require('./build/releases/changeset');
const karma = require('projector-karma');
const {
  getKarmaConfig,
  getPackagesWithKarmaTests,
} = require('./build/karma-config');
const { getChangedPackages } = require('./build/utils/packages');

exports.changeset = async () => {
  await changeset.run();
};

exports.release = async () => {
  await release.run({ cwd: __dirname });
};

const runKarma = async ({ watch, browserstack }) => {
  const config = await getKarmaConfig({
    cwd: process.cwd(),
    watch,
    browserstack,
  });
  await karma.run({ config, files: [] });
};

exports.testBrowser = async (
  { watch, browserstack } /*: { watch: boolean, browserstack: boolean }*/,
) => {
  await runKarma({ watch, browserstack });
};

exports.testBrowserCI = async (
  { watch, browserstack } /*: { watch: boolean, browserstack: boolean }*/,
) => {
  const changedPackages = await getChangedPackages();
  const packagesWithKarmaTests = await getPackagesWithKarmaTests();
  const changedPackagesWithKarmaTests = packagesWithKarmaTests.filter(
    pkg => changedPackages.indexOf(pkg) !== -1,
  );

  if (!changedPackagesWithKarmaTests.length) {
    // eslint-disable-next-line
    console.log(
      chalk.blue(
        'Skip karma – none of the changed packages has karma tests...',
      ),
    );
  } else {
    await runKarma({ watch, browserstack });
  }
};
