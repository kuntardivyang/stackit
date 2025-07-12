const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  notifications: [{ type: String }],
});

module.exports = mongoose.model("User", UserSchema);
