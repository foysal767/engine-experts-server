const express = require("express");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  CURSOR_FLAGS,
  ObjectId,
} = require("mongodb");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//Middlware
app.use(express.json());
app.use(cors());

// connect mongodb

const uri =
  "mongodb+srv://Engine-Experts:tOh0xpWQt88VUSg2@cluster0.zkuborh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

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
      .collection("allservices");
    const campaignCollection = client
      .db("Engine-Experts")
      .collection("campaign");
    const userCollection = client.db("Engine-Experts").collection("users");
    const adminCollection = client.db("Engine-Experts").collection("admins");
    const reviewCollection = client.db("Engine-Experts").collection("reviews");
    const ordersCollection = client.db("Engine-Experts").collection("orders");
    const paymentsCollection = client
      .db("Engine-Experts")
      .collection("payments");

<<<<<<< HEAD
async function run(){
    try {
        //all collections
        const serviceCollection = client.db('Engine-Experts').collection('allservices');
        const campaignCollection = client.db('Engine-Experts').collection('campaign');
        const userCollection = client.db('Engine-Experts').collection('users');
        const adminCollection = client.db('Engine-Experts').collection('admins');
        const reviewCollection = client.db('Engine-Experts').collection('reviews');
        const ordersCollection = client.db('Engine-Experts').collection('orders');
        const paymentsCollection = client.db('Engine-Experts').collection('payments');
=======
    // verify jwt middleware
    function verifyJWT(req, res, next) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send("unauthorized access");
      }
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
          return res.status(403).send({ message: "forbidden access" });
        }
        req.decoded = decoded;
        next();
      });
    }

    // check admin middleware
    async function isAdmin(req, res, next) {
      const decodedEmail = decoded.email;
      // const result = await adminCollection.find({}).project({email:1}).toArray();
      const result = await adminCollection.find({}).toArray();
      const email = result.email;
      if (decodedEmail !== email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    }
>>>>>>> fa798e7802ab568b0619233142b9d9525bc7550f

    // send jet token for user
    // jwt secret key (26ef39810f0859796841b50cf35ed9281363238c26b58240ec4182a1a290119a9e0975af60dca9cd3a8f31042f59eb5a7b58247ee69294ab54d25c58c2b0c25f)

    // require('crypto').randomBytes(64).toString('hex')

    app.post("/jwt", (req, res) => {
      try {
        const user = req.body;
        const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: "12h",
        });
        res.send({
          token,
          success: true,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.post("/addservice", async (req, res) => {
      try {
        const data = req.body;
        const result = await serviceCollection.insertOne(data);
        res.send({
          success: true,
          data: result,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/services", async (req, res) => {
      try {
        const result = await serviceCollection.find({}).toArray();
        res.send({
          success: true,
          data: result,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/service", async (req, res) => {
      try {
        const name = req.query.id;
        const result = await serviceCollection.findOne({ name: name });
        res.send({
          success: true,
          data: result,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.patch("/campaign", async (req, res) => {
      try {
        const data = req.body;
        const campaign = {
          campaignName: data.campname,
          services: [],
        };

        const findCamp = await campaignCollection.findOne({
          campaignName: data.campname,
        });

        if (findCamp) {
          const filterService = await serviceCollection.findOne({
            name: service,
          });

          const updatedService = {
            ...filterService,
            discountPrice: discountprice,
          };

          findCamp.services.push(updatedService);
          const filter = { campaignName: data.campname };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              services: findCamp.services,
            },
          };

          const result = await campaignCollection.updateOne(
            filter,
            updateDoc,
            options
          );

          console.log(result);
          res.send({
            success: true,
            data: result,
          });
        }
<<<<<<< HEAD


        // send jet token for user


        // require('crypto').randomBytes(64).toString('hex')

        app.post('/jwt', (req, res) =>{
            try {
                const user = req.body;
                const token = jwt.sign(user,process.env.JWT_SECRET,{expiresIn:'12h'});
                res.send({
                    token,
                    success: true
                });
            } catch (error) {
               res.send({
                 success: false,
                 message: error.message
               })
            }
        });


        app.post('/users', async (req, res) => {
            try {
                const user = req.body;
                console.log(user)
                const result = await userCollection.insertOne(user);
                res.send({
                    success:true,
                    data: result
                })
            } catch (error) {
                res.send({
                    success: false,
                    message:error.message
                })
            }
        })

        app.post('/addservice', async(req,res)=>{
            try {
                const data = req.body;
                const result = await serviceCollection.insertOne(data);
                res.send({
                    success: true,
                    data: result
                })
            } catch (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
=======
        const addedCampaign = await campaignCollection.insertOne(campaign);
        const filterService = await serviceCollection.findOne({
          name: service,
        });
        const updatedService = {
          ...filterService,
          discountPrice: discountprice,
        };
        findCamp.services.push(updatedService);
        const filter = { campaignName: data.campname };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            services: findCamp.services,
          },
        };
        const result = await campaignCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        console.log(result);
        res.send({
          success: true,
          data: result,
>>>>>>> fa798e7802ab568b0619233142b9d9525bc7550f
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/popular", async (req, res) => {
      try {
        const result = await serviceCollection
          .find({})
          .sort({ Totalreviews: -1 })
          .limit(4)
          .toArray();
        res.send({
          success: true,
          data: result,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/servicedetails", async (req, res) => {
      try {
        const name = req.query.id;
        const query = { name: name };
        const result = await serviceCollection.findOne(query);
        res.send({
          success: true,
          data: result,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.patch("/servicedetails", async (req, res) => {
      try {
        const id = req.query.id;
        const data = req.body;
        const searchobj = await serviceCollection.findOne({
          _id: ObjectId(id),
        });
        searchobj.reviews.push(data);
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            reviews: searchobj.reviews,
            Totalreviews: searchobj.Totalreviews + 1,
          },
        };
        const updateobj = await serviceCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send({
          success: true,
          data: updateobj,
        });
      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/reviews", async (req, res) => {
      try {
        const result = await serviceCollection
          .find({})
          .project({ reviews: 1, _id: 0 })
          .toArray();
        const allReviews = [];
        result.forEach((data) => {
          const singleReview = data.reviews;
          singleReview.map((review) => allReviews.push(review));
        });
        const filter = allReviews.filter(
          (excellent) => excellent.rating === "Excellent"
        );

        res.send({
          success: true,
          data: filter,
        });
      } catch (error) {
        res,
          send({
            success: false,
            message: error.message,
          });
      }
    });
  } catch (error) {
    console.log(error.name, error.message);
  }
}
run();

app.get("/", async (req, res) => {
  res.send("engineExperts portal server is running");
});

app.listen(port, () => {
  console.log(`engineExperts port running on ${port}`);
});
