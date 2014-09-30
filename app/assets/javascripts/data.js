$(document).on("page:change", function(){

  function equalHeight(obj){
    var heightArray = obj.children("div").map( function(){
      return  $(this).height();
    }).get();
    var maxHeight = Math.max.apply( Math, heightArray);
    obj.children("div").height(maxHeight);
  }

  $(".row").each( function(){
    equalHeight( $(this));
  })

 // $(".large-6").height(30);

});

