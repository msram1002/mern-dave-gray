const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt'); // Hash pwd before saving it

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async(req, res) => {
  // exclude password and lean only to get data, not the methods
  const users = await User.find().select('-password').lean();

  if(!users?.length) {
    return res.status(400).json({message: 'No users found!'})
  }

  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async(req, res) => {
  const { username, password, roles } = req.body;
  // confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({message: 'All fields are required or something is missing!'})
  }

  // check for duplicates
  // call exec for mongodb when finding a user
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({message: 'Duplicate username!'})
  }
  
  // hash Password
  const hashedPassword = await bcrypt.hash(password, 10); // salt rounds
  
  const userObject = { username, "password" : hashedPassword, roles };

  // Create and Store new user
  const user = await User.create(userObject);

  if (user) {
    // created
    res.status(201).json({ message: `'New user - ${username} created!`})
  } else {
    res.status(400).json({ message: 'Invalid user data received!'})
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async(req, res) => {
  const { id, username, roles, active, password } = req.body;

  // confirm data
  if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    return res.status(400).json({ message: 'All fields except password are required' })
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found!'})
  }

  // check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the original user - if we are updating the username to one which exists in DB
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username!'})
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // hash password
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated!`})
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async(req, res) => {
  // need to destructure only id
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID required!'})
  }

  // check for user's notes
  const note = await Note.findOne( { user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: 'User has assigned notes!'})
  }
  
  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found!'})
  }

  const result = await user.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  res.json(reply);
})

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
};