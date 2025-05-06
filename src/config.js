const { Pool } = require("pg");

const pool = new Pool({
  user: "your-user",
  password: "your-password",
  host: "your-host",
  database: "your_db_name",
  port: 5432,
});

async function addUserToDatabase(data) {
  const client = await pool.connect();

  try {
    // Create the users_table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users_table (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        password VARCHAR(255)
      );
    `);
    console.log("Table created successfully");

    // Insert a new user into the users_table
    await client.query(
      `INSERT INTO users_table(username, password) VALUES($1, $2)`,
      [data.username, data.password]
    );
    console.log("User added successfully");
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

module.exports = { pool, addUserToDatabase };

// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "your-user",
//   password: "your-password",
//   host: "your-host",
//   database: "your_db_name",
//   port: 5432,
// });

// // Check if the database is connected
// pool
//   .connect()
//   .then((client) => {
//     console.log("Database connected successfully!");
//     client.release(); // Release the client back to the pool
//   })
//   .catch((err) => {
//     console.error("Database connection failed:", err);
//   });

// module.exports = pool;

// try {
//     await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
//     res.status(201).send("User has been created successfully!");
//   } catch (error) {
//     if (error.code === '23505') { // Unique violation error code in PostgreSQL
//       res.status(400).send("Username already exists. Please choose a different username.");
//     } else {
//       console.error(`Error registering user: ${error}`);
//       res.status(500).send("Internal server error!");
//     }
//   }
