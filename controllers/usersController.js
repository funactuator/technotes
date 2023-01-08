const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {

})

// @desc create new user
// @route POST /users
//@access Private
const createUser = asyncHandler(async (req, res) => {

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