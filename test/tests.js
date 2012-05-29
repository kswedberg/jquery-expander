/*global module:false, test:false, equal:false, ok:false, asyncTest:false,start:false, expect: false */

/* SINGLE BLOCK BASICS */
module('single block', {
  setup: function() {
    this.ex = $('dl.expander');
    this.dd = this.ex.find('dd');
  }
});

test('basic element creation', function() {
  this.dd.expander({preserveWords: false});
  equal(this.ex.find('.summary').length, 0, 'no summary containers for content with no block elements');
  equal(this.dd.length - this.ex.find('.details').length, 1, 'all but one dd get expander treatment');
  equal(this.dd.length - this.ex.find('.read-more').length, 1, 'all but one dd get read-more link');
});

test('text slicing without preserving word boundaries', function() {
  var dds = this.dd;
  dds.expander({preserveWords: false});
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();
  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length,
        slicePoint = index == dds.length-1 ? 92 : 100;

    equal(txtLength, slicePoint, 'sliced summary text to proper length');
  });
});

test('text slicing with word boundaries', function() {
  var dds = this.dd;
  dds.expander();
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();
  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length,
        slicePoint = index == dds.length-1 ? 92 : 97;

    equal(txtLength, slicePoint, 'sliced summary text to proper length');
  });
});

test('slicePoint 200, without preserving word boundaries', function() {
  var dds = this.dd;
  dds.expander({slicePoint: 200, preserveWords: false});
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();
  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length,
        slicePoint = index == dds.length-1 ? 92 : 200;

    equal(txtLength, slicePoint, 'sliced summary text to proper length');
  });
});

test('hides the right elements', function() {
  var dd = this.dd.eq(1);
  dd.expander();
  ok(dd.find('.details').is(':hidden'), 'details div is hidden');
  ok(dd.find('.read-more a').is(':visible'), 'read-more link is visible');
  ok(dd.find('.read-less a').is(':hidden'), 'read-less link is hidden');

});

/* PLUGIN OPTIONS */
module('options', {
  setup: function() {
    this.ex = $('dl.options');
    this.dds = this.ex.find('dd');
    this.nowidow = $('#nowidow');
  }
});

test('widow', function() {
  this.dds.expander({widow: 5});
  this.nowidow.expander({widow: 0, slicePoint: 300});
  var secondDetails = this.dds.eq(1).find('.details');
  // remove the  "read-less" element before checking word length of details element
  secondDetails.find('.read-less').remove();
  // trim the detail text (because we do so in the plugin) before counting the words
  var secondDetailText = $.trim(secondDetails.text());

  equal(this.dds.first().find('.details').length, 0, 'first dd ignored due to widow');
  equal(this.dds.eq(1).find('.details').length, 1, '2nd dd widow long enough');
  equal(secondDetailText.split(/\s+/).length, 6, '2nd dd has 6 words');

  equal(this.nowidow.find('.read-more').length, 0, 'no read-more, even with widow: 0; fixes #17');
  equal(this.nowidow.find('.details').length, 0, 'no details, even with widow: 0; fixes #17');

});

test('text and class names', function() {
  var dd = this.dds.first().expander({
    slicePoint: 80,
    expandText:   'foo', //'read more',
    expandPrefix: '', //'&hellip; ',
    detailClass:  'expd',   //'details',
    moreClass:    'more', //'read-more',
    lessClass:    'less'  //'read-less'
  });
  equal(dd.find('.more').length, 1, 'read more class changed');
  equal(dd.find('.read-more').length, 0, 'read more class changed');
  equal(dd.find('.less').length, 1, 'read less class changed');
  equal(dd.find('.read-less').length, 0, 'read less class changed');
  equal(dd.find('.expd').length, 1, 'details class changed');
  equal(dd.find('.details').length, 0, 'details class changed');
  equal(dd.find('.more a').text(), 'foo', 'expandText changed');
  equal(dd.find('.more').text(), 'foo', 'expandPrefix changed');
});
test('userCollapse false', function() {
  var dd = this.dds.eq(2).expander({userCollapse: false});
  equal(dd.find('.details').length, 1, 'has details');
  equal(dd.find('.read-more').length, 1, 'has "read more"');
  equal(dd.find('.read-less').length, 0, 'does NOT have user-collapse "read less"');
});

test('without slicePoint in options, slicePoint got from data attribute', function() {
  this.ex = $('dl.options_slice');
  this.dds = this.ex.find('dd');
  var dds = this.dds;
  dds.expander({preserveWords: false});
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();

  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length,
        slicePoint = 40;

    equal(txtLength, slicePoint, 'sliced summary text to proper length');
  });
});

asyncTest('auto collapse', function() {
  var dd = this.dds.eq(2).expander({collapseSpeed: 0, collapseTimer: 400});
  equal(dd.find('.details:visible').length, 0, 'details initially hidden');
  dd.find('.read-more a').trigger('click');
  equal(dd.find('.details:visible').length, 1, 'details visible on click');
  setTimeout(function() {
    equal(dd.find('.details:visible').length, 0, 'details hidden again after timer');
    equal(dd.find('.read-more:visible').length, 1, 'read-more visible again after timer');
    start();
  }, 850);

});


/* EVENT HANDLING */
module('event handling', {
  setup: function() {
    this.dd = $('dl.expander').find('dd').first().expander({collapseSpeed: 0});
  }
});

