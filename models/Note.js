var mongoose = require('mongoose');

//create schema using mongoose schema function
var Schema = mongoose.Schema;

//create new schema, attach associated article
var noteSchema = new Schema({
    _headlineId:{
        type: Schema.Types.ObjectId,
        ref: "Headline"
    },
    date: String,
    noteText: String
});

//creates the model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", noteSchema);

// Export the Headline model
module.exports = Note;