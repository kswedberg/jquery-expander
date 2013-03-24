## Overview

The Expander Plugin hides (collapses) a portion of an element's content and adds a "read more" link so that the text can be viewed by the user if he or she wishes. By default, the expanded content is followed by a "read less" link that the user can click to re-collapse it. Expanded content can also be re-collapsed after a specified period of time. The plugin consists of a single method, `.expander()`, with a bunch of options.

## Features

* works for inline and block elements (as of 1.0)
* configurable class names and "more" and "less" text
* configurable expanding effect
* callbacks for all states: on initial slicing of the content, before content expands, after content expands, after content collapses
* manual override: if content is smaller than `slicePoint` but contains an element with the detail class, the content will be sliced just before the detail element and act the same way as elements that meet the `slicePoint` and `widow` criteria.


## Options

The following options, shown here with their default values, are currently available:

```javascript
// the number of characters at which the contents will be sliced into two parts.
slicePoint: 100,

// whether to keep the last word of the summary whole (true) or let it slice in the middle of a word (false)
preserveWords: true,

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
expandEffect: 'fadeIn',
expandSpeed: 250,
collapseEffect: 'fadeOut',
collapseSpeed: 200,

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

* A couple people have reported (in [issue #24](https://github.com/kswedberg/jquery-expander/issues/24)) that if you use `fadeIn` and
`fadeOut` for the `expandEffect` and `collapseEffect` options, the plugin
appears to cause IE9 (and possibly older IEs) to crash after repeatedly
expanding and collapsing some text. Since the plugin itself doesn't do much
when expanding/collapsing, my hunch (confirmed by one of the reporters) is
that the crash has to do with animating the opacity of elements. I haven't
been able to reproduce the problem on my machine, which leads me to believe
that certain graphics settings in Windows must also be contributing to the
bug. In any case, if this is a concern for you, avoid using fades for those
effects options.

## Demo

A demo is provided in the repo's `demo` directory. Feel free to take the plugin for a spin at [plugins.learningjquery.com/expander/demo/][3]

## Tests

The Expander Plugin comes with a set of unit tests to ensure that it is working as expected. You can run these tests online at [plugins.learningjquery.com/expander/test/][1] or locally from the repo's test directory.

## License

This plugin is free of charge and licensed under the [MIT][2] license.

[1]: http://plugins.learningjquery.com/expander/test/
[2]: http://www.opensource.org/licenses/mit-license.php
[3]: http://plugins.learningjquery.com/expander/demo/
