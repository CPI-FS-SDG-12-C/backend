const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    required: true,
  },
  describtion: {
    type: String,
  },
  statusTrade: { type: String, enum: ["open", "keep"] },
  timestamp: { type: Date },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

itemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Item", itemSchema);
