var addTask = require('./gulp/fnc.addTask');
var defineSequence = require('./gulp/fnc.defineSequence');

var bump_version_desktop = addTask('task.bump.version.desktop');

var inject_debug_to_game_html = addTask('task.inject.src.debug');
var inject_release_to_game_html = addTask('task.inject.src.release');

var inject_gameTitle_desktop = addTask('task.inject.gameTitle.desktop');

var compile_ts = addTask('task.ts.compile');

var strip_debug_code = addTask('task.strip.debug.code');

var zip_debug_desktop = addTask('task.zip.debug.desktop');
var zip_release_desktop = addTask('task.zip.release.desktop');

defineSequence('_VERSION++.DESKTOP', [
    bump_version_desktop
]);

defineSequence('_BUILD.DEBUG.DESKTOP', [
    compile_ts,
    inject_gameTitle_desktop,
    inject_debug_to_game_html,
    strip_debug_code,
    zip_debug_desktop
]);

defineSequence('_BUILD.RELEASE.DESKTOP', [
    compile_ts,
    inject_gameTitle_desktop,
    inject_release_to_game_html,
    strip_debug_code,
    zip_release_desktop
]);