// require("dotenv").config();
const express = require("express");
const app = require("./app"); // your Express app
const { sequelize } = require("./models/index");

const PORT = process.env.PORT || 4000;

// Connect to database and start server
console.log("DB URL:", process.env.DATABASE_URL);
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to the database");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Unable to connect to the database:", error);
  });
