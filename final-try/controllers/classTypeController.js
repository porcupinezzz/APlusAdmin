const Students = require("../models/students")
const Classes = require("../models/classes")
const Classtype = require("../models/classtype")
const Invoices = require("../models/invoices")

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.classtype_detail = asyncHandler(async(req,res,next) => {
    const classtype = await Classtype.find({_id: req.params.id}).populate("classes").exec()
    console.log(classtype, classtype.name, "name")
    if (classtype) {
        console.log("should render")
        res.render("classtype_detail", {classtype:classtype, exists:true})
    }
    else{
        res.render("classtype_detail", {attemptedClassType:req.params.id ,exists:false})
    }
})

exports.create_classtype_get = asyncHandler(async(req,res,next) => {
    res.render("create_classtype")
})

exports.create_classtype_post = [
    body("classtype")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified."),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req)
        const classtype = new Classtype({
            typename: req.body.classtype,
            classes: []
        })
        if (!errors.isEmpty){
            res.render("create_classtype", {errors:errors.array()})
        }
        else{
            const attemptFind = await Classtype.find({type: classtype.type}).exec()
            console.log(attemptFind)
            if (attemptFind.length == 0){
                await classtype.save()
                res.redirect(classtype.url)
            }
            else{
                res.render("create_classtype", {errors: ["classtype already exists"]})
            }
            
        }
    }),
]

