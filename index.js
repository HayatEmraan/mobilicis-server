const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { connectDB } = require("./db/mongodb");
app.use(express.json());
app.use(cors());

// database connection
connectDB();

app.use("/api/v2", require("./router/routes"));

app.listen(port);
