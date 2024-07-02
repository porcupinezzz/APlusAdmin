const Students = require("../models/students")
const Classes = require("../models/classes")
const Classtype = require("../models/classtype")
const Invoices = require("../models/invoices")
const InvoiceDirectory = require("../models/invoice_directory")
const { Workbook, Border, Style } = require("excel4node")

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.outstanding_invoices = asyncHandler(async(req,res,next) => {
    const count_outstanding = await Invoices.countDocuments({paid:false}).exec();
    if (count_outstanding > 0){
        res.render("index", {title: "A Plus Admin", outstanding: true, count_outstanding: count_outstanding})
    }
    else {
        res.render("index", {title: "A Plus Admin", outstanding: false})
    }
})

exports.invoice_detail = asyncHandler(async(req,res,next) => {
    const count_outstanding = await Invoices.countDocuments({paid:false}).exec();
    if (count_outstanding > 0){
        res.render("index", {title: "A Plus Admin", outstanding: true, count_outstanding: count_outstanding})
    }
    else {
        res.render("index", {title: "A Plus Admin", outstanding: false})
    }
})

exports.create_invoice_get = asyncHandler(async(req,res,next) => {
    const current_students = await Students.find({current:true}).exec();
    res.render("create_invoice", {current_students:current_students})
})

exports.create_invoice_post = [
    (req, res, next) => {
        if (!Array.isArray(req.body.students)) {
            req.body.students =
                typeof req.body.students === "undefined" ? null : [req.body.students];
        }
        next();
    }, 

    body("directoryName")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Directory Name must be specified."),
    body("students,*")
        .escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)
        const current_students = await Students.find({current:true}).exec()
        const earliestDate = await Classes.findOne({}, {}, {sort: {"date": 1}}).exec()
        const latestDate = await Classes.findOne({}, {}, {sort: {"date": -1}}).exec()
        //if there are errors, then move back
        //generate filter fields based on invoice
        const studentFilter = req.body.students
        const startingDateFilter = req.body.startingdate || earliestDate.date
        const endingDateFilter = req.body.endingdate || latestDate.date
        //generate invoice documents based on filter
        let classesConcerned
        if (studentFilter){
            classesConcerned = await Classes.find({students: {$elemMatch: {student:{$in :studentFilter}}}, date : {$gte:startingDateFilter, $lte:endingDateFilter}, fullypaid: false}).populate("students.student").exec()
        }
        else{
            classesConcerned = await Classes.find({date : {$gte:startingDateFilter, $lte:endingDateFilter}, fullypaid:false}).populate("students.student").exec()
        }
        let invoicesGenerated = []
        const newInvoiceDirectory = new InvoiceDirectory({
            name:req.body.directoryName,
            invoiceInstances: [],
            last_updated: new Date(),
            date_generated: new Date()
        })
        function existsInArray(array, studentid){
            if (array == []){
                return false
            }
            else if (array.filter(person=>person.student === studentid).length == 0){
                return false
            }
            else{
                return true
            }
        }
        //algo to generate invoices for students based on their unpaid classes
        classesConcerned.forEach(element => {
            element.students.forEach(studentInstance =>{
                if (!existsInArray(invoicesGenerated, studentInstance.student._id)){
                    let newInvoice = new Invoices({
                        student: studentInstance.student._id,
                        due_amount: studentInstance.rate*studentInstance.period,
                        classes_taken: [{
                            class: element._id,
                            amountForClass: studentInstance.rate*studentInstance.period,
                        }
                        ],
                        last_updated: new Date(),
                        date_generated : new Date(),
                        paid : false
                    })
                    invoicesGenerated.push(newInvoice)
                }
                else{
                    let invoiceConcerned = invoicesGenerated.filter(person=>person.student === studentInstance.student._id)[0]
                    let amountToAdd = studentInstance.rate*studentInstance.period
                    invoiceConcerned.due_amount += amountToAdd
                    let newClassInstance = {class:element._id.toString(), amountForClass:amountToAdd}
                    invoiceConcerned.classes_taken.push(newClassInstance)
                }
            })
            element.addedToInvoice = true;
        });
        invoicesGenerated.forEach(invoice => {
            newInvoiceDirectory.invoiceInstances.push(invoice._id)
        });
        console.log(invoicesGenerated, newInvoiceDirectory)
        //save to invoice directory with name indicated
        // const session = await mongoose.startSession();
        // try {
        // session.startTransaction();
        // // Perform your save operations here
        // await invoicesGenerated.forEach(async (doc) => {
        // await doc.save({ session });
        // });
        // await classesConcerned.forEach(async (doc) => {
        // await doc.save({ session });
        // });
        // // Commit the transaction
        // await session.commitTransaction();
        // } catch (error) {
        // // If an error occurs, abort the transaction
        // await session.abortTransaction();
        // throw error;
        // } finally {
        // // End the session
        // session.endSession();
        // }
        //link to excel and generate excel files with invoices and save to local computer under directory name of (directory name) 
        const templatePath = "../InvoiceTemplate.xlsx";
        const workbook = new Workbook(templatePath);
        invoicesGenerated.forEach(invoiceInstance => {
            const worksheet = workbook.addWorksheet("Invoice" + invoiceInstance._id);
            let currentStudent = Students.findOne({_id:invoiceInstance.student}).exec()
            // Define styles for table header and data cells
            const headerStyle = new Style({
                alignment: {
                horizontal: 'center',
                vertical: 'middle',
                },
                font: {
                bold: true,
                },
                border: {
                bottom: {
                    style: 'double',
                },
                },
            });
            
            const dataStyle = new Style({
                border: {
                bottom: {
                    style: 'thin',
                },
                },
            });
            
            // Define table data (replace with your actual data)
            const invoiceData = [
                ['Name', 'Class Date', 'Period Of Class', 'Class Amount Subtotal', 'Total Amount for Student'],
                []
            ];
            
            // Set column widths
            worksheet.column(1).setWidth(20);
            worksheet.column(2).setWidth(40);
            worksheet.column(3).setWidth(10);
            worksheet.column(4).setWidth(10);
            worksheet.column(5).setWidth(10);
            
            // Write table header
            invoiceData[0].forEach((headerText, colIndex) => {
                worksheet.cell(1, colIndex + 1).string(headerText).style(headerStyle);
            });
            
            // Write table data
            invoiceData.slice(1).forEach((rowData, rowIndex) => {
                rowData.forEach((dataValue, colIndex) => {
                const cellAddress = worksheet.cell(rowIndex + 2, colIndex + 1);
                cellAddress.value = dataValue;
                cellAddress.style(dataStyle);
                });
            });

        })
    })

]

