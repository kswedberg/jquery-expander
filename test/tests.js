    // @ts-nocheck
/* global QUnit:false */

/* SINGLE BLOCK BASICS */
QUnit.module('single block', {
  beforeEach: function() {
    this.ex = $('dl.expander');
    this.dd = this.ex.find('dd');

    var ddLengths = this.dd.map(function() {
      return $.trim($(this).text()).length;
    }).get();

    this.msg = function(index, actual, pre) {
      pre = pre || 'sliced summary text to proper length: ';

      return pre + ddLengths[index] + ' -> ' + actual;
    };
  }
});

QUnit.test('basic element creation', function(assert) {
  this.dd.expander({preserveWords: false});

  assert.equal(this.ex.find('.summary').length, 0, 'no summary containers for content with no block elements');
  assert.equal(this.dd.length - this.ex.find('.details').length, 1, 'all but one dd get expander treatment');
  assert.equal(this.dd.length - this.ex.find('.read-more').length, 1, 'all but one dd get read-more link');
});

QUnit.test('text slicing without preserving word boundaries', function(assert) {
  var dds = this.dd;
  var msg = this.msg;

  dds.expander({preserveWords: false});
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();

  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length;
    var slicePoint = index === dds.length - 1 ? 92 : 100;

    assert.equal(txtLength, slicePoint, msg(index, txtLength));
  });
});

QUnit.test('text slicing with word boundaries', function(assert) {
  var dds = this.dd;
  var msg = this.msg;

  dds.expander();
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();

  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length;
    var slicePoint = index === dds.length - 1 ? 92 : 97;

    assert.equal(txtLength, slicePoint, msg(index, txtLength));
  });
});

QUnit.test('slicePoint 200, without preserving word boundaries', function(assert) {
  var dds = this.dd;
  var msg = this.msg;

  dds.expander({slicePoint: 200, preserveWords: false});
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();

  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length;
    var slicePoint = index === dds.length - 1 ? 92 : 200;

    assert.equal(txtLength, slicePoint, msg(index, txtLength));
  });
});

QUnit.test('slicePoint 50, without preserving word boundaries', function(assert) {
  var dds = this.dd;
  var msg = this.msg;
  var slicePoint = 50;

  dds.expander({slicePoint: slicePoint, preserveWords: false});
  this.ex.find('.details').remove();
  this.ex.find('.read-more').remove();

  dds.each(function(index) {
    var txtLength = $.trim($(this).text()).length;

    assert.equal(txtLength, slicePoint, msg(index, txtLength));
  });
});
QUnit.test('slicePoint 10, without preserving word boundaries', function(assert) {
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

  assert.equal(txtLength, slicePoint, 'div.kriskoon sliced to proper length: ' + slicePoint);
});

QUnit.test('hides the right elements', function(assert) {
  var dd = this.dd.eq(1);

  dd.expander();

  assert.ok(dd.find('.details').is(':hidden'), 'details div is hidden');
  assert.ok(dd.find('.read-more a').is(':visible'), 'read-more link is visible');
  assert.ok(dd.find('.read-less a').is(':hidden'), 'read-less link is hidden');

});

/* PLUGIN OPTIONS */
QUnit.module('options', {
  beforeEach: function() {
    this.ex = $('dl.options');
    this.dds = this.ex.find('dd');
    this.nowidow = $('#nowidow');
    this.sliceonbreak = $('#sliceonbreak').expander({sliceOn: '<br'});
    this.sliceonchar = $('#sliceonchar').expander({sliceOn: '~'});
    this.sliceabort = $('#sliceabort').expander({sliceOn: '<br'});
    this.slicenoabort = $('#sliceNOabort').expander({sliceOn: '~'});
    this.wordcountesc = $('#wordcountesc').expander({showWordCount: true});
    this.wordcountsp = $('#wordcountsp').expander({showWordCount: true});
    this.whitespace = $('#preserveWhitespace').expander({normalizeWhitespace: false, slicePoint: 20});
    this.startExpanded = $('#startExpanded').expander({startExpanded: true});

    this.sliceonmoreinfo = $('#sliceonmoreinfo').expander({
      slicePoint: 500,
      sliceOn: '<span id="more-',
      expandText: 'More <span class="chevron-down"></span>',
      expandPrefix: '',
      onSlice: function() {
        $('#sliceonmoreinfo .summary').css({display: 'block'});
      }
    });
  },
  afterEach: function() {
    this.wordcountesc.expander('destroy');
    this.wordcountsp.expander('destroy');
  }
});

QUnit.test('no white space normalization', function(assert) {
  assert.equal(this.whitespace.text().indexOf('\n') > -1, true, 'correctly preserves whitespace');
});

