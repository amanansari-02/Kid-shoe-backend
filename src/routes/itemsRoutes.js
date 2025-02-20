const express = require("express");
const {
  addItem,
  getItems,
  editItem,
} = require("../controller/itemsController");
const router = express.Router();

router.post("/item", addItem);
router.get("/items/:category", getItems);
// router.put("/item/:id", editItem);

module.exports = router;
