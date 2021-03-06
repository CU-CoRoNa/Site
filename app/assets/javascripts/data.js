//= require jquery.nouislider.all.min.js
//= require lodash

var collapsed_height = 35;
var current_query = "name NOT NULL";
var tab_id = 'tab-1';

var colors = { Social:"#428F89", Biological:"#5F6024", Informational:"#B08B0D"};

$(document).on("page:change", function(){


  //initialize slider
  $(".slider").noUiSlider({
    start:[0],
    range:{
      'min':[0],
      'max':[1]
    }
  });

  //add change listener to slider and select boxes
  $(".slider, select").on({
    change: function(){
      do_browse( this );
    }
  });

  //link slider to slider value output
  $('#nodes').Link('lower').to( $('#nodeSliderVal'), "text" );
  $('#edges').Link('lower').to( $('#edgeSliderVal'), "text" );

  //get the first default results (NAME NOT NULL)
  do_browse(this);

  $('ul.tabs li').click(function(){
    tab_id = $(this).attr('data-tab');
    $('.entry_container').remove();
    if (tab_id == 'tab-2') {
      process_search();
    } else {
      do_browse(this);
    }

    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');

    $(this).addClass('current');
    $("#"+tab_id).addClass('current');
  });

});

function process_search() {
  query = document.getElementById("query").value;
  search(this, query);
  return false;
}

//loads database elements as user scrolls
$(window).scroll(function() {
  console.log($(window).scrollTop());
  if( $(window).scrollTop() == $(document).height() - $(window).height()) {
    for(var i = 0; i < 5; i++) {
      get_next();
    }
  }
});

//eventually replace with json request
//and add an interface for rendering
//each element so people who are better
//at web design wont kill me
function get_group_info(current_entry) {
  var sample_entry = current_entry[0];

  var Name              = sample_entry.GroupId;
  var Description       = sample_entry.GroupDescription;
  var Domain            = sample_entry.Domain;
  var SubDomain         = sample_entry.SubDomain;
  var Nodes             = "Varies";
  var NodeType          = sample_entry.NodeType;
  var Edges             = "Varies";
  var EdgeType          = sample_entry.EdgeType;
  var GraphProperties   = sample_entry.GraphProperties;
  var GroupId           = sample_entry.GroupId;
  var GroupDescription  = "Summary";
  var InfoLink          = sample_entry.InfoLink;
  var DataLink          = "javascript:showMore('" + sample_entry.GroupId + "')";
  var FileSize          = "Varies";
  var FileType          = "Varies";
  var GraphFormat       = "Varies";
  var Citation          = sample_entry.Citation;
  var Public            = sample_entry.Public;

  return {Name:Name, Description:Description, Domain:Domain, SubDomain:SubDomain, Nodes:Nodes,
          NodeType:NodeType, Edges:Edges, EdgeType:EdgeType, GraphProperties:GraphProperties,
          GroupId:GroupId, GroupDescription:GroupDescription, InfoLink:InfoLink, DataLink:DataLink,
          FileSize:FileSize, FileType:FileType, GraphFormat:GraphFormat, Citation:Citation, Public:Public,
          Button:"Show More"};

}

function get_next()
{
  var current_entry = current_query.pop();
  var template = Handlebars.compile($("#entry").html());

  if( current_entry.length > 1)
  {
    $('.tab-content').append(template( get_group_info(current_entry) ));
    $('[id=\''+current_entry[0].GroupId+'E\']').append("<div class=\"additionalGroup\"" + " id=\""+
                                       current_entry[0].GroupId+"\"></div>" );
    for( i in current_entry)
    {
        var tmp = Handlebars.compile($("#group").html());
        $('[id=\''+current_entry[0].GroupId+'\']').append(tmp(current_entry[i]));
    }
  }
  else
  {
    $('.tab-content').append(template($.extend(current_entry.pop(), {Button:"Download"}) ));
  }


  $('.Domain').each(function(){
    var curr_domain = $(this).attr('class').split(' ')[1];
    var color = (colors[curr_domain] == null) ? " gray" : colors[curr_domain];
    $(this).css({'border-top': 'solid' + color});
  });

  $('.collapse').height(collapsed_height);
  domainFix();

  $('.collapse').hover(function(){
    $(this).css({'background-color' : '#F0F0F0'});
  },function(){
    $(this).css({'background-color': '#F7F7F7'});
  });
}

function search(caller, query)
{
  $.ajax({
    url: '/do_search',
    type: "PATCH",
    async: true,
    data: {
      search:query
    },
    success: function(json) {
      //remove all of the old entries
      $('.entry_container').remove();
      var template = Handlebars.compile($("#entry").html());
      for (i = 0; i < json.length; i++) {
        $('.tab-content').append(template($.extend(json[i], {Button:"Download"})));
      }

      $('.Domain').each(function(){
        var curr_domain = $(this).attr('class').split(' ')[1];
        var color = (colors[curr_domain] == null) ? " gray" : colors[curr_domain];
        $(this).css({'border-top': 'solid' + color});
      });

      $('.collapse').height(collapsed_height);
      domainFix();

      $('.collapse').hover(function(){
        $(this).css({'background-color' : '#F0F0F0'});
      },function(){
        $(this).css({'background-color': '#F7F7F7'});
      });
      return false;
    }
  });
}


