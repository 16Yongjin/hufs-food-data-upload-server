const fs = require('fs');
const mime = require('mime');
const Food = require('../model/food');

var thumb = require('node-thumbnail').thumb;

exports.create = (req, res) => {
    const food = new Food(req.body);
    food.save((error) => {
        if (error) {
            return res.status(400).send({
                message: error
            });
        }

        res.status(200).send({
            message: 'ok'
        });
    });
}

exports.list = (req, res) => {
    Food.find({})
        .then((foods) => res.status(200).send(foods))
        .catch((error) => res.status(400).send({ message: error }))
}

exports.remove = (req, res) => {
    Food.findByIdAndRemove(req.body._id)
        .then((food) => {
            if (food.image) {
                fs.unlink(food.image, (err) => console.log(err) );
                fs.unlink(food.imageThumb, (err) => console.log(err) );
            }

            console.log(food.name, 'successfully removed!');
            return res.status(200).send(food);
        })
        .catch((err) => {
            return res.status(400).send({ message: err });
        });
}

var IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

exports.uploadImage = function(req, res) {

    if (!req.file) {
        console.log('no file!');
        return;
    }

    
    const type = mime.lookup(req.file.mimetype);
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res
        .status(415)
        .send('Supported image formats: jpeg, jpg, jpe, png.');
    }
    
    const extension = req.file.path.split(/[. ]+/).pop(),
    targetId = new Date().getTime(),
    targetType = type.split('/').pop(),
    targetName = `${targetId}.${targetType}`,
    targetPath = 'public/images/' + targetName,
    thumbPath = `public/images/thumb/${targetId}_thumb.${targetType}`
    tempPath = req.file.path,

    src = fs.createReadStream(tempPath),
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);

    src.on('error', function(err) {
        if (err) {
            return res.status(500).send({
                message: err
            });
        }
    });

    src.on('end', function() {

        thumb({
            source: targetPath, // could be a filename: dest/path/image.jpg 
            destination: 'public/images/thumb',
            concurrency: 4
        }, function(files, err, stdout, stderr) {
            console.log('All done!');
        });
   
        const food = new Food( Object.assign(req.body, {image: targetPath, imageThumb: thumbPath}) );
        food.save((error) => {
            if (error) {
                return res.status(400).send({
                    message: error
                });
            }
    
            res.status(200).send({
                message: 'ok'
            });
        });

        fs.unlink(tempPath, function(err) {
            if (err) {
                return res.status(500).send({
                    message: 'Woh, something bad happend here\n' + err
                });
            }

        });
    });
};