QUnit.test('widow', function(assert) {
  this.dds.expander({widow: 5});
  this.nowidow.expander({widow: 0, slicePoint: 300});
  var secondDetails = this.dds.eq(1).find('.details');

  // remove the  "read-less" element before checking word length of details element
  secondDetails.find('.read-less').remove();

  // trim the detail text (because we do so in the plugin) before counting the words
  var secondDetailText = $.trim(secondDetails.text());

  assert.equal(this.dds.first().find('.details').length, 0, 'first dd ignored due to widow');
  assert.equal(this.dds.eq(1).find('.details').length, 1, '2nd dd widow long enough');
  assert.equal(secondDetailText.split(/\s+/).length, 6, '2nd dd has 6 words');

  assert.equal(this.nowidow.find('.read-more').length, 0, 'no read-more, even with widow: 0; fixes #17');
  assert.equal(this.nowidow.find('.details').length, 0, 'no details, even with widow: 0; fixes #17');

});
QUnit.test('text and class names', function(assert) {
  var dd = this.dds.first().expander({
    slicePoint: 80,
    expandText: 'foo', // 'read more',
    expandPrefix: '', // '&hellip; ',
    detailClass: 'expd', // 'details',
    moreClass: 'more', // 'read-more',
    lessClass: 'less', // 'read-less',
    moreLinkClass: 'linkMore', // 'more-link'
    lessLinkClass: 'linkLess' // 'less-link'
  });

  assert.equal(dd.find('.more').length, 1, 'read more class changed');
  assert.equal(dd.find('.read-more').length, 0, 'read more class changed');
  assert.equal(dd.find('.less').length, 1, 'read less class changed');
  assert.equal(dd.find('.read-less').length, 0, 'read less class changed');
  assert.equal(dd.find('.linkMore').length, 1, 'more link class changed');
  assert.equal(dd.find('.more-link').length, 0, 'more link class changed');
  assert.equal(dd.find('.linkLess').length, 1, 'less link class changed');
  assert.equal(dd.find('.less-link').length, 0, 'less link class changed');
  assert.equal(dd.find('.expd').length, 1, 'details class changed');
  assert.equal(dd.find('.details').length, 0, 'details class changed');
  assert.equal(dd.find('.more a').text(), 'foo', 'expandText changed');
  assert.equal(dd.find('.more').text(), 'foo', 'expandPrefix changed');
});

QUnit.test('multiple class names', function(assert) {
  var dd = this.dds.first().expander({
    moreClass: 'm1 m2', // 'read-more',
    lessClass: 'l1 l2' // 'read-less'
  });

  assert.equal(dd.find('.m1')[0].className, 'm1 m2', 'read more class changed');
  assert.equal(dd.find('.l1')[0].className, 'l1 l2', 'read more class changed');

  dd.find('.m1 a').triggerHandler('click');

  assert.ok(dd.find('.m1.m2 a').is(':hidden'), 'multi-read-more link hides after being clicked');
  assert.ok(dd.find('.details').is(':visible'), 'details are shown after clicking read-more link');
  assert.ok(dd.find('.l1.l2').is(':visible'), 'multi-read-less class is shown after clicking read-more link');

});
QUnit.test('userCollapse false', function(assert) {
  var dd = this.dds.eq(2).expander({userCollapse: false});

  assert.equal(dd.find('.details').length, 1, 'has details');
  assert.equal(dd.find('.read-more').length, 1, 'has "read more"');
  assert.equal(dd.find('.read-less').length, 0, 'does NOT have user-collapse "read less"');
});

QUnit.test('auto collapse', function(assert) {
  var dd = this.dds.eq(2).expander({collapseSpeed: 0, collapseTimer: 400});
  var done = assert.async();

  assert.equal(dd.find('.details:visible').length, 0, 'details initially hidden');

  dd.find('.read-more a').trigger('click');

  assert.equal(dd.find('.details:visible').length, 1, 'details visible on click');

  setTimeout(function() {
    assert.equal(dd.find('.details:visible').length, 0, 'details hidden again after timer');
    assert.equal(dd.find('.read-more:visible').length, 1, 'read-more visible again after timer');
    done();
  }, 850);

});

QUnit.test('accurate word counting', function(assert) {
  assert.expect(2);
  var countIndex = this.wordcountesc.text().search('words');

  assert.equal(this.wordcountesc.text().slice(countIndex - 3, countIndex + 6), '(6 words)', 'ignores common free-standing html escapes');

  countIndex = this.wordcountsp.text().search('words');
  assert.equal(this.wordcountsp.text().slice(countIndex - 3, countIndex + 6), '(6 words)', 'ignores double and triple spaces, and non-word characters');
});

