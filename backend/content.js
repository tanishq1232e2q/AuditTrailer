const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'versions.json'); //using json file to store versions


function readVersions() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      
      fs.writeFileSync(FILE_PATH, '[]');
      return [];
    }
    console.error('Read error:', err);
    return [];
  }
}

// This write versions to JSON
function writeVersions(versions) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(versions, null, 2), 'utf8');
  } catch (err) {
    console.error('Write error:', err);
  }
}

module.exports = {
  getVersions: () => readVersions(),
  addVersion: (version) => {
    const versions = readVersions();
    versions.push(version);
    writeVersions(versions);
  },
  getLastText: () => {
    const versions = readVersions();
    return versions.length > 0 ? versions[versions.length - 1].newText : '';
  }
};