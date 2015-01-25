//= require jquery.nouislider.all.min.js
//= require browse_search/element_generator.js

/**
 * @class Browse
 * A singleton class responsible for
 *  - input responce (i.e sliders, drop downs)
 *  - data base interaction (ajax)
 *  - updating the input options
 */

/**
 * Default constructor
 *  - initializes sliders
 *  - implements private functions
 */

var elements = new ElementGenerator();

function Browse()
{
  const jsonOptionId = {'Type':'ds', 'Group':'gs', 'FileType':'ft'};
    //relates the drop down boxes name to the json attribute name
  const modifiableTag = 'varies';
    //elements in the drop down box that are allow to be changed will have this tag

  //initialize slider range
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
      get_update( this );
        //passes calling object to update_state
    }
  });

  //renders numeric slider value in proper containers
  $('#nodes').Link('lower').to( $('#nodeSliderVal'), "text" );
  $('#edges').Link('lower').to( $('#edgeSliderVal'), "text" );

  /**
   * takes in input from the slider or drop down
   * and queries the server with the new information
   * to get the new elements to be shown
   * @param selector the actual html selector object
   */
  function get_update( selector )
  {
    console.log('in get update');
    $.ajax
    ({
      url: '/do_browse',
      type: "PATCH",
      async: false,
      data:
      {
        domain:$("#Type").find('option:selected').text(),
        group:$('#Group').find('option:selected').text(),
        nodes:$('#nodes').val(),
        edges:$('#edges').val(),
        file_size:$('#file_size').val(),
        file_type:$('#FileType').find('option:selected').text()
      },
      success: function( responce )
      {
        do_update(responce, selector);
      }
    });
  }//end update_state

  /**
   * Takes the responce from the server and
   * updates the input options and the elements that
   * are going to be rendered
   * @param server_responce json formatted data entries
   */
  function do_update( server_responce, selector )
  {
    console.log('running in do_update');
    $('.entry_container').remove();
    options_update(server_responce, selector );
    elements.setGroups($.map(_.groupBy(JSON.parse(server_responce.q),'GroupId'),function(val){
      return [val];
    }));
    fillScreen();
  }//end do_update

  /**
   * Modifies the drop down boxes to contain all of the correct options
   * based on the last query also adds a label to the all option indicating
   * that the current options are limited by a selection
   * @param new_options
   * @param selector
   */
  function options_update( new_options, selector )
  {
    const elemHTMLSelector = '#';
    const wantedAttr       = 'id';
    const defaultOption    = 'All';

    if( ! (selector instanceof HTMLDocument) )
    {
      $(elemHTMLSelector + $(selector).attr(wantedAttr) + ' option[value=\''+defaultOption+'\']').text(defaultOption);
        //reset the all element in the drop down menu
      var selected_option = $(elemHTMLSelector + $(selector).attr(wantedAttr) + ' option:selected').text();
      var formatted_so = (selected_option != defaultOption) ? ' (' + selected_option + ')' : "";

      for( var optionType in jsonOptionId)
      {
        if( selected_option != optionType)
        {
          $(elemHTMLSelector + optionType + 'option[value=\''+defaultOption+'\']').text(defaultOption + formatted_so);
            //indicate that the last selected attribute is limiting the options
          drop_down_attr_edit(new_options[ jsonOptionId[optionType] ], optionType);
            //add or remove attributes from the drop down boxes
        }
      }
    }
    else
    {

      //add options to all menus
      for( var optionType in jsonOptionId )
      {
        drop_down_attr_edit( new_options[optionType], jsonOptionId[optionType])
      }

      //TODO consider always updating nodes and edges
      $('#nodes').noUiSlider({
        start:[new_options.nr[0]],
        range:{
          'min':new_options.nr[0],
          'max':[new_options.nr[1]]
        }
      },true);

      $('#nodes').val(this.value);

      $('#edges').noUiSlider({
        start:[new_options.er[0]],
        range:{
          'min':[new_options.er[0]],
          'max':[new_options.er[1]]
        }
      },true);

    }

  }//end options_update

  /**
   * Takes the options returned from the server and
   * modifies the drop down box's options to match the server's
   * @param new_attrs the options from the server
   * @param elem a drop down box
   */
  function drop_down_attr_edit( new_attrs, elem )
  {
    const ignoreFlag       = 'skip';
    const htmlSelector     = '.';
    const elemHTMLSelector = '#';

    var idx;
    $(elemHTMLSelector + elem).children( htmlSelector + modifiableTag + elem).each(function(){
      idx = new_attrs.indexOf( this.value );
      if( idx == -1 )
      {
        $(this).remove();
      }
      else
      {
        new_attrs[idx] = ignoreFlag;
      }
    });

    for(var i in new_attrs)
    {
      if( new_attrs[i] != ignoreFlag)
      {
        $(elemHTMLSelector + elem).append("<option value="+ new_attrs[i]+ " \" class=\"" + modifiableTag + elem + "\" "+
          "> " + new_attrs[i]  + " </option>");
      }
    }
  }//end drop_down_attr_edit

  function fillScreen()
  {
    var num_display = $(document).height() / 200;
      //value determined by the prestigious school of hard knocks
    for(var i = 0; i < num_display; i++)
    {
      $('.tab-content').append(elements.getElement());
    }
  }

  this.reload = function()
  {
    get_update(this);
    var num_display = $(document).height() / 200;
      //value determined by the prestigious school of hard knocks
    for(var i = 0; i < num_display; i++)
    {
      $('.tab-content').append(elements.getElement());
    }
  };

  get_update(this);
    //runs so page can be filled with entries (all entries by default)

}//end browse constructor

Browse.prototype.get_next = function()
{
  return elements.getElement();
};


