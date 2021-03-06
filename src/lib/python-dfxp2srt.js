// external modules
var PythonShell = require('python-shell');
// internal modules
const fileManager = require('./file-manager');

/**
 * @description Extract raw text from dfxp files.
 * @param {String} slug - Identifier for videolectures.
 * @returns {Object} The promise.
 */
module.exports = function (slug, path='./') {
    // contains promises waiting to be resolved
    let promises = [];
    const dfxpPath = `${path}/${slug[0]}/${slug}`;
    // execute on all files that contain .tx. in the name
    fileManager.executeOnFiles(dfxpPath, /.tx./g, (filename) => {
        let promise = new Promise((resolve, reject) => {
            const options = {
                scriptPath: __dirname,
                args: [filename]
            };
            // initialize process for running the python script
            PythonShell.run('dfxp2srt.py', options, (error, results) => {
                if (error) { return reject(error); }
                let dfxp = fileManager.getFileContent(filename);
                let rawText = results ? results.toString() : '';
                return resolve({ dfxp, rawText });
            });
        });
        // push the promise
        promises.push(promise);
    });
    // return the promise with the given resolutions
    return Promise.all(promises);
};
