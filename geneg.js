var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var sh = require('./sh');

if (process.argv.length != 4) {
    console.log('Usage: node geneg.js SOURCE_DIRECTORY TARGET_DIRECTORY');
    process.exit(1);
}

var source = process.argv[2];
var target = process.argv[3];

sh('rm -rf ' + target, { echo: true, rc: -1 });
sh('mkdir ' + target, { echo: true });

console.log('$ cd ' + target + '\n');
process.chdir(target);

sh('git init');

var directories = getDirectories(source);
_.each(directories, function(directory) {
    if (directory === '.git') {
        return;
    }
    console.log('-------------------------------------------------------------------------------');
    sh('rm -f *', { echo: true });
    sh('cp -r ' + source + '/' + directory + '/*' + ' .', { echo: true });
    sh('cp ' + source + '/00/README.md' + ' .', { echo: true });
    sh('git add .', { echo: true });
    sh('git commit -m "Commit for step ' + directory + '"', { echo: true });
    sh('git tag ' + directory, { echo: true });
});

console.log('-------------------------------------------------------------------------------');
sh('rm -f *', { echo: true });
sh('cp -r ' + source + '/00/*' + ' .', { echo: true });
sh('git add .', { echo: true });
sh('git commit -m "Commit for start"', { echo: true });
sh('git tag start', { echo: true });
console.log('-------------------------------------------------------------------------------');

sh('git remote add origin git@github.com-sclaussen:sclaussen/climbingweather.git', { echo: true });

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}
