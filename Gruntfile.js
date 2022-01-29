module.exports = function(grunt) {
  var versionedFiles = [
    'package.json',
    'jquery.<%= pluginName %>.js'
  ];

  var lintedFiles = [
    'Gruntfile.js',
    'jquery.expander.js',
    'test/tests.js'
  ];
  var semv = ['patch', 'minor', 'major'];
  var versions = {
    same: {
      src: versionedFiles
    }
  };

  semv.forEach(function(v) {
    versions[v] = {
      src: versionedFiles,
      options: {
        release: v
      }
    };
    versions[v + 'Banner'] = {
      src: ['jquery.<%= pluginName %>.js'],
      options: {
        prefix: '- v',
        release: v
      }
    };
  });
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
        tasks: ['eslint', 'qunit']
      }
    },
    eslint: {
      target: lintedFiles
    },
    qunit: {
      all: ['test/*.html']
    },
    version: versions
  });

  grunt.registerTask('test', ['eslint', 'qunit']);
  grunt.registerTask('build', ['test', 'version:same', 'uglify']);

  // Register grunt major, grunt minor, and grunt patch
  semv.forEach(function(v) {
    grunt.registerTask(v, ['version:' + v + 'Banner', 'version:' + v, 'uglify']);
  });
  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-version');

};
