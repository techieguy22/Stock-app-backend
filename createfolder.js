const fs = require('fs');

// Function to create a new folder with the provided name
function createFolder(name) {
  const folderPath = `./${name}`;

  // Check if the folder already exists
  if (!fs.existsSync(folderPath)) {
    // If not, create the folder
    fs.mkdirSync(folderPath);
    console.log(`${name} folder created successfully.`);
  } else {
    console.log(`${name} folder already exists.`);
  }
}

// Exporting the createFolder function using CommonJS module syntax
module.exports = createFolder;
