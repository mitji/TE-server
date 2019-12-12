const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commnetSchema = new Schema({
  text: {type: String, required: true},
  created_at: {type: Data, required: true},
  author: [{type: Schema.Types.ObjectId, ref:'User', required: true}],
});

const Comment = mongoose.model('Comment', commnetSchema);

module.exports = Comment;