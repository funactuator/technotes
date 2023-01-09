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
const getAllNotes = (req, res) => {

}

/**
 * @desc create new note 
 * @route POST /notes
 * @access Private
 * @param {*} req express request object
 * @param {*} res express response object
 */
const createNote = (req, res) => {

}

/**
 * @desc update a note
 * @route PATCH /notes
 * @access Private
 * @param {*} req express request object
 * @param {*} res express response object
 */
const updateNote = (req, res) => {

}

/**
 * @desc delete a note
 * @route DELETE /notes
 * @access Private
 * @param {*} req express request object
 * @param {*} res express response object
 */
const deleteNote = (req, res) => {

}

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote
}


