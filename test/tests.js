/*global module:false, test:false, equal:false, ok:false, asyncTest:false,start:false, expect: false */

/* SINGLE BLOCK BASICS */
module('single block', {
  setup: function() {
    this.ex = $('dl.expander');
    this.dd = this.ex.find('dd');

    var ddLengths = this.dd.map(function() {
      return $.trim( $(this).text() ).length;
    }).get();

    this.msg = function(index, actual, pre) {
      pre = pre || 'sliced summary text to proper length: ';

      return pre + ddLengths[index] + ' -> ' + actual;
    };
  }
});
test('basic element creation', function() {
  this.dd.expander({preserveWords: false});
  equal(this.ex.find('.summary').length, 0, 'no summary containers for content with no block elements');
  equal(this.dd.length - this.ex.find('.details').length, 1, 'all but one dd get expander treatment');
  equal(this.dd.length - this.ex.find('.read-more').length, 1, 'all but one dd get read-more link');

});

test('text slicing without preserving word boundaries', function() {
  var dds = this.dd,
      msg = this.msg;

  dds.expander({preserveWords: false});
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();

  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length,
        slicePoint = index === dds.length - 1 ? 92 : 100;

    equal(txtLength, slicePoint, msg(index, txtLength));
  });
});

test('text slicing with word boundaries', function() {
  var dds = this.dd,
      msg = this.msg;

  dds.expander();
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();
  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length,
        slicePoint = index === dds.length - 1 ? 92 : 97;

    equal(txtLength, slicePoint, msg(index, txtLength));
  });
});

test('slicePoint 200, without preserving word boundaries', function() {
  var dds = this.dd,
      msg = this.msg;
  dds.expander({slicePoint: 200, preserveWords: false});
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();
  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length,
        slicePoint = index === dds.length - 1 ? 92 : 200;

    equal(txtLength, slicePoint, msg(index, txtLength));
  });
});

test('slicePoint 50, without preserving word boundaries', function() {
  var dds = this.dd;
  var msg = this.msg;
  var slicePoint = 50;
  dds.expander({slicePoint: slicePoint, preserveWords: false});
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();
  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length;

    equal(txtLength, slicePoint, msg(index, txtLength));
  });
});
test('slicePoint 10, without preserving word boundaries', function() {
  var txtLength;
  var slicePoint = 10;
  var $div = $('div.kriskoon');
  $div.expander({
    slicePoint: slicePoint,
    widow: 0,
    preserveWords: false
  });
  $div.find('.details').remove();
  $div.find('.read-more').remove();
  txtLength = $.trim($div.text()).length;

  equal(txtLength, slicePoint, 'div.kriskoon sliced to proper length: ' + slicePoint);
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
    this.sliceonbreak = $('#sliceonbreak').expander({sliceOn: '<br'});
    this.sliceonchar = $('#sliceonchar').expander({sliceOn: '~'});
    this.sliceabort = $('#sliceabort').expander({sliceOn: '<br'});
    this.slicenoabort = $('#sliceNOabort').expander({sliceOn: '~'});
    this.wordcountesc = $('#wordcountesc').expander({showWordCount: true});
    this.wordcountsp = $('#wordcountsp').expander({showWordCount: true});
	  this.whitespace = $('#preserveWhitespace').expander({normalizeWhitespace: false, slicePoint:20});

    this.sliceonmoreinfo = $('#sliceonmoreinfo').expander({
      slicePoint: 500,
      // userCollapse: false,
      // expandEffect: 'show',
      // expandSpeed: 0,
      sliceOn: '<span id="more-',
      expandText: 'More <span class="chevron-down"></span>',
      expandPrefix: '',
      onSlice: function() {
        $('#sliceonmoreinfo .summary').css({display: 'block'});
      }
    });
  },
  teardown: function() {
    this.wordcountesc.expander('destroy');
    this.wordcountsp.expander('destroy');
  }
});

test('no white space normalization', function() {
	equal((this.whitespace.text().indexOf('\n') > -1), true, 'correctly preserves whitespace');
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
    lessClass:    'less',  //'read-less',
    moreLinkClass: 'linkMore', //'more-link'
    lessLinkClass: 'linkLess' //'less-link'

  });
  equal(dd.find('.more').length, 1, 'read more class changed');
  equal(dd.find('.read-more').length, 0, 'read more class changed');
  equal(dd.find('.less').length, 1, 'read less class changed');
  equal(dd.find('.read-less').length, 0, 'read less class changed');
  equal(dd.find('.linkMore').length, 1, 'more link class changed');
  equal(dd.find('.more-link').length, 0, 'more link class changed');
  equal(dd.find('.linkLess').length, 1, 'less link class changed');
  equal(dd.find('.less-link').length, 0, 'less link class changed');
  equal(dd.find('.expd').length, 1, 'details class changed');
  equal(dd.find('.details').length, 0, 'details class changed');
  equal(dd.find('.more a').text(), 'foo', 'expandText changed');
  equal(dd.find('.more').text(), 'foo', 'expandPrefix changed');
});

