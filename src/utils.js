const path = require(`path`);
const fse = require(`fs-extra`);
const { constants } = require(`./config`);

function getRootPath() {
  return path.resolve(__dirname, `./..`);
}

function getPackageVersion() {
  const {version} = require(path.join(getRootPath(), `package.json`));
  return version;
}

function logPackageVersion() {
  const msg = `zero-cli version: ${getPackageVersion()}`;
  console.log();
  console.log(msg);
  console.log();
}
exports.logPackageVersion = logPackageVersion;

function getDirFileName(dir) {
  try {
    const files = fse.readdirSync(dir);
    const filesToCopy = [];
    files.forEach(file => {
      if (file.indexOf(constants.INJECT_FILES) > -1) {return;}
      filesToCopy.push(file);
    });
    return filesToCopy;
  } catch (e) {
    return [];
  }
}
exports.getDirFileName = getDirFileName;
