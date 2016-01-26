/*global module:false*/

module.exports = function(grunt) {
  var versionedFiles = [
    'package.json',
    'jquery.<%= pluginName %>.js'
  ];

  var lintedFiles = [
    'Gruntfile.js',
    'jquery.expander.js',
    'test/tests.js',
  ];

  // Project configuration.
  grunt.initConfig({
    pluginName: 'expander',
    bower: './bower.json',
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*!<%= "\\n" %>' +
          ' * <%= pkg.title %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd")  + "\\n" %>' +
          '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
          '<%= "\\n" %>' +
          ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' +
          ' (<%= _.pluck(pkg.licenses, "url").join(", ") %>)' +
          '<%= "\\n" %>' + ' */' +
          '<%= "\\n\\n" %>'
    },
    // concat: {
    //   all: {
    //     src: ['src/jquery.<%= pluginName %>.js'],
    //     dest: 'jquery.<%= pluginName %>.js'
    //   },
    //   options: {
    //     stripBanners: true,
    //     banner: '<%= meta.banner %>',
    //     process: function(src) {
    //       var umdHead = grunt.file.read('lib/tmpl/umdhead.tpl'),
    //           umdFoot = grunt.file.read('lib/tmpl/umdfoot.tpl');

    //       src = src
    //       .replace('(function($) {', umdHead)
    //       .replace('})(jQuery);', umdFoot);

    //       return src;
    //     }
    //   }
    // },
    uglify: {
      all: {
        files: {
          'jquery.<%= pluginName %>.min.js': ['jquery.<%= pluginName %>.js']
        },
        options: {
          preserveComments: 'some'
        }
      }
    },
    watch: {
      scripts: {
        files: lintedFiles,
        tasks: ['jshint:all', 'jscs']
      }
    },
    jshint: {
      all: lintedFiles,
      options: {
        curly: true,
        node: true,
        eqeqeq: true,
        unused: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          $: true,
          define: true,
        }
      }
    },
    jscs: {
      src: lintedFiles,
      options: {
        config: '.jscsrc',
        verbose: true,
        fix: true,
      }
    },
    qunit: {
      all: ['test/*.html']
    },
    version: {
      patch: {
        src: versionedFiles,
        options: {
          release: 'patch'
        }
      },
      same: {
        src: versionedFiles,
      },
      bannerPatch: {
        src: ['jquery.<%= pluginName %>.js'],
        options: {
          prefix: '- v',
          release: 'patch'
        }
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'jscs', 'qunit']);
  grunt.registerTask('build', ['test', 'version:same', 'uglify']);
  grunt.registerTask('patch', [
    'test',
    'version:bannerPatch',
    'version:patch',
    'uglify'
  ]);
  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-version');

};
