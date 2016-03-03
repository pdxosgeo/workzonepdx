(function () {
  var SPREADSHEET_KEY = '1OGC0ecdyz4L2vTbt9USMarL0jHiBJvAYyVno6mnCe9s';
  var tpl = $('.wtf-tpl').clone();

  function sheetToTweets (data, tabletop) {
    var elements = data.workzonewtf.elements;
    $('.wtf-tpl').remove();
    $('.wtf-loading').remove();

    for (var i = 0; i < elements.length; i++) {
      parseOembed(elements[i]);
    }
  }

  function parseOembed (str) {
    if (str.oembed !== "") {
      try {
        var oembed = JSON.parse(str.oembed);
        console.log(oembed);
        tpl.clone().html(oembed.html).appendTo('.wtf-grid');
      } catch (e) {
        console.log('error', e);
      }
    }
  }

  window.onload = function() {
    Tabletop.init({
      key: SPREADSHEET_KEY,
      callback: sheetToTweets
    })
  };
})()
