import { Notes } from "../models/notes.js";
import createHttpError from "http-errors";

export const getAllNotes = async (req, res) => {
  const notes = await Notes.find();

  res.status(200).json(notes);
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
	const note = await Notes.findById(noteId);

	if (!note) {
    next(createHttpError(404, "Note not found"));
    return;
	}

	res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const newNote = await Notes.create(req.body);

  res.status(201).json(newNote);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;

  const noteToDelete = await Notes.findByIdAndDelete(noteId);

  if (!noteToDelete) {
    next(createHttpError(404, "Note not found"));
    return;
  }

  res.status(200).json(noteToDelete);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const newNote = req.body;

  const noteUpdate = await Notes.findByIdAndUpdate(noteId, newNote, {new: true});

  if (!noteId) {
    next(createHttpError(404, "Note not found"));
    return;
  }

  res.status(200).json(noteUpdate);
};
