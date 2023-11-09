const { Sequelize } = require("sequelize");

const database = "library_db_0t1y"; //"library";
const username = "hamp"; //"postgres";
const password = "JaQgOSs1o6R1OXxex4YeEfNFOHx8ZKOF"; //"adminadmin";
const host = "dpg-cl638u2l7jac73d521vg-a"; //"localhost";
const port = 5432; //5434;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: "postgres",
});

module.exports = {
  sequelize,
};
