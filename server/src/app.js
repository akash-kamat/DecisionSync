const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const apiRoutes = require("./routes/api");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
}));

app.use("/api", apiRoutes);

module.exports = app;