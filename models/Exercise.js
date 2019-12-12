const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: String, required: true},
  sport: {type: String, required: true},
  type: {type: String, required: true},
  video_url: {type: String},
  img_url: {type: String},
  public: {type: Boolean},
  author: {type: Schema.Types.ObjectId, ref:'User'}
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;