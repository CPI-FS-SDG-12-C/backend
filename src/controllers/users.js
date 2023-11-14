const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/register", async (request, response) => {
  const { email, password, role } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    password: passwordHash,
    role,
  });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.post("/complete-profile", async (req, res) => {
  try {
    const { userId, fullName, phoneNumber, address } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.fullName = fullName;
    user.phoneNumber = phoneNumber;
    user.address = address;
    await user.save();
    res.status(200).send("Profile completed successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("items");
  res.json(users);
});

module.exports = usersRouter;
