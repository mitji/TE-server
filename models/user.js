const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  lastName: {type: String, required: true}, 
  password: {type: String, required: true},
  image: {type: String},
  sport: {type: String},
  trainings: [{type: Schema.Types.ObjectId, ref:'Training'}],
  exercises: [{type: Schema.Types.ObjectId, ref:'Exercise'}],
  savedExercises: [{type: Schema.Types.ObjectId, ref:'Exercise'}]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;