test('multiple class names', function() {
  var dd = this.dds.first().expander({
    moreClass:    'm1 m2', //'read-more',
    lessClass:    'l1 l2'  //'read-less'
  });
  equal(dd.find('.m1')[0].className, 'm1 m2', 'read more class changed');
  equal(dd.find('.l1')[0].className, 'l1 l2', 'read more class changed');

  dd.find('.m1 a').triggerHandler('click');

  ok(dd.find('.m1.m2 a').is(':hidden'), 'multi-read-more link hides after being clicked');
  ok(dd.find('.details').is(':visible'), 'details are shown after clicking read-more link');
  ok(dd.find('.l1.l2').is(':visible'), 'multi-read-less class is shown after clicking read-more link');

});
test('userCollapse false', function() {
  var dd = this.dds.eq(2).expander({userCollapse: false});
  equal(dd.find('.details').length, 1, 'has details');
  equal(dd.find('.read-more').length, 1, 'has "read more"');
  equal(dd.find('.read-less').length, 0, 'does NOT have user-collapse "read less"');
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

test('accurate word counting', function() {
  expect(2);
  var countIndex = this.wordcountesc.text().search('words');
  equal( (this.wordcountesc.text().slice(countIndex-3, countIndex+6) ), '(6 words)', 'ignores common free-standing html escapes');

  countIndex = this.wordcountsp.text().search('words');
  equal( (this.wordcountsp.text().slice(countIndex-3, countIndex+6) ), '(6 words)', 'ignores double and triple spaces, and non-word characters');
});
test('sliceOn', function() {
  expect(5);
  this.sliceonmoreinfo.find('.summary').find('.read-more').remove();

  var sliceSummaryText = this.sliceonmoreinfo.find('.summary').text().replace(/\s+$/,'');
  var expectedSummaryText = 'Welcome to my website. I am a Canadian-born multidisciplinary designer, creative director and full-stack developer based in Dallas Texas, U.S. With over 15 years of experience in visual communications and web development, I have created and maintained numerous projects for various recognizable brands in North America. For a more detailed glimpse of my work history download my resume.';

  var sliceIndex = this.sliceonbreak.text().search('read');
  equal( (this.sliceonbreak.text().slice(0, sliceIndex).length ), '57', 'find and slice before br tag');

  sliceIndex = this.sliceonchar.text().search('read');
  equal( (this.sliceonchar.text().slice(0, sliceIndex).length ), '65', 'find and slice before arbitrary \'~\'');

  sliceIndex = this.sliceabort.text().search('read');
  equal( (this.sliceabort.text().slice(0, sliceIndex).length ), '98', 'find and slice long-after br tag nested in anchor tags');

  sliceIndex = $.trim( this.slicenoabort.html() || '' ).indexOf('read');
  equal( (this.slicenoabort.text().slice(0, sliceIndex).length ), '102', 'adjust slicePoint for html tags in summaryText');

  equal( sliceSummaryText, expectedSummaryText, 'adjust slicePoint for html tags in summaryText when sliceOn has html');
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
    this.anchor = $('#anchor-test').expander();
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

test('Read more link not nested in closing link', function() {

  if ($('.read-more .more-link').length === 1) {
    ok(false);
  } else {
    ok(true);
  }
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
      slicePoint: $('.long-description').data('slice-point')
    });

    this.sametag = $('#sametag').expander();
    this.ampbr = $('#ampbr').expander();
    this.htmlescape = $('#htmlescape').expander();

    $('#hidden-container').children('p').expander();
    this.hiddenContainer = $('#hidden-container');
    this.preserveNumbers = $('#preserveNumbers').expander({
      slicePoint: 35,
      preserveWords: true
    });
  },
  teardown: function() {
    this.endinghr.expander('destroy');
    this.sametag.expander('destroy');
    this.ampbr.expander('destroy');
    this.htmlescape.expander('destroy');
    this.preserveNumbers.expander('destroy');

    $('#hidden-container').children('p').expander('destroy');
  }
});

test('non-English characters', function() {
  var nonEng = $('#non-eng').expander();
  nonEng.find('.read-more').remove();
  nonEng.find('.details').remove();
  var txtLength = $.trim(nonEng.text()).length;

  var chinese = $('#chinese').expander({
    preserveWords: false,
    widow: 0
  });
  chinese.find('.read-more').remove();
  chinese.find('.details').remove();
  var chineseLength = $.trim(chinese.text()).length;

  equal(txtLength, 97, 'sliced summary text to proper length, even with non-English characters');
  equal(chineseLength, 100, 'sliced summary text to proper length with Chinese characters');
});

test('single long string, no child elements', function() {
  equal(this.zzz.find('.details').length, 1, 'created detail');
  this.zzz.find('.read-more, .details').remove();
  equal( $.trim(this.zzz.text()).length, 100, 'split at 100 characters');
});

test('same tag', function() {
  expect(2);
  equal(this.sametag.find('b').length, 2, 'retains correct total &lt;b&gt;');
  equal(this.sametag.find('.details').find('b').length, 1, 'details have correct total &lt;b&gt;');
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

// test('hidden container', function() {
//   this.hiddenContainer.css({display: 'block'});

// });

test('split html escapes', function() {
  expect(1);
  equal(( this.htmlescape.text().charAt(97) !== '&'), true, 'correctly shifts stray "nbsp;" out of detailText');
});

test('preserve numbers as words', function() {
  equal(this.preserveNumbers.find('.details').length, 1, 'created detail');
  this.preserveNumbers.find('.read-more, .details').remove();
  equal( $.trim(this.preserveNumbers.text()).length, 27, 'split at 27 characters, preserving the long number');
});


/* PRESET ELEMENTS */
module('Preset Elements', {
  setup: function() {
    this.li = $('#presets').children().expander();
  },
  teardown: function() {
    this.li.expander('destroy');
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
