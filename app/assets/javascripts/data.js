//= require jquery.collapsible

var ready = function() {
    $('.collapsible').collapsible({
        defaultOpen: 'section1,section3'
    })
}

$(document).ready(ready);
$(document).on('page:load', ready);

