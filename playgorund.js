var thumb = require('node-thumbnail').thumb;

// thumb(options, callback); 

thumb({
 source: 'image/test.jpeg', // could be a filename: dest/path/image.jpg 
 destination: 'image/thumb',
 concurrency: 4
}, function(files, err, stdout, stderr) {
 console.log('All done!');
});