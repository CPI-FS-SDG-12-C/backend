const Item = require("../models/item");
const User = require("../models/user");

const getItems = async (userId) => {
  // return await Item.find({ user: userId }).populate("user", { email: 1, fullName: 1 });
  return await Item.find().populate("user", { email: 1, fullName: 1 });
};

const createItem = async (itemData, userId) => {
  const user = await User.findById(userId);
  const item = new Item({
    ...itemData,
    user: user.id,
  });

  const savedItem = await item.save();
  user.items = user.items.concat(savedItem._id);
  await user.save();

  return savedItem;
};

const getItemById = async (itemId) => {
  return await Item.findById(itemId).populate("user", { email: 1, fullName: 1 });
};

const deleteItem = async (itemId) => {
  await Item.findOneAndDelete(itemId);
};

const updateItem = async (itemId, newData) => {
  return await Item.findByIdAndUpdate(itemId, newData, { new: true });
};

module.exports = {
  getItems,
  createItem,
  getItemById,
  deleteItem,
  updateItem,
};
