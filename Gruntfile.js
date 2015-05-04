module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        uglify: {
          options: {
            mangle: false,
            compress: false,
            beautify: false,
  	      	banner: '/* Do not change anything here as it will be overwritten*/'

          },
          build: {
            src: ["src/libs/*.js","src/*.js"],
            dest: "public/script-min.js"
          }
        },
        compass: {
        	dist: {
        	options: {
                sassDir: 'src',
                cssDir: 'cache'
              }
        	}
        },
        cssmin: {
        	  add_banner: {
        	    options: {
        	      banner: '/* Do not change anything here as it will be overwritten*/'
        	    },
        	    files: {
        	      'public/style.css': ['cache/**/*.css']
        	    }
        	  }
        	},
        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': false,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': false,
                    'style-disabled': false
                },
                src: ['public/*.html']
            }
        },
        includes: {
        	
        	  files: {
        	    src: ['src/*.html'], // Source files
        	    dest: 'public/', // Destination directory
        	    flatten: true,
        	    cwd: '.',
        	    options: {
        	      silent: false
        	    }
        	  }
        	
        },
        	
    	
        clean: {
        	both: ["public", "cache"],
        	cache: "cache"
        },
        
        
        copy: {
        	  main: {
        	    expand: true,
        	    cwd: 'src/',
        	    src: '**/*.{png,jpg,gif,svg}',
        	    dest: 'public/images',
        	    flatten: true,
        	    filter: 'isFile',
        	  },
        	},
        	
        jshint: {
        	  // define the files to lint
        	  files: ['src/**/*.js','!src/libs/*.js'],
        	  // configure JSHint (documented at http://www.jshint.com/docs/)
        	  options: {
        	      // more options here if you want to override JSHint defaults
        	    globals: {
        	      jQuery: true,
        	      console: true,
        	      module: true
        	    }
        	  }
        	},
        	
        	watch: {
        		files: ['src/**/*.{scss,html,js,svg,json,png,jpg,gif}'],
        		tasks: ['clean:both','copy','includes','uglify','jshint','htmlhint','compass','cssmin','clean:cache']
        	}

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.registerTask('default', ['clean:both','copy','includes','uglify','jshint','htmlhint','compass','cssmin','clean:cache']);

};