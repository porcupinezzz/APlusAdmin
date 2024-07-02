const mongoose = require("mongoose")
const Schema = mongoose.Schema

const InvoiceSchema = new Schema({
    student: {type:Schema.Types.ObjectId, ref:"Students", required:true},
    due_amount: {type:Number, required:true},
    classes_taken: [{
        class: {type:Schema.Types.ObjectId, ref: "Classes",},
        amountForClass: {type:Number, required:true},
    }
    ],
    last_updated: {type:Date, required:true},
    date_generated : {type:Date, required:true},
    paid : {type:Boolean, required:true}
})

InvoiceSchema.virtual("url").get(function(){
    return `/invoice/${this._id}`;
})

module.exports = mongoose.model("Invoices", InvoiceSchema)