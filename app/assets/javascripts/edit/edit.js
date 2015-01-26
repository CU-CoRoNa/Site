$(document).ready(function(){
  if (window.location.pathname === "/edit") {
    $("#Create_true").change(create);
    $("#Create_false").change(update);
  }
})

function create() {
  var name = base();
  name.append("<input name=\"name\" id=\"Name\" type=\"text\">");
  console.log("UPDATING");
}

function update () {
  var name = base();
  var names = ["a", "b", "c"];
  dropdown = "<select id=\"Name\"><option value=\"\"></option>\n";
  names.forEach(function(v){
    dropdown += "<option value=\"" + v + "\">" + v + "</option>\n";
  });
  dropdown += "</select>\n";
  name.append(dropdown);
  console.log("CREATING");
}

function base() {
  var name = $('#Name').parent();
  line = "\n" + name.html().split("\n")[1] + "\n";
  name.html(line);
  return name;
}
