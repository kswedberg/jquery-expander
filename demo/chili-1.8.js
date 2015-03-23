/*  
===============================================================================
Chili is the jQuery code highlighter plugin
...............................................................................
                                               Copyright 2007 / Andrea Ercolino
-------------------------------------------------------------------------------
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/chili/
===============================================================================

===============================================================================
Metaobjects is the jQuery metadata plugin on steroids
...............................................................................
                                               Copyright 2007 / Andrea Ercolino
-------------------------------------------------------------------------------
LICENSE: http://www.opensource.org/licenses/mit-license.php
WEBSITE: http://noteslog.com/metaobjects/
===============================================================================
*/

//-----------------------------------------------------------------------------
( function($) {

ChiliBook = { //implied global

	  version:            "1.8" // 2007-05-13

	, automatic:          true
	, automaticSelector:  "code"

	, codeLanguage:       function( el ) {
		var recipeName = $( el ).attr( "class" );
		return recipeName ? recipeName : '';
	}

	, metadataSelector:   "object.chili"

	, recipeLoading:      false
	, recipeFolder:       "" // used like: recipeFolder + recipeName + '.js'
	, stylesheetLoading:  false
	, stylesheetFolder:   "" // used like: stylesheetFolder + recipeName + '.css'

	, defaultReplacement: '<span class="$0">$$</span>'

	, replaceSpace:       "&#160;"                   // use an empty string for not replacing 
	, replaceTab:         "&#160;&#160;&#160;&#160;" // use an empty string for not replacing
	//, replaceNewLine:     "&#160;<br/>"              // use an empty string for not replacing
	, replaceNewLine:     null             // use an empty string for not replacing

	, recipes:            {} //repository
	, queue:              {} //register

	//fix for IE: copy of PREformatted text strips off all html, losing newlines
	, preFixCopy:         document.selection && document.selection.createRange
	, preContent:         ""
	, preElement:         null
};


$.metaobjects = function( options ) { 
 
    options = $.extend( { 
          context:  document 
        , clean:    true 
        , selector: 'object.metaobject' 
    }, options ); 
 
    function jsValue( value ) { 
        eval( 'value = ' + value + ";" ); 
        return value; 
    } 
 
    return $( options.selector, options.context ) 
    .each( function() { 
 
        var settings = { target: this.parentNode }; 
        $( '> param[name="metaparam"]', this ) 
        .each( function() {  
            $.extend( settings, jsValue( this.value ) ); 
        } ); 
 
        $( '> param', this ) 
        .not( '[name="metaparam"]' ) 
        .each( function() { 
            var name = this.name, value = jsValue( this.value ); 
            $( settings.target ) 
            .each( function() { 
                this[ name ] = value; 
            } ); 
        } ); 
 
        if( options.clean ) { 
            $( this ).remove(); 
        } 
    } ); 
}; 

$.fn.chili = function( options ) {
	var book = $.extend( {}, ChiliBook, options || {} );

	function cook( ingredients, recipe ) {

		function prepareStep( stepName, step ) {
			var exp = ( typeof step.exp == "string" ) ? step.exp : step.exp.source;
			steps.push( {
				stepName: stepName,
				 exp: "(" + exp + ")",
				 length: 1                         // add 1 to account for the newly added parentheses
					+ (exp                          // count number of submatches in here
						.replace( /\\./g, "%" )     // disable any escaped character
						.replace( /\[.*?\]/g, "%" ) // disable any character class
						.match( /\((?!\?)/g )       // match any open parenthesis, not followed by a ?
					|| []                           // make sure it is an empty array if there are no matches
					).length                        // get the number of matches
				, replacement: (step.replacement) ? step.replacement : book.defaultReplacement 
			} );
		} // function prepareStep( stepName, step )
	
		function knowHow() {
			var prevLength = 0;
			var exps = new Array;
			for (var i = 0; i < steps.length; i++) {
				var exp = steps[ i ].exp;
				// adjust backreferences
				exp = exp.replace( /\\\\|\\(\d+)/g, function( m, aNum ) {
					return !aNum ? m : "\\" + ( prevLength + 1 + parseInt( aNum, 10 ) );
				} );
				exps.push( exp );
				prevLength += steps[ i ].length;
			}
			var source = exps.join( "|" );
			return new RegExp( source, (recipe.ignoreCase) ? "gi" : "g" );
		} // function knowHow()

		function escapeHTML( str ) {
			return str.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" );
		} // function escapeHTML( str )

		function replaceSpaces( str ) {
			return str.replace( / +/g, function( spaces ) {
				return spaces.replace( / /g, replaceSpace );
			} );
		} // function replaceSpaces( str )

		function filter( str ) {
			str = escapeHTML( str );
			if( replaceSpace ) {
				str = replaceSpaces( str );
			}
			return str;
		} // function filter( str )

		function chef( matched ) {
			var i = 0;  // iterate steps
			var j = 1;	// iterate chef's arguments
			var step;
			while( step = steps[ i++ ] ) {
				var aux = arguments; // this unmasks chef's arguments inside the next function
				if( aux[ j ] ) {
					var pattern = /(\\\$)|(?:\$\$)|(?:\$(\d+))/g;
					var replacement = step.replacement
						.replace( pattern, function( m, escaped, K ) {
							var bit = '';
							if( escaped ) {       /* \$ */ 
								return "$";
							}
							else if( !K ) {       /* $$ */ 
								return filter( aux[ j ] );
							}
							else if( K == "0" ) { /* $0 */ 
								return step.stepName;
							}
							else {                /* $K */
								return filter( aux[ j + parseInt( K, 10 ) ] );
							}
						} );

					var offset = arguments[ arguments.length - 2 ];
					var input = arguments[ arguments.length - 1 ];
					var unmatched = input.substring( lastIndex, offset );
					lastIndex = offset + matched.length; // lastIndex for the next call to chef

					perfect += filter( unmatched ) + replacement; // use perfect for all the replacing
					return replacement;
				} 
				else {
					j+= step.length;
				}
			}
		} // function chef( matched )

		var replaceSpace = book.replaceSpace;
		var steps = new Array;
		for( var stepName in recipe.steps ) {
			prepareStep( stepName, recipe.steps[ stepName ] );
		}

		var perfect = ""; //replace doesn't provide a handle to the ongoing partially replaced string
		var lastIndex = 0; //regexp.lastIndex is available after a string.match, but not in a string.replace
		ingredients.replace( knowHow(), chef );
		var lastUnmatched = ingredients.substring( lastIndex, ingredients.length );
		perfect += filter( lastUnmatched );

		return perfect;

	} // function cook( ingredients, recipe )

	function checkCSS( stylesheetPath ) {
		if( ! book.queue[ stylesheetPath ] ) {
			var link = 
				  '<link rel="stylesheet" type="text/css"'
				+ ' href="' + stylesheetPath + '">'
			;
			book.queue[ stylesheetPath ] = true;
			if( $.browser.msie ) {
				var domLink = document.createElement( link );
				var $domLink = $( domLink );
				$( "head" ).append( $domLink );
			}
			else {
				$( "head" ).append( link );
			}
		}
	} // function checkCSS( recipeName )

	function makeDish( el, recipePath ) {
		var recipe = book.recipes[ recipePath ];
		if( recipe ) {
			var ingredients = el && el.childNodes && el.childNodes[0] && el.childNodes[0].data;
			if( ! ingredients ) {
				ingredients = "";
			}

			// hack for IE: \r is used instead of \n
			ingredients = ingredients.replace(/\r\n?/g, "\n");

			var dish = cook( ingredients, recipe ); // all happens here
		
			if( book.replaceTab ) {
				dish = dish.replace( /\t/g, book.replaceTab );
			}
			if( book.replaceNewLine ) {
				dish = dish.replace( /\n/g, book.replaceNewLine );
			}

			$( el ).html( dish );
			if( ChiliBook.preFixCopy ) {
				$( el )
				.parents()
				.filter( "pre" )
				.bind( "mousedown", function() {
					ChiliBook.preElement = this;
				} )
				.bind( "mouseup", function() {
					if( ChiliBook.preElement == this ) {
						ChiliBook.preContent = document.selection.createRange().htmlText;
					}
				} )
				;
			}
			
		}
	} // function makeDish( el )

	function getPath( recipeName, options ) {
		var settingsDef = {
			  recipeFolder:     book.recipeFolder
			, recipeFile:       recipeName + ".js"
			, stylesheetFolder: book.stylesheetFolder
			, stylesheetFile:   recipeName + ".css"
		};
		var settings;
		if( options && typeof options == "object" ) {
			settings = $.extend( settingsDef, options );
		}
		else {
			settings = settingsDef;
		}
		return {
			  recipe    : settings.recipeFolder     + settings.recipeFile
			, stylesheet: settings.stylesheetFolder + settings.stylesheetFile
		};
	} //function getPath( recipeName, options )

//-----------------------------------------------------------------------------
// initializations
	$.metaobjects( { context: this, selector: book.metadataSelector } );

//-----------------------------------------------------------------------------
// the coloring starts here
	this
	.each( function() {
		var el = this;
		var recipeName = book.codeLanguage( el );
		if( '' != recipeName ) {
			var path = getPath( recipeName, el.chili );
			if( book.recipeLoading || el.chili ) {
				/* dynamic setups come here */
				if( ! book.queue[ path.recipe ] ) {
					/* this is a new recipe to download */
					try {
						book.queue[ path.recipe ] = [ el ];
						$.getJSON( path.recipe, function( recipeLoaded ) {
							recipeLoaded.path = path.recipe;
							book.recipes[ path.recipe ] = recipeLoaded;
							if( book.stylesheetLoading ) {
								checkCSS( path.stylesheet );
							}
							var q = book.queue[ path.recipe ];
							for( var i = 0, iTop = q.length; i < iTop; i++ ) {
								makeDish( q[ i ], path.recipe );
							}
						} );
					}
					catch( recipeNotAvailable ) {
						alert( "the recipe for '" + recipeName + "' was not found in '" + path.recipe + "'" );
					}
				}
				else {
					/* not a new recipe, so just enqueue this element */
					book.queue[ path.recipe ].push( el );
				}
				/* a recipe could have been already downloaded */
				makeDish( el, path.recipe ); 
			}
			else {
				/* static setups come here */
				makeDish( el, path.recipe );
			}
		}
	} );

	return this;
//-----------------------------------------------------------------------------
};

//main
$( function() {

	if( ChiliBook.automatic ) {
		if( ChiliBook.elementPath ) {
			//preserve backward compatibility
			ChiliBook.automaticSelector = ChiliBook.elementPath;
			if( ChiliBook.elementClass ) {
				ChiliBook.codeLanguage = function ( el ) {
					var selectClass = new RegExp( "\\b" + ChiliBook.elementClass + "\\b", "gi" );
					var elClass = $( el ).attr( "class" );
					if( ! elClass ) { 
						return ''; 
					}
					var recipeName = $.trim( elClass.replace( selectClass, "" ) );
					return recipeName;
				};
			}
		}

		$( ChiliBook.automaticSelector ).chili();
	}

	if( ChiliBook.preFixCopy ) {
		function preformatted( text ) {
			if( '' == text ) { 
				return ""; 
			}
			do { 
				var newline_flag = (new Date()).valueOf(); 
			}
			while( text.indexOf( newline_flag ) > -1 );
			text = text.replace( /\<br[^>]*?\>/ig, newline_flag );
			var el = document.createElement( '<pre>' );
			el.innerHTML = text;
			text = el.innerText.replace( new RegExp( newline_flag, "g" ), '\r\n' );
			return text;
		}

		$( "body" )
		.bind( "copy", function() {
			if( '' != ChiliBook.preContent ) {
				window.clipboardData.setData( 'Text', preformatted( ChiliBook.preContent ) );
				event.returnValue = false;
			}
		} )
		.bind( "mousedown", function() {
			ChiliBook.preContent = "";
		} )
		.bind( "mouseup", function() {
			ChiliBook.preElement = null;
		} )
		;
	}

} );

} ) ( jQuery );

ChiliBook.recipes[ "mix.js" ] = {
	steps: {
	  tag     : { exp: /(?:\<\w+)|(?:[^-]?\>)|(?:\<\/\w+\>)|(?:\/\>)/ }
	  , doctype : { exp: /\<\!DOCTYPE([^>]+)?/}
		, jscom   : { exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\// }
		, htcom   : { exp: /\<!--(?:.|\n)*?--\>/ }
		, com     : { exp: /\/\/.*/ }
    , plugin  : { exp: /\.(cluetip|socialize|summarize|textchildren|fancyletter|expander|linkhints)/ }
		, regexp  : { exp: /\/[^\/\\\n]*(?:\\.[^\/\\\n]*)*\/[gim]*/ }
		, string  : { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, numbers : { exp: /\b[+-]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?\b/ }
		, keywords: { exp: /\b(arguments|break|case|catch|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|try|typeof|var|void|while|with)\b/ }
		, global  : { exp: /\b(toString|valueOf|window|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/ }
		, aname   : { exp: /\s+\w+(?=\s*=)/ }
    , avalue  : { exp: /([\"\'])(?:(?:[^\1\\\r\n]*?(?:\1\1|\\.))*[^\1\\\r\n]*?)\1/ }
		, entity  : { exp: /&[\w#]+?;/ }
    , jquery  : { exp: /(\$|jQuery)/  }
	}
};

ChiliBook.recipes[ "xml.js" ] = {
	steps: {
		  htcom   : { exp: /\<!--(?:.|\n)*?--\>/ }
		, string  : { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, numbers : { exp: /\b[+-]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?\b/ }
		, tag     : { exp: /(?:\<\w+)|(?:\>)|(?:\<\/\w+\>)|(?:\/\>)/ }
		, aname   : { exp: /\s+\w+(?=\s*=)/ }
        , avalue  : { exp: /([\"\'])(?:(?:[^\1\\\r\n]*?(?:\1\1|\\.))*[^\1\\\r\n]*?)\1/ }
		, entity  : { exp: /&[\w#]+?;/ }
	}
};

ChiliBook.recipes[ "php.js" ] = {
	steps: {
		  mlcom     : { exp: /\/\*[^*]*\*+([^\/][^*]*\*+)*\// }
		, com       : { exp: /(?:\/\/.*)|(?:[^\\]\#.*)/ }
		, string1   : { exp: /\'[^\'\\]*(?:\\.[^\'\\]*)*\'/ }
		, string2   : { exp: /\"[^\"\\]*(?:\\.[^\"\\]*)*\"/ }
		, value     : { exp: /\b(?:[Nn][Uu][Ll][Ll]|[Tt][Rr][Uu][Ee]|[Ff][Aa][Ll][Ss][Ee])\b/ }
		, number    : { exp: /\b[+-]?(\d*\.?\d+|\d+\.?\d*)([eE][+-]?\d+)?\b/ }
		, const1    : { exp: /\b(?:DEFAULT_INCLUDE_PATH|E_(?:ALL|CO(?:MPILE_(?:ERROR|WARNING)|RE_(?:ERROR|WARNING))|ERROR|NOTICE|PARSE|STRICT|USER_(?:ERROR|NOTICE|WARNING)|WARNING)|P(?:EAR_(?:EXTENSION_DIR|INSTALL_DIR)|HP_(?:BINDIR|CONFIG_FILE_(?:PATH|SCAN_DIR)|DATADIR|E(?:OL|XTENSION_DIR)|INT_(?:MAX|SIZE)|L(?:IBDIR|OCALSTATEDIR)|O(?:S|UTPUT_HANDLER_(?:CONT|END|START))|PREFIX|S(?:API|HLIB_SUFFIX|YSCONFDIR)|VERSION))|__COMPILER_HALT_OFFSET__)\b/ }
		, global    : { exp: /(?:\$GLOBALS|\$_COOKIE|\$_ENV|\$_FILES|\$_GET|\$_POST|\$_REQUEST|\$_SERVER|\$_SESSION|\$php_errormsg)\b/ }
		, keyword   : { exp: /\b(?:__CLASS__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|abstract|and|array|as|break|case|catch|cfunction|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exception|exit|extends|extends|final|for|foreach|function|global|if|implements|include|include_once|interface|isset|list|new|old_function|or|php_user_filter|print|private|protected|public|require|require_once|return|static|switch|this|throw|try|unset|use|var|while|xor)\b/ }
		, variable  : { exp: /\$(\w+)/
			, replacement: '<span class="keyword">$</span><span class="variable">$1</span>'
		}
		, tag       : { exp: /(?:\<\?[Pp][Hh][Pp])|(?:\<\?)|(?:\?\>)/ }
	}
};

ChiliBook.recipes[ "css.js" ] = {
	steps: {
		  mlcom : { exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\// }
		, string: { exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/ }
		, number: { exp: /(?:\b[+-]?(?:\d*\.?\d+|\d+\.?\d*))(?:%|(?:(?:px|pt|em|)\b))/ }
		, attrib: { exp: /\b(?:z-index|x-height|word-spacing|widths|width|widows|white-space|volume|voice-family|visibility|vertical-align|units-per-em|unicode-range|unicode-bidi|text-transform|text-shadow|text-indent|text-decoration|text-align|table-layout|stress|stemv|stemh|src|speech-rate|speak-punctuation|speak-numeral|speak-header|speak|slope|size|right|richness|quotes|position|play-during|pitch-range|pitch|pause-before|pause-after|pause|page-break-inside|page-break-before|page-break-after|page|padding-top|padding-right|padding-left|padding-bottom|padding|overflow|outline-width|outline-style|outline-color|outline|orphans|min-width|min-height|max-width|max-height|mathline|marks|marker-offset|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|height|font-weight|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-family|font|float|empty-cells|elevation|display|direction|descent|definition-src|cursor|cue-before|cue-after|cue|counter-reset|counter-increment|content|color|clip|clear|centerline|caption-side|cap-height|bottom|border-width|border-top-width|border-top-style|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-left-width|border-left-style|border-left-color|border-left|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-color|border-bottom|border|bbox|baseline|background-repeat|background-position|background-image|background-color|background-attachment|background|azimuth|ascent)\b/ }
		, value : { exp: /\b(?:xx-small|xx-large|x-soft|x-small|x-slow|x-low|x-loud|x-large|x-high|x-fast|wider|wait|w-resize|visible|url|uppercase|upper-roman|upper-latin|upper-alpha|underline|ultra-expanded|ultra-condensed|tv|tty|transparent|top|thin|thick|text-top|text-bottom|table-row-group|table-row|table-header-group|table-footer-group|table-column-group|table-column|table-cell|table-caption|sw-resize|super|sub|status-bar|static|square|spell-out|speech|solid|soft|smaller|small-caption|small-caps|small|slower|slow|silent|show|separate|semi-expanded|semi-condensed|se-resize|scroll|screen|s-resize|run-in|rtl|rightwards|right-side|right|ridge|rgb|repeat-y|repeat-x|repeat|relative|projection|print|pre|portrait|pointer|overline|outside|outset|open-quote|once|oblique|nw-resize|nowrap|normal|none|no-repeat|no-open-quote|no-close-quote|ne-resize|narrower|n-resize|move|mix|middle|message-box|medium|marker|ltr|lowercase|lower-roman|lower-latin|lower-greek|lower-alpha|lower|low|loud|local|list-item|line-through|lighter|level|leftwards|left-side|left|larger|large|landscape|justify|italic|invert|inside|inset|inline-table|inline|icon|higher|high|hide|hidden|help|hebrew|handheld|groove|format|fixed|faster|fast|far-right|far-left|fantasy|extra-expanded|extra-condensed|expanded|embossed|embed|e-resize|double|dotted|disc|digits|default|decimal-leading-zero|decimal|dashed|cursive|crosshair|cross|crop|counters|counter|continuous|condensed|compact|collapse|code|close-quote|circle|center-right|center-left|center|caption|capitalize|braille|bottom|both|bolder|bold|block|blink|bidi-override|below|behind|baseline|avoid|auto|aural|attr|armenian|always|all|absolute|above)\b/ }
		, color : { exp: /(?:\#[a-zA-Z0-9]{3,6})|(?:yellow|white|teal|silver|red|purple|olive|navy|maroon|lime|green|gray|fuchsia|blue|black|aqua)/ }
	}
};
