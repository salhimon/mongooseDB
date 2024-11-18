const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PersonSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    Age: {
        type: Number,
        required: true,
    },
    favoriteFoods: {
        type: [String],  // Tableau de chaînes de caractères
        default: [],     // Par défaut, un tableau vide
    }
});

module.exports=Person=model("person",PersonSchema)