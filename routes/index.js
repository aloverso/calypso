var routes = {};
var util = require('util');
var Code = require('./../models/codeModel.js');
var File = require('./../models/fileModel.js');
var codeSection = require('./../models/codeSectionModel.js');

routes.home = function(req, res) {
  res.render('home')
}

routes.new_code = function(req, res) {
  console.log(req.body.new_code);
  codeObj = {};
  codeObj.code = req.body.new_code;

  var saveCode = new Code(codeObj);

  saveCode.save(function(err) {
    if (err) {console.log('err:', err);}
    else {
      console.log('success');
    }
  });

  res.send(codeObj);
}

routes.new_file = function(req, res) {
  fileObj = {};
  fileObj.name = req.body.name;
  var saveFile = new File(fileObj);
  saveFile.save(function(err) {
    if (err) {console.log('err:', err);}
    else {
      console.log('success');
    }
  });

  fileObj.id = saveFile._id

  res.send(fileObj);
}

routes.get_codes = function(req, res) {
  Code.find().exec(function(err, codes) {
    console.log(codes); 
    res.json(codes);
  });
}

routes.code_section = function(req, res) {
  codeSectionObj = {};
  codeSectionObj.code = req.body.code;
  codeSectionObj.text = req.body.text;
  codeSectionObj.start_index = req.body.start_index;
  codeSectionObj.end_index = req.body.end_index;
  File.findOne({_id: req.body.doc_id})
    .exec(function(err, file) {
      codeSectionObj.doc = file;
      console.log(codeSectionObj);
    });

  var saveCodeSection = new codeSection(codeSectionObj);
  saveCodeSection.save(function(err) {
    if (err) {console.log('err:', err);}
    else {
      console.log('success');
    }
  });

  codeSectionObj.id = saveCodeSection._id

  // update file -- push to its list of code sections
  File.findOneAndUpdate({_id: req.body.doc_id},
    {$push: {code_sections: {_id: saveCodeSection._id}}},
    {safe: true, upsert: true, new: true},
    function(err) {console.log('err updating file code sections', err);}
  );

  res.send(codeSectionObj);
}

module.exports = routes;
