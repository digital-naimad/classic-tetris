var getList = require('./fnc.getJsonList');

/**
 * Inject.Src.Release
 * Injects all javascript files defined in data.scriptsList.release.json into game.html header
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
module.exports = {
    name: 'Inject.Src.Release',
    task: function (gulp, plugins)
    {
        return function ()
        {
            return gulp.src('./index.htm')
                .pipe(plugins.inject(gulp.src(getList('data.scriptsList.release.json'), { read: false }), { addRootSlash: false }))
                .pipe(gulp.dest('.'));
        };
    }
};

