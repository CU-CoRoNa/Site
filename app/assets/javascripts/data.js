//=require jquery.expander.js
var collapsed_height = 30;

$(document).on("page:change", function(){

  $(".collapse").height(collapsed_height);

});

$('.collapse').on('click',function(event){
    showHide($(this));
});

$('.collapse').hover(function(){
   $(this).css({'background-color' : '#F0F0F0'});
},function(){
   $(this).css({'background-color': '#F7F7F7'});
});

function showMore(arg)
{
  $("#" + arg).slideToggle(500);
}//end showMore

function showHide(elem)
{
  var old_height = elem.height();
  elem.css({'height': 'auto'});
  heights = [elem.height()];
  elem.siblings().each(function(){
    $(this).css({'height':'auto'});
    heights.push($(this).height());
  });

  var height_m = Math.max.apply(Math,heights);

  if(old_height == 30)
  {
    console.log("Make Bigger");
    elem.height(height_m);
    elem.siblings().height(height_m);
  }
  else
  {
    console.log("Make smaller");
    elem.height(collapsed_height);
    elem.siblings().height(collapsed_height);
  }

}//end showMore

