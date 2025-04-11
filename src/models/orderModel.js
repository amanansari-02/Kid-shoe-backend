const mongoose = require("mongoose");

const orderScehma = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "items",
    required: true,
  },
});

const Order = mongoose.model("Order", orderScehma);

module.exports = Order;
