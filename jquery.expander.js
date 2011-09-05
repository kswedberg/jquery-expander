/*!
 * jQuery Expander Plugin v1.0pre
 *
 * Date: Wed Aug 31 20:53:59 2011 EDT
 * Requires: jQuery v1.3+
 *
 * Copyright 2011, Karl Swedberg
 * Dual licensed under the MIT and GPL licenses (just like jQuery):
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 *
 *
 *
*/

(function($) {
  $.expander = {
    version: '1.0pre',
    defaults: {
      // slicePoint: the number of characters at which the contents will be sliced into two parts.
      // Note: any tag names in the HTML that appear inside the sliced element before
      // the slicePoint will be counted along with the text characters.
      slicePoint: 100,

      // widow: a threshold of sorts for whether to initially hide/collapse part of the element's contents.
      // If after slicing the contents in two there are fewer words in the second part than
      // the value set by widow, we won't bother hiding/collapsing anything.
      widow: 4,

      // text displayed in a link instead of the hidden part of the element.
      // clicking this will expand/show the hidden/collapsed text
      expandText: 'read more',
      expandPrefix: '&hellip; ',

      // class names for detail content and read-more link
      detailClass: 'details',
      moreClass: 'read-more',

      // number of milliseconds after text has been expanded at which to collapse the text again.
      // when 0, no auto-collapsing
      collapseTimer: 0,
      expandEffect: 'fadeIn',
      expandSpeed: 250,

      // allow the user to re-collapse the expanded text.
      userCollapse: true,

      // text to use for the link to re-collapse the text
      userCollapseText: '[collapse expanded text]',
      userCollapsePrefix: ' ',


      // all callback functions have the this keyword mapped to the element in the jQuery set when .expander() is called

      onSlice: null, // function() {}
      beforeExpand: null, // function() {},
      afterExpand: null, // function() {},
      onCollapse: null // function(byUser) {}
    }
  };

  $.fn.expander = function(options) {

    var opts = $.extend({}, $.expander.defaults, options),
        rSlash = /\//,
        rAmpWordEnd = /(&(?:[^;]+;)?|\w+)$/,
        rOpenCloseTag = /<\/?(\w+)[^>]*>/g,
        rOpenTag = /<(\w+)[^>]*>/g,
        rCloseTag = /<\/(\w+)>/g,
        delayedCollapse;

    this.each(function() {
      var startTags, startOpens, startCloses, lastCloseTag, endText,
          $thisDetails, $readMore,
          openTagsForDetails = [],
          closeTagsForStartText = [],
          defined = {},
          thisEl = this,
          $this = $(this),
          $startEl = $([]),
          o = $.meta ? $.extend({}, opts, $this.data()) : opts,
          hasBlocks = !!$this.find('*').filter(function() {
            var display = $(this).css('display');
            return (/^block|table|list/).test(display);
          }).length,
          el = hasBlocks ? 'div' : 'span',
          detailSelector = el + '.' + o.detailClass,
          moreSelector = 'span.' + o.moreClass,
          expandSpeed = o.expandSpeed || 0,
          allText = $.trim( $this.html() ),
          startText = allText.slice(0, o.slicePoint).replace(rAmpWordEnd,'');

      // determine which callback functions are defined
      $.each(['onSlice','beforeExpand', 'afterExpand', 'onCollapse'], function(index, val) {
        defined[val] = $.isFunction(o[val]);
      });

      startTags = startText.match(rOpenCloseTag) || [];

      startText = allText.slice(0, o.slicePoint + startTags.join('').length).replace(rAmpWordEnd,'');
      if (startText.lastIndexOf('<') > startText.lastIndexOf('>') ) {
        startText = startText.slice(0,startText.lastIndexOf('<'));
      }
      startOpens = startText.match(rOpenTag) || [];
      startCloses = startText.match(rCloseTag) || [];
      for (var i = 0, l = startCloses.length; i < l; i++) {
        startCloses[i] = startCloses[i].replace(rCloseTag, '$1');
      }

      $.each(startOpens, function(index, val) {
        var thisTagName = val.replace(rOpenTag, '$1');
        var closePosition = $.inArray(thisTagName, startCloses);
        if (closePosition === -1) {
          openTagsForDetails.push(val);
          closeTagsForStartText.push('</' + thisTagName + '>');

        } else {
          startCloses.splice(closePosition, 1);
        }

      });
      closeTagsForStartText.reverse();

      // create necessary expand/collapse elements if they don't already exist
      if (!$this.find(detailSelector).length) {

        // end script if text length isn't long enough.
        endText = allText.slice(startText.length);
        if ( endText.split(/\s+/).length < o.widow || allText.length < o.slicePoint ) {
          return;
        }

        // otherwise, continue...
        lastCloseTag = closeTagsForStartText.pop() || '';
        startText += closeTagsForStartText.join('');
        endText = openTagsForDetails.join('') + endText;
        o.moreLabel = '<span class="' + o.moreClass + '">' + o.expandPrefix;
        o.moreLabel += '<a href="#">' + o.expandText + '</a></span>';

        if (hasBlocks) {
          startText = '<div class="expander-summary">' + startText + o.moreLabel;
          startText += lastCloseTag + '</div>';
          endText = allText;
          o.expandPrefix = '';
        } else {
          startText += lastCloseTag;
        }

        // onSlice callback
        o.summary = startText;
        o.details = endText;
        if (defined.onSlice) {
          var tmp = o.onSlice.call(thisEl, o);
          o = tmp && tmp.details ? tmp : o;
        }

        // build the html with summary and detail and use it to replace old contents
        var html = buildHTML(o, hasBlocks);
        $this.html( html );
      }

      // set up details and summary for expanding/collapsing
      $thisDetails = $this.find(detailSelector);
      $readMore = $this.find(moreSelector);
      $thisDetails.hide();
      $readMore.find('a').bind('click.expander', expand);

      $startEl = $this.find('div.expander-summary');

      if ( o.userCollapse && !$this.find('span.re-collapse').length ) {
        $this
        .find(detailSelector)
        .append('<span class="re-collapse">' + o.userCollapsePrefix + '<a href="#">' + o.userCollapseText + '</a></span>');
        $this
        .find('span.re-collapse a')
        .bind('click.expander', function(event) {
          event.preventDefault();
          clearTimeout(delayedCollapse);
          var $detailsCollapsed = $(this).closest(detailSelector);
          reCollapse(o, $detailsCollapsed);
          if (defined.onCollapse) {
            o.onCollapse.call(thisEl, true);
          }
        });
      }

      function expand(event) {
        event.preventDefault();
        $readMore.hide();
        $startEl.hide();
        if (defined.beforeExpand) {
          o.beforeExpand.call(thisEl);
        }

        $thisDetails[o.expandEffect](expandSpeed, function() {
          $thisDetails.css({zoom: ''});
          if (defined.afterExpand) {o.afterExpand.call(thisEl);}
          delayCollapse(o, $thisDetails, thisEl);
        });
      }

    }); // this.each

    function buildHTML(o, blocks) {
      var el = blocks ? 'div' : 'span';
      return [
        o.summary,
        blocks ? '' : o.moreLabel,
        '<' + el,
          ' class="' + o.detailClass + '">',
          o.details,
        '</' + el + '>'
        ].join('');
    }
    function reCollapse(o, el) {
      el.hide();
      var prevMore = el.prev('span.' + o.moreClass).show();
      if (!prevMore.length) {
        el.parent().children('div.expander-summary').show().find('span.' + o.moreClass).show();
      }

    }

    function delayCollapse(option, $collapseEl, thisEl) {
      if (option.collapseTimer) {
        delayedCollapse = setTimeout(function() {
          reCollapse(option, $collapseEl);
          if ( $.isFunction(option.onCollapse) ) {
            option.onCollapse.call(thisEl, false);
          }
        }, option.collapseTimer);
      }
    }

    return this;
  };

  // plugin defaults
  $.fn.expander.defaults = $.expander.defaults;
})(jQuery);
