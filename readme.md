## Overview

The Expander Plugin is a simple little jQuery plugin to hide/collapse a portion of an element's text and add a "read more" link so that the text can be viewed by the user if he or she wishes. By default, the expanded text is followed by a "re-collapse" link. Expanded text can also be re-collapsed at a specified time

The plugin consists of a single method, `.expander()`, with a bunch of options.

## Options

I need to clean up the options object. Until I get around to it, the following options (along with their defaults) are currently available:

```javascript
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

// number of milliseconds after text has been expanded at which to collapse the text again
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
```
