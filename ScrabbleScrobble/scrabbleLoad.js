function SSSetup() {
$('.lives').css('visibility','hidden');
$('.lives').css('position','absolute');
$('.lives').css('left','0');
$('.lives').css('top','0');
$('.lives').css('z-index','-10');
$('.game_in_progress').append('<div class="buttons2"><div class="sslives"><span>Lives</span></div><div class="Scrobble"><span>Scrobble</span></div></div>');
$('.lives label').remove();
$('.sslives').css('background', 'url(http://i.imgur.com/Gyn0k.png)');
$('.sslives').html("<span>" + $('.lives .count').html() + "</span>");
$('.buttons2').css('background', 'url(http://i.imgur.com/Gyn0k.png)');
$('.buttons2').css('position', 'absolute');
$('.buttons2').css('right', '-10px');
$('.buttons2').css('bottom', '0px');
$('.buttons2').css('height', '78px');
$('.buttons2').css('width', '110px');
$('.buttons2').css('color', 'white');
$('.sslives').css('display', 'block');
$('.sslives').css('width', '110px');
$('.sslives').css('height', '36px');
$('.sslives').css('overflow', 'hidden');
$('.Scrobble').css('display', 'block');
$('.Scrobble').css('width', '110px');
$('.Scrobble').css('height', '36px');
$('.Scrobble').css('overflow', 'hidden');
$('.Scrobble').css('margin-bottom', '4px');
$('.Scrobble').css('font-size', '16px');
$('.Scrobble').css('cursor', 'pointer');
$('.sslives span').css('position','relative');
$('.sslives span').css('top','12px');
$('.sslives span').css('text-align','center');
$('.sslives span').css('display','block');
$('.Scrobble span').css('position','relative');
$('.Scrobble span').css('top','12px');
$('.Scrobble span').css('text-align','center');
$('.Scrobble span').css('display','block');
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
    result.html('<h3>Loading...</h3><div class="loading"></div>');
    $('.loading').html('<img src="http://i.imgur.com/Jc9dB.gif"></img>');
    $('.loading img').css('padding-top','10px');
    $('.loading img').css('width','32px');
    $('.loading').css('display','block');
    $('.loading img').css('display','block');
    $('.loading').css('width','120px');
    $('.loading img').css('height','32px');
    $('.loading img').css('margin','0 auto');
    rack = $('.play .letter').text();
    while(rack.length < 7){
        rack = rack + '*';
    };
    board = document.getElementById('inboard').value;
    //if(jQuery.trim(rack) !== "" && rack.length + jQuery.trim(board.value).length) > 2){
    var args  = new Array();
    args[0] = jQuery.trim(rack)
    args[1] = jQuery.trim(board)
    Request(args, onFetchSuccess);
}
    