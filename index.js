const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efiqtg7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
    const collection = client.db('test').collection('devices');
    console.log('electro max server connected with db successfully!!!');
    // perform actions on the collection object
    client.close();
});

// root
app.get('/', (req, res) => {
    res.send('electro max server is running');
});

app.listen(port, () => {
    console.log('electro max server running cmd', port);
});
