var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var child_process = require('child_process');
var stripCode = require('gulp-strip-code');
var bump = require('gulp-bump');

plugins.exec = child_process.exec;
plugins.execSync = child_process.execSync;
plugins.fs = require('fs');
plugins.stripCode = stripCode;
plugins.bump = bump;

/**
 * AddTask
 * This function helps to import task and it's name from specified path and add to gulp
 *  Also performs basic checks and prints warnings to console
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 * 
 * @param jsFileName File name that contains task to run
 */
module.exports = function (jsFileName)
{
    var path = './' + jsFileName;
    var module = require(path);
    if (module)
    {
        var name = module.name;
        var task = module.task;
        if (typeof name !== 'string' || name.length <= 0)
            console.log('There is no specified name in module in path ' + path);
        else if (!task)
            console.log('There is no specified task in module in path ' + path);
        else
            gulp.task(name, task(gulp, plugins));
    }
    else
        console.log('There is no module in path ' + path);
    return module;
};
