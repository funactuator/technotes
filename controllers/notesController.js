const Note = require('../models/Note');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

/**
 * @desc Get all notes
 * @route GET /notes
 * @access Private
 * @param {*} req express request object
 * @param {*} res express response object
 */
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if(!notes?.length){
    return res.status(400).json({message:'No notes found'});
  }
  res.json(notes);
})

/**
 * @desc create new note 
 * @route POST /notes
 * @access Private
 * @param {*} req express request object
 * @param {*} res express response object
 */
const createNote = asyncHandler(async(req, res) => {
  const {title, text, completed, userId} = req.body;

  //confirm data 
  if(!title || !text || typeof completed !== 'boolean' || !userId){
    return res.status(400).json({message:"All fields required!"});
  }

  //check if user with userId exists
  const user = await User.findById(userId).lean().exec();
  if(!user){
    return res.status(400).json({message:`No user found with id ${userId}`});
  }

  const noteObj = {
    title, text, completed, 'user':user
  }

  const note = await Note.create(noteObj);

  if(note){
    res.status(201).json({message:`new note created title ${title}`})
  }else{
    res.status(400).json({message:'Invalid Note data recieved!'});
  }

})

/**
 * @desc update a note
 * @route PATCH /notes
 * @access Private
 * @param {*} req express request object
 * @param {*} res express response object
 */
const updateNote = asyncHandler(async(req, res) => {

})

/**
 * @desc delete a note
 * @route DELETE /notes
 * @access Private
 * @param {*} req express request object
 * @param {*} res express response object
 */
const deleteNote = asyncHandler(async(req, res) => {

})

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote
}


