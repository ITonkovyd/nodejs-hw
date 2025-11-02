import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, search, tag } = req.query;

	const skipCount = (page - 1) * perPage;

	const notesQuery = Note.find();

	if (search) {
		notesQuery.where({
			$text: { $search: search },
		});
	}

	if (tag) {
		notesQuery.where('tag').eq(tag);
	}

	const [totalItems, notes] = await Promise.all([
		notesQuery.clone().countDocuments(),
		notesQuery.skip(skipCount).limit(perPage),
	]);

	const totalPages = Math.ceil(totalItems / perPage);

	res.status(200).json({
		page,
		perPage,
		totalItems,
		totalPages,
		notes,
	});
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
