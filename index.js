const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


//Middlware
app.use(express.json())
app.use(cors())

// connect mongodb 

const uri = "mongodb+srv://Engine-Experts:tOh0xpWQt88VUSg2@cluster0.zkuborh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



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

        // verify jwt middleware
        function verifyJWT(req, res, next) {
        const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).send('unauthorized access');
            };
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(403).send({ message: 'forbidden access' })
            }
            req.decoded = decoded;
            next();
        })
        };


        // check admin middleware
        async function isAdmin(req, res, next){
            const decodedEmail = decoded.email;
            // const result = await adminCollection.find({}).project({email:1}).toArray();
            const result = await adminCollection.find({}).toArray();
            const email = result.email;
            if (decodedEmail !== email){
                return res.status(403).send({message: 'forbidden access'})
            }
            next();
        }


        // send jet token for user
        // jwt secret key (26ef39810f0859796841b50cf35ed9281363238c26b58240ec4182a1a290119a9e0975af60dca9cd3a8f31042f59eb5a7b58247ee69294ab54d25c58c2b0c25f)

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



    } catch (error) {
        console.log(error.name, error.message)
    }
}
run();



app.get('/', async (req, res) => {
    res.send('engineExperts portal server is running')
})

app.listen(port, () => {
    console.log(`engineExperts port running on ${port}`)
})


