const express = require("express")
const cors = require("cors")
const {
  MongoClient,
  ServerApiVersion,
  CURSOR_FLAGS,
  ObjectId,
} = require("mongodb")
const jwt = require("jsonwebtoken")
const app = express()
const port = process.env.PORT || 5000
const nodemailer = require("nodemailer")
const mg = require("nodemailer-mailgun-transport")
require("dotenv").config()

// stripe key hriday
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
// console.log(stripe);

//Middlware
app.use(express.json())
app.use(cors())

// connect mongodb

const uri =
  "mongodb+srv://Engine-Experts:tOh0xpWQt88VUSg2@cluster0.zkuborh.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

// nazrul start code-----------------------------
function sendBookingEmail(data) {
  console.log(data)
  const { userEmail, location, serviceName, price, payment, date } = data

  const auth = {
    auth: {
      api_key: process.env.EMAIL_SEND_KEY,
      domain: process.env.EMAIL_SEND_DOMAIN,
    },
  }

  const transporter = nodemailer.createTransport(mg(auth))

  transporter.sendMail(
    {
      from: "engineexperties@gmail.com", // verified sender email
      to: userEmail, // recipient email
      subject: `Your Service  ${serviceName} is Confirmed on ${date}`, // Subject line
      text: "Welcome to Engine Expertise", // plain text body
      html: `
      <h3>Your Service price: ${price} (${payment})</h3>
      <div>
        <p>Your Order Location is lat: ${location.lat} long: ${location.long} Area</p>
        <p>Thanks From Engine Experts</p>
      </div>
      `,
    },

    function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("Email sent: " + info.response)
      }
    }
  )
}

