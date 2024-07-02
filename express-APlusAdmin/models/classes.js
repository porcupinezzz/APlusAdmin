const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema

const ClassSchema = new Schema({
    type: [{type: Schema.Types.ObjectId, ref:"Classtype", required:true}],
    studentsInClass: [{type: Schema.Types.ObjectId, ref:"Students", required:true}],
    dayOfClass: {type:Date, required:true},
    hours: {type:Number, required:true},
    rate: {type:Number, required:true}
})

ClassSchema.virtual("url").get(function(){
    return `/class/${this._id}`;
})

module.exports = mongoose.model("Classes", ClassSchema)