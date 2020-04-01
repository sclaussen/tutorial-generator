'use strict'


var fs = require('fs');
var join = require('path').join;
var exec = require('shelljs').exec;


main(process.argv);


// rm -rf example
// mkdir example/source
// mkdir example/source/01 example/source/02 example/source/03
// touch ./source/00/README.md
// touch ./source/01/file1
// touch ./source/02/file1
// touch ./source/02/file2
// touch ./source/03/file1
// touch ./source/03/file2
// touch ./source/03/file3
function main(args) {
    if (args.length != 4) {
        console.log('Usage: node index.js SOURCE_DIRECTORY TARGET_DIRECTORY');
        process.exit(1);
    }

    let source = args[2];
    let target = args[3];

    if (source[0] !== '/') {
        source = join(process.cwd(), source);
    }

    if (target[0] !== '/') {
        target = join(process.cwd(), target);
    }

    tutorialGenerator(source, target);
}


function tutorialGenerator(source, target) {

    sh('rm -rf ' + target);
    sh('mkdir ' + target);

    console.log('$ cd ' + target + '\n');
    process.chdir(target);

    sh('git init');

    let directories = getDirectories(source);
    for (let directory of directories) {
        if (directory === '.git') {
            continue;
        }
        console.log('-------------------------------------------------------------------------------');
        sh('rm -f *');
        sh('cp -r ' + join(source, directory, '*') + ' .');
        sh('cp ' + source + '/00/README.md .');
        sh('git add .');
        sh('git commit -m "Commit for step ' + directory + '"');
        sh('git tag ' + directory);
    }

    console.log('-------------------------------------------------------------------------------');
    sh('rm -f *');
    sh('cp -r ' + join(source, '/00/*') + ' .');
    sh('git add .');
    sh('git commit -m "Commit for start"');
    sh('git tag start');
    console.log('-------------------------------------------------------------------------------');
}


function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(join(srcpath, file)).isDirectory();
    });
}


function sh(cmd) {
    exec(cmd, { silent: false });
}
