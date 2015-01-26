//= require jquery
$(document).ready(function(){
  console.log("NEW EDIT!");
  $("#Create_true").change(function (){
    //$('#Name').html('WHOOPS');
    console.log("CREATING");
  });

  $("#Create_false").change(function (){
    //$('#Name').html('WHOOPS');
    console.log("UPDATING");
  });
});
