// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, enum: ["user", "foundation"], required: true },
  fullName: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  barterRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barter",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
