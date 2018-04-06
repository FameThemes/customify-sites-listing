module.exports = function( grunt ) {
    'use strict';
    var pkgInfo = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Autoprefixer.
        postcss: {
            options: {
                processors: [
                    require( 'autoprefixer' )({
                        browsers: [
                            '> 0.1%',
                            'ie 8',
                            'ie 9'
                        ]
                    })
                ]
            },
            dist: {
                src: 'assets/css/*.css'
            }
        },

        // SASS
        sass: {
            options: {
                precision: 10
            },
            dist: {
                options: {
                    style: 'expanded'
                },

                files: [
                    {'assets/css/style.css': 'assets/sass/style.scss'}
                ]
            }
        },

        // Minified all css files.
        cssmin: {
            target: {
                files: [
                    // Customizer style
                    {
                        expand: true,
                        cwd: 'assets/css',
                        src: ['*.css', '!*.min.css'],
                        dest: 'assets/css',
                        ext: '.min.css'
                    }
                ]
            }
        },

        // Watch changes for assets.
        watch: {
            css: {
                files: [
                    'assets/sass/*.scss'
                ],
                tasks: [
                    //'sass',
                    'css'
                ]
            }

        },

        copy: {
            main: {
                options: {
                    mode: true
                },
                src: [
                    '**',
                    '!node_modules/**',
                    '!build/**',
                    '!css/sourcemap/**',
                    '!.git/**',
                    '!bin/**',
                    '!.gitlab-ci.yml',
                    '!bin/**',
                    '!tests/**',
                    '!phpunit.xml.dist',
                    '!*.sh',
                    '!*.map',
                    '!Gruntfile.js',
                    '!package.json',
                    '!.gitignore',
                    '!phpunit.xml',
                    '!README.md',
                    '!sass/**',
                    '!codesniffer.ruleset.xml',
                    '!vendor/**',
                    '!composer.json',
                    '!composer.lock',
                    '!package-lock.json',
                    '!phpcs.xml.dist'
                ],
                dest: 'customify-sites-listing/'
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'customify-sites-listing-' + pkgInfo.version + '.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        src: [
                            './customify-sites-listing/**'
                        ]

                    }
                ]
            }
        },

        clean: {
            main: ["customify-sites-listing"],
            zip: ["*.zip"]

        },

        makepot: {
            target: {
                options: {
                    domainPath: '/',
                    potFilename: 'languages/customify-sites-listing.pot',
                    potHeaders: {
                        poedit: true,
                        'x-poedit-keywordslist': true
                    },
                    type: 'wp-plugin',
                    updateTimestamp: true
                }
            }
        },

        addtextdomain: {
            options: {
                textdomain: 'customify-sites-listing'
            },
            target: {
                files: {
                    src: [
                        '*.php',
                        '**/*.php',
                        '!node_modules/**',
                        '!php-tests/**',
                        '!bin/**'
                    ]
                }
            }
        },

        bumpup: {
            options: {
                updateProps: {
                    pkg: 'package.json'
                }
            },
            file: 'package.json'
        },

        replace: {
            theme_main: {
                src: ['customify-sites-listing.php'],
                overwrite: true,
                replacements: [
                    {
                        from: /Version: \bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-A-Z-]+(?:\.[\da-z-A-Z-]+)*)?(?:\+[\da-z-A-Z-]+(?:\.[\da-z-A-Z-]+)*)?\b/g,
                        to: 'Version: <%= pkg.version %>'
                    }
                ]
            }
        }

    });

    // Load NPM tasks to be used here
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-postcss' );
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-wp-i18n');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-text-replace');

    // Register tasks
    grunt.registerTask('default', [
        'watch',
        'css'
    ]);
    grunt.registerTask( 'css', [
        'sass'
        //'postcss',
        //'cssmin'
    ]);

    // To release new version just runt 2 commands below
    // Re create everything: grunt release --ver=<version_number>
    // Zip file installable: grunt zipfile

    grunt.registerTask('zipfile', ['clean:zip', 'copy:main', 'compress:main', 'clean:main']);
    grunt.registerTask('release', function (ver) {
        var newVersion = grunt.option('ver');
        if (newVersion) {
            // Replace new version
            newVersion = newVersion ? newVersion : 'patch';
            grunt.task.run('bumpup:' + newVersion);
            grunt.task.run('replace');

            // i18n
            grunt.task.run(['addtextdomain', 'makepot']);
            // re create css file and min
            grunt.task.run([ 'css', 'postcss' ]);
        }
    });
};