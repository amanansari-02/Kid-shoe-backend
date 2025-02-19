const mongoose = require("mongoose");

const itemScehma = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true },
});

const Items = mongoose.model("items", itemScehma);

module.exports = Items;
