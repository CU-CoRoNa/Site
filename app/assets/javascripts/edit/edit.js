$(document).ready(function(){
  if (window.location.pathname === "/edit") {
    $("#Create_true").change(create);
    $("#Create_false").change(update);
  }
})

function create() {
  var name = base();
  name.append("<input name=\"name\" id=\"Name\" type=\"text\">");
}

function update () {
  var name = base();
  name.append("<select id=\"Name\"><option value=\"\"></option>\n");
  name.append("</select>\n");
  getNames();
  console.log("CREATING");
}

function base() {
  var name = $("#Name").parent();
  line = "\n" + name.html().split("\n")[1] + "\n";
  name.html(line);
  return name;
}

function extend_dropdown(names) {
  var dropdown = $("#Name");
  console.log(names);
  names.forEach(function(v){
    dropdown.append("<option value=\"" + v + "\">" + v + "</option>\n");
  });
}

function getNames () {
  $.ajax({
    url: "getNames",
    type: "PATCH",
    success: function(response){
      extend_dropdown(response.names);
    }
  });
}
