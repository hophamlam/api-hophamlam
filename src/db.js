const { Pool } = require("pg");
const pool = new Pool({
  user: "your_username",
  host: "localhost", // Change if your DB is not locally hosted
  database: "your_db_name",
  password: "your_password",
  port: 5432,
});

module.exports = pool;