QUnit.test('startExpanded', function(assert) {
  assert.expect(4);

  var details = this.startExpanded.find('.details');
  var readMore = this.startExpanded.find('.read-more');
  var readLess = this.startExpanded.find('.read-less');

  assert.equal(details.length, 1, 'startExpanded details exist');
  assert.equal(details.is(':visible'), true, 'startExpanded details are visible');
  assert.equal(readMore.is(':hidden'), true, 'startExpanded read-more link is hidden');
  assert.equal(readLess.is(':visible'), true, 'startExpanded read-less link is visible');
});

QUnit.test('sliceOn', function(assert) {
  assert.expect(5);
  this.sliceonmoreinfo.find('.summary').find('.read-more').remove();

  var sliceSummaryText = this.sliceonmoreinfo.find('.summary').text().replace(/\s+$/, '');
  var expectedSummaryText = 'Welcome to my website. I am a Canadian-born multidisciplinary designer, creative director and full-stack developer based in Dallas Texas, U.S. With over 15 years of experience in visual communications and web development, I have created and maintained numerous projects for various recognizable brands in North America. For a more detailed glimpse of my work history download my resume.';

  var sliceIndex = this.sliceonbreak.text().search('read');

  assert.equal(this.sliceonbreak.text().slice(0, sliceIndex).length, '57', 'find and slice before br tag');

  sliceIndex = this.sliceonchar.text().search('read');
  assert.equal(this.sliceonchar.text().slice(0, sliceIndex).length, '65', 'find and slice before arbitrary \'~\'');

  sliceIndex = this.sliceabort.text().search('read');
  assert.equal(this.sliceabort.text().slice(0, sliceIndex).length, '98', 'find and slice long-after br tag nested in anchor tags');

  sliceIndex = $.trim(this.slicenoabort.html() || '').indexOf('read');
  assert.equal(this.slicenoabort.text().slice(0, sliceIndex).length, '102', 'adjust slicePoint for html tags in summaryText');

  assert.equal(sliceSummaryText, expectedSummaryText, 'adjust slicePoint for html tags in summaryText when sliceOn has html');
});

/* EVENT HANDLING */
QUnit.module('event handling', {
  beforeEach: function() {
    this.dd = $('dl.expander').find('dd').first().expander({collapseSpeed: 0});
  }
});

QUnit.test('click events', function(assert) {
  var dd = this.dd;

  dd.find('.read-more a').triggerHandler('click');

  assert.ok(dd.find('.read-more a').is(':hidden'), 'read-more link hides after being clicked');
  assert.ok(dd.find('.details').is(':visible'), 'details are shown after clicking read-more link');
  assert.ok(dd.find('.read-less').is(':visible'), 'read-less is shown after clicking read-more link');

  dd.find('.read-less a').triggerHandler('click');

  assert.equal(dd.find('.read-less a:hidden').length, 1, 'read-less link hides after being clicked');
  assert.equal(dd.find('.details:hidden').length, 1, 'details are hidden after clicking read-less link');
  assert.equal(dd.find('.read-more:visible').length, 1, 'read-more is shown after clicking read-less link');
});

