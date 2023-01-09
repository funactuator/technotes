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
  if(!title || !text || !userId){
    return res.status(400).json({message:"All fields required!"});
  }
  let isCompletedPassed = false;
  if(completed !== undefined || typeof completed === 'boolean')isCompletedPassed = true;

  //check if user with userId exists
  const user = await User.findById(userId).lean().exec();
  if(!user){
    return res.status(400).json({message:`The user you are trying to assign with id ${userId} does not exist.`});
  }

  const noteObj = {
    title, text, 'user':user, 
  }

  if(isCompletedPassed){
    noteObj.completed = completed;
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
  const {id, title, text, completed, userId} = req.body;

  //confirm data;
  if(!id || !title || !text || typeof completed !== 'boolean' || !userId){
    return res.status(400).json({message:'All data required'});
  }

  //check id and userId sanity

  const note = await Note.findById(id).exec();
  if(!note){
    return res.status(400).json({message:`No such note found`});
  }

  const user = await User.findById(userId).lean().exec();

  if(!user){
    return res.status(400).json({message:`No user found with id ${userId}`});
  }

  note.completed = completed;
  note.title = title;
  note.text = text;
  note.userId = user;

  const updatedNote = await note.save();
  res.json({message:`Note with ${updatedNote.title} updated`});

})

/**
 * @desc delete a note
 * @route DELETE /notes
 * @access Private
 * @param {*} req express request object
 * @param {*} res express response object
 */
const deleteNote = asyncHandler(async(req, res) => {
  const {id} = req.body;
  if(!id){
    return res.status(400).json('Required Note id');
  }
  const note = await Note.findById(id).exec();

  if(!note){
    return res.status(400).json({message:'No note found'});
  }

  const result = await note.deleteOne();

  const reply = `Note ${result.title} with ticket ${result.ticket} deleted`;
  res.json({message:reply});

})

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote
}


