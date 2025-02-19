const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/usersRoutes");
const itemsRoutes = require("./src/routes/itemsRoutes");

const port = process.env.PORT;
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
app.use(cors());

// Connect mongodb
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log(`Connected to MongoDB`);
});
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// API's
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", itemsRoutes);

// for image
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.listen(port, () => {
  console.log("Server running on 3000 port");
});
