const Item = require("../models/item");
const User = require("../models/user");

const getItems = async (userId) => {
  console.log(userId);
  return await Item.find({ userID: userId, trade: false }).populate("userID", { email: 1, fullName: 1 });
  // return await Item.find().populate("user", { email: 1, fullName: 1 });
  // const populatedItems = await Promise.all(
  //   items.map(async (item) => {
  //     await item.populate("barter").execPopulate();
  //     return item;
  //   })
  // );

  // return populatedItems;
};

// get All Items
const getAllItems = async (userId) => {
  try {
    // Ambil semua item yang tidak dimiliki oleh pengguna dengan ID tertentu
    const items = await Item.find({ userID: { $ne: userId }, statusTrade: "open", trade: false }).populate("userID", { email: 1, fullName: 1 });
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
    userID: user.id,
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
