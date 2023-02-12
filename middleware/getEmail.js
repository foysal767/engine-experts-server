const nodemailer = require("nodemailer")
require("dotenv").config()

const getEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
  })

  await transporter.sendMail({
    from: req.body.email,
    to: process.env.SENDER_EMAIL,
    subject: "Thanks For Giving Feedback To Engine Expert Services",
    html: `
            <h1>${req.body.name}</h1>
            <h4>Email: ${req.body.email}</h4>
            <h4>Phone : ${req.body.phone}</h4>
            <h4>Customer Message:</h4>
            <p>${req.body.message}</p>
            `,
  })
  res.send({ message: "message sent succesfully" })
}

module.exports = getEmail
