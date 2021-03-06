const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String},
  duration: {type: String, required: true},
  sport: {type: String, required: true},
  type: {type: String, required: true},
  video_url: {type: String},
  img_url: {type: String},
  share: {type: Boolean},
  comments: [{type: Schema.Types.ObjectId, ref:'Comment'}],
  author: {type: Schema.Types.ObjectId, ref:'User'}
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;