var fs = require('fs');

/**
 * getJsonList
 * This function helps to load list from json file from gulp dict
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 * 
 * @param fileName Name of the file that contains list of files to include in bundle
 */
module.exports = function (fileName)
{
    var fileData = fs.readFileSync('./gulp/' + fileName);
    if (fileData)
    {
        var json = JSON.parse(fileData);
        if (json)
        {
            var list = json.list;
            if (list)
                return list;
            else
                console.log('There is no array named \'list\' in json at \'./gulp/' + fileName + '\'');
        }
        else
            console.log('There is no proper json at \'./gulp/' + fileName + '\'');
    }
    else
        console.log('There is no file at \'./gulp/' + fileName + '\'');
    return [];
};