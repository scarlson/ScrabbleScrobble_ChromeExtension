function SSSetup() {
$('.lives').css('background', 'none');
$('.lives label').remove();
$('.count').css('background', 'url(http://i.imgur.com/Gyn0k.png)');
$('.lives').html($('.lives').html() + "<div class='Scrobble'><span>Scrobble</span></div>");
$('.Scrobble').css('background', 'url(http://i.imgur.com/Gyn0k.png)');
$('.count').html("<span>" + $('.count').html() + "</span>");
$('.lives').css('width', '110px');
$('.lives').css('right', '-10px');
$('.count').css('display', 'block');
$('.count').css('width', '110px');
$('.count').css('height', '36px');
$('.count').css('overflow', 'hidden');
$('.count').css('margin-bottom', '4px');
$('.count').css('font-size', '16px');
$('.count').css('padding', '0');
$('.Scrobble').css('display', 'block');
$('.Scrobble').css('width', '110px');
$('.Scrobble').css('height', '36px');
$('.Scrobble').css('overflow', 'hidden');
$('.Scrobble').css('margin-bottom', '4px');
$('.Scrobble').css('font-size', '16px');
$('.Scrobble').css('cursor', 'pointer');
$('.lives span').css('position','relative');
$('.lives span').css('top','12px');
$('.Scrobble span').css('position','relative');
$('.Scrobble span').css('top','12px');
};

SSSetup();


$('body').append('<input type="text" id="inboard" size="55"></input>');
$('#inboard').css('position', 'absolute');
$('#inboard').css('width', '200px');
$('#inboard').css('bottom', '105px');
$('#inboard').css('z-index', '2000');
$('#inboard').css('margin', '0 30%');

$('.lives').change(function () {
    SSSetup();
});


$('.Scrobble').click(function () {
    doFetch();
});

var rack = "";
var inboard = "";
var result = $('#leaderboard');
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
    var res = '<h3>Best Plays</h3><table>';
    if(response.count !== "None"){
        jQuery.each( response.words, function(index){ res += '<tr><td style="width:20px">' + (index+1) + '.</td><td style="width:88px">' + this[0] + '</td><td style="width:20px">' + this[1] + '</td></tr>'; }); 
    } else {
        res += "<tr>No Words Found</tr>"
    }
    res = res + '</table>';
    result.html(res);
};

function doFetch() {
    rack = $('.play .letter').text();
    board = document.getElementById('inboard').value;
    //if(jQuery.trim(rack) !== "" && rack.length + jQuery.trim(board.value).length) > 2){
    var args  = new Array();
    args[0] = jQuery.trim(rack)
    args[1] = jQuery.trim(board)
    Request(args, onFetchSuccess);
}
    