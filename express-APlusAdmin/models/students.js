const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema

const StudentSchema = new Schema({
    first_name: {type:String, required: true, maxLength: 50},
    last_name: {type: String, required:true, maxLength:50},
    age: {type:Number},
    classesTaken: [{type: Schema.Types.ObjectId, ref: "classes"}],
    firstJoined: {type:Date, required:true},
    lastUpdated: {type:Date, required:true},
})

StudentSchema.virtual("url").get(function(){
    return `/student/${this._id}`;
})

module.exports = mongoose.model("Students", StudentSchema)