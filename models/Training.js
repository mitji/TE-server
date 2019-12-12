const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainingSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: String, required: true}, 
  sport: {type: String, required: true},
  exercises: [{type: Schema.Types.ObjectId, ref:'Exercise'}],
  author: {type: Schema.Types.ObjectId, ref:'User'}
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;