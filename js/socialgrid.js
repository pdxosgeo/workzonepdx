(function($) {
  $(function() {
    $.widget("amplify.socialgrid", {
      options: {
        limit: 3,
        activePost: 0,
        posts: []
      },
      tpl: $('.social-tpl').clone(),
      clearTpl: $('.clearfix-tpl').clone(),

      _create: function() {
        this.posts = this.options.posts;
        this.curPostIndex = this.options.activePost;

        var nav = this._getNavBar();
        this.element.before(nav);
        this.loadPosts();
        this._setNavBarState();
      },

      loadPosts: function() {
        $('.wtf-loading').fadeOut();
        $('.social-tpl').fadeOut(1200, function() { $(this).remove(); $('.clearfix-tpl').remove; });

        var start = this.curPostIndex;
        var end = start + this.options.limit;
        if (end > this.posts.length) {
          end = this.posts.length;
        }

        for (var i = start; i < end; i++) {
          this._addOembed(this.posts[i], this.posts[i].source);
        }

        $('.social-tpl').delay(2000).fadeIn(800);
        $('.clearfix-tpl').delay(2000).fadeIn(800);
      },

      _addOembed: function(str, source) {
        if (str.oembed !== "") {
          try {
            var oembed = JSON.parse(str.oembed);
            var newEmbed = this.tpl.clone().html(oembed.html);
            newEmbed.appendTo('.social-grid');

            if (source === 'twitter') {            
              twttr.widgets.load(newEmbed);
            } else {
              instgrm.Embeds.process(newEmbed);
            }
          } catch (e) {
            throw Error(e);
          }
        }
      },

      _addClearfix: function() {
        this.clearTpl.clone().appendTo('.social-grid');
      },

      _getNavBar: function() {
        var row = $('<div>', {class: 'row'});
        var col = $('<div>', {class: 'col-lg-12'}).appendTo(row);
        var nav = $('<div>', {class: 'social-footer'}).appendTo(col);

        //create previous link
        this._on($('<button>', {
          class: 'btn btn-nav btn-prev pull-left',
          html: '<i class="fa fa-chevron-circle-left"></i>&nbsp; Newer',
          "data-direction": this.options.limit * -1
        }).prependTo(nav),
        {click: "pageStepHandler"});

        //create next link
        this._on($('<button>', {
          class: 'btn btn-nav btn-next pull-right',
          html: 'Older &nbsp;<i class="fa fa-chevron-circle-right"></i>',
          "data-direction": this.options.limit
        }).appendTo(nav),
        {click: "pageStepHandler"});
        return nav;
      },

      _setNavBarState: function() {
        if (this.curPostIndex === 0) {
          $('.btn-prev').hide();
        } else {
          $('.btn-prev').show();
        }
        
        if (this.curPostIndex + this.options.limit > this.posts.length) {
          $('.btn-next').hide();
        } else {
          $('.btn-next').show();
        }
      },

      pageStepHandler: function(event) {
        event.preventDefault();
        //get the direction and ensure it's numeric
        var dir = $(event.target).attr('data-direction') * 1;
        console.log(dir);
        
        this.curPostIndex = this.curPostIndex + dir;
        if (this.curPostIndex < 0) { 
          this.curPostIndex = 0; 
        } else if (this.curPostIndex > this.posts.length - 1) {
          this.curPostIndex = this.posts.length - 1;
        }

        this.loadPosts();
        this._setNavBarState();
      }
    });
  });
})(jQuery);