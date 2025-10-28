import { Schema, model } from "mongoose";

const notesSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      default: "",
      trim: true
    },
    tag: {
      type: String,
      required: false,
      enum: ['Work', 'Personal', 'Meeting', 'Shopping', 'Ideas', 'Travel', 'Finance', 'Health', 'Important', 'Todo'],
      default: 'Todo'
    }
  },
  {
    timestamps: true
  }
);


export const Notes = model('Notes', notesSchema);
