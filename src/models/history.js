const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  barter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barter",
    required: true,
  },
  statusBefore: {
    type: String,
    required: true,
  },
  statusAfter: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

historySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const History = mongoose.model("History", historySchema);

module.exports = History;
