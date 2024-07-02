const Students = require("../models/students")
const Classes = require("../models/classes")
const Classtype = require("../models/classtype")
const Invoices = require("../models/invoices")

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.student_detail = asyncHandler(async(req,res,next) => {
    const student = await Students.findById(req.params.id).populate("classes_taken").populate("siblings").populate("bills").populate("outstanding").exec()
    if (student){
        res.render("student_detail", {student:student, exists:true})
    }
    else{
        res.render("student_detail", {attemptedID:req.params.id ,exists:false})
    }
})

exports.create_student_get = asyncHandler(async(req,res,next) => {
    const current_students = await Students.find({current:true}).exec();
    console.log(current_students)
    res.render("create_student", {current_students: current_students})
})

exports.create_student_post = [
    (req, res, next) => {
        if (!Array.isArray(req.body.siblings)) {
            req.body.siblings =
                typeof req.body.siblings === "undefined" ? [] : [req.body.siblings];
        }
        next();
    },
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified."),
    body("last_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Last name must be specified."),
    body("grade")
        .trim()
        .isInt({min:1,max:12})
        .escape()
        .withMessage("Grade must be a number between 1 and 12"),
    body("siblings,*").escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)
        const student = new Students({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            grade: req.body.grade,
            classes_taken: [],
            siblings: req.body.siblings,
            first_joined: new Date(),
            last_updated: new Date(),
            bills:[],
            outstanding:[],
            current: true,
        })
        console.log(student)
        if (!errors.isEmpty){
            const current_students = await Students.find({current:true}).exec()
            for (const sibling of current_students) {
                if (student.siblings.includes(sibling._id)) {
                  sibling.checked = "true";
                }
              }
            res.render("create_student", {current_students: current_students, student: student, errors:errors.array()})
        }
        else{
            await student.save()
            const newStudentId = student._id
            for (const sibling of student.siblings) {
                await Students.findOneAndUpdate({_id:sibling}, {$push: {"siblings": newStudentId}}).exec()
            }
            res.redirect(student.url)
        }
    }),
]

    