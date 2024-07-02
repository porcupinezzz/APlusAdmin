const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema

const ClassSchema = new Schema({
    type: [{type: Schema.Types.ObjectId, ref:"Classtype", required:true}],
    students: [{student: {type: Schema.Types.ObjectId, ref:"Students", required:true}, 
                rate: {type:Number,required:true}, 
                period: {type:Number, required:true}, 
                paid: {type:Boolean, required:true}}],
    date: {type:Date, required:true},
    addedToInvoice : {type: Boolean, required: true},
    invoice : {type:Schema.Types.ObjectId, ref: "Invoices"},
    fullypaid : {type:Boolean, required:true}
})

ClassSchema.virtual("url").get(function(){
    return `/classes/${this._id}`;
})

module.exports = mongoose.model("Classes", ClassSchema)