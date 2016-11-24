var mongoose = require("mongoose");

var codeSectionSchema = mongoose.Schema({
  code: String,
  text: String,
  start_index: Number,
  end_index: Number,
  doc: {type: mongoose.Schema.Types.ObjectId, ref: 'File'}
});

module.exports = mongoose.model("CodeSection", codeSectionSchema);
