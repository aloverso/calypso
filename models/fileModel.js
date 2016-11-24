var mongoose = require("mongoose");

var fileSchema = mongoose.Schema({
  name: String,
  code_sections: [{type: mongoose.Schema.Types.ObjectId, ref: 'CodeSection'}]
});

module.exports = mongoose.model("File", fileSchema);
