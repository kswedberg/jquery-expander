## Overview

The Expander Plugin hides (collapses) a portion of an element's content and adds a "read more" link so that the text can be viewed by the user if he or she wishes. By default, the expanded content is followed by a "read less" link that the user can click to re-collapse it. Expanded content can also be re-collapsed after a specified period of time. The plugin consists of a single method, `.expander()`, with a bunch of options.

## Features

* works for inline and block elements (as of 1.0)
* optional word counting of detail text
* configurable class names and "more", "less", and "word count" text
* configurable expanding effect
* callbacks for all states: on initial slicing of the content, before content expands, after content expands, after content collapses
* manual override: if content is smaller than `slicePoint` but contains an element with the detail class, the content will be sliced just before the detail element and act the same way as elements that meet the `slicePoint` and `widow` criteria.


## Options

The following options, shown here with their default values, are currently available:

```javascript
// the number of characters at which the contents will be sliced into two parts.
slicePoint: 100,

// a string of characters at which to slice the contents into two parts,
// but only if the string appears before slicePoint
// Useful for slicing at the first line break, e.g. {sliceOn: '<br'}
sliceOn: null,

// whether to keep the last word of the summary whole (true) or let it slice in the middle of a word (false)
preserveWords: true,

// whether to normalize the whitespace in the data to display (true) or not (false)
normalizeWhitespace: true,

// whether to count and display the number of words inside the collapsed text
// This will either allow or prevent the word count
// (and thus the configurable wordCountText) from showing.
showWordCount: false,

// text to include between summary and detail. Default ' ' prevents appearance of
// collapsing two words into one.
// Was hard-coded in script; now exposed as an option to fix issue #106.
detailPrefix: ' ',

// what to display around the counted number of words, set to '{{count}}' to show only the number
wordCountText: ' ({{count}} words)',

// a threshold of sorts for whether to initially hide/collapse part of the element's contents.
// If after slicing the contents in two there are fewer words in the second part than
// the value set by widow, we won't bother hiding/collapsing anything.
widow: 4,

// text displayed in a link instead of the hidden part of the element.
// clicking this will expand/show the hidden/collapsed text
expandText: 'read more',
expandPrefix: '&hellip; ',

// class names for summary element and detail element
summaryClass: 'summary',
detailClass: 'details',

// one or more space-separated class names for <span> around
// "read-more" link and "read-less" link
moreClass: 'read-more',
lessClass: 'read-less',

// number of milliseconds after text has been expanded at which to collapse the text again.
// when 0, no auto-collapsing
collapseTimer: 0,

// effects for expanding and collapsing
expandEffect: 'slideDown',
expandSpeed: 250,
collapseEffect: 'slideUp',
collapseSpeed: 200,

// start with the details expanded (and the "read-less" link showing)
startExpanded: true,

// allow the user to re-collapse the expanded text.
userCollapse: true,

// text to use for the link to re-collapse the text
userCollapseText: 'read less',
userCollapsePrefix: ' ',


// all callback functions have the this keyword mapped to the element in the jQuery set when .expander() is called

onSlice: null, // function() {},
beforeExpand: null, // function() {},
afterExpand: null, // function() {},
onCollapse: null // function(byUser) {},
afterCollapse: null // function() {}
```

## Known Issues

* If you use the default `'slideDown'` for the `expandEffect` option, the detail element's style will always get either `display: block` or `display: inline-block` when expanded. These `display` properties, in turn, will start the detail text on a new line, which might not be what you expect. You can usually avoid this problem by setting the `expandEffect` option to `'fadeIn'` instead.
* A couple people have reported (in [issue #24](https://github.com/kswedberg/jquery-expander/issues/24)) that if you use `'fadeIn'` and
`'fadeOut'` for the `expandEffect` and `collapseEffect` options, the plugin
appears to cause IE9 (and possibly older IEs) to crash after repeatedly
expanding and collapsing some text. Since the plugin itself doesn't do much
when expanding/collapsing, my hunch (confirmed by one of the reporters) is
that the crash has to do with animating the opacity of elements. I haven't
been able to reproduce the problem on my machine, which leads me to believe
that certain graphics settings in Windows must also be contributing to the
bug. In any case, if this is a concern for you, avoid using fades for those
effects options.

## Workarounds for inherent issues

* It is not possible to change the text inside an element that has had expander already applied to it, because elements are already split up into detail and summary texts. Almost everything that happens during initialization in expander needs to be repeated on a change in content to properly display the altered content. To do this, expander first needs to be destroyed, then reinitialized on the content (with settings).
  ```js
  $('#my-element')
  .expander('destroy')
  .html('<p>The HTML you want to replace the current html with goes here</p>')
  .expander({
    showWordCount: true,
    preserveWords: false,
    slicePoint: 30
  });
  ```

* As noted by a number of people (issue [#56], [#60]), this plugin can cause
"flickering" in its expandable elements on loading the webpage. It usually happens when multiple other scripts are present and the expander stalls during its initialization. It is (sadly) an issue that stems directly from its method of making expandable text, and cannot be fixed without changing what the plugin is, or how it operates. Nonetheless, the flicker can be prevented by the same semi-hacky fixes normally used for other FOUC (flash of unstyled content) issues:

  1. Add a JS script in the head that will add a "js" class to the html element
  (see http://www.learningjquery.com/2008/10/1-way-to-avoid-the-flash-of-unstyled-content/).
  This is done by JavaScript so that the element will not be hidden for clients with their JavaScript disabled/inoperable.

  2. Add the following somewhere in your CSS (using your own class names):
    ```css
    .js .myexpander.js-myexpander-hidden {
      display: none;
    }
    ```

  3. Add a JS script that will execute later (bottom of body or within `$(document).ready()`):
    ```js
    $('.myexpander').expander().removeClass('js-myexpander-hidden');
    ```

  3.5. If you still see a little "flash" of unstyled content, add this script to remove the class in an onSlice callback:
  ```js
  $(.myexpander).expander({
    onSlice: function() {
      $(this).removeClass('js-myexpander-hidden');
    }
  });
  ```

## Injecting with CommonJS or AMD

```js
// CommonJS
var jQuery = require('jquery');
require('jquery-expander')(jQuery);

// AMD
define(['jquery', 'jquery-expander'], function (jQuery, expander) {
  expander(jQuery)
})
```

## Demo

A demo is provided in the repo's `demo` directory. Feel free to take the plugin for a spin at [kswedberg.github.io/jquery-expander/demo/][3]

## Tests

The Expander Plugin comes with a set of unit tests to ensure that it is working as expected. You can run these tests online at [kswedberg.github.io/jquery-expander/test/][1] or locally from the repo's test directory.

## License

This plugin is free of charge and licensed under the [MIT][2] license.

[1]: https://kswedberg.github.io/jquery-expander/test/
[2]: http://kswedberg.mit-license.org/
[3]: https://kswedberg.github.io/jquery-expander/demo/
