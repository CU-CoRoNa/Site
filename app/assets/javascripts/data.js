
var collapsed_height = 35;
var current_query = "name NOT NULL";

$(document).on("page:change", function(){

  $('ul.tabs li').click(function(){
      var tab_id = $(this).attr('data-tab');

      $('ul.tabs li').removeClass('current');
      $('.tab-content').removeClass('current');

      $(this).addClass('current');
      $("#"+tab_id).addClass('current');
  });

});

//this function runs twice for some reason...
//yet another reason to get rid of turbo links
$(function(){
    var num_display = $(document).height() / 400;
        //value determined by the prestigious school of hard knocks
    for(i = 0; i < num_display; i++)
    {
      get_next();
    }
});

$(window).scroll(function() {
    if( $(window).scrollTop() == $(document).height() - $(window).height()) {
        get_next();
    }
});

//eventually replace with json request
//and add an interface for rendering
//each element so people who are better
//at web design wont kill me
function get_next()
{
  $.ajax({
    url: '/get_entry',
    type:"PATCH",
    async: false,
    data: {id: $(".entry_container:last").attr('id'), query: current_query},
    success: function(html){
    $('.tab-content').append(html);
       $(".collapse").height(collapsed_height);
       domainFix();
        //TODO move this to server side of things
    }
  });

  $('.collapse').hover(function(){
     $(this).css({'background-color' : '#F0F0F0'});
  },function(){
     $(this).css({'background-color': '#F7F7F7'});
  });
}

function domainFix()
{
  var count   = 0;
  var max_len = 0;
  $(".Domain").each(function(){
    var cur_len = $(this).width();
    max_len = (cur_len > max_len) ? cur_len : max_len;
  });

  max_len = 152;
  $(".Domain").each(function(){
    $(this).css({'width': max_len + 'px'});
  });

  $(".SubDomain").each(function(){
    var cur_len = $(this).width();
    max_len = (cur_len > max_len) ? cur_len : max_len;
    var dom_color = hexc($(this).prev().css('border-top-color'));
    var new_color = ColorLuminance(dom_color,.2);
    $(this).css({'border-top': 'solid' + new_color});
    $(this).prev().prev().css({'border-top': 'solid' + new_color});
  });

  max_len = 241;
  $(".SubDomain").each(function(){
    $(this).css({'width': max_len + "px"});
  });
}

function showMore(arg)
{
  $("div[id='" + arg + "']").slideToggle(500);
}//end showMore

function showHide(elem_r)
{
  var elem = $(elem_r);
  var old_height = elem.height();
  elem.css({'height': 'auto'});
  heights = [elem.height()];
  elem.siblings().each(function(){
    $(this).css({'height':'auto'});
    heights.push($(this).height());
  });

  var height_m = Math.max.apply(Math,heights);

  if(old_height <= (collapsed_height + 1))
  {
    elem.height(height_m);
    elem.siblings().height(height_m);
  }
  else
  {
    elem.height(collapsed_height);
    elem.siblings().height(collapsed_height);
  }
}//end showMore

function ColorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }
  return rgb;
}

function hexc(colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) parts[i] = '0' + parts[i];
    }
    return '#' + parts.join('');
}//from https://stackoverflow.com/questions/5999209/how-to-get-the-background-color-code-of-an-element