function do_browse(caller)
{
  //sends the current browse settings to the server
  $.ajax({
    url: '/do_browse',
    type: "PATCH",
    async: true,
    data: {
      domain:$("#Type option:selected").text(),
      group:$('#Group option:selected').text(),
      nodes:$('#nodes').val(),
      edges:$('#edges').val(),
      file_size:$('#file_size').val(),
      file_type:$('#FileType option:selected').text()
    },
    success: function(json){
        update_browse(json, caller);
    }
  });

}//end do browse

//also updates the current query and clears out the old query
//this should be ran fairly infrequently so it doesn't have to
//be super speedy...I hope
function update_browse(new_options, caller)
{

  if( !(caller instanceof HTMLDocument))
  {
    //determine which groups to edit
    var callerId = $(caller).attr('id');
    var selected;
    switch (callerId)
    {
      case 'Type':
        $('#Type option[value=\'All\']').text('All');
        selected = $("#Type option:selected").text();
        selected = (selected != 'All') ? '(' +selected + ')' : "";

        optionsUpdater( new_options.gs, "Group");
        $('#Group option[value=\'All\']').text('All ' + selected);

        optionsUpdater( new_options.ft, "FileType");
        $('#FileType option[value=\'All\']').text('All ' + selected);
        break;
      case 'Group':
        $('#Group option[value=\'All\']').text('All');
        selected = $("#Group option:selected").text();
        selected = (selected != 'All') ? '(' +selected + ')' : "";

        optionsUpdater( new_options.ds, "Type");
        $('#Type option[value=\'All\']').text('All ' + selected);

        optionsUpdater( new_options.ft, "FileType");
        $('#FileType option[value=\'All\']').text('All ' + selected);
        break;
      case 'FileType':
        $('#FileType option[value=\'All\']').text('All');
        selected = $("#FileType option:selected").text();
        selected = (selected != 'All') ? '(' +selected + ')' : "";

        optionsUpdater( new_options.ds, "Type");
        $('#Type option[value=\'All\']').text('All ' + selected);

        optionsUpdater( new_options.gs, "Group");
        $('#Group option[value=\'All\']').text('All ' + selected);
        break;
      default :
        optionsUpdater( new_options.ft, "FileType");
        optionsUpdater( new_options.ds, "Type");
        optionsUpdater( new_options.gs, "Group");
        break;
    }
  }
  else
  {
    //this is run when the page is loaded
    optionsUpdater( new_options.ft, "FileType");
    optionsUpdater( new_options.ds, "Type");
    optionsUpdater( new_options.gs, "Group");
    $('#nodes').noUiSlider({
      start:[new_options.nr[0]],
      range:{
        'min':new_options.nr[0],
        'max':[new_options.nr[1]]
      }
    },true);
      $('#nodes').val(this.value);
   // $('#nodeMin').text(Math.pow(parseFloat(new_options.nr[0]),10));
   // $('#nodeMax').text(Math.pow(parseFloat(new_options.nr[1]),10));

    $('#edges').noUiSlider({
      start:[new_options.er[0]],
      range:{
        'min':[new_options.er[0]],
        'max':[new_options.er[1]]
      }
    },true);
   // $('#edgeMin').text(Math.pow(parseFloat(new_options.er[0]),10));
   // $('#edgeMax').text(Math.pow(parseFloat(new_options.er[1]),10));
  }

  //remove all of the old entries
  $('.entry_container').remove();

  //update to current query so page starts pulling new results
  current_query = $.map(_.groupBy(JSON.parse(new_options.q),'GroupId'), function(value, idx){
      return [value];
  });
  console.log(current_query);
  fillScreen();
}

/*
 * Adds or removes options from the three select boxes on the page
 * @arg new_options A list of the new select box options received from the
 * server
 * @arg to_edit the current select box being edited
 */
function optionsUpdater(new_options, to_edit)
{

  //remove unneeded options and mark options already in the select box
  var idx;
  $("#"+to_edit).children('.varies'+to_edit).each(function(){
    idx = new_options.indexOf( this.value );
    if( idx == -1 )
    {
      $(this).remove();
    }
    else
    {
      new_options[idx] = "null";
    }
  });//end remove

  //add new elements to the select box
  for(var i in new_options)
  {
    if( new_options[i] != "null")
    {
      $('#'+to_edit).append("<option value="+ new_options[i]+ " \" class=\"varies"+to_edit+"\" "+
          "> " + new_options[i]  + " </option>");

    }
  }//end add

}//end optionsUpdater

function fillScreen()
{
  var num_display = $(document).height() / 200;
  //value determined by the prestigious school of hard knocks
  for(var i = 0; i < num_display; i++)
  {
    get_next();
  }
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
