const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema

const ClassTypeSchema = new Schema({
    name: {type: String, required:true},
    classes: [{type: Schema.Types.ObjectId, ref:"Classes"}],
})

ClassTypeSchema.virtual("url").get(function(){
    return `/classtype/${this._id}`;
})

module.exports = mongoose.model("Classtype", ClassTypeSchema)