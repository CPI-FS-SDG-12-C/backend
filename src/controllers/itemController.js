const itemService = require("../services/itemService");

const getItems = async (request, response) => {
  try {
    const items = await itemService.getItems(request.user.id);
    response.json(items);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const createItem = async (request, response) => {
  try {
    const newItem = await itemService.createItem(request.body, request.user.id);
    response.status(200).json(newItem);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const getItemById = async (request, response) => {
  try {
    const item = await itemService.getItemById(request.params.id);
    if (item) {
      response.json(item);
    } else {
      response.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteItem = async (request, response) => {
  try {
    await itemService.deleteItem(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const updateItem = async (request, response) => {
  try {
    const updatedItem = await itemService.updateItem(request.params.id, request.body);
    response.json(updatedItem);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getItems,
  createItem,
  getItemById,
  deleteItem,
  updateItem,
};
