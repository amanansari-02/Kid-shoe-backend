const express = require("express");
const {
  addItem,
  getItems,
  editItem,
  getItemById,
  getItemsByGender,
  addOrder,
  getOrders,
} = require("../controller/itemsController");
const router = express.Router();

router.post("/item", addItem);
router.get("/items/:category", getItems);
router.get("/item/:id", getItemById);
router.get("/itemByGender/:gender", getItemsByGender);
router.post("/order", addOrder);
router.get("/order/:email", getOrders);
// router.put("/item/:id", editItem);

module.exports = router;
