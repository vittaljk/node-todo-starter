var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Todo', TodoSchema);
