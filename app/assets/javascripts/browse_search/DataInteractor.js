//= require ./browse.js
//= require ./search.js
//= require lodash.compat.min.js

/**
 *
 * Created by Matthias on 1/7/15.
 */

function DataInteractor()
{
  var myMode = 'browse';

  console.log('before');
  var browse = new Browse();
  console.log('here');
  var search = new Search();

  this.reload= function()
  {
    switch( myMode )
    {
      case 'browse':
        browse.reload();
        break;
    }
  };

  this.get_next = function(){
    switch( myMode )
    {
      case 'browse':
        return browse.get_next();
        break;
      case 'search':
        return search.get_next();
        break;
    }
  };

  this.setMode = function( mode )
  {
    myMode = mode;
  }
}

