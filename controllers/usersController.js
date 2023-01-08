const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// @desc Get all users
// @route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();
  if(!users){
    return res.status(400).json({message:'No users found'})
  }
  res.json(users);
})

// @desc create new user
// @route POST /users
//@access Private
const createUser = asyncHandler(async (req, res) => {
  //destructure body data
  const {username, password, roles} = req.body;

  //Confirm Data
  if(!username || !password || !Array.isArray(roles) || !roles.length){
    return res.status(400).json({message:'All fields are required'});
  }

  //check for duplicate
  const duplicate = await User.findOne({username}).lean().exec();

  //Q --> Why exec? something related to promises

  if(duplicate){
    return res.status(409).json({message:'Duplicate username'});
  }

  //Hash password

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS) //salt rounds;

  const userObject = {username, 'password':hashedPassword, roles};

  //create and store new user

  const user = await User.create(userObject);

  if(user){ //created
    res.status(201).json({message:`New user ${username} created`})
  }else{
    res.status(400).json({message:'Invalid user data recieved'});
  }

})

// @desc update a user
// @route PATCH /users
//@access Private
const updateUser = asyncHandler(async (req, res) => {

})

// @desc delete a user
// @route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {

})

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
}