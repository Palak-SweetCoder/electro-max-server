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
        const myItemsCollection = client
            .db('electroMax')
            .collection('my-items');

        // API TO: Get or Read all data from the from the items collection
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

        // API TO: Post new user from the client side to items collection
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            console.log('new user come from client side', newItem);
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        });

        // API TO: Post new user from the client side to my-items collection
        app.post('/my-items', async (req, res) => {
            const newItem = req.body;
            console.log('new user come from client side', newItem);
            const result = await myItemsCollection.insertOne(newItem);
            res.send(result);
        });

        // API TO: get or read all data from the my-items collection
        app.get('/my-items', async (req, res) => {
            const query = {};
            const cursor = myItemsCollection.find(query);
            const myItems = await cursor.toArray();
            res.send(myItems);
        });

        //API TO: Delete item from all my-items
        app.delete('/my-items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myItemsCollection.deleteOne(query);
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
