const nodemailer = require("nodemailer")
require("dotenv").config()

const sendBookingEmail = async (req, res, next) => {
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
      to: req.body.userEmail,
      subject: `Thank you, your service has been confirmed: ${req.body.serviceName}`,
      html: `
          <h1>Thanks For Book: ${req.body.serviceName} Services</h1>
          <p>Engine expertise refers to a deep understanding of the design, operation, and maintenance of engines. Engines can be found in a variety of applications, including cars, airplanes, boats, and generators. An engine expert has a strong grasp of thermodynamics, fluid dynamics, and mechanics, and is able to apply this knowledge to optimize engine performance, efficiency, and reliability.

          To become an engine expert, one must have a solid education in mechanical engineering or a related field, and typically requires several years of experience working with engines in various capacities. The expertise of an engine professional includes the ability to diagnose problems, design modifications to improve performance, and conduct routine maintenance to ensure the engine is running smoothly.</p> </br>
          <img src="https://ibb.co/kgQKnsD"/>
          `,
    })
    next()
  } catch (err) {
    console.log(err)
  }
}

module.exports = sendBookingEmail
