const Food = require('../model/food');

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