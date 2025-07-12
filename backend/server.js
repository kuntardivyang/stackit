// server.js (backend entry point)
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/stackit", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/auth", require("./server/routes/auth"));
app.use("/api/questions", require("./server/routes/questions"));
app.use("/api/answers", require("./server/routes/answers"));

app.listen(5000, () => console.log("Server running on port 5000"));
