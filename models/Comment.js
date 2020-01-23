const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commnetSchema = new Schema({
  text: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref:'User', required: true},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
}
);

const Comment = mongoose.model('Comment', commnetSchema);

module.exports = Comment;