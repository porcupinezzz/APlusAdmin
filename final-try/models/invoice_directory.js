const mongoose = require("mongoose");
const invoices = require("./invoices");
const Schema = mongoose.Schema

const InvoiceDirectorySchema = new Schema({
    name: {type:String, required:true},
    invoiceInstances: [{type:Schema.Types.ObjectId, ref: "Invoices", required:true}],
    last_updated: {type:Date, required:true},
    date_generated : {type:Date, required:true},
})

InvoiceDirectorySchema.virtual("url").get(function(){
    return `/invoicedirectory/${this._id}`;
})

module.exports = mongoose.model("InvoiceDirectory", InvoiceDirectorySchema)