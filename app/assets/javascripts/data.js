//=require readmore

$(document).on('click', function () {
    $(document).foundation('equalizer','reflow');
    $(document).getElementById("row").style.margin = "0px";
});

$('foo').readmore({
    maxHeight: 100
});
