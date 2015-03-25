//= require jquery.nouislider.all.min.js
//= require paper-collapse.min.js
//= require browse_search/browse.js
//= require lodash

var interactionObject ;
  //will either be browse or search and determines how the data are interacted with

var test = 4;

//init
$(function(){
  interactionObject = new Browse();
  interactionObject.reload();
});

window.addEventListener('message', function()
{
  for(var i = 0; i < 5; i++)
  {
    $('.content').append(interactionObject.get_next());
  }
  parent.postMessage('message','*');
});




