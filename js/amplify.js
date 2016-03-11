(function () {
  var SPREADSHEET_KEY = '1OGC0ecdyz4L2vTbt9USMarL0jHiBJvAYyVno6mnCe9s';
  var tpl = $('.social-tpl').clone();
  var clearTpl = $('.clearfix-tpl').clone();

  function sheetToTweets (data, tabletop) {
    var elements = data;
    $('.social-tpl').remove();
    $('.clearfix-tpl').remove();
    $('.wtf-loading').remove();

    for (var i = 0; i < elements.length; i++) {
      addOembed(elements[i]);
      if ((i+1) % 3 == 0) {
        addClearfix();
      }
    }
  }

  function addOembed (str) {
    if (str.oembed !== "") {
      try {
        var oembed = JSON.parse(str.oembed);
        tpl.clone().html(oembed.html).appendTo('.social-grid');
      } catch (e) {
        throw Error(e);
      }
    }
  }

  function addClearfix () {
    clearTpl.clone().appendTo('.social-grid');
  }

  window.onload = function() {
    Tabletop.init({
      key: SPREADSHEET_KEY,
      callback: sheetToTweets,
      query: 'status = accepted',
      simpleSheet: true,
      orderby: 'timestamp',
      reverse: true
    })
  };
})()