// nazrul islam end the code

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
  try {
    //all collections
    const serviceCollection = client
      .db("Engine-Experts")
      .collection("allservices")
    const campaignCollection = client
      .db("Engine-Experts")
      .collection("campaign")
    const userCollection = client.db("Engine-Experts").collection("users")
    const adminCollection = client.db("Engine-Experts").collection("admins")
    const reviewCollection = client.db("Engine-Experts").collection("reviews")
    const bookingCollection = client.db("Engine-Experts").collection("bookings")
    const paymentsCollection = client
      .db("Engine-Experts")
      .collection("payments")
    const locationCollection = client
      .db("Engine-Experts")
      .collection("locations")

    // verify jwt middleware
    function verifyJWT(req, res, next) {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        return res.status(401).send("unauthorized access")
      }
      const token = authHeader.split(" ")[1]
      jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
          return res.status(403).send({ message: "forbidden access" })
        }
        req.decoded = decoded
        next()
      })
    }

    // check admin middleware
    async function isAdmin(req, res, next) {
      const decodedEmail = decoded.email
      // const result = await adminCollection.find({}).project({email:1}).toArray();
      const result = await adminCollection.find({}).toArray()
      const email = result.email
      if (decodedEmail !== email) {
        return res.status(403).send({ message: "forbidden access" })
      }
      next()
    }

    // send jet token for user
    // jwt secret key (26ef39810f0859796841b50cf35ed9281363238c26b58240ec4182a1a290119a9e0975af60dca9cd3a8f31042f59eb5a7b58247ee69294ab54d25c58c2b0c25f)

    // require('crypto').randomBytes(64).toString('hex')

    app.post("/jwt", (req, res) => {
      try {
        const user = req.body
        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: "12h",
        })
        res.send({
          token,
          success: true,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    });

    app.get("/admin", async (req, res) => {
      try {
        const email = req.query.email
        const result = await adminCollection.findOne({ email: email })
        if (result) {
          res.send({
            success: true,
          })
          return
        }
        res.send({
          success: false,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.get("/accType", async (req, res) => {
      try {
        const email = req.query.email
        const result = await adminCollection.findOne({ email: email })
        if (result) {
          res.send({
            success: true,
          })
          return
        }
        res.send({
          success: true,
          data: result.accType,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const user = req.body
        const result = await userCollection.insertOne(user)
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.get("/users", async (req, res) => {
      try {
        const type = req.query.type
        const result = await userCollection.find({ accType: type }).toArray()
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.post("/addservice", async (req, res) => {
      try {
        const data = req.body
        const result = await serviceCollection.insertOne(data)
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.get("/services", async (req, res) => {
      try {
        const result = await serviceCollection.find({}).toArray()
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.delete("/services/:id", async (req, res) => {
      try {
        const id = req.params.id
        const result = await serviceCollection.deleteOne({ _id: ObjectId(id) })
        res.send({
          success: true,
          message: "Deleted Successfully",
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.get("/service", async (req, res) => {
      try {
        const name = req.query.id
        const result = await serviceCollection.findOne({ name: name })
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.patch("/campaign", async (req, res) => {
      try {
        const data = req.body
        const campaign = {
          campaignName: data.campname,
          services: [],
        }

        const findCamp = await campaignCollection.findOne({
          campaignName: data.campname,
        })

        if (findCamp) {
          const duplicate = findCamp.services.find(
            service => service.name === data.service
          )
          if (duplicate) {
            res.send({
              success: false,
              message: "This product is already added",
            })
            return
          }
          const filterService = await serviceCollection.findOne({
            name: data.service,
          })
          const updatedService = {
            ...filterService,
            discountPrice: data.discountprice,
          }
          findCamp.services.push(updatedService)
          const filter = { campaignName: data.campname }
          const options = { upsert: true }
          const updateDoc = {
            $set: {
              services: findCamp.services,
            },
          }

          const result = await campaignCollection.updateOne(
            filter,
            updateDoc,
            options
          )
          res.send({
            success: true,
            data: result,
          })
          return
        }
        const addedCampaign = await campaignCollection.insertOne(campaign)
        const findnewCamp = await campaignCollection.findOne({
          campaignName: data.campname,
        })
        const filterService = await serviceCollection.findOne({
          name: data.service,
        })

        const updatedService = {
          ...filterService,
          discountPrice: data.discountprice,
        }
        findnewCamp.services.push(updatedService)
        const filter = { campaignName: data.campname }
        const options = { upsert: true }
        const updateDoc = {
          $set: {
            services: findnewCamp.services,
          },
        }
        const result = await campaignCollection.updateOne(
          filter,
          updateDoc,
          options
        )
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.get("/campaign", async (req, res) => {
      try {
        const result = await campaignCollection.find({}).toArray()
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.get("/popular", async (req, res) => {
      try {
        const result = await serviceCollection
          .find({})
          .sort({ Totalreviews: -1 })
          .limit(4)
          .toArray()
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.get("/servicedetails", async (req, res) => {
      try {
        const name = req.query.id
        const query = { name: name }
        const result = await serviceCollection.findOne(query)
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.patch("/servicedetails", async (req, res) => {
      try {
        const id = req.query.id
        const data = req.body
        const searchobj = await serviceCollection.findOne({
          _id: ObjectId(id),
        })
        searchobj.reviews.push(data)
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true }
        const updateDoc = {
          $set: {
            reviews: searchobj.reviews,
            Totalreviews: searchobj.Totalreviews + 1,
          },
        }
        const updateobj = await serviceCollection.updateOne(
          filter,
          updateDoc,
          options
        )
        res.send({
          success: true,
          data: updateobj,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    // payments-intregrate hriday===========================
    // =====================================================

    app.post("/create-payment-intent", async (req, res) => {
      // const booking = req.body;
      // const price = booking.price;
      // const amount = price * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: 10000,
        // email:'hridayhalder91@gmail.com',
        payment_method_types: ["card"],
      })
      res.send({
        clientSecret: paymentIntent.client_secret,
      })
    })

    app.post("/payments", async (req, res) => {
      const payment = req.body
      const result = await paymentsCollection.insertOne(payment)
      const id = payment.bookingId
      const filter = { _id: ObjectId(id) }
      const updatedDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      }
      const updatedResult = await bookingsCollection.updateOne(
        filter,
        updatedDoc
      )
      res.send(result)
    })

    // ==========================================>payments integrate by hriday

    app.get("/reviews", async (req, res) => {
      try {
        const result = await serviceCollection
          .find({})
          .project({ reviews: 1, _id: 0 })
          .toArray()
        const allReviews = []
        result.forEach(data => {
          const singleReview = data.reviews
          singleReview.map(review => allReviews.push(review))
        })
        const filter = allReviews.filter(
          excellent => excellent.rating === "Excellent"
        )

        res.send({
          success: true,
          data: filter,
        })
      } catch (error) {
        res,
          send({
            success: false,
            message: error.message,
          })
      }
    })

    app.get("/userReviews/:id", async (req, res) => {
      try {
        const email = req.params.id
        console.log(email)
        const result = await serviceCollection
          .find({})
          .project({ reviews: 1, _id: 0, name: 1, image: 1 })
          .toArray()
        const allReviews = []
        result.forEach(data => {
          const { name, image, reviews } = data
          reviews?.map(review => {
            const singleData = { name, image, review }
            allReviews.push(singleData)
          })
        })
        const filter = allReviews.filter(
          excellent => excellent.review.email === email
        )
        res.send({
          success: true,
          data: filter,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    });

    app.post("/bookings", async (req, res) => {
      try {
        const data = req.body
        const locations = {
          role: "user",
          email: data.userEmail,
          image: data.userImage,
          location: data.location,
        }
        const serchLocation = await locationCollection.findOne({
          email: data.userEmail,
        })
        if (!serchLocation) {
          await locationCollection.insertOne(locations)
        }
        const findData = await bookingCollection
          .find({ userEmail: data.userEmail })
          .toArray()
        const duplicateCheck = findData.filter(
          service =>
            service.serviceName === data.serviceName &&
            service.date === data.date
        )
        if (!duplicateCheck.length <= 0) {
          res.send({
            success: false,
            message: "Already added this service in this date",
          })
          return
        }
        const result = await bookingCollection.insertOne(data)

        res.send({
          success: true,
          data: result,
          message: "successfully Booked service",
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.get("/bookings", async (req, res) => {
      try {
        const result = await bookingCollection.find({}).toArray()
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    })

    app.get("/locations", async (req, res) => {
      try {
        const result = await locationCollection.find({}).toArray()
        res.send({
          success: true,
          data: result,
        })
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        })
      }
    });
  } catch (error) {
    console.log(error.name, error.message)
  }
}
run()

app.get("/", async (req, res) => {
  res.send("engineExperts portal server is running")
})

app.listen(port, () => {
  console.log(`engineExperts port running on ${port}`)
})
