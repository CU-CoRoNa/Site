//= require jquery.nouislider.all.min.js
//= require browse_search/element_generator.js
//= require lunr.min
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
var mainContainer = '.content';
function Browse()
{
  const jsonOptionId = {'Type':'ds', 'Group':'gs', 'FileType':'ft'};
    //relates the drop down boxes name to the json attribute name
  const modifiableTag = 'varies';
    //elements in the drop down box that are allow to be changed will have this tag

  var index;

  var set_default_options = null;

  var dropdownSelected =
  {
    'Type':'All',
    'Group':'All',
    'GraphProperties':'All',
    'FileType':'All',
    'nodes':[0,0],
    'edges':[0,0]
  };

  $(document).on('polymer-ready',function(){
    $.ajax({
      url:'/get_browse_options',
      type: 'GET',
      success:function(default_options)
      {
        loadDefaultOptions(default_options);

        $('core-menu').on('core-select', function( e ){
          var caller = e.target.id;
          var myItem = e.originalEvent.detail.item;

          if( myItem.className == 'core-selected' )
          {
            dropdownSelected[caller] = myItem.getAttribute('label');
          }
          $('.content').empty();
          get_update();
        });

        $('paper-interval-slider').on('immediate-value-change', function(e){
          dropdownSelected[e.target.id] = [e.target.immediateValueA, e.target.immediateValueB];
          $('#'+ e.target.id+'_a').text(e.target.immediateValueA);
          $('#'+ e.target.id+'_b').text(e.target.immediateValueB);
          $('.content').empty();
          get_update();
        });

        $('input').on('change', function(e){
          console.log(e.target);
        });

      }
    });

  });

  function loadDefaultOptions(default_options)
  {
    const tag_f = '<paper-item label="';
    const tag_m = '">';
    const tag_e = '</paper-item>';

    set_default_options = default_options;

    default_options['domains'].forEach(function(e){
      $('#Type').append(tag_f + e + tag_m + e + tag_e);
    });

    default_options['groups'].forEach(function(e){
      $('#Group').append(tag_f + e + tag_m + e + tag_e);
    });

    default_options['properties'].forEach(function(e){
      $('#GraphProperties').append(tag_f + e + tag_m + e + tag_e);
    });

    default_options['file_type'].forEach(function(e){
      $('#FileType').append(tag_f + e + tag_m + e + tag_e);
    });

    var nodeLogMin = Math.log(default_options['node_range'][0] + 1)/ Math.log(10);
    var nodeLogMax = Math.log(default_options['node_range'][1]    )/ Math.log(10);
    var edgeLogMin = Math.log(default_options['edge_range'][0] + 1)/ Math.log(10);
    var edgeLogMax = Math.log(default_options['edge_range'][1]    )/ Math.log(10);

    $('#nodes').attr('valueA', nodeLogMin );
    $('#nodes').attr('min'   , nodeLogMin );
    $('#nodes').attr('valueB', nodeLogMax );
    $('#nodes').attr('max'   , nodeLogMax );
    dropdownSelected['nodes'] = [nodeLogMin, nodeLogMax];

    $('#edges').attr('min'   , edgeLogMin);
    $('#edges').attr('valueA', edgeLogMin);
    $('#edges').attr('max'   , edgeLogMax);
    $('#edges').attr('valueB', edgeLogMax);
    dropdownSelected['edges'] = [edgeLogMin, edgeLogMax];
  }

  /**
   * takes in input from the slider or drop down
   * and queries the server with the new information
   * to get the new elements to be shown
   * @param selector the actual html selector object
   */
  function get_update( )
  {
    $.ajax
    ({
      url: '/do_browse',
      type: "PATCH",
      async: false,
      data:
      {
        domain:dropdownSelected['Type'],
        group:dropdownSelected['Group'],
        properties:dropdownSelected['GraphProperties'],
        nodes_max:Math.pow(10,dropdownSelected['nodes'][1]),
        nodes_min:Math.pow(10,dropdownSelected['nodes'][0]),
        edges_max:Math.pow(10,dropdownSelected['edges'][1]),
        edges_min:Math.pow(10,dropdownSelected['edges'][0]),
        file_size:0,
        file_type:dropdownSelected['FileType']
      },
      success: function( responce )
      {
        do_update(responce);
      }
    });
  }//end update_state

  /**
   * Takes the responce from the server and
   * updates the input options and the elements that
   * are going to be rendered
   * @param server_responce json formatted data entries
   */
  function do_update( server_responce )
  {
    var groups = $.map(_.groupBy(JSON.parse(server_responce.q),'GroupId'), function(val){
      return [val]
    });
    elements.setGroups(groups);
    options_update(server_responce);
    index_update( groups );
    fillScreen();
  }//end do_update

  /**
   * Modifies the drop down boxes to contain all of the correct options
   * based on the last query also adds a label to the all option indicating
   * that the current options are limited by a selection
   * @param new_options
   * @param selector
   */
  function options_update( new_options )
  {
    if( set_default_options != null)
    {

      var to_gray = {
                      'Type': _.difference(set_default_options.domains, new_options.ds),
                      'Group': _.difference(set_default_options.groupes, new_options.gs),
                      'GraphProperties': _.difference(set_default_options.properties, new_options.ps),
                      'FileType':_.difference(set_default_options.file_type, new_options.ft)
                    };

      $('paper-item').prop('disabled',false);
      var elems;
      for( var dropDown in to_gray)
      {
        elems = to_gray[dropDown];
        for( var i in elems )
        {
          $('[label="' + elems[i] + '"]','#' + dropDown).prop('disabled',true);
        }
      }

      /*
      var nodeLogMin = Math.log(new_options.nr[0] + 1);
      var nodeLogMax = Math.log(new_options.nr[1]    );
      var edgeLogMin = Math.log(new_options.er[0] + 1);
      var edgeLogMax = Math.log(new_options.er[1]    );

      $('#nodes').attr('valueA', nodeLogMin );
      $('#nodes').attr('min'   , nodeLogMin );
      $('#nodes').attr('valueB', nodeLogMax );
      $('#nodes').attr('max'   , nodeLogMax );
      dropdownSelected['nodes'] = [nodeLogMin, nodeLogMax];

      $('#edges').attr('min'   , edgeLogMin);
      $('#edges').attr('valueA', edgeLogMin);
      $('#edges').attr('max'   , edgeLogMax);
      $('#edges').attr('valueB', edgeLogMax);
      dropdownSelected['edges'] = [edgeLogMin, edgeLogMax];
      */
    }
  }//end options_update

  /**
   * Takes the options returned from the server and
   * modifies the drop down box's options to match the server's
   * @param new_attrs the options from the server
   * @param elem a drop down box
   */
  function index_update( groups )
  {
    var index = lunr(function(){
      this.field('Name'           , {boost: 10});
      this.field('Domain'         );
      this.field('SubDomain'      );
      this.field('GraphProperties');
      this.field('Description'    );
      this.field('Citation'       );
      this.ref  ('id'             );
    });
    var elem;
    for( var group in groups)
    {
      elem = groups[group][0];
      index.add({
       "Name":elem.GroupId,
       "Domain":elem.Domain,
       "SubDomain":elem.SubDomain,
       "GraphProperties":elem.GraphProperties,
       "Description":elem.GroupDescription,
       "Citation":elem.Citation,
       "id":elem.GroupId+'E'
      });
    }
  }//end drop_down_attr_edit

  function fillScreen()
  {
    var num_display = $(document).height() / 10;
      //value determined by the prestigious school of hard knocks
    var elem;
    for(var i = 0; i < num_display; i++)
    {
      elem = elements.getElement();
      $(mainContainer).append(elem);
    }
  }

  this.reload = function()
  {
    get_update(this);
    var num_display = $(document).height() / 50;
      //value determined by the prestigious school of hard knocks
    for(var i = 0; i < 20; i++)
    {
      $(mainContainer).append(elements.getElement());
    }
  };

  get_update(this);
    //runs so page can be filled with entries (all entries by default)

}//end browse constructor

Browse.prototype.get_next = function()
{
  return elements.getElement();
};



