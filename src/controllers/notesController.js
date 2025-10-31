import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
	const notes = await Note.find();

	res.status(200).json(notes);
};

export const getNoteById = async (req, res, next) => {
	const { noteId } = req.params;
	const note = await Note.findById(noteId);

	if (!note) {
		next(createHttpError(404, 'Note not found'));
		return;
	}

	res.status(200).json(note);
};

export const createNote = async (req, res) => {
	const newNote = await Note.create(req.body);

	res.status(201).json(newNote);
};

export const deleteNote = async (req, res, next) => {
	const { noteId } = req.params;

	const noteToDelete = await Note.findByIdAndDelete(noteId);

	if (!noteToDelete) {
		next(createHttpError(404, 'Note not found'));
		return;
	}

	res.status(200).json(noteToDelete);
};

export const updateNote = async (req, res, next) => {
	const { noteId } = req.params;
	const newNote = req.body;

	const noteUpdate = await Note.findByIdAndUpdate(noteId, newNote, {
		new: true,
	});

	if (!noteId) {
		next(createHttpError(404, 'Note not found'));
		return;
	}

	res.status(200).json(noteUpdate);
};
