const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { exec } = require('child_process');

// Echo "Hello World"
console.log("Hello World");

// Create build folder if it doesn't exist
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// Create a file to stream archive data to.
const output = fs.createWriteStream(path.join(buildDir, 'build.zip'));
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

// Listen for all archive data to be written
output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('Archiver has been finalized and the output file descriptor has closed.');
});

// Good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
    if (err.code !== 'ENOENT') {
        throw err;
    }
});

// Good practice to catch this error explicitly
archive.on('error', function(err) {
    throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append build.js file to the archive
archive.file(path.join(__dirname, 'build.js'), { name: 'build.js' });

// Finalize the archive (ie we are done appending files but streams have to finish yet)
archive.finalize();