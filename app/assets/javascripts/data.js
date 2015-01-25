//= require jquery.nouislider.all.min.js
//= require browse_search/browse.js
//= require lodash

var tab_id = 'tab-1';

var interactionObject ;
  //will either be browse or search and determines how the data are interacted with


//init
$(function(){

  interactionObject = new DataInteractor();
  tab_init();
  document.domain = parent.domain;

});

//loads database elements as user scrolls
$(window).scroll(function() {
  if( $(window).scrollTop() == $(document).height() - $(window).height()) {
    for(var i = 0; i < 5; i++) {
      $('.tab-content').append(interactionObject.get_next());
    }
  }
});

function showMore(arg)
{
  $("div[id='" + arg + "']").slideToggle(500);
}//end showMore

function tab_init()
{
  $('ul.tabs li').click(function(){

    tab_id = $(this).attr('data-tab');

    $('.entry_container').remove();

    if(tab_id == 'tab-2')
    {
      interactionObject.setMode('search');
    }
    else
    {
      interactionObject.setMode('browse');
      interactionObject.reload();
    }

    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');

    $(this).addClass('current');
    $("#"+tab_id).addClass('current');
  });
}

function showHide(elem_r)
{
  var collapsed_height = 25;
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
