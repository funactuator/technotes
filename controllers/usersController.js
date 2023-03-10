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
  if(!users?.length){
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
  const {id, username, roles, active, password} = req.body;

  // Note: This is patch call, any or all of the above params can be updated except id.

  //Confirm data
  if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
    return res.status(400).json({message:'All fields are required'});
  }

  const user = await User.findById(id).exec();

  if(!user){
    return res.status(400).json({message:"User Not Found"});
  }

  //check for duplicating username if updating username
  //two cases : username is updated or it is not
  //but we are checking for duplicacy always

  const duplicate = await User.findOne({username}).lean().exec();

  if(duplicate && duplicate?._id.toString()!==id){
    return res.status(409).json({message:'duplicate username'});
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if(password){
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // salt rounds
    user.password = hashedPassword;
  }

  const updatedUser = await user.save();

  res.json({message:`${updatedUser.username} updated`});


})

// @desc delete a user
// @route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
  const {id} = req.body;
  if(!id){
    return res.status(400).json({message:'User Id Required'});
  }

  const note = await Note.findOne({user:id}).lean().exec();

  if(note){
    return res.status(400).json({message:'User has assigned notes'});
  }

  const user = await User.findOne({id}).exec();
  if(!user){
    return res.status(400).json({message:'User not found'});
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} is deleted`;

  res.json({message:reply});
})

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
}