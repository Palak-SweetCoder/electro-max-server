const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.DB_PASS}@cluster0.wsix71s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        // console.log('db connected successfully!!!');
        const itemsCollection = client.db('electroMax').collection('items');

        // API TO: Get or Read all data from the database
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        // API TO: Get or Read specific data by id from the database
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            // No need to declare cursor here. Because we're finding only one item
            const item = await itemsCollection.findOne(query);
            res.send(item);
        });

        // API TO: Update quantity
        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateQuantity = req.body;
            const options = { upsert: true };
            const updatedDoc = {
                $set: { quantity: updateQuantity.quantity },
            };
            const result = await itemsCollection.updateOne(
                query,
                updatedDoc,
                options
            );
            res.send(result);
        });

        //API TO: Delete item from all items
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
        // client.close();
    }
}
run().catch(console.dir);

// root
app.get('/', (req, res) => {
    res.send('electro max server is running');
});

app.listen(port, () => {
    console.log('electro max server running cmd', port);
});
