const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema

const ClassTypeSchema = new Schema({
    type: [{type: String, required:true}],
    classesInType: [{type: Schema.Types.ObjectId, ref:"Classes"}],
})

ClassSchema.virtual("url").get(function(){
    return `/classtype/${this._id}`;
})

module.exports = mongoose.model("Classes", ClassSchema)