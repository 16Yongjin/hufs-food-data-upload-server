const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    name: String,
    type: String,
    time: String,
    menu: String,
    location: Object
});

FoodSchema.virtual('foodCount').get(function() {
    return this.posts.length;
});


const Food = mongoose.model('food', FoodSchema);

module.exports = Food;
