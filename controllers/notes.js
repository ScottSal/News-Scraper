var Note = require("../models/Note")

module.exports = {
  delete: function(query, cb) {
    Note.remove(query, cb);
  },
  get: function(query, cb) {
   Note.find({headlineId: query._id})

      .exec(function(err, doc) {
        cb(err, doc);
      });
     
  },
  save: function(query, cb) {

    Note.collection.save({headlineId: query._id, noteText: query.noteText}, function(err, docs) {
        cb(err, docs);
    });
  }
};