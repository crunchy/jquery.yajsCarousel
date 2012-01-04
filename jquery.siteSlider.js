(function( $ ){
  // $('#content-with-images').imagesLoaded( myFunction )
  // execute a callback when all images inside a parent have loaded.
  // needed because .load() doesn't work on cached images

  // Useful for Masonry or Isotope, triggering dynamic layout
  // after images have loaded:
  //    $('#content').imagesLoaded( function(){
  //      $('#content').masonry();
  //    });

  // mit license. paul irish. 2010.
  // webkit fix from Oren Solomianik. thx!

  // callback function is passed the last image to load
  //   as an argument, and the collection as `this`

  $.fn.imagesLoaded = function(callback) {
    var elems = this.find('img'),
        len   = elems.length,
        _this = this;

    if ( !elems.length ) {
      callback.call( this );
    }

    elems.bind('load',function(){
      if (--len <= 0){
        callback.call( _this );
      }
    }).each(function(){
      // cached images don't fire load sometimes, so we reset src.
      if (this.complete || this.complete === undefined){
        var src = this.src;
        // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
        // data uri bypasses webkit log warning (thx doug jones)
        this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        this.src = src;
      }
    });

    return this;
  }

  // SiteSlider
  // MIT License. Copyright SalesCrunch, 2011

  $.fn.siteSlider = function( settings ) {
    var options = $.extend({}, {
      width: 930,
      height: 490,
      auto: true,
      autoInterval: 5,
      slideTag: '.slide',
      paginateTag: '#paginate'
    }, settings);

    options.el = this;

    return this.each(function() {
      $(this).hide();

      _init(options);

      $("img", this).imagesLoaded(function() {
        $(options.el).show();
      });
    });
  }

  function _init(options) {
    var $slides = $(options.slideTag)
      , PADDING = 4;

    // setup the paginator /
    $('.pager').first().addClass('active');


    $('.pager', options.paginateTag).bind("click", options, _handlePage);
    startAutoScroll(options);

    // setup sizing //
    options.el.width(options.width).height(options.height);
    var $viewer = $('#slide-viewer').css('width', options.width + PADDING).height(options.height);

    var slideWidth = $viewer.width()
      , numberOfSlides = $slides.length;

    $('#slides').css('width', slideWidth * numberOfSlides);

    // slides sizing
    $(options.slideTag).width(options.width).height(options.height);
    $('img', options.slideTag).height(options.height);
  }

  function startAutoScroll(opts) {
    if(!opts.auto) { return; }
    opts.runningInterval = setInterval(function() {
      _handleNav({data: opts}, true);
    }, opts.autoInterval * 1000);
  }

  function stopAutoScroll(opts) {
    if(!opts.auto) { return; }
    clearInterval(opts.runningInterval);
  }

  function _handleNav(e, auto) {
    if(e.preventDefault) { e.preventDefault(); }
    if(e.data.prevent) { return; }

    var slideWidth = e.data.width + 4
      , pos = parseInt($('#slides').css('margin-left'))
      , max = $('#slides').width() - $('#slide-viewer').width()
      , $active = $('.pager.active')
      , id = $active.data('slide');

    if(!auto) {
      stopAutoScroll(e.data);
      startAutoScroll(e.data);
    }

    if( pos == 0 && !auto ) {
      // Don't do anything.
    } else if( pos > 0 || (pos <= -max && auto) ) {
      e.data.prevent = true;

      slideTo(0, e.data);
      $active.removeClass('active');
      $('.pager').first().addClass('active');
    } else {
      e.data.prevent = true;

      $active.removeClass('active').siblings('[data-slide="'+(id+1)+'"]').addClass('active');
      slideTo(pos-slideWidth, e.data);
    }
  }

  function _handlePage(e) {
    e.preventDefault();
    if(e.data.prevent) { return; }

    var slideWidth = $($('.slide')[0]).innerWidth() + 4
      , pos = parseInt($('#slides').css('margin-left'))
      , curr = $('.pager.active').removeClass('active').data('slide')
      , to = $(this).addClass('active').data('slide');

    stopAutoScroll(e.data);
    startAutoScroll(e.data);
    e.data.prevent = true;

    slideTo(pos + ((curr - to) * slideWidth), e.data);
  }

  function slideTo(pos, opts) {
    $('#slides').animate({'margin-left': pos}, function() { opts.prevent = false });
  }

})( jQuery );



