const app = require("./app");
const pool = require("./config/db");
require("dotenv").config();

const port = process.env.PORT || 4001;

const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Users table is ready");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

app.listen(port, async () => {
  await createUsersTable();
  console.log(`Server running on port ${port}`);
});
