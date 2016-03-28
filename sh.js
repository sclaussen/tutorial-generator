var d = require('debug')('sh');
var _ = require('lodash');
var should = require('chai').should();
var shelljs = require('shelljs');

function sh(command, options) {

    // Existence of options enables:
    // - rc: tests the response.line against an expected return code (default: 0)
    // - lines: tests the number of output reponse against an expected number (default: -1 which means no test)
    // - echo: determines whether the command and output is echoed to stdout or not (default: false)
    // - redirect_to: redirect the output of the command to this file (default not set - no redirect)
    var expectedReturnCode = 0;
    var expectedLineCount = -1;

    var echoOutput = false;
    var echoCommandOutput = false;
    var redirect_to = undefined;
    if (process.env.DEBUG) {
        _.each(process.env.DEBUG.split(','), function(debug) {
            if (debug.trim() === 'sh') {
                echoOutput = true;
            }
            if (debug.trim() === 'shall') {
                echoCommandOutput = true;
            }
        });
    }

    if (options) {
        if (options.rc !== undefined) {
            expectedReturnCode = options.rc;
        }
        if (options.lines !== undefined) {
            expectedLineCount = options.lines;
        }
        if (options.echo !== undefined) {
            echoOutput = options.echo;
        }
        if (options.echoCommand !== undefined) {
            echoCommandOutput = options.echoCommand;
        }
        if (options.redirect_to !== undefined) {
            redirect_to = options.redirect_to;
        }
    }

    // Optionally echo the output
    if (echoOutput) {
        console.log('$ ' + command);
    }
    if (echoCommandOutput) {
        console.log(command);
    }

    // Execute the command getting back return code and output
    var response = shelljs.exec(command, { silent: true });
    if (redirect_to) {
        response.output.to(redirect_to);
    }

    // Optionally echo the output
    if (echoOutput) {
        console.log(response.output);
    }

    if (options && options.json) {
        var newResponse = {};
        newResponse.rc = response.code;
        newResponse.json = JSON.parse(response.output);

        // Optionally test the return code returned
        if (expectedReturnCode !== -1) {
            newResponse.rc.should.equal(expectedReturnCode, 'The command [' + command + '] returned ' + newResponse.rc + ' as a return code. \n\nOutput received was \n\n' + response.output);
        }

        return newResponse;
    }

    // Build a more capable response object
    // - rc: response code
    // - line: an array of each line of ouptut
    // - lines: total number of output lines
    var newResponse = {};
    newResponse.rc = response.code;
    var line = response.output.replace(/\n$/, "");
    var lines = 0;

    // Generate the response.line and response.lines values
    if (line !== '') {
        var responseLines = line.split('\n');
        responseLines.map(function(e) {
            return e.trim();
        });

        newResponse.line = [];
        while (lines < responseLines.length) {
            newResponse.line.push(responseLines[lines]);
            lines++;
        }
    }
    newResponse.lines = lines;

    // Optionally test the number of lines returned
    if (expectedLineCount !== -1) {
        newResponse.lines.should.equal(expectedLineCount, 'The command [' + command + '] returned ' + newResponse.lines + ' output line(s). \n\nOutput received was \n\n' + response.output);
    }

    // Optionally test the return code returned
    if (expectedReturnCode !== -1) {
        newResponse.rc.should.equal(expectedReturnCode, 'The command [' + command + '] returned ' + newResponse.rc + ' as a return code. \n\nOutput received was \n\n' + response.output);
    }

    return newResponse;
}

exports = module.exports = sh;
