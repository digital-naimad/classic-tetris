var getList = require('./fnc.getJsonList');

/**
 * Inject.Src.Debug
 * Injects all javascript files defined in data.scriptsList.debug.json into game.html header
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
module.exports = {
    name: 'Inject.Src.Debug',
    task: function (gulp, plugins)
    {
        return function ()
        {
            return gulp.src('./index.htm')
                .pipe(plugins.inject(gulp.src(getList('data.scriptsList.debug.json'), { read: false }), { addRootSlash: false }))
                .pipe(gulp.dest('.'));
        };
    }
};