QUnit.test('destroy expander', function(assert) {
  assert.expect(5);
  var dd = this.dd;

  dd.expander('destroy');

  assert.equal(dd.find('.read-more').length, 0, 'read-more element removed');
  assert.equal(dd.find('.read-less').length, 0, 'read-less element removed');
  assert.equal(dd.find('.details').length, 0, 'details tag removed');
  assert.ok((/^\s*Beatrice's Answer/).test(dd.text()), 'summary text preserved');
  assert.ok((/Much Ado About Nothing/).test(dd.text()), 'detail text preserved');
});

/* MULTIPLE BLOCKS */
QUnit.module('multiple blocks', {
  beforeEach: function() {
    this.ex = $('#hello').expander();
    this.anchor = $('#anchor-test').expander();
  }
});

QUnit.test('basic element creation', function(assert) {
  assert.equal(this.ex.find('div.details').length, 1, 'created detail');
  assert.equal(this.ex.find('div.summary').length, 1, 'created summary');
});

QUnit.test('text slicing with word boundaries', function(assert) {
  this.ex.find('.read-more').remove();
  var txt = $.trim(this.ex.find('div.summary').text());

  assert.equal(txt.length, 97, 'sliced summary text to proper length');
});

QUnit.test('Read more link not nested in closing link', function(assert) {

  if ($('.read-more .more-link').length === 1) {
    assert.ok(false);
  } else {
    assert.ok(true);
  }
});

QUnit.test('destroy expander', function(assert) {
  assert.expect(6);
  this.ex.expander('destroy');

  assert.equal(this.ex.find('.read-more').length, 0, 'read-more element removed');
  assert.equal(this.ex.find('.read-less').length, 0, 'read-less element removed');
  assert.equal(this.ex.find('.details').length, 0, 'details tag removed');
  assert.equal(this.ex.find('.summary').length, 0, 'summary element removed');
  assert.ok((/^\s*Beatrice's Answer/).test(this.ex.text()), 'summary text preserved');
  assert.ok((/Much Ado About Nothing/).test(this.ex.text()), 'detail text preserved');
});

/* ODD HTML */
QUnit.module('odd html', {
  beforeEach: function() {
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
  afterEach: function() {
    this.endinghr.expander('destroy');
    this.sametag.expander('destroy');
    this.ampbr.expander('destroy');
    this.htmlescape.expander('destroy');
    this.preserveNumbers.expander('destroy');

    $('#hidden-container').children('p').expander('destroy');
  }
});

QUnit.test('non-English characters', function(assert) {
  var chineseLength, txtLength, chinese;
  var nonEng = $('#non-eng').expander();

  nonEng.find('.read-more').remove();
  nonEng.find('.details').remove();

  txtLength = $.trim(nonEng.text()).length;

  chinese = $('#chinese').expander({
    preserveWords: false,
    widow: 0
  });

  chinese.find('.read-more').remove();
  chinese.find('.details').remove();

  chineseLength = $.trim(chinese.text()).length;

  assert.equal(txtLength, 97, 'sliced summary text to proper length, even with non-English characters');
  assert.equal(chineseLength, 100, 'sliced summary text to proper length with Chinese characters');
});

QUnit.test('single long string, no child elements', function(assert) {
  assert.equal(this.zzz.find('.details').length, 1, 'created detail');

  this.zzz.find('.read-more, .details').remove();

  assert.equal($.trim(this.zzz.text()).length, 100, 'split at 100 characters');
});

QUnit.test('same tag', function(assert) {
  assert.expect(2);

  assert.equal(this.sametag.find('b').length, 2, 'retains correct total &lt;b&gt;');
  assert.equal(this.sametag.find('.details').find('b').length, 1, 'details have correct total &lt;b&gt;');
});

QUnit.test('ampersands and line breaks', function(assert) {
  assert.expect(3);
  var summ = '';

  assert.equal(this.ampbr.find('br').length, 4, 'retains correct total number of ampersands');
  assert.equal(this.ampbr.find('.details').length, 1, 'summary/detail have correct number of ampersands');

  this.ampbr.find('.details').remove();
  this.ampbr.find('.read-more').remove();
  this.ampbr.find('.read-less').remove();

  summ = $.trim(this.ampbr.text());

  assert.equal(summ.slice(-4), 'Test', 'splits successfully on ampersands');
});

QUnit.test('split html escapes', function(assert) {
  assert.expect(1);

  assert.equal(this.htmlescape.text().charAt(97) !== '&', true, 'correctly shifts stray "nbsp;" out of detailText');
});

QUnit.test('preserve numbers as words', function(assert) {
  assert.equal(this.preserveNumbers.find('.details').length, 1, 'created detail');

  this.preserveNumbers.find('.read-more, .details').remove();

  assert.equal($.trim(this.preserveNumbers.text()).length, 27, 'split at 27 characters, preserving the long number');
});

/* PRESET ELEMENTS */
QUnit.module('Preset Elements', {
  beforeEach: function() {
    this.li = $('#presets').children().expander();
  },
  afterEach: function() {
    this.li.expander('destroy');
  }
});

QUnit.test('shorter than slicePoint but more/less/detail preset', function(assert) {
  var li = this.li.eq(0);

  assert.equal(li.find('span.details').length, 1, 'kept one detail');

  assert.equal(li.find('span.read-more').length, 1, 'kept one read-more');
  assert.ok(li.find('span.read-more').is(':visible'), 'read-more initially visible');

  assert.equal(li.find('span.read-less').length, 1, 'created one read-less');
  assert.ok(li.find('span.read-less').is(':hidden'), 'read-less initially hidden');

});

QUnit.test('multi-block with only detail preset', function(assert) {
  var li = this.li.eq(1);

  assert.equal(li.find('.details').length, 1, 'kept one detail');
  assert.equal(li.find('div.summary').length, 1, 'created one summary');

  assert.equal(li.find('span.read-more').length, 1, 'created one read-more');
  assert.ok(li.find('span.read-more').is(':visible'), 'read-more initially visible');

  assert.equal(li.find('span.read-less').length, 1, 'created one read-less');
  assert.ok(li.find('span.read-less').is(':hidden'), 'read-less initially hidden');

});
