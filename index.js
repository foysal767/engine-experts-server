const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


//Middlware
app.use(express.json())
app.use(cors())





app.get('/', async (req, res) => {
    res.send('engineExperts portal server is running')
})

app.listen(port, () => {
    console.log(`engineExperts port running on ${port}`)
})


