// server.js (backend entry point)
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection with error handling
mongoose.connect("mongodb://localhost:27017/stackit")
.then(() => {
  console.log("Connected to MongoDB successfully");
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
  process.exit(1);
});

// Routes
app.use("/api/auth", require("./server/routes/auth"));
app.use("/api/questions", require("./server/routes/questions"));
app.use("/api/answers", require("./server/routes/answers"));
app.use("/api/notifications", require("./server/routes/notifications"));
app.use("/api/comments", require("./server/routes/comments"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
