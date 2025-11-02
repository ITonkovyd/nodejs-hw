import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { TAGS } from '../constants/tags.js';

const objectIdValidator = (value, helpers) => {
	return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

const IdSchema = {
	noteId: Joi.string().custom(objectIdValidator).required(),
};

const titleField = Joi.string().min(1).required().messages({
	'string.base': 'Title must be a string',
	'string.min': 'Title should have at least 1 character',
	'any.required': 'Title is required',
});

const contentField = Joi.string().allow('').messages({
	'string.base': 'Content must be a string',
});

const tagField = Joi.string()
	.valid(...TAGS)
	.default('Todo')
	.messages({
		'string.base': 'Tag must be a string',
		'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
	});

const NoteSchema = {
	title: titleField,
	content: contentField,
	tag: tagField,
};

const queryString = {
	page: Joi.number().integer().min(1).default(1),
	perPage: Joi.number().integer().min(5).max(20).default(10),
	search: Joi.string().trim().allow(''),
	tag: Joi.string().valid(...TAGS),
};

export const noteIdSchema = {
	[Segments.PARAMS]: Joi.object(IdSchema),
};

export const getNotesSchema = {
	[Segments.QUERY]: Joi.object(queryString),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object(NoteSchema)
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object(IdSchema),
  [Segments.BODY]: Joi.object(NoteSchema).min(1),
};
