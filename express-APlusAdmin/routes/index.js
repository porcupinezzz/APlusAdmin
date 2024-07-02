var express = require('express');
var router = express.Router();

let studentEntries = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'A Plus Attendance' });
});

router.get('/mark', function(req, res, next) {
  res.render('mark', {includeTable : false});
});

/*work on validating input later*/
router.post('/mark', function(req, res, next) {
  const fields = req.body;
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified.")
  studentEntries.push({"name": fields.name, "type": fields.type, "rate": fields.rate, "period": fields.period, "date":fields.date });
  console.log(studentEntries);
  res.render('mark', {classRefill: fields.type, rateRefill: fields.rate, periodRefill:fields.period, dateRefill:fields.date, entries: studentEntries, includeTable: true});
});

router.get('/view', function(req, res, next) {
  res.render('view');
});

/* work on continually adding entries*/
router.post('/view', function(req, res, next) {
  let attendanceRecords = studentEntries.filter(()=>true);
  let fields = req.body;
  Object.entries(fields).forEach((key) =>{
    if (key[1] != "" && key[1] != "-"){
      attendanceRecords = attendanceRecords.filter(hunchback => hunchback[key[0]]==key[1])
    }
  })
  res.render('view', {includeTable:true, attendanceRecords: attendanceRecords});
});

router.get('/amend', function(req, res, next) {
  res.render('amend');
});

router.post('/amend', function(req, res, next) {
  let attendanceRecords = studentEntries.filter(()=>true);
  let fields = req.body;
  Object.entries(fields).forEach((key) =>{
    if (key[1] != "" && key[1] != "-"){
      attendanceRecords = attendanceRecords.filter(hunchback => hunchback[key[0]]==key[1])
    }
  })
  res.render('amend',{includeTable:true, attendanceRecords: attendanceRecords});
});

router.get('/gen', function(req, res, next) {
  res.render('gen');
});

router.get('/update', function(req, res, next) {
  res.render('update');
});


module.exports = router;
