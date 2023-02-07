const nodemailer = require("nodemailer")
require("dotenv").config()

const confirmmail = async (req, res, next) => {
  try {
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
      from: process.env.SENDER_EMAIL,
      to: req.body.user,
      subject: `Payment for ${req.body.serviceName}`,
      html: `
          <h1>Thanks for your payment for ${req.body.serviceName}</h1>
          <h1>Price: ${req.body.price}</h1>
          <p>Engine expertise refers to a deep understanding of the design, operation, and maintenance of engines. Engines can be found in a variety of applications, including cars, airplanes, boats, and generators. An engine expert has a strong grasp of thermodynamics, fluid dynamics, and mechanics, and is able to apply this knowledge to optimize engine performance, efficiency, and reliability.</p>
          `
    })
    next()
  } catch (err) {
    console.log("confirmMail",err.message)
  }
}

module.exports = confirmmail
