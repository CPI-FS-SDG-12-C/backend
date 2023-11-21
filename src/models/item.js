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
  statusTrade: {
    type: String,
    enum: ["open", "keep"],
  },
  trade: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  barter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barter",
  },
});

itemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
