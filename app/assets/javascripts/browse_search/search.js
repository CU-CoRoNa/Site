//= require ./element_generator.js
//= require lodash.compat.js

/**
 * Responsible for interacting with solor and passing
 * the results to the element generator
 * Created by Matthias on 1/6/15.
 */

var elements = new ElementGenerator();

function Search()
{
  //event handler for search-bar
  $('#search-bar').submit(function(e){
    e.preventDefault();
    search($('#query').val());
  });

  function search(query)
  {
    $.ajax({
      url: '/do_search',
      type: "PATCH",
      async: false,
      data: {
        search:query
      },
      success: function(json) {
        $('.entry_container').remove();
        elements.setGroups($.map(_.groupBy(json,'GroupId'),function(val){
          return [val];
        }));
        fillScreen();
      }
    });
  }

  function fillScreen()
  {
    var num_display = $(document).height() / 200;
      //value determined by the prestigious school of hard knocks
    for(var i = 0; i < num_display; i++)
    {
      $('.tab-content').append(elements.getElement());
    }
  }

}

Search.prototype.get_next = function()
{
  return elements.getElement();
};
