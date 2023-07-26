/**
 * Strip.Debug.Code
 * Removes all code wrapped by /* start-debug * / and /* end-debug * / comments and outputs new dist/ts-release/ts.js file with striped code
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 * @example     /* start-debug * /
 *              console.log("foo");   //<- this will be removed
 *              /* end-debug * /
 */
module.exports = {
    name: 'Strip.Debug.Code',
    task: function (gulp, plugins)
    {
        return function ()
        {
            return gulp.src(['./dist/ts-debug/ts.js'])
                .pipe(plugins.stripCode({
                    start_comment: 'start-debug',
                    end_comment: 'end-debug'
                }))
                .pipe(gulp.dest('./dist/ts-release'));
        };
    }
};
