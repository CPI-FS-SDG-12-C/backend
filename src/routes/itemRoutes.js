const express = require("express");
const itemController = require("../controllers/itemController");
const verifyToken = require("../middlewares/verifyToken");

const itemRouter = express.Router();

itemRouter.get("/", verifyToken, itemController.getItems);
itemRouter.post("/", verifyToken, itemController.createItem);
itemRouter.get("/:id", verifyToken, itemController.getItemById);
itemRouter.delete("/:id", verifyToken, itemController.deleteItem);
itemRouter.put("/:id", verifyToken, itemController.updateItem);

module.exports = itemRouter;
