const Item = require("../models/item");
const User = require("../models/user");

const getItems = async (userId) => {
  return await Item.find({ user: userId }).populate("user", { email: 1, fullName: 1 });
  // return await Item.find().populate("user", { email: 1, fullName: 1 });
  const populatedItems = await Promise.all(
    items.map(async (item) => {
      await item.populate("barter").execPopulate();
      return item;
    })
  );

  return populatedItems;
};

// get All Items
const getAllItems = async (userId) => {
  try {
    // Ambil semua item yang tidak dimiliki oleh pengguna dengan ID tertentu
    const items = await Item.find({ user: { $ne: userId }, statusTrade: "open" }).populate("user", { email: 1, fullName: 1 });
    console.log(items);
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

const createItem = async (itemData, userId) => {
  const user = await User.findById(userId);
  const item = new Item({
    ...itemData,
    timestamp: new Date(),
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
  await Item.findByIdAndDelete(itemId);
};

const updateItem = async (itemId, newData) => {
  return await Item.findByIdAndUpdate(itemId, newData, { new: true });
};

module.exports = {
  getItems,
  getAllItems,
  createItem,
  getItemById,
  deleteItem,
  updateItem,
};
