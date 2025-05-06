const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const { pool, addUserToDatabase } = require("./config");

const app = express();

app.use(express.json()); // this parses JSON bodies
app.use(express.urlencoded({ extended: true }));

// Use EJS for view engine
app.set("view engine", "ejs");
// Use static file
app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// register user
app.post("/signup", async (req, res) => {
  //   const data = {
  //     username: req.body.username,
  //     password: req.body.password,
  //   };
  const { username, password } = req.body;

  try {
    const existingUser = await pool.query(
      `SELECT * FROM users_table WHERE username = $1`,
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .send("User already exists. Please choose a different username.");
    }
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password
    const userData = {
      username,
      // password,
      password: hashedPassword,
    };
    await addUserToDatabase(userData);
    console.log(userData);
    res.status(201).send("User has been created successfully!");
  } catch (error) {
    console.error(`Error registering user: ${error}`);
    res.status(500).send("Internal server error!");
  }
});

//login user
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM users_table WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).send("username can not found!");
    }
    // compare the hash password from the database with the plain text
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      res.render("home");
    } else {
      res.status(401).send("Wrong password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("An error occurred during login.");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
