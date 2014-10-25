/*global module:false*/

module.exports = function(grunt) {

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
        files: '<%= jshint.all %>',
        tasks: ['jshint:all']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        curly: true,
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
          require: false
        }
      }
    },
    qunit: {
      all: ['test/*.html']
    },
    version: {
      patch: {
        src: [
          'package.json',
          '<%= pluginName %>.jquery.json',
          'bower.json',
          'src/jquery.<%= pluginName %>.js',
          'jquery.<%= pluginName %>.js'
        ],
        options: {
          release: 'patch'
        }
      },
      same: {
        src: ['package.json', 'src/jquery.<%= pluginName %>.js', 'jquery.<%= pluginName %>.js']
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

  grunt.registerTask( 'configs', 'Update json configs based on package.json', function() {
    var pkg = grunt.file.readJSON('package.json'),
        pkgBasename = grunt.config('pluginName'),
        bowerFile = grunt.config('bower'),
        bower = grunt.file.readJSON(bowerFile),
        jqConfigFile = pkgBasename + '.jquery.json',
        jqConfig = grunt.file.readJSON(jqConfigFile);

    ['main', 'version', 'dependencies', 'keywords'].forEach(function(el) {
      bower[el] = pkg[el];
      jqConfig[el] = pkg[el];
    });

    ['author', 'repository', 'homepage', 'bugs', 'demo', 'licenses'].forEach(function(el) {
      jqConfig[el] = pkg[el];
    });

    jqConfig.keywords.shift();
    jqConfig.name = pkgBasename;
    bower.name = 'jquery.' + pkgBasename;

    grunt.file.write( bowerFile, JSON.stringify(bower, null, 2) + '\n');
    grunt.log.writeln( 'File "' + bowerFile + '" updated."' );

    grunt.file.write( jqConfigFile, JSON.stringify(jqConfig, null, 2) + '\n');
    grunt.log.writeln( 'File "' + jqConfigFile + '" updated."' );
  });

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('build', ['test', 'version:same', 'configs', 'uglify']);
  grunt.registerTask('patch', ['test', 'version:bannerPatch', 'version:patch', 'configs', 'uglify']);
  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-version');
};
