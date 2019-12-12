const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  text: {type: String, required: true},
  created_at: {type: Data, required: true},
  author: [{type: Schema.Types.ObjectId, ref:'User', required: true}],
});

const Article = mongoose.model('Comment', articleSchema);

module.exports = Article;