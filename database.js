const fs = require('fs').promises;
const path = require('path');

const dbFolderPath = './db/';

// Function to read the content of a file in the ./db/ folder asynchronously using promises
async function get(dbkey) {
  const filePath = path.join(dbFolderPath, dbkey);

  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    //console.error(`Error reading file ${dbkey}: ${error.message}`);
    return null;
  }
}

// Function to write content to a file in the ./db/ folder asynchronously using promises
async function set(dbkey, dbvalue) {
  const filePath = path.join(dbFolderPath, dbkey);

  try {
    await fs.writeFile(filePath, dbvalue);
    return 'Done';
  } catch (error) {
    console.error(`Error writing to file ${dbkey}: ${error.message}`);
    throw error;
  }
}

// Function to list all files in the ./db/ folder asynchronously using promises
async function list() {
  try {
    const files = await fs.readdir(dbFolderPath);
    return JSON.stringify(files);
  } catch (error) {
    console.error(`Error listing files in ${dbFolderPath}: ${error.message}`);
    throw error;
  }
}

// Function to delete a file from the ./db/ folder asynchronously using promises
async function remove(dbkey) {
  const filePath = path.join(dbFolderPath, dbkey);

  try {
    await fs.unlink(filePath);
    return 'Deleted Successfully';
  } catch (error) {
    console.error(`Error deleting file ${dbkey}: ${error.message}`);
    throw error;
  }
}

// Example usage with promises
//get('Account:email')
//  .then((value) => {
//    console.log('Read:', value);
//  })
//  .catch((error) => {
//    console.error('Error:', error);
//  });
//
//set('Account1', 'myemail')
//  .then((result) => {
//    console.log('Write:', result);
//  })
//  .catch((error) => {
//    console.error('Error:', error);
//  });
//
//list()
//  .then((files) => {
//    console.log('List:', files);
//  })
//  .catch((error) => {
//    console.error('Error:', error);
//  });
//
//remove('value1')
//  .then((result) => {
//    console.log('Delete:', result);
//  })
//  .catch((error) => {
//    console.error('Error:', error);
//  });

module.exports = {
    get,
    set,
    list,
    remove
  };