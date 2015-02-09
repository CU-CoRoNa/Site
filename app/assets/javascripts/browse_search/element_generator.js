//= require handlebars-v2.0.0.js
//= require paper-collapse.min.js
/**
 * @class takes raw json from server and formats it into an object
 * that can be injected into the main page
 * Created by Matthias on 1/6/15.
 */

function ElementGenerator()
{

  const collapsedHeight = 25;
  const colors = { Social:"#3F51B5", Biological:"#4CAF50", Informational:"#795548"};

  var groups;
    //the unprocessed collection of all entries in the database

  var summaryTemplate;
    //template for group summary
  var individualTemplate;
    //template for each individual entry in the database

  //Loads the template for entries from the server
  $.ajax
  ({
    url: '/get_entry',
    type: "GET",
    async: false,
    success: function( responce )
    {
      var source = $('<div>' + responce + '</div>');
      summaryTemplate    = Handlebars.compile( source.find('#entry').html() );
      individualTemplate = Handlebars.compile( source.find('#group').html() );
    }
  });//end ajax

  /**
   * Takes a group and builds the html element to be injected into the document
   * using handlebars
   * @returns {*|jQuery|HTMLElement}
   */
  this.getElement = function()
  {
    var new_elem = groups.pop();
    var color = colors[new_elem[0].Domain];

    var to_ret = $('<div>' + summaryTemplate( getSummery( new_elem ) ) + '<div>');
      //make the handle bars object and format it for jquery

    //add each individual entry to the group
    for(var i in new_elem )
    {
      $('.groupTable',to_ret).append(individualTemplate(new_elem[i]));
    }

    to_ret = formatEntry(to_ret, color);

    return to_ret;
  };//end get element

  /**
   * Formats new entry
   */
  function formatEntry( entry, color)
  {
    var to_ret = entry;

    var to_process =
                    [
                      $('.description', to_ret),
                      $('.sizeInfo', to_ret),
                      $('.attrInfo', to_ret),
                      $('.graphInfo', to_ret),
                      $('.entryFooter', to_ret),
                      $('.additionalGroup', to_ret)
                    ];

    var to_hide=
                [
                  $('.entryBody', to_ret),
                  $('.entryFooter', to_ret),
                  $('.additionalGroup', to_ret)
                ];

    to_process.map(function(e){
      e.css('border-top-color',color)
    });

    $('.entry_container',to_ret).css('border-left-color',color);
    $('.collapse-card',to_ret).paperCollapse({});

    return to_ret;

  }

  /**
   * Takes a collection of data sets (graphs) and
   * generates a group summary of them
   * TODO make this intelligent i.e. Nodes is an average instead of Varies
   * @param group
   */
  function getSummery( group )
  {

    var singleEntry = (group.length == 1);
    var sample_entry = group[0];

    var Name              = singleEntry ? sample_entry.Name : sample_entry.GroupId;
    var Description       = singleEntry ? singleEntry.Name  : sample_entry.GroupDescription;
    var Domain            = sample_entry.Domain;
    var SubDomain         = sample_entry.SubDomain;
    var Nodes             = singleEntry ? sample_entry.Nodes : "Varies";
    var NodeType          = sample_entry.NodeType;
    var Edges             = singleEntry ? singleEntry.Edges :"Varies";
    var EdgeType          = sample_entry.EdgeType;
    var GraphProperties   = sample_entry.GraphProperties;
    var GroupId           = sample_entry.GroupId;
    var GroupDescription  = "Summary";
    var InfoLink          = sample_entry.InfoLink;
    var DataLink          = "javascript:showMore('" + sample_entry.GroupId + "')";
    var FileSize          = singleEntry ? sample_entry.FileSize : "Varies";
    var FileType          = singleEntry ? sample_entry.FileType : "Varies";
    var GraphFormat       = singleEntry ? sample_entry.GraphFormat :"Varies";
    var Citation          = sample_entry.Citation;
    var Public            = sample_entry.Public;

    return {Name:Name, Description:Description, Domain:Domain, SubDomain:SubDomain, Nodes:Nodes,
            NodeType:NodeType, Edges:Edges, EdgeType:EdgeType, GraphProperties:GraphProperties,
            GroupId:GroupId, GroupDescription:GroupDescription, InfoLink:InfoLink, DataLink:DataLink,
            FileSize:FileSize, FileType:FileType, GraphFormat:GraphFormat, Citation:Citation, Public:Public,
            Button:"Show More"};

  }//end get summary

  this.setGroups = function( newGroups )
  {
    console.log(newGroups);
    if( newGroups != null )
    {
      groups = newGroups;
    }
  };//end groups setter

}//end ElementGenerator class