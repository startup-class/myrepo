#!/usr/bin/env node
/*
   Automatically grade files for the presence of specified HTML tags/attributes.
   Uses commander.js and cheerio. Teaches command line application development
   and basic DOM parsing.

   References:

   + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

   + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

   + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
 */

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
  // error checking, with emergency exit
  var instr = infile.toString();
  if(!fs.existsSync(instr)) {
    console.log("%s does not exist. Exiting.", instr);
    process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
  }
  return instr;
};

var checkData = function(data, checks) {
  // does the heavy lifting:
  // - data is a Buffer from file or url
  // - checks is JSON parsed and sorted
  $ = cheerio.load(data);
  var out = {};
  for(var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
  }
  console.log(JSON.stringify(out, null, 4));
};

if(require.main == module) {

  program
    .option('-f, --file <html_file>', 'Path to index.html')
    .option('-c, --checks <check_file>', 'Path to checks.json')
    .parse(process.argv);

  // if the checks file, or default, exists, get checks
  var checksfilename = program.checks || CHECKSFILE_DEFAULT;
  var checksfile = assertFileExists(checksfilename);
  var checks = JSON.parse(fs.readFileSync(checksfile)).sort();

  // if the file parameter, or default, exists, checkData
  var datafilename = program.file || HTMLFILE_DEFAULT;
  var datafile = assertFileExists(datafilename);
  checkData(fs.readFileSync(datafile), checks);

} else {
  console.log("This module really only runs well as main.");
}
