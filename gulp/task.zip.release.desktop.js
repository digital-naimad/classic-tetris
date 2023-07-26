var getList = require('./fnc.getJsonList');
var deviceConfig = require('../config-desktop.json');

/**
 * Desktop.Release.zip
 * Concat all files defined in data.sources.release.desktop.json into one .zip bundle
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
module.exports = {
    name: 'Desktop.Release.zip',
    task: function (gulp, plugins)
    {
        return function ()
        {
            var device = 'desktop';
            var directoryName = 'release_' + deviceConfig.short_title + '_' + device + '_v' + deviceConfig.version;
            var fileName = directoryName + '.zip';

            plugins.execSync('if exist .\\dist\\' + device + '\\' + fileName + ' del /F .\\dist\\' + device + '\\' + fileName);

            return gulp.src(getList('data.sources.release.' + device + '.json'), { base: './' })
                .pipe(plugins.zip(fileName))
                .pipe(gulp.dest('./dist/' + device));
        };
    }
};
