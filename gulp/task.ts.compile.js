/**
 * TS.Compile
 * Compiles TypeScript files using tsconfig.json
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
module.exports = {
    name: 'TS.Compile',
    task: function (gulp, plugins)
    {
        return function ()
        {
            return plugins.execSync('tsc');
        };
    }
};