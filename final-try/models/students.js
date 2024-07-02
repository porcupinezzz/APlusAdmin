const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema

const StudentSchema = new Schema({
    first_name: {type:String, required: true, maxLength: 50},
    last_name: {type: String, required:true, maxLength:50},
    grade: {type:Number, required:true},
    classes_taken: [{type: Schema.Types.ObjectId, ref: "Classes"}],
    siblings : [{type: Schema.Types.ObjectId, ref: "Students"}],
    first_joined: {type:Date, required:true},
    last_updated: {type:Date, required:true},
    bills: [{type: Schema.Types.ObjectId, ref: "Invoices"}],
    outstanding : [{type: Schema.Types.ObjectId, ref: "Invoices"}],
    current: {type:Boolean, required:true}
})

StudentSchema.virtual("url").get(function(){
    return `/student/${this._id}`;
})

StudentSchema.virtual("name").get(function(){
    return this.first_name + " " + this.last_name;
})

module.exports = mongoose.model("Students", StudentSchema)