const express = require("express");
const router = express.Router();
const Barter = require("../models/barter");
const Item = require("../models/item");
const History = require("../models/history");
const verifyToken = require("../middlewares/verifyToken");

// Endpoint untuk memulai barter
router.post("/requests", async (req, res) => {
  try {
    const { requesterItemId, desiredItemId } = req.body;

    const requesterItem = await Item.findById(requesterItemId);
    const desiredItem = await Item.findById(desiredItemId);

    if (!requesterItem || !desiredItem) {
      return res.status(400).json({ error: "Item not found." });
    }

    const barter = new Barter({
      requesterItem: requesterItemId,
      desiredItem: desiredItemId,
    });

    await barter.save();

    requesterItem.barter = barter._id;
    desiredItem.barter = barter._id;

    await requesterItem.save();
    await desiredItem.save();

    res.json({ message: "Barter started successfully.", barter });
  } catch (error) {
    console.error("Error starting barter:", error);
    res.status(500).json({ error: "Error starting barter." });
  }
});

// get request
router.get("/approval", verifyToken, async (req, res) => {
  try {
    const authorizedUser = req.user;

    console.log("ID", authorizedUser.id);

    // Langkah 2: Temukan item-item yang memiliki ID barter dari langkah pertama dan trade = false
    const itemsToApprove = await Item.find({
      // userID: authorizedUser.id,
      trade: false,
      barter: { $ne: null },
    });

    return res.status(200).json(itemsToApprove);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// route approve (POST)
router.post("/approval/:id_items", verifyToken, async (req, res) => {
  try {
    const authorizedUser = req.user;
    const id_items = req.params.id_items;

    //   - get id barter from items where id_items = :id_items
    const item = await Item.findOne({ _id: id_items });
    console.log("item", item);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const id_barter = item.barter ? item.barter.toString() : null;
    console.log("id_barter", id_barter);

    if (!id_barter) {
      return res.status(404).json({ error: "Barter ID not found in the item" });
    }

    // Perbarui trade menjadi true untuk semua item yang memiliki barterID yang sesuai
    await Item.updateMany({ barter: id_barter }, { $set: { trade: true } });

    // Tambahkan log atau respons sesuai kebutuhan
    console.log("Trade updated successfully for all items with barterID:", id_barter);
    return res.status(200).json({ message: "Item approval status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET approved items for the logged-in user
router.get("/history", verifyToken, async (req, res) => {
  try {
    const authorizedUser = req.user;

    // Fetch approved items for the logged-in user
    const approvedItems = await Item.find({
      userID: authorizedUser.id,
      trade: true,
      barter: { $ne: null },
    });

    res.json(approvedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// routes/barter.js
// ...

// Endpoint untuk menyetujui barter
// router.post("/approve", async (req, res) => {
//   try {
//     const { barterId } = req.body;

//     const barter = await Barter.findById(barterId).populate("requesterItem desiredItem");

//     if (!barter) {
//       return res.status(400).json({ error: "Barter not found." });
//     }

//     if (barter.status !== "requested") {
//       return res.status(400).json({ error: "Barter cannot be approved." });
//     }
//     // Pertukaran item
//     const tempItem = barter.requesterItem;
//     barter.requesterItem = barter.desiredItem;
//     barter.desiredItem = tempItem;

//     // Mengubah status item yang terlibat dalam pertukaran
//     barter.requesterItem.trade = true;
//     barter.desiredItem.trade = true;

//     // Simpan perubahan
//     await barter.requesterItem.save();
//     await barter.desiredItem.save();
//     await barter.save();

//     // Simpan entri histori
//     const historyRequester = new History({
//       item: barter.requesterItem,
//       barter: barter._id,
//       statusBefore: "requested",
//       statusAfter: "approved",
//     });

//     const historyDesired = new History({
//       item: barter.desiredItem,
//       barter: barter._id,
//       statusBefore: "requested",
//       statusAfter: "approved",
//     });

//     await historyRequester.save();
//     await historyDesired.save();

//     res.json({ message: "Barter approved successfully.", barter });
//   } catch (error) {
//     console.error("Error approving barter:", error);
//     res.status(500).json({ error: "Error approving barter." });
//   }
// });

// // menampilkan data
// router.get("/all", async (req, res) => {
//   try {
//     // Menggunakan populate untuk mendapatkan informasi item dan user terkait dengan barter
//     const barterData = await Barter.find().populate({
//       path: "requesterItem desiredItem",
//       populate: {
//         path: "user",
//         select: "email fullName",
//       },
//     });

//     res.json({ barterData });
//   } catch (error) {
//     console.error("Error fetching barter data:", error);
//     res.status(500).json({ error: "Error fetching barter data." });
//   }
// });

// router.get("/history", async (req, res) => {
//   try {
//     const barterHistory = await History.find().populate("item barter").exec();

//     res.json({ barterHistory });
//   } catch (error) {
//     console.error("Error fetching barter history:", error);
//     res.status(500).json({ error: "Error fetching barter history." });
//   }
// });

// // all request
// router.get("/requests", async (req, res) => {
//   try {
//     const barterRequests = await Barter.find({ status: "requested" }).populate("requesterItem desiredItem");
//     res.json(barterRequests);
//   } catch (error) {
//     console.error("Error fetching barter requests:", error);
//     res.status(500).json({ error: "Error fetching barter requests." });
//   }
// });

// // Tambahan endpoint untuk mendapatkan item dari barter request berdasarkan ID
// router.get("/requests/:id/items", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const barterRequest = await Barter.findById(id).populate("requesterItem desiredItem");

//     if (!barterRequest) {
//       return res.status(404).json({ error: "Barter request not found." });
//     }

//     // Ambil item dari barter request
//     const items = [barterRequest.requesterItem.toObject(), barterRequest.desiredItem.toObject()];

//     res.json(items);
//   } catch (error) {
//     console.error("Error fetching items from barter request:", error);
//     res.status(500).json({ error: "Error fetching items from barter request." });
//   }
// });

module.exports = router;
