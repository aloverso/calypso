// LOAD FILES
function load_file_as_text(){
  var file = $('#uploadfile')[0].files[0];
  console.log(file);

  $.post('newFile', {name: file.name})
    .done(function(data){
      // add to some list or dropdown

      var fileReader = new FileReader();
      fileReader.onload = function(file_loaded_event){
          var text = file_loaded_event.target.result.replace(/ +/g, " "); // remove double whitespace
          $('.textfile').text(text);
          $('.textfile').attr('id',data.id);

          // annotator library
          // jQuery(function ($) {
          //   $('.textfile').annotator().annotator('addPlugin','HighlightTags',optionstags);
          // });
      };

      fileReader.readAsText(file, "UTF-8");
    })
    .error(function(data, status) {
      console.log('Error!' + data);
    });
}

// STICK CODES
$('.code-list').stick_in_parent();

// HANDLE ADDING CODES FORM
var $addcodeform = $('form.add-code-form').unbind();
$addcodeform.submit(function handleNewCode(event) {
  event.preventDefault();
  var $form = $(event.target);
  var postData = {};
  var code = $form.find('input.new-code').val();

  postData.new_code = code;
  $form.find('input.new-code').val('');

  $.post('newCode', postData)
  .done(function(data){
    add_code_item(code);
  })
  .error(function(data, status) {
    console.log('Error!' + data);
  });
});

// POPULATE CODES LIST
$.get("/codes")
  .done(function(data) {
    for(var i=0; i<data.length; i++) {
      add_code_item(data[i].code)
    }
  });

function add_code_item(code) {
  $('.codes').append('<li><div draggable="true" ondragstart="drag(event)">'+code+'</div></li>')
}

// GET HIGHLIGHTED TEXT
function getSelectionText() {
  var text = "";
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }
  console.log(text);
  return text;
}

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

// DRAG DROP
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.textContent);
}

// CREATE NEW CODE SEGMENT
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  console.log(data);
  coded_text = getSelectionText();
  coded_html = getSelectionHtml();

  // ensure something is coded
  if (coded_text.length > 0) { 
    var start_index = $('.textfile').html().indexOf(coded_html);
    console.log(start_index);
    var end_index = start_index + coded_text.length;
    $.post('/codeSection', {
      start_index: start_index,
      end_index: end_index,
      text: coded_text,
      code: data,
      doc_id: $('.textfile').attr('id') 
    })
    .done(function(data) {
      //stuff here to display code section

      $('.textfile').html(
        $('.textfile').html().replace(coded_html, '<span class="code-selection" id="'+data.id+'">'+coded_html+'</span>'))

      $('.code-contents').append('<div class="code-floater" id="'+data.id+'">'+data.code+'</div>');
      var $intextblock = $('span#'+data.id);
      var $floater = $('.code-floater#'+data.id);
      $floater.css()
    });
  }
}