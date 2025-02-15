const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author' },  
  genre: {type: String,required:true}
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;