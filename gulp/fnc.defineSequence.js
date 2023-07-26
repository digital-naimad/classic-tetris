var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Define.Sequence
 * This function helps to import task and it's name from specified path and add to gulp
 * Also performs basic checks and prints warnings to console
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 * 
 * @param name Name of the sequence
 * @param array Array of tasks to run in sequence
 */
module.exports = function (name, array)
{
    gulp.task(name, function (done)
    {
        var namesArray = [];
        for (var index in array)
            namesArray.push(array[index].name);
        runSequence.apply(null, namesArray);
    });
    return { name: name };
};