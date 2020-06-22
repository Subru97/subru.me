const router = require('express').Router();
const nodemailer = require('nodemailer');
const nmHbs = require("nodemailer-express-handlebars");
const { check, validationResult } = require('express-validator');

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secureConnection: false, 
  port: 587,
  tls: {
    ciphers:'SSLv3'
  },
  auth: {
    user: "nandhuexpress1@gmail.com",
    pass: "Nandhu1997"
  }
});

transporter.use('compile', nmHbs({
  viewEngine: {
    extName: '.hbs',
    partialsDir: 'views',
    layoutsDir: 'views',
    defaultLayout: false
  },
  viewPath: 'views',
  extName: '.hbs'
}));

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', [
  check('name', 'Name should contain atleast 3 characters').isLength({ min: 3 }).trim().escape(),
  check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
  check('subject', 'Subject should contain atleast 3 characters').isLength({ min: 3 }).trim().escape(),
  check('message', 'Message should contain atleast 10 characters').isLength({ min: 10 }).trim().escape()
], (req, res) => {
  const mailOptions = {
    from: `nandhuexpress1@gmail.com`,
    to: 'subru1997@gmail.com',
    subject: `${req.body.name} has a contact request.`,
    template: 'contact-request',
    context: {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message
    }
  };
  console.log(req.body);
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var errorMessage = '';
    var errorList = errors.array();
    for(let index in errorList) {
      errorMessage = errorMessage + errorList[index].msg;
      if(index < errorList.length-1) {
        errorMessage = errorMessage + ', ';
      }
    }

    return res.render('index', {'message': errorMessage, 'flag': 'failure'});
  }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
          console.log(err);
          return res.render('index', {'message': 'Oops! Something went wrong.', 'flag': 'failure'});
        } else {
          return res.render('index', {'message': 'Message has been sent successfully!', 'flag': 'success'});
        }
    });

});


module.exports = router;