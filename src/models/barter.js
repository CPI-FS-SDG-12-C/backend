// models/barter.js
const mongoose = require("mongoose");

const barterSchema = new mongoose.Schema({
  requesterItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  desiredItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  status: {
    type: String,
    enum: ["requested", "approved", "completed"],
    default: "requested",
  },
});

barterSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Barter = mongoose.model("Barter", barterSchema);

module.exports = Barter;
