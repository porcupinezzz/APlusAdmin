const Students = require("../models/students")
const Classes = require("../models/classes")
const Classtype = require("../models/classtype")
const Invoices = require("../models/invoices")

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.class_detail = asyncHandler(async(req,res,next) => {
    const classInstance = await Classes.findById(req.params.id).populate("type").exec()
    // find out why this shit is not working
    // let students = []
    // for (studentInstance in classInstance.students){
    //     let person = await Students.findById(studentInstance.student).exec()
    //     console.log(person, studentInstance.student)
    //     students.push(person)
    // }
    if (classInstance){
        console.log(classInstance)
        res.render("class_detail", {classInstance:classInstance, exists:true})
    }
    else{
        res.render("class_detail", {attemptedClass:req.params.id ,exists:false})
    }
})

exports.create_class_get = asyncHandler(async(req,res,next) => {
    const current_student = await Students.find({current:true}).exec();
    const classtypes = await Classtype.find().exec();
    res.render("create_class", {current_students: current_student, classtypes:classtypes})
})

exports.create_class_post = [
    (req, res, next) => {
        if (!Array.isArray(req.body.students)) {
            req.body.students =
                typeof req.body.students === "undefined" ? [] : [req.body.students];
        }
        if (!Array.isArray(req.body.classtypes)) {
            req.body.classtypes =
                typeof req.body.classtypes === "undefined" ? [] : [req.body.classtypes];
        }
        next();
    },
    body("period")
        .trim()
        .isInt({min:0,max:4})
        .escape()
        .withMessage("Grade must be a number between 0 and 4"),
    body("rate")
        .trim()
        .isInt({min:40,max:200})
        .escape()
        .withMessage("Grade must be a number between 40 and 200"),
    body("students,*").escape(),
    body("classtypes,*").escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)
        const current_student = await Students.find({current:true}).exec();
        const all_classtypes = await Classtype.find().exec()
        if (!errors.isEmpty){
            for (const classtype of all_classtypes) {
                if (req.body.classtypes.includes(classtype._id)) {
                  classtype.checked = true;
                }
              }
            res.render("create_class", {current_students: current_student, classtypes:all_classtypes, errors:errors.array()})
        }
        else{
            console.log(req.body.students)
            let marked_students = []
            for (const student of req.body.students){
                let studentinstance = await Students.findById(student).exec()
                marked_students.push(studentinstance)
            }
            console.log(marked_students)
            res.render("insert_class",  {marked_students: marked_students, classtypes:all_classtypes, rate: req.body.rate, period: req.body.period})
        }
    }),
]

exports.insert_class_post = [
    (req, res, next) => {
        if (!Array.isArray(req.body.classtype)) {
            req.body.classtype =
                typeof req.body.classtype === "undefined" ? [] : [req.body.classtype];
        }
        if (!Array.isArray(req.body.studentsrate)) {
            req.body.studentsrate =
                typeof req.body.studentsrate === "undefined" ? [] : [req.body.studentsrate];
        }
        if (!Array.isArray(req.body.studentsperiod)) {
            req.body.studentsperiod =
                typeof req.body.studentsrate === "undefined" ? [] : [req.body.studentsperiod];
        }
        next();
    },
    
    //add in validation for the rest later
    body("classtype,*").escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)
        let studentsList = [];
        for (let i = 0; i < req.body.studentsrate.length; i++){
            let studentInClass = {"student": req.body.studentsid[i] , "rate": req.body.studentsrate[i], "period":req.body.studentsperiod[i], "paid":false}
            studentsList.push(studentInClass)
        }
        console.log(req.body.classtype)
        const newClass = new Classes({
            type: req.body.classtype,
            students:studentsList,
            date:req.body.date,
            addedtoInvoice: false,
            fullypaid: false
        })
        console.log(newClass)
        if (!errors.isEmpty){
            let marked_students = []
            for (const student of req.body.studentsid){
                let studentinstance = await Students.findById(student).exec()
                marked_students.push(studentinstance)
            }
            const all_classtypes = await Classtype.find().exec()
            for (const classtype of all_classtypes) {
                if (req.body.classtypes.includes(classtype._id)) {
                    classtype.checked = true;
                }
            }
            res.render("insert_class",  {marked_students: marked_students, classtypes:all_classtypes, rate: req.body.studentsrate, period: req.body.studentsperiod})
            }
        else{
            await newClass.save()
            res.redirect(newClass.url)
        }
    }),
]

    