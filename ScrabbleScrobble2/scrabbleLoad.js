function SSSetup() {
$('#bottombar').css('background-image','url("http://commondatastorage.googleapis.com/scrabblescrobble/bottombar.png")');
$('#bottombar').height('154px');
$('#bottombar').append('<input type="text" id="inboard" style="position:absolute;left:29px;top:35px;width:490px;height:16px;color: white;text-shadow: black 1px 1px 5px;text-align:center;background:None;"></input>');
$('.tile_actions').height('114px');
$('.tile_actions').prepend('<div class="scrobble_btn tile_button"><div>Scrobble</div></div>');
$('.play_btn').css('bottom','135px');
$('#jGrowl').css('bottom','132px');
$('#dialogs').append('<div id="results" class="dialog" style="top:80px;left:125px;display:none;width:250px;height:320px;"><div class="topframe"><div title="Close" class="closebox close_icon"></div>Scrabble Scrobble</div><div class="results-container"><h2 style="position:relative;top:33px;width:100px;text-align:center;margin:0 auto;">Top 10 Words</h2><div class="res" style="position:absolute;height:250px;width:224px;left:13px;top:55px;"></div></div></div>');
$('#results').draggable();
$('#results .topframe .closebox').click(function () {$('#results').css('display','none')});
$('.res').css('background-image','url("http://commondatastorage.googleapis.com/scrabblescrobble/results.png")');
$('.scrobble_btn').click(function () {doFetch();});
document.getElementById('inboard').value = "Enter the board tiles you want to play off here, then click Scrobble.";
$('#inboard').click(function(){document.getElementById('inboard').value = "";});
}

SSSetup();

var rack = "";
var inboard = "";
var reshead = $('.results-container h2');
var result = $('.res');
var runningReq = false;
var req;

function Request(args, callback) {
    var async = (callback !== null);
   
    // Encode the arguments in to a URI
    var query = 'rack=' + encodeURIComponent(args[0]) + '&board=' + encodeURIComponent(args[1]);

    if(runningReq){
      req.abort();
    }
    runningReq = true;

    // See http://en.wikipedia.org/wiki/XMLHttpRequest to make this cross-browser compatible
    req = new XMLHttpRequest();
    
    // Create a 'GET' request w/ an optional callback handler
    req.open('GET', 'http://scrabblescrobble.appspot.com/fetch?' + query + '&limit=10', async);
        

    if (async) {
      req.onreadystatechange = function() {
        if(req.readyState === 4 && req.status === 200) {
          var response = null;
          try {
           response = JSON.parse(req.responseText);
          } catch (e) {
           response = req.responseText;
          }
          callback(response);
        }
      };
    }
    
    // Make the actual request
    //setTimeout("req.send(null)", 200);
    req.send(null);
}

function onFetchSuccess(response) {
    runningReq = false;
    reshead.html('Top 10 Words');
    result.css('background-image','url("http://commondatastorage.googleapis.com/scrabblescrobble/results.png")');
    var res = '<table style="height:230px;width:215px;margin:10px;">';
    if(response.count !== "None"){
        jQuery.each( response.words, function(index){ res += '<tr><td style="width:20px">' + (index+1) + '.</td><td style="width:88px">' + this[0] + '</td><td style="width:20px">' + this[1] + '</td></tr>'; }); 
    } else {
        res += "<tr>No Words Found</tr>"
    }
    res = res + '</table>';
    result.html(res);
};

function doFetch() {
    $('#results').css('display','block');
    result.html('<img style="position:absolute;top:109px;left:96px;" src="http://commondatastorage.googleapis.com/scrabblescrobble/loading.gif"/>');
    reshead.html('Loading...');
    result.css('background-image', "");
    rack = '';
    $('.tiles .tile').each(function() {rack = rack + $(this).attr('data-letter')});
    board = document.getElementById('inboard').value;
    document.getElementById('inboard').value = "";
    var args  = new Array();
    args[0] = jQuery.trim(rack)
    args[1] = jQuery.trim(board)
    Request(args, onFetchSuccess);
}
    