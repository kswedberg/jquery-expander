/*global module:false*/
module.exports = function(grunt) {

  var _ = grunt.util._;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('expander.jquery.json'),
    bowerjson: './bower.json',
    meta: {
      banner: '/*!<%= "\\n" %>' +
          ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd")  + "\\n" %>' +
          '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
          '<%= "\\n" %>' +
          ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>' +
          ' (<%= _.pluck(pkg.licenses, "url").join(", ") %>)' +
          '<%= "\\n" %>' + ' */' +
          '<%= "\\n\\n" %>'
    },
		concat: {
      options: {
        stripBanners: {block: true},
        banner: '<%= meta.banner %>'
      },
      all: {
        src: ['jquery.<%= pkg.name %>.js'],
        dest: 'jquery.<%= pkg.name %>.js'
      }
    },
    uglify: {
      all: {
        files: {
          'jquery.<%= pkg.name %>.min.js': ['<%= concat.all.dest %>']
        },
        options: {
          preserveComments: false,
          banner: '<%= meta.banner %>'
        }
      }
    },
    watch: {
      scripts: {
        files: '<%= concat.all.src %>',
        tasks: ['jshint', 'qunit']
      }
    },
    shell: {
      rsync: {
        // command gets modified by rsync task.
        command: 'rsync',
        stdout: true
      }
    },
    setshell: {
      rsync: {
        file: 'gitignore/settings.json',
        cmdAppend: '<%= pkg.name %>/'
      }
    },
    jshint: {
      grunt: ['Gruntfile.js'],
      test: ['test/tests.js'],
      plugin: ['jquery.expander.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true
      }
    },
    qunit: {
      all: ['test/*.html']
    },
    version: {
      same: {
        src: ['jquery.expander.js', '*.json']
      },
      patch: {
        src: [
          '<%= pkg.name %>.jquery.json',
          'package.json',
          'src/jquery.<%= pkg.name %>.js',
          '<%= pkg.name %>.js'
        ],
        options: {
          release: 'patch'
        }
      },
      bannerPatch: {
        src: ['<%= pkg.name %>.js'],
        options: {
          prefix: 'Expander - v',
          release: 'patch'
        }
      }
    }

  });

  grunt.registerTask('build', ['jshint', 'qunit', 'concat', 'version:same', 'bowerjson', 'uglify']);

  grunt.registerTask( 'bowerjson', 'update bower.json', function() {
    var comp = grunt.config('bowerjson'),
        pkg = grunt.config("pkg"),
        json = {};

    ['name', 'version', 'dependencies'].forEach(function(el) {
      json[el] = pkg[el];
    });

    _.extend(json, {
      main: grunt.config('concat.all.dest'),
      ignore: [
        'demo/',
        'lib/',
        'src/',
        '*.json'
      ]
    });
    json.name = 'jquery.' + json.name;

    grunt.file.write( comp, JSON.stringify(json, null, 2) );
    grunt.log.writeln( "File '" + comp + "' updated." );
  });


  grunt.registerMultiTask( 'setshell', 'Set grunt shell commands', function() {
    var settings, cmd,
        tgt = this.target,
        cmdLabel = 'shell.' + tgt + '.command',
        file = this.data.file,
        append = this.data.cmdAppend || '';

    if ( !grunt.file.exists(file) ) {
      grunt.warn('File does not exist: ' + file);
    }

    settings = grunt.file.readJSON(file);
    if (!settings[tgt]) {
      grunt.warn('No ' + tgt + ' property found in ' + file);
    }

    cmd = settings[tgt] + append;
    grunt.config(cmdLabel, cmd);
    grunt.log.writeln( ('Setting ' + cmdLabel + ' to:').cyan );

    grunt.log.writeln(cmd);

  });

  grunt.registerTask( 'deploy', ['setshell:rsync', 'shell:rsync']);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-contrib-qunit');
};
