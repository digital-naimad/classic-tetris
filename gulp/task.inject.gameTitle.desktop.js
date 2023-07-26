var cheerio = require('gulp-cheerio');
var desktopConfig = require('../config-desktop.json');

/**
 * Inject.GameTitle.Desktop
 * Simple task to inject game's title into index.htm title DOM marker
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
module.exports = {
    name: 'Inject.GameTitle.Desktop',
    task: function (gulp, plugins)
    {
        return function ()
        {
            return gulp.src(['./index.htm'])
                .pipe(cheerio(function ($, file)
                {
                    $('title').text(desktopConfig.title);
                }))
                .pipe(gulp.dest('./'));
        };
    }
};
