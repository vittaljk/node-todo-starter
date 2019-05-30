var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    location: {
        latitude: Number,
        longitude: Number
    },
    phone_number: Number,
    detection_time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
