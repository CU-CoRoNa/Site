//= require jquery.nouislider.all.min.js
//= require paper-collapse.min.js
//= require browse_search/browse.js
//= require lodash

var tab_id = 'tab-1';

var interactionObject ;
  //will either be browse or search and determines how the data are interacted with


//init
$(function(){
  interactionObject = new DataInteractor();
  interactionObject.setMode('browse');
  interactionObject.reload();
  console.log($(window))
});


//loads database elements as user scrolls
$(window).scroll(function() {
  if( $(window).scrollTop() == $(document).height() - $(window).height()) {
    for(var i = 0; i < 5; i++) {
      $('.content').append(interactionObject.get_next());
    }
  }
});


