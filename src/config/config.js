require('dotenv').config();

const {
  DB_NAME,
} = process.env;

module.exports = {
  url: `mongodb://localhost:27017/${DB_NAME}`,
};