test('click events', function() {
  var dd = this.dd;
  dd.find('.read-more a').triggerHandler('click');
  ok(dd.find('.read-more a').is(':hidden'), 'read-more link hides after being clicked');
  ok(dd.find('.details').is(':visible'), 'details are shown after clicking read-more link');
  ok(dd.find('.read-less').is(':visible'), 'read-less is shown after clicking read-more link');

  dd.find('.read-less a').triggerHandler('click');

  equal(dd.find('.read-less a:hidden').length, 1, 'read-less link hides after being clicked');
  equal(dd.find('.details:hidden').length, 1, 'details are hidden after clicking read-less link');
  equal(dd.find('.read-more:visible').length, 1, 'read-more is shown after clicking read-less link');
});
test('destroy expander', function() {
  expect(5);
  var dd = this.dd;
  dd.expander('destroy');
  equal(dd.find('.read-more').length, 0, 'read-more element removed');
  equal(dd.find('.read-less').length, 0, 'read-less element removed');
  equal(dd.find('.details').length, 0, 'details tag removed');
  ok( (/^\s*Beatrice's Answer/).test(dd.text()), 'summary text preserved' );
  ok( (/Much Ado About Nothing/).test(dd.text()), 'detail text preserved' );
});

/* MULTIPLE BLOCKS */
module('multiple blocks', {
  setup: function() {
    this.ex = $('#hello').expander();
  }
});

test('basic element creation', function() {

  equal(this.ex.find('div.details').length, 1, 'created detail');
  equal(this.ex.find('div.summary').length, 1, 'created summary');
});

test('text slicing with word boundaries', function() {
  this.ex.find('.read-more').remove();
  var txt = $.trim( this.ex.find('div.summary').text() );

  equal(txt.length, 97, 'sliced summary text to proper length');
});

test('destroy expander', function() {
  expect(6);
  this.ex.expander('destroy');
  equal(this.ex.find('.read-more').length, 0, 'read-more element removed');
  equal(this.ex.find('.read-less').length, 0, 'read-less element removed');
  equal(this.ex.find('.details').length, 0, 'details tag removed');
  equal(this.ex.find('.summary').length, 0, 'summary element removed');
  ok( (/^\s*Beatrice's Answer/).test(this.ex.text()), 'summary text preserved' );
  ok( (/Much Ado About Nothing/).test(this.ex.text()), 'detail text preserved' );
});

/* ODD HTML */
module('odd html', {
  setup: function() {
    this.zzz = $('#zzz').expander({widow: 0, preserveWords: false});
    this.endinghr = $('.long-description').expander({
      userCollapseText: '&and; view less &and;',
      expandText: 'continue reading',
      slicePoint: $('.long-description').data("slice-point")
    });
    this.st = $('#sametag').expander();
    this.ampbr = $('#ampbr').expander();
  }
});
test('non-English characters', function() {
  var nonEng = $('#non-eng').expander();
  nonEng.find('.read-more').remove();
  nonEng.find('.details').remove();
  var txtLength = $.trim(nonEng.text()).length;

  equal(txtLength, 97, 'sliced summary text to proper length, even with non-English characters');

});
test('single long string, no child elements', function() {
  equal(this.zzz.find('.details').length, 1, 'created detail');
  this.zzz.find('.read-more, .details').remove();
  equal(this.zzz.text().length, 100, 'split at 100 characters');
});

test('summary ends with hr element', function() {
  expect(3);
  var hr = this.endinghr.find('.read-more').prev()[0];
  equal(this.endinghr.find('.summary').length, 1, 'summary is inserted');
  equal(this.endinghr.find('.read-more').length, 1, 'more link is inserted');
  equal(hr && hr.nodeName, 'HR', 'more link is inserted directly after self-closing tag');
});

test('same tag', function() {
  expect(2);
  equal(this.st.find('b').length, 2, 'retains correct total &lt;b&gt;');
  equal(this.st.find('.details').find('b').length, 1, 'details have correct total &lt;b&gt;');
});

test('ampersands and line breaks', function() {
  expect(3);
  var summ = '';
  equal(this.ampbr.find('br').length, 4, 'retains correct total number of ampersands');
  equal(this.ampbr.find('.details').length, 1, 'summary/detail have correct number of ampersands');
  this.ampbr.find('.details').remove();
  this.ampbr.find('.read-more').remove();
  this.ampbr.find('.read-less').remove();
  summ = $.trim( this.ampbr.text() );
  equal(summ.slice(-4), 'Test', 'splits successfully on ampersands');
});

module('Preset Elements', {
  setup: function() {
    this.li = $('#presets').children().expander();
  }
});

test('shorter than slicePoint but more/less/detail preset', function() {
  var li = this.li.eq(0);
  equal(li.find('span.details').length, 1, 'kept one detail');

  equal(li.find('span.read-more').length, 1, 'kept one read-more');
  ok(li.find('span.read-more').is(':visible'), 'read-more initially visible');

  equal(li.find('span.read-less').length, 1, 'created one read-less');
  ok(li.find('span.read-less').is(':hidden'), 'read-less initially hidden');

});

test('multi-block with only detail preset', function() {
  var li = this.li.eq(1);
  equal(li.find('.details').length, 1, 'kept one detail');
  equal(li.find('div.summary').length, 1, 'created one summary');

  equal(li.find('span.read-more').length, 1, 'created one read-more');
  ok(li.find('span.read-more').is(':visible'), 'read-more initially visible');

  equal(li.find('span.read-less').length, 1, 'created one read-less');
  ok(li.find('span.read-less').is(':hidden'), 'read-less initially hidden');

});
