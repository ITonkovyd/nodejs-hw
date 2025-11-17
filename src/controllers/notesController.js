import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
	const { page = 1, perPage = 10, search, tag } = req.query;

	const skipCount = (page - 1) * perPage;

	const notesQuery = Note.find({ userId: req.user._id });

	if (search) {
		notesQuery.where({
			$text: { $search: search },
		});
	}

	if (tag) {
		notesQuery.where('tag').eq(tag);
	}

	const [totalNotes, notes] = await Promise.all([
		notesQuery.clone().countDocuments(),
		notesQuery.skip(skipCount).limit(perPage),
	]);

	const totalPages = Math.ceil(totalNotes / perPage);

	res.status(200).json({
		page,
		perPage,
		totalNotes,
		totalPages,
		notes,
	});
};

export const getNoteById = async (req, res, next) => {
	const { noteId } = req.params;
	const note = await Note.findOne({
		_id: noteId,
		userId: req.user._id,
	});

	if (!note) {
		next(createHttpError(404, 'Note not found'));
		return;
	}

	res.status(200).json(note);
};

export const createNote = async (req, res) => {
	const newNote = await Note.create({
		...req.body,
		userId: req.user._id,
	});

	res.status(201).json(newNote);
};

export const deleteNote = async (req, res, next) => {
	const { noteId } = req.params;

	const noteToDelete = await Note.findOneAndDelete({
		_id: noteId,
		userId: req.user._id,
	});

	if (!noteToDelete) {
		next(createHttpError(404, 'Note not found'));
		return;
	}

	res.status(200).json(noteToDelete);
};

export const updateNote = async (req, res, next) => {
	const { noteId } = req.params;
	const newNote = req.body;

  const noteUpdate = await Note.findOneAndUpdate(
		{ _id: noteId, user: req.user._id },
		newNote,
		{
			new: true,
		},
	);

	if (!noteUpdate) {
		next(createHttpError(404, 'Note not found'));
		return;
	}

	res.status(200).json(noteUpdate);
};
