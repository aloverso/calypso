var mongoose = require("mongoose");

var codeSchema = mongoose.Schema({
  code: String,
});

module.exports = mongoose.model("Code", codeSchema);
