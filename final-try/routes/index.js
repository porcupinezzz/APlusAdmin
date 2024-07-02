var express = require('express');
var router = express.Router();

const invoicesController = require("../controllers/invoicesController")
const classesController = require("../controllers/classesController")
const classTypeController = require("../controllers/classTypeController")
const studentsController = require("../controllers/studentsController")

/* GET home page. */
router.get('/', invoicesController.outstanding_invoices);

//related to students- creating, amending, viewing
router.get("/student/createnew", studentsController.create_student_get)

router.post("/student/createnew", studentsController.create_student_post)

router.get("/student/:id", studentsController.student_detail)

//related to classes- creating, amending, viewing
router.get("/classes/createnew", classesController.create_class_get)

router.post("/classes/createnew", classesController.create_class_post)

router.post("/classes/insert", classesController.insert_class_post)

router.get("/classes/:id", classesController.class_detail)

//related to classtypes- creating, amending, viewing
router.get("/classtype/createnew", classTypeController.create_classtype_get)

router.post("/classtype/createnew", classTypeController.create_classtype_post)

router.get("/classtype/:id", classTypeController.classtype_detail)

//related to invoices- creating, amending, viewing
router.get("/invoice/createnew", invoicesController.create_invoice_get)

router.post("/invoice/createnew", invoicesController.create_invoice_post)

router.get("/invoice/:id", invoicesController.invoice_detail)

module.exports = router;
