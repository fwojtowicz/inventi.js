var nodemailer = require('nodemailer')
const { google } = require('googleapis')
var xoauth2 = require('xoauth2')

var auth = {
  type: 'oauth2',
  user: 'librarysavermailer@gmail.com',
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  accessToken: process.env.GOOGLE_ACCESS_TOKEN
}

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'librarysavermailer@gmail.com',
//     pass: process.env.MAILER_PASSWORD
//   }
// })

// var mailOptions = {
//   from: 'librarysavermailer@gmail.com',
//   to: 'fil.wojtowicz@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// }

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//
//   } else {
//
//   }
// })

exports.sendReminder = (req, res) => {
  response = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  }

  var mailOptions = {
    from: req.body.owner_name,
    to: req.body.target_mail,
    subject: 'A book misses ' + req.body.owner_name,
    text: req.body.message
  }
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: auth
  })
  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      return
    } else {
      res.send(JSON.stringify(res))
    }
  })
}

exports.sendLoanRequest = (req, res) => {
  response = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  }

  var mailOptions = {
    from: req.body.owner_name,
    to: req.body.target_mail,
    subject: req.body.owner_name + ' wants to borrow your book',
    text: req.body.message
  }
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: auth
  })
  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      return
    } else {
      res.send(JSON.stringify(res))
    }
  })
}
