/**
 * Desktop.Bump.version
 * Bumps the config-desktop.json to the next patch revision
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
module.exports = {
    name: 'Desktop.Bump.version',
    task: function (gulp, plugins) 
    {
        return function ()
        {
            return gulp.src('./config-desktop.json')
                .pipe(plugins.bump({ type: 'patch' }))
                .pipe(gulp.dest('./'));
        };
    }
};