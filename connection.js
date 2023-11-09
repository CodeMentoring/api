const { Sequelize } = require("sequelize");

const database = "library";
const username = "postgres";
const password = "adminadmin";
const host = "localhost";
const port = 5434;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: "postgres",
});

module.exports = {
  sequelize,
};
