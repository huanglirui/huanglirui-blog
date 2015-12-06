module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.initConfig({
        'copy': {
            main:{
                files:[
                    {expand: true, src: ['views/**/*.ejs'], dest: 'app'},
                    {expand: true, cwd: 'public/javascripts',  src: ['**/*.js'], dest: 'app/scripts'},
                    {expand: true, cwd: 'public/stylesheets',  src: ['**/*.css'], dest: 'app/css'}
                ]
            }
        },
        clean:{
            main:['app/*']
        },
        rev:{
            options:{
                encoding:'utf8',
                algorithm:'md5',
                length:8
            },
            assets:{
                files:[
                    {
                        src:['app/**/*.{js,css}']
                    }
                ]
            }
        }
    });

    grunt.registerTask('default', ['clean', 'copy', 'rev